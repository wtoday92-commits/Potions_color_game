/* coop-net.js — сетевой слой кооператива (Фаза 12).
 *
 * Изолирует Firebase Realtime Database от остальной игры: весь остальной код
 * работает ТОЛЬКО через window.Coop (createRoom/joinRoom/set/on/leaveRoom/...).
 * Если однажды сменим бэкенд — правим ТОЛЬКО этот файл, game.js не трогаем.
 *
 * Firebase web-apiKey не секрет (это идентификатор проекта, доступ ограничен
 * правилами БД), поэтому он лежит прямо здесь — так и задумано.
 *
 * SDK подключается через CDN (firebase-app-compat + firebase-database-compat)
 * в index.html ПЕРЕД этим файлом. Если SDK не загрузился (офлайн/CSP) —
 * Coop.available === false, а остальная игра работает как обычно.
 */
(function(){
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyCSr_10VLdrgl_hgUzOD9UnvTlq0xc9kw0",
    authDomain: "potion-coop.firebaseapp.com",
    databaseURL: "https://potion-coop-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "potion-coop",
    storageBucket: "potion-coop.firebasestorage.app",
    messagingSenderId: "774349952074",
    appId: "1:774349952074:web:b7b775095baf19258542b3"
  };

  // ---------- инициализация SDK ----------
  let db = null, available = false;
  try {
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
      firebase.initializeApp(firebaseConfig);
      db = firebase.database();
      available = true;
    } else {
      console.warn('[Coop] Firebase SDK не загружен — кооп недоступен.');
    }
  } catch (e) {
    console.warn('[Coop] Ошибка инициализации Firebase:', e);
  }

  // ---------- состояние текущей сессии ----------
  let roomCode = null;   // код активной комнаты
  let roomRef  = null;   // ссылка на /rooms/<code>
  let role     = null;   // 'host' | 'guest'
  const subs   = [];     // активные подписки {ref, handler} для отписки

  // Код комнаты: 4 символа из «читаемого» алфавита (без похожих 0/O, 1/I).
  const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function makeCode(len){
    let s = '';
    for (let i = 0; i < (len || 4); i++)
      s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    return s;
  }

  function requireRoom(){
    if (!roomRef) throw new Error('[Coop] Нет активной комнаты');
    return roomRef;
  }

  // presence + onDisconnect: игрок пишет /rooms/<code>/presence/<role> и вешает
  // onDisconnect().remove(), который снесёт узел при разрыве связи (закрыл
  // вкладку, пропал интернет). Вторая сторона следит за этим узлом — это и есть
  // детект «игрок вышел» (см. onPeerPresence).
  function markPresence(){
    if (!roomRef || !role) return;
    const pref = roomRef.child('presence/' + role);
    pref.onDisconnect().remove();
    pref.set(firebase.database.ServerValue.TIMESTAMP);
  }

  const Coop = {
    get available(){ return available; },
    get roomCode(){ return roomCode; },
    get role(){ return role; },
    get isHost(){ return role === 'host'; },
    get inRoom(){ return !!roomRef; },

    /* Создать комнату. Возвращает Promise<code>. Хост попадает в лобби. */
    async createRoom(){
      if (!available) throw new Error('FIREBASE_UNAVAILABLE');
      for (let attempt = 0; attempt < 8; attempt++){
        const code = makeCode(4);
        const ref = db.ref('rooms/' + code);
        const snap = await ref.get();
        if (snap.exists()) continue;                 // код занят — пробуем другой
        await ref.set({
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          status: 'lobby'
        });
        roomCode = code; roomRef = ref; role = 'host';
        markPresence();
        return code;
      }
      throw new Error('CODE_ALLOC_FAILED');
    },

    /* Присоединиться к комнате по коду. Promise<code>; throw при ошибке
       (ROOM_NOT_FOUND / ROOM_BUSY / ROOM_FULL / EMPTY_CODE). */
    async joinRoom(code){
      if (!available) throw new Error('FIREBASE_UNAVAILABLE');
      code = String(code || '').trim().toUpperCase();
      if (!code) throw new Error('EMPTY_CODE');
      const ref = db.ref('rooms/' + code);
      const snap = await ref.get();
      if (!snap.exists()) throw new Error('ROOM_NOT_FOUND');
      const data = snap.val() || {};
      if (data.status && data.status !== 'lobby') throw new Error('ROOM_BUSY');
      const gpres = await ref.child('presence/guest').get();
      if (gpres.exists()) throw new Error('ROOM_FULL');
      roomCode = code; roomRef = ref; role = 'guest';
      markPresence();
      return code;
    },

    /* Запись в комнату по относительному пути. */
    set(path, value){ return requireRoom().child(path).set(value); },
    /* Мульти-обновление от корня комнаты ({'a/b':1, 'c':2}). */
    update(obj){ return requireRoom().update(obj); },
    /* Мульти-обновление от поддерева. */
    updateAt(path, obj){ return requireRoom().child(path).update(obj); },
    /* Разовое чтение значения. Возвращает Promise<value>. */
    async get(path){ const s = await requireRoom().child(path).get(); return s.val(); },

    /* Подписка на изменение значения по пути. cb(value). Возвращает off(). */
    on(path, cb){
      const ref = requireRoom().child(path);
      const handler = ref.on('value', snap => cb(snap.val()));
      subs.push({ ref, handler });
      return () => { ref.off('value', handler); };
    },

    /* Подписка на присутствие ВТОРОЙ стороны. cb(present:boolean). */
    onPeerPresence(cb){
      const other = role === 'host' ? 'guest' : 'host';
      return this.on('presence/' + other, v => cb(!!v));
    },

    /* Выход: снять presence, отписаться. Хост дополнительно сносит комнату. */
    async leaveRoom(){
      try {
        subs.forEach(s => s.ref.off('value', s.handler));
        subs.length = 0;
        if (roomRef && role){
          await roomRef.child('presence/' + role).remove().catch(()=>{});
          if (role === 'host'){
            await roomRef.remove().catch(()=>{});   // гость увидит пропажу presence
          }
        }
      } finally {
        roomCode = null; roomRef = null; role = null;
      }
    }
  };

  window.Coop = Coop;
})();
