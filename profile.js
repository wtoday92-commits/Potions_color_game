/* ============================================================
   ЗЕЛЬЕВАРНЯ — profile.js
   ФАЗА F: ФУНДАМЕНТ ПРОФИЛЯ ИГРОКА.

   Этот файл НЕ рисует никакого UI (коллекция/ачивки/репутация
   появятся в Фазах G/H/I/J) — он только:
     1) заводит один постоянный профиль игрока в localStorage;
     2) на каждый результат заказа и на каждый цикл тихо копит
        статистику, стрики, ленту идеалов и заготовки под
        ачивки/лор/репутацию/пассивки;
     3) даёт простой API (window.PotionProfile), которым будущие
        фазы будут читать/писать данные, не трогая game.js заново.

   Подключать ДО game.js (см. index.html).

   СХЕМА ПРОФИЛЯ (version:1):
   {
     version, playerId, createdAt, lastSeenAt,
     stats: {
       totalDaysPlayed,      // 1 день = 1 выполненный заказ (см. roadmap: 10 дней = 10 заказов за цикл)
       cyclesCompleted,      // сколько полных 10-дневных циклов завершено
       totalScoreEarned,     // сумма всех положительных начислений очков за всю историю
       bestCycleScore,       // лучший результат цикла (то же число, что уходит в лидерборд)
       totalOrders,
       stickersLifetime: { perfect, good, bad }
     },
     streaks: {
       perfectCurrent, perfectBest,
       goodPlusCurrent, goodPlusBest,   // "good или лучше" подряд
       badCurrent, badBest              // "брак" подряд — для будущих ачивок вида "N какашек подряд"
     },
     perfectRibbon: { count, platinumCount },
       // count 0..19 — текущая лента идеальных (см. п.7 ТЗ); при 20-ой
       // сбрасывается в 0 и platinumCount++ (лента платиновых стикеров).
       // Точный УИ и потолок платиновой ленты — забота Фазы G.
     npcReputation: { [npcId]: { value, level } },
       // value растёт/падает от результатов с этим НПС, level появится
       // в Фазе J (нужны пороги повышения — там же).
     achievements: {
       general: { [achId]: { unlockedAt } },        // наполнит Фаза H
       npc: { [npcId]: { [achId]: tier(0-3) } }     // наполнит Фаза I (0=нет,1=бронза,2=серебро,3=золото)
     },
     lorePhrases:   { unlockedByNpc: { [npcId]: [phraseId, ...] } },   // Фаза I
     rewards:       { byNpc: { [npcId]: { background:false, bottleSkin:null } } }, // Фаза I
     passives:      { unlockedByNpc: { [npcId]: [passiveId, ...] }, active: [] }   // Фаза J
   }

   Динамические под-объекты (npcReputation[id], achievements.npc[id] и
   т.п.) заводятся лениво через ensureNpc() при первом обращении к
   конкретному НПС — не нужно заранее перечислять все 23.
   ============================================================ */

(function(){
  const PROFILE_KEY = 'potionshop_profile_v1';
  const SCHEMA_VERSION = 1;

  function uuid(){
    try{ if(window.crypto && crypto.randomUUID) return crypto.randomUUID(); }catch(e){}
    return 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function emptyProfile(){
    return {
      version: SCHEMA_VERSION,
      playerId: uuid(),
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
      stats: {
        totalDaysPlayed: 0,
        cyclesCompleted: 0,
        totalScoreEarned: 0,
        bestCycleScore: 0,
        totalOrders: 0,
        stickersLifetime: { perfect: 0, good: 0, bad: 0 }
      },
      streaks: {
        perfectCurrent: 0, perfectBest: 0,
        goodPlusCurrent: 0, goodPlusBest: 0,
        badCurrent: 0, badBest: 0
      },
      perfectRibbon: { count: 0, platinumCount: 0 },
      npcReputation: {},
      achievements: { general: {}, npc: {} },
      lorePhrases: { unlockedByNpc: {} },
      rewards: { byNpc: {} },
      passives: { unlockedByNpc: {}, active: [] }
    };
  }

  // сливает сохранённые данные поверх свежей заготовки схемы — так более
  // старый профиль (из версии до появления нового поля) само-дополнится
  // недостающими блоками, а лишнего/сломанного не потащит
  function deepMerge(base, saved){
    if(!saved || typeof saved !== 'object') return base;
    const out = Array.isArray(base) ? base.slice() : { ...base };
    Object.keys(base).forEach(k=>{
      if(saved[k] === undefined) return;
      if(base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && saved[k] && typeof saved[k] === 'object'){
        out[k] = deepMerge(base[k], saved[k]);
      } else {
        out[k] = saved[k];
      }
    });
    // динамические ключи, которых нет в пустой заготовке (npcReputation.drone и т.п.)
    Object.keys(saved).forEach(k=>{
      if(!(k in base)) out[k] = saved[k];
    });
    return out;
  }

  let profile = null;

  function load(){
    if(profile) return profile;
    try{
      const raw = localStorage.getItem(PROFILE_KEY);
      profile = raw ? deepMerge(emptyProfile(), JSON.parse(raw)) : emptyProfile();
    }catch(e){
      profile = emptyProfile();
    }
    profile.lastSeenAt = Date.now();
    return profile;
  }

  let saveTimer = null;
  function save(){
    clearTimeout(saveTimer);
    // дебаунс — во время активной игры полей меняется много подряд,
    // не пишем в localStorage на каждое микро-изменение
    saveTimer = setTimeout(()=>{
      try{ localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }catch(e){ /* квота/приватный режим — тихо игнорируем */ }
    }, 200);
  }
  // на всякий случай — если вкладку закрывают быстрее, чем сработает дебаунс
  window.addEventListener('beforeunload', ()=>{
    if(profile){ try{ localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }catch(e){} }
  });

  function ensureNpc(npcId){
    load();
    if(!npcId) return null;
    if(!profile.npcReputation[npcId]) profile.npcReputation[npcId] = { value: 0, level: 0 };
    if(!profile.achievements.npc[npcId]) profile.achievements.npc[npcId] = {};
    if(!profile.lorePhrases.unlockedByNpc[npcId]) profile.lorePhrases.unlockedByNpc[npcId] = [];
    if(!profile.rewards.byNpc[npcId]) profile.rewards.byNpc[npcId] = { background: false, bottleSkin: null };
    if(!profile.passives.unlockedByNpc[npcId]) profile.passives.unlockedByNpc[npcId] = [];
    return profile.npcReputation[npcId];
  }

  // ---------- публичный API ----------
  const PP = {
    // прямой доступ к живому объекту профиля — читать можно свободно,
    // но менять поля напрямую снаружи не стоит, лучше через методы ниже
    // (чтобы save() не забывался и логика стриков/ленты не разъезжалась)
    get data(){ return load(); },
    load,
    save,

    // вызывается из finalizeResult() в game.js после каждого заказа
    recordOrderResult({ npcId, perfect, good, delta }){
      load();
      const st = profile.stats;
      st.totalOrders++;
      if(delta > 0) st.totalScoreEarned += delta;
      if(perfect) st.stickersLifetime.perfect++;
      else if(good) st.stickersLifetime.good++;
      else st.stickersLifetime.bad++;

      const s = profile.streaks;
      if(perfect){ s.perfectCurrent++; s.perfectBest = Math.max(s.perfectBest, s.perfectCurrent); }
      else { s.perfectCurrent = 0; }
      if(good){
        s.goodPlusCurrent++; s.goodPlusBest = Math.max(s.goodPlusBest, s.goodPlusCurrent);
        s.badCurrent = 0;
      } else {
        s.badCurrent++; s.badBest = Math.max(s.badBest, s.badCurrent);
        s.goodPlusCurrent = 0;
      }

      if(perfect){
        const r = profile.perfectRibbon;
        r.count++;
        if(r.count >= 20){ r.count = 0; r.platinumCount++; }
      }

      // черновой баланс репутации — точные цифры и пороги уровней уточним
      // в Фазе J, когда будем проектировать пассивки; пока копим значение,
      // чтобы к моменту Фазы J уже была живая история, а не пустое поле
      if(npcId){
        const rep = ensureNpc(npcId);
        rep.value += good ? (perfect ? 3 : 1) : -2;
      }
      save();
    },

    // вызывается из nextBtn-обработчика — 1 раз на каждый завершённый день
    recordDayPlayed(){
      load();
      profile.stats.totalDaysPlayed++;
      save();
    },

    // вызывается из showWeekOverlay() — 1 раз на завершение цикла (10 дней)
    recordCycleEnd(finalScore){
      load();
      profile.stats.cyclesCompleted++;
      profile.stats.bestCycleScore = Math.max(profile.stats.bestCycleScore, finalScore || 0);
      save();
    },

    // ---------- заготовки под Фазы H/I/J (пока никто не вызывает) ----------
    unlockGeneralAchievement(achId){
      load();
      if(!profile.achievements.general[achId]) profile.achievements.general[achId] = { unlockedAt: Date.now() };
      save();
    },
    setNpcAchievementTier(npcId, achId, tier){
      load();
      ensureNpc(npcId);
      profile.achievements.npc[npcId][achId] = tier;
      save();
    },
    unlockLorePhrase(npcId, phraseId){
      load();
      ensureNpc(npcId);
      const arr = profile.lorePhrases.unlockedByNpc[npcId];
      if(!arr.includes(phraseId)) arr.push(phraseId);
      save();
    },
    adjustReputation(npcId, delta){
      load();
      const rep = ensureNpc(npcId);
      rep.value += delta;
      save();
      return rep;
    },
    unlockReward(npcId, key, value){
      load();
      ensureNpc(npcId);
      profile.rewards.byNpc[npcId][key] = value;
      save();
    }
  };

  window.PotionProfile = PP;
})();
