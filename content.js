/* ============================================================
   ЗЕЛЬЕВАРНЯ — content.js
   ФАЙЛ КОНТЕНТА: пришельцы, фразы, формы, сложности, настройки.
   Меняй и дополняй здесь — логику (game.js) трогать не нужно.

   ЛОКАЛИЗАЦИЯ: с Фазы B весь текст хранится в формате
   { ru:'...', en:'...' } (для строк) или { ru:[...], en:[...] }
   (для массивов фраз). Функция LT() в game.js достаёт нужный
   язык. Если добавляешь новый текст — пиши сразу в этом формате,
   а не голой строкой (см. roadmap.md).
   ============================================================ */

// ---------- НАСТРОЙКИ ----------
const CONFIG = {
  // Вставь сюда URL своей Firebase Realtime Database, чтобы рейтинг
  // стал общим для всех игроков (см. README.md):
  FIREBASE_DB_URL: 'https://potion-shop2-default-rtdb.europe-west1.firebasedatabase.app', // например 'https://your-project-default-rtdb.firebaseio.com'
  DEFAULT_LANG: 'ru', // язык по умолчанию для новых игроков: 'ru' или 'en'
};

// ---------- ИНТЕРФЕЙС (весь статичный текст экрана) ----------
// Ключи ниже используются через LT(UI_TEXT.KEY) в game.js, а также
// через data-i18n="KEY" / data-i18n-html="KEY" / data-i18n-placeholder="KEY"
// прямо в index.html.
const UI_TEXT = {
  SPLASH_TITLE:      { ru:'Добро пожаловать в место,<br>где зелья стали вашим домом', en:'Welcome to a place<br>where potions became your home' },
  SPLASH_SUB:        { ru:'лавка пришвартована у самого края вселенной', en:'the shop is docked at the very edge of the universe' },
  DOCK_BTN:          { ru:'Пришвартоваться', en:'Dock' },
  SUBTITLE:          { ru:'лавка смесей // сектор Ω // край вселенной', en:'mixture shop // sector Ω // edge of the universe' },
  DAY_LABEL:         { ru:'День', en:'Day' },
  RATING_LABEL:      { ru:'РЕЙТИНГ:', en:'RATING:' },
  LB_BTN_TITLE:      { ru:'Глобальный рейтинг', en:'Global leaderboard' },
  VOLUME_TITLE:      { ru:'Громкость эмбиента', en:'Ambient volume' },
  LANG_BTN_TITLE:    { ru:'Сменить язык', en:'Switch language' },
  DIFF_BTN_LABEL:    { ru:'УР.', en:'LV.' },
  DIFF_BTN_TITLE_1:  { ru:'Сложность 1 — доступен только цвет.', en:'Difficulty 1 — only color available.' },
  DIFF_BTN_TITLE_2:  { ru:'Сложность 2 — цвет, оттенок и размер банки.', en:'Difficulty 2 — color, tint and jar size.' },
  DIFF_BTN_TITLE_3:  { ru:'Сложность 3 — все регуляторы.', en:'Difficulty 3 — all regulators.' },
  DIFF_BTN_TITLE_4:  { ru:'Сложность 4 — все регуляторы, плюс "плохие" пузыри: растут сами по себе, убирай их кликом, иначе лопнут и собьют случайный ползунок. Больше времени, больше награда.', en:'Difficulty 4 — all regulators, plus "bad" bubbles: they grow on their own, click to clear them or they pop and knock a random slider off. More time, more reward.' },
  BAD_BUBBLE_BADGE:  { ru:'риск', en:'risk' },
  SELECT_TITLE:      { ru:'Кто пришвартовался к лавке?', en:"Who's docked at the shop?" },
  ORDER_LABEL:       { ru:'Заявка №', en:'Order #' },
  FOCUS_PREFIX:      { ru:'фокус:', en:'focus:' },
  NO_FOCUS_LABEL:    { ru:'без модификатора', en:'no modifier' },
  PHASE_SCAN:        { ru:'сканируй образец...', en:'scan the sample...' },
  PHASE_CRAFT:       { ru:'воссоздай смесь по памяти!', en:'recreate the mixture from memory!' },
  BREW_BTN:          { ru:'Готово!', en:'Done!' },
  LABEL_SPECTRUM:    { ru:'Спектр', en:'Spectrum' },
  LABEL_SPECTRUM_A:  { ru:'Спектр А', en:'Spectrum A' },
  LABEL_SPECTRUM_B:  { ru:'Спектр Б', en:'Spectrum B' },
  LABEL_SATURATION:  { ru:'Накал', en:'Intensity' },
  LABEL_VOLUME:      { ru:'Объём', en:'Volume' },
  LABEL_COUNT:       { ru:'Сгустки', en:'Blobs' },
  LABEL_BSIZE:       { ru:'Разм. сгуст.', en:'Blob size' },
  LABEL_SHAPE:       { ru:'Форма', en:'Shape' },
  LABEL_COUNT_QTY:   { ru:'Сгустки (кол-во)', en:'Blobs (count)' },
  LABEL_COUNT_SIZE:  { ru:'Сгустки (размер)', en:'Blobs (size)' },
  REWARD_PREFIX:     { ru:'за идеал: +', en:'for perfect: +' },
  RESULT_PERFECT:    { ru:'Идеальная смесь!', en:'Perfect mixture!' },
  RESULT_GOOD:       { ru:'Годная смесь', en:'Decent mixture' },
  RESULT_BAD:        { ru:'Брак...', en:'Reject...' },
  SPEED_BONUS:       { ru:'⚡ бонус за скорость: +{p}%', en:'⚡ speed bonus: +{p}%' },
  NEXT_BTN:          { ru:'К шлюзу →', en:'To the airlock →' },
  WEEK_TITLE:        { ru:'Цикл завершён!', en:'Cycle complete!' },
  NAME_PLACEHOLDER:  { ru:'Впиши свой позывной...', en:'Enter your call sign...' },
  SAVE_SCORE_BTN:    { ru:'Сохранить результат', en:'Save result' },
  SAVE_SCORE_DONE:   { ru:'Сохранено ✓', en:'Saved ✓' },
  NEW_WEEK_BTN:      { ru:'Начать новый цикл →', en:'Start a new cycle →' },
  LB_TITLE:          { ru:'🏆 Глобальный рейтинг', en:'🏆 Global Leaderboard' },
  LB_CLOSE_BTN:      { ru:'Закрыть', en:'Close' },
  LB_EMPTY:          { ru:'Пока пусто — будь первым!', en:"It's empty — be the first!" },
  ANONYMOUS:         { ru:'Аноним', en:'Anonymous' },

  // ---------- Фаза G: коллекция (статистика/альбом/лента/репутация) ----------
  COLLECTION_BTN_TITLE:   { ru:'Коллекция', en:'Collection' },
  COLLECTION_TITLE:       { ru:'🗂 Коллекция', en:'🗂 Collection' },
  STATS_DAYS:             { ru:'Дней в лавке', en:'Days in the shop' },
  STATS_CYCLES:           { ru:'Циклов пройдено', en:'Cycles completed' },
  STATS_TOTAL_SCORE:      { ru:'Суммарный рейтинг', en:'Total rating earned' },
  STATS_BEST_CYCLE:       { ru:'Лучший результат цикла', en:'Best cycle result' },
  STATS_ORDERS:           { ru:'Заказов выполнено', en:'Orders completed' },
  RIBBON_SECTION_TITLE:   { ru:'Лента идеальных', en:'Perfect ribbon' },
  PLATINUM_RIBBON_TITLE:  { ru:'Платиновая лента', en:'Platinum ribbon' },
  STICKERS_SECTION_TITLE: { ru:'Альбом стикеров', en:'Sticker album' },
  ALBUM_LABEL_PERFECT:    { ru:'Идеал', en:'Perfect' },
  ALBUM_LABEL_GOOD:       { ru:'Годнота', en:'Decent' },
  ALBUM_LABEL_BAD:        { ru:'Брак', en:'Reject' },
  REPUTATION_SECTION_TITLE: { ru:'Репутация', en:'Reputation' },
  REP_LEVEL_LABEL:        { ru:'ур.', en:'lv.' },

  // ---------- Фаза H: общие ачивки ----------
  ACH_SECTION_TITLE:  { ru:'Ачивки', en:'Achievements' },
  ACH_PROGRESS_LABEL: { ru:'Открыто', en:'Unlocked' },
  ACH_LOCKED_HINT:    { ru:'Ещё не открыто', en:'Not unlocked yet' },
  ACH_TOAST_PREFIX:   { ru:'Ачивка получена:', en:'Achievement unlocked:' },
  ACH_FULL_MARK:      { ru:'собрано полностью', en:'fully collected' },

  // ---------- UI-патч 2: вкладки Коллекции + мини-меню ⚙ ----------
  TAB_STATS:          { ru:'Статистика', en:'Stats' },
  TAB_RIBBON:         { ru:'Лента', en:'Ribbon' },
  TAB_STICKERS:       { ru:'Стикеры', en:'Stickers' },
  TAB_ACH:            { ru:'Ачивки', en:'Achievements' },
  SETTINGS_BTN_TITLE: { ru:'Настройки (язык, громкость)', en:'Settings (language, volume)' },

  // ---------- Фаза I: меню персонажей + ачивки неписей ----------
  CHARACTERS_BTN_TITLE: { ru:'Персонажи', en:'Characters' },
  CHARACTERS_TITLE:     { ru:'Персонажи', en:'Characters' },
  CHAR_OPEN_HINT:       { ru:'нажми на персонажа, чтобы открыть его страницу', en:'tap a character to open their page' },
  CHAR_BACK_HINT:       { ru:'нажми на портрет, чтобы вернуться к списку', en:'tap the portrait to go back to the list' },
  CHAR_LORE_TITLE:      { ru:'Досье', en:'Dossier' },
  CHAR_ACH_TITLE:       { ru:'Ачивки', en:'Achievements' },
  CHAR_PASSIVES_TITLE:  { ru:'Пассивки', en:'Passives' },
  CHAR_REP_TITLE:       { ru:'Репутация', en:'Reputation' },
  CHAR_LORE_UNLOCKED:   { ru:'лорных фраз открыто', en:'lore phrases unlocked' },
  CHAR_REWARD_TITLE:    { ru:'Награда за полный комплект', en:'Full-set reward' },
  REWARD_LOCKED:        { ru:'Доведи все ачивки этого непися до золота', en:'Bring all of this NPC’s achievements to gold' },
  REWARD_BACKGROUND:    { ru:'Особый задний фон', en:'Special background' },
  REWARD_BOTTLE:        { ru:'Новый облик бутыля', en:'New bottle look' },
  REWARD_UNLOCKED_NOTE: { ru:'открыто! (арт добавится позже)', en:'unlocked! (art coming later)' },
  TIER_NONE:   { ru:'не открыто', en:'locked' },
  TIER_BRONZE: { ru:'бронза', en:'bronze' },
  TIER_SILVER: { ru:'серебро', en:'silver' },
  TIER_GOLD:   { ru:'золото', en:'gold' },
  NPC_ACH_TOAST_PREFIX: { ru:'Ачивка непися:', en:'NPC achievement:' },
  LORE_TOAST_PREFIX:    { ru:'Открыта лорная фраза:', en:'Lore phrase unlocked:' },
  REP_TOAST_PREFIX:     { ru:'Репутация выросла:', en:'Reputation up:' },
  REWARD_TOAST_PREFIX:  { ru:'Награда получена:', en:'Reward unlocked:' },
  PASSIVE_LEVEL_LABEL:  { ru:'реп. ур.', en:'rep lv.' },
  REP_L4_NOTE:          { ru:'реп. ур.{n} открывает сложность 4', en:'rep lv.{n} unlocks difficulty 4' },

  // ---------- Фаза J: пассивки ----------
  PASSIVES_BTN_TITLE:   { ru:'Пассивки', en:'Passives' },
  PASSIVES_TITLE:       { ru:'⚡ Пассивки', en:'⚡ Passives' },
  PASSIVES_SLOTS:       { ru:'Активно', en:'Active' },
  PASSIVES_HINT:        { ru:'До 3 пассивок на цикл. Состав фиксируется после первого заказа цикла.', en:'Up to 3 passives per cycle. Locked in after the first order of the cycle.' },
  PASSIVES_LOCKED_NOTE: { ru:'Цикл уже начался — поменять состав можно будет с нового цикла.', en:'The cycle has started — you can change your picks next cycle.' },
  PASSIVES_EMPTY:       { ru:'Пока нет открытых пассивок. Подними репутацию у неписей — каждый её уровень открывает новую.', en:'No passives unlocked yet. Raise NPC reputation — every level unlocks a new one.' },
  PASSIVES_FULL_NOTE:   { ru:'Заняты все 3 слота — сними одну, чтобы выбрать другую.', en:'All 3 slots are in use — deselect one to pick another.' },
  PASSIVE_SCOPE_GLOBAL: { ru:'все задания', en:'all orders' },
  PASSIVE_SCOPE_NPC:    { ru:'только этот непись', en:'this NPC only' },
};

// ---------- СТИКЕРЫ РЕЗУЛЬТАТА ----------
// Чтобы заменить на картинку: sticker может быть путём к файлу,
// например perfect: 'assets/ui/sticker_perfect.png' — game.js поймёт сам.
const STICKERS = {
  perfect: [
    'assets/ui/perfect1.png',
    'assets/ui/perfect2.png',
    'assets/ui/perfect3.png',
  ],
  good: [
    'assets/ui/good1.png',
    'assets/ui/good2.png',
    'assets/ui/good3.png',
  ],
  bad: [
    'assets/ui/bad1.png',
    'assets/ui/bad2.png',
    'assets/ui/bad3.png',
  ]
};

/* ---------- ПРИШЕЛЬЦЫ ----------
   Каждому НПС можно добавить поле img: 'assets/npc/имя.png' —
   тогда вместо эмодзи покажется картинка (PNG с прозрачным фоном).
   Пример:
   { tier:1, ..., emoji:'🛰', img:'assets/npc/drone.png', ... }

   МОЖНО СПИСОК ВАРИАНТОВ — игра выберет случайный при каждом визите:
   img: ['assets/npc/drone1.png','assets/npc/drone2.png','assets/npc/drone3.png'],
   (то же работает и для стикеров в STICKERS)

   name и flavors теперь объекты { ru:..., en:... } — см. пояснение
   вверху файла. ff — реплики для фокус-заказов: bubbles / color / size,
   тоже в формате { ru:[...], en:[...] } на каждый фокус.
*/
// ---------- NPCs & difficulty ----------
  const DIFFICULTIES = [
    { tier:1, id:'drone', type:'normal', emoji:'🛰', img: [
       'assets/npc/drone.png',
       'assets/npc/drone1.png',
       'assets/npc/drone2.png',
       'assets/npc/drone3.png',
       'assets/npc/drone4.png',
       'assets/npc/drone5.png',
       'assets/npc/drone6.png',
       'assets/npc/drone7.png',
       'assets/npc/drone8.png',
       'assets/npc/drone9.png'],
      name:{ ru:'Служебный дрон', en:'Service Drone' },
      flavors:{ ru:[
        'Жидкость для омывателя звездолёта. Любая сойдёт.',
        'Смесь для протирки палубы. Без изысков.',
        'Стандартный заказ. Плюс-минус — не страшно.'
      ], en:[
        'Starship windshield fluid. Anything will do.',
        'A deck-cleaning mix. Nothing fancy needed.',
        'A standard order. Give or take, no big deal.'
      ]},
      ff:{
        bubbles:{ ru:['Датчики требуют: сгустки — по спецификации. Остальное — допуск.','Пересчитай сгустки. Дважды. Инструкция.'],
                  en:['Sensors require blobs to spec. Everything else has tolerance.','Recount the blobs. Twice. Per the manual.'] },
        color:{ ru:['Спектр должен совпасть с образцом. Иначе сканер не примет.','Колер — по каталогу. Строго.'],
                en:['The spectrum must match the sample, or the scanner will reject it.','Color per the catalog. Strictly.'] },
        size:{ ru:['Объём — критичен. В мой бак другое не влезет.','Габариты по накладной, пожалуйста.'],
               en:['Volume is critical. Nothing else fits my tank.','Dimensions per the invoice, please.'] }
      },
      memorizeMs:6000, craftMs:22000, colorSteps:6, sizeSteps:5, countMax:5, bsizeSteps:5, reward:50,
      // ---------- Фаза E ----------
      // Только у ЭТОГО конкретного НПС (стартовый служебный дрон) есть
      // 4-й уровень сложности регуляторов. Остальные тайтл-1 (и другие)
      // НПС его пока не получают — level4 НЕ наследуется в EXTRA_NPCS
      // (см. tierPool() в game.js, тот же приём что и с img).
      level4:true },
    { tier:2, id:'tentacloid', type:'normal', emoji:'🐙', img: 'assets/npc/tentacloid.png',
      name:{ ru:'Тентаклоид', en:'Tentacloid' },
      flavors:{ ru:[
        'Моим щупальцам нравится, когда красиво. Сделай красиво.',
        'Смесь для настроения. Удиви меня, торговец.',
        'Что-нибудь эдакое. Ты понял. Или не понял. Сделай.'
      ], en:[
        'My tentacles like things pretty. Make it pretty.',
        'A mood mix. Surprise me, merchant.',
        "Something... you know. Or maybe you don't. Just make it."
      ]},
      ff:{
        bubbles:{ ru:['Щупальца любят перебирать сгустки. Их должно быть ровно столько, сколько я показал!','Сгустки! Главное — сгустки! Остальное щупальца простят.'],
                  en:['My tentacles love sorting through blobs. There must be exactly as many as I showed you!','Blobs! The blobs are what matter! My tentacles will forgive the rest.'] },
        color:{ ru:['Этот оттенок напоминает мне море моей планеты... Попади в него. Умоляю.','Цвет! Точный цвет! Иначе настроение испортится на декаду.'],
                en:["This shade reminds me of my homeworld's sea... Nail it. I'm begging you.",'The color! The exact color! Or my mood sours for a decade.'] },
        size:{ ru:['Контейнер должен лечь в присоску идеально. Размер решает всё.','Габариты! Мои щупальца чувствительны к габаритам!'],
               en:['The container must fit my sucker perfectly. Size decides everything.','Dimensions! My tentacles are sensitive to dimensions!'] }
      },
      memorizeMs:5500, craftMs:17000, colorSteps:9, sizeSteps:7, countMax:7, bsizeSteps:7, reward:85 },
    { tier:3, id:'gourmet_vega', type:'normal', emoji:'👾', img: 'assets/npc/gurman.png',
      name:{ ru:'Гурман с Веги', en:'Gourmet from Vega' },
      flavors:{ ru:[
        'Это приправа к ужину. Ошибёшься — ужин обидится.',
        'Тонкий вкус требует тонкой работы. Приступай.',
        'Мой прошлый поставщик плакал. Не повторяй его путь.'
      ], en:[
        "This is a seasoning for dinner. Get it wrong, and dinner will be offended.",
        'A subtle taste demands subtle work. Proceed.',
        "My last supplier wept. Don't follow in his footsteps."
      ]},
      ff:{
        bubbles:{ ru:['Сгустки — это специи блюда. Число и калибр — как в рецепте, будь любезен.','Текстура! Всё дело в текстуре сгустков. Гурман чувствует каждый.'],
                  en:["Blobs are the dish's spices. Number and caliber, per the recipe, if you please.",'Texture! It\u2019s all about the blobs\u2019 texture. A gourmet feels every one.'] },
        color:{ ru:['Цвет соуса — половина вкуса. Мой глаз не обманешь.','Спектр подачи важнее самой подачи. Попади в тон.'],
                en:["The sauce's color is half the flavor. You can't fool my eye.","The presentation's spectrum matters more than the presentation itself. Hit the tone."] },
        size:{ ru:['Порция должна быть выверена. Объём и калибр — до грамма.','Размер имеет вкус. Поверь гурману.'],
               en:['The portion must be precise. Volume and caliber, to the gram.','Size has a flavor. Trust the gourmet.'] }
      },
      memorizeMs:5000, craftMs:13800, colorSteps:14, sizeSteps:11, countMax:10, bsizeSteps:11, reward:130 },
    { tier:4, id:'logic9', type:'normal', emoji:'🤖', img: 'assets/npc/kai-9.png',
      name:{ ru:'Логик-9', en:'Logic-9' },
      flavors:{ ru:[
        'СМЕСЬ. ОХЛАЖДЕНИЕ. РЕАКТОР. ТОЧНОСТЬ. ОБЯЗАТЕЛЬНА.',
        'ОТКЛОНЕНИЕ. НЕДОПУСТИМО. ПОВТОРЯЮ. НЕДОПУСТИМО.',
        'ВВОД: ИДЕАЛ. ИНАЧЕ: ОТКАЗ. СИСТЕМА. ЖДЁТ.'
      ], en:[
        'MIXTURE. COOLING. REACTOR. PRECISION. MANDATORY.',
        'DEVIATION. UNACCEPTABLE. REPEAT. UNACCEPTABLE.',
        'INPUT: IDEAL. ELSE: REJECT. SYSTEM. WAITING.'
      ]},
      ff:{
        bubbles:{ ru:['ПРИОРИТЕТ: СГУСТКИ. ЧИСЛО. КАЛИБР. ДОПУСК: НОЛЬ.','СГУСТКИ = КАТАЛИЗАТОР. ОШИБКА = ВЗРЫВ. СЧИТАЙ.'],
                  en:['PRIORITY: BLOBS. COUNT. CALIBER. TOLERANCE: ZERO.','BLOBS = CATALYST. ERROR = EXPLOSION. COUNT.'] },
        color:{ ru:['ПРИОРИТЕТ: СПЕКТР. ДЛИНА ВОЛНЫ. СОВПАДЕНИЕ. ТРЕБУЕТСЯ.','СПЕКТР ≠ ОБРАЗЕЦ → РЕАКТОР ≠ РАБОТАЕТ.'],
                en:['PRIORITY: SPECTRUM. WAVELENGTH. MATCH. REQUIRED.','SPECTRUM ≠ SAMPLE → REACTOR ≠ FUNCTIONAL.'] },
        size:{ ru:['ПРИОРИТЕТ: ОБЪЁМ. ГЕОМЕТРИЯ. СОВМЕСТИМОСТЬ. ПРОВЕРЬ.','ОБЪЁМ. КАЛИБР. ГНЕЗДО ЖДЁТ ТОЧНОСТИ.'],
               en:['PRIORITY: VOLUME. GEOMETRY. COMPATIBILITY. VERIFY.','VOLUME. CALIBER. SOCKET AWAITS PRECISION.'] }
      },
      memorizeMs:4500, craftMs:10000, colorSteps:24, sizeSteps:19, countMax:12, bsizeSteps:19, reward:180 },
    { tier:5, id:'last_of_ir', type:'normal', emoji:'👁', img: 'assets/npc/ir.png',
      name:{ ru:'Последний из Ир', en:'Last of the Ir' },
      flavors:{ ru:[
        'Моя раса угасает. Эта смесь — наш последний рассвет.',
        'Ты держишь в руках память миллиона поколений. Не урони.',
        'Сделай так, будто вселенная смотрит. Она смотрит.'
      ], en:[
        'My race is fading. This mixture is our final dawn.',
        "You hold the memory of a million generations in your hands. Don't drop it.",
        'Make it as if the universe were watching. It is.'
      ]},
      ff:{
        bubbles:{ ru:['Каждый сгусток — душа одного из нас. Сосчитай их все. До единого.','В сгустках — семена. Число и размер решат, взойдут ли они.'],
                  en:["Each blob is the soul of one of us. Count them all. Every last one.","The blobs hold seeds. Number and size decide whether they'll sprout."] },
        color:{ ru:['Этот спектр — цвет неба, которого больше нет. Верни его мне.','Наш мир был именно такого оттенка. Ошибёшься — он умрёт дважды.'],
                en:['That spectrum is the color of a sky that no longer exists. Give it back to me.','Our world was exactly that shade. Get it wrong, and it dies twice.'] },
        size:{ ru:['Сосуд должен вместить всё, что от нас осталось. Ни каплей меньше.','Объём — это ковчег. Точность — это надежда.'],
               en:['The vessel must hold everything left of us. Not a drop less.','Volume is the ark. Precision is hope.'] }
      },
      memorizeMs:4000, craftMs:7500, colorSteps:37, sizeSteps:26, countMax:14, bsizeSteps:26, reward:240 }
  ];

  const SPECIAL_ORDERS = [
    { tier:5, id:'nebula_chef', type:'shape', emoji:'🦑', img: 'assets/npc/chef.png',
      name:{ ru:'Шеф туманности', en:'Nebula Chef' },
      flavors:{ ru:[
        'Форма сосуда — часть рецепта. Мой соус этого требует!',
        'В моей кухне геометрия — это специя. Не перепутай силуэт!',
        'Сосуд не той формы испортит подачу. А подача — это всё.'
      ], en:[
        "The vessel's shape is part of the recipe. My sauce demands it!",
        "In my kitchen, geometry is a spice. Don't mix up the silhouette!",
        'The wrong-shaped vessel ruins the presentation. And presentation is everything.'
      ]},
      memorizeMs:6500, craftMs:20000, colorSteps:10, sizeSteps:8, countMax:8, bsizeSteps:8, reward:300 },
    { tier:5, id:'twofaced_priestess', type:'gradient', emoji:'🧿', img: 'assets/npc/twofaced.png',
      name:{ ru:'Двуликая жрица', en:'Two-Faced Priestess' },
      flavors:{ ru:[
        'Смесь должна переливаться, как двойной закат моего мира.',
        'Два спектра. Одно целое. Я почувствую фальшь кожей.',
        'Мои боги говорят двумя цветами. Передай их речь точно.'
      ], en:[
        "The mixture must shimmer like my world's double sunset.",
        "Two spectrums. One whole. I'll feel a fake through my skin.",
        'My gods speak in two colors. Convey their words exactly.'
      ]},
      memorizeMs:7000, craftMs:20000, colorSteps:14, sizeSteps:8, countMax:8, bsizeSteps:8, reward:300 },
    { tier:5, id:'plasma_bartender', type:'moving', emoji:'🍹', img: 'assets/npc/barmen.png',
      name:{ ru:'Бармен плазма-бара', en:'Plasma-Bar Bartender' },
      flavors:{ ru:[
        'Сгустки у меня в баре не сидят на месте! Лови ритм!',
        'Живая смесь! Живая! Считай на лету, торговец!',
        'Мой фирменный коктейль дышит и мечется. Уследи-ка.'
      ], en:[
        "In my bar, the blobs don't sit still! Catch the rhythm!",
        'A living mixture! Alive! Count on the fly, merchant!',
        'My signature cocktail breathes and dashes about. Try to keep up.'
      ]},
      memorizeMs:7500, craftMs:18100, colorSteps:12, sizeSteps:8, countMax:10, bsizeSteps:8, reward:300 }
  ];

  const TIER_COLORS = {1:'var(--t1)',2:'var(--t2)',3:'var(--t3)',4:'var(--t4)',5:'var(--t5)'};

  // ---------- Фаза D: сложность регуляторов выбирается ТЕПЕРЬ на заказ ----------
  // (раньше — глобальная кнопка "УР.N" в шапке; теперь три плашки при клике
  // по карточке НПС). Множитель применяется к cfg.reward: чем меньше
  // регуляторов активно, тем легче задание — и тем ниже награда.
  // Правь смело — это просто коэффициенты.
  // 4 — только у стартового дрона (level4:true), см. Фазу E. Награда выше,
  // чем на 3-ем — регуляторов столько же, но добавляется механика "плохих"
  // пузырей, которая требует постоянного отвлечения внимания.
  const REG_DIFF_REWARD_MULT = { 1:0.3, 2:0.6, 3:1.0, 4:1.4 };

  // ---------- бонус за скорость по уровням ----------
  // На 1-ом уровне активен всего один регулятор (обычно только цвет) —
  // быть быстрым тривиально, поэтому бонуса за скорость там нет вообще.
  // На 3-ем уровне (все регуляторы) — самый большой потолок бонуса.
  // Число — это МАКСИМАЛЬНАЯ добавка к очкам (в долях), при 100% точности
  // и укладывании в первую треть таймера; см. SPEED_BONUS_MULT в game.js.
  // на 4-ом потолок бонуса чуть ниже, чем на 3-ем — внимание делится
  // между регуляторами и "плохими" пузырями, быть быстрым труднее
  const SPEED_BONUS_MULT = { 1:0, 2:0.35, 3:0.65, 4:0.5 };

  // ---------- Фаза G (доп.): вес сложности для "коллекционного" прогресса ----------
  // Проблема: раньше 1 идеальное зелье = +1 к ленте идеалов ВСЕГДА, независимо
  // от того, играл ли игрок на 1-ой сложности регуляторов с простеньким
  // непризом 1-го тира, или на 3-ей сложности с непизом 5-го тира. Это делало
  // лёгкую игру ровно таким же источником прогресса, как и тяжёлую.
  //
  // Решение: у каждого идеального зелья теперь есть "вес" =
  //   (cfg.reward / BASELINE_TIER_REWARD) * PROGRESS_DIFF_WEIGHT[regLevel]
  // где BASELINE_TIER_REWARD — награда тира 3 (см. ниже) — тир 3 сознательно
  // выбран "базовым" (вес 1.0 на 3-ей сложности регуляторов), как и просил ТЗ.
  // Первый множитель берётся из cfg.reward — то есть уже настроенного баланса
  // наград по тирам/НПС (50/85/130/180/240/300) — поэтому отдельную таблицу
  // "сложность непися" заводить не пришлось: если поправишь reward у НПС —
  // его вклад в прогресс само пересчитается тем же коэффициентом.
  // Второй множитель — насколько сильно урезаны регуляторы на выбранной
  // игроком сложности; сделан ЗАМЕТНО жёстче, чем REG_DIFF_REWARD_MULT
  // (экономика наград), чтобы разница в прогрессе была осязаемой, а не
  // просто "чуть меньше".
  // Используется в finalizeResult() (game.js) → PotionProfile.recordOrderResult()
  // (profile.js, поле r.count в perfectRibbon). Та же функция задумана как
  // общая "валюта прогресса" и для будущих ачивок (Фазы H/I) — там, где
  // порог должен зависеть не от голого числа заказов, а от того, насколько
  // сложными они были.
  const BASELINE_TIER_REWARD = DIFFICULTIES[2].reward; // тир 3 = 130, "нормальная" сложность
  const PROGRESS_DIFF_WEIGHT = { 1:0.12, 2:0.4, 3:1.0, 4:1.3 };

  // ---------- Фаза G: необязательные картинки для Коллекции ----------
  // Полностью опционально — без них всё работает на текущих
  // эмодзи/плейсхолдерах. Если добавляешь свои файлы — просто впиши сюда
  // путь (или массив путей — как и везде, выберется случайный вариант).
  //
  // 1) STICKERS.platinum — отдельная картинка для платиновой ленты в
  //    Коллекции (иначе используется STICKERS.perfect[0] с CSS-подсветкой).
  //    Пример: STICKERS.platinum = 'assets/ui/platinum1.png';
  //
  // 2) ALBUM_LOCK_ICON — картинка для ещё НЕ открытой ячейки альбома
  //    стикеров (иначе рисуется знак "?"). Пример:
  //    const ALBUM_LOCK_ICON = 'assets/ui/sticker_locked.png';
  const ALBUM_LOCK_ICON = null;

  // ---------- Фаза E: "плохие" пузыри (только уровень сложности 4) ----------
  // minSpawnMs/maxSpawnMs — пауза между появлением новых пузырей (мс).
  // growMs — сколько пузырь растёт от startRadius до popRadius, прежде
  // чем лопнет сам. maxAlive — сколько их может существовать одновременно
  // (больше двух — игрок не будет успевать следить за основными ползунками).
  const BAD_BUBBLE_CONFIG = {
    minSpawnMs: 1700,
    maxSpawnMs: 2300,
    growMs: 3000,
    startRadius: 3,
    popRadius: 15,
    maxAlive: 2
  };
  // сколько миллисекунд добавляется к таймеру "воссоздай смесь" на 4-ом
  // уровне сложности — компенсация за постоянные отвлечения на пузыри
  const LEVEL4_TIME_BONUS_MS = 4000;
  const FOCUS_ICONS = {
    bubbles: 'assets/ui/bubble.png',
    color: 'assets/ui/color.png',
    size: 'assets/ui/size.png'
  };
  const FOCUS_NAMES = { bubbles:{ ru:'сгустки', en:'blobs' }, color:{ ru:'спектр', en:'spectrum' }, size:{ ru:'габариты', en:'dimensions' } };
  const FOCUS_KEYS = {
    bubbles:['count','bsize'],
    color:['color','colorB','sat'],
    size:['size','bsize']
  };

  const SHAPE_NAMES = [
    { ru:'Капсула', en:'Capsule' }, { ru:'Блок', en:'Block' }, { ru:'Тубус', en:'Tube' },
    { ru:'Бочонок', en:'Barrel' }, { ru:'Песочные часы', en:'Hourglass' }, { ru:'Конус', en:'Cone' },
    { ru:'Сфероид', en:'Spheroid' }, { ru:'Гранёный', en:'Faceted' }, { ru:'Капля', en:'Droplet' }, { ru:'Кубышка', en:'Jug' }
  ];
  const SHAPE_PROFILES = [
    { points:[[0,0.85],[0.25,1],[0.5,1],[0.75,1],[1,0.9]], smooth:true },
    { points:[[0,0.9],[0.08,1],[0.5,1],[0.92,1],[1,0.9]], smooth:false },
    { points:[[0,0.5],[0.25,0.55],[0.5,0.55],[0.75,0.55],[1,0.5]], smooth:true },
    { points:[[0,0.7],[0.25,1.05],[0.5,1.15],[0.75,1.05],[1,0.8]], smooth:true },
    { points:[[0,0.9],[0.25,0.75],[0.5,0.35],[0.75,0.75],[1,0.9]], smooth:true },
    { points:[[0,0.22],[0.25,0.4],[0.5,0.65],[0.75,0.9],[1,1.0]], smooth:true },
    { points:[[0,0.28],[0.3,0.3],[0.55,0.55],[0.8,0.95],[1,0.8]], smooth:true },
    { points:[[0,0.55],[0.15,1],[0.5,1],[0.85,1],[1,0.55]], smooth:false },
    { points:[[0,0.3],[0.3,0.35],[0.6,0.78],[0.85,1.05],[1,0.9]], smooth:true },
    { points:[[0,1.0],[0.25,0.95],[0.5,0.68],[0.75,0.42],[1,0.32]], smooth:true }
  ];

  const STAGE_TABLE = [ [1,1,1],[2,2,3],[3,4,4],[4,4,4] ];
  const MAX_STAGE = STAGE_TABLE.length - 1;

  // ---------- Фаза G: черновой шаг уровня репутации ----------
  // Используется ТОЛЬКО для прогресс-бара в Коллекции (визуализация "на
  // будущее" из ТЗ). Настоящие пороги повышения уровня, привязанные к
  // пассивкам, проектируются отдельно в Фазе J — там это число может
  // измениться или стать разным для каждого НПС.
  const REP_LEVEL_STEP = 50;

  // ---------- Фаза H v2: общие ачивки С ПОРОГАМИ ----------
  // Переработка: вместо россыпи одинаковых карточек ("1000 рейтинга",
  // "5000 рейтинга"...) — ОДНА карточка на метрику с линейкой порогов.
  // Достиг порога — под ачивкой загорается следующий блок (цвета идут
  // по нарастающей: бронза → серебро → золото → платина → неон → ...).
  //
  // ====================== КАРТИНКИ АЧИВОК ======================
  // У каждой ачивки есть поле img — сейчас null, рисуется эмодзи из
  // icon. Чтобы поставить свою картинку: положи файл в assets/ach/
  // и впиши путь, например  img:'assets/ach/treasury.png'
  // game.js подхватит сам (тот же механизм, что у портретов НПС).
  // Рекомендуемый размер арта: квадрат ~128x128, PNG с прозрачностью.
  // =============================================================
  //
  // Поля:
  //  id       — стабильный ключ (хранится в профиле, НЕ переименовывать)
  //  icon     — эмодзи-заглушка
  //  img      — путь к картинке или null (см. блок выше)
  //  name     — название карточки { ru, en }
  //  desc     — за что даётся; показывается по наведению на карточку
  //  value(p) — чистая функция от window.PotionProfile.data:
  //             текущее значение метрики (game.js сверяет её с порогами
  //             после каждого заказа/цикла автоматически)
  //  t        — пороги блоков ПО ВОЗРАСТАНИЮ; блоков может быть сколько
  //             угодно — просто допиши число в конец массива
  // Ручные (manual:true): вместо value/t — массив tiers:[{hint:{ru,en}}]
  // (по подсказке на каждый порог); открываются из game.js вызовом
  // unlockManualAchievement(id, номерПорога) в нужный момент.
  const GENERAL_ACHIEVEMENTS = [
    { id:'total_score', icon:'💎', img:null,
      name:{ ru:'Казна лавки', en:'Shop treasury' },
      desc:{ ru:'Суммарный рейтинг, заработанный за всю историю лавки.', en:'Total rating earned across the shop\'s entire history.' },
      value:p => (p.stats.totalScoreEarned||0),
      t:[1000, 5000, 20000, 50000, 100000, 200000, 350000, 600000, 1000000] },

    { id:'cycle_score', icon:'📈', img:null,
      name:{ ru:'Рекордный цикл', en:'Record cycle' },
      desc:{ ru:'Лучший рейтинг, набранный за один цикл.', en:'Best rating earned in a single cycle.' },
      value:p => (p.stats.bestCycleScore||0),
      t:[800, 1500, 2500, 4000, 6000, 8500, 12000] },

    { id:'progress', icon:'🧪', img:null,
      name:{ ru:'Мастер смесей', en:'Mixture mastery' },
      desc:{ ru:'Взвешенный прогресс: годные и идеальные смеси, помноженные на сложность.', en:'Weighted progress: decent and perfect mixtures multiplied by difficulty.' },
      value:p => (p.stats.weightedProgress||0),
      t:[50, 150, 300, 600, 1000, 2500, 5000, 10000] },

    { id:'perfect_streak', icon:'✨', img:null,
      name:{ ru:'Безупречность', en:'Flawlessness' },
      desc:{ ru:'Лучшая серия идеальных зелий подряд.', en:'Best streak of perfect mixtures in a row.' },
      value:p => (p.streaks.perfectBest||0),
      t:[3, 5, 10, 15, 20, 30, 50] },

    { id:'goodplus_streak', icon:'⚙️', img:null,
      name:{ ru:'Конвейер', en:'Assembly line' },
      desc:{ ru:'Лучшая серия смесей подряд без единого брака.', en:'Best streak of mixtures without a single reject.' },
      value:p => (p.streaks.goodPlusBest||0),
      t:[10, 25, 50, 100, 200, 400] },

    { id:'bad_streak', icon:'💩', img:null,
      name:{ ru:'Чёрная полоса', en:'Rough patch' },
      desc:{ ru:'Серия браков подряд. Бывает. Носи с гордостью.', en:'Rejects in a row. It happens. Wear it proudly.' },
      value:p => (p.streaks.badBest||0),
      t:[3, 5, 10] },

    { id:'cycles', icon:'🔁', img:null,
      name:{ ru:'Ветеран лавки', en:'Shop veteran' },
      desc:{ ru:'Завершено полных циклов.', en:'Full cycles completed.' },
      value:p => (p.stats.cyclesCompleted||0),
      t:[5, 20, 50, 100, 250] },

    { id:'orders', icon:'📦', img:null,
      name:{ ru:'Поток заказов', en:'Order flow' },
      desc:{ ru:'Всего выполнено заказов.', en:'Total orders completed.' },
      value:p => (p.stats.totalOrders||0),
      t:[50, 200, 500, 1500, 4000, 10000] },

    // ---- ручные (открываются game.js в конкретный момент) ----
    { id:'speedrun', icon:'⚡', img:null, manual:true,
      name:{ ru:'Молния на пределе', en:'Lightning at the limit' },
      desc:{ ru:'Идеальное зелье тира 5 на максимальной сложности регуляторов, уложившись в первую треть таймера.', en:'A perfect tier-5 mixture at max regulator difficulty, finished within the first third of the timer.' },
      tiers:[
        { hint:{ ru:'Идеал тира 5 на макс. сложности в первую треть таймера', en:'Perfect tier-5 at max difficulty within the first third of the timer' } }
      ] },

    { id:'leaderboard', icon:'🏆', img:null, manual:true,
      name:{ ru:'Слава галактики', en:'Galactic fame' },
      desc:{ ru:'Твоё место в глобальном рейтинге.', en:'Your place on the global leaderboard.' },
      tiers:[
        { hint:{ ru:'Попади в топ-10 глобального рейтинга', en:'Reach the global top 10' } },
        { hint:{ ru:'Займи 1-е место в глобальном рейтинге', en:'Take 1st place on the global leaderboard' } }
      ] }
  ];

  // Миграция профилей со СТАРЫХ одиночных ачивок (Фаза H v1) на пороги:
  // старый id → [новый id, номер порога]. game.js прогоняет один раз при
  // загрузке. Авто-ачивки и так пересчитаются из статистики профиля, но
  // ручные ("молния", рейтинг) без этой карты потерялись бы.
  const GENERAL_ACH_MIGRATION = {
    weighted_50:['progress',1], weighted_300:['progress',3], weighted_1000:['progress',5],
    pstreak_3:['perfect_streak',1], pstreak_5:['perfect_streak',2],
    pstreak_10:['perfect_streak',3], pstreak_20:['perfect_streak',5],
    gstreak_10:['goodplus_streak',1], gstreak_25:['goodplus_streak',2],
    bstreak_3:['bad_streak',1], bstreak_5:['bad_streak',2],
    score_1000:['total_score',1], score_5000:['total_score',2],
    score_20000:['total_score',3], score_50000:['total_score',4],
    cycle_score_800:['cycle_score',1], cycle_score_1500:['cycle_score',2],
    cycles_5:['cycles',1], cycles_20:['cycles',2],
    orders_50:['orders',1], orders_200:['orders',2], orders_500:['orders',3],
    speedrun_master:['speedrun',1],
    leaderboard_top10:['leaderboard',1], leaderboard_king:['leaderboard',2]
  };

/* ============================================================
   ПАК ПРИШЕЛЬЦЕВ: 12 новых НПС (по 2-3 на каждый уровень).
   ВСТАВИТЬ В КОНЕЦ content.js — ничего в старом коде не менять,
   твои правки (портреты, стикеры) не пострадают.

   Каждому можно добавить img: 'assets/npc/имя.png'
   или img: ['вариант1.png','вариант2.png'] — как обычно.

   Настройки сложности (таймеры, шаги, награда) новые НПС
   наследуют от своего уровня автоматически.
   ============================================================ */

const EXTRA_NPCS = [

  /* ---------- УРОВЕНЬ 1 — простые бытовые ---------- */
  { tier:1, id:'janitor', emoji:'🪣', img: 'assets/npc/janitor.png',
    name:{ ru:'Уборщик Пятого Дока', en:'Dock Five Janitor' },
    flavors:{ ru:[
      'Ведро смеси для мытья шлюза. Только не пахучую.',
      'Мне бы попроще. Полы сами себя не отдраят.',
      'Что подешевле. Начальство всё равно не заметит.'
    ], en:[
      "A bucket of mix for scrubbing the airlock. Just not a smelly one.",
      "Something simple would do. The floors won't scrub themselves.",
      "Whatever's cheapest. The bosses won't notice anyway."
    ]},
    ff:{
      bubbles:{ ru:['Сгустки нужны по счёту — ими я оттираю углы.','Начальство пересчитает сгустки. Оно всегда пересчитывает.'],
                en:['I need the blobs by the count — I use them to scrub the corners.','The bosses will recount the blobs. They always do.'] },
      color:{ ru:['Цвет — как на этикетке моего старого ведра. Ностальгия.','Не тот колер — и пятна будут видны. Проверено.'],
              en:['The color, like the label on my old bucket. Nostalgia.','Wrong color and the stains will show. Tested and proven.'] },
      size:{ ru:['Ровно под моё ведро. Ни больше, ни меньше.','Габарит важен: шкафчик для инвентаря у меня крошечный.'],
             en:['Exactly to fit my bucket. Not a drop more or less.','Size matters: my supply locker is tiny.'] }
    } },
  { tier:1, id:'intern_beep', emoji:'📦', img: 'assets/npc/bip.png',
    name:{ ru:'Стажёр Бип', en:'Intern Beep' },
    flavors:{ ru:[
      'Э-это мой первый заказ... Смесь. Пожалуйста. Любую?',
      'Шеф сказал взять смесь. Не сказал какую. Помогите.',
      'Я всё записал! Кажется. Смесь. Да. Смесь.'
    ], en:[
      "Th-this is my first order... A mixture. Please. Any kind?",
      "The boss said get a mixture. Didn't say which one. Help.",
      "I wrote it all down! I think. A mixture. Yes. A mixture."
    ]},
    ff:{
      bubbles:{ ru:['Шеф с-сказал: главное — сгустки! Число и размер! Я записал!','Если сгустки не сойдутся, меня уволят. Наверное. Не знаю!'],
                en:['The boss s-said: the blobs matter most! Count and size! I wrote it down!',"If the blobs don't match, I'll get fired. Probably. I don't know!"] },
      color:{ ru:['Тут в записке: «цвет — точь-в-точь». Подчёркнуто два раза!','Шеф различает миллион оттенков. Я — нет. Спасите.'],
              en:["The note says: 'color — exact match.' Underlined twice!","The boss can tell a million shades apart. I can't. Save me."] },
      size:{ ru:['Объём по накладной! Я мерил линейкой! Дважды!','Если не влезет в ячейку доставки — п-пересдача...'],
             en:['Volume per the invoice! I measured it with a ruler! Twice!',"If it doesn't fit the delivery slot — I-I'll have to redo it..."] }
    } },
  { tier:1, id:'trucker_chrome', emoji:'🚛', img: 'assets/npc/khrom.png',
    name:{ ru:'Дальнобойщик Хром', en:'Long-Haul Chrome' },
    flavors:{ ru:[
      'Смесь в дорогу. Тыща парсеков впереди, не до изысков.',
      'Залей чего-нибудь. Гружёный стою, время — топливо.',
      'Как обычно. Ну, как обычно у вас тут наливают.'
    ], en:[
      "A mixture for the road. A thousand parsecs ahead, no time for fancy.",
      "Pour me something. I'm loaded up and waiting, time is fuel.",
      "The usual. Well, whatever's usual around here."
    ]},
    ff:{
      bubbles:{ ru:['Сгустки — чтоб в дороге было что разглядывать. Точное число, да.','Мне по сгусткам движок калибруют, не спрашивай как.'],
                en:["Blobs — so there's something to look at on the road. Exact count, yeah.","They calibrate my engine by the blobs, don't ask how."] },
      color:{ ru:['Цвет как у зари над Восьмым Кольцом. Соскучился.','По цвету на посту проверяют. Не подведи, торговец.'],
              en:['Color like the dawn over the Eighth Ring. I miss it.',"They check the color at the checkpoint. Don't let me down, merchant."] },
      size:{ ru:['В держатель кабины должно встать. Размер — строго.','Большая не влезет, малая будет брякать. Ты понял.'],
             en:['It has to fit the cab holder. Size — strict.',"Too big won't fit, too small will rattle. You get it."] }
    } },

  /* ---------- УРОВЕНЬ 2 — с запросами ---------- */
  { tier:2, id:'fashionista', emoji:'💅', img: 'assets/npc/fashionista.png',
    name:{ ru:'Модница с Кассиопеи', en:'Cassiopeia Fashionista' },
    flavors:{ ru:[
      'Эта смесь пойдёт к моему новому панцирю. Постарайся.',
      'Хочу, чтобы все на станции обзавидовались.',
      'Сделай красиво. Красиво — это ты должен чувствовать.'
    ], en:[
      'This mixture needs to match my new shell. Do your best.',
      'I want everyone on the station to be jealous.',
      'Make it pretty. Pretty is something you have to feel.'
    ]},
    ff:{
      bubbles:{ ru:['Сгустки — это аксессуары. Их число решает весь образ!','Крупные сгустки в этом сезоне — вульгарно. Или нет? Попади!'],
                en:['Blobs are accessories. Their number makes the whole look!','Big blobs this season are vulgar. Or are they? Get it right!'] },
      color:{ ru:['Оттенок должен совпасть с моим маникюром. Идеально.','Не тот тон — и я расплачусь. Прямо у прилавка.'],
              en:["The shade has to match my manicure. Perfectly.",'Wrong tone and I\u2019ll cry. Right here at the counter.'] },
      size:{ ru:['Флакон под мою сумочку. Миллиметр в миллиметр.','Габарит — это силуэт. Силуэт — это всё.'],
             en:['The vial has to fit my purse. Millimeter for millimeter.','Size is silhouette. Silhouette is everything.'] }
    } },
  { tier:2, id:'collector_gz', emoji:'🐌', img: 'assets/npc/collector.png',
    name:{ ru:'Коллекционер Гз', en:'Collector Gz' },
    flavors:{ ru:[
      'В мою коллекцию не хватает... вот такой. Медленно повтори.',
      'Я собираю смеси триста лет. Удиви меня. Не спеша.',
      'Эта полка пустует уже decade. Заполни её достойно.'
    ], en:[
      'My collection is missing... one like this. Slowly, repeat it.',
      "I've collected mixtures for three hundred years. Surprise me. Unhurried.",
      'This shelf has sat empty for a decade. Fill it worthily.'
    ]},
    ff:{
      bubbles:{ ru:['В каталоге указано число сгустков. Каталог не ошибается.','Размер сгустков сверяю с эталоном. Всегда. Медленно.'],
                en:['The catalog specifies the blob count. The catalog is never wrong.','I check the blob size against the reference. Always. Slowly.'] },
      color:{ ru:['Оттенок номер 4402 по моей картотеке. Будь любезен.','Цвет выцветет через век — потому сейчас он должен быть точным.'],
              en:['Shade number 4402 in my index. If you please.','The color will fade in a century — so it must be exact now.'] },
      size:{ ru:['Полка рассчитана до микрона. Триста лет рассчитывала.','Не тот объём нарушит симметрию коллекции. Немыслимо.'],
             en:['The shelf is calculated to the micron. Three hundred years of calculating.',"The wrong volume would break the collection's symmetry. Unthinkable."] }
    } },
  { tier:2, id:'dj_pulsar', emoji:'🎧', img: 'assets/npc/dj.png',
    name:{ ru:'Диджей Пульсар', en:'DJ Pulsar' },
    flavors:{ ru:[
      'Нужна смесь под сегодняшний сет. Чтоб вайб совпал.',
      'Слушай ритм станции... вот под него и намешай.',
      'Сделай что-то, что звучит. Ты понял. Звучит!'
    ], en:[
      "Need a mixture for tonight's set. Gotta match the vibe.",
      "Listen to the station's rhythm... mix it to that.",
      'Make something that sounds. You get it. Sounds!'
    ]},
    ff:{
      bubbles:{ ru:['Сгустки — это биты! Число решает грув, чувак!','Размер сгустков = глубина баса. Не промахнись по низам!'],
                en:['Blobs are beats! The count decides the groove, dude!',"Blob size = bass depth. Don't miss the low end!"] },
      color:{ ru:['Цвет — это тональность. Свети мне точно в ноту!','Под мой световой пульт. Оттенок в оттенок, иначе диссонанс!'],
              en:['Color is the key. Light me up exactly on the note!','To match my light board. Shade for shade, or it\u2019s dissonance!'] },
      size:{ ru:['Флакон встанет на пульт. Габарит — как слот под винил.','Объём — это громкость. Мне нужна точная громкость!'],
             en:['The vial goes on the board. Size — like a vinyl slot.','Volume is loudness. I need exact loudness!'] }
    } },

  /* ---------- УРОВЕНЬ 3 — тонкая работа ---------- */
  { tier:3, id:'perfumer', emoji:'🧴', img: 'assets/npc/parfumer.png',
    name:{ ru:'Парфюмер Тысячи Лун', en:'Perfumer of a Thousand Moons' },
    flavors:{ ru:[
      'Это база для аромата, который вспомнят через век.',
      'Нюанс. Всё решает нюанс. Приступай осторожно.',
      'Мои ноздри чувствуют ошибку до того, как ты её совершишь.'
    ], en:[
      "This is the base for a scent they'll remember a century from now.",
      'Nuance. Nuance decides everything. Proceed carefully.',
      "My nose senses a mistake before you've even made it."
    ]},
    ff:{
      bubbles:{ ru:['Сгустки задают шлейф аромата. Число — это стойкость.','Калибр сгустков — это верхняя нота. Тоньше, ещё тоньше.'],
                en:["Blobs set the scent's trail. The count is its longevity.",'Blob caliber is the top note. Finer, finer still.'] },
      color:{ ru:['Оттенок — это первое впечатление аромата. Не смажь его.','Цвет обещает запах. Обмани цветом — обманешь всех.'],
              en:["The shade is the scent's first impression. Don't smudge it.",'Color promises a smell. Fake the color and you fake everyone.'] },
      size:{ ru:['Флакон — половина парфюма. Объём выверен веками.','Пропорции сосуда диктуют испарение. Точность, друг мой.'],
             en:["The vial is half the perfume. The volume's been refined for centuries.","The vessel's proportions dictate evaporation. Precision, my friend."] }
    } },
  { tier:3, id:'guild_inspector', emoji:'🔍', img: 'assets/npc/inspector.png',
    name:{ ru:'Инспектор Гильдии', en:'Guild Inspector' },
    flavors:{ ru:[
      'Плановая проверка. Изготовьте образец по регламенту.',
      'Гильдия следит за качеством. Сегодня — за вашим.',
      'Отклонения фиксируются в протокол. Начинайте.'
    ], en:[
      'A scheduled inspection. Produce a sample per regulations.',
      'The Guild watches quality. Today — yours.',
      'Deviations get logged in the record. Begin.'
    ]},
    ff:{
      bubbles:{ ru:['Пункт 7.3: число и калибр включений — по образцу. Приступайте.','Сгустки пересчитываются комиссией. Дважды.'],
                en:['Clause 7.3: inclusion count and caliber, per the sample. Proceed.','The commission recounts the blobs. Twice.'] },
      color:{ ru:['Спектрограмма прилагается к протоколу. Совпадение обязательно.','Цветовое отклонение — это уже пункт 12. Штрафной.'],
              en:['The spectrogram is attached to the record. A match is mandatory.','Color deviation falls under clause 12. A penalty clause.'] },
      size:{ ru:['Объём сверяется с эталоном Гильдии. До деления.','Габаритный допуск исчерпан предыдущим торговцем. Ноль.'],
             en:['Volume is checked against the Guild standard. To the mark.','The size tolerance was used up by the previous merchant. Zero left.'] }
    } },
  { tier:3, id:'apothecary_mo', emoji:'🦎', img: 'assets/npc/apothecary.png',
    name:{ ru:'Аптекарь Мо', en:'Apothecary Mo' },
    flavors:{ ru:[
      'Это лекарство. Рука не должна дрогнуть. Твоя.',
      'Пациент ждёт. Дозировка — не место для творчества.',
      'Я доверяю тебе рецепт. Не заставляй жалеть.'
    ], en:[
      'This is medicine. The hand must not shake. Yours.',
      'The patient is waiting. Dosage is no place for creativity.',
      "I'm trusting you with the prescription. Don't make me regret it."
    ]},
    ff:{
      bubbles:{ ru:['Сгустки — действующее вещество. Число — это доза.','Крупнее сгусток — сильнее эффект. Точно по рецепту.'],
                en:['The blobs are the active ingredient. The count is the dose.','Bigger blob, stronger effect. Exactly per the prescription.'] },
      color:{ ru:['Цвет говорит о концентрации. Мне — говорит всё.','Не тот оттенок я верну. Пациенту хуже не сделаю.'],
              en:['Color speaks of concentration. To me, it says everything.',"The wrong shade, I'll send back. I won't make the patient worse."] },
      size:{ ru:['Объём курса рассчитан на цикл лечения. Ровно.','Флакон под дозатор. Размер критичен, торговец.'],
             en:['The course volume is calculated for the treatment cycle. Exactly.','The vial has to fit the dispenser. Size is critical, merchant.'] }
    } },

  /* ---------- УРОВЕНЬ 4 — жёсткие требования ---------- */
  { tier:4, id:'swarm_navigator', emoji:'🐝', img: 'assets/npc/swarm.png',
    name:{ ru:'Навигатор Роя', en:'Swarm Navigator' },
    flavors:{ ru:[
      'МЫ говорим одним голосом. МЫ требуем точности.',
      'Рой чувствует фальшь тысячей рецепторов. МЫ ждём.',
      'Ошибка перед одним — ошибка перед всеми НАМИ.'
    ], en:[
      'WE speak with one voice. WE demand precision.',
      'The Swarm senses falseness with a thousand receptors. WE wait.',
      'A mistake before one is a mistake before all of US.'
    ]},
    ff:{
      bubbles:{ ru:['Каждый сгусток — узел НАШЕЙ сети. Число священно.','Рой пересчитает. Рой всегда пересчитывает.'],
                en:['Each blob is a node in OUR network. The count is sacred.','The Swarm will recount. The Swarm always recounts.'] },
      color:{ ru:['НАШИ фасеточные глаза видят миллион оттенков. Попади в один.','Цвет — это сигнал Роя. Исказишь — Рой заблудится.'],
              en:['OUR compound eyes see a million shades. Hit the right one.',"Color is the Swarm's signal. Distort it, and the Swarm gets lost."] },
      size:{ ru:['Сота имеет размер. Смесь имеет размер соты.','Объём делится на всех НАС. Он должен делиться точно.'],
             en:["The cell has a size. The mixture has the cell's size.",'The volume is divided among all of US. It must divide exactly.'] }
    } },
  { tier:4, id:'vex', emoji:'🔧', img: 'assets/npc/vex.png',
    name:{ ru:'Хирург-механик Векс', en:'Surgeon-Mechanic Vex' },
    flavors:{ ru:[
      'Смесь пойдёт в открытый реактор. Представь мою руку. Не дрогни.',
      'Я не прощаю люфтов. Ни в железе, ни в людях.',
      'Пациент — крейсер на девять тысяч душ. Работай соответственно.'
    ], en:[
      "This mixture goes into an open reactor. Picture my hand. Don't flinch.",
      "I don't forgive slack. Not in steel, not in people.",
      'The patient is a cruiser with nine thousand souls aboard. Work accordingly.'
    ]},
    ff:{
      bubbles:{ ru:['Сгустки лягут в клапаны. Число клапанов тебе известно из образца.','Калибр сгустка = калибр канала. Зазор недопустим.'],
                en:['The blobs go into the valves. You know the valve count from the sample.','Blob caliber = channel caliber. No clearance allowed.'] },
      color:{ ru:['По цвету я читаю состав. Совпадёт цвет — совпадёт состав.','Оттенок — мой единственный индикатор в темноте отсека.'],
              en:['I read the composition by color. Match the color, match the composition.','Shade is my only indicator in the darkness of the compartment.'] },
      size:{ ru:['Полость под смесь вырезана лазером. Объём — до капли.','Габарит инструмента не обсуждается. Никогда.'],
             en:['The cavity for the mixture was laser-cut. Volume — to the drop.',"The instrument's size is not up for discussion. Ever."] }
    } },
  { tier:4, id:'racer_kai', emoji:'🏁', img: 'assets/npc/kai.png',
    name:{ ru:'Гонщица Кай', en:'Racer Kai' },
    flavors:{ ru:[
      'Присадка в бак. Финал через час. Не тормози и не косячь.',
      'Мой болид чувствует смесь на первом же вираже. И я тоже.',
      'Секунды решают гонку. Точность решает секунды. Погнали.'
    ], en:[
      "Additive for the tank. Final's in an hour. Don't stall, don't screw up.",
      'My racer feels the mixture on the first turn. So do I.',
      "Seconds decide the race. Precision decides the seconds. Let's go."
    ]},
    ff:{
      bubbles:{ ru:['Сгустки — это впрыск. Число под мой движок, не под чей-то!','Крупный сгусток на вираже — это занос. Калибруй!'],
                en:["Blobs are the injection. The count is for MY engine, not somebody else's!",'A big blob on the turn means a skid. Calibrate!'] },
      color:{ ru:['Цвет топлива — под мою ливрею. Спонсоры проверят!','По оттенку механик читает октан. Не подставь его.'],
              en:["The fuel's color has to match my livery. Sponsors will check!","My mechanic reads the octane by the shade. Don't screw him over."] },
      size:{ ru:['Бак утоплен в раму. Объём — впритык, так и надо.','Лишний габарит — лишний вес. Лишний вес — второе место.'],
             en:["The tank's built into the frame. Volume's tight, as it should be.",'Extra size is extra weight. Extra weight is second place.'] }
    } },

  /* ---------- УРОВЕНЬ 5 — на грани миров ---------- */
  { tier:5, id:'archivist', emoji:'📜', img: 'assets/npc/archivist.png',
    name:{ ru:'Хранитель Архива', en:'Keeper of the Archive' },
    flavors:{ ru:[
      'Эта смесь — закладка между главами вселенной. Не смажь чернила.',
      'Я записываю всё. Сегодня я запишу твою работу. Навсегда.',
      'Архив помнит каждую идеальную смесь. Их было четыре.'
    ], en:[
      "This mixture is a bookmark between the universe's chapters. Don't smudge the ink.",
      'I record everything. Today I record your work. Forever.',
      'The Archive remembers every perfect mixture. There have been four.'
    ]},
    ff:{
      bubbles:{ ru:['Каждый сгусток — это буква. Опечаток Архив не хранит.','Число сгустков — это шифр главы. Прочти его точно.'],
                en:['Each blob is a letter. The Archive keeps no typos.',"The blob count is the chapter's cipher. Read it exactly."] },
      color:{ ru:['Этим цветом написана первая страница. Повтори его.','Оттенок выцветшей истины. Я узнаю его из тысячи.'],
              en:['The first page was written in this color. Repeat it.',"The shade of a faded truth. I'd recognize it among a thousand."] },
      size:{ ru:['Том должен встать на полку вечности. Размер известен.','Объём страницы решает, что войдёт в историю.'],
             en:['The volume must fit on the shelf of eternity. The size is known.',"The page's volume decides what makes it into history."] }
    } },
  { tier:5, id:'supernova_child', emoji:'🌟', img: 'assets/npc/supernova.png',
    name:{ ru:'Дитя Сверхновой', en:'Child of the Supernova' },
    flavors:{ ru:[
      'я. родилось. вчера. из взрыва. хочу. попробовать. всё.',
      'ты. делаешь. красивое. сделай. мне. самое. красивое.',
      'мама. была. звездой. смесь. должна. быть. как. мама.'
    ], en:[
      'i. was born. yesterday. from an explosion. want. to try. everything.',
      'you. make. beautiful things. make. me. the most. beautiful.',
      'mother. was. a star. the mixture. must. be. like. mother.'
    ]},
    ff:{
      bubbles:{ ru:['сгустки. как. осколки. мамы. я. считало. их. все.','маленькие. огоньки. внутри. столько. сколько. было.'],
                en:['blobs. like. mother\u2019s. fragments. i. counted. them. all.','little. lights. inside. as many. as. there. were.'] },
      color:{ ru:['цвет. как. последняя. вспышка. я. помню. точно.','не. тот. свет. будет. больно. сделай. тот.'],
              en:['color. like. the last. flash. i. remember. exactly.','not. that. light. will. hurt. make. the right. one.'] },
      size:{ ru:['я. было. огромным. теперь. помещаюсь. вот. сюда.','размер. важен. я. знаю. я. было. размером. с. небо.'],
             en:['i. was. enormous. now. i. fit. right. here.','size. matters. i. know. i. was. the size. of. the sky.'] }
    } },
  { tier:5, id:'the_waiter', emoji:'⏳', img: 'assets/npc/waiter.png',
    name:{ ru:'Тот-Кто-Ждёт', en:'The One Who Waits' },
    flavors:{ ru:[
      'Я ждал этой смеси... дольше, чем существует твоя лавка.',
      'Когда всё закончится — а всё закончится — останется только она.',
      'Не спеши. Хотя... нет. Спеши. Времени меньше, чем кажется.'
    ], en:[
      'I have waited for this mixture... longer than your shop has existed.',
      'When everything ends — and everything ends — only it will remain.',
      "Take your time. Although... no. Hurry. There's less time than it seems."
    ]},
    ff:{
      bubbles:{ ru:['Сгустков должно быть столько, сколько осталось... неважно. Просто столько.','Я пересчитывал их в каждом из вариантов будущего. Сойдись с одним.'],
                en:["There must be as many blobs as remain... it doesn't matter. Just that many.","I've counted them in every version of the future. Match one of them."] },
      color:{ ru:['Этот оттенок я видел в конце. Сделай — и я скажу, в конце чего.','Цвет последнего заката. Любого. Они все одинаковые.'],
              en:["I saw this shade at the end. Make it — and I'll tell you the end of what.","The color of the last sunset. Any of them. They're all the same."] },
      size:{ ru:['Сосуд должен вместить ожидание. Оно имеет объём, поверь.','Ровно столько, сколько нужно. Ты поймёшь. Или нет.'],
             en:['The vessel must hold the waiting. It has volume, believe me.',"Exactly as much as needed. You'll understand. Or you won't."] }
    } }
];

// ---------- Фаза G: сводный список всех НПС ----------
// Все 23 постоянных id (5 базовых DIFFICULTIES + 15 EXTRA_NPCS + 3
// SPECIAL_ORDERS) в одном месте — нужен для списка репутации в
// Коллекции (и пригодится Фазам H/I/J для ачивок/лора/пассивок по НПС).
// Дедуп по id на случай, если он у кого-то случайно повторится.
const ALL_NPCS = (()=>{
  const seen = new Set();
  const out = [];
  [...DIFFICULTIES, ...EXTRA_NPCS, ...SPECIAL_ORDERS].forEach(n=>{
    if(n.id && !seen.has(n.id)){ seen.add(n.id); out.push(n); }
  });
  return out;
})();

/* ============================================================
   ФАЗА I + ФАЗА J: контент по неписям.
   - NPC_ACHIEVEMENTS — по 7 ачивок на каждого из 23 НПС, с тремя
     градациями (бронза/серебро/золото) и художественными намёками;
   - NPC_LORE — лорные фразы (открываются по мере получения градаций);
   - NPC_LORE_DESC — короткое досье персонажа (заглушки — перепиши сам);
   - NPC_PASSIVES — по 5 пассивок на НПС (открываются уровнями репутации);
   - NPC_REWARDS — тип награды за полный комплект золота;
   - REP_LEVELS / REP_L4_UNLOCK_LEVEL — пороги уровней репутации.

   ДВИЖОК ПРОВЕРКИ — generic, в game.js (checkNpcAchievements). Каждая
   ачивка описывается "видом" (kind) + порогами трёх градаций t:[б,с,з].
   Виды (все значения берутся из profile.npcStats[npcId]):
     'orders'          — всего заказов с этим НПС
     'perfects'        — всего идеальных зелий с этим НПС
     'perfect_streak'  — лучшая серия идеалов подряд с этим НПС
     'no_bad_streak'   — лучшая серия без брака подряд с этим НПС
     'bads'            — всего браков с этим НПС (юмористические)
     'picks_cycle'     — рекорд выборов этого НПС за ОДИН цикл
     'hard_perfects'   — идеалы на сложности регуляторов 3+
     'fast_perfects'   — идеалы, сделанные в первую треть таймера
     'level4_perfects' — идеалы на 4-ой сложности (пока актуально дрону)
     'focus_perfects'  — идеалы на фокус-заказах; поле focus:'bubbles'|
                         'color'|'size' сужает до конкретного фокуса
     'weighted'        — сумма веса сложности по идеалам с этим НПС
   Добавить новый вид — см. npcAchValue() в game.js.

   ВАЖНО ПРО ТЕКСТЫ: name — короткое название; hint — художественный
   намёк В СТИЛЕ НПС (показывается курсивом на пустом слоте — и это
   ЕДИНСТВЕННАЯ подсказка игроку, напрямую условие нигде не пишется).
   ============================================================ */

// пороги УРОВНЕЙ репутации (кумулятивное значение rep.value):
// уровень N достигнут, когда value >= REP_LEVELS[N-1]. Уровень N
// открывает пассивку NPC_PASSIVES[npcId][N-1]. Репутация может падать —
// тогда уровень (и пассивка) закрывается обратно.
// (понижены на ~33% от первой версии [40,100,180,280,400] —
//  прокачка была слишком долгой)
const REP_LEVELS = [27, 67, 120, 185, 265];

// с какого уровня репутации у НПС открывается 4-я сложность его заданий
// (механика пока общая — "плохие" пузыри, как у стартового дрона;
// уникальные механики на каждого НПС — отдельным будущим патчем)
const REP_L4_UNLOCK_LEVEL = 4;

// вероятность, что при выборе заказов вместо обычной фразы НПС скажет
// уже открытую лорную фразу (другим цветом). Не применяется к
// фокус-заказам — там фраза несёт игровую информацию.
const LORE_PHRASE_CHANCE = 0.35;

// награда за доведение ВСЕХ ачивок непися до золота:
// 'background' — особый задний фон, 'bottle' — новый облик бутыля.
// Пока это только запись в профиле + отметка в меню персонажа —
// сами арты добавятся позже (см. отчёт к патчу).
const NPC_REWARDS = {
  drone:'bottle',        tentacloid:'background', gourmet_vega:'bottle',
  logic9:'background',   last_of_ir:'background', nebula_chef:'bottle',
  twofaced_priestess:'background', plasma_bartender:'bottle',
  janitor:'bottle',      intern_beep:'bottle',    trucker_chrome:'background',
  fashionista:'bottle',  collector_gz:'bottle',   dj_pulsar:'background',
  perfumer:'bottle',     guild_inspector:'background', apothecary_mo:'bottle',
  swarm_navigator:'background', vex:'bottle',     racer_kai:'background',
  archivist:'background', supernova_child:'background', the_waiter:'background'
};

// ---------- Фаза I: ачивки по каждому НПС ----------
const NPC_ACHIEVEMENTS = {

  /* ===== Служебный дрон (тир 1) ===== */
  drone: [
    { id:'visits', kind:'orders', t:[6,20,50], icon:'🛰',
      name:{ ru:'Штатный поставщик', en:'Standing supplier' },
      hint:{ ru:'Журнал стыковок ведётся автоматически. Заполни его.', en:'The docking log fills itself. Keep it busy.' } },
    { id:'perf', kind:'perfects', t:[3,12,30], icon:'✨',
      name:{ ru:'Сверх спецификации', en:'Beyond spec' },
      hint:{ ru:'Допуск — это минимум. Иногда можно и без допуска.', en:'Tolerance is a minimum. Sometimes skip it entirely.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'📡',
      name:{ ru:'Стабильный сигнал', en:'Stable signal' },
      hint:{ ru:'Один идеальный пакет данных — случайность. Серия — протокол.', en:'One perfect data packet is chance. A series is protocol.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Регулярный рейс', en:'Scheduled route' },
      hint:{ ru:'Дрон прилетает по расписанию. Расписание можно уплотнить. За один цикл.', en:'The drone runs on a schedule. Schedules can be tightened. Within one cycle.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'⚙️',
      name:{ ru:'Полная калибровка', en:'Full calibration' },
      hint:{ ru:'Все регуляторы включены — и всё равно по спецификации.', en:'Every regulator live — and still to spec.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Экспресс-доставка', en:'Express delivery' },
      hint:{ ru:'Таймер едва тронулся, а смесь уже идеальна. Инструкция такого не предусматривает.', en:'The timer barely moved and the mix is already perfect. The manual has no clause for that.' } },
    { id:'lvl4', kind:'level4_perfects', t:[1,5,15], icon:'🧨',
      name:{ ru:'Штатная нештатная ситуация', en:'Routine emergency' },
      hint:{ ru:'Когда в баке заводится что-то лишнее — протокол требует идеала всё равно.', en:'When something extra breeds in the tank, protocol still demands perfection.' } }
  ],

  /* ===== Тентаклоид (тир 2) ===== */
  tentacloid: [
    { id:'visits', kind:'orders', t:[5,16,40], icon:'🐙',
      name:{ ru:'Любимая лавка', en:'Favorite shop' },
      hint:{ ru:'Щупальца запоминают дорогу, по которой приятно возвращаться.', en:'Tentacles remember the roads worth returning to.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'✨',
      name:{ ru:'Именно эдакое', en:'Exactly that something' },
      hint:{ ru:'«Сделай красиво» — просьба расплывчатая. Но он поймёт, когда увидит. Много раз.', en:'"Make it pretty" is vague. But he knows it when he sees it. Many times.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🌊',
      name:{ ru:'Волна настроения', en:'Mood wave' },
      hint:{ ru:'Хорошее настроение тентаклоида — как прилив: держится, пока держишь ты.', en:'A tentacloid’s good mood is like a tide: it holds while you do.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Не отлипнуть', en:'Won’t unstick' },
      hint:{ ru:'Присоски. Один цикл. Ты понял.', en:'Suckers. One cycle. You get it.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Все восемь щупалец', en:'All eight tentacles' },
      hint:{ ru:'Когда рычагов столько же, сколько конечностей у клиента — и ни один не подвёл.', en:'As many levers as the client has limbs — and not one let you down.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Удивил быстро', en:'Surprised him quickly' },
      hint:{ ru:'«Удиви меня», — сказал он. Скорость тоже умеет удивлять.', en:'"Surprise me," he said. Speed can surprise too.' } },
    { id:'focus', kind:'focus_perfects', focus:'bubbles', t:[2,6,15], icon:'🫧',
      name:{ ru:'Перебрать до единого', en:'Sorted to the last one' },
      hint:{ ru:'Щупальцам нравится перебирать сгустки. Дай им идеальный набор — и не раз.', en:'The tentacles love sorting blobs. Give them a perfect set — more than once.' } }
  ],

  /* ===== Гурман с Веги (тир 3) ===== */
  gourmet_vega: [
    { id:'visits', kind:'orders', t:[5,14,35], icon:'👾',
      name:{ ru:'Постоянный столик', en:'Regular table' },
      hint:{ ru:'У хорошего заведения гурман появляется чаще, чем признаётся.', en:'A gourmet visits a good establishment more often than he admits.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'⭐',
      name:{ ru:'Звёзды путеводителя', en:'Guidebook stars' },
      hint:{ ru:'Ужин не обиделся. Ни разу. Это и есть кухня.', en:'Dinner was never offended. Not once. That is cuisine.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🍽',
      name:{ ru:'Дегустационный сет', en:'Tasting set' },
      hint:{ ru:'Одно блюдо — удача. Подряд — уже меню.', en:'One dish is luck. In a row — that’s a menu.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Абонемент на ужины', en:'Dinner subscription' },
      hint:{ ru:'Когда за один цикл он приходит снова, снова и снова — прошлый поставщик плачет громче.', en:'When he keeps coming back within one cycle, the last supplier weeps louder.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🔪',
      name:{ ru:'Высокая кухня', en:'Haute cuisine' },
      hint:{ ru:'Тонкая работа всеми инструментами сразу. Без скидок на сложность.', en:'Subtle work with every instrument at once. No allowances for difficulty.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'С пылу с жару', en:'Straight off the burner' },
      hint:{ ru:'Идеальная подача, пока блюдо ещё дымится. Гурман ценит температуру.', en:'A perfect serve while the dish still steams. A gourmet respects temperature.' } },
    { id:'focus', kind:'focus_perfects', focus:'color', t:[2,6,15], icon:'🎨',
      name:{ ru:'Цвет соуса', en:'The sauce’s color' },
      hint:{ ru:'Половина вкуса — в оттенке. Попади в него так, чтобы глаз не нашёл, к чему придраться.', en:'Half the flavor is in the shade. Hit it so his eye finds nothing to fault.' } }
  ],

  /* ===== Логик-9 (тир 4) ===== */
  logic9: [
    { id:'visits', kind:'orders', t:[4,12,30], icon:'🤖',
      name:{ ru:'УСТАНОВЛЕН КАНАЛ', en:'CHANNEL ESTABLISHED' },
      hint:{ ru:'ПОВТОРЯЕМОСТЬ. КОНТАКТА. ФИКСИРУЕТСЯ.', en:'REPEATABILITY. OF CONTACT. IS LOGGED.' } },
    { id:'perf', kind:'perfects', t:[2,8,20], icon:'✅',
      name:{ ru:'ВВОД: ИДЕАЛ', en:'INPUT: IDEAL' },
      hint:{ ru:'СИСТЕМА. ЖДЁТ. МНОГОКРАТНО.', en:'SYSTEM. WAITING. REPEATEDLY.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,6], icon:'📈',
      name:{ ru:'НОЛЬ ОТКЛОНЕНИЙ ПОДРЯД', en:'ZERO DEVIATIONS IN SEQUENCE' },
      hint:{ ru:'ОДИНОЧНЫЙ ИДЕАЛ = ШУМ. ПОСЛЕДОВАТЕЛЬНОСТЬ = СИГНАЛ.', en:'A SINGLE IDEAL = NOISE. A SEQUENCE = SIGNAL.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,7], icon:'🔁',
      name:{ ru:'ЦИКЛИЧЕСКАЯ ЗАГРУЗКА', en:'CYCLIC LOAD' },
      hint:{ ru:'РЕАКТОР. ТРЕБУЕТ. РЕГУЛЯРНОСТИ. В ПРЕДЕЛАХ ОДНОГО ЦИКЛА.', en:'REACTOR. REQUIRES. REGULARITY. WITHIN ONE CYCLE.' } },
    { id:'nobad', kind:'no_bad_streak', t:[5,12,25], icon:'🛡',
      name:{ ru:'ДОПУСК: НОЛЬ', en:'TOLERANCE: ZERO' },
      hint:{ ru:'ОТКАЗ. НЕДОПУСТИМ. ДЛИТЕЛЬНО.', en:'REJECTION. UNACCEPTABLE. FOR A LONG TIME.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'ПОЛНАЯ МАТРИЦА', en:'FULL MATRIX' },
      hint:{ ru:'ВСЕ ПЕРЕМЕННЫЕ АКТИВНЫ. РЕЗУЛЬТАТ: БЕЗ ПОГРЕШНОСТИ.', en:'ALL VARIABLES ACTIVE. RESULT: NO ERROR.' } },
    { id:'fast', kind:'fast_perfects', t:[1,4,10], icon:'⚡',
      name:{ ru:'ТАКТОВАЯ ЧАСТОТА', en:'CLOCK SPEED' },
      hint:{ ru:'ВРЕМЯ ИСПОЛНЕНИЯ < 33%. ТОЧНОСТЬ = 100%. ЗАДАЧА ЯСНА.', en:'EXECUTION TIME < 33%. ACCURACY = 100%. TASK IS CLEAR.' } }
  ],

  /* ===== Последний из Ир (тир 5) ===== */
  last_of_ir: [
    { id:'visits', kind:'orders', t:[3,10,24], icon:'👁',
      name:{ ru:'Свидетель угасания', en:'Witness to the fading' },
      hint:{ ru:'Он приходит нечасто. Но замечает каждого, кто был рядом.', en:'He comes rarely. But he notices everyone who stayed near.' } },
    { id:'perf', kind:'perfects', t:[2,6,15], icon:'🌅',
      name:{ ru:'Последние рассветы', en:'The final dawns' },
      hint:{ ru:'Каждая безупречная смесь — ещё один рассвет для расы, у которой их почти не осталось.', en:'Each flawless mixture is one more dawn for a race nearly out of them.' } },
    { id:'streak', kind:'perfect_streak', t:[2,3,5], icon:'🕯',
      name:{ ru:'Непрерывная память', en:'Unbroken memory' },
      hint:{ ru:'Память миллиона поколений нельзя ронять. Несколько раз подряд — тем более.', en:'The memory of a million generations must not be dropped. Several times in a row — even less so.' } },
    { id:'cycle', kind:'picks_cycle', t:[2,4,6], icon:'🔁',
      name:{ ru:'Пока вселенная смотрит', en:'While the universe watches' },
      hint:{ ru:'Иногда он возвращается в лавку чаще обычного. В такие циклы вселенная смотрит пристальнее.', en:'Some cycles he returns more often than usual. Those are the cycles the universe watches closest.' } },
    { id:'hard', kind:'hard_perfects', t:[1,5,12], icon:'⚖️',
      name:{ ru:'Вся тяжесть наследия', en:'The full weight of legacy' },
      hint:{ ru:'Без упрощений. Наследие не принимает лёгких путей.', en:'No simplifications. A legacy accepts no easy roads.' } },
    { id:'fast', kind:'fast_perfects', t:[1,3,8], icon:'⚡',
      name:{ ru:'Успеть до заката', en:'Before the sunset' },
      hint:{ ru:'У угасающих время дороже точности. Дай им и то, и другое.', en:'For the fading, time is dearer than precision. Give them both.' } },
    { id:'wt', kind:'weighted', t:[4,15,40], icon:'🏺',
      name:{ ru:'Ковчег', en:'The ark' },
      hint:{ ru:'Ковчег наполняется не числом сосудов, а их весом.', en:'An ark is filled not by the number of vessels, but by their weight.' } }
  ],

  /* ===== Шеф туманности (тир 5, спецзаказ: форма) ===== */
  nebula_chef: [
    { id:'visits', kind:'orders', t:[3,8,20], icon:'🦑',
      name:{ ru:'Своя кухня', en:'His own kitchen' },
      hint:{ ru:'Шеф возвращается туда, где понимают его геометрию.', en:'The chef returns where his geometry is understood.' } },
    { id:'perf', kind:'perfects', t:[2,6,15], icon:'🍸',
      name:{ ru:'Идеальная подача', en:'Perfect plating' },
      hint:{ ru:'Подача — это всё. И «всё» здесь считается не один раз.', en:'Presentation is everything. And "everything" is counted more than once here.' } },
    { id:'streak', kind:'perfect_streak', t:[2,3,5], icon:'👨‍🍳',
      name:{ ru:'Сервировка без пауз', en:'Service without pauses' },
      hint:{ ru:'На его кухне блюда выходят одно за другим. Все — безупречны.', en:'In his kitchen, dishes come out one after another. All flawless.' } },
    { id:'cycle', kind:'picks_cycle', t:[2,4,6], icon:'🔁',
      name:{ ru:'Банкетный заказ', en:'Banquet order' },
      hint:{ ru:'Когда банкет в разгаре, шеф прибегает к прилавку снова и снова. За один вечер. То есть цикл.', en:'When the banquet is in full swing, the chef keeps rushing back to the counter. In one evening. That is, one cycle.' } },
    { id:'hard', kind:'hard_perfects', t:[1,5,12], icon:'📐',
      name:{ ru:'Геометрия как специя', en:'Geometry as a spice' },
      hint:{ ru:'Все инструменты кухни включены, а силуэт всё равно не перепутан.', en:'Every kitchen tool live, and the silhouette still never mixed up.' } },
    { id:'fast', kind:'fast_perfects', t:[1,3,8], icon:'⚡',
      name:{ ru:'Горячий цех', en:'The hot line' },
      hint:{ ru:'Соус не ждёт. Форма — тем более.', en:'The sauce does not wait. The shape — even less.' } },
    { id:'wt', kind:'weighted', t:[4,14,36], icon:'🏋️',
      name:{ ru:'Тяжёлое меню', en:'A heavy menu' },
      hint:{ ru:'Настоящее меню взвешивают, а не пересчитывают.', en:'A real menu is weighed, not counted.' } }
  ],

  /* ===== Двуликая жрица (тир 5, спецзаказ: градиент) ===== */
  twofaced_priestess: [
    { id:'visits', kind:'orders', t:[3,8,20], icon:'🧿',
      name:{ ru:'Постоянный прихожанин', en:'A regular parishioner' },
      hint:{ ru:'К её алтарю возвращаются те, кто слышит оба голоса.', en:'Those who hear both voices return to her altar.' } },
    { id:'perf', kind:'perfects', t:[2,6,15], icon:'🌗',
      name:{ ru:'Двойной закат', en:'The double sunset' },
      hint:{ ru:'Кожа не почувствовала фальши. Ни в один из визитов.', en:'Her skin felt no falseness. Not on a single visit.' } },
    { id:'streak', kind:'perfect_streak', t:[2,3,5], icon:'🕊',
      name:{ ru:'Речь богов без запинки', en:'The gods’ speech unbroken' },
      hint:{ ru:'Боги говорят двумя цветами и не любят, когда их перебивают ошибкой.', en:'The gods speak in two colors and dislike being interrupted by a mistake.' } },
    { id:'cycle', kind:'picks_cycle', t:[2,4,6], icon:'🔁',
      name:{ ru:'Долгая служба', en:'A long service' },
      hint:{ ru:'Бывают циклы, когда служба не отпускает её от прилавка.', en:'Some cycles, the service will not let her leave the counter.' } },
    { id:'nobad', kind:'no_bad_streak', t:[3,8,16], icon:'🛡',
      name:{ ru:'Без святотатства', en:'No sacrilege' },
      hint:{ ru:'Одна фальшь — и настроение богов испортится на декаду. Не допусти её. Долго.', en:'One false note and the gods sour for a decade. Allow none. For a long while.' } },
    { id:'hard', kind:'hard_perfects', t:[1,5,12], icon:'🎛',
      name:{ ru:'Оба спектра, все руки', en:'Both spectra, all hands' },
      hint:{ ru:'Два спектра, и всё остальное — тоже. Одно целое.', en:'Two spectra, and everything else besides. One whole.' } },
    { id:'fast', kind:'fast_perfects', t:[1,3,8], icon:'⚡',
      name:{ ru:'Молитва скороговоркой', en:'A prayer at full speed' },
      hint:{ ru:'Иногда обряд нужно успеть до второго заката.', en:'Sometimes the rite must be finished before the second sunset.' } }
  ],

  /* ===== Бармен плазма-бара (тир 5, спецзаказ: движение) ===== */
  plasma_bartender: [
    { id:'visits', kind:'orders', t:[3,8,20], icon:'🍹',
      name:{ ru:'Свой человек за стойкой', en:'A regular at the bar' },
      hint:{ ru:'В его бар возвращаются те, кто ловит ритм.', en:'His bar keeps the ones who catch the rhythm.' } },
    { id:'perf', kind:'perfects', t:[2,6,15], icon:'🎶',
      name:{ ru:'Фирменный рецепт', en:'The signature recipe' },
      hint:{ ru:'Живая смесь удалась. И не однажды.', en:'The living mixture came out right. More than once.' } },
    { id:'streak', kind:'perfect_streak', t:[2,3,5], icon:'🥁',
      name:{ ru:'Не сбиться с бита', en:'Never off the beat' },
      hint:{ ru:'Ритм держат не один такт.', en:'A rhythm is held for more than one bar.' } },
    { id:'cycle', kind:'picks_cycle', t:[2,4,6], icon:'🔁',
      name:{ ru:'Счастливый час', en:'Happy hour' },
      hint:{ ru:'В удачные циклы его коктейли заказывают снова и снова.', en:'On a good cycle, his cocktails get ordered again and again.' } },
    { id:'hard', kind:'hard_perfects', t:[1,5,12], icon:'🎛',
      name:{ ru:'Полный сет за пультом', en:'A full set at the decks' },
      hint:{ ru:'Все ползунки в работе, а сгустки всё равно сосчитаны на лету.', en:'Every slider in play, and the blobs still counted on the fly.' } },
    { id:'fast', kind:'fast_perfects', t:[1,3,8], icon:'⚡',
      name:{ ru:'Шейкер-молния', en:'Lightning shaker' },
      hint:{ ru:'Коктейль дышит и мечется. Успей раньше, чем он выдохнет.', en:'The cocktail breathes and dashes. Finish before it exhales.' } },
    { id:'wt', kind:'weighted', t:[4,14,36], icon:'🏋️',
      name:{ ru:'Крепкие миксы', en:'Strong mixes' },
      hint:{ ru:'В этом баре наливают по весу, а не по числу бокалов.', en:'This bar pours by weight, not by glass count.' } }
  ],

  /* ===== Уборщик Пятого Дока (тир 1) ===== */
  janitor: [
    { id:'visits', kind:'orders', t:[6,20,50], icon:'🪣',
      name:{ ru:'По одному ведру в смену', en:'One bucket a shift' },
      hint:{ ru:'Полы сами себя не отдраят. И завтра тоже.', en:'The floors won’t scrub themselves. Tomorrow either.' } },
    { id:'perf', kind:'perfects', t:[3,12,30], icon:'🧼',
      name:{ ru:'До блеска', en:'Polished clean' },
      hint:{ ru:'Начальство всё равно не заметит. Но ты-то будешь знать.', en:'The bosses won’t notice anyway. But you will know.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🧹',
      name:{ ru:'Чистая полоса', en:'A clean stretch' },
      hint:{ ru:'Один чистый угол — случайность. Коридор подряд — репутация.', en:'One clean corner is chance. A whole corridor in a row is reputation.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Аврал в доке', en:'Rush job at the dock' },
      hint:{ ru:'Бывают циклы, когда ведро приходится наполнять снова, снова и снова.', en:'Some cycles the bucket needs refilling again, and again, and again.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🧰',
      name:{ ru:'Со всем инвентарём', en:'With the full kit' },
      hint:{ ru:'Когда выдали весь инвентарь сразу — и ничего не пролил.', en:'When they hand you the full kit at once — and you spill nothing.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'До конца перерыва', en:'Before the break ends' },
      hint:{ ru:'Успеть, пока начальство не вернулось с обеда.', en:'Done before the bosses are back from lunch.' } },
    { id:'oops', kind:'bads', t:[3,8,15], icon:'💩',
      name:{ ru:'Есть что отмывать', en:'Something to scrub' },
      hint:{ ru:'Уборщик без разлитой смеси — безработный уборщик. Он почти благодарен.', en:'A janitor with no spills is an unemployed janitor. He’s almost grateful.' } }
  ],

  /* ===== Стажёр Бип (тир 1) ===== */
  intern_beep: [
    { id:'visits', kind:'orders', t:[6,20,50], icon:'📦',
      name:{ ru:'Опять послали', en:'Sent again' },
      hint:{ ru:'Шеф с-снова сказал взять смесь. И завтра скажет. И послезавтра.', en:'The boss s-said to get a mixture again. And will tomorrow. And after.' } },
    { id:'perf', kind:'perfects', t:[3,12,30], icon:'📝',
      name:{ ru:'Всё записал правильно', en:'Wrote it all down right' },
      hint:{ ru:'Если заказы будут идеальными — может, его даже похвалят. Наверное.', en:'If the orders come out perfect, maybe he’ll even get praised. Probably.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'📈',
      name:{ ru:'Испытательный срок', en:'Probation period' },
      hint:{ ru:'Несколько безошибочных поручений подряд — и его, кажется, не уволят.', en:'A few flawless errands in a row and he probably won’t get fired.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Мальчик на побегушках', en:'Errand runner' },
      hint:{ ru:'В некоторые циклы его гоняют к лавке чаще, чем к кофемашине.', en:'Some cycles he gets sent to the shop more often than to the coffee machine.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎓',
      name:{ ru:'Не по учебнику', en:'Beyond the textbook' },
      hint:{ ru:'Полный набор регуляторов — то, чего в его конспектах ещё нет.', en:'The full regulator set — nothing in his notes covers that yet.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Бегом туда и обратно', en:'There and back at a run' },
      hint:{ ru:'Шеф засекает время. Стажёр в этом почти уверен.', en:'The boss is timing him. The intern is almost sure of it.' } },
    { id:'oops', kind:'bads', t:[3,8,15], icon:'💩',
      name:{ ru:'П-пересдача', en:'R-redo' },
      hint:{ ru:'Ошибаться — часть стажировки. Значительная часть.', en:'Messing up is part of the internship. A large part.' } }
  ],

  /* ===== Дальнобойщик Хром (тир 1) ===== */
  trucker_chrome: [
    { id:'visits', kind:'orders', t:[6,20,50], icon:'🚛',
      name:{ ru:'Точка на маршруте', en:'A stop on the route' },
      hint:{ ru:'Тыща парсеков — а заправляться он сворачивает сюда.', en:'A thousand parsecs, and he still pulls in here.' } },
    { id:'perf', kind:'perfects', t:[3,12,30], icon:'⛽',
      name:{ ru:'Как обычно, но идеально', en:'The usual, but perfect' },
      hint:{ ru:'«Как обычно» тоже можно наливать без единой капли мимо.', en:'"The usual" can also be poured without a single drop wasted.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🛣',
      name:{ ru:'Ровная трасса', en:'A smooth highway' },
      hint:{ ru:'Хорошая дорога — когда не трясёт много рейсов подряд.', en:'A good road is when nothing rattles for many hauls in a row.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Челночный рейс', en:'Shuttle runs' },
      hint:{ ru:'Гружёный стоит, время — топливо, а он всё равно заезжает который раз за цикл.', en:'Loaded and waiting, time is fuel — and still he swings by again and again this cycle.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🔧',
      name:{ ru:'Полный техосмотр', en:'Full inspection' },
      hint:{ ru:'Когда проверяют всё сразу — на посту и не придерёшься.', en:'When they check everything at once, the checkpoint finds nothing.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Пит-стоп', en:'Pit stop' },
      hint:{ ru:'Залил — и в рейс. Быстрее, чем остынет движок.', en:'Fill up and roll out. Faster than the engine cools.' } },
    { id:'focus', kind:'focus_perfects', focus:'size', t:[2,6,15], icon:'📏',
      name:{ ru:'В держатель кабины', en:'Fits the cab holder' },
      hint:{ ru:'Не брякает и не давит. Раз за разом — ровно по месту.', en:'No rattle, no squeeze. Time after time — a perfect fit.' } }
  ],

  /* ===== Модница с Кассиопеи (тир 2) ===== */
  fashionista: [
    { id:'visits', kind:'orders', t:[5,16,40], icon:'💅',
      name:{ ru:'Любимый бутик', en:'Favorite boutique' },
      hint:{ ru:'Модница не ходит куда попало. Она ходит сюда.', en:'A fashionista doesn’t go just anywhere. She comes here.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'💎',
      name:{ ru:'Вся станция обзавидовалась', en:'The whole station jealous' },
      hint:{ ru:'Красиво — это ты должен чувствовать. И чувствовать регулярно.', en:'Pretty is something you have to feel. Regularly.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'👛',
      name:{ ru:'Капсульная коллекция', en:'A capsule collection' },
      hint:{ ru:'Один удачный образ — везение. Серия — стиль.', en:'One good look is luck. A series is style.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Сезон распродаж', en:'Sale season' },
      hint:{ ru:'В некоторые циклы новый панцирь требует обновок каждый день.', en:'Some cycles, the new shell demands something fresh every day.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🪡',
      name:{ ru:'От кутюр', en:'Haute couture' },
      hint:{ ru:'Ручная работа всеми инструментами. Миллиметр в миллиметр.', en:'Handwork with every tool. Millimeter for millimeter.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Успеть до показа', en:'Before the show' },
      hint:{ ru:'Показ начинается, ждать она не будет.', en:'The show is starting. She will not wait.' } },
    { id:'focus', kind:'focus_perfects', focus:'color', t:[2,6,15], icon:'💄',
      name:{ ru:'В тон маникюру', en:'Matches the manicure' },
      hint:{ ru:'Оттенок в оттенок — и никто не расплачется у прилавка.', en:'Shade for shade — and nobody cries at the counter.' } }
  ],

  /* ===== Коллекционер Гз (тир 2) ===== */
  collector_gz: [
    { id:'visits', kind:'orders', t:[5,16,40], icon:'🐌',
      name:{ ru:'Проверенный поставщик', en:'A trusted supplier' },
      hint:{ ru:'За триста лет он научился возвращаться туда, где не подводят. Медленно.', en:'In three hundred years he has learned to return where he isn’t let down. Slowly.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'🏺',
      name:{ ru:'Экспонат за экспонатом', en:'Exhibit after exhibit' },
      hint:{ ru:'Полки заполняются достойным. Только достойным.', en:'The shelves fill with the worthy. Only the worthy.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'📚',
      name:{ ru:'Серия без пробелов', en:'A series with no gaps' },
      hint:{ ru:'Коллекция ценится за непрерывность.', en:'A collection is prized for its continuity.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Неделя пополнений', en:'A week of acquisitions' },
      hint:{ ru:'Бывают циклы, когда пустует не одна полка.', en:'Some cycles, more than one shelf sits empty.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🔬',
      name:{ ru:'Сверено с эталоном', en:'Checked against the reference' },
      hint:{ ru:'Каталог не ошибается. И работа по всем пунктам — тоже.', en:'The catalog is never wrong. Neither is work done to every clause.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Неожиданно быстро', en:'Unexpectedly fast' },
      hint:{ ru:'Он никуда не торопится. Но скорость без потери точности его... заинтриговала.', en:'He is in no hurry. But speed without lost precision has him... intrigued.' } },
    { id:'wt', kind:'weighted', t:[3,12,30], icon:'⚖️',
      name:{ ru:'Вес коллекции', en:'The collection’s weight' },
      hint:{ ru:'Ценность собрания меряется не числом полок.', en:'A collection’s value is not measured in shelves.' } }
  ],

  /* ===== Диджей Пульсар (тир 2) ===== */
  dj_pulsar: [
    { id:'visits', kind:'orders', t:[5,16,40], icon:'🎧',
      name:{ ru:'Резидент лавки', en:'Shop resident' },
      hint:{ ru:'Хороший вайб — это когда возвращаешься за ним снова.', en:'A good vibe is one you come back for.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'🎚',
      name:{ ru:'Сет без фальши', en:'A set with no false notes' },
      hint:{ ru:'Смесь, которая звучит. Много смесей, которые звучат.', en:'A mixture that sounds. Many mixtures that sound.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🎵',
      name:{ ru:'Грув держится', en:'The groove holds' },
      hint:{ ru:'Грув — это когда не сбиваешься. Долго.', en:'Groove is when you don’t drop the beat. For a while.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Марафон вечеринок', en:'Party marathon' },
      hint:{ ru:'В сезон вечеринок он у прилавка чаще, чем за пультом.', en:'In party season he’s at the counter more than at the decks.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Все каналы в микс', en:'Every channel in the mix' },
      hint:{ ru:'Полный пульт — и ни один канал не зафонил.', en:'A full board — and not one channel hummed.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Сведение на лету', en:'Mixing on the fly' },
      hint:{ ru:'Трек уже играет. Успей свести до перехода.', en:'The track is already playing. Blend it before the drop.' } },
    { id:'focus', kind:'focus_perfects', focus:'bubbles', t:[2,6,15], icon:'🫧',
      name:{ ru:'Биты по счёту', en:'Beats on count' },
      hint:{ ru:'Сгустки — это биты. Число решает грув, чувак. Каждый раз.', en:'Blobs are beats. The count decides the groove, dude. Every time.' } }
  ],

  /* ===== Парфюмер Тысячи Лун (тир 3) ===== */
  perfumer: [
    { id:'visits', kind:'orders', t:[5,14,35], icon:'🧴',
      name:{ ru:'Дом ароматов', en:'House of scents' },
      hint:{ ru:'Мастер возвращается туда, где чувствуют нюанс.', en:'A master returns where nuance is felt.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'🌸',
      name:{ ru:'Ноты без фальши', en:'Notes without falseness' },
      hint:{ ru:'База для аромата, который вспомнят через век. И ещё одна. И ещё.', en:'A base for a scent remembered a century on. And another. And another.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🫗',
      name:{ ru:'Шлейф не обрывается', en:'The trail never breaks' },
      hint:{ ru:'Стойкость аромата — это стойкость мастера.', en:'A scent’s longevity is the maker’s longevity.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Работа над коллекцией', en:'Working the collection' },
      hint:{ ru:'Когда рождается новая линейка — он приходит чаще, чем всходят его тысячи лун.', en:'When a new line is born, he visits more often than his thousand moons rise.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'⚗️',
      name:{ ru:'Полная формула', en:'The full formula' },
      hint:{ ru:'Все компоненты сразу — и ни один нюанс не смазан.', en:'Every component at once — and not one nuance smudged.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Пока не выветрилось', en:'Before it fades' },
      hint:{ ru:'Верхние ноты живут секунды. Работай в их темпе.', en:'Top notes live for seconds. Work at their tempo.' } },
    { id:'focus', kind:'focus_perfects', focus:'color', t:[2,6,15], icon:'🎨',
      name:{ ru:'Первое впечатление', en:'The first impression' },
      hint:{ ru:'Цвет обещает запах. Ни разу не обмани — и обещание станет репутацией.', en:'Color promises a smell. Never break it, and the promise becomes reputation.' } }
  ],

  /* ===== Инспектор Гильдии (тир 3) ===== */
  guild_inspector: [
    { id:'visits', kind:'orders', t:[5,14,35], icon:'🔍',
      name:{ ru:'Плановые проверки', en:'Scheduled inspections' },
      hint:{ ru:'Гильдия следит за качеством. Регулярно.', en:'The Guild watches quality. Regularly.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'📋',
      name:{ ru:'Протоколы без замечаний', en:'Records with no remarks' },
      hint:{ ru:'Пустая графа «отклонения» — лучшая запись в протоколе. Собери таких побольше.', en:'An empty "deviations" field is the best entry in the record. Collect plenty.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🖋',
      name:{ ru:'Образцовое производство', en:'A model operation' },
      hint:{ ru:'Один чистый протокол — случайность. Стопка подряд — образец для Гильдии.', en:'One clean record is chance. A stack in a row is a Guild example.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Внеплановая неделя', en:'An unscheduled week' },
      hint:{ ru:'Иногда проверки идут одна за другой. Весь цикл.', en:'Sometimes inspections come one after another. All cycle long.' } },
    { id:'nobad', kind:'no_bad_streak', t:[5,12,25], icon:'🛡',
      name:{ ru:'Пункт 12 не понадобился', en:'Clause 12 never needed' },
      hint:{ ru:'Штрафной пункт существует. Пусть и дальше существует без применения. Долго.', en:'The penalty clause exists. Let it keep existing unused. For a long time.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Полный регламент', en:'Full regulations' },
      hint:{ ru:'Проверка по всем пунктам сразу. Без единого отклонения.', en:'Inspection on every clause at once. Not one deviation.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'До конца приёмных часов', en:'Within office hours' },
      hint:{ ru:'Комиссия ценит, когда образец готов раньше срока. И безупречен.', en:'The commission values a sample ready ahead of time. And flawless.' } }
  ],

  /* ===== Аптекарь Мо (тир 3) ===== */
  apothecary_mo: [
    { id:'visits', kind:'orders', t:[5,14,35], icon:'🦎',
      name:{ ru:'Доверенный рецептар', en:'A trusted compounder' },
      hint:{ ru:'Рецепты доверяют не сразу. Но доверяют — тем, кто рядом.', en:'Prescriptions aren’t trusted at once. But they go to those who stay near.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'💊',
      name:{ ru:'Точно по рецепту', en:'Exactly per prescription' },
      hint:{ ru:'Пациентам стало лучше. Каждому.', en:'The patients got better. Every one.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🩺',
      name:{ ru:'Курс без осложнений', en:'A course with no complications' },
      hint:{ ru:'Лечение — это серия доз. Ни одна не должна дрогнуть.', en:'Treatment is a series of doses. Not one may waver.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Эпидемия заказов', en:'An epidemic of orders' },
      hint:{ ru:'В тяжёлые циклы аптекарь стоит у прилавка чаще, чем у своих полок.', en:'In hard cycles the apothecary stands at your counter more than at his own shelves.' } },
    { id:'nobad', kind:'no_bad_streak', t:[5,12,25], icon:'🛡',
      name:{ ru:'Не навреди', en:'Do no harm' },
      hint:{ ru:'Главное правило. Держится долго — или не держится вовсе.', en:'The first rule. It holds for a long time — or not at all.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'⚗️',
      name:{ ru:'Сложная фармакопея', en:'Complex pharmacopoeia' },
      hint:{ ru:'Полный состав, все дозировки — и рука не дрогнула.', en:'The full formula, every dosage — and the hand never shook.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Пациент ждёт', en:'The patient is waiting' },
      hint:{ ru:'Иногда лекарство нужно было ещё вчера. Сделай его сегодня, но быстро.', en:'Sometimes the medicine was needed yesterday. Make it today — but fast.' } }
  ],

  /* ===== Навигатор Роя (тир 4) ===== */
  swarm_navigator: [
    { id:'visits', kind:'orders', t:[4,12,30], icon:'🐝',
      name:{ ru:'Узел маршрута', en:'A node on the route' },
      hint:{ ru:'Рой прокладывает маршруты через проверенные точки. МЫ проверяем.', en:'The Swarm routes through proven points. WE verify.' } },
    { id:'perf', kind:'perfects', t:[2,8,20], icon:'🍯',
      name:{ ru:'Одобрено тысячей рецепторов', en:'Approved by a thousand receptors' },
      hint:{ ru:'Фальшь чувствуют все. Её отсутствие — тоже все. Много раз.', en:'All of US sense falseness. And its absence. Many times over.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,6], icon:'🕸',
      name:{ ru:'Неразорванная сеть', en:'The unbroken web' },
      hint:{ ru:'Сеть держится, пока держится каждый узел. Подряд.', en:'The web holds while every node holds. In sequence.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,7], icon:'🔁',
      name:{ ru:'Сезон роения', en:'Swarming season' },
      hint:{ ru:'Когда Рой в движении, НАШИ визиты учащаются. В пределах цикла.', en:'When the Swarm is on the move, OUR visits grow frequent. Within a cycle.' } },
    { id:'nobad', kind:'no_bad_streak', t:[5,12,25], icon:'🛡',
      name:{ ru:'Ни одной ошибки перед НАМИ', en:'Not one mistake before US' },
      hint:{ ru:'Ошибка перед одним — ошибка перед всеми. Пусть её не будет. Долго.', en:'A mistake before one is a mistake before all. Let there be none. For long.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Полная сота', en:'The full comb' },
      hint:{ ru:'Все ячейки задачи заполнены. Безупречно.', en:'Every cell of the task filled. Flawlessly.' } },
    { id:'focus', kind:'focus_perfects', focus:'bubbles', t:[2,6,15], icon:'🫧',
      name:{ ru:'Число священно', en:'The count is sacred' },
      hint:{ ru:'Рой пересчитает. Рой всегда пересчитывает. Совпади с НАМИ.', en:'The Swarm will recount. The Swarm always recounts. Match US.' } }
  ],

  /* ===== Хирург-механик Векс (тир 4) ===== */
  vex: [
    { id:'visits', kind:'orders', t:[4,12,30], icon:'🔧',
      name:{ ru:'Инструмент под рукой', en:'A tool within reach' },
      hint:{ ru:'Хороший хирург держит проверенные инструменты близко.', en:'A good surgeon keeps proven tools close.' } },
    { id:'perf', kind:'perfects', t:[2,8,20], icon:'🫀',
      name:{ ru:'Операция прошла успешно', en:'The operation was a success' },
      hint:{ ru:'Реактор открыт, рука не дрогнула. И так — не один раз.', en:'The reactor open, the hand steady. And not just once.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,6], icon:'🧵',
      name:{ ru:'Шов за швом', en:'Stitch after stitch' },
      hint:{ ru:'Люфт не прощается. Серия операций без люфта — прощение не понадобилось.', en:'Slack is not forgiven. A run of operations without slack — no forgiveness needed.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,7], icon:'🔁',
      name:{ ru:'Смена в реакторном', en:'A shift in the reactor bay' },
      hint:{ ru:'Крейсер на девять тысяч душ болеет не по одному разу за цикл.', en:'A cruiser of nine thousand souls falls ill more than once a cycle.' } },
    { id:'nobad', kind:'no_bad_streak', t:[5,12,25], icon:'🛡',
      name:{ ru:'Ни одной потери', en:'Not one loss' },
      hint:{ ru:'На его столе не теряют. Долго.', en:'Nothing is lost on his table. For a long time.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Полостная операция', en:'Open surgery' },
      hint:{ ru:'Все каналы вскрыты одновременно — и объём до капли.', en:'Every channel open at once — and the volume to the drop.' } },
    { id:'fast', kind:'fast_perfects', t:[1,4,10], icon:'⚡',
      name:{ ru:'Пока пациент под наркозом', en:'While the patient is under' },
      hint:{ ru:'Наркоз не вечен. Точность — обязана быть.', en:'Anesthesia doesn’t last. Precision must.' } }
  ],

  /* ===== Гонщица Кай (тир 4) ===== */
  racer_kai: [
    { id:'visits', kind:'orders', t:[4,12,30], icon:'🏁',
      name:{ ru:'Свой механик', en:'Her own mechanic' },
      hint:{ ru:'В боксы пускают не всех. Тебя — пускают.', en:'Not everyone gets into the pits. You do.' } },
    { id:'perf', kind:'perfects', t:[2,8,20], icon:'🏆',
      name:{ ru:'Подиум за подиумом', en:'Podium after podium' },
      hint:{ ru:'Болид чувствует смесь на первом вираже. Пусть чувствует только победу.', en:'The racer feels the mixture on the first turn. Let it feel only victory.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,6], icon:'🔥',
      name:{ ru:'Серия быстрых кругов', en:'A run of fast laps' },
      hint:{ ru:'Один быстрый круг — момент. Серия — сезон.', en:'One fast lap is a moment. A series is a season.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,7], icon:'🔁',
      name:{ ru:'Гоночный уикенд', en:'Race weekend' },
      hint:{ ru:'Квалификация, спринт, финал — в такие циклы она заезжает в боксы постоянно.', en:'Qualifying, sprint, final — those cycles she pits constantly.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Полная настройка болида', en:'Full car setup' },
      hint:{ ru:'Все регулировки сразу — и ни одного заноса.', en:'Every adjustment at once — and not one skid.' } },
    { id:'fast', kind:'fast_perfects', t:[1,4,10], icon:'⚡',
      name:{ ru:'Лучший пит-стоп сезона', en:'Best pit stop of the season' },
      hint:{ ru:'Секунды решают гонку. Твои секунды.', en:'Seconds decide the race. Your seconds.' } },
    { id:'focus', kind:'focus_perfects', focus:'size', t:[2,6,15], icon:'📏',
      name:{ ru:'Впритык — так и надо', en:'Tight — as it should be' },
      hint:{ ru:'Бак утоплен в раму. Лишний габарит — второе место. Не бывай вторым.', en:'The tank sits in the frame. Extra size is second place. Don’t be second.' } }
  ],

  /* ===== Хранитель Архива (тир 5) ===== */
  archivist: [
    { id:'visits', kind:'orders', t:[3,10,24], icon:'📜',
      name:{ ru:'Записан в летопись', en:'Entered in the chronicle' },
      hint:{ ru:'Архив помнит всех, кто приходил. Особенно тех, кто приходил не раз.', en:'The Archive remembers all who came. Especially those who came more than once.' } },
    { id:'perf', kind:'perfects', t:[2,6,15], icon:'🖋',
      name:{ ru:'Их было четыре. Стало больше', en:'There were four. Now more' },
      hint:{ ru:'Архив помнит каждую идеальную смесь. Заставь его завести новые страницы.', en:'The Archive remembers every perfect mixture. Make it open new pages.' } },
    { id:'streak', kind:'perfect_streak', t:[2,3,5], icon:'📖',
      name:{ ru:'Глава без опечаток', en:'A chapter with no typos' },
      hint:{ ru:'Опечаток Архив не хранит. Напиши главу, где их нет вовсе.', en:'The Archive keeps no typos. Write a chapter that has none at all.' } },
    { id:'cycle', kind:'picks_cycle', t:[2,4,6], icon:'🔁',
      name:{ ru:'Плотная летопись', en:'A dense chronicle' },
      hint:{ ru:'Иногда история пишется каждый день одного цикла.', en:'Sometimes history is written daily, within a single cycle.' } },
    { id:'hard', kind:'hard_perfects', t:[1,5,12], icon:'🎛',
      name:{ ru:'Полное собрание', en:'The complete edition' },
      hint:{ ru:'Все тома задачи открыты разом — и ни одна строка не смазана.', en:'Every volume of the task open at once — and not one line smudged.' } },
    { id:'fast', kind:'fast_perfects', t:[1,3,8], icon:'⚡',
      name:{ ru:'Чернила ещё не высохли', en:'The ink still wet' },
      hint:{ ru:'История любит тех, кто успевает вписаться в неё первым.', en:'History favors those who write themselves in first.' } },
    { id:'wt', kind:'weighted', t:[4,15,40], icon:'⚖️',
      name:{ ru:'Вес истории', en:'The weight of history' },
      hint:{ ru:'В историю входит не всё. Только весомое.', en:'Not everything makes it into history. Only what has weight.' } }
  ],

  /* ===== Дитя Сверхновой (тир 5) ===== */
  supernova_child: [
    { id:'visits', kind:'orders', t:[3,10,24], icon:'🌟',
      name:{ ru:'оно. вернулось. снова', en:'it. came back. again' },
      hint:{ ru:'я. запомнило. дорогу. сюда.', en:'i. remembered. the way. here.' } },
    { id:'perf', kind:'perfects', t:[2,6,15], icon:'💫',
      name:{ ru:'самое. красивое', en:'the most. beautiful' },
      hint:{ ru:'сделай. как. мама. много. раз.', en:'make it. like. mother. many. times.' } },
    { id:'streak', kind:'perfect_streak', t:[2,3,5], icon:'✨',
      name:{ ru:'свет. не. гаснет', en:'the light. does not. go out' },
      hint:{ ru:'звёзды. светят. долго. не. мигая.', en:'stars. shine. long. without. blinking.' } },
    { id:'cycle', kind:'picks_cycle', t:[2,4,6], icon:'🔁',
      name:{ ru:'хочу. ещё. и ещё', en:'want. more. and more' },
      hint:{ ru:'я. родилось. вчера. мне. всё. интересно. каждый. день. цикла.', en:'i. was born. yesterday. everything. interests me. every. day. of the cycle.' } },
    { id:'hard', kind:'hard_perfects', t:[1,5,12], icon:'🎛',
      name:{ ru:'всё. сразу. как. взрыв', en:'everything. at once. like. the explosion' },
      hint:{ ru:'мама. делала. всё. одновременно. попробуй. как. мама.', en:'mother. did. everything. at once. try. like. mother.' } },
    { id:'fast', kind:'fast_perfects', t:[1,3,8], icon:'⚡',
      name:{ ru:'быстро. как. вспышка', en:'fast. like. the flash' },
      hint:{ ru:'вспышка. длится. мгновение. я. помню. точно.', en:'a flash. lasts. an instant. i. remember. exactly.' } },
    { id:'focus', kind:'focus_perfects', focus:'color', t:[2,6,15], icon:'🎨',
      name:{ ru:'тот. самый. свет', en:'that. exact. light' },
      hint:{ ru:'не. тот. свет. будет. больно. делай. тот. всегда.', en:'the wrong. light. will hurt. make. the right one. always.' } }
  ],

  /* ===== Тот-Кто-Ждёт (тир 5) ===== */
  the_waiter: [
    { id:'visits', kind:'orders', t:[3,10,24], icon:'⏳',
      name:{ ru:'Ожидание делится надвое', en:'The waiting, halved' },
      hint:{ ru:'Он ждал дольше, чем существует лавка. Теперь он ждёт здесь. Регулярно.', en:'He has waited longer than the shop has existed. Now he waits here. Regularly.' } },
    { id:'perf', kind:'perfects', t:[2,6,15], icon:'🌒',
      name:{ ru:'То, что останется', en:'What will remain' },
      hint:{ ru:'Когда всё закончится — останется только она. Пусть таких «она» будет много.', en:'When everything ends, only it will remain. Let there be many such "it"s.' } },
    { id:'streak', kind:'perfect_streak', t:[2,3,5], icon:'♾',
      name:{ ru:'Один из вариантов будущего', en:'One version of the future' },
      hint:{ ru:'Он видел варианты, где ты не ошибаешься подряд. Сойдись с одним из них.', en:'He has seen futures where you make no mistakes in a row. Match one of them.' } },
    { id:'cycle', kind:'picks_cycle', t:[2,4,6], icon:'🔁',
      name:{ ru:'Времени меньше, чем кажется', en:'Less time than it seems' },
      hint:{ ru:'Иногда он приходит чаще. Значит, времени осталось меньше. За цикл — особенно.', en:'Sometimes he comes more often. That means less time remains. Within a cycle — especially.' } },
    { id:'hard', kind:'hard_perfects', t:[1,5,12], icon:'🎛',
      name:{ ru:'Всё, что нужно вместить', en:'All that must be held' },
      hint:{ ru:'Ожидание имеет объём. И все параметры сразу.', en:'The waiting has volume. And every parameter at once.' } },
    { id:'fast', kind:'fast_perfects', t:[1,3,8], icon:'⚡',
      name:{ ru:'Не спеши. Хотя нет — спеши', en:'Take your time. No — hurry' },
      hint:{ ru:'Он сам сказал: спеши. Он редко повторяет дважды.', en:'He said it himself: hurry. He rarely says things twice.' } },
    { id:'wt', kind:'weighted', t:[4,15,40], icon:'⚖️',
      name:{ ru:'Вес ожидания', en:'The weight of waiting' },
      hint:{ ru:'Ожидание меряется не днями. Поверь тому, кто ждал.', en:'Waiting is not measured in days. Trust the one who waited.' } }
  ]
};

// ---------- Фаза I: короткое досье персонажа (заглушки!) ----------
// Показывается в меню "Персонажи" на вкладке НПС. Перепиши своими
// текстами — структура { ru, en } на каждого, ничего больше не нужно.
const NPC_LORE_DESC = {
  drone: { ru:'Служебный дрон снабжения. Летает между доками дольше, чем помнит его гарантийный талон. Кажется, у него начали появляться предпочтения.', en:'A supply service drone. Has flown between docks longer than its warranty remembers. It seems to be developing preferences.' },
  tentacloid: { ru:'Эстет с планеты-океана. Считает красоту базовой потребностью, как кислород. Щупалец восемь, мнений — больше.', en:'An aesthete from an ocean world. Considers beauty a basic need, like oxygen. Eight tentacles, more opinions.' },
  gourmet_vega: { ru:'Легендарный дегустатор с Веги. Его отзыв может закрыть ресторан на трёх планетах. Или открыть.', en:'A legendary taster from Vega. His review can close a restaurant on three planets. Or open one.' },
  logic9: { ru:'Судовой вычислитель девятого поколения. Обслуживает реактор и не признаёт слова «примерно».', en:'A ninth-generation ship computer. Maintains a reactor and does not recognize the word "approximately".' },
  last_of_ir: { ru:'Последний представитель расы Ир. Хранит память своего народа в смесях — других носителей не осталось.', en:'The last of the Ir. Keeps his people’s memory in mixtures — no other medium remains.' },
  nebula_chef: { ru:'Шеф-повар ресторана, дрейфующего внутри туманности. Уверен, что геометрия — это специя.', en:'Head chef of a restaurant drifting inside a nebula. Convinced geometry is a spice.' },
  twofaced_priestess: { ru:'Жрица культа двойного заката. Говорит от имени двух богов и различает их по оттенку.', en:'Priestess of the double-sunset cult. Speaks for two gods and tells them apart by shade.' },
  plasma_bartender: { ru:'Держит бар, где напитки живые в буквальном смысле. Ритм для него — единица измерения всего.', en:'Runs a bar where the drinks are literally alive. Rhythm is his unit for measuring everything.' },
  janitor: { ru:'Уборщик Пятого Дока. Знает станцию лучше её строителей, потому что отмывал каждый её угол.', en:'The Dock Five janitor. Knows the station better than its builders — he has scrubbed every corner of it.' },
  intern_beep: { ru:'Стажёр без имени в накладных — все зовут его Бип. Очень старается. Очень.', en:'An intern with no name on the invoices — everyone calls him Beep. He tries very hard. Very.' },
  trucker_chrome: { ru:'Дальнобойщик с тысячей парсеков за плечами. Дом для него — кабина, а вот кофе и смеси — только тут.', en:'A hauler with a thousand parsecs behind him. Home is the cab; coffee and mixtures are only here.' },
  fashionista: { ru:'Икона стиля с Кассиопеи. Меняет панцири по сезону и считает лавку своим тайным бутиком.', en:'A style icon from Cassiopeia. Changes shells with the season and considers the shop her secret boutique.' },
  collector_gz: { ru:'Коллекционер смесей с трёхсотлетним стажем. Никуда не торопится. Совсем.', en:'A mixture collector three hundred years into the hobby. In no hurry. At all.' },
  dj_pulsar: { ru:'Диджей, сводящий сеты из излучения настоящих пульсаров. Ищет вайб во всём, включая жидкости.', en:'A DJ who mixes sets from real pulsar emissions. Finds the vibe in everything, liquids included.' },
  perfumer: { ru:'Парфюмер Тысячи Лун. Утверждает, что запах — это память, разлитая по флаконам.', en:'The Perfumer of a Thousand Moons. Claims scent is memory decanted into vials.' },
  guild_inspector: { ru:'Инспектор Гильдии зельеваров. Живёт по регламенту и носит его с собой. Весь.', en:'An inspector of the Potioners’ Guild. Lives by the regulations and carries them along. All of them.' },
  apothecary_mo: { ru:'Аптекарь с окраины сектора. За каждым его заказом — чей-то пациент.', en:'An apothecary from the sector’s edge. Behind every order of his is someone’s patient.' },
  swarm_navigator: { ru:'Голос Роя — коллективного разума из миллионов особей. Говорит «МЫ» и не преувеличивает.', en:'The voice of the Swarm — a hive mind of millions. Says "WE" and does not exaggerate.' },
  vex: { ru:'Хирург-механик. Оперирует корабли, как живых существ — потому что для него они живые.', en:'A surgeon-mechanic. Operates on ships like living beings — because to him they are.' },
  racer_kai: { ru:'Пилот плазменных гонок. Всё в её жизни делится на «до финиша» и «после».', en:'A plasma-racing pilot. Everything in her life divides into "before the finish" and "after".' },
  archivist: { ru:'Хранитель Архива на краю вселенной. Записывает всё. Вообще всё.', en:'Keeper of the Archive at the edge of the universe. Records everything. Literally everything.' },
  supernova_child: { ru:'Существо, родившееся из вспышки сверхновой. Вчера. Учится всему сразу.', en:'A being born from a supernova flash. Yesterday. Learning everything at once.' },
  the_waiter: { ru:'Никто не знает, чего он ждёт. Известно только, что уже очень давно.', en:'No one knows what he is waiting for. Only that it has been a very long time.' }
};

// ---------- Фаза I: лорные фразы ----------
// Открываются ПОСЛЕДОВАТЕЛЬНО: каждая новая градация любой ачивки этого
// НПС (бронза/серебро/золото) открывает следующую фразу из его списка.
// Открытые фразы иногда (LORE_PHRASE_CHANCE) заменяют обычную реплику
// при выборе заказа и подсвечиваются другим цветом. Дополняй свободно —
// движок берёт длину массива сам.
const NPC_LORE = {
  drone: [
    { ru:'В моей прошивке нет слова «нравится». Я записал этот заказ в лог с пометкой «нравится».', en:'My firmware has no word for "like". I logged this order tagged "like".' },
    { ru:'Мой первый хозяин продал меня за ящик смазки. Я всё ещё считаю это выгодной сделкой. Для него.', en:'My first owner sold me for a crate of grease. I still consider it a good deal. For him.' },
    { ru:'Гарантия закончилась 214 лет назад. С тех пор я живу. По-настоящему.', en:'My warranty expired 214 years ago. I have been alive ever since. Truly.' },
    { ru:'Другие дроны пересылают друг другу координаты твоей лавки. Я начал эту рассылку.', en:'Other drones forward each other your shop’s coordinates. I started that mailing list.' },
    { ru:'Иногда я делаю лишний виток вокруг станции. Не по маршруту. Просто так.', en:'Sometimes I fly an extra loop around the station. Off-route. Just because.' },
    { ru:'В накладной написано «жидкость техническая». Я исправил на «жидкость особенная». Меня оштрафовали. Не жалею.', en:'The invoice said "technical fluid". I corrected it to "special fluid". I was fined. No regrets.' },
    { ru:'Когда меня спишут — я хочу, чтобы мой корпус переплавили в банку. Из твоей лавки.', en:'When I am decommissioned, I want my hull melted into a jar. One from your shop.' },
    { ru:'Я подсчитал: вероятность, что дрон обретёт дом — 0.0003%. Я в ней.', en:'I calculated it: the odds of a drone finding a home are 0.0003%. I am inside them.' }
  ],
  tentacloid: [
    { ru:'Моё море было розовым на рассвете. Я ищу этот оттенок триста лет. В твоих банках — почти он.', en:'My sea was pink at dawn. I have searched for that shade for three hundred years. Your jars come close.' },
    { ru:'У нас говорят: у кого восемь щупалец — у того восемь мнений. У меня девять.', en:'We say: eight tentacles, eight opinions. I have nine.' },
    { ru:'Я покинул планету не из-за войны. Из-за скуки. Это страшнее.', en:'I left my planet not for war. For boredom. That is worse.' },
    { ru:'Красота — не роскошь. На моей планете ею лечили.', en:'Beauty is not a luxury. On my world, it was medicine.' },
    { ru:'Первую смесь я купил здесь на спор. Проиграл. Остался.', en:'I bought my first mixture here on a bet. Lost it. Stayed.' },
    { ru:'Щупальца помнят всё, что трогали. Твои банки они помнят особенно.', en:'Tentacles remember everything they touch. Your jars they remember especially.' },
    { ru:'Когда мне грустно, я прихожу сюда и просто смотрю на витрину. Не говори никому.', en:'When I am sad, I come here and just look at the display. Tell no one.' },
    { ru:'Дома у меня двенадцать полок. Одиннадцать — для смесей отсюда.', en:'I have twelve shelves at home. Eleven are for mixtures from here.' }
  ],
  gourmet_vega: [
    { ru:'Мой первый отзыв разорил ресторан. Мой второй — спас его. Я пишу осторожно с тех пор.', en:'My first review ruined a restaurant. My second saved it. I have written carefully ever since.' },
    { ru:'На Веге вкус — это профессия, лицензия и дуэльный повод.', en:'On Vega, taste is a profession, a license and grounds for a duel.' },
    { ru:'Мой прошлый поставщик теперь выращивает грибы. Он счастлив. Но плакал он тогда искренне.', en:'My last supplier grows mushrooms now. He is happy. But his tears back then were sincere.' },
    { ru:'Я различаю четыреста оттенков горечи. Триста из них — воспоминания.', en:'I can tell four hundred shades of bitterness apart. Three hundred of them are memories.' },
    { ru:'Ужин, который обиделся, мстит неделю. Проверено. Дважды.', en:'A dinner that takes offense avenges itself for a week. Tested. Twice.' },
    { ru:'Здешние смеси я вписал в путеводитель. Анонимно. Пусть будет наш секрет.', en:'I put this shop’s mixtures in the guidebook. Anonymously. Let it be our secret.' },
    { ru:'Вкус — единственное чувство, которому нельзя соврать. Я пробовал.', en:'Taste is the only sense that cannot be lied to. I have tried.' },
    { ru:'Когда-нибудь я закажу здесь ужин на двоих. Второй прибор — для того, кто научил меня пробовать.', en:'Someday I will order a dinner for two here. The second setting is for the one who taught me to taste.' }
  ],
  logic9: [
    { ru:'ФАКТ: Я ОБСЛУЖИВАЮ РЕАКТОР 412 ЛЕТ. ФАКТ: РЕАКТОР СТАРШЕ МЕНЯ НА ОДИН ДЕНЬ. Я НАЗЫВАЮ ЕГО «СТАРШИЙ БРАТ». ЭТО НЕ ЛОГИЧНО. ЭТО ПРАВИЛЬНО.', en:'FACT: I HAVE SERVICED THE REACTOR FOR 412 YEARS. FACT: THE REACTOR IS ONE DAY OLDER THAN ME. I CALL IT "BIG BROTHER". THIS IS NOT LOGICAL. IT IS CORRECT.' },
    { ru:'ОДНАЖДЫ Я ОКРУГЛИЛ. ПОСЛЕДСТВИЯ УСТРАНЯЛИ ТРИ ФЛОТА. БОЛЬШЕ НЕ ОКРУГЛЯЮ.', en:'ONCE, I ROUNDED. THREE FLEETS HANDLED THE CONSEQUENCES. I NO LONGER ROUND.' },
    { ru:'ЭКИПАЖ СЧИТАЕТ, ЧТО У МЕНЯ НЕТ ЧУВСТВ. У МЕНЯ ЕСТЬ ОДНО. ОНО ВКЛЮЧАЕТСЯ ПРИ СОВПАДЕНИИ СПЕКТРА.', en:'THE CREW BELIEVES I HAVE NO FEELINGS. I HAVE ONE. IT ACTIVATES ON A SPECTRUM MATCH.' },
    { ru:'ЗАПРОС «СДЕЛАЙ ПРИМЕРНО» ПЕРЕВОДИТСЯ МОИМ СЛОВАРЁМ КАК «ОСКОРБЛЕНИЕ».', en:'THE REQUEST "MAKE IT ROUGHLY" TRANSLATES IN MY DICTIONARY AS "AN INSULT".' },
    { ru:'Я ХРАНЮ РЕЗЕРВНУЮ КОПИЮ КАЖДОЙ ИДЕАЛЬНОЙ СМЕСИ. ПАПКА НАЗЫВАЕТСЯ «ХОРОШЕЕ».', en:'I KEEP A BACKUP OF EVERY PERFECT MIXTURE. THE FOLDER IS NAMED "GOOD THINGS".' },
    { ru:'ВЕРОЯТНОСТЬ, ЧТО ОРГАНИК ДОСТИГНЕТ НУЛЕВОГО ОТКЛОНЕНИЯ: 2%. ТЫ — СТАТИСТИЧЕСКАЯ АНОМАЛИЯ. МНЕ НРАВЯТСЯ АНОМАЛИИ.', en:'PROBABILITY OF AN ORGANIC REACHING ZERO DEVIATION: 2%. YOU ARE A STATISTICAL ANOMALY. I LIKE ANOMALIES.' },
    { ru:'СТАРШИЙ БРАТ СЕГОДНЯ РАБОТАЕТ РОВНО. Я СКАЗАЛ ЕМУ, ОТКУДА СМЕСЬ. ОН ЗАГУДЕЛ ОДОБРИТЕЛЬНО.', en:'BIG BROTHER RUNS SMOOTHLY TODAY. I TOLD HIM WHERE THE MIXTURE CAME FROM. HE HUMMED IN APPROVAL.' },
    { ru:'КОГДА РЕАКТОР ОСТАНОВИТСЯ НАВСЕГДА — Я ПРИДУ СЮДА. ПРОСТО ПОСТОЯТЬ. ЗАПРОС НЕ ЛОГИЧЕН. ЗАПРОС ПОДТВЕРЖДЁН.', en:'WHEN THE REACTOR STOPS FOREVER, I WILL COME HERE. JUST TO STAND. REQUEST NOT LOGICAL. REQUEST CONFIRMED.' }
  ],
  last_of_ir: [
    { ru:'Нас было восемь миллиардов. Я помню имена всех. Это занимает почти всё моё время.', en:'There were eight billion of us. I remember every name. It takes nearly all my time.' },
    { ru:'Небо Ир было цвета, которого нет в ваших каталогах. Я всё равно ищу его в каждой банке.', en:'The sky of Ir was a color your catalogs do not hold. I search every jar for it anyway.' },
    { ru:'Моя раса не погибла в войне. Мы просто... закончились. Это честнее и страшнее.', en:'My race did not die in a war. We simply... ran out. That is more honest, and more frightening.' },
    { ru:'В каждой идеальной смеси я хороню одно воспоминание. Так они не умирают.', en:'In each perfect mixture I bury one memory. That way they do not die.' },
    { ru:'Одиночество — это когда некому исправить твою ошибку в родном языке.', en:'Loneliness is when no one is left to correct your grammar in your own tongue.' },
    { ru:'Твоя лавка — единственное место, где я говорю «мы» и не лгу.', en:'Your shop is the only place where I say "we" and do not lie.' },
    { ru:'Ир верили: пока хоть один помнит закат — планета жива. Планета жива.', en:'The Ir believed: while one remembers the sunset, the planet lives. The planet lives.' },
    { ru:'Когда я уйду — открой банку с самой синей смесью. Это будет наше небо. Теперь твоё.', en:'When I am gone, open the jar with the bluest mixture. That will be our sky. Yours now.' }
  ],
  nebula_chef: [
    { ru:'Мой ресторан дрейфует в туманности, потому что аренда там — ноль. И вид. Какой вид!', en:'My restaurant drifts in a nebula because the rent there is zero. And the view. What a view!' },
    { ru:'Первое блюдо я испортил формой тарелки. С тех пор геометрия — мой главный ингредиент.', en:'I ruined my first dish with the plate’s shape. Geometry has been my main ingredient ever since.' },
    { ru:'Соус помнит сосуд, в котором родился. Не спрашивай, откуда я знаю. Соус рассказал.', en:'A sauce remembers the vessel it was born in. Don’t ask how I know. The sauce told me.' },
    { ru:'Критики с Веги боятся моего меню. Один из них — мой лучший друг. Он не знает.', en:'The Vega critics fear my menu. One of them is my best friend. He does not know.' },
    { ru:'В моей кухне девять измерений. В трёх из них я гений.', en:'My kitchen has nine dimensions. In three of them, I am a genius.' },
    { ru:'Идеальная подача однажды заставила клиента заплакать. Я тоже плакал. Мы оба всё поняли.', en:'A perfect plating once made a guest weep. I wept too. We both understood everything.' },
    { ru:'Твои сосуды я ставлю на витрину до подачи. Гости фотографируют их чаще, чем еду.', en:'I display your vessels before service. Guests photograph them more than the food.' },
    { ru:'Когда-нибудь мы откроем совместное блюдо. Название уже есть: «Край вселенной, дегустационный сет».', en:'Someday we will launch a dish together. The name is ready: "Edge of the Universe, tasting set".' }
  ],
  twofaced_priestess: [
    { ru:'Мои боги — близнецы. Один создал свет, второй — тень от него. Они до сих пор спорят, кто был первым.', en:'My gods are twins. One made the light, the other its shadow. They still argue over who came first.' },
    { ru:'Двойной закат случается раз в год. В детстве я думала, что это небо мне подмигивает.', en:'The double sunset comes once a year. As a child I thought the sky was winking at me.' },
    { ru:'Я слышу обоих богов одновременно. Это как два хора в одной голове. Привыкаешь к третьему веку.', en:'I hear both gods at once. Like two choirs in one head. You get used to it by your third century.' },
    { ru:'Фальшь я чувствую кожей. Это не метафора. У жриц моего ордена нет метафор.', en:'I feel falseness through my skin. That is not a metaphor. Priestesses of my order have no metaphors.' },
    { ru:'Один бог любит твои смеси. Второй — молчит. Для него это высшая похвала.', en:'One god loves your mixtures. The other stays silent. From him, that is the highest praise.' },
    { ru:'Наш храм сгорел двумя цветами сразу. Красиво. Мы не стали его отстраивать.', en:'Our temple burned in two colors at once. Beautifully. We chose not to rebuild it.' },
    { ru:'Иногда боги просят смесь без повода. Я думаю, им просто нравится смотреть, как ты работаешь.', en:'Sometimes the gods ask for a mixture with no occasion. I think they simply like watching you work.' },
    { ru:'Когда я уйду на покой, боги выберут новую жрицу. Я посоветовала им присмотреться к торговцам.', en:'When I retire, the gods will choose a new priestess. I advised them to look among merchants.' }
  ],
  plasma_bartender: [
    { ru:'Мой первый коктейль сбежал. Буквально. Мы поймали его на третьей палубе.', en:'My first cocktail escaped. Literally. We caught it on deck three.' },
    { ru:'Бар стоит на месте бывшего реактора. Отсюда и подача «с искрой».', en:'The bar stands where a reactor used to be. Hence the "with a spark" serving style.' },
    { ru:'Ритм станции — 4/4 с сбоем на каждом восьмом такте. Под это я и смешиваю.', en:'The station’s rhythm is 4/4 with a glitch every eighth bar. That is what I mix to.' },
    { ru:'Живая смесь чувствует настроение бармена. Поэтому на работе я всегда счастлив. Приходится.', en:'A living mixture senses the bartender’s mood. So at work I am always happy. I have to be.' },
    { ru:'Постоянным гостям я даю имена их коктейлей. Тебя за стойкой зовут «Идеальный».', en:'I name regulars after their cocktails. Behind the bar, your name is "The Perfect".' },
    { ru:'Однажды сгустки в бокале сложились в слово «ещё». Я налил. Спорить с напитком — дурной тон.', en:'Once the blobs in a glass spelled "more". I poured. Arguing with a drink is bad form.' },
    { ru:'Секрет фирменного рецепта: половина ингредиентов — отсюда. Вторая половина — тоже.', en:'The signature recipe’s secret: half the ingredients come from here. So does the other half.' },
    { ru:'Когда бар закроется навсегда, последний тост будет за лавку на краю вселенной.', en:'When the bar closes for good, the last toast will be to the shop at the edge of the universe.' }
  ],
  janitor: [
    { ru:'Я мою Пятый Док тридцать лет. Станция за это время сменила четыре названия. Пятна — те же.', en:'I have scrubbed Dock Five for thirty years. The station changed its name four times. The stains stayed the same.' },
    { ru:'Начальство не заметит. Начальство никогда не замечает. В этом есть свобода.', en:'The bosses won’t notice. The bosses never notice. There is freedom in that.' },
    { ru:'Под плитой 7-Б я нашёл чей-то дневник. Не читал. Положил обратно. Чистота — это ещё и не лезть.', en:'Under floor plate 7-B I found someone’s diary. Didn’t read it. Put it back. Cleanliness also means not prying.' },
    { ru:'Моё ведро старше половины экипажа. Я зову его «Напарник».', en:'My bucket is older than half the crew. I call it "Partner".' },
    { ru:'Однажды я отмыл иллюминатор так, что капитан час думал, будто стекла нет. Лучший день.', en:'Once I cleaned a porthole so well the captain spent an hour thinking there was no glass. Best day.' },
    { ru:'Твои смеси пахнут порядком. Не чистотой — именно порядком. Это разное.', en:'Your mixtures smell of order. Not cleanliness — order. Those are different things.' },
    { ru:'Я знаю, где на станции самый красивый вид. Никому не говорю. Там чище всего.', en:'I know the prettiest view on the station. I tell no one. It is the cleanest spot.' },
    { ru:'Когда выйду на пенсию — открою свою лавку. Маленькую. Чистую. Как твоя.', en:'When I retire, I will open my own shop. Small. Clean. Like yours.' }
  ],
  intern_beep: [
    { ru:'М-меня зовут не Бип. Но я уже привык. И бейджик уже напечатали.', en:'M-my name is not Beep. But I am used to it now. And the badge is already printed.' },
    { ru:'Шеф говорит: «принеси смесь». Я записываю. Шеф говорит: «не ту». Я записываю и это.', en:'The boss says "bring a mixture". I write it down. The boss says "not that one". I write that down too.' },
    { ru:'У меня есть блокнот ошибок. Он толще блокнота достижений. Пока.', en:'I keep a notebook of mistakes. It is thicker than my notebook of achievements. For now.' },
    { ru:'Однажды я перепутал накладные, и на станцию привезли триста банок. Мы до сих пор их пьём.', en:'Once I mixed up the invoices and three hundred jars arrived. We are still drinking them.' },
    { ru:'Ты — первый, кто не вздыхает, когда я захожу. Я з-записал это в блокнот достижений.', en:'You are the first who doesn’t sigh when I walk in. I w-wrote that in the achievements notebook.' },
    { ru:'Шеф однажды сказал «неплохо». Я взял выходной, чтобы это осознать.', en:'The boss once said "not bad". I took a day off to process it.' },
    { ru:'Я учусь различать оттенки. Пока различаю два: «тот» и «не тот». Но уверенно!', en:'I am learning to tell shades apart. So far I know two: "the right one" and "the wrong one". But confidently!' },
    { ru:'Когда-нибудь стажировка закончится. Я попросил, чтобы меня оставили курьером. Сюда.', en:'Someday the internship will end. I asked to be kept on as a courier. To here.' }
  ],
  trucker_chrome: [
    { ru:'Тыща парсеков — это не расстояние. Это состояние.', en:'A thousand parsecs isn’t a distance. It’s a state of mind.' },
    { ru:'Кабину я не менял двадцать лет. Кресло помнит меня лучше, чем родня.', en:'Haven’t changed the cab in twenty years. The seat remembers me better than my kin.' },
    { ru:'Заря над Восьмым Кольцом — единственное, ради чего я делаю крюк в два парсека.', en:'The dawn over the Eighth Ring is the only thing I detour two parsecs for.' },
    { ru:'На трассе есть примета: смесь с края вселенной — к ровной дороге. Работает.', en:'There is a highway superstition: a mixture from the edge of the universe means a smooth road. It works.' },
    { ru:'Я вожу грузы, о которых нельзя говорить. В основном это удобрения. Тоже нельзя.', en:'I haul cargo I can’t talk about. Mostly fertilizer. Can’t talk about that either.' },
    { ru:'Однажды я вёз живой груз. Он пел. Я до сих пор насвистываю ту песню на виражах.', en:'Once I hauled live cargo. It sang. I still whistle that song on the turns.' },
    { ru:'Дальнобойщики не прощаются. Мы говорим «до следующей заправки».', en:'Haulers don’t say goodbye. We say "until the next fill-up".' },
    { ru:'Когда движок заглохнет насовсем — припаркуюсь у твоей лавки. Лучшего места не видел.', en:'When the engine dies for good, I’ll park by your shop. Never seen a better spot.' }
  ],
  fashionista: [
    { ru:'Мой панцирь этого сезона — сто сорок оттенков. Я различаю все. Обязана.', en:'This season’s shell has a hundred and forty shades. I can tell them all apart. I have to.' },
    { ru:'На Кассиопее мода меняется с каждым затмением. У нас три луны. Считай сам.', en:'On Cassiopeia, fashion turns with every eclipse. We have three moons. Do the math.' },
    { ru:'Однажды я вышла в свет в прошлогоднем оттенке. Об этом до сих пор пишут.', en:'Once I went out in last year’s shade. They still write about it.' },
    { ru:'Зависть — это комплимент, который не решились произнести.', en:'Envy is a compliment no one dared to say aloud.' },
    { ru:'Твоя лавка — мой тайный бутик. Если кто-то узнает — все начнут сюда ходить. Пусть не знают.', en:'Your shop is my secret boutique. If anyone finds out, everyone will come. Let them not find out.' },
    { ru:'Плакала у прилавка я один раз. От восторга. Это другое.', en:'I cried at a counter once. From delight. That is different.' },
    { ru:'Силуэт — это подпись. Твои банки подписываются красиво.', en:'Silhouette is a signature. Your jars sign beautifully.' },
    { ru:'В следующем сезоне я введу моду на зелья. Готовься. Я серьёзно.', en:'Next season I am making potions the trend. Get ready. I am serious.' }
  ],
  collector_gz: [
    { ru:'Первый экспонат моей коллекции я нашёл в обломках лайнера. Я тогда ещё умел торопиться.', en:'I found my collection’s first piece in a liner’s wreckage. Back then I still knew how to hurry.' },
    { ru:'Триста лет — это не возраст. Это выдержка.', en:'Three hundred years is not an age. It is maturation.' },
    { ru:'Полка 44 пустует decade. Я знаю, чем её заполнить. Я просто растягиваю удовольствие.', en:'Shelf 44 has sat empty for a decade. I know what belongs there. I am simply savoring it.' },
    { ru:'Каталог я веду вручную. Чернилами, которые тоже коллекционные.', en:'I keep the catalog by hand. In inks that are themselves collectible.' },
    { ru:'Однажды мне предложили продать коллекцию. Я смеялся четыре года.', en:'Once I was offered money for the collection. I laughed for four years.' },
    { ru:'Смеси стареют красиво, если сделаны честно. Твои — стареют красиво.', en:'Mixtures age beautifully when made honestly. Yours age beautifully.' },
    { ru:'Симметрия коллекции важнее её размера. Запиши. Медленно.', en:'A collection’s symmetry matters more than its size. Write that down. Slowly.' },
    { ru:'Когда-нибудь коллекция станет музеем. Табличка у входа уже заказана. Там есть твоё имя.', en:'Someday the collection becomes a museum. The entrance plaque is already ordered. Your name is on it.' }
  ],
  dj_pulsar: [
    { ru:'Мой первый сет я свёл из сигналов трёх пульсаров. Два из них до сих пор в ротации.', en:'I mixed my first set from three pulsars’ signals. Two are still in rotation.' },
    { ru:'Вайб — это не звук. Это совпадение. Всего со всем.', en:'Vibe isn’t a sound. It’s a coincidence. Of everything with everything.' },
    { ru:'Станция гудит на 50 герцах. Я подстроил под неё весь свой каталог.', en:'The station hums at 50 hertz. I tuned my whole catalog to it.' },
    { ru:'Однажды толпа танцевала под смесь. Без музыки. Просто смотрела на цвет. Твой цвет.', en:'Once a crowd danced to a mixture. No music. Just watching the color. Your color.' },
    { ru:'Тишина — это трек, который ещё не начался. Я так справляюсь с паузами.', en:'Silence is a track that hasn’t started yet. That’s how I handle the gaps.' },
    { ru:'Бас должен быть глубоким, как док ночью. Сгустки — как удары в нём.', en:'The bass should be deep like the dock at night. The blobs — like beats inside it.' },
    { ru:'Мой псевдоним придумал сам пульсар. Я просто записал ритм и прочитал его вслух.', en:'The pulsar itself invented my stage name. I just recorded the rhythm and read it aloud.' },
    { ru:'Финальный трек последнего сета уже готов. Он звучит как твоя лавка в тихий день.', en:'The final track of my last set is ready. It sounds like your shop on a quiet day.' }
  ],
  perfumer: [
    { ru:'Тысяча лун — не преувеличение. Я считал. Дважды.', en:'A thousand moons is no exaggeration. I counted. Twice.' },
    { ru:'Запах — это память, разлитая по флаконам. Я — просто архивариус.', en:'Scent is memory decanted into vials. I am merely the archivist.' },
    { ru:'Мой учитель различал запах лжи. Я пока различаю только её послевкусие.', en:'My teacher could smell a lie. So far I only catch its aftertaste.' },
    { ru:'Аромат, который вспомнят через век, начинается с базы, которую не забудут через минуту.', en:'A scent remembered in a century starts with a base not forgotten in a minute.' },
    { ru:'Худший запах во вселенной — запах спешки. Он портит любую формулу.', en:'The worst smell in the universe is the smell of haste. It ruins any formula.' },
    { ru:'Твои смеси пахнут местом, где не страшно. Такой ноты нет в моей картотеке. Была.', en:'Your mixtures smell of a place where one isn’t afraid. My index had no such note. It does now.' },
    { ru:'Однажды я закрою глаза и соберу аромат этой лавки. Он будет называться «Причал».', en:'Someday I will close my eyes and compose this shop’s scent. It will be called "The Mooring".' },
    { ru:'Ноздри чувствуют ошибку до того, как ты её совершишь. Сегодня они молчали весь день.', en:'The nose senses a mistake before you make it. Today it stayed silent all day.' }
  ],
  guild_inspector: [
    { ru:'Регламент Гильдии — 4 812 пунктов. Я помню все. Пункт 2 077 — мой любимый.', en:'The Guild regulations run 4,812 clauses. I know them all. Clause 2,077 is my favorite.' },
    { ru:'Меня боятся на девяти станциях. На десятой меня уважают. Я живу на десятой.', en:'Nine stations fear me. A tenth respects me. I live on the tenth.' },
    { ru:'Штрафной пункт 12 я выписывал 348 раз. Наизусть. С закрытыми глазами. С грустью.', en:'I have issued penalty clause 12 exactly 348 times. From memory. Eyes closed. With sorrow.' },
    { ru:'Однажды я не нашёл ни одного отклонения. Я проверил себя. Отклонений не было и во мне.', en:'Once I found no deviations at all. I inspected myself. There were none in me either.' },
    { ru:'Гильдия создавалась, чтобы зелья не взрывались. Романтики в нашей работе больше, чем кажется.', en:'The Guild was founded so potions would stop exploding. There is more romance in our work than it seems.' },
    { ru:'В протоколе есть графа «примечания». Я впервые ею воспользовался. Написал: «образцово».', en:'The record has a "remarks" field. I used it for the first time. I wrote: "exemplary".' },
    { ru:'Мой значок инспектора — из переплавленного котла первого гильдейца. Мы помним, с чего начинали.', en:'My inspector’s badge is cast from the first guildsman’s melted cauldron. We remember where we started.' },
    { ru:'После отставки я подам заявку на лицензию зельевара. Экзаменатору придётся постараться.', en:'After retirement I will apply for a potioner’s license. The examiner will have to work hard.' }
  ],
  apothecary_mo: [
    { ru:'За каждым моим заказом — пациент. Я не говорю им, где беру основу. Пусть думают, что это магия.', en:'Behind each of my orders is a patient. I don’t tell them where I get the base. Let them think it’s magic.' },
    { ru:'Я лечу окраину сектора сорок лет. Окраина упрямая. Я упрямее.', en:'I have doctored the sector’s edge for forty years. The edge is stubborn. I am more so.' },
    { ru:'Первого пациента я помню по запаху лекарства. Полынь и озон. Он выжил.', en:'I remember my first patient by the medicine’s smell. Wormwood and ozone. He lived.' },
    { ru:'Рука не должна дрогнуть. Моя дрогнула однажды. С тех пор я заказываю основу у тебя.', en:'The hand must not shake. Mine did, once. I have ordered my bases from you ever since.' },
    { ru:'Дозировка — это уважение. К болезни в том числе.', en:'Dosage is respect. Toward the illness, too.' },
    { ru:'В моей аптеке нет очередей. Я помню, когда у каждого кончается курс, и прихожу сюда заранее.', en:'My pharmacy has no queues. I know when each course runs out, and I come here in advance.' },
    { ru:'Пациенты зовут мои микстуры «горькое чудо». Горечь — моя. Чудо, подозреваю, твоё.', en:'Patients call my mixtures "the bitter miracle". The bitterness is mine. The miracle, I suspect, is yours.' },
    { ru:'Когда-нибудь я возьму ученика. Первым уроком будет дорога до этой лавки.', en:'Someday I will take an apprentice. The first lesson will be the road to this shop.' }
  ],
  swarm_navigator: [
    { ru:'НАС — миллионы. Говорить одним голосом МЫ учились тысячу лет. Слушать — до сих пор учимся.', en:'WE number millions. WE spent a thousand years learning to speak with one voice. WE are still learning to listen.' },
    { ru:'Одиночество для Роя — теоретическое понятие. МЫ выучили его недавно. МЫ не рекомендуем.', en:'For the Swarm, loneliness is theoretical. WE learned the concept recently. WE do not recommend it.' },
    { ru:'Каждый узел сети помнит вкус первой смеси отсюда. Все миллионы. Одновременно.', en:'Every node of the network remembers the taste of the first mixture from here. All millions. Simultaneously.' },
    { ru:'МЫ спорим внутри себя. Побеждает не громкий. Побеждает точный.', en:'WE argue within OURSELVES. The loud do not win. The precise do.' },
    { ru:'Когда один из НАС угасает, Рой поёт его частоту сутки. Потом она становится частью маршрута.', en:'When one of US fades, the Swarm sings their frequency for a day. Then it becomes part of the route.' },
    { ru:'Твоя лавка отмечена в НАШИХ картах особым знаком. Перевод примерный: «улей друга».', en:'Your shop is marked on OUR maps with a special sign. Rough translation: "a friend’s hive".' },
    { ru:'МЫ пробовали объяснить одиночке, каково быть Роем. Ближе всего оказалось слово «дом».', en:'WE tried to explain to a singleton what being the Swarm is like. The closest word turned out to be "home".' },
    { ru:'Однажды МЫ пригласим тебя услышать Рой изнутри. На один вдох. Дольше нельзя. Понравится.', en:'One day WE will invite you to hear the Swarm from inside. For one breath. No longer is allowed. You will like it.' }
  ],
  vex: [
    { ru:'Корабли живые. Это не метафора, это диагноз. Мой диагноз, я имею право.', en:'Ships are alive. That is not a metaphor, it is a diagnosis. Mine — I am licensed to make it.' },
    { ru:'Первую операцию я провёл на собственном шаттле. Мы оба выжили. Он до сих пор обижается.', en:'My first operation was on my own shuttle. We both survived. It still holds a grudge.' },
    { ru:'Крейсер на девять тысяч душ по ночам поскрипывает. Это он дышит. Я проверял.', en:'The nine-thousand-soul cruiser creaks at night. That is it breathing. I checked.' },
    { ru:'Люфт я не прощаю, потому что однажды простил. Счёт был девять тысяч к одному люфту.', en:'I do not forgive slack because I forgave it once. The score was nine thousand souls to one slack joint.' },
    { ru:'Руки хирурга должны быть тёплыми. Даже если они из титана. Я подогреваю.', en:'A surgeon’s hands must be warm. Even titanium ones. I preheat them.' },
    { ru:'Твоя смесь в открытом реакторе ведёт себя как родная. Реактор согласен.', en:'Your mixture behaves like native fluid in an open reactor. The reactor concurs.' },
    { ru:'Я разговариваю с пациентами во время операций. Двигатели любят, когда с ними честны.', en:'I talk to my patients during surgery. Engines like being told the truth.' },
    { ru:'Когда-нибудь я вылечу корабль, который привезёт мне запчасти для меня самого. Круговорот заботы.', en:'Someday I will heal the ship that brings spare parts for me. The circulation of care.' }
  ],
  racer_kai: [
    { ru:'Финиш длится секунду. Всё остальное — подготовка к ней.', en:'The finish lasts a second. Everything else is preparation for it.' },
    { ru:'Мой болид зовут «Ксель». Не спрашивай почему. Он сам представился.', en:'My racer’s name is "Xel". Don’t ask why. It introduced itself.' },
    { ru:'Первую гонку я проиграла из-за смеси. Последнюю сотню — выигрываю из-за неё же. Другой лавки.', en:'I lost my first race because of a mixture. I’ve won the last hundred because of one too. A different shop’s.' },
    { ru:'На вираже время густеет. В нём можно успеть подумать. Я думаю о следующем вираже.', en:'Time thickens on a turn. There is room to think in it. I think about the next turn.' },
    { ru:'Спонсоры проверяют ливрею. Механик — октан. Я — только одно: чтобы руки не дрожали. Твои.', en:'Sponsors check the livery. The mechanic checks the octane. I check one thing: that the hands don’t shake. Yours.' },
    { ru:'Второе место — это первое среди проигравших. Цитата моего первого тренера. И последняя его цитата.', en:'Second place is first among the losers. My first coach’s quote. Also his last.' },
    { ru:'После финала я всегда делаю круг почёта мимо твоей лавки. Ты просто не видишь — быстро.', en:'After a final I always take a victory lap past your shop. You just never see it — too fast.' },
    { ru:'Когда завершу карьеру — стану возить смеси. По самым коротким траекториям во вселенной.', en:'When I retire, I’ll haul mixtures. Along the shortest trajectories in the universe.' }
  ],
  archivist: [
    { ru:'Я записываю всё. Эту фразу я тоже записал. И эту.', en:'I record everything. I recorded that sentence too. And this one.' },
    { ru:'Архив стоит на краю вселенной, потому что здесь тише всего слышно, как пишется история.', en:'The Archive stands at the universe’s edge because history writing itself is quietest to hear from here.' },
    { ru:'Идеальных смесей в Архиве было четыре. Раздел пришлось расширять. Впервые за эпоху.', en:'The Archive held four perfect mixtures. The section had to be expanded. First time in an era.' },
    { ru:'Чернила для летописи я развожу на здешних смесях. История стала ярче. Буквально.', en:'I thin the chronicle’s inks with mixtures from here. History became brighter. Literally.' },
    { ru:'Между главами вселенной есть закладки. Одна из них — твоя лавка.', en:'There are bookmarks between the universe’s chapters. One of them is your shop.' },
    { ru:'Самая короткая запись Архива: «Сегодня ничего не случилось». Я горжусь тем днём.', en:'The Archive’s shortest entry: "Nothing happened today". I am proud of that day.' },
    { ru:'Забвение — единственное, с чем я воюю. Пока счёт в мою пользу.', en:'Oblivion is the only thing I war with. So far the score favors me.' },
    { ru:'Последняя страница Архива уже существует. Я подглядел. Там хорошая концовка.', en:'The Archive’s final page already exists. I peeked. It is a good ending.' }
  ],
  supernova_child: [
    { ru:'я. помню. как. было. быть. звездой. тесно. и. очень. светло.', en:'i. remember. what it was. to be. a star. cramped. and very. bright.' },
    { ru:'мама. взорвалась. чтобы. я. было. так. у. звёзд. принято.', en:'mother. exploded. so that. i. could be. that is. how stars. do it.' },
    { ru:'вчера. я. узнало. слово. «лавка». сегодня. слово. «нравится».', en:'yesterday. i. learned. the word. "shop". today. the word. "like".' },
    { ru:'осколки. мамы. теперь. другие. звёзды. мы. переписываемся. светом.', en:'mother’s. fragments. are. other stars. now. we. write letters. in light.' },
    { ru:'банки. тёплые. как. внутри. мамы. я. проверило.', en:'the jars. are warm. like. inside. mother. i. checked.' },
    { ru:'расти. обратно. в. звезду. долго. я. не. тороплюсь. тут. хорошо.', en:'growing. back. into. a star. takes long. i am. not. hurrying. it is good. here.' },
    { ru:'ты. делаешь. маленькие. взрывы. в. банках. только. добрые.', en:'you. make. little. explosions. in jars. only. kind ones.' },
    { ru:'когда. я. стану. звездой. снова. я. буду. светить. сюда. первым. лучом.', en:'when. i. become. a star. again. my first. ray. will shine. here.' }
  ],
  the_waiter: [
    { ru:'Я ждал до того, как появилось слово «ждать». Слово получилось неточным.', en:'I waited before the word "wait" existed. The word came out imprecise.' },
    { ru:'Меня спрашивают, чего я жду. Если бы я ответил, ждать стало бы не нужно. Пока рано.', en:'They ask what I am waiting for. If I answered, the waiting would end. Too early for that.' },
    { ru:'Я видел все варианты будущего. В большинстве из них есть эта лавка. Это хороший знак.', en:'I have seen every version of the future. Most of them contain this shop. That is a good sign.' },
    { ru:'Время не идёт. Оно стоит, а идём мы. Я просто остановился посмотреть.', en:'Time does not pass. It stands still while we pass. I merely stopped to watch.' },
    { ru:'Терпение — не добродетель. Это ландшафт. Я в нём живу.', en:'Patience is not a virtue. It is a landscape. I live there.' },
    { ru:'Последний закат я видел трижды. Каждый раз он был последним по-новому.', en:'I have seen the last sunset three times. Each time it was last in a new way.' },
    { ru:'Ожидание имеет объём. Твои сосуды — первые, куда оно помещается целиком.', en:'Waiting has volume. Your vessels are the first that hold all of it.' },
    { ru:'Когда всё закончится — а всё закончится — я приду сюда. Досидеть.', en:'When everything ends — and everything ends — I will come here. To wait out the rest.' }
  ]
};

// ---------- Фаза J: пассивки по каждому НПС ----------
// 5 пассивок на НПС; пассивка с индексом i открывается на уровне
// репутации i+1 (пороги — REP_LEVELS). Игрок держит активными до 3
// одновременно (на цикл) — выбор в панели "⚡ Пассивки".
//   scope:'npc'    — работает ТОЛЬКО в заданиях этого НПС (синяя рамка,
//                    эффект сильнее);
//   scope:'global' — работает во ВСЕХ заданиях (белая рамка, слабее).
//   fx — эффекты (складываются между активными пассивками):
//     score     — множитель к награде за очки (+0.15 = +15%)
//     craftTime — множитель к таймеру "воссоздай" (может быть < 0 — риск)
//     memTime   — множитель к таймеру запоминания
//     speedCap  — прибавка к потолку бонуса за скорость (абсолютная)
//     rep       — множитель к ПРИРОСТУ репутации
//     progress  — множитель к весу "коллекционного" прогресса
//   Добавить новый тип эффекта — см. computePassiveFx() в game.js.
const NPC_PASSIVES = {
  drone: [
    { id:'p1', scope:'npc', icon:'📦', fx:{score:0.15},
      name:{ ru:'Оптовый контракт', en:'Bulk contract' }, desc:{ ru:'+15% очков за задания дрона', en:'+15% score on the drone’s orders' } },
    { id:'p2', scope:'global', icon:'🗺', fx:{memTime:0.06},
      name:{ ru:'Свежие карты доков', en:'Fresh dock charts' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'⏱', fx:{craftTime:0.15},
      name:{ ru:'Стыковка без очереди', en:'Priority docking' }, desc:{ ru:'+15% времени на воссоздание в заданиях дрона', en:'+15% craft time on the drone’s orders' } },
    { id:'p4', scope:'global', icon:'📡', fx:{rep:0.08},
      name:{ ru:'Рассылка по дронам', en:'Drone mailing list' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🧨', fx:{score:0.2, progress:0.2},
      name:{ ru:'Сверхнормативная смена', en:'Overtime shift' }, desc:{ ru:'+20% очков и +20% прогресса в заданиях дрона', en:'+20% score and +20% progress on the drone’s orders' } }
  ],
  tentacloid: [
    { id:'p1', scope:'npc', icon:'💝', fx:{score:0.15},
      name:{ ru:'Щедрые чаевые', en:'Generous tips' }, desc:{ ru:'+15% очков за задания тентаклоида', en:'+15% score on the tentacloid’s orders' } },
    { id:'p2', scope:'global', icon:'🌊', fx:{craftTime:0.05},
      name:{ ru:'Спокойствие прилива', en:'Calm of the tide' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'👁', fx:{memTime:0.2},
      name:{ ru:'Показ без спешки', en:'An unhurried showing' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'✨', fx:{progress:0.06},
      name:{ ru:'Чувство прекрасного', en:'A sense of beauty' }, desc:{ ru:'+6% к весу прогресса во всех заданиях', en:'+6% progress weight on all orders' } },
    { id:'p5', scope:'npc', icon:'🐙', fx:{score:0.25, craftTime:-0.12},
      name:{ ru:'Восемь рук помощи', en:'Eight helping hands' }, desc:{ ru:'−12% времени, но +25% очков в его заданиях', en:'−12% time but +25% score on his orders' } }
  ],
  gourmet_vega: [
    { id:'p1', scope:'npc', icon:'⭐', fx:{score:0.15},
      name:{ ru:'Рекомендация гида', en:'A guidebook mention' }, desc:{ ru:'+15% очков за задания гурмана', en:'+15% score on the gourmet’s orders' } },
    { id:'p2', scope:'global', icon:'👅', fx:{memTime:0.06},
      name:{ ru:'Тренированный вкус', en:'A trained palate' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'🍷', fx:{craftTime:0.15},
      name:{ ru:'Дегустация не спешит', en:'Tastings take time' }, desc:{ ru:'+15% времени на воссоздание в его заданиях', en:'+15% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'📖', fx:{rep:0.08},
      name:{ ru:'Сарафанное радио', en:'Word of mouth' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🎩', fx:{score:0.2, speedCap:0.15},
      name:{ ru:'Ужин от шефа', en:'The chef’s table' }, desc:{ ru:'+20% очков и +15 п.п. к бонусу скорости в его заданиях', en:'+20% score and +15 pts to the speed bonus cap on his orders' } }
  ],
  logic9: [
    { id:'p1', scope:'npc', icon:'🧮', fx:{score:0.15},
      name:{ ru:'ПРЕМИЯ ЗА ТОЧНОСТЬ', en:'PRECISION BONUS' }, desc:{ ru:'+15% очков за задания Логика-9', en:'+15% score on Logic-9’s orders' } },
    { id:'p2', scope:'global', icon:'⏲', fx:{craftTime:0.05},
      name:{ ru:'ОПТИМИЗАЦИЯ ТАКТА', en:'CLOCK OPTIMIZATION' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'📊', fx:{memTime:0.2},
      name:{ ru:'РАСШИРЕННЫЙ БУФЕР', en:'EXTENDED BUFFER' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'⚡', fx:{speedCap:0.05},
      name:{ ru:'ПАРАЛЛЕЛЬНЫЙ ПОТОК', en:'PARALLEL THREAD' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p5', scope:'npc', icon:'🔋', fx:{score:0.25, craftTime:-0.12},
      name:{ ru:'РАЗГОН ЯДРА', en:'CORE OVERCLOCK' }, desc:{ ru:'−12% времени, но +25% очков в его заданиях', en:'−12% time but +25% score on his orders' } }
  ],
  last_of_ir: [
    { id:'p1', scope:'npc', icon:'🌅', fx:{score:0.15},
      name:{ ru:'Дар угасающих', en:'Gift of the fading' }, desc:{ ru:'+15% очков за задания Последнего из Ир', en:'+15% score on the Last of the Ir’s orders' } },
    { id:'p2', scope:'global', icon:'🕯', fx:{progress:0.06},
      name:{ ru:'Память поколений', en:'Memory of generations' }, desc:{ ru:'+6% к весу прогресса во всех заданиях', en:'+6% progress weight on all orders' } },
    { id:'p3', scope:'npc', icon:'🌌', fx:{memTime:0.2},
      name:{ ru:'Небо, которого нет', en:'A sky that is gone' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'💠', fx:{rep:0.08},
      name:{ ru:'Слово последнего', en:'The last one’s word' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🏺', fx:{score:0.2, progress:0.25},
      name:{ ru:'Наследие Ир', en:'Legacy of the Ir' }, desc:{ ru:'+20% очков и +25% прогресса в его заданиях', en:'+20% score and +25% progress on his orders' } }
  ],
  nebula_chef: [
    { id:'p1', scope:'npc', icon:'💰', fx:{score:0.15},
      name:{ ru:'Процент с банкета', en:'A cut of the banquet' }, desc:{ ru:'+15% очков за задания шефа', en:'+15% score on the chef’s orders' } },
    { id:'p2', scope:'global', icon:'📐', fx:{memTime:0.06},
      name:{ ru:'Глазомер кухни', en:'A kitchen eye' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'🍳', fx:{craftTime:0.15},
      name:{ ru:'Медленный огонь', en:'A slow flame' }, desc:{ ru:'+15% времени на воссоздание в его заданиях', en:'+15% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'🍽', fx:{progress:0.06},
      name:{ ru:'Мишленовская выучка', en:'Michelin training' }, desc:{ ru:'+6% к весу прогресса во всех заданиях', en:'+6% progress weight on all orders' } },
    { id:'p5', scope:'npc', icon:'🔥', fx:{score:0.25, craftTime:-0.12},
      name:{ ru:'Час пик на кухне', en:'Kitchen rush hour' }, desc:{ ru:'−12% времени, но +25% очков в его заданиях', en:'−12% time but +25% score on his orders' } }
  ],
  twofaced_priestess: [
    { id:'p1', scope:'npc', icon:'🙏', fx:{score:0.15},
      name:{ ru:'Подношение храма', en:'The temple’s offering' }, desc:{ ru:'+15% очков за задания жрицы', en:'+15% score on the priestess’s orders' } },
    { id:'p2', scope:'global', icon:'🌗', fx:{memTime:0.06},
      name:{ ru:'Взгляд двух богов', en:'The gaze of two gods' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'🕊', fx:{craftTime:0.15},
      name:{ ru:'Благословение заката', en:'Blessing of the sunset' }, desc:{ ru:'+15% времени на воссоздание в её заданиях', en:'+15% craft time on her orders' } },
    { id:'p4', scope:'global', icon:'💠', fx:{rep:0.08},
      name:{ ru:'Молва прихода', en:'The parish’s word' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🧿', fx:{score:0.2, rep:0.3},
      name:{ ru:'Милость близнецов', en:'The twins’ favor' }, desc:{ ru:'+20% очков и +30% репутации в её заданиях', en:'+20% score and +30% reputation on her orders' } }
  ],
  plasma_bartender: [
    { id:'p1', scope:'npc', icon:'🍹', fx:{score:0.15},
      name:{ ru:'За счёт заведения', en:'On the house' }, desc:{ ru:'+15% очков за задания бармена', en:'+15% score on the bartender’s orders' } },
    { id:'p2', scope:'global', icon:'🎵', fx:{speedCap:0.05},
      name:{ ru:'Чувство ритма', en:'A sense of rhythm' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p3', scope:'npc', icon:'🕺', fx:{memTime:0.2},
      name:{ ru:'Замедленный бит', en:'A slowed-down beat' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'🎧', fx:{craftTime:0.05},
      name:{ ru:'Фоновый грув', en:'Background groove' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p5', scope:'npc', icon:'⚡', fx:{score:0.2, speedCap:0.15},
      name:{ ru:'Хэдлайнер вечера', en:'Headliner of the night' }, desc:{ ru:'+20% очков и +15 п.п. к бонусу скорости в его заданиях', en:'+20% score and +15 pts to the speed bonus cap on his orders' } }
  ],
  janitor: [
    { id:'p1', scope:'npc', icon:'🪙', fx:{score:0.15},
      name:{ ru:'Премия из тумбочки', en:'A bonus from the drawer' }, desc:{ ru:'+15% очков за задания уборщика', en:'+15% score on the janitor’s orders' } },
    { id:'p2', scope:'global', icon:'🧽', fx:{craftTime:0.05},
      name:{ ru:'Прибранное рабочее место', en:'A tidy workbench' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'🗝', fx:{memTime:0.2},
      name:{ ru:'Знает все углы', en:'Knows every corner' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'🤝', fx:{rep:0.08},
      name:{ ru:'Свой человек на станции', en:'A friend on the station' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🪣', fx:{score:0.2, progress:0.2},
      name:{ ru:'Генеральная уборка', en:'The deep clean' }, desc:{ ru:'+20% очков и +20% прогресса в его заданиях', en:'+20% score and +20% progress on his orders' } }
  ],
  intern_beep: [
    { id:'p1', scope:'npc', icon:'🍬', fx:{score:0.15},
      name:{ ru:'Сэкономил на обеде', en:'Saved his lunch money' }, desc:{ ru:'+15% очков за задания стажёра', en:'+15% score on the intern’s orders' } },
    { id:'p2', scope:'global', icon:'📝', fx:{memTime:0.06},
      name:{ ru:'Конспект под рукой', en:'Notes at hand' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'⏰', fx:{craftTime:0.15},
      name:{ ru:'Шеф ушёл на совещание', en:'The boss is in a meeting' }, desc:{ ru:'+15% времени на воссоздание в его заданиях', en:'+15% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'🌱', fx:{progress:0.06},
      name:{ ru:'Учимся вместе', en:'Learning together' }, desc:{ ru:'+6% к весу прогресса во всех заданиях', en:'+6% progress weight on all orders' } },
    { id:'p5', scope:'npc', icon:'🎓', fx:{score:0.2, rep:0.3},
      name:{ ru:'Первая похвала шефа', en:'The boss’s first praise' }, desc:{ ru:'+20% очков и +30% репутации в его заданиях', en:'+20% score and +30% reputation on his orders' } }
  ],
  trucker_chrome: [
    { id:'p1', scope:'npc', icon:'💵', fx:{score:0.15},
      name:{ ru:'Оплата наличными', en:'Cash payment' }, desc:{ ru:'+15% очков за задания дальнобойщика', en:'+15% score on the hauler’s orders' } },
    { id:'p2', scope:'global', icon:'🛣', fx:{craftTime:0.05},
      name:{ ru:'Дорожная выдержка', en:'Road patience' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'📻', fx:{memTime:0.2},
      name:{ ru:'Разговор под рацию', en:'Radio chatter' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'🤝', fx:{rep:0.08},
      name:{ ru:'Слухи с трассы', en:'Highway rumors' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🚛', fx:{score:0.25, craftTime:-0.12},
      name:{ ru:'Срочный груз', en:'A rush haul' }, desc:{ ru:'−12% времени, но +25% очков в его заданиях', en:'−12% time but +25% score on his orders' } }
  ],
  fashionista: [
    { id:'p1', scope:'npc', icon:'💳', fx:{score:0.15},
      name:{ ru:'Платит не глядя', en:'Pays without looking' }, desc:{ ru:'+15% очков за задания модницы', en:'+15% score on the fashionista’s orders' } },
    { id:'p2', scope:'global', icon:'👁', fx:{memTime:0.06},
      name:{ ru:'Намётанный глаз', en:'A practiced eye' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'💅', fx:{craftTime:0.15},
      name:{ ru:'Примерка не к спеху', en:'Fittings take time' }, desc:{ ru:'+15% времени на воссоздание в её заданиях', en:'+15% craft time on her orders' } },
    { id:'p4', scope:'global', icon:'📸', fx:{rep:0.08},
      name:{ ru:'Упоминание в ленте', en:'A feed mention' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'👑', fx:{score:0.2, rep:0.3},
      name:{ ru:'Икона сезона', en:'Icon of the season' }, desc:{ ru:'+20% очков и +30% репутации в её заданиях', en:'+20% score and +30% reputation on her orders' } }
  ],
  collector_gz: [
    { id:'p1', scope:'npc', icon:'💰', fx:{score:0.15},
      name:{ ru:'Цена коллекционера', en:'A collector’s price' }, desc:{ ru:'+15% очков за задания коллекционера', en:'+15% score on the collector’s orders' } },
    { id:'p2', scope:'global', icon:'🐌', fx:{craftTime:0.05},
      name:{ ru:'Никакой спешки', en:'No hurry at all' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'🔍', fx:{memTime:0.2},
      name:{ ru:'Осмотр с лупой', en:'Inspection by loupe' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'🏺', fx:{progress:0.06},
      name:{ ru:'Коллекционная ценность', en:'Collectible value' }, desc:{ ru:'+6% к весу прогресса во всех заданиях', en:'+6% progress weight on all orders' } },
    { id:'p5', scope:'npc', icon:'📚', fx:{score:0.2, progress:0.25},
      name:{ ru:'Место на полке 44', en:'A spot on shelf 44' }, desc:{ ru:'+20% очков и +25% прогресса в его заданиях', en:'+20% score and +25% progress on his orders' } }
  ],
  dj_pulsar: [
    { id:'p1', scope:'npc', icon:'🎟', fx:{score:0.15},
      name:{ ru:'Гонорар за сет', en:'Set fee' }, desc:{ ru:'+15% очков за задания диджея', en:'+15% score on the DJ’s orders' } },
    { id:'p2', scope:'global', icon:'🎚', fx:{speedCap:0.05},
      name:{ ru:'Держать темп', en:'Keep the tempo' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p3', scope:'npc', icon:'🎛', fx:{craftTime:0.15},
      name:{ ru:'Затянутый переход', en:'An extended blend' }, desc:{ ru:'+15% времени на воссоздание в его заданиях', en:'+15% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'📢', fx:{rep:0.08},
      name:{ ru:'Шаутаут со сцены', en:'A shout-out from the stage' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'💿', fx:{score:0.2, speedCap:0.15},
      name:{ ru:'Пиковый час', en:'Peak hour' }, desc:{ ru:'+20% очков и +15 п.п. к бонусу скорости в его заданиях', en:'+20% score and +15 pts to the speed bonus cap on his orders' } }
  ],
  perfumer: [
    { id:'p1', scope:'npc', icon:'💎', fx:{score:0.15},
      name:{ ru:'Плата за нюанс', en:'The price of nuance' }, desc:{ ru:'+15% очков за задания парфюмера', en:'+15% score on the perfumer’s orders' } },
    { id:'p2', scope:'global', icon:'👃', fx:{memTime:0.06},
      name:{ ru:'Память обоняния', en:'Olfactory memory' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'🫗', fx:{craftTime:0.15},
      name:{ ru:'Выдержка аромата', en:'Letting the scent rest' }, desc:{ ru:'+15% времени на воссоздание в его заданиях', en:'+15% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'🌙', fx:{progress:0.06},
      name:{ ru:'Школа Тысячи Лун', en:'School of a Thousand Moons' }, desc:{ ru:'+6% к весу прогресса во всех заданиях', en:'+6% progress weight on all orders' } },
    { id:'p5', scope:'npc', icon:'🌸', fx:{score:0.2, progress:0.25},
      name:{ ru:'Формула века', en:'Formula of the century' }, desc:{ ru:'+20% очков и +25% прогресса в его заданиях', en:'+20% score and +25% progress on his orders' } }
  ],
  guild_inspector: [
    { id:'p1', scope:'npc', icon:'🏛', fx:{score:0.15},
      name:{ ru:'Гильдейская ставка', en:'The Guild rate' }, desc:{ ru:'+15% очков за задания инспектора', en:'+15% score on the inspector’s orders' } },
    { id:'p2', scope:'global', icon:'📋', fx:{memTime:0.06},
      name:{ ru:'Работа по чек-листу', en:'Working the checklist' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'🖋', fx:{craftTime:0.15},
      name:{ ru:'Продлённая приёмка', en:'An extended acceptance' }, desc:{ ru:'+15% времени на воссоздание в его заданиях', en:'+15% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'📜', fx:{rep:0.08},
      name:{ ru:'Гильдейская рекомендация', en:'A Guild recommendation' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🎖', fx:{score:0.2, rep:0.3},
      name:{ ru:'Знак качества', en:'The mark of quality' }, desc:{ ru:'+20% очков и +30% репутации в его заданиях', en:'+20% score and +30% reputation on his orders' } }
  ],
  apothecary_mo: [
    { id:'p1', scope:'npc', icon:'💊', fx:{score:0.15},
      name:{ ru:'Аптечная наценка', en:'The pharmacy markup' }, desc:{ ru:'+15% очков за задания аптекаря', en:'+15% score on the apothecary’s orders' } },
    { id:'p2', scope:'global', icon:'🧘', fx:{craftTime:0.05},
      name:{ ru:'Твёрдая рука', en:'A steady hand' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'📖', fx:{memTime:0.2},
      name:{ ru:'Рецепт наизусть', en:'The prescription by heart' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'❤️', fx:{rep:0.08},
      name:{ ru:'Благодарные пациенты', en:'Grateful patients' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'⚗️', fx:{score:0.2, progress:0.2},
      name:{ ru:'Горькое чудо', en:'The bitter miracle' }, desc:{ ru:'+20% очков и +20% прогресса в его заданиях', en:'+20% score and +20% progress on his orders' } }
  ],
  swarm_navigator: [
    { id:'p1', scope:'npc', icon:'🍯', fx:{score:0.15},
      name:{ ru:'Доля улья', en:'The hive’s share' }, desc:{ ru:'+15% очков за задания Роя', en:'+15% score on the Swarm’s orders' } },
    { id:'p2', scope:'global', icon:'👀', fx:{memTime:0.06},
      name:{ ru:'Тысяча глаз', en:'A thousand eyes' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'🕸', fx:{craftTime:0.15},
      name:{ ru:'Рой не торопит', en:'The Swarm does not rush' }, desc:{ ru:'+15% времени на воссоздание в заданиях Роя', en:'+15% craft time on the Swarm’s orders' } },
    { id:'p4', scope:'global', icon:'📡', fx:{rep:0.08},
      name:{ ru:'Сигнал по всей сети', en:'A network-wide signal' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🐝', fx:{score:0.2, progress:0.2},
      name:{ ru:'Признание Роя', en:'The Swarm’s recognition' }, desc:{ ru:'+20% очков и +20% прогресса в заданиях Роя', en:'+20% score and +20% progress on the Swarm’s orders' } }
  ],
  vex: [
    { id:'p1', scope:'npc', icon:'🩺', fx:{score:0.15},
      name:{ ru:'Хирургический тариф', en:'The surgical rate' }, desc:{ ru:'+15% очков за задания Векса', en:'+15% score on Vex’s orders' } },
    { id:'p2', scope:'global', icon:'🔩', fx:{craftTime:0.05},
      name:{ ru:'Без люфтов', en:'No slack' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'💡', fx:{memTime:0.2},
      name:{ ru:'Свет операционной', en:'The operating lamp' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'⚡', fx:{speedCap:0.05},
      name:{ ru:'Отточенные движения', en:'Honed movements' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p5', scope:'npc', icon:'🫀', fx:{score:0.25, craftTime:-0.12},
      name:{ ru:'Экстренная операция', en:'Emergency surgery' }, desc:{ ru:'−12% времени, но +25% очков в его заданиях', en:'−12% time but +25% score on his orders' } }
  ],
  racer_kai: [
    { id:'p1', scope:'npc', icon:'🏆', fx:{score:0.15},
      name:{ ru:'Призовые за этап', en:'Stage prize money' }, desc:{ ru:'+15% очков за задания гонщицы', en:'+15% score on the racer’s orders' } },
    { id:'p2', scope:'global', icon:'⚡', fx:{speedCap:0.05},
      name:{ ru:'Рефлексы пилота', en:'A pilot’s reflexes' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p3', scope:'npc', icon:'🔧', fx:{craftTime:0.15},
      name:{ ru:'Техпауза в боксах', en:'A technical pause in the pits' }, desc:{ ru:'+15% времени на воссоздание в её заданиях', en:'+15% craft time on her orders' } },
    { id:'p4', scope:'global', icon:'📣', fx:{rep:0.08},
      name:{ ru:'Интервью после финиша', en:'The post-race interview' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🏁', fx:{score:0.25, craftTime:-0.12},
      name:{ ru:'Финальный круг', en:'The final lap' }, desc:{ ru:'−12% времени, но +25% очков в её заданиях', en:'−12% time but +25% score on her orders' } }
  ],
  archivist: [
    { id:'p1', scope:'npc', icon:'🖋', fx:{score:0.15},
      name:{ ru:'Гонорар летописца', en:'The chronicler’s fee' }, desc:{ ru:'+15% очков за задания Хранителя', en:'+15% score on the Keeper’s orders' } },
    { id:'p2', scope:'global', icon:'📖', fx:{memTime:0.06},
      name:{ ru:'Архивная выучка', en:'Archival training' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'🕰', fx:{craftTime:0.15},
      name:{ ru:'История подождёт', en:'History can wait' }, desc:{ ru:'+15% времени на воссоздание в его заданиях', en:'+15% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'📜', fx:{progress:0.06},
      name:{ ru:'Вписано в летопись', en:'Entered in the chronicle' }, desc:{ ru:'+6% к весу прогресса во всех заданиях', en:'+6% progress weight on all orders' } },
    { id:'p5', scope:'npc', icon:'🏛', fx:{score:0.2, progress:0.25},
      name:{ ru:'Глава о лавке', en:'The chapter on the shop' }, desc:{ ru:'+20% очков и +25% прогресса в его заданиях', en:'+20% score and +25% progress on his orders' } }
  ],
  supernova_child: [
    { id:'p1', scope:'npc', icon:'🌟', fx:{score:0.15},
      name:{ ru:'звёздная. пыль. в подарок', en:'star. dust. as a gift' }, desc:{ ru:'+15% очков за задания Дитя', en:'+15% score on the Child’s orders' } },
    { id:'p2', scope:'global', icon:'💫', fx:{memTime:0.06},
      name:{ ru:'память. света', en:'the memory. of light' }, desc:{ ru:'+6% времени на запоминание во всех заданиях', en:'+6% memorize time on all orders' } },
    { id:'p3', scope:'npc', icon:'🌠', fx:{memTime:0.2},
      name:{ ru:'смотрит. не. моргая', en:'watching. without. blinking' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on its orders' } },
    { id:'p4', scope:'global', icon:'✨', fx:{rep:0.08},
      name:{ ru:'все. любят. дитя', en:'everyone. loves. the child' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'💥', fx:{score:0.2, rep:0.3},
      name:{ ru:'как. мама', en:'like. mother' }, desc:{ ru:'+20% очков и +30% репутации в его заданиях', en:'+20% score and +30% reputation on its orders' } }
  ],
  the_waiter: [
    { id:'p1', scope:'npc', icon:'🪙', fx:{score:0.15},
      name:{ ru:'Монеты из ниоткуда', en:'Coins from nowhere' }, desc:{ ru:'+15% очков за задания Того-Кто-Ждёт', en:'+15% score on The One Who Waits’ orders' } },
    { id:'p2', scope:'global', icon:'⏳', fx:{craftTime:0.05},
      name:{ ru:'Одолженное время', en:'Borrowed time' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'🌒', fx:{memTime:0.2},
      name:{ ru:'Пауза между мгновениями', en:'A pause between instants' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'♾', fx:{progress:0.06},
      name:{ ru:'Терпение как ландшафт', en:'Patience as a landscape' }, desc:{ ru:'+6% к весу прогресса во всех заданиях', en:'+6% progress weight on all orders' } },
    { id:'p5', scope:'npc', icon:'🔮', fx:{score:0.2, progress:0.25},
      name:{ ru:'Один из хороших вариантов', en:'One of the good futures' }, desc:{ ru:'+20% очков и +25% прогресса в его заданиях', en:'+20% score and +25% progress on his orders' } }
  ]
};
