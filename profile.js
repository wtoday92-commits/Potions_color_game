/* ============================================================
   ЗЕЛЬЕВАРНЯ — profile.js
   ФАЗА F: ФУНДАМЕНТ ПРОФИЛЯ ИГРОКА.
   + ФАЗА I: пер-НПС статистика (ачивки неписей) и лорные фразы.
   + ФАЗА J: репутация (вес сложности, множитель от пассивок)
             и хранение активных пассивок.

   Этот файл НЕ рисует никакого UI — он только:
     1) заводит один постоянный профиль игрока в localStorage;
     2) на каждый результат заказа и на каждый цикл тихо копит
        статистику, стрики, ленту идеалов, пер-НПС счётчики,
        ачивки/лор/репутацию/пассивки;
     3) даёт простой API (window.PotionProfile), которым game.js
        читает/пишет данные.

   Подключать ДО game.js (см. index.html).

   СХЕМА ПРОФИЛЯ (version:2):
   {
     version, playerId, createdAt, lastSeenAt,
     stats: {
       totalDaysPlayed,      // 1 день = 1 выполненный заказ
       cyclesCompleted,
       totalScoreEarned,
       bestCycleScore,
       totalOrders,
       stickersLifetime: { perfect, good, bad },
       stickersSeen: { perfect:[idx,...], good:[...], bad:[...] },
       weightedProgress      // общая "валюта прогресса" (Фаза H)
     },
     streaks: { perfectCurrent/Best, goodPlusCurrent/Best, badCurrent/Best },
     perfectRibbon: { count (0..19.99, дробный вес), platinumCount },
     npcReputation: { [npcId]: { value, level } },
       // value растёт/падает от результатов. С Фазы J положительный
       // прирост масштабируется весом сложности (progressWeight) и
       // множителем от пассивок (repMult). level здесь НЕ считается —
       // он выводится в game.js из REP_LEVELS (content.js), поле
       // оставлено для обратной совместимости.
     npcStats: { [npcId]: {                       // Фаза I: сырьё для ачивок НПС
       orders, perfects, goods, bads,
       perfectStreak, perfectStreakBest,          // идеалы подряд С ЭТИМ НПС
       noBadStreak, noBadStreakBest,              // без брака подряд с этим НПС
       fastPerfects,                              // идеалы в первую треть таймера
       hardPerfects,                              // идеалы на сложности >= 3
       level4Perfects,                            // идеалы на 4-ой сложности
       focusPerfects: { bubbles, color, size },   // идеалы на фокус-заказах
       weighted,                                  // сумма progressWeight (только идеалы)
       picksCycle, picksCycleBest                 // выборов этого НПС за ТЕКУЩИЙ цикл / рекорд
     } },
     achievements: {
       general: { [achId]: { unlockedAt } },              // Фаза H
       npc: { [npcId]: { [achId]: tier(0-3) } }           // Фаза I: 0=нет,1=бронза,2=серебро,3=золото
     },
     lorePhrases:   { unlockedByNpc: { [npcId]: [phraseIdx, ...] } },  // Фаза I
     rewards:       { byNpc: { [npcId]: { background:false, bottleSkin:null } } }, // Фаза I
     passives:      { active: [ {npcId, passiveId}, ... ] }            // Фаза J (до 3 шт.)
       // "открытость" пассивки НЕ хранится — она выводится из уровня
       // репутации (REP_LEVELS в content.js): уровень N открывает
       // пассивку с индексом N-1 в NPC_PASSIVES[npcId]. Само-лечится:
       // если репутация упала — пассивка снова закрыта и game.js сам
       // выкидывает её из active при следующей проверке.
   }
   ============================================================ */

(function(){
  // Фаза 3: ключ поднят до v2 — это ОБНУЛЯЕТ прогресс у ВСЕХ игроков (старые
  // профили под ключом _v1 больше не читаются). Понадобилось, потому что до
  // системы прогрессии игроки уже накопили репутацию/пассивки персонажей,
  // которых по новой прогрессии ещё не должны были открыть — данные
  // рассинхронизированы. Чистый старт для всех. Менять ключ снова — только при
  // очередном несовместимом сбросе.
  const PROFILE_KEY = 'potionshop_profile_v2';
  // Режим разработчика: флаг активности + бэкап реального профиля игрока.
  const DEV_FLAG_KEY = 'potionshop_devmode';
  const DEV_BACKUP_KEY = 'potionshop_profile_v2__backup';
  const SCHEMA_VERSION = 3;

  function uuid(){
    try{ if(window.crypto && crypto.randomUUID) return crypto.randomUUID(); }catch(e){}
    return 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function emptyNpcStats(){
    return {
      orders: 0, perfects: 0, goods: 0, bads: 0,
      perfectStreak: 0, perfectStreakBest: 0,
      noBadStreak: 0, noBadStreakBest: 0,
      fastPerfects: 0,
      hardPerfects: 0,
      level4Perfects: 0,
      focusPerfects: { bubbles: 0, color: 0, size: 0 },
      weighted: 0,
      picksCycle: 0, picksCycleBest: 0,
      // ---------- Патч "Уникальные механики тир-5" ----------
      // (заполняются только у "своих" НПС, у остальных лежат нулями)
      irTrust: 0,              // last_of_ir: сколько раз игрок доверился (переключился на УР.3 в меню)
      irBuffs: 0,              // last_of_ir: полученных благословений (идеал на УР.3+)
      irDebuffPerfects: 0,     // last_of_ir: идеалов, сделанных ПОД его дебаффом
      novaExactDims: 0,        // supernova_child: заказов, где ширина И высота угаданы точно
      novaExtremePerfects: 0,  // supernova_child: идеалов на "странных пропорциях" (|ширина-высота| велика)
      waiterRatedPerfects: 0,  // the_waiter: смесей с точностью >99% (только так он даёт рейтинг)
      waiterNearMisses: 0,     // the_waiter: смесей без рейтинга (стикер есть, до 99% не дотянуло)
      sealGoods: 0,            // archivist: заказов под печатью, закрытых на годноту+
      sealPerfects: 0,         // archivist: идеалов под печатью
      historicMoments: 0       // archivist: полных "исторических моментов" (3 идеала на 3 печатях)
    };
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
        stickersLifetime: { perfect: 0, good: 0, swill: 0, bad: 0 },
        stickersSeen: { perfect: [], good: [], swill: [], bad: [] },
        weightedProgress: 0
      },
      streaks: {
        perfectCurrent: 0, perfectBest: 0,
        goodPlusCurrent: 0, goodPlusBest: 0,
        badCurrent: 0, badBest: 0
      },
      perfectRibbon: { count: 0, platinumCount: 0 },
      npcReputation: {},
      npcStats: {},
      achievements: { general: {}, npc: {} },
      lorePhrases: { unlockedByNpc: {} },
      rewards: { byNpc: {} },
      passives: { unlockedByNpc: {}, active: [] },
      // Патч "Уникальные механики": прямые указания Хранителя Архива —
      // { [npcId]: achId }. Ачивка с таким id показывает в меню персонажей
      // печать Хранителя и ОТКРЫТЫМ ТЕКСТОМ условие получения.
      keeperHints: { byNpc: {} },
      // Патч "Взаимоотношения": grudge/offended/leftCycle — состояние ЗА ЦИКЛ,
      // сбрасывается в startCycle(). discoveredRelations — открытые игроком
      // связи, НАВСЕГДА (ключ — relationKey(a,b) из game.js, отсортированная пара).
      npcRelationsState: {},
      discoveredRelations: [],
      // Фаза 3: прогрессия. xp — накопленная сумма рейтингов завершённых циклов
      // (аркада). metNpcs — id персонажей, которых игрок УЖЕ встречал (для показа
      // в коллекции только после первой встречи + одноразовой приветственной
      // фразы). Уровень/дни/пул/открытые НПС ВЫЧИСЛЯЮТСЯ из xp в game.js.
      progression: { xp: 0, metNpcs: [] },
      // Фаза 5: чаевые — внутриигровая валюта (для магазина). balance тратится,
      // lifetime только растёт (для ачивок/стикеров). Начисляются в конце цикла.
      tips: { balance: 0, lifetime: 0 },
      // Фаза 6: магазин. inventory — счётчики купленных расходников по грейдам
      // ({ itemId: [qtyG0, qtyG1, qtyG2] }). useTotals — суммарные применения
      // (для будущих ачивок открытия грейдов). Грейды сейчас гейтятся прогрессией.
      shop: { inventory: {}, useTotals: {} }
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
    profile.version = SCHEMA_VERSION;
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
    return profile.npcReputation[npcId];
  }
  function ensureNpcStats(npcId){
    load();
    if(!npcId) return null;
    // deepMerge выше уже дольёт недостающие поля в существующие записи
    // при загрузке; здесь достаточно завести запись целиком, если её нет
    if(!profile.npcStats[npcId]) profile.npcStats[npcId] = emptyNpcStats();
    const ns = profile.npcStats[npcId];
    // подстраховка для профилей version:1 — дозавести недостающие поля
    const fresh = emptyNpcStats();
    Object.keys(fresh).forEach(k=>{ if(ns[k] === undefined) ns[k] = fresh[k]; });
    if(!ns.focusPerfects) ns.focusPerfects = { bubbles:0, color:0, size:0 };
    return ns;
  }

  // ---------- публичный API ----------
  const PP = {
    // прямой доступ к живому объекту профиля — читать можно свободно,
    // но менять поля напрямую снаружи не стоит, лучше через методы ниже
    get data(){ return load(); },
    load,
    save,
    ensureNpcStats,

    // вызывается из finalizeResult() в game.js после каждого заказа.
    //  npcId          — стабильный id НПС (content.js)
    //  perfect/good   — категория результата
    //  delta          — начисленные очки (для totalScoreEarned)
    //  stickerCat/Idx — какой вариант стикера показан (альбом, Фаза G)
    //  progressWeight — вес сложности зелья (Фаза G доп.), УЖЕ с учётом
    //                   пассивок на прогресс (game.js умножает до вызова)
    //  regLevel       — выбранная сложность регуляторов (1-4)
    //  focus          — модификатор заказа ('bubbles'|'color'|'size'|null)
    //  fastThird      — true, если заказ закрыт в первую треть таймера
    //  repMult        — множитель прироста репутации от пассивок (>=1)
    // Возвращает { repBefore, repAfter } — game.js по ним ловит смену
    // уровня репутации (пороги уровней — REP_LEVELS в content.js).
    recordOrderResult({ npcId, perfect, good, swill, delta, stickerCat, stickerIdx, progressWeight, regLevel, focus, fastThird, repMult }){
      load();
      const st = profile.stats;
      st.totalOrders++;
      if(delta > 0) st.totalScoreEarned += delta;
      // Фаза 2 (П7): «Пойло» (swill) — отдельная категория между good и bad.
      // Защитная инициализация для старых профилей без ключей swill.
      if(st.stickersLifetime.swill == null) st.stickersLifetime.swill = 0;
      // bad здесь — «истинный» брак: не perfect, не good и не swill
      const bad = !good && !swill;
      if(perfect) st.stickersLifetime.perfect++;
      else if(good) st.stickersLifetime.good++;
      else if(swill) st.stickersLifetime.swill++;
      else st.stickersLifetime.bad++;

      if(stickerCat && typeof stickerIdx === 'number'){
        if(!st.stickersSeen) st.stickersSeen = { perfect:[], good:[], swill:[], bad:[] };
        if(!st.stickersSeen.swill) st.stickersSeen.swill = [];
        const arr = st.stickersSeen[stickerCat];
        if(arr && !arr.includes(stickerIdx)) arr.push(stickerIdx);
      }

      const w = (typeof progressWeight === 'number' && progressWeight > 0) ? progressWeight : 1;

      // Фаза H: "валюта прогресса" — только на good/perfect (брак не даёт прогресса)
      if(good){
        st.weightedProgress = (st.weightedProgress || 0) + w;
      }

      const s = profile.streaks;
      if(perfect){ s.perfectCurrent++; s.perfectBest = Math.max(s.perfectBest, s.perfectCurrent); }
      else { s.perfectCurrent = 0; }
      if(good){
        s.goodPlusCurrent++; s.goodPlusBest = Math.max(s.goodPlusBest, s.goodPlusCurrent);
        s.badCurrent = 0;
      } else if(swill){
        // Пойло — не победа и не брак: обрывает и серию годнот, и серию браков
        s.goodPlusCurrent = 0;
        s.badCurrent = 0;
      } else {
        s.badCurrent++; s.badBest = Math.max(s.badBest, s.badCurrent);
        s.goodPlusCurrent = 0;
      }

      if(perfect){
        const r = profile.perfectRibbon;
        r.count += w;
        while(r.count >= 20){
          r.platinumCount++;
          r.count -= 20; // остаток переносим в новую ленту, а не теряем
        }
      }

      // ---------- Фаза I: пер-НПС счётчики (сырьё для ачивок неписей) ----------
      let repBefore = 0, repAfter = 0;
      if(npcId){
        const ns = ensureNpcStats(npcId);
        ns.orders++;
        ns.picksCycle = (ns.picksCycle || 0) + 1;
        ns.picksCycleBest = Math.max(ns.picksCycleBest || 0, ns.picksCycle);
        if(perfect){
          ns.perfects++;
          ns.perfectStreak++;
          ns.perfectStreakBest = Math.max(ns.perfectStreakBest, ns.perfectStreak);
          ns.weighted += w;
          if(fastThird) ns.fastPerfects++;
          if(regLevel >= 3) ns.hardPerfects++;
          if(regLevel === 4) ns.level4Perfects++;
          if(focus && ns.focusPerfects[focus] !== undefined) ns.focusPerfects[focus]++;
        } else {
          ns.perfectStreak = 0;
        }
        if(good){
          ns.goods++;
          ns.noBadStreak++;
          ns.noBadStreakBest = Math.max(ns.noBadStreakBest, ns.noBadStreak);
        } else if(swill){
          // Пойло — не годнота и не брак: счётчики goods/bads не трогаем,
          // серию «без брака» не рвём (пойло браком не считается)
        } else {
          ns.bads++;
          ns.noBadStreak = 0;
        }

        // ---------- Фаза J: репутация ----------
        // Положительный прирост масштабируется весом сложности (та же
        // "валюта", что и прогресс — см. roadmap "Сложность → прогресс":
        // репутация с лёгких заказов растёт заметно медленнее) и
        // множителем от пассивок (repMult). Штраф за брак фиксированный.
        const rep = ensureNpc(npcId);
        repBefore = rep.value;
        if(good){
          const base = perfect ? 3 : 1;
          const wScale = Math.min(2.5, Math.max(0.25, w));
          const rm = (typeof repMult === 'number' && repMult > 0) ? repMult : 1;
          rep.value += base * wScale * rm;
        } else if(swill){
          // Пойло репутацию не двигает (мягче брака: тот отнимает −2)
        } else {
          rep.value = Math.max(0, rep.value - 2);
        }
        repAfter = rep.value;
      }
      save();
      return { repBefore, repAfter };
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

    // Фаза I/J: вызывается в начале КАЖДОГО нового цикла (загрузка страницы
    // и кнопка "Начать новый цикл") — обнуляет счётчики "за цикл"
    // (picksCycle у всех НПС). Рекорды (picksCycleBest) не трогаются.
    startCycle(){
      load();
      Object.keys(profile.npcStats || {}).forEach(id=>{
        if(profile.npcStats[id]) profile.npcStats[id].picksCycle = 0;
      });
      // Патч "Взаимоотношения": обида/уход — состояние ЗА ЦИКЛ, новый цикл
      // всех прощает (открытые связи в discoveredRelations при этом не трогаем)
      profile.npcRelationsState = {};
      save();
    },

    // ---------- Фаза H ----------
    unlockGeneralAchievement(achId){
      load();
      if(!profile.achievements.general[achId]) profile.achievements.general[achId] = { unlockedAt: Date.now() };
      save();
    },

    // Фаза H v2: пороговые ачивки — запись вида { tier, unlockedAt }.
    // Старые записи { unlockedAt } без tier трактуются как tier:1.
    // Тир только растёт (Math.max) — регресс невозможен.
    setGeneralAchievementTier(achId, tier){
      load();
      const g = profile.achievements.general;
      if(!g[achId]) g[achId] = { unlockedAt: Date.now(), tier: 0 };
      const rec = g[achId];
      if(typeof rec.tier !== 'number') rec.tier = 1;
      rec.tier = Math.max(rec.tier, tier|0);
      save();
      return rec.tier;
    },
    // используется миграцией v1→v2 при загрузке (см. game.js)
    removeGeneralAchievement(achId){
      load();
      delete profile.achievements.general[achId];
      save();
    },

    // ---------- Фаза I ----------
    setNpcAchievementTier(npcId, achId, tier){
      load();
      ensureNpc(npcId);
      profile.achievements.npc[npcId][achId] = tier;
      save();
    },
    // лорные фразы храним ИНДЕКСАМИ в массиве NPC_LORE[npcId] (content.js) —
    // открываются последовательно, поэтому индекс стабилен
    unlockLorePhrase(npcId, phraseIdx){
      load();
      ensureNpc(npcId);
      const arr = profile.lorePhrases.unlockedByNpc[npcId];
      if(!arr.includes(phraseIdx)) arr.push(phraseIdx);
      save();
    },
    adjustReputation(npcId, delta){
      load();
      const rep = ensureNpc(npcId);
      rep.value = Math.max(0, rep.value + delta);
      save();
      return rep;
    },
    // прямая установка значения репутации (для режима разработчика)
    setReputation(npcId, value){
      load();
      const rep = ensureNpc(npcId);
      rep.value = Math.max(0, value | 0);
      save();
      return rep;
    },
    unlockReward(npcId, key, value){
      load();
      ensureNpc(npcId);
      profile.rewards.byNpc[npcId][key] = value;
      save();
    },

    // ---------- Патч "Уникальные механики" ----------
    // универсальный инкремент любого счётчика в npcStats[npcId]
    // (используется game.js для новых механик Ир/Сверхновой/Ждущего/Хранителя)
    bumpNpcStat(npcId, key, amount){
      if(!npcId || !key) return;
      const ns = ensureNpcStats(npcId);
      if(typeof ns[key] !== 'number') ns[key] = 0;
      ns[key] += (typeof amount === 'number' ? amount : 1);
      save();
      return ns[key];
    },
    // прямое указание Хранителя: для НПС npcId раскрыть условие ачивки achId
    setKeeperHint(npcId, achId){
      load();
      if(!profile.keeperHints) profile.keeperHints = { byNpc: {} };
      if(!profile.keeperHints.byNpc) profile.keeperHints.byNpc = {};
      profile.keeperHints.byNpc[npcId] = achId;
      save();
    },

    // ---------- Патч "Взаимоотношения" ----------
    // grudge — сколько раз этого НПС выбрали в пользу его врага/неприятеля
    // ЗА ЭТОТ ЦИКЛ. Пороги: 3 — "обиделся" (форсирует стикер-какашку, может
    // отказать в выборе), 6 — уходит из пула до конца цикла. Возвращает
    // { state, justOffended, justLeft } — чтобы game.js показал тост РОВНО
    // в момент пересечения порога, а не на каждом инкременте.
    relationState(npcId){
      load();
      if(!profile.npcRelationsState) profile.npcRelationsState = {};
      if(!profile.npcRelationsState[npcId]){
        profile.npcRelationsState[npcId] = { grudge: 0, offended: false, leftCycle: false };
      }
      return profile.npcRelationsState[npcId];
    },
    bumpGrudge(npcId){
      load();
      const st = PP.relationState(npcId);
      st.grudge++;
      const wasOffended = st.offended, wasLeft = st.leftCycle;
      if(st.grudge >= 3) st.offended = true;
      if(st.grudge >= 6) st.leftCycle = true;
      save();
      return { state: st, justOffended: st.offended && !wasOffended, justLeft: st.leftCycle && !wasLeft };
    },
    // ключ пары — отсортированная строка "a|b" (см. relationKey в game.js)
    discoverRelation(key){
      load();
      if(!profile.discoveredRelations) profile.discoveredRelations = [];
      if(profile.discoveredRelations.includes(key)) return false;
      profile.discoveredRelations.push(key);
      save();
      return true;
    },
    isRelationDiscovered(key){
      load();
      return !!(profile.discoveredRelations && profile.discoveredRelations.includes(key));
    },

    // ---------- Фаза J: активные пассивки ----------
    // list — массив вида [{npcId, passiveId}], не больше 3. Валидность
    // (открыта ли пассивка по уровню репутации) проверяет game.js —
    // и при выборе, и при применении эффектов.
    setActivePassives(list){
      load();
      profile.passives.active = Array.isArray(list) ? list.slice(0, 3) : [];
      save();
    },

    // ---------- Фаза 3: прогрессия ----------
    // Хранилище «тупое»: только сырой xp + список встреченных НПС. Всё
    // производное (уровень, дни цикла, размер пула, открытые персонажи)
    // вычисляет game.js из PROGRESSION-конфига. Защитная инициализация —
    // для профилей, сохранённых до Фазы 3.
    _ensureProgression(){
      if(!profile.progression) profile.progression = { xp: 0, metNpcs: [] };
      if(typeof profile.progression.xp !== 'number') profile.progression.xp = 0;
      if(!Array.isArray(profile.progression.metNpcs)) profile.progression.metNpcs = [];
      return profile.progression;
    },
    getProgressionXp(){
      load();
      return this._ensureProgression().xp;
    },
    addProgressionXp(amount){
      load();
      const pr = this._ensureProgression();
      pr.xp += Math.max(0, Math.round(amount || 0));
      save();
      return pr.xp;
    },
    isNpcMet(id){
      load();
      return this._ensureProgression().metNpcs.includes(id);
    },
    markNpcMet(id){
      load();
      const pr = this._ensureProgression();
      if(!id || pr.metNpcs.includes(id)) return false;
      pr.metNpcs.push(id);
      save();
      return true; // true — встретили ВПЕРВЫЕ (для приветственной фразы)
    },

    // ---------- Фаза 5: чаевые (валюта) ----------
    _ensureTips(){
      if(!profile.tips) profile.tips = { balance: 0, lifetime: 0 };
      if(typeof profile.tips.balance !== 'number') profile.tips.balance = 0;
      if(typeof profile.tips.lifetime !== 'number') profile.tips.lifetime = 0;
      return profile.tips;
    },
    getTips(){ load(); return this._ensureTips().balance; },
    getTipsLifetime(){ load(); return this._ensureTips().lifetime; },
    addTips(amount){
      load();
      const t = this._ensureTips();
      const a = Math.max(0, Math.round(amount || 0));
      t.balance += a; t.lifetime += a;
      save();
      return t.balance;
    },
    spendTips(amount){
      load();
      const t = this._ensureTips();
      const a = Math.max(0, Math.round(amount || 0));
      if(t.balance < a) return false; // недостаточно средств
      t.balance -= a;
      save();
      return true;
    },

    // ---------- Фаза 6: магазин / инвентарь ----------
    _ensureShop(){
      if(!profile.shop) profile.shop = { inventory: {}, useTotals: {} };
      if(!profile.shop.inventory) profile.shop.inventory = {};
      if(!profile.shop.useTotals) profile.shop.useTotals = {};
      return profile.shop;
    },
    // количество предмета конкретного грейда в сумке
    itemQty(itemId, grade){
      load();
      const inv = this._ensureShop().inventory[itemId];
      return (inv && inv[grade]) ? inv[grade] : 0;
    },
    // весь инвентарь в удобном виде: [{ id, grade, qty }]
    inventoryList(){
      load();
      const inv = this._ensureShop().inventory;
      const out = [];
      Object.keys(inv).forEach(id=>{
        (inv[id]||[]).forEach((qty, g)=>{ if(qty>0) out.push({ id, grade:g, qty }); });
      });
      return out;
    },
    addItem(itemId, grade, qty){
      load();
      const shop = this._ensureShop();
      if(!shop.inventory[itemId]) shop.inventory[itemId] = [];
      const arr = shop.inventory[itemId];
      arr[grade] = (arr[grade] || 0) + (qty || 1);
      save();
      return arr[grade];
    },
    // тратит один предмет; возвращает false, если такого в сумке нет
    consumeItem(itemId, grade){
      load();
      const shop = this._ensureShop();
      const arr = shop.inventory[itemId];
      if(!arr || !arr[grade]) return false;
      arr[grade]--;
      shop.useTotals[itemId] = (shop.useTotals[itemId] || 0) + 1;
      save();
      return true;
    },
    getItemUseTotal(itemId){ load(); return this._ensureShop().useTotals[itemId] || 0; },

    // ---------- Режим разработчика (тестовый) ----------
    // Вход: реальный профиль игрока сохраняется в отдельный ключ-бэкап, ставится
    // флаг. Накат dev-значений (xp/чаевые/репутация) делает game.js (ему нужен
    // список NPC). Выход: реальный профиль восстанавливается из бэкапа, флаг снят.
    // Это гарантирует, что статистика/прогрессия игрока не теряются.
    isDevMode(){ try{ return localStorage.getItem(DEV_FLAG_KEY) === '1'; }catch(e){ return false; } },
    enterDevMode(){
      load();
      if(this.isDevMode()) return;
      try{ localStorage.setItem(DEV_BACKUP_KEY, JSON.stringify(profile)); }catch(e){}
      try{ localStorage.setItem(DEV_FLAG_KEY, '1'); }catch(e){}
      // сам накат dev-значений — снаружи (game.js), затем save()
    },
    exitDevMode(){
      if(!this.isDevMode()) return;
      let restored = null;
      try{ const raw = localStorage.getItem(DEV_BACKUP_KEY); if(raw) restored = JSON.parse(raw); }catch(e){}
      try{ localStorage.removeItem(DEV_FLAG_KEY); }catch(e){}
      try{ localStorage.removeItem(DEV_BACKUP_KEY); }catch(e){}
      if(restored){
        // в память кладём реальный профиль и сразу пишем его в основной ключ,
        // чтобы beforeunload-сейв при перезагрузке не затёр восстановление
        profile = deepMerge(emptyProfile(), restored);
        try{ localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }catch(e){}
      }
    }
  };

  window.PotionProfile = PP;
})();
