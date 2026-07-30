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
      shop: { inventory: {}, useTotals: {} },
      // Фаза 7: умения игрока. charges — текущие заряды (0..3). perfectCounter —
      // сколько идеалов накоплено за цикл в счёт бонусного заряда (сброс на 3).
      skills: { charges: 0, perfectCounter: 0 }
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
    // Фаза 4: экспорт/импорт всего профиля для кросс-девайс синка через Supabase
    exportData(){ return JSON.parse(JSON.stringify(load())); },
    importData(obj){
      if(!obj || typeof obj !== 'object') return false;
      profile = deepMerge(emptyProfile(), obj);
      profile.version = SCHEMA_VERSION;
      try{ localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }catch(e){}
      return true;
    },
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
      // Фаза 7: на новый цикл — +1 заряд умений (потолок 3), счётчик идеалов сброс
      const s = this._ensureSkills();
      s.charges = Math.min(3, s.charges + 1);
      s.perfectCounter = 0;
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

    // ---------- Фаза 7: умения игрока (заряды) ----------
    _ensureSkills(){
      if(!profile.skills) profile.skills = { charges: 0, perfectCounter: 0 };
      if(typeof profile.skills.charges !== 'number') profile.skills.charges = 0;
      if(typeof profile.skills.perfectCounter !== 'number') profile.skills.perfectCounter = 0;
      return profile.skills;
    },
    getCharges(){ load(); return this._ensureSkills().charges; },
    addCharge(n){
      load(); const s = this._ensureSkills();
      s.charges = Math.max(0, Math.min(3, s.charges + (n || 1)));
      save(); return s.charges;
    },
    spendCharge(){
      load(); const s = this._ensureSkills();
      if(s.charges <= 0) return false;
      s.charges--; save(); return true;
    },
    // +1 к счётчику идеалов за цикл; на N-м (по умолчанию 3, Фаза 11 — пассивка
    // может снизить до 2) — выдаём заряд и обнуляем счётчик.
    // Возвращает true, если заряд был выдан.
    bumpPerfectCharge(threshold){
      load(); const s = this._ensureSkills();
      const need = (threshold === 2) ? 2 : 3;
      s.perfectCounter = (s.perfectCounter || 0) + 1;
      if(s.perfectCounter >= need){
        s.perfectCounter = 0;
        const before = s.charges;
        s.charges = Math.min(3, s.charges + 1);
        save(); return s.charges > before;
      }
      save(); return false;
    },

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

// ============================================================
// Фаза 4: PotionAuth — идентичность игрока. Гостевой режим ПО УМОЛЧАНИЮ:
// играть можно сразу, без единого клика и без регистрации (прогресс хранится
// локально на устройстве). Логин/Регистрация — опционально, для профиля между
// устройствами. Онлайн-часть подключается через SUPABASE_CONFIG ниже: пока
// ключи пусты — онлайн выключен, все играют гостями.
// ============================================================
(function(){
  'use strict';
  const AUTH_KEY = 'potionshop_auth_v1';

  // === Supabase (Фаза 4) ===
  // url/anonKey — Project URL + publishable/anon (PUBLIC) key. Публичные, их
  // безопасно держать во фронтенде. service_role/secret сюда НИКОГДА не вставлять.
  const SUPABASE_CONFIG = {
    url: 'https://ilkimncsophobhzhqidj.supabase.co',
    anonKey: 'sb_publishable_Rad7Vj456OlLkaxnNuIj0w_vlogSoOo'
  };
  // Игрок входит по «логину», а Supabase Auth работает по e-mail — поэтому логин
  // детерминированно кодируется в псевдо-адрес (ASCII, без коллизий, поддержка
  // кириллицы через побайтовое hex-кодирование).
  const EMAIL_DOMAIN = '@potion.local';

  function load(){ try{ return JSON.parse(localStorage.getItem(AUTH_KEY)) || {}; }catch(e){ return {}; } }
  function save(a){ try{ localStorage.setItem(AUTH_KEY, JSON.stringify(a)); }catch(e){} }
  function genGuestNick(){ return 'Гость-' + Math.floor(1000 + Math.random()*9000); }
  function ensure(){
    let a = load(), changed = false;
    if(!a.mode){ a.mode = 'guest'; changed = true; }
    // Правка пользователя: гостевой ник и ник аккаунта храним ОТДЕЛЬНО. Раньше
    // оба лежали в a.nickname, поэтому после выхода/протухшей сессии в слоте
    // гостя оставался висеть логин-ник (баг из отчёта). guestNick — то, что
    // показываем «не вошедшему»; nickname — ник аккаунта.
    if(!a.guestNick){
      a.guestNick = (a.mode !== 'user' && a.nickname) ? a.nickname : genGuestNick();
      changed = true;
    }
    if(!a.nickname){ a.nickname = a.guestNick; changed = true; }
    if(changed) save(a);
    return a;
  }
  // «Вошёл по-настоящему» = режим user И есть живой (не протухший) токен.
  // Протухшая сессия после обновления страницы теперь честно показывается как
  // гость (кнопки Логин/Регистрация), а не залипшим ником аккаунта.
  function sessionAlive(a){
    return a.mode === 'user' && !!a.token && (!a.expiresAt || a.expiresAt > Date.now());
  }
  function configured(){ return !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey); }
  function loginToEmail(login){
    const s = String(login || '').trim().toLowerCase();
    let out = '';
    for(const ch of s){
      if(/[a-z0-9]/.test(ch)) out += ch;
      else for(const b of new TextEncoder().encode(ch)) out += '-' + b.toString(16);
    }
    return 'u' + (out || 'user').slice(0, 60) + EMAIL_DOMAIN;
  }
  function headers(token){
    return { 'apikey': SUPABASE_CONFIG.anonKey, 'Content-Type':'application/json',
             'Authorization': 'Bearer ' + (token || SUPABASE_CONFIG.anonKey) };
  }
  function applySession(sess, nickname){
    const a = ensure();
    a.mode = 'user';
    a.userId = (sess.user && sess.user.id) || a.userId || null;
    a.token = sess.access_token || a.token;
    a.refresh = sess.refresh_token || a.refresh;
    a.expiresAt = sess.expires_at ? sess.expires_at * 1000 : (Date.now() + 3500 * 1000);
    const metaNick = sess.user && sess.user.user_metadata && sess.user.user_metadata.nickname;
    if(nickname) a.nickname = String(nickname).slice(0, 20);
    else if(metaNick) a.nickname = String(metaNick).slice(0, 20);
    save(a);
  }
  async function pullProfile(){
    const a = load(); if(!a.userId || !a.token) return;
    try{
      const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/profiles?id=eq.' + a.userId + '&select=nickname,data',
        { headers: headers(a.token) });
      if(!res.ok) return;
      const rows = await res.json();
      if(rows && rows[0]){
        if(rows[0].nickname){ a.nickname = String(rows[0].nickname).slice(0, 20); save(a); }
        if(rows[0].data && window.PotionProfile && window.PotionProfile.importData) window.PotionProfile.importData(rows[0].data);
      }
    }catch(e){ /* офлайн — остаёмся на локальном профиле */ }
  }
  // Правка пользователя (критично: прогрессия откатывалась). pullProfile слепо
  // ПЕРЕТИРАЛ локальный профиль облачным, а облако пушится только в конце цикла →
  // на перезагрузке весь набранный за цикл прогресс терялся. mergePull берёт
  // облако ТОЛЬКО если оно реально впереди по xp (напр. играли на другом
  // устройстве); иначе локальный главнее — не трогаем и пушим его наверх.
  async function mergePull(){
    const a = load(); if(!a.userId || !a.token) return;
    try{
      const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/profiles?id=eq.' + a.userId + '&select=nickname,data',
        { headers: headers(a.token) });
      if(!res.ok) return;
      const rows = await res.json();
      if(rows && rows[0]){
        if(rows[0].nickname){ a.nickname = String(rows[0].nickname).slice(0, 20); save(a); }
        const remote = rows[0].data;
        const remoteXp = (remote && remote.progression && remote.progression.xp) || 0;
        let localXp = 0;
        try{ localXp = ((window.PotionProfile.exportData().progression) || {}).xp || 0; }catch(e){}
        if(remote && remoteXp > localXp && window.PotionProfile && window.PotionProfile.importData){
          window.PotionProfile.importData(remote);   // облако впереди → подтягиваем
        } else {
          pushProfile();                              // локальный впереди/равен → сохраняем наверх, не откатываем
        }
      } else {
        pushProfile();                                // строки ещё нет — заводим
      }
    }catch(e){ /* офлайн — остаёмся на локальном */ }
  }
  async function pushProfile(){
    const a = load(); if(a.mode !== 'user' || !a.userId || !a.token) return false;
    const body = { id: a.userId, nickname: a.nickname,
      data: (window.PotionProfile && window.PotionProfile.exportData) ? window.PotionProfile.exportData() : {},
      updated_at: new Date().toISOString() };
    try{
      const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/profiles',
        { method:'POST', headers: Object.assign(headers(a.token), { 'Prefer':'resolution=merge-duplicates' }),
          body: JSON.stringify(body) });
      return res.ok;
    }catch(e){ return false; }
  }
  async function refreshSession(){
    const a = load(); if(!a.refresh || !configured()) return false;
    try{
      const res = await fetch(SUPABASE_CONFIG.url + '/auth/v1/token?grant_type=refresh_token',
        { method:'POST', headers: headers(), body: JSON.stringify({ refresh_token: a.refresh }) });
      const d = await res.json();
      if(res.ok && d.access_token){ applySession(d); return true; }
    }catch(e){}
    return false;
  }

  const Auth = {
    get data(){ return ensure(); },
    isConfigured(){ return configured(); },
    getMode(){ return ensure().mode; },            // 'guest' | 'user'
    // Правка пользователя (критично): «вошёл» держится до РУЧНОГО выхода, а не до
    // протухания access-токена (~1ч). Токен держим живым авто-рефрешем (см. ниже),
    // а личность игрока считаем по mode — иначе игрока «слетало» в гостя прямо в игре.
    isLoggedIn(){ return ensure().mode === 'user'; },
    getNickname(){ const a = ensure(); return a.mode === 'user' ? a.nickname : a.guestNick; },
    setNickname(name){
      name = String(name || '').trim().slice(0, 20);
      if(!name) return false;
      const a = ensure();
      if(a.mode === 'user'){ a.nickname = name; save(a); pushProfile(); } // ник аккаунта → онлайн
      else { a.guestNick = name; save(a); }                              // гостевой ник — локально
      return true;
    },
    async register(login, password, nickname){
      if(!configured()) return { ok:false, reason:'not_configured' };
      if(!login || !password) return { ok:false, reason:'error', message:'Впиши логин и пароль' };
      const email = loginToEmail(login), nick = String(nickname || login).slice(0, 20);
      try{
        const res = await fetch(SUPABASE_CONFIG.url + '/auth/v1/signup',
          { method:'POST', headers: headers(), body: JSON.stringify({ email, password, data:{ nickname: nick } }) });
        const d = await res.json();
        if(!res.ok || d.error || d.code || d.msg)
          return { ok:false, reason:'error', message: d.msg || d.error_description || d.error || 'Ошибка регистрации' };
        if(d.access_token){ applySession(d, nick); await pushProfile(); return { ok:true }; }
        // сессии нет → в проекте включено подтверждение e-mail (для псевдо-почты его
        // не подтвердить). Нужно выключить Confirm email в Supabase — пробуем войти.
        return await this.login(login, password, nick);
      }catch(e){ return { ok:false, reason:'error', message:'Сеть недоступна' }; }
    },
    async login(login, password, nickname){
      if(!configured()) return { ok:false, reason:'not_configured' };
      if(!login || !password) return { ok:false, reason:'error', message:'Впиши логин и пароль' };
      const email = loginToEmail(login);
      try{
        const res = await fetch(SUPABASE_CONFIG.url + '/auth/v1/token?grant_type=password',
          { method:'POST', headers: headers(), body: JSON.stringify({ email, password }) });
        const d = await res.json();
        if(!res.ok || !d.access_token)
          return { ok:false, reason:'error', message: d.error_description || d.msg || d.error || 'Неверный логин или пароль' };
        applySession(d, nickname);
        await mergePull();   // подтянуть облако, но НЕ откатить локальный прогресс, если он впереди
        return { ok:true };
      }catch(e){ return { ok:false, reason:'error', message:'Сеть недоступна' }; }
    },
    logout(){
      const a = ensure(); a.mode = 'guest'; a.userId = null; a.token = null; a.refresh = null; a.expiresAt = null; save(a);
    },
    syncUp(){ return pushProfile(); }, // вызывать в конце цикла — сохранить прогресс онлайн
    async restore(){                    // восстановить сессию при загрузке страницы
      const a = load();
      if(a.mode === 'user' && configured()){
        // держим токен живым; прогресс НЕ перетираем облаком (mergePull) —
        // остаёмся вошедшими до ручного выхода, локальный прогресс не откатываем
        if(a.refresh && (!a.expiresAt || a.expiresAt < Date.now() + 60000)) await refreshSession();
        await mergePull();
      }
    },
    getRememberDevice(){ return ensure().remember !== false; },
    setRememberDevice(on){ const a = ensure(); a.remember = !!on; save(a); },
    getBest(boardId){ const a = ensure(); return (a.best && a.best[boardId || 'arcade']) || 0; },
    setBestIfHigher(boardId, score){
      const a = ensure(); a.best = a.best || {}; const k = boardId || 'arcade';
      if(score > (a.best[k] || 0)){ a.best[k] = score; save(a); return true; }
      return false;
    },
    // ---- Онлайн-лидерборд (Supabase, Фаза 4) ----
    // Читают все (публичная политика), пишут только вошедшие (RLS auth.uid()=user_id).
    async leaderboardLoad(board){
      if(!configured()) return null;
      const a = load();
      try{
        const q = '?board=eq.' + encodeURIComponent(board || 'arcade') + '&select=name,score,created_at&order=score.desc&limit=50';
        const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/leaderboard' + q, { headers: headers(a.token) });
        if(res.ok) return await res.json();
      }catch(e){}
      return null;
    },
    async leaderboardSave(board, name, score){
      const a = load();
      if(a.mode !== 'user' || !a.token || !a.userId || !configured()) return false;
      const b = board || 'arcade';
      try{
        // Правка пользователя: одна строка на игрока+доску, а не куча дублей.
        // Сносим прошлые свои записи на этой доске и пишем текущую (высшую).
        await fetch(SUPABASE_CONFIG.url + '/rest/v1/leaderboard?user_id=eq.' + encodeURIComponent(a.userId) + '&board=eq.' + encodeURIComponent(b),
          { method:'DELETE', headers: headers(a.token) }).catch(()=>{});
        const res = await fetch(SUPABASE_CONFIG.url + '/rest/v1/leaderboard',
          { method:'POST', headers: Object.assign(headers(a.token), { 'Prefer':'return=minimal' }),
            body: JSON.stringify({ board: b, name: String(name || '').slice(0,20), score: Math.round(score), user_id: a.userId }) });
        return res.ok;
      }catch(e){ return false; }
    }
  };

  // Правка пользователя (критично): пока вкладка открыта — держим сессию живой.
  // Раньше access-токен протухал за ~1ч и игрок «слетал» в гостя прямо в игре.
  // Каждые 4 мин: если скоро истекает — рефрешим; затем пушим локальный прогресс
  // наверх, чтобы облако не отставало (иначе перезагрузка могла откатить прогресс).
  if(configured()){
    setInterval(()=>{
      const a = load();
      if(a.mode !== 'user' || !a.refresh) return;
      const near = !a.expiresAt || a.expiresAt < Date.now() + 10 * 60000;
      (near ? refreshSession() : Promise.resolve()).then(()=> pushProfile());
    }, 4 * 60000);
  }

  window.PotionAuth = Auth;
})();
