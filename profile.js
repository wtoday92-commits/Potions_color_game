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
  const PROFILE_KEY = 'potionshop_profile_v1';
  const SCHEMA_VERSION = 2;

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
      waiterTimeBought: 0,     // the_waiter: всего куплено секунд у времени
      waiterPurePerfects: 0,   // the_waiter: идеалов без единой купленной секунды
      waiterBrokenPerfects: 0, // the_waiter: идеалов с 2+ сломанными регуляторами
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
        stickersLifetime: { perfect: 0, good: 0, bad: 0 },
        stickersSeen: { perfect: [], good: [], bad: [] },
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
      keeperHints: { byNpc: {} }
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
    recordOrderResult({ npcId, perfect, good, delta, stickerCat, stickerIdx, progressWeight, regLevel, focus, fastThird, repMult }){
      load();
      const st = profile.stats;
      st.totalOrders++;
      if(delta > 0) st.totalScoreEarned += delta;
      if(perfect) st.stickersLifetime.perfect++;
      else if(good) st.stickersLifetime.good++;
      else st.stickersLifetime.bad++;

      if(stickerCat && typeof stickerIdx === 'number'){
        if(!st.stickersSeen) st.stickersSeen = { perfect:[], good:[], bad:[] };
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

    // ---------- Фаза J: активные пассивки ----------
    // list — массив вида [{npcId, passiveId}], не больше 3. Валидность
    // (открыта ли пассивка по уровню репутации) проверяет game.js —
    // и при выборе, и при применении эффектов.
    setActivePassives(list){
      load();
      profile.passives.active = Array.isArray(list) ? list.slice(0, 3) : [];
      save();
    }
  };

  window.PotionProfile = PP;
})();
