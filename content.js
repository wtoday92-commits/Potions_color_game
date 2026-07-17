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
  FIREBASE_DB_URL: '', // например 'https://your-project-default-rtdb.firebaseio.com'
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
const STICKERS = { perfect:'✨🐱', good:'🐱', bad:'💩' };

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
    { tier:1, type:'normal', emoji:'🛰', name:{ ru:'Служебный дрон', en:'Service Drone' },
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
    { tier:2, type:'normal', emoji:'🐙', name:{ ru:'Тентаклоид', en:'Tentacloid' },
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
    { tier:3, type:'normal', emoji:'👾', name:{ ru:'Гурман с Веги', en:'Gourmet from Vega' },
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
    { tier:4, type:'normal', emoji:'🤖', name:{ ru:'Логик-9', en:'Logic-9' },
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
    { tier:5, type:'normal', emoji:'👁', name:{ ru:'Последний из Ир', en:'Last of the Ir' },
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
    { tier:5, type:'shape', emoji:'🦑', name:{ ru:'Шеф туманности', en:'Nebula Chef' },
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
    { tier:5, type:'gradient', emoji:'🧿', name:{ ru:'Двуликая жрица', en:'Two-Faced Priestess' },
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
    { tier:5, type:'moving', emoji:'🍹', name:{ ru:'Бармен плазма-бара', en:'Plasma-Bar Bartender' },
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
  const FOCUS_ICONS = { bubbles:'🫧', color:'🎨', size:'📐' };
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
