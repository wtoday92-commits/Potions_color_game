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
  DIFF_BTN_TITLE_1:  { ru:'Сложность регуляторов: 1 — доступен только цвет. Нажми, чтобы сменить.', en:'Regulator difficulty: 1 — only color available. Click to change.' },
  DIFF_BTN_TITLE_2:  { ru:'Сложность регуляторов: 2 — цвет, оттенок и размер банки. Нажми, чтобы сменить.', en:'Regulator difficulty: 2 — color, tint and jar size. Click to change.' },
  DIFF_BTN_TITLE_3:  { ru:'Сложность регуляторов: 3 — все регуляторы. Нажми, чтобы сменить.', en:'Regulator difficulty: 3 — all regulators. Click to change.' },
  SELECT_TITLE:      { ru:'Кто пришвартовался к лавке?', en:"Who's docked at the shop?" },
  ORDER_LABEL:       { ru:'Заявка №', en:'Order #' },
  FOCUS_PREFIX:      { ru:'фокус:', en:'focus:' },
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
    { tier:1, type:'normal', emoji:'🛰', img: [
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
      memorizeMs:6000, craftMs:22000, colorSteps:6, sizeSteps:5, countMax:5, bsizeSteps:5, reward:50 },
    { tier:2, type:'normal', emoji:'🐙', img: 'assets/npc/tentacloid.png',
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
    { tier:3, type:'normal', emoji:'👾', img: 'assets/npc/gurman.png',
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
    { tier:4, type:'normal', emoji:'🤖', img: 'assets/npc/kai-9.png',
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
    { tier:5, type:'normal', emoji:'👁', img: 'assets/npc/ir.png',
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
    { tier:5, type:'shape', emoji:'🦑', img: 'assets/npc/chef.png',
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
    { tier:5, type:'gradient', emoji:'🧿', img: 'assets/npc/twofaced.png',
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
    { tier:5, type:'moving', emoji:'🍹', img: 'assets/npc/barmen.png',
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
  { tier:1, emoji:'🪣', img: 'assets/npc/janitor.png',
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
  { tier:1, emoji:'📦', img: 'assets/npc/bip.png',
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
  { tier:1, emoji:'🚛', img: 'assets/npc/khrom.png',
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
  { tier:2, emoji:'💅', img: 'assets/npc/fashionista.png',
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
  { tier:2, emoji:'🐌', img: 'assets/npc/collector.png',
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
  { tier:2, emoji:'🎧', img: 'assets/npc/dj.png',
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
  { tier:3, emoji:'🧴', img: 'assets/npc/parfumer.png',
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
  { tier:3, emoji:'🔍', img: 'assets/npc/inspector.png',
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
  { tier:3, emoji:'🦎', img: 'assets/npc/apothecary.png',
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
  { tier:4, emoji:'🐝', img: 'assets/npc/swarm.png',
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
  { tier:4, emoji:'🔧', img: 'assets/npc/vex.png',
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
  { tier:4, emoji:'🏁', img: 'assets/npc/kai.png',
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
  { tier:5, emoji:'📜', img: 'assets/npc/archivist.png',
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
  { tier:5, emoji:'🌟', img: 'assets/npc/supernova.png',
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
  { tier:5, emoji:'⏳', img: 'assets/npc/waiter.png',
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
