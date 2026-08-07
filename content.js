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
  // ---------- Патч "Ежедневный особый заказ" ----------
  DAILY_DOCK_BTN:    { ru:'Дейлик', en:'Daily' },
  DAILY_DIFF_TITLE:  { ru:'Особый заказ дня', en:'The daily special order' },
  DAILY_DIFF_SUB:    { ru:'Сегодня у всех один и тот же набор персонажей. Выбери сложность:', en:"Today everyone gets the same lineup of characters. Choose a difficulty:" },
  DAILY_DIFF_EASY:   { ru:'Серьёзно?', en:'Seriously?' },
  DAILY_DIFF_MID:    { ru:'Ок', en:'Okay' },
  DAILY_DIFF_HARD:   { ru:'Так и было задумано', en:'This was always the plan' },
  DAILY_DIFF_CANCEL: { ru:'Назад', en:'Back' },
  BACK_TO_START_BTN: { ru:'← На стартовый экран', en:'← Back to start screen' },
  DAILY_YESTERDAY_TITLE: { ru:'🏆 Топ-3 вчерашнего дня', en:'🏆 Top 3 from yesterday' },
  DAILY_TODAY_TITLE: { ru:'Рейтинг сегодня', en:'Today’s rating' },
  FS_BTN_TITLE:      { ru:'На весь экран', en:'Fullscreen' },
  SUBTITLE:          { ru:'лавка смесей // сектор Ω // край вселенной', en:'mixture shop // sector Ω // edge of the universe' },
  DAY_LABEL:         { ru:'День', en:'Day' },
  RATING_LABEL:      { ru:'РЕЙТИНГ:', en:'RATING:' },
  LB_BTN_TITLE:      { ru:'Глобальный рейтинг', en:'Global leaderboard' },
  VOLUME_TITLE:      { ru:'Громкость эмбиента', en:'Ambient volume' },
  VOLUME_MUSIC_TITLE:{ ru:'Громкость музыки', en:'Music volume' },
  VOLUME_SFX_TITLE:  { ru:'Громкость звуков', en:'Sound effects volume' },
  LANG_BTN_TITLE:    { ru:'Сменить язык', en:'Switch language' },
  DIFF_BTN_LABEL:    { ru:'УР.', en:'LV.' },
  DIFF_BTN_TITLE_1:  { ru:'Сложность 1 — размер банки и цвет.', en:'Difficulty 1 — jar size and color.' },
  DIFF_BTN_TITLE_2:  { ru:'Сложность 2 — плюс количество сгустков.', en:'Difficulty 2 — plus blob count.' },
  DIFF_BTN_TITLE_3:  { ru:'Сложность 3 — плюс размер сгустков.', en:'Difficulty 3 — plus blob size.' },
  DIFF_BTN_TITLE_4:  { ru:'Сложность 4 — все регуляторы и накал, плюс усиленная уникальная механика персонажа. Больше времени, больше награда.', en:'Difficulty 4 — all regulators and tint, plus the character\'s enhanced unique mechanic. More time, more reward.' },
  BAD_BUBBLE_BADGE:  { ru:'риск', en:'risk' },
  SELECT_TITLE:      { ru:'Кто пришвартовался к лавке?', en:"Who's docked at the shop?" },
  ORDER_LABEL:       { ru:'Заявка №', en:'Order #' },
  FOCUS_PREFIX:      { ru:'фокус:', en:'focus:' },
  NO_FOCUS_LABEL:    { ru:'без модификатора', en:'no modifier' },
  MOD_RAMPAGE_TOAST: { ru:'устроил погром и ушёл', en:'went on a rampage and left' },
  PHASE_SCAN:        { ru:'ЗАПОМИНАЙ, что хочет посетитель', en:'MEMORISE what the visitor wants' },
  PHASE_CRAFT:       { ru:'воссоздай смесь по памяти!', en:'recreate the mixture from memory!' },
  // Фаза игры: прямая подсказка «что делать», с выделенным действием (<b>).
  // Дефолт — для персонажей на обычных ползунках; особые механики — в NPC_CRAFT_HINT.
  CRAFT_HINT_DEFAULT: { ru:'<b>ВОССОЗДАЙ</b> зельё ползунками по памяти', en:'<b>RECREATE</b> the potion with the sliders' },
  BREW_BTN:          { ru:'Готово!', en:'Done!' },
  LABEL_SPECTRUM:    { ru:'Спектр', en:'Spectrum' },
  LABEL_SPECTRUM_A:  { ru:'Спектр А', en:'Spectrum A' },
  LABEL_SPECTRUM_B:  { ru:'Спектр Б', en:'Spectrum B' },
  LABEL_SATURATION:  { ru:'Накал', en:'Intensity' },
  LABEL_VOLUME:      { ru:'Объём', en:'Volume' },
  LABEL_FILL:        { ru:'Уровень', en:'Level' },
  LABEL_DEGREE:      { ru:'Градус', en:'Proof' },
  LABEL_COUNT:       { ru:'Сгустки', en:'Blobs' },
  LABEL_BSIZE:       { ru:'Разм. сгуст.', en:'Blob size' },
  LABEL_SHAPE:       { ru:'Форма', en:'Shape' },
  LABEL_COUNT_QTY:   { ru:'Сгустки (кол-во)', en:'Blobs (count)' },
  LABEL_COUNT_SIZE:  { ru:'Сгустки (размер)', en:'Blobs (size)' },
  REWARD_PREFIX:     { ru:'за идеал: +', en:'for perfect: +' },
  RESULT_PERFECT:    { ru:'Идеальная смесь!', en:'Perfect mixture!' },
  RESULT_GOOD:       { ru:'Годная смесь', en:'Decent mixture' },
  RESULT_SWILL:      { ru:'Пойло', en:'Swill' },
  RESULT_BAD:        { ru:'Брак...', en:'Reject...' },
  SPEED_BONUS:       { ru:'⚡ бонус за скорость: +{p}%', en:'⚡ speed bonus: +{p}%' },
  NEXT_BTN:          { ru:'К шлюзу →', en:'To the airlock →' },
  WEEK_TITLE:        { ru:'Цикл завершён!', en:'Cycle complete!' },
  // Экран итогов цикла (анимированная статистика)
  CS_TITLE:          { ru:'Итоги цикла', en:'Cycle summary' },
  CS_NEXT_BTN:       { ru:'Дальше →', en:'Next →' },
  CS_SCORE_LBL:      { ru:'Рейтинг за цикл', en:'Rating this cycle' },
  CS_HILITE_LBL:     { ru:'Персонажи цикла', en:'Cycle highlights' },
  CS_BEST_TAG:       { ru:'⭐ Звезда цикла', en:'⭐ Star of the cycle' },
  CS_WORST_TAG:      { ru:'💤 Тяжелее всего', en:'💤 The toughest' },
  CS_REP_LBL:        { ru:'Репутация за цикл', en:'Reputation this cycle' },
  CS_ORDERS_WORD:    { ru:'заказов', en:'orders' },
  NAME_PLACEHOLDER:  { ru:'Впиши свой позывной...', en:'Enter your call sign...' },
  SAVE_SCORE_BTN:    { ru:'Сохранить результат', en:'Save result' },
  SAVE_SCORE_DONE:   { ru:'Сохранено ✓', en:'Saved ✓' },
  NEW_WEEK_BTN:      { ru:'Начать новый цикл →', en:'Start a new cycle →' },
  LB_TITLE:          { ru:'🏆 Глобальный рейтинг', en:'🏆 Global Leaderboard' },
  LB_CLOSE_BTN:      { ru:'Закрыть', en:'Close' },
  LB_EMPTY:          { ru:'Пока пусто — будь первым!', en:"It's empty — be the first!" },
  ANONYMOUS:         { ru:'Аноним', en:'Anonymous' },

  // ---------- Фаза 3: прогрессия ----------
  PROG_NPC_UNLOCK_TOAST:  { ru:'Новый посетитель на горизонте', en:'A new visitor on the horizon' },
  PROG_LEVEL_UP_TOAST:    { ru:'Лавка выросла — уровень', en:'The shop grew — level' },
  PROG_MECH_UNLOCK_TOAST: { ru:'Открыто', en:'Unlocked' },
  // ---------- Фаза 5: чаевые ----------
  TIPS_TITLE:             { ru:'Чаевые', en:'Tips' },
  GRADE_UP_TAG:           { ru:'Гость этого дня поднялся грейдом выше своего — сложнее и щедрее.', en:'This day\'s visitor stepped up a grade — harder and more generous.' },
  TIPS_EARNED_TOAST:      { ru:'Чаевые за цикл', en:'Tips for the cycle' },
  // ---------- Фаза 6: магазин / инвентарь ----------
  SHOP_BTN_TITLE:         { ru:'Магазин (только в 1-й день цикла)', en:'Shop (first day of the cycle only)' },
  INV_BTN_TITLE:          { ru:'Инвентарь', en:'Inventory' },
  SHOP_TITLE:             { ru:'Лавка припасов', en:'Supply Store' },
  INV_TITLE:              { ru:'Инвентарь', en:'Inventory' },
  SHOP_BALANCE:           { ru:'Чаевые:', en:'Tips:' },
  SHOP_BUY:               { ru:'Купить', en:'Buy' },
  SHOP_OWNED:             { ru:'в сумке:', en:'owned:' },
  SHOP_LOCKED_GRADE:      { ru:'откроется по прогрессии', en:'unlocks with progression' },
  SHOP_NEED_TIPS:         { ru:'Не хватает чаевых', en:'Not enough tips' },
  SHOP_CLOSE:             { ru:'Закрыть', en:'Close' },
  SHOP_ONLY_DAY1:         { ru:'Магазин открыт только в 1-й день цикла', en:'Shop is open only on the first day of the cycle' },
  INV_EMPTY:              { ru:'Сумка пуста. Загляни в магазин в 1-й день цикла.', en:'Your bag is empty. Visit the shop on day 1 of the cycle.' },
  INV_USE:                { ru:'Применить', en:'Use' },
  INV_USE_CRAFT_ONLY:     { ru:'во время варки', en:'during crafting' },
  INV_USE_SELECT_ONLY:    { ru:'перед заказом', en:'before an order' },
  INV_PICK_REG:           { ru:'На какой регулятор?', en:'Which regulator?' },
  INV_PICK_CANCEL:        { ru:'Отмена', en:'Cancel' },
  ITEM_BOUGHT_TOAST:      { ru:'Куплено', en:'Bought' },
  ITEM_USED_TOAST:        { ru:'Применено', en:'Used' },
  ITEM_NO_TARGET:         { ru:'Некому применить', en:'No valid target' },
  // ---------- Фаза 7: умения игрока ----------
  SKILLS_TITLE:           { ru:'Умения', en:'Skills' },
  SKILL_CHARGES_TITLE:    { ru:'Заряды умений', en:'Skill charges' },
  SKILL_NO_CHARGES:       { ru:'Нет зарядов умений', en:'No skill charges' },
  SKILL_PICK_WHO_TITLE:   { ru:'Кто там? Выбери гостя', en:"Who's there? Pick a guest" },
  SKILL_PICK_BAN_TITLE:   { ru:'Этих не пускайте (до 3)', en:'Keep them out (up to 3)' },
  SKILL_PICK_CONFIRM:     { ru:'Готово', en:'Confirm' },
  SKILL_PICK_CANCEL:      { ru:'Отмена', en:'Cancel' },
  SKILL_STUB_NOTE:        { ru:'Откроется с системой грейдов (Фаза 9)', en:'Unlocks with the grade system (Phase 9)' },
  SKILL_ONLY_SELECT:      { ru:'Умения — только на экране выбора заказа', en:'Skills work only on the order-select screen' },
  SKILL_GUARANTEED_TOAST: { ru:'Гость придёт в ближайших заданиях', en:'Guest will arrive soon' },
  SKILL_BANNED_TOAST:     { ru:'Не появятся до конца цикла', en:'Barred until the cycle ends' },
  SKILL_REFRESH_TOAST:    { ru:'Гости дня обновлены', en:'Day refreshed' },
  SKILL_GRADE_TOAST:      { ru:'Грейд поднят', en:'Grade bumped up' },
  SKILL_GRADE_NONE:       { ru:'Некому поднимать грейд', en:'No guest to bump up' },
  SKILL_CHARGE_GAINED:    { ru:'+1 заряд умения', en:'+1 skill charge' },

  // ---------- Фаза 12: кооператив ----------
  COOP_BTN:               { ru:'Кооп', en:'Co-op' },
  COOP_TITLE:             { ru:'Кооператив', en:'Co-op' },
  COOP_CHOICE_SUB:        { ru:'Играйте вдвоём в реальном времени.', en:'Play together in real time.' },
  COOP_CREATE:            { ru:'Создать комнату', en:'Create room' },
  COOP_JOIN:              { ru:'Присоединиться', en:'Join' },
  COOP_CLOSE:             { ru:'Назад', en:'Back' },
  COOP_JOIN_TITLE:        { ru:'Введите код комнаты', en:'Enter room code' },
  COOP_CODE_PH:           { ru:'КОД', en:'CODE' },
  COOP_JOIN_CONFIRM:      { ru:'Войти', en:'Join' },
  COOP_BACK:              { ru:'Назад', en:'Back' },
  COOP_LOBBY_TITLE:       { ru:'Комната', en:'Room' },
  COOP_CODE_HINT:         { ru:'Код комнаты (нажми, чтобы скопировать):', en:'Room code (tap to copy):' },
  COOP_START:             { ru:'Начать', en:'Start' },
  COOP_LEAVE:             { ru:'Выйти', en:'Leave' },
  COOP_WAIT_GUEST:        { ru:'Ждём второго игрока…', en:'Waiting for the second player…' },
  COOP_GUEST_JOINED:      { ru:'Игрок присоединился! Можно начинать.', en:'Player joined! You can start.' },
  COOP_WAIT_HOST:         { ru:'Ждём, пока хост начнёт…', en:'Waiting for the host to start…' },
  COOP_HOST_LEFT:         { ru:'Хост покинул комнату.', en:'The host left the room.' },
  COOP_COPIED:            { ru:'Код скопирован', en:'Code copied' },
  COOP_ROUND_SOON:        { ru:'Раунд появится на Стадии 3', en:'The round arrives in Stage 3' },
  COOP_SELECT_TITLE:      { ru:'Общий заказ', en:'Shared order' },
  COOP_DAY:               { ru:'День', en:'Day' },
  COOP_SELECT_PICK:       { ru:'Оба выбирают гостя…', en:'Both players pick a guest…' },
  COOP_SELECT_WAIT:       { ru:'Ждём выбор напарника…', en:'Waiting for your partner…' },
  COOP_SELECT_START:      { ru:'Заказ через {n}…', en:'Order in {n}…' },
  COOP_FOLLOWER_SCAN:     { ru:'Ведущий запоминает зелье…', en:'The leader is memorising the potion…' },
  COOP_FOLLOWER_CRAFT:    { ru:'Крутите ползунки — банка у ведущего', en:'Work the sliders — the jar is on the leader’s screen' },
  COOP_FOLLOWER_WAIT_RESULT: { ru:'Ждём результат от ведущего…', en:'Waiting for the leader’s result…' },
  COOP_PASS_TURN:         { ru:'Передать ход', en:'Pass turn' },
  COOP_SEQ_YOUR_TURN:     { ru:'Твой ход — выставь свою половину', en:'Your turn — set your half' },
  COOP_SEQ_WAIT:          { ru:'Ход напарника…', en:'Partner’s turn…' },
  COOP_END_TITLE:         { ru:'Смена окончена!', en:'Shift over!' },
  COOP_END_SCORE:         { ru:'Общий счёт', en:'Shared score' },
  COOP_END_LB:            { ru:'Кооп-рейтинг', en:'Co-op leaderboard' },
  COOP_END_HOME:          { ru:'На стартовый экран', en:'Back to start' },
  COOP_UNAVAILABLE:       { ru:'Кооп недоступен (нет сети)', en:'Co-op unavailable (no connection)' },
  COOP_ERR_EMPTY:         { ru:'Введите код', en:'Enter a code' },
  COOP_ERR_NOTFOUND:      { ru:'Комната не найдена', en:'Room not found' },
  COOP_ERR_BUSY:          { ru:'Игра уже идёт', en:'Game already in progress' },
  COOP_ERR_FULL:          { ru:'Комната заполнена', en:'Room is full' },
  COOP_ERR_GENERIC:       { ru:'Не удалось подключиться', en:'Could not connect' },
  // Стадия 6: разрыв связи с напарником
  COOP_PEER_LEFT:         { ru:'Напарник пропал… ждём 10 сек', en:'Partner dropped… waiting 10s' },
  COOP_PEER_BACK:         { ru:'Напарник вернулся', en:'Partner is back' },
  COOP_PEER_LEFT_KICK:    { ru:'Напарник не вернулся — на стартовый экран', en:'Partner didn’t return — back to start' },
  CATLADY_YARN_TOAST:     { ru:'Бабушка Мурра дарит клубок ниток!', en:'Grandma Murr gives you a ball of yarn!' },
  ENG_STOP_BTN:           { ru:'СТОП', en:'STOP' },
  // Фаза 4: авторизация
  AUTH_LOGIN:             { ru:'Логин', en:'Log in' },
  AUTH_REGISTER:          { ru:'Регистрация', en:'Sign up' },
  AUTH_LOGOUT:            { ru:'Выйти', en:'Log out' },
  AUTH_TAB_LOGIN:         { ru:'Вход', en:'Sign in' },
  AUTH_TAB_REGISTER:      { ru:'Регистрация', en:'Sign up' },
  AUTH_LOGIN_PH:          { ru:'Логин', en:'Login' },
  AUTH_PW_PH:             { ru:'Пароль', en:'Password' },
  AUTH_NICK_PH:           { ru:'Ник (виден в лидерборде)', en:'Nickname (shown on leaderboard)' },
  AUTH_REMEMBER:          { ru:'Запомнить это устройство', en:'Remember this device' },
  AUTH_SUBMIT_LOGIN:      { ru:'Войти', en:'Sign in' },
  AUTH_SUBMIT_REGISTER:   { ru:'Создать аккаунт', en:'Create account' },
  AUTH_PLAY_GUEST:        { ru:'Играть гостем', en:'Play as guest' },
  AUTH_CLOSE:             { ru:'Закрыть', en:'Close' },
  AUTH_CHANGE_NICK:       { ru:'Сменить ник', en:'Change nickname' },
  AUTH_NICK_PROMPT:       { ru:'Твой ник (до 20 символов):', en:'Your nickname (up to 20 chars):' },
  AUTH_SOON:              { ru:'Онлайн-профили скоро! Пока играй гостем — прогресс сохраняется на этом устройстве.', en:'Online profiles coming soon! Play as guest for now — progress is saved on this device.' },
  AUTH_NEED_FIELDS:       { ru:'Впиши логин и пароль.', en:'Enter a login and password.' },
  AUTH_GUEST_LABEL:       { ru:'Гость', en:'Guest' },
  SAVE_SCORE_NOT_RECORD:  { ru:'Рекорд не побит', en:'No new record' },
  SHOP_UNIQUE_TAG:        { ru:'уникальный', en:'unique' },
  SHOP_UNIQUE_LOCKED:     { ru:'откроется на высокой прогрессии', en:'unlocks at high progression' },
  ITEM_TIME_TOAST:        { ru:'Секундомер заведён — время добавится', en:'Stopwatch wound — time will be added' },
  ITEM_GRADE_LABEL:       { ru:'Грейд', en:'Grade' },
  PROG_BAR_LEVEL:         { ru:'Лавка ур.', en:'Shop lv.' },
  PROG_BAR_MAX:           { ru:'Лавка развита полностью', en:'Shop fully grown' },
  PROG_MARK_LOCKED_NPC:   { ru:'Скоро: новый посетитель', en:'Soon: a new visitor' },
  PROG_MARK_UNLOCKED_NPC: { ru:'Открыт посетитель', en:'Visitor unlocked' },
  PROG_FINAL_HINT_PREFIX: { ru:'Завершив шкалу, откроешь:', en:'Complete the bar to unlock:' },
  PROG_GRANT_CYCLE_DAYS:  { ru:'цикл до {n} дней', en:'cycle up to {n} days' },
  PROG_GRANT_POOL_SIZE:   { ru:'{n} заказа в дне', en:'{n} orders per day' },
  // Человекочитаемые названия открываемых механик (для подсказки на финале шкалы)
  PROG_MECH_LABELS: {
    collection:    { ru:'Коллекция', en:'Collection' },
    characters:    { ru:'Вкладка персонажей', en:'Characters tab' },
    skill_1:       { ru:'Умение игрока', en:'Player skill' },
    skill_2:       { ru:'2-е умение', en:'2nd skill' },
    skill_3:       { ru:'3-е умение', en:'3rd skill' },
    skill_4:       { ru:'4-е умение', en:'4th skill' },
    modifiers:     { ru:'Модификаторы заказов', en:'Order modifiers' },
    modifiers_new3:{ ru:'Новые модификаторы', en:'New modifiers' },
    modifiers_multi:{ ru:'Несколько модификаторов', en:'Multiple modifiers' },
    tips:          { ru:'Чаевые', en:'Tips' },
    shop:          { ru:'Магазин', en:'Shop' },
    shop_grade_1:  { ru:'Предметы (1-й грейд)', en:'Items (grade 1)' },
    shop_grade_2:  { ru:'Предметы (2-й грейд)', en:'Items (grade 2)' },
    shop_grade_3:  { ru:'Предметы (3-й грейд)', en:'Items (grade 3)' },
    unique_items:  { ru:'Уникальные предметы', en:'Unique items' },
    relations:     { ru:'Взаимоотношения НПС', en:'NPC relations' },
    quests:        { ru:'Задания на цикл', en:'Cycle quests' },
    quests_pin:    { ru:'Закрепление 3 заданий', en:'Pin up to 3 quests' }
  },

  // ---------- Задания на цикл (выдаются перед каждым новым циклом с ур.2) ----------
  // ART-SWAP: положить свою картинку в assets/ui/quest.png (иначе — эмодзи-заглушка).
  QUEST_BADGE_WANT:    { ru:'Задание: выбери этого посетителя', en:'Quest: pick this visitor' },
  QUEST_BADGE_AVOID:   { ru:'Задание: НЕ выбирай — этого надо пропустить', en:'Quest: do NOT pick — skip this one' },
  QUEST_DOCK_BTN:      { ru:'📜 Задание', en:'📜 Quest' },
  QUEST_OVERLAY_TITLE: { ru:'Заказ-наряд от Гильдии', en:'A Guild work-order' },
  QUEST_FLAVOR:        { ru:'Перед новым циклом почтовый дрон приносит запечатанный наряд. Выбери, за что взяться — печать действует до конца цикла.', en:'Before the new cycle a courier drone brings a sealed work-order. Pick what to take on — the seal holds until the cycle ends.' },
  QUEST_PICK_HINT:     { ru:'Выбери одно задание на этот цикл:', en:'Choose one quest for this cycle:' },
  QUEST_PICK_HINT_PIN: { ru:'Можешь закрепить до 3 заданий (выполняются параллельно):', en:'You may pin up to 3 quests (done in parallel):' },
  QUEST_TAKE_BTN:      { ru:'Взяться', en:'Take it' },
  QUEST_PIN_BTN:       { ru:'Закрепить', en:'Pin it' },
  QUEST_SKIP_ALL_BTN:  { ru:'Отказаться от всех', en:'Decline all' },
  QUEST_START_BTN:     { ru:'Начать цикл', en:'Start the cycle' },
  QUEST_CURRENT_TITLE: { ru:'Твоё задание', en:'Your quest' },
  QUEST_NONE_ACTIVE:   { ru:'На этот цикл задание не взято.', en:'No quest taken this cycle.' },
  QUEST_REWARD_LABEL:  { ru:'Награда:', en:'Reward:' },
  QUEST_PROGRESS_LABEL:{ ru:'Прогресс:', en:'Progress:' },
  QUEST_STATUS_DONE:   { ru:'✅ Выполнено', en:'✅ Done' },
  QUEST_STATUS_FAILED: { ru:'✖ Провалено (до нового цикла)', en:'✖ Failed (until next cycle)' },
  QUEST_STATUS_ACTIVE: { ru:'В работе', en:'In progress' },
  QUEST_DONE_TOAST:    { ru:'Задание выполнено!', en:'Quest complete!' },
  QUEST_FAILED_TOAST:  { ru:'Задание провалено', en:'Quest failed' },
  QUEST_CLOSE_BTN:     { ru:'Закрыть', en:'Close' },
  // награды (по одной на задание)
  QUEST_RW_TIPS:       { ru:'+{n} чаевых', en:'+{n} tips' },
  QUEST_RW_XP:         { ru:'+{n} к прогрессии лавки', en:'+{n} shop progression' },
  QUEST_RW_REP:        { ru:'+{n} репутации задействованным персонажам', en:'+{n} reputation to the involved characters' },
  // тексты типов заданий ({n} — цель, {names} — список персонажей)
  QUEST_T_PLAY_NAME:   { ru:'Обслужить постоянных', en:'Serve the regulars' },
  QUEST_T_PLAY_DESC:   { ru:'За этот цикл прими и вывари (не на брак) заказы: {names}. Они точно заглянут — в разные дни.', en:'This cycle, take and brew (no reject) the orders of: {names}. They will surely drop by — on different days.' },
  QUEST_T_SKIP_NAME:   { ru:'Нежеланные гости', en:'Unwanted guests' },
  QUEST_T_SKIP_DESC:   { ru:'За этот цикл НИ РАЗУ не бери заказы у: {names}. Они будут заходить в разные дни — обслужи в эти дни кого-то другого.', en:'This cycle, do NOT take orders from: {names}. They will visit on different days — serve someone else those days.' },
  QUEST_T_PERFECT_NAME:{ ru:'Рука мастера', en:'A master’s hand' },
  QUEST_T_PERFECT_DESC:{ ru:'Свари {n} идеальных зелий за цикл.', en:'Brew {n} perfect potions this cycle.' },
  QUEST_T_RATING_NAME: { ru:'Хорошая выручка', en:'A good haul' },
  QUEST_T_RATING_DESC: { ru:'Набери суммарный рейтинг {n} за цикл.', en:'Reach a total rating of {n} this cycle.' },
  QUEST_T_NOBAD_NAME:  { ru:'Ни единого брака', en:'Not a single reject' },
  QUEST_T_NOBAD_DESC:  { ru:'Пройди весь цикл, не запоров ни одного заказа в брак.', en:'Get through the whole cycle without botching a single order into a reject.' },

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
  ALBUM_LABEL_SWILL:      { ru:'Пойло', en:'Swill' },
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
  CHAR_EMPTY_HINT:      { ru:'ты ещё никого не встретил. Персонажи появятся здесь после первого визита в лавку.', en:'you haven’t met anyone yet. Characters appear here after their first visit to the shop.' },
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

  // ---------- Патч "Уникальные механики тир-5" ----------
  // Сверхновая: два измерения банки
  LABEL_WIDTH:   { ru:'Ширина', en:'Width' },
  LABEL_HEIGHT:  { ru:'Высота', en:'Height' },
  // УР.4 (Сверхновая): 2 эксклюзивных регулятора
  LABEL_ROTATION: { ru:'Поворот', en:'Rotation' },
  // Тот-Кто-Ждёт: без таймера — игрок сам жмёт кнопку, когда готов
  WAITER_READY_BTN: { ru:'Готово, воссоздаю', en:'Ready, recreating' },
  SWARM_RETURN_TEXT: { ru:'ВЕРНИ ИХ.', en:'RETURN THEM.' },
  // УР.4 (Тентаклоид): постоянная надпись внизу экрана на фазе игры
  TENTACLOID_UNDECIDED_BANNER: { ru:'Я пока не определился, что именно меня интересует — банка, пузырьки, сам напиток. Но ты не отвлекайся. Делай.',
    en:"I still haven't decided what interests me — the jar, the bubbles, or the drink itself. But don't get distracted. Make it." },
  LABEL_SPEED: { ru:'Скорость', en:'Speed' },
  LABEL_COUNT_A: { ru:'Сгустки А', en:'Blobs A' },
  LABEL_COUNT_B: { ru:'Сгустки Б', en:'Blobs B' },
  FASHION_CONFIRM_BTN: { ru:'Дальше', en:'Next' },
  TASTE_BTN: { ru:'Дегустировать', en:'Taste' },
  TASTE_SERVE_BTN: { ru:'Подать', en:'Serve' },
  TASTE_HALF_TAG: { ru:'½ рейтинга — гурман не впечатлён', en:'½ rating — the gourmet is unimpressed' },
  TASTE_RETRY_NOTE: { ru:'Это никуда не годится. Доделывай — я подожду.', en:"This won't do at all. Fix it - I'll wait." },
  INSPECTOR_TOL_BTN: { ru:'Допуски', en:'Tolerances' },
  INSPECTOR_INTERROGATE_BTN: { ru:'Протокол допроса', en:'Interrogation record' },
  LOGIC9_SHOOT_HINT: { ru:'Веди самолётик — сбей все сгустки!', en:'Steer the plane — shoot every blob!' },
  TRUCKER_NEXT_TITLE: { ru:'Переключить регулятор', en:'Switch regulator' },
  INSPECTOR_TOL_CLOSE: { ru:'Ознакомлен', en:'Acknowledged' },
  // УР.4 (Стажёр Бип): надпись-реплика (не кнопка) + кнопка "Готово" (её
  // роль берёт на себя главная brew-btn, см. TASTE_BTN — тот же приём) +
  // окно угадывания % трёх предыдущих визитов
  BEEP_GUESS_BTN: { ru:'Мне всё равно. А что там у предыдущих трёх было? Хотя бы ОДНИМ глазком бы глянуть',
    en:"I don't care. What did the previous three get, though? Just a peek with ONE eye" },
  BEEP_MAIN_BTN: { ru:'Что там у других?', en:'What did the others get?' },
  BEEP_GUESS_TITLE: { ru:'Кто заходил до тебя?', en:'Who came before you?' },
  BEEP_GUESS_CLOSE: { ru:'Готово', en:'Done' },
  VEX_MEMORIZE_LINE: { ru:'Запомни, где именно они лежат. Я хочу увидеть их ТОЧНО на этих местах.', en:'Remember exactly where they lie. I want to see them in EXACTLY those spots.' },
  LABEL_VEX_POSITION: { ru:'Положение сгустков', en:'Blob positions' },
  // Ир: меню доверия
  IR_TRUST_TITLE:   { ru:'Последний из Ир смотрит на тебя', en:'The Last of the Ir looks at you' },
  IR_TRUST_KEEP:    { ru:'Всё же играть УР.{n}', en:'Play LV.{n} anyway' },
  IR_TRUST_ACCEPT:  { ru:'Довериться — УР.3', en:'Trust him — LV.3' },
  IR_FX_BUFF_TAG:   { ru:'дар Ир', en:'gift of the Ir' },
  IR_FX_DEBUFF_TAG: { ru:'тень Ир', en:'shadow of the Ir' },
  IR_REPLAY_BTN:    { ru:'Переиграть (дар Ир)', en:'Replay (gift of the Ir)' },
  IR_FORCE_REPLAY_BTN: { ru:'Ир требует переиграть →', en:'The Ir demands a replay →' },
  // Хранитель: печати
  ARCH_SEAL_TAG:    { ru:'печать Хранителя', en:"Keeper's seal" },
  ARCH_SEAL_BANNER: { ru:'📜 Печать Хранителя: осталось троек — {n}', en:'📜 Keeper\'s seal: triples remaining — {n}' },
  ARCH_HINT_MARK:   { ru:'указание Хранителя', en:"the Keeper's directive" },
  ALBUM_SPECIAL_HINT: { ru:'особый стикер — выпадает за особое событие', en:'special sticker — drops for a special event' },
  // ---------- Взаимоотношения между НПС ----------
  REL_SECTION_TITLE: { ru:'Связи', en:'Connections' },
  REL_KIND_FRIEND:   { ru:'Друг', en:'Friend' },
  REL_KIND_ENEMY:    { ru:'Враг', en:'Enemy' },
  REL_KIND_BUDDY:    { ru:'Собутыльник', en:'Drinking buddy' },
  REL_KIND_DISLIKE:  { ru:'Неприязнь', en:'Dislike' },
  REL_OFFENDED_TOAST: { ru:'Обиделся — не рассчитывай на честные стикеры', en:'Got offended — don’t expect honest stickers' },
  REL_LEFT_TOAST:    { ru:'Обиделся и не появится до конца цикла', en:'Got offended — won’t show up for the rest of the cycle' },
  REL_DISCOVERED_TOAST: { ru:'Новая связь между персонажами', en:'New connection between characters' },
  // УР.4 (Гонщица Кай): надпись на последней засечке кольца-таймера
  L4_KAI_GO: { ru:'GO!', en:'GO!' },
};

// ---------- СТИКЕРЫ РЕЗУЛЬТАТА ----------
// Чтобы заменить на картинку: sticker может быть путём к файлу,
// например perfect: 'assets/ui/sticker_perfect.png' — game.js поймёт сам.
const STICKERS = {
  perfect: [
    'assets/ui/perfect1.png',
    'assets/ui/perfect2.png',
    'assets/ui/perfect3.png',
    // ---------- особые стикеры (выпадают ТОЛЬКО по условию, см. STICKER_SPECIALS) ----------
    'assets/ui/perfect4.png',   // 3: 5 идеалов подряд
    'assets/ui/perfect5.png',   // 4: 10 идеалов подряд
    'assets/ui/perfect6.png',   // 5: все параметры ровно 100%
    'assets/ui/perfect7.png',   // 6: идеал на градиенте (Двуликая жрица)
    'assets/ui/perfect8.png',   // 7: идеал у Того-Кто-Ждёт без единой купленной секунды
    'assets/ui/perfect9.png',   // 8: идеал в первую ШЕСТУЮ часть таймера
    'assets/ui/perfect10.png',   // 9: идеал под дебаффом Ир
    'assets/ui/perfect11.png',   // 10: идеал под печатью Хранителя
    'assets/ui/perfect12.png',   // 11: идеал на 4-ой сложности
    'assets/ui/perfect13.png',   // 12: идеал при рейтинге цикла 3500+
    'assets/ui/perfect14.png',   // 13: идеал у Сверхновой с точной шириной И высотой
    'assets/ui/perfect15.png',   // 14: идеал в 10-й (последний) день цикла
  ],
  good: [
    'assets/ui/good1.png',
    'assets/ui/good2.png',
    'assets/ui/good3.png',
    // ---------- особые ----------
    'assets/ui/good4.png',   // 3: до идеала не хватило меньше 2%
    'assets/ui/good5.png',   // 4: 8+ смесей подряд без брака
    'assets/ui/good6.png',   // 5: годнота в последние 10% таймера
    'assets/ui/good7.png',   // 6: годнота, прервавшая серию из 2+ браков
    'assets/ui/good8.png',   // 7: Фаза 5 — накоплено 1000+ чаевых за всю историю
    'assets/ui/good9.png',   // 8: Фаза 5 — накоплено 10000+ чаевых за всю историю
  ],
  // Фаза 2 (П7): «Пойло» — грейд между браком и годнотой (малый ±рейтинг).
  // Базовые варианты — эмодзи-заглушки; заменить на картинки можно так же,
  // как perfect/good/bad (положить 'assets/ui/swill1.png' и т.п.).
  swill: [
    'assets/ui/swill1.png',   // 0: пойло (базовый)
    'assets/ui/swill2.png',   // 1: пойло (базовый)
    'assets/ui/swill3.png',   // 2: пойло (базовый)
    // ---------- особые ----------
    'assets/ui/swill4.png',   // 3: пойло почти дотянуло до годноты (см. STICKER_SPECIALS.swill)
    'assets/ui/swill5.png',   // 4: пойло, прервавшее серию из 2+ браков
  ],
  bad: [
    'assets/ui/bad1.png',
    'assets/ui/bad2.png',
    'assets/ui/bad3.png',
    // ---------- особые ----------
    'assets/ui/bad4.png',   // 3: точность ниже 30%
    'assets/ui/bad5.png',   // 4: брак на 1-ой сложности (один-единственный ползунок!)
    'assets/ui/bad6.png',   // 5: третий брак подряд
    'assets/ui/bad7.png',   // 6: таймер истёк сам — кнопку так и не нажали
    'assets/ui/bad8.png',   // 7: брак под печатью Хранителя (исторический провал)
    'assets/ui/bad9.png',   // 8: обиженный связями НПС форсирует этот стикер (см. NPC_RELATIONS в game.js)
  ]
};

// ---------- Патч: условия выпадения особых стикеров ----------
// idx — индекс варианта в STICKERS[cat] выше. check(ctx) — чистая функция;
// ctx собирается в finalizeResult (game.js) и содержит:
//   perfect, good, overall (0..1), components, target, timeFrac,
//   autoFinish (таймер истёк сам), scoreAfter (рейтинг цикла после начисления),
//   dayNum, perfectRun (длина серии идеалов С УЧЁТОМ этого),
//   goodRun (серия без брака), badRunBefore (браков подряд ДО этого заказа)
// hint — подсказка для закрытой ячейки альбома (title).
// Особые стикеры НИКОГДА не выпадают случайно — только по условию.
// Если условий сработало несколько, приоритет у ещё не выбитых.
const STICKER_SPECIALS = {
  perfect: [
    { idx:3,  check:c => c.perfectRun >= 5 && c.perfectRun < 10,
      hint:{ ru:'серия идеалов', en:'a perfect streak' } },
    { idx:4,  check:c => c.perfectRun >= 10,
      hint:{ ru:'длинная серия идеалов', en:'a long perfect streak' } },
    { idx:5,  check:c => c.components.every(k=>k.score >= 0.999),
      hint:{ ru:'абсолютная точность', en:'absolute precision' } },
    { idx:6,  check:c => c.target.flags && c.target.flags.hasGradient,
      hint:{ ru:'двойной закат', en:'a double sunset' } },
    { idx:7,  check:c => c.target.cfg.special === 'no_timer' && c.overall >= 0.99,
      hint:{ ru:'заслужил рейтинг у Того, Кто Ждёт', en:'earned rating from the One Who Waits' } },
    { idx:8,  check:c => c.timeFrac <= 1/6,
      hint:{ ru:'быстрее молнии', en:'faster than lightning' } },
    { idx:9,  check:c => c.target.irEffect && c.target.irEffect.kind === 'debuff',
      hint:{ ru:'идеал сквозь тень', en:'perfection through the shadow' } },
    { idx:10, check:c => !!c.target.sealed,
      hint:{ ru:'исторический момент', en:'a historic moment' } },
    { idx:11, check:c => c.target.regLevel === 4,
      hint:{ ru:'на пределе сложности', en:'at the difficulty limit' } },
    { idx:12, check:c => c.scoreAfter >= 3500,
      hint:{ ru:'рекордный цикл', en:'a record cycle' } },
    { idx:13, check:c => c.target.cfg.special === 'dual_size' && c.novaExact,
      hint:{ ru:'точные пропорции звезды', en:"a star's exact proportions" } },
    { idx:14, check:c => c.dayNum >= 10,
      hint:{ ru:'финальный аккорд цикла', en:"the cycle's final chord" } }
  ],
  good: [
    { idx:3, check:c => !c.perfect && c.overall >= (c.perfectThreshold - 0.02),
      hint:{ ru:'мучительно близко', en:'agonizingly close' } },
    { idx:4, check:c => c.goodRun >= 8,
      hint:{ ru:'конвейер без брака', en:'a rejectless assembly line' } },
    { idx:5, check:c => c.timeFrac >= 0.9,
      hint:{ ru:'на последних секундах', en:'in the final seconds' } },
    { idx:6, check:c => c.badRunBefore >= 2,
      hint:{ ru:'выход из чёрной полосы', en:'out of the rough patch' } },
    // Фаза 5: стикеры на чаевые (порог по суммарным чаевым)
    { idx:7, check:c => (c.tipsLifetime||0) >= 1000,
      hint:{ ru:'звенящая касса', en:'a ringing till' } },
    { idx:8, check:c => (c.tipsLifetime||0) >= 10000,
      hint:{ ru:'богатство лавки', en:'shop riches' } }
  ],
  bad: [
    { idx:3, check:c => c.overall < 0.3,
      hint:{ ru:'совсем мимо', en:'a total miss' } },
    { idx:4, check:c => c.target.regLevel === 1,
      hint:{ ru:'провал на самом простом', en:'failing the simplest thing' } },
    { idx:5, check:c => c.badRunBefore >= 2,
      hint:{ ru:'полоса не кончается', en:'the patch goes on' } },
    { idx:6, check:c => !!c.autoFinish,
      hint:{ ru:'время вышло само', en:'time simply ran out' } },
    { idx:7, check:c => !!c.target.sealed,
      hint:{ ru:'провал, вписанный в историю', en:'a failure written into history' } }
  ],
  // Фаза 2 (П7): особые стикеры «Пойла» (ctx получает goodThreshold — см. game.js)
  swill: [
    { idx:3, check:c => c.overall >= (c.goodThreshold - 0.03),
      hint:{ ru:'почти годнота', en:'almost decent' } },
    { idx:4, check:c => c.badRunBefore >= 2,
      hint:{ ru:'хоть не брак', en:'at least not a reject' } }
  ]
};

/* ============================================================
   ПАТЧ "УНИКАЛЬНЫЕ МЕХАНИКИ ТИР-5": контент.
   Логика — в game.js, здесь только тексты и настройки.
   ============================================================ */

// ---------- Последний из Ир: меню доверия (УР.1/2) ----------
const IR_TRUST_PHRASES = { ru:[
  'Ты просишь меня доверить тебе память миллиона поколений... и при этом не доверяешь себе сам?',
  'Половина регуляторов? Мой народ не делился на половины. Даже угасая.',
  'Осторожность — это хорошо. Но памяти Ир нужны смелые руки, а не осторожные.',
  'Я не готов довериться тому, кто не доверяет мне. Полная работа — или никакой.'
], en:[
  'You ask me to entrust you with the memory of a million generations... while not trusting yourself?',
  'Half the regulators? My people never split into halves. Even while fading.',
  'Caution is fine. But the memory of the Ir needs bold hands, not careful ones.',
  'I cannot trust one who does not trust me. The full work — or none.'
]};

// фразы Ира на ГОДНОТУ при УР.3+ ("как будто не очень старались")
const IR_GOOD_PHRASES = { ru:[
  'Годно. Но ты будто держал в руках чужую память, а не нашу.',
  'Сойдёт... для омывателя. Не для последнего рассвета.',
  'Я видел, как ты можешь. Это — не оно. Вселенная заметила разницу.',
  'Хм. Ты не очень-то старался помочь мне, торговец. Ир прощают. Ир помнят.'
], en:[
  'Decent. But you handled it like someone else\'s memory, not ours.',
  'It will do... for washer fluid. Not for a final dawn.',
  'I have seen what you can do. This is not it. The universe noticed the difference.',
  'Hm. You did not try very hard to help me, merchant. The Ir forgive. The Ir remember.'
]};

// фразы при выдаче баффа (идеал) / дебаффа (брак) на УР.3+
const IR_GRANT_PHRASES = {
  buff: { ru:[
    'Ты сохранил наш рассвет. В следующем деле рука Ир будет рядом с твоей.',
    'Безупречно. Прими дар угасающих — он проявится в следующем заказе.'
  ], en:[
    'You preserved our dawn. In your next task, the hand of the Ir will be beside yours.',
    'Flawless. Accept the gift of the fading — it will show itself in your next order.'
  ]},
  debuff: { ru:[
    'Ты уронил память миллиона поколений. Её тень ляжет на твоё следующее дело.',
    'Наш мир умер дважды. Следующий заказ ты сделаешь под его тенью.'
  ], en:[
    'You dropped the memory of a million generations. Its shadow will fall on your next task.',
    'Our world died twice. You will make your next order under its shadow.'
  ]}
};

// сами эффекты Ир: при СЛЕДУЮЩЕМ заказе случайно выбирается один из трёх
// (нужного знака). id используются в game.js — не переименовывать.
const IR_EFFECTS = {
  buff: [
    { id:'gift',      icon:'🌅', name:{ ru:'Рука Ир', en:'Hand of the Ir' },
      desc:{ ru:'Ир сам выставил ДВА регулятора точно в цель', en:'The Ir set TWO regulators exactly on target' } },
    { id:'time_plus', icon:'⏱',  name:{ ru:'Подаренные секунды', en:'Gifted seconds' },
      desc:{ ru:'+4 секунды к таймеру', en:'+4 seconds on the timer' } },
    { id:'replay',    icon:'🔄', name:{ ru:'Второй рассвет', en:'A second dawn' },
      desc:{ ru:'Переигрывай сколько угодно раз, пока не выйдет идеал или пока сам не согласишься на результат', en:'Replay as many times as you like until it is perfect, or until you accept the result yourself' } }
  ],
  debuff: [
    { id:'mono',        icon:'🌫', name:{ ru:'Выцветший мир', en:'A faded world' },
      desc:{ ru:'Смесь стала чёрно-белой, а края банки сильно размыты', en:'The mixture turned black-and-white, and the jar\'s edges are badly blurred' } },
    { id:'time_minus',  icon:'⏳', name:{ ru:'Украденные секунды', en:'Stolen seconds' },
      desc:{ ru:'−2 секунды таймера', en:'−2 seconds on the timer' } },
    { id:'force_replay',icon:'♻️', name:{ ru:'Дважды безупречно', en:'Twice flawless' },
      desc:{ ru:'Идеал придётся доказать ещё раз — и эта попытка обязательно получит ещё один дебафф', en:'A perfect result must be proven again - and that attempt will also carry another debuff' } }
  ]
};

// ---------- Тот-Кто-Ждёт: дар за строгие 100% — таймер следующего заказа
// (у любого НПС) идёт в 2 раза медленнее ----------
const WAITER_SLOW_BUFF = {
  icon:'⏳',
  name:{ ru:'Дар Ожидания', en:'Gift of Waiting' },
  desc:{ ru:'Следующий заказ (у любого НПС): таймер идёт вдвое медленнее', en:'Next order (any NPC): the timer runs twice as slow' }
};

// ---------- Тот-Кто-Ждёт: без таймера, рейтинг только за точность >99% ----------
// В остальных случаях (даже если смесь "годная" или "идеальная" по обычным
// порогам) очки за заказ не начисляются — игрок получает только стикер и
// одну из этих ироничных реплик (см. finalizeResult в game.js).
// WAITER_NOTE_CLOSE — смесь была "годной" или "идеальной", но не дотянула до 99%.
const WAITER_NOTE_CLOSE = { ru:[
  'Почти то, что я видел. «Почти» я уже видел слишком много раз.',
  'Неплохо. Но я жду не «неплохо» — я жду точно то самое.',
  'Ты приблизился. Ожидание умеет ждать и дальше.',
  'Сойдётся — но не с тем будущим, которое мне нужно. Пока не с тем.'
], en:[
  "Close to what I've seen. I have seen 'close' too many times already.",
  "Not bad. But I'm not waiting for 'not bad' — I'm waiting for exactly that.",
  'You came near. Waiting knows how to keep waiting.',
  "It matches — but not the future I need. Not yet."
]};
// WAITER_NOTE_FAR — смесь была браком.
const WAITER_NOTE_FAR = { ru:[
  'Это не тот вариант будущего. Даже не близко.',
  'Я подожду ещё. У меня, в отличие от тебя, есть время.',
  'Забавно. Ты только что доказал, зачем я жду именно смесь, а не тебя.',
  'Список исходов, где это сработало, не включает этот.'
], en:[
  "That is not the future I'm waiting for. Not even close.",
  "I'll wait a little longer. Unlike you, I have the time.",
  'Funny. You just proved why I wait for the mixture, not for you.',
  'The list of outcomes where this worked does not include this one.'
]};

// ---------- Модница: УР.4 — цикл из 4 цветов, реплика на каждый ----------
// "…" — сомневается (это decoy); "!" — уверена (это и есть цель)
const FASHIONISTA_UNSURE_PHRASES = { ru:[
  'Хм... кажется, этот оттенок?..',
  'Может быть, вот этот... не уверена...',
  'Что-то в нём не то... или то?..',
  'Пожалуй... хотя нет, не знаю...'
], en:[
  'Hmm... maybe this shade?..',
  'Perhaps this one... not sure...',
  'Something about it feels off... or does it?..',
  "Maybe... though, no, I don't know..."
]};
// ---------- Модница: УР.4 — один ползунок за раз, остальные заблокированы ----------
const FASHIONISTA_BOSSY_PHRASES = { ru:[
  'Давай сейчас лучше этим займёмся.',
  'Это мне нравится — хочу, чтобы ты слушал меня!',
  'Остальное подождёт. Сейчас — только это.',
  'Ты и правда думал, что можно всё сразу? Мило.',
  'Вот этим займись. Остальное я подержу при себе.',
  'Слушай меня внимательно — я знаю, чего хочу.',
  'Именно это сейчас важно. Остальное — потом.',
  'Не отвлекайся. Только этот. Только сейчас.'
], en:[
  "Let's focus on this one right now.",
  "I like this — I want you to listen to me!",
  "The rest can wait. Just this, for now.",
  "Did you really think you could do it all at once? Cute.",
  "Work on this one. I'll hold onto the rest myself.",
  "Listen closely — I know exactly what I want.",
  "This is what matters right now. The rest, later.",
  "Stay focused. Just this one. Just now."
]};
const FASHIONISTA_SURE_PHRASES = { ru:[
  'Да! Точно этот!',
  'Вот он! Именно этот оттенок!',
  'Наконец! Мой цвет!',
  'Это он, без сомнений!'
], en:[
  'Yes! This one, exactly!',
  'There it is! That exact shade!',
  'Finally! My color!',
  'This is it, no doubt!'
]};

// ---------- Шеф туманности: реплика на "годноту" (для него это провал вкуса) ----------
const NEBULA_CHEF_MEH_PHRASES = { ru:[
  'Съедобно. Не более. Я не подаю "не более".',
  'Технически — смесь. Душа блюда отсутствует.',
  'Ни один гарниш не спасёт эту невыразительность.',
  'Я подам это. Молча. И это — приговор.'
], en:[
  'Edible. Nothing more. I do not serve "nothing more."',
  "Technically, a mixture. The dish's soul is absent.",
  'No garnish could save this blandness.',
  "I'll serve it. Silently. That silence is the verdict."
]};

// ---------- Тентаклоид: реплика на результатах — раскрывает, какой ОДИН
// параметр его на самом деле волновал (см. LEVEL4_FX.tentacloid в game.js).
// {PARAM} — подставляется ярлык этого параметра ("Спектр", "Сгустки" и т.п.)
const TENTACLOID_REVEAL_PHRASES = { ru:[
  'Тентаклоид приоткрывает один зрачок из тысячи: «Меня занимал только {PARAM}. Остальное было просто шумом вселенной».',
  'Щупальце едва заметно вздрагивает: «{PARAM} — вот всё, на что я смотрел. Прочее прошло мимо, не задев меня».',
  '«{PARAM}», — доносится глухо из-под мантии. — «Только это имело значение. Ты не знал. Я и не был обязан говорить».'
], en:[
  'Tentacloid opens one eye out of a thousand: "Only {PARAM} held my interest. Everything else was just the noise of the universe."',
  'A tentacle twitches, barely: "{PARAM} — that is all I watched. The rest passed by without touching me."',
  '"{PARAM}," comes a muffled voice from beneath the mantle. "That alone mattered. You did not know. I was never obliged to say."'
]};

// ---------- Инспектор Гильдии: варианты канцелярского текста "Допусков" (УР.4) ----------
// Патч: фазы показа "запрещённого образца" больше нет — текст переписан со
// списка "Параметр: значение" на сплошной канцелярский абзац. {SENTENCES} —
// сплошной кусок текста с показателями (числа вшиты прямо в предложения,
// порядок каждый раз перемешан — собирается в game.js). {TOL} — число
// допуска, тоже подано внутри предложения, а не отдельной строкой, чтобы
// нужные цифры нельзя было выхватить взглядом, не читая.
const INSPECTOR_TOLERANCE_TEMPLATES = [
  { ru:
`Комиссия по приёмке рассмотрела образец и приобщила его к делу. {SENTENCES} Решением комиссии: любое отклонение от перечисленного, не превышающее {TOL} деления в ту или иную сторону по каждому пункту в отдельности, признаётся допустимым и не влияет на итоговую оценку приёмки.`,
    en:
`The acceptance commission has reviewed the sample and attached it to the case file. {SENTENCES} By the commission's ruling, any deviation from the above not exceeding {TOL} notches in either direction on each point taken separately is deemed acceptable and does not affect the final acceptance score.` },

  { ru:
`Форма 7-Б заполнена и заверена печатью Гильдии. {SENTENCES} Границы приёмки едины для всех перечисленных пунктов и составляют {TOL} деления в любую сторону от указанного — превышение по отдельному пункту фиксируется как нарушение, но не отменяет заявку целиком.`,
    en:
`Form 7-B has been filled out and sealed by the Guild. {SENTENCES} The acceptance margin is uniform across all points listed and equals {TOL} notches in either direction from the stated value — exceeding it on a single point is logged as a violation but does not void the request outright.` },

  { ru:
`Плановая проверка, протокол №{TOL}7-К. {SENTENCES} Допуск по каждому из перечисленных показателей составляет {TOL} деления; всё, что уложилось в эти границы, комиссия принимает без возражений.`,
    en:
`A scheduled inspection, protocol No. {TOL}7-K. {SENTENCES} The tolerance on each of the listed indicators is {TOL} notches; anything that falls within these bounds is accepted by the commission without objection.` },

  { ru:
`Заявка на приёмку смеси принята к рассмотрению. {SENTENCES} Податель обязан удержать каждый из перечисленных показателей в границах ± {TOL} деления от указанного — прочие детали заявки на решение комиссии не влияют.`,
    en:
`The mixture acceptance request has been accepted for review. {SENTENCES} The submitter must keep every listed indicator within ± {TOL} notches of the stated value — no other detail of the request affects the commission's decision.` }
];

// ---------- Дегустатор (Гурман с Веги): реакции на "дегустацию" УР.4 ----------
const GOURMET_PRAISE_PHRASES = { ru:[ // идеал с первой пробы — хвалит
  'Безупречно! Вот теперь это кухня.',
  'Я редко это говорю: браво.',
  'Вот вкус, ради которого стоило ждать.'
], en:[
  'Impeccable! Now THAT is cuisine.',
  "I rarely say this: bravo.",
  'A flavor worth the wait, at last.'
]};
const GOURMET_INDIGNANT_PHRASES = { ru:[ // какашка второй раз — негодует
  'Ты сделал только хуже. Немыслимо.',
  'Второй шанс — и снова провал? Я оскорблён.',
  'Это уже не ошибка. Это неуважение к кухне.'
], en:[
  'You made it worse. Unthinkable.',
  'A second chance - and another failure? I am offended.',
  'This is no longer a mistake. It is disrespect for the kitchen.'
]};
const GOURMET_UNIMPRESSED_PHRASES = { ru:[ // годнота второй раз — не впечатлён
  'Съедобно. Это всё, на что хватило второй попытки?',
  'Не провал. Но и не то, чего я ждал.',
  'Поправил — но не впечатлил.'
], en:[
  'Edible. Is that all the second try had in it?',
  'Not a failure. But not what I was hoping for, either.',
  'You fixed it — but you did not impress me.'
]};
const GOURMET_SATISFIED_PHRASES = { ru:[ // идеал второй раз — удовлетворён
  'Вот теперь так. Со второй попытки, но так.',
  'Ты всё-таки нашёл вкус. Я удовлетворён.',
  'Доказал, что умеешь. Этого достаточно.'
], en:[
  'Now THAT is right. Took a second try, but right.',
  'You found the flavor after all. I am satisfied.',
  "You've proven you can do it. That's enough."
]};

// ---------- Хранитель Архива: печати ----------
// фразы при получении баффа (идеал у Хранителя): "хочу увидеть исторический момент"
const ARCH_SEAL_PHRASES = { ru:[
  'Достойно новой страницы. Теперь я хочу увидеть исторический момент. Я отмечу, где искать.',
  'Архив требует продолжения. Мои печати лягут на грядущие заявки — сделай их историей.',
  'Так пишутся эпохи. Я поставлю печать там, где история может случиться. Не подведи чернила.',
  'Записано. Но летописи нужен размах. Следуй за моими печатями — и войдёшь в главу.'
], en:[
  'Worthy of a new page. Now I wish to witness a historic moment. I will mark where to look.',
  'The Archive demands a continuation. My seals will fall on coming orders — make them history.',
  'This is how eras are written. I will place a seal where history may happen. Do not fail the ink.',
  'Recorded. But a chronicle needs scale. Follow my seals — and enter the chapter.'
]};

// фраза-замена в заказе под печатью; {name} — имя выбранного НПС
const ARCH_SEAL_ORDER_PHRASES = { ru:[
  'Печать Архива. Этот визит — «{name}» — я записываю особыми чернилами. Работай так, будто это страница истории. Это она и есть.',
  'Хранитель смотрит через моё плечо. Он говорит: «{name}» заслуживает главы. Дай ему главу.',
  'На этой заявке — печать Хранителя. Всё, что ты сделаешь для «{name}», будет записано. Навсегда.'
], en:[
  'The Archive\'s seal. This visit — "{name}" — I record in special ink. Work as if this were a page of history. It is.',
  'The Keeper watches over my shoulder. He says "{name}" deserves a chapter. Give them a chapter.',
  'This order bears the Keeper\'s seal. Everything you do for "{name}" will be recorded. Forever.'
]};

// фразы при полном "историческом моменте" (3 идеала на 3 печатях)
const ARCH_HISTORIC_PHRASES = { ru:[
  'Свершилось. Три идеала под тремя печатями — Архив открывает новый том. В благодарность я раскрою тебе то, что обычно скрыто: как именно войти в историю этих троих.',
  'Исторический момент записан. Впервые за эпоху. Взгляни в досье отмеченных — я оставил там прямые указания.'
], en:[
  'It is done. Three perfects under three seals — the Archive opens a new volume. In gratitude I will reveal what is usually hidden: how exactly to enter the history of these three.',
  'The historic moment is recorded. First time in an era. Look into the dossiers of the marked — I left direct directives there.'
]};

// набор глифов для "матричного дождя" Хранителя
const MATRIX_GLYPHS = 'ΞΔΘΛΨΩλϟ⌬⍟⌖⌑◬◈☌☍⚶ϡϗѦѮҨ҂៙᚛ᚱᚷᛃᛝ';

// ---------- расшифровки условий ачивок для "указаний Хранителя" ----------
// Обычно игрок видит только художественный hint; но если Хранитель выдал
// прямое указание (keeperHints в профиле) — условие пишется открытым текстом.
// {t} заменяется на "бронза/серебро/золото" пороги вида a / b / c.
const NPC_ACH_KIND_EXPLAIN = {
  orders:          { ru:'Выполни заказы этого персонажа: {t}', en:'Complete this character\'s orders: {t}' },
  perfects:        { ru:'Сделай идеальные смеси для него: {t}', en:'Make perfect mixtures for them: {t}' },
  perfect_streak:  { ru:'Серия идеалов подряд с ним: {t}', en:'Perfect streak with them: {t}' },
  no_bad_streak:   { ru:'Серия без брака подряд с ним: {t}', en:'No-reject streak with them: {t}' },
  bads:            { ru:'Запори его заказы (да, серьёзно): {t}', en:'Botch their orders (yes, really): {t}' },
  picks_cycle:     { ru:'Выбери его за ОДИН цикл: {t} раз', en:'Pick them within ONE cycle: {t} times' },
  hard_perfects:   { ru:'Идеалы на сложности 3+: {t}', en:'Perfects at difficulty 3+: {t}' },
  fast_perfects:   { ru:'Идеалы в первую треть таймера: {t}', en:'Perfects within the first third of the timer: {t}' },
  level4_perfects: { ru:'Идеалы на 4-ой сложности: {t}', en:'Perfects at difficulty 4: {t}' },
  focus_perfects:  { ru:'Идеалы на его фокус-заказах: {t}', en:'Perfects on their focus orders: {t}' },
  weighted:        { ru:'Набери взвешенный прогресс его идеалами: {t}', en:'Earn weighted progress with their perfects: {t}' }
};
// для новых "статовых" ачивок — по ключу stat
const NPC_STAT_EXPLAIN = {
  irTrust:              { ru:'Доверься Иру в его меню (переключись на УР.3): {t} раз', en:'Trust the Ir in his menu (switch to LV.3): {t} times' },
  irBuffs:              { ru:'Заслужи дар Ир (идеал на УР.3+): {t} раз', en:'Earn the Ir\'s gift (perfect at LV.3+): {t} times' },
  irDebuffPerfects:     { ru:'Сделай идеал, пока действует тень Ир: {t}', en:'Score a perfect while the Ir\'s shadow is active: {t}' },
  novaExactDims:        { ru:'Угадай ширину И высоту точно: {t} раз', en:'Guess both width AND height exactly: {t} times' },
  novaExtremePerfects:  { ru:'Идеалы на «странных пропорциях» (ширина и высота сильно различаются): {t}', en:'Perfects on "strange proportions" (width and height far apart): {t}' },
  waiterRatedPerfects:  { ru:'Точность выше 99% (только так он даёт рейтинг): {t}', en:'Accuracy above 99% (the only way he gives rating): {t}' },
  waiterNearMisses:     { ru:'Смеси, которых не хватило до 99% (стикер есть, рейтинга нет): {t}', en:'Mixtures that fell short of 99% (sticker, but no rating): {t}' },
  sealGoods:            { ru:'Закрой заказы под печатью на годноту или лучше: {t}', en:'Close sealed orders at decent or better: {t}' },
  sealPerfects:         { ru:'Идеалы под печатью Хранителя: {t}', en:'Perfects under the Keeper\'s seal: {t}' },
  historicMoments:      { ru:'Заверши «исторический момент» (3 идеала на 3 печатях): {t}', en:'Complete a "historic moment" (3 perfects on 3 seals): {t}' }
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
      memorizeMs:6900, craftMs:29260, colorSteps:6, sizeSteps:5, countMax:5, bsizeSteps:5, reward:50,
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
      memorizeMs:6325, craftMs:22610, colorSteps:9, sizeSteps:7, countMax:7, bsizeSteps:7, reward:85 },
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
      memorizeMs:5750, craftMs:18354, colorSteps:14, sizeSteps:11, countMax:10, bsizeSteps:11, reward:130 },
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
      memorizeMs:5175, craftMs:13300, colorSteps:24, sizeSteps:19, countMax:12, bsizeSteps:19, reward:180 },
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
      memorizeMs:4600, craftMs:9975, colorSteps:37, sizeSteps:26, countMax:14, bsizeSteps:26, reward:240,
      // Патч "Уникальные механики": на УР.1/2 Ир показывает меню доверия;
      // идеал/брак на УР.3+ даёт бафф/дебафф на следующее задание (game.js)
      special:'trust' }
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
      memorizeMs:7475, craftMs:26600, colorSteps:10, sizeSteps:8, countMax:8, bsizeSteps:8, reward:300,
      // Патч: у шефа число сгустков выше 5 выпадает СИЛЬНО чаще, чем ниже (game.js)
      countBias:'high' },
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
      memorizeMs:8050, craftMs:26600, colorSteps:14, sizeSteps:8, countMax:8, bsizeSteps:8, reward:300 },
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
      memorizeMs:8625, craftMs:24073, colorSteps:12, sizeSteps:8, countMax:10, bsizeSteps:8, reward:300 }
  ];

  const TIER_COLORS = {1:'var(--t1)',2:'var(--t2)',3:'var(--t3)',4:'var(--t4)',5:'var(--t5)'};

  // ---------- Патч "Ежедневный особый заказ" ----------
  // 3 фиксированных профиля сложности — переодевают ЛЮБОГО из 23 персонажей
  // в одинаковые числовые характеристики (та же идея, что у DIFFICULTIES[2..4],
  // просто гарантированно одинаковая для всех, а не по своему тиру у каждого).
  // scoreTier — какой порог good/perfect использовать в finalizeResult
  // (0.8/0.95 обычный, 0.85/0.97 — тир5-стиль), levels — какие УР.1-4 доступны.
  const DAILY_DIFFICULTY_PROFILES = {
    easy: { levels:[1,2], color:'var(--daily-easy)', reward:130,
      memorizeMs:5750, craftMs:18354, colorSteps:14, sizeSteps:11, countMax:10, bsizeSteps:11, scoreTier:3 },
    mid:  { levels:[2,3], color:'var(--daily-mid)', reward:180,
      memorizeMs:5175, craftMs:13300, colorSteps:24, sizeSteps:19, countMax:12, bsizeSteps:19, scoreTier:4 },
    hard: { levels:[1,2,3,4], color:'var(--daily-hard)', reward:240,
      memorizeMs:4600, craftMs:9975, colorSteps:37, sizeSteps:26, countMax:14, bsizeSteps:26, scoreTier:5 }
  };

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

  // ---------- Фаза 3: "поведенческие" модификаторы заказа (Ур.4+) ----------
  // Помимо фокус-модификаторов (спектр/сгустки/габариты, см. выше) на Ур.4
  // прогрессии открываются модификаторы, меняющие не ВЕС параметров, а сами
  // условия заказа. С Ур.7 у красных+ персонажей их может быть несколько сразу.
  // Иконки — эмодзи-плейсхолдеры. ART-SWAP: заменить на картинки в assets/ui.
  const MOD_ICONS = { timer:'⏱️', duck:'🦆', rampage:'💥' };
  const MOD_NAMES = {
    timer:   { ru:'Таймер',      en:'Timer' },
    duck:    { ru:'Важная утка',  en:'VIP Duck' },
    rampage: { ru:'Погром',       en:'Rampage' }
  };
  // краткие описания для тултипа (title) на плашке модификатора
  const MOD_DESC = {
    timer:   { ru:'На воссоздание даётся на 25% меньше времени.',
               en:'25% less time to recreate the potion.' },
    duck:    { ru:'За идеал — больше рейтинга, за брак — больше штраф.',
               en:'Bigger reward for a perfect, bigger penalty for a botch.' },
    rampage: { ru:'×2 рейтинг и чаевые за заказ. Но персонаж дерётся: уходит из цикла и портит репутацию другим гостям этого дня.',
               en:'×2 rating and tips for the order. But this one brawls: leaves the cycle and hurts the day\'s other guests\' reputation.' }
  };

  // ---------- Фаза 6: магазин — предметы-расходники ----------
  // Каждый предмет — расходник: покупается за чаевые, лежит в инвентаре со
  // счётчиком, тратится при применении. У каждого 3 грейда (сильнее+дороже),
  // покупаются постоянно (новый не заменяет предыдущий). Грейды 1/2/3
  // открываются по прогрессии (Ур.4/5/8, флаги shop_grade_1..3).
  //   icon      — эмодзи-плейсхолдер (ART-SWAP: путь к картинке подхватит visualHTML).
  //   usePhase  — когда предмет можно применить: 'select' (влияет на СЛЕДУЮЩИЙ
  //               заказ) или 'craft' (на ТЕКУЩИЙ, во время варки).
  //   effect    — тег эффекта, game.js смотрит по нему, что делать.
  //   grades[]  — по одному объекту на грейд: price + параметры эффекта + label.
  const SHOP_ITEMS = [
    // Фаза 6 (правки пользователя): у каждого грейда своё имя И иконка (эмодзи —
    // плейсхолдеры под ART; тематическая эскалация). Рендер берёт grade.name/
    // grade.icon с фолбэком на item.name/item.icon.
    {
      id:'stopwatch', icon:'⏱️', usePhase:'select', effect:'time',
      name:{ ru:'Сломанный секундомер', en:'Broken Stopwatch' },
      desc:{ ru:'Заедает на полпути. Добавляет время на воссоздание следующего заказа.',
             en:'Jams halfway. Adds crafting time to your next order.' },
      grades:[
        { price:80,  bonusMs:1000, icon:'⏱️', name:{ ru:'Сломанный секундомер', en:'Broken Stopwatch' }, label:{ ru:'+1 сек', en:'+1s' } },
        { price:260, bonusMs:2000, icon:'⏲️', name:{ ru:'Карманный хронометр', en:'Pocket Chronometer' }, label:{ ru:'+2 сек', en:'+2s' } },
        { price:700, bonusMs:4000, icon:'🕰️', name:{ ru:'Атомные часы контрабандиста', en:'Smuggler’s Atomic Clock' }, label:{ ru:'+4 сек', en:'+4s' } }
      ]
    },
    {
      id:'jigger', icon:'🥃', usePhase:'craft', effect:'jigger',
      name:{ ru:'Потрёпанный джиггер', en:'Battered Jigger' },
      desc:{ ru:'Мятый мерный стакан. Отключает регулятор — он больше не влияет на рейтинг.',
             en:'A dented measuring cup. Disables a regulator — it no longer affects your score.' },
      grades:[
        { price:120,  mode:'random',  icon:'🥃', name:{ ru:'Потрёпанный джиггер', en:'Battered Jigger' }, label:{ ru:'случайный', en:'random' } },
        { price:380,  mode:'choose',  icon:'🍶', name:{ ru:'Металлический джиггер', en:'Steel Jigger' }, label:{ ru:'на выбор',  en:'you pick' } },
        { price:1000, mode:'random2', icon:'🍾', name:{ ru:'Джиггер Пьяницы Пита', en:'Drunkard Pete’s Jigger' }, label:{ ru:'2 случайных', en:'2 random' } }
      ]
    },
    {
      id:'paprika', icon:'🌶️', usePhase:'craft', effect:'repboost',
      name:{ ru:'Космическая паприка', en:'Cosmic Paprika' },
      desc:{ ru:'Щепотка звёздной пыльцы распаляет гостя. За годноту+ он даст больше репутации, за брак — сильнее обидится.',
             en:'A pinch of stellar dust fires the guest up. On a good+ result they grant more reputation; on a botch they take it harder.' },
      grades:[
        { price:150,  rep:2, icon:'🌶️', name:{ ru:'Космическая паприка', en:'Cosmic Paprika' }, label:{ ru:'±2 репутации', en:'±2 rep' } },
        { price:480,  rep:4, icon:'🫑', name:{ ru:'Перец сверхновой', en:'Supernova Pepper' }, label:{ ru:'±4 репутации', en:'±4 rep' } },
        { price:1300, rep:6, icon:'🔥', name:{ ru:'Пламя чёрной дыры', en:'Black-Hole Blaze' }, label:{ ru:'±6 репутации', en:'±6 rep' } }
      ]
    },
    {
      id:'chip', icon:'🎲', usePhase:'craft', effect:'chip',
      name:{ ru:'Фишка неудачника', en:"Loser's Chip" },
      desc:{ ru:'Затёртая покерная фишка. В конце меняет итоговый рейтинг заказа на случайную величину.',
             en:"A worn poker chip. At the end, shifts the order's final score by a random amount." },
      grades:[
        { price:100, lo:-0.05, hi:0.05, icon:'🎲', name:{ ru:'Фишка неудачника', en:"Loser's Chip" }, label:{ ru:'−5%…+5%', en:'−5%…+5%' } },
        { price:320, lo:-0.03, hi:0.07, icon:'🃏', name:{ ru:'Фишка шулера', en:"Cardsharp's Chip" }, label:{ ru:'−3%…+7%', en:'−3%…+7%' } },
        { price:850, lo:0.0,   hi:0.10, icon:'🎰', name:{ ru:'Фишка казино «Край Вселенной»', en:'Edge-of-Universe Chip' }, label:{ ru:'0%…+10%', en:'0%…+10%' } }
      ]
    },
    {
      id:'clarity', icon:'💧', usePhase:'select', effect:'memtime',
      name:{ ru:'Тоник ясности', en:'Clarity Tonic' },
      desc:{ ru:'Проясняет взгляд. Добавляет время на фазу запоминания следующего заказа.',
             en:'Sharpens your eye. Adds memorize time to your next order.' },
      grades:[
        { price:90,  bonusMs:1000, icon:'💧', name:{ ru:'Тоник ясности', en:'Clarity Tonic' }, label:{ ru:'+1 сек',   en:'+1s' } },
        { price:300, bonusMs:2000, icon:'🧪', name:{ ru:'Эликсир фокуса', en:'Focus Elixir' }, label:{ ru:'+2 сек',   en:'+2s' } },
        { price:800, bonusMs:3500, icon:'🔮', name:{ ru:'Роса третьего глаза', en:'Third-Eye Dew' }, label:{ ru:'+3.5 сек', en:'+3.5s' } }
      ]
    },
    {
      id:'salt', icon:'🧂', usePhase:'craft', effect:'flatbonus',
      name:{ ru:'Звёздная соль', en:'Stardust Salt' },
      desc:{ ru:'Щепотка на удачу. Прибавляет фиксированный рейтинг, если заказ вышел годным.',
             en:'A pinch for luck. Adds flat rating if the order lands good.' },
      grades:[
        { price:110, flat:40,  icon:'🧂', name:{ ru:'Звёздная соль', en:'Stardust Salt' }, label:{ ru:'+40',  en:'+40' } },
        { price:340, flat:90,  icon:'☄️', name:{ ru:'Соль кометного хвоста', en:'Comet-Tail Salt' }, label:{ ru:'+90',  en:'+90' } },
        { price:900, flat:180, icon:'💎', name:{ ru:'Кристалл первотворения', en:'Firstborn Crystal' }, label:{ ru:'+180', en:'+180' } }
      ]
    },
    {
      id:'weight', icon:'⚖️', usePhase:'craft', effect:'rewardmult',
      name:{ ru:'Утяжелённый шейкер', en:'Weighted Shaker' },
      desc:{ ru:'Бьёт солиднее. Увеличивает рейтинг за годный или идеальный заказ.',
             en:'Hits heavier. Boosts rating for a good or perfect order.' },
      grades:[
        { price:160,  mult:0.15, icon:'⚖️', name:{ ru:'Утяжелённый шейкер', en:'Weighted Shaker' }, label:{ ru:'+15%', en:'+15%' } },
        { price:520,  mult:0.30, icon:'🏋️', name:{ ru:'Свинцовый шейкер', en:'Leaden Shaker' }, label:{ ru:'+30%', en:'+30%' } },
        { price:1400, mult:0.50, icon:'🔩', name:{ ru:'Шейкер из нейтронной стали', en:'Neutron-Steel Shaker' }, label:{ ru:'+50%', en:'+50%' } }
      ]
    },
    {
      id:'shield', icon:'🪢', usePhase:'craft', effect:'shield',
      name:{ ru:'Страховочный трос', en:'Safety Line' },
      desc:{ ru:'Ловит падение. Смягчает потерю рейтинга, если заказ ушёл в брак.',
             en:'Catches the fall. Softens rating loss if the order flops.' },
      grades:[
        { price:130,  cut:0.5,  icon:'🪢', name:{ ru:'Страховочный трос', en:'Safety Line' }, label:{ ru:'−½ штрафа',  en:'half loss' } },
        { price:420,  cut:0.75, icon:'🧷', name:{ ru:'Гравитационный трос', en:'Grav Tether' }, label:{ ru:'−¾ штрафа',  en:'quarter loss' } },
        { price:1100, cut:1.0,  icon:'🛟', name:{ ru:'Силовой якорь', en:'Force Anchor' }, label:{ ru:'без потерь',  en:'no loss' } }
      ]
    },
    {
      id:'eye', icon:'👁️', usePhase:'craft', effect:'nudge',
      name:{ ru:'Барменский глаз', en:"Barkeep's Eye" },
      desc:{ ru:'Намётанный глаз. В конце игры сам подвинет ползунки на деление ближе к верному значению.',
             en:'A trained eye. At the end it nudges sliders one notch closer to the right value.' },
      grades:[
        { price:180,  count:1,     icon:'👁️',   name:{ ru:'Барменский глаз', en:"Barkeep's Eye" }, label:{ ru:'1 ползунок', en:'1 slider' } },
        { price:560,  count:2,     icon:'👁️‍🗨️', name:{ ru:'Глаз оракула', en:"Oracle's Eye" }, label:{ ru:'2 ползунка', en:'2 sliders' } },
        { price:1500, count:'all', icon:'🪬',    name:{ ru:'Всевидящее око', en:'All-Seeing Eye' }, label:{ ru:'все', en:'all' } }
      ]
    },
    {
      id:'haste', icon:'⚡', usePhase:'craft', effect:'speedlock',
      name:{ ru:'Ускоритель варки', en:'Brew Accelerant' },
      desc:{ ru:'Подстёгивает руки. Гарантирует минимальный бонус за скорость, даже если возишься долго.',
             en:'Quickens the hands. Guarantees a minimum speed bonus even if you take your time.' },
      grades:[
        { price:140, lock:0.5,  icon:'⚡', name:{ ru:'Ускоритель варки', en:'Brew Accelerant' }, label:{ ru:'½ бонуса',  en:'½ bonus' } },
        { price:450, lock:0.75, icon:'💨', name:{ ru:'Катализатор спешки', en:'Haste Catalyst' }, label:{ ru:'¾ бонуса',  en:'¾ bonus' } },
        { price:1200, lock:1.0, icon:'🚀', name:{ ru:'Импульс сверхсветовой', en:'Superluminal Impulse' }, label:{ ru:'полный',    en:'full' } }
      ]
    },

    {
      id:'charge', icon:'🔋', usePhase:'select', effect:'charge',
      name:{ ru:'Батарейка вдохновения', en:'Inspiration Cell' },
      desc:{ ru:'Подзаряжает умения игрока (потолок — 3 заряда).',
             en:'Recharges your skills (cap is 3 charges).' },
      grades:[
        { price:200,  add:1, icon:'🔋', name:{ ru:'Батарейка вдохновения', en:'Inspiration Cell' }, label:{ ru:'+1 заряд',  en:'+1 charge' } },
        { price:550,  add:2, icon:'🔌', name:{ ru:'Аккумулятор музы', en:'Muse Accumulator' }, label:{ ru:'+2 заряда', en:'+2 charges' } },
        { price:1300, add:3, icon:'⚛️', name:{ ru:'Ядерный источник идей', en:'Nuclear Idea Core' }, label:{ ru:'+3 заряда', en:'+3 charges' } }
      ]
    },

    // ---------- Уникальные предметы (без грейдов, откр. на Ур.8, unique_items) ----------
    {
      id:'brawltoken', icon:'🎟️', unique:true, usePhase:'select', effect:'addmod',
      name:{ ru:'Жетон дебоша', en:'Brawl Token' },
      desc:{ ru:'Суёшь его гостю — и его заказ обрастает случайным модификатором (иногда не одним, если гость буйный). Дорого и хаотично.',
             en:'Slip it to a guest and their order sprouts a random modifier (sometimes more, if they are rowdy). Pricey and chaotic.' },
      grades:[ { price:2500, label:{ ru:'★ уникальный', en:'★ unique' } } ]
    },
    {
      id:'starmap', icon:'🗺️', unique:true, usePhase:'craft', effect:'revealall',
      name:{ ru:'Звёздная карта', en:'Star Chart' },
      desc:{ ru:'Разворачивает карту вкусов: на КАЖДОМ доступном регуляторе загорается зелёная зона верного значения.',
             en:'Unfurls a taste-map: a green zone of the right value lights on EVERY available regulator.' },
      grades:[ { price:2000, zone:0.12, label:{ ru:'★ уникальный', en:'★ unique' } } ]
    },
    {
      id:'philosopher', icon:'🪨', unique:true, usePhase:'craft', effect:'truesolve',
      name:{ ru:'Философский камень', en:"Philosopher's Stone" },
      desc:{ ru:'Знает истину. Ставит два регулятора точно на верные значения и фиксирует их.',
             en:'Knows the truth. Sets two regulators exactly right and locks them.' },
      grades:[ { price:3000, count:2, label:{ ru:'★ уникальный', en:'★ unique' } } ]
    },
    // Фаза 10: НЕ продаётся (grantOnly) — выдаётся Бабушкой Муррой за идеал на
    // УР.4. Кошачья лапа ставит один регулятор точно на верное значение.
    {
      id:'yarn', icon:'🧶', unique:true, grantOnly:true, usePhase:'craft', effect:'truesolve',
      name:{ ru:'Клубок ниток', en:'Ball of Yarn' },
      desc:{ ru:'Подарок Бабушки Мурры. Размотай — и кошачья лапа поставит один регулятор точно на верное значение.',
             en:'A gift from Grandma Murr. Unravel it and a cat’s paw sets one regulator exactly right.' },
      grades:[ { price:0, count:1, label:{ ru:'★ подарок', en:'★ gift' } } ]
    }
  ];

  // ---------- Фаза 7: умения игрока ----------
  // flag — флаг прогрессии открытия (skill_1..4). mode — как ведёт себя кнопка:
  //   'who'     — окно выбора одного гостя (гарантированно придёт);
  //   'ban'     — окно выбора до 3 гостей (не появятся до конца цикла);
  //   'refresh' — сразу обновляет гостей дня (без окна);
  //   'stub'    — заглушка (зависит от системы грейдов, Фаза 9).
  // icon — эмодзи-плейсхолдер (ART-SWAP через visualHTML).
  const SKILLS = [
    { id:'who',     flag:'skill_1', mode:'who',     icon:'👀',
      name:{ ru:'Кто там?', en:"Who's there?" },
      desc:{ ru:'Выбери гостя — он гарантированно придёт в ближайших заданиях.',
             en:'Pick a guest — they are guaranteed to arrive soon.' } },
    { id:'ban',     flag:'skill_2', mode:'ban',     icon:'🚫',
      name:{ ru:'Этих не пускайте', en:'Keep them out' },
      desc:{ ru:'Выбери до трёх — они не появятся до конца цикла.',
             en:"Pick up to three — they won't appear until the cycle ends." } },
    // правка пользователя: «Вам уже пора» — на Ур.6 (skill_3), «Повторите» — на Ур.8 (skill_4)
    { id:'refresh', flag:'skill_3', mode:'refresh', icon:'🔄',
      name:{ ru:'Вам уже пора', en:'Time to go' },
      desc:{ ru:'Обновляет всех гостей дня на новых (те же не повторяются).',
             en:'Refreshes the whole day with new guests (no repeats).' } },
    { id:'grade',   flag:'skill_4', mode:'grade',   icon:'🔁',
      name:{ ru:'Повторите!', en:'Do it again!' },
      desc:{ ru:'Случайному гостю дня — грейд выше (сложнее, но дороже).',
             en:'Bumps a random guest of the day up a grade (harder, but pays more).' } }
  ];

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

  // Патч (крышки, v2): крышечка — САМОСТОЯТЕЛЬНАЯ фигура, которая лежит
  // поверх банки (см. буквально отдельный path в game.js, не единый контур
  // с телом — так и было в самом первом варианте, просто теперь опрятнее
  // нарисована и без щели на стыке). points — [capT, wf]: capT 0=шов
  // (низ крышки), 1=макушка; wf — форма (как в SHAPE_PROFILES, НЕ множитель
  // ширины банки). widthScale — ширина крышки как доля ШИРИНЫ БАНКИ w,
  // почти всегда <1 (крышка уже банки, как и положено), чтобы на
  // максимальном объёме она не разъезжалась за пределы рисунка.
  // heightFrac — высота крышки как доля w. ridgeAt/spokesAt/antenna —
  // необязательные мелкие детали (см. game.js).
  const CAP_NAMES = [
    { ru:'Болт', en:'Bolt' }, { ru:'Купол', en:'Dome' }, { ru:'Вентиль', en:'Valve' },
    { ru:'Пробка', en:'Cork' }, { ru:'Кристалл', en:'Crystal' }, { ru:'Капсула', en:'Capsule' },
    { ru:'Печать', en:'Seal' }, { ru:'Антенна', en:'Antenna' }
  ];
  const CAP_PROFILES = [
    { points:[[0,0.75],[0.15,0.75],[0.22,1],[0.85,1],[1,0.88]], smooth:false, widthScale:0.82, heightFrac:0.3, ridgeAt:0.5 },
    { points:[[0,0.7],[0.3,0.92],[0.6,0.95],[0.85,0.7],[1,0.1]], smooth:true, widthScale:0.78, heightFrac:0.36 },
    { points:[[0,0.65],[0.3,0.65],[0.42,1],[0.55,1],[0.68,0.65],[1,0.6]], smooth:false, widthScale:0.85, heightFrac:0.28, ridgeAt:0.48, spokesAt:0.48 },
    { points:[[0,1],[0.5,0.88],[0.85,0.75],[1,0.7]], smooth:true, widthScale:0.62, heightFrac:0.4, ridgeAt:0.35 },
    { points:[[0,1],[0.3,1.1],[0.6,0.55],[1,0.05]], smooth:false, widthScale:0.75, heightFrac:0.42 },
    { points:[[0,1],[0.2,1.15],[0.8,1.15],[1,1]], smooth:true, widthScale:0.68, heightFrac:0.3, ridgeAt:0.5 },
    { points:[[0,1],[0.2,1.1],[0.4,0.85],[0.6,1.05],[0.8,0.78],[1,0.45]], smooth:true, widthScale:0.72, heightFrac:0.32 },
    { points:[[0,1],[0.3,0.9],[0.7,0.9],[1,0.78]], smooth:false, widthScale:0.52, heightFrac:0.22, antenna:true }
  ];
  // раздаём каждому из 23 персонажей свою крышку (циклически по каталогу,
  // соседи по тиру по возможности не повторяются)
  const NPC_CAP_STYLE = {
    drone:0, tentacloid:1, gourmet_vega:2, logic9:3, last_of_ir:4,
    nebula_chef:5, twofaced_priestess:6, plasma_bartender:7,
    janitor:1, intern_beep:2, trucker_chrome:3, pete:0,
    fashionista:4, collector_gz:5, dj_pulsar:6, marketer:7,
    perfumer:7, guild_inspector:0, apothecary_mo:1,
    swarm_navigator:2, vex:3, racer_kai:4, catlady:6, engineer:5,
    archivist:5, supernova_child:6, the_waiter:7
  };

  // Патч (растровые декор-слои поверх математической банки): крышка/
  // наклейка — НЕобязательные PNG, которые накладываются НАД уже готовой
  // процедурной банкой (тело/жидкость/пузыри остаются 100% математикой).
  // В отличие от неудавшейся попытки с растровыми стенками — эти слои
  // ничего не клипают и не участвуют в физике пузырей, поэтому им не нужно
  // пиксель-в-пиксель совпадать с геометрией жидкости: крышка сидит НАД
  // зоной жидкости, наклейка ложится поверх уже отрисованных пузырей.
  //   capImg           — путь к PNG крышки (заменяет процедурную из CAP_PROFILES)
  //   capImgAspect     — высота/ширина картинки (чтобы не растягивало пропорции)
  //   capImgWidthMult  — ширина крышки как множитель от текущей ширины банки w
  //                      (крышка "дышит" вместе с объёмом банки, как и раньше)
  //   stickerImg       — путь к PNG наклейки на теле банки, чисто декоративно
  //   stickerWidthMult — ширина наклейки как множитель от w
  //   stickerYFrac     — 0..1, где по высоте жидкости она сидит (0=верх,1=низ)
  // Пока пусто — заполняется по мере появления готовых картинок.
  // aspect = высота/ширина обрезанного PNG (замерено по alpha-боксу файла).
  // Единый рисованный сет крышек (assets/Potions/1..8.png) — первые 8 из
  // 23 по списку CAP_PROMPTS.md, каждая под свой силуэт/тему персонажа.
  // aspect = высота/ширина обрезанного по alpha-боксу файла (замерено PIL).
  // widthMult — стартовое 0.72, подстраивается на глаз при желании.
  const NPC_DECOR = {
    drone:          { capImg: 'assets/Potions/1.png', capImgAspect: 0.856, capImgWidthMult: 0.72 },
    janitor:        { capImg: 'assets/Potions/2.png', capImgAspect: 0.798, capImgWidthMult: 0.72 },
    intern_beep:    { capImg: 'assets/Potions/3.png', capImgAspect: 0.663, capImgWidthMult: 0.72 },
    trucker_chrome: { capImg: 'assets/Potions/4.png', capImgAspect: 0.804, capImgWidthMult: 0.72 },
    fashionista:    { capImg: 'assets/Potions/5.png', capImgAspect: 0.686, capImgWidthMult: 0.72 },
    collector_gz:   { capImg: 'assets/Potions/6.png', capImgAspect: 1.064, capImgWidthMult: 0.72, capImgDx: 0.048 },
    dj_pulsar:      { capImg: 'assets/Potions/7.png', capImgAspect: 0.493, capImgWidthMult: 0.72 },
    tentacloid:     { capImg: 'assets/Potions/8.png', capImgAspect: 0.650, capImgWidthMult: 0.72 }
  };

  // Патч (кастомные рисованные бутыли): каждая запись — один и тот же сосуд,
  // порезанный на 3 куска (крышка/тело/донышко) для 9-slice сборки в
  // buildJarMarkup — крышка и донышко не тянутся (масштаб только от ширины
  // банки w), тело растягивается по высоте под нужный "объём". body должен
  // быть визуально почти прямоугольным (без деталей), иначе растяжение будет
  // заметно искажать рисунок. glow* — необязательный слой блика/свечения,
  // режется теми же границами, что и основной арт, кладётся поверх всего.
  // capH/bodyH/baseH — натуральная высота каждого PNG-куска в пикселях
  // (ширина у всех кусков одна и та же — artW). У стекла есть толщина
  // стенки: снаружи — контур/свечение, внутри — настоящая прозрачная
  // "дыра", куда наливается жидкость. holeW/holeX0 — где на холсте body
  // реально начинается и сколько весит эта ВНУТРЕННЯЯ дыра (не внешний
  // контур стекла) — масштаб и позиция всех кусков считаются от неё, чтобы
  // жидкость/пузыри упирались во внутренний край стекла, а не торчали
  // наружу через стенку или под неё.
  // baseTaper: донышко нарисовано в перспективе (вид чуть сверху) — не
  // прямоугольное, а овальное дно. Точки — [доля высоты ВНУТРИ куска
  // донышка (0=верх/встык с телом, 1=самый низ), доля ширины от holeW] —
  // замерено по самому файлу donышка, чтобы жидкость сужалась туда же,
  // куда сужается нарисованный овал, а не торчала прямоугольными углами
  // за его пределами.
  // Патч: кастомные рисованные бутыли выключены — подгонка формы под все
  // 23 механики (физика сгустков, сетка Векса, крышка/донышко) заняла
  // намного больше итераций, чем стоило, и итог всё равно смотрелся хуже
  // процедурных банок. Данные/код оставлены как есть на будущее — просто
  // не подключены. Включить обратно: CUSTOM_BOTTLES_ENABLED = true.
  const CUSTOM_BOTTLES_ENABLED = false;
  // bodyWallStops: тело банки — не картинка, а векторный градиент (замерен
  // по пикселям исходного 1_body.png и переведён в стоп-точки), потому что
  // это просто симметричная пара полос без деталей — растровый файл на
  // сильном растяжении сильно мылился, а тут никакого растра нет вообще,
  // чёткость идеальна на любом масштабе. Формат — [доля_по_X (0..1 от всей
  // ширины холста artW), цвет, прозрачность]; наносится как fill вертикального
  // прямоугольника той же ширины/позиции, что раньше занимала картинка.
  const CUSTOM_BOTTLES = [
    {
      id: 'b1', artW: 768, holeW: 411, holeX0: 178,
      cap:  'assets/Potions/1_cap.png',  capH: 374,
      // capTaper: крышка — не прямоугольник, ширина по высоте сложно
      // меняется (узкая антенна-макушка → широкий колпак → узкая шейка под
      // колпаком → снова расширяется в плечики тела). Точки — [доля высоты
      // ВНУТРИ куска крышки (0=самый верх, 1=низ/встык с телом), доля
      // ширины от holeW] — замерено по alpha>200 (внутренний край чернильной
      // обводки, не внешнее свечение), чтобы жидкость/пузыри не торчали по
      // бокам узкой шейки и не задевали саму обводку.
      capTaper: [[0,0],[0.107,0.14],[0.15,0.60],[0.193,0.79],[0.235,0.90],[0.30,0.93],
        [0.40,0.96],[0.50,0.975],[0.578,0.978],[0.642,0.93],[0.684,0.80],[0.706,0.81],
        [0.749,0.97],[0.77,1],[1,1]],
      bodyH: 796,
      bodyWallStops: [
        [0,        '#eb2c7b', 0],
        [0.1536,   '#eb2c7b', 0],
        [0.1576,   '#eb2c7b', 1],
        [0.1628,   '#ff8fa8', 1],
        [0.1654,   '#ffbb23', 1],
        [0.1667,   '#ffffff', 1],
        [0.1797,   '#ffffff', 1],
        [0.1810,   '#0a0d18', 1],
        [0.1888,   '#0a0d18', 1],
        [0.1901,   '#ffffff', 1],
        [0.2070,   '#ffffff', 1],
        [0.2083,   '#c9dcd8', 1],
        [0.2148,   '#c9dcd8', 1],
        [0.2161,   '#0a0d18', 1],
        [0.2227,   '#0a0d18', 1],
        [0.2240,   '#c9dcd8', 1],
        [0.2318,   '#c9dcd8', 1],
        [0.2331,   '#c9dcd8', 0],
        [0.7669,   '#c9dcd8', 0],
        [0.7682,   '#c9dcd8', 1],
        [0.7760,   '#c9dcd8', 1],
        [0.7773,   '#0a0d18', 1],
        [0.7839,   '#0a0d18', 1],
        [0.7852,   '#c9dcd8', 1],
        [0.7917,   '#c9dcd8', 1],
        [0.7930,   '#ffffff', 1],
        [0.8099,   '#ffffff', 1],
        [0.8112,   '#0a0d18', 1],
        [0.8190,   '#0a0d18', 1],
        [0.8203,   '#ffffff', 1],
        [0.8333,   '#ffffff', 1],
        [0.8346,   '#ffbb23', 1],
        [0.8372,   '#ff8fa8', 1],
        [0.8424,   '#eb2c7b', 1],
        [0.8464,   '#eb2c7b', 0],
        [1,        '#eb2c7b', 0]
      ],
      base: 'assets/Potions/1_base.png', baseH: 174,
      // baseTaper: то же самое, но для донышка (перспективный овал) — тоже
      // по alpha>200, поэтому сужение начинается раньше, чем казалось на
      // глаз, и полностью смыкается в 0 (не 0.05) — иначе в самом низу,
      // за пределами прорисованного донышка, торчал крошечный "хвостик"
      // жидкости, который нечем было прикрыть.
      baseTaper: [[0,1],[0.644,1],[0.678,0.90],[0.701,0.79],[0.724,0.68],
        [0.747,0.52],[0.759,0.41],[0.77,0.26],[0.782,0],[1,0]],
      glowCap:  'assets/Potions/2_cap.png',
      glowBody: 'assets/Potions/2_body.png',
      glowBase: 'assets/Potions/2_base.png'
    }
  ];

  const STAGE_TABLE = [ [1,1,1],[2,2,3],[3,4,4],[4,4,4] ];
  const MAX_STAGE = STAGE_TABLE.length - 1;

  // ============================================================
  // Фаза 3: СИСТЕМА ПРОГРЕССИИ (костяк нового игрового цикла)
  // ------------------------------------------------------------
  // XP прогрессии = накопленная сумма рейтингов ЗАВЕРШЁННЫХ циклов (аркада).
  // Каждый элемент levels[] — одна ШКАЛА (бар). Завершив бар i (xp достигло
  // суммы xp баров 0..i), игрок получает УРОВЕНЬ i+1 и его grants:
  //   cycleDays  — цикл дорастает до N дней (монотонно; не задан → как было);
  //   poolSize   — сколько персонажей в пуле дня (монотонно);
  //   mechanics  — какие механики открываются (строки-флаги, читает game.js).
  // npcMarks открываются ПО ХОДУ заполнения этого бара: at = доля 0..1 бара.
  // Тиры: t1 зелёные, t2 жёлтые, t3 оранжевые, t4 красные, t5 фиолетовые.
  // Числа xp — стартовая прикидка, легко тюнить (см. ROADMAP «Математика»).
  // Логика (уровень/дни/пул/открытые НПС из xp) — в game.js (PROG_* хелперы),
  // profile.js хранит только сырой xp + список встреченных НПС (metNpcs).
  // Стартовый ростер: все зелёные + Коллекционер Гз + Инспектор Гильдии.
  // ============================================================
  const PROGRESSION = {
    startCycleDays: 5,
    startPoolSize: 2,
    startNpcs: ['drone', 'janitor', 'intern_beep', 'trucker_chrome', 'pete', 'collector_gz', 'guild_inspector'],
    levels: [
      // Ур.1 — шкала 1: жёлтые (Коллекционер уже открыт со старта)
      // Правка пользователя: пороги удвоены — прогрессия замедлена в 2× (контент
      // открывался слишком быстро). npcMarks — доли от l.xp, масштабируются сами.
      { xp: 1200,  cycleDays: 6, mechanics: ['collection'],
        npcMarks: [ {at:0.25, id:'tentacloid'}, {at:0.5, id:'marketer'}, {at:0.72, id:'fashionista'}, {at:0.9, id:'dj_pulsar'} ] },
      // Ур.2 — шкала 2: 1-я половина оранжевых (Инспектор уже открыт со старта)
      { xp: 2400, mechanics: ['characters', 'quests'],
        npcMarks: [ {at:0.4, id:'gourmet_vega'}, {at:0.85, id:'perfumer'} ] },
      // Ур.3 — шкала 3: 2-я половина оранжевых
      { xp: 4000, cycleDays: 7, mechanics: ['skill_1', 'modifiers'],
        npcMarks: [ {at:0.3, id:'engineer'}, {at:0.6, id:'apothecary_mo'} ] },
      // Ур.4 — шкала 4: 1-я половина красных
      { xp: 6400, mechanics: ['tips', 'shop', 'shop_grade_1', 'skill_2', 'modifiers_new3'],
        npcMarks: [ {at:0.4, id:'logic9'}, {at:0.85, id:'swarm_navigator'} ] },
      // Ур.5 — шкала 5: 2-я половина красных
      { xp: 9600, cycleDays: 8, poolSize: 3, mechanics: ['shop_grade_2'],
        npcMarks: [ {at:0.4, id:'vex'}, {at:0.62, id:'catlady'}, {at:0.85, id:'racer_kai'} ] },
      // Ур.6 — шкала 6: 1-я половина фиолетовых
      { xp: 14000, mechanics: ['skill_3', 'relations'],
        npcMarks: [ {at:0.25, id:'last_of_ir'}, {at:0.5, id:'archivist'}, {at:0.72, id:'supernova_child'}, {at:0.92, id:'the_waiter'} ] },
      // Ур.7 — шкала 7: 2-я половина фиолетовых
      { xp: 19000, cycleDays: 10, mechanics: ['modifiers_multi'],
        npcMarks: [ {at:0.35, id:'nebula_chef'}, {at:0.65, id:'twofaced_priestess'}, {at:0.9, id:'plasma_bartender'} ] },
      // Ур.8 — персонажи больше не открываются
      { xp: 26000, mechanics: ['skill_4', 'shop_grade_3', 'unique_items'], npcMarks: [] },
      // Ур.9 — пул дорастает до 4; открывает закрепление до 3 заданий
      { xp: 34000, poolSize: 4, mechanics: ['quests_pin'], npcMarks: [] }
    ]
  };

  // Фаза 3 (3C): приветственные фразы — показываются РОВНО ОДИН РАЗ, при первой
  // встрече персонажа (см. markNpcMet/startOrder в game.js). Кратко и художественно
  // намекают на уникальную механику НПС. После показа больше не всплывают.
  // Фаза 10 (Маркетолог): обрывки рекламных объявлений — «газета» под хаос-панелью.
  // На УР.4 они постоянно перетасовываются. ART-SWAP: можно заменить всю подложку
  // картинкой газеты через MARKETER_BG_IMG (game.js).
  const MARKETER_ADS = [
    { ru:'РАСПРОДАЖА', en:'BIG SALE' }, { ru:'ТОЛЬКО СЕГОДНЯ', en:'TODAY ONLY' },
    { ru:'СКИДКА 50%', en:'50% OFF' }, { ru:'НОВИНКА!', en:'NEW!' },
    { ru:'КУПИ 1 — ПОЛУЧИ 2', en:'BUY 1 GET 1' }, { ru:'ХИТ СЕЗОНА', en:'HOT DEAL' },
    { ru:'ЗВОНИ СЕЙЧАС', en:'CALL NOW' }, { ru:'БЕСПЛАТНО', en:'FREE' },
    { ru:'ЛУЧШАЯ ЦЕНА', en:'BEST PRICE' }, { ru:'СПЕШИТЕ', en:'HURRY' },
    { ru:'ЭКСКЛЮЗИВ', en:'EXCLUSIVE' }, { ru:'ГАРАНТИЯ', en:'GUARANTEED' },
    { ru:'АКЦИЯ', en:'OFFER' }, { ru:'ПОСЛЕДНИЙ ШАНС', en:'LAST CHANCE' }
  ];

  // Подсказки на фазе игры (что делать), с выделенным действием (<b>) — крупнее
  // и цветом (см. .phase-action в style.css). Кто не указан — берёт CRAFT_HINT_DEFAULT
  // (обычные ползунки). Ключ — id НПС (как в ALL_NPCS).
  const NPC_CRAFT_HINT = {
    vex:               { ru:'<b>ПЕРЕТАСКИВАЙ</b> сгустки на их места в сетке', en:'<b>DRAG</b> the blobs onto their grid nodes' },
    swarm_navigator:   { ru:'<b>ВЕРНИ</b> детали обратно в банку', en:'<b>RETURN</b> the parts back into the jar' },
    janitor:           { ru:'<b>ОТТИРАЙ</b> грязь со стекла и воссоздавай зельё', en:'<b>WIPE</b> the grime off the glass, then recreate' },
    collector_gz:      { ru:'<b>НАЙДИ</b> в сетке зельё, совпадающее по всем признакам', en:'<b>FIND</b> the matching potion in the grid' },
    perfumer:          { ru:'<b>ВЕДИ</b> точку по полю «цвет × накал»', en:'<b>DRAG</b> the dot across the colour × intensity pad' },
    trucker_chrome:    { ru:'<b>ПРОВЕДИ</b> регуляторы по «коробке передач»', en:'<b>STEER</b> the sliders through the gearbox path' },
    fashionista:       { ru:'<b>НАСТРОЙ</b> регулятор и жми «Дальше» — по одному', en:'<b>SET</b> one slider, then hit “Next” — one at a time' },
    gourmet_vega:      { ru:'<b>ДЕГУСТИРУЙ</b> и подгоняй, пока не совпадёт', en:'<b>TASTE</b> and adjust until it matches' },
    guild_inspector:   { ru:'<b>ВЫСТАВЬ</b> значения по числам из «Допусков»', en:'<b>SET</b> the values from the tolerance figures' },
    logic9:            { ru:'<b>ВЫСТАВЬ</b> значения степпером (+/−)', en:'<b>SET</b> the values with the +/− stepper' },
    twofaced_priestess:{ ru:'<b>СВЕДИ</b> обе половины зелья как было', en:'<b>MATCH</b> both halves of the potion' },
    plasma_bartender:  { ru:'<b>ПОДГОНИ</b> сгустки и скорость их полёта', en:'<b>MATCH</b> the blobs and their flight speed' },
    supernova_child:   { ru:'<b>ЗАДАЙ</b> ширину, высоту и наклон банки', en:'<b>SET</b> the width, height and tilt of the jar' },
    pete:              { ru:'<b>НАЛЕЙ</b> до нужного уровня и подгони зельё', en:'<b>FILL</b> to the right level, then match the potion' },
    the_waiter:        { ru:'<b>ВОССОЗДАЙ</b> зельё — часы тебя не торопят', en:'<b>RECREATE</b> the potion — the clock won’t rush you' },
    nebula_chef:       { ru:'<b>УГАДАЙ</b> форму сосуда и воссоздай зельё', en:'<b>GUESS</b> the vessel shape, then recreate' }
  };
  const NPC_GREETINGS = {
    drone:            { ru:'Служебный протокол: приветствую. Внимание — в смеси всплывают бракованные пузыри. Лопай их, пока не рванули.', en:'Service protocol: greetings. Note — defective bubbles surface in the mix. Pop them before they burst.' },
    janitor:          { ru:'О, покупатель! Извини за грязь на стекле — придётся протирать прямо на ходу.', en:'Oh, a customer! Sorry about the grime on the glass — you’ll be wiping as you work.' },
    intern_beep:      { ru:'Бип-бип! Я стажёр, только учусь. Давай с чего попроще, лады?', en:'Beep-beep! I’m an intern, still learning. Let’s start simple, okay?' },
    trucker_chrome:   { ru:'Здоро́во! У меня регуляторы — как коробка передач. По прямой не выйдет, привыкай.', en:'Howdy! My sliders run like a gearbox. No straight line here — get used to it.' },
    pete:             { ru:'О, наливают! Мне главное — уровень поймать. Есть у тебя ползунок, чтоб плеснуть повыше-пониже? Вот им и балуйся.', en:'Oh, they’re pouring! For me it’s all about the level. Got a slider to fill it higher or lower? That’s the one to play with.' },
    tentacloid:       { ru:'Мои щупальца ценят в смеси лишь одно... а вот что именно — угадывай сам.', en:'My tentacles care about only one thing in the mix... which one, you’ll have to guess.' },
    fashionista:      { ru:'Дорогуша! Я занимаюсь всем строго по очереди — один регулятор за раз, не части.', en:'Darling! I do everything strictly in turn — one slider at a time, don’t rush.' },
    collector_gz:     { ru:'Коллекционер к услугам. Я не кручу ручки — я выбираю нужную баночку из целой сетки.', en:'Collector at your service. I don’t twist knobs — I pick the right jar from a whole grid.' },
    dj_pulsar:        { ru:'Йоу! Чувствуешь бит? Весь интерфейс качает в такт — лови ритм.', en:'Yo! Feel the beat? The whole interface pulses in time — catch the rhythm.' },
    marketer:         { ru:'Приветствую, партнёр! Забудь скучные ползунки — вот тебе панель на сотню кнопок! Работает, правда, не всё. Угадаешь — что?', en:'Greetings, partner! Forget those dull sliders — here’s a panel with a hundred buttons! Not all of them work, though. Care to guess which do?' },
    gourmet_vega:     { ru:'Гурман пробует, прежде чем принять. Одну неудачную пробу прощу — доделаешь.', en:'A gourmet tastes before accepting. I’ll forgive one bad sip — you can fix it.' },
    perfumer:         { ru:'Парфюмер приветствует. Цвет и накал я свожу в одну точку — это пэд, а не два ползунка.', en:'The perfumer greets you. I merge hue and intensity into one point — a pad, not two sliders.' },
    guild_inspector:  { ru:'Инспекция Гильдии. Образца не будет — все допуски прописаны в бумагах. Читай внимательно.', en:'Guild inspection. No sample — all tolerances are written in the papers. Read carefully.' },
    apothecary_mo:    { ru:'Аптекарь Мо. Пациент ждать не может — чем быстрее сваришь, тем выше рейтинг.', en:'Apothecary Mo. The patient can’t wait — the faster you brew, the higher the rating.' },
    logic9:           { ru:'ЛОГИК-9. ВВОД — ТОЛЬКО ПОШАГОВО. СТЕППЕР. ДЕЛЕНИЕ ЗА ДЕЛЕНИЕМ.', en:'LOGIC-9. INPUT — STEP BY STEP ONLY. STEPPER. NOTCH BY NOTCH.' },
    swarm_navigator:  { ru:'Навигатор Роя. Детали разлетятся по циферблату — верни их на места руками.', en:'Swarm Navigator. The parts scatter across the dial — drag them back by hand.' },
    vex:              { ru:'Векс, механик-хирург. Сгустки садятся строго в узлы сетки — перетащи точно.', en:'Vex, mechanic-surgeon. Blobs snap only to grid nodes — place them precisely.' },
    racer_kai:        { ru:'Гонщица Кай! Банку потряхивает, отсчёт бежит по кольцу — держи темп до финиша.', en:'Racer Kai! The jar shakes, the countdown runs along the ring — keep pace to the finish.' },
    catlady:          { ru:'Ах, новый мальчик за прилавком! Мои котики уже облюбовали твои ползунки. Согнать их можно только лаской... или щелчком по носу.', en:'Ah, a new boy behind the counter! My kitties have already claimed your sliders. You can only shoo them with love... or a flick on the nose.' },
    engineer:         { ru:'Инженер навигатора. Образца не жди — цель на самих шкалах, зелёным. Стрелка бежит, под ней «стоп»: лови зону вовремя.', en:'Navigator’s engineer. Expect no sample — the target is on the scales themselves, in green. A needle runs, STOP is below it: catch the zone in time.' },
    last_of_ir:       { ru:'Я — последний из Ир. Доверься мне... или нет. От этого зависит следующая смесь.', en:'I am the last of the Ir. Trust me... or don’t. Your next mix depends on it.' },
    archivist:        { ru:'Хранитель Архива. Один регулятор я впечатаю сам — по одному, раз в несколько секунд.', en:'Keeper of the Archive. I’ll type one slider myself — one at a time, every few seconds.' },
    supernova_child:  { ru:'Дитя Сверхновой. Мне важны и ширина, и высота сосуда — и его поворот.', en:'Child of the Supernova. Width and height of the vessel both matter to me — and its rotation.' },
    the_waiter:       { ru:'Я ждал тебя. Спешить некуда — таймера нет. Но рейтинг дам лишь за почти идеал.', en:'I have waited for you. No rush — there is no timer. But I reward only near-perfection.' },
    nebula_chef:      { ru:'Шеф туманности. Цвет мне безразличен. Важна форма сосуда — угадай её.', en:'Nebula Chef. Color means nothing to me. The vessel’s shape is what matters — guess it.' },
    twofaced_priestess:{ ru:'Двуликая жрица приветствует... и приветствует. Два спектра, две половины банки.', en:'The Two-Faced Priestess greets you... and greets you. Two spectra, two halves of the jar.' },
    plasma_bartender: { ru:'Бармен плазма-бара! Сгустки летают внутри — и скорость их полёта тоже настраивается.', en:'Plasma-bar bartender! The blobs fly around inside — and their speed is tunable too.' }
  };

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
    { id:'total_score', icon:'💎', img:'assets/ach/1.png',
      name:{ ru:'Казна лавки', en:'Shop treasury' },
      desc:{ ru:'Суммарный рейтинг, заработанный за всю историю лавки.', en:'Total rating earned across the shop\'s entire history.' },
      value:p => (p.stats.totalScoreEarned||0),
      t:[1000, 5000, 20000, 50000, 100000, 200000, 350000, 600000, 1000000] },

    { id:'cycle_score', icon:'📈', img:'assets/ach/2.png',
      name:{ ru:'Рекордный цикл', en:'Record cycle' },
      desc:{ ru:'Лучший рейтинг, набранный за один цикл.', en:'Best rating earned in a single cycle.' },
      value:p => (p.stats.bestCycleScore||0),
      t:[800, 1500, 2500, 4000, 6000, 8500, 12000] },

    { id:'progress', icon:'🧪', img:'assets/ach/3.png',
      name:{ ru:'Мастер смесей', en:'Mixture mastery' },
      desc:{ ru:'Взвешенный прогресс: годные и идеальные смеси, помноженные на сложность.', en:'Weighted progress: decent and perfect mixtures multiplied by difficulty.' },
      value:p => (p.stats.weightedProgress||0),
      t:[50, 150, 300, 600, 1000, 2500, 5000, 10000] },

    { id:'perfect_streak', icon:'✨', img:'assets/ach/4.png',
      name:{ ru:'Безупречность', en:'Flawlessness' },
      desc:{ ru:'Лучшая серия идеальных зелий подряд.', en:'Best streak of perfect mixtures in a row.' },
      value:p => (p.streaks.perfectBest||0),
      t:[3, 5, 10, 15, 20, 30, 50] },

    { id:'goodplus_streak', icon:'⚙️', img:'assets/ach/5.png',
      name:{ ru:'Конвейер', en:'Assembly line' },
      desc:{ ru:'Лучшая серия смесей подряд без единого брака.', en:'Best streak of mixtures without a single reject.' },
      value:p => (p.streaks.goodPlusBest||0),
      t:[10, 25, 50, 100, 200, 400] },

    { id:'bad_streak', icon:'💩', img:'assets/ach/6.png',
      name:{ ru:'Чёрная полоса', en:'Rough patch' },
      desc:{ ru:'Серия браков подряд. Бывает. Носи с гордостью.', en:'Rejects in a row. It happens. Wear it proudly.' },
      value:p => (p.streaks.badBest||0),
      t:[3, 5, 10] },

    // Фаза 2 (П7): ачивка на «Пойло» — грейд между браком и годнотой
    { id:'swill_total', icon:'🫗', img:'assets/ach/12.png',
      name:{ ru:'Разливщик пойла', en:'Swill pourer' },
      desc:{ ru:'Сколько всего «пойла» ты налил за всю историю лавки. Не идеал, но и не брак.', en:'How much "swill" you have poured across the shop\'s history. Not perfect, not a reject.' },
      value:p => ((p.stats.stickersLifetime && p.stats.stickersLifetime.swill) || 0),
      t:[10, 40, 120, 300, 700] },

    // Фаза 5 (П4): ачивка на суммарные чаевые за всю историю лавки
    { id:'tips_total', icon:'🪙', img:'assets/ach/13.png',
      name:{ ru:'Звонкая касса', en:'Ringing till' },
      desc:{ ru:'Всего чаевых заработано за всю историю лавки.', en:'Total tips earned across the shop\'s history.' },
      value:p => ((p.tips && p.tips.lifetime) || 0),
      t:[100, 500, 2000, 6000, 15000, 40000] },

    { id:'cycles', icon:'🔁', img:'assets/ach/8.png',
      name:{ ru:'Ветеран лавки', en:'Shop veteran' },
      desc:{ ru:'Завершено полных циклов.', en:'Full cycles completed.' },
      value:p => (p.stats.cyclesCompleted||0),
      t:[5, 20, 50, 100, 250] },

    { id:'orders', icon:'📦', img:'assets/ach/7.png',
      name:{ ru:'Поток заказов', en:'Order flow' },
      desc:{ ru:'Всего выполнено заказов.', en:'Total orders completed.' },
      value:p => (p.stats.totalOrders||0),
      t:[50, 200, 500, 1500, 4000, 10000] },

    // ---- ручные (открываются game.js в конкретный момент) ----
    { id:'speedrun', icon:'⚡', img:'assets/ach/9.png', manual:true,
      name:{ ru:'Молния на пределе', en:'Lightning at the limit' },
      desc:{ ru:'Идеальное зелье тира 5 на максимальной сложности регуляторов, уложившись в первую треть таймера.', en:'A perfect tier-5 mixture at max regulator difficulty, finished within the first third of the timer.' },
      tiers:[
        { hint:{ ru:'Идеал тира 5 на макс. сложности в первую треть таймера', en:'Perfect tier-5 at max difficulty within the first third of the timer' } }
      ] },

    { id:'leaderboard', icon:'🏆', img:'assets/ach/11.png', manual:true,
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

  // Фаза 10: новый зелёный персонаж. Механика (с УР.1) — «уровень жидкости»:
  // отдельный ползунок высоты налива в банке. На УР.4 добавляется «градус» —
  // риск/награда: больше градус → меньше рейтинга, но больше чаевых.
  // ART: пока эмодзи-плейсхолдер (без img) — портрет положить в assets/npc/pete.png.
  { tier:1, id:'pete', emoji:'🍺', img: 'assets/npc/pete.png',
    name:{ ru:'Пьяница Пит', en:'Drunkard Pete' },
    flavors:{ ru:[
      'Плесни как обычно. И налей до краёв... или не до краёв, тебе решать.',
      'Смесь. Главное — сколько налито. Остальное я и не разгляжу уже.',
      'Ту же, что вчера. Уровень запомни — это важнее цвета, поверь старику.'
    ], en:[
      "Pour me the usual. Fill it to the brim... or not to the brim, your call.",
      "A mixture. What matters is how full it is. The rest I can't make out anymore.",
      "Same as yesterday. Remember the level — it matters more than color, trust an old man."
    ]},
    ff:{
      bubbles:{ ru:['Сгустки? А, эти... пусть будут по счёту, как в прошлый раз.','Считай сгустки, торговец. Я-то уже сбился на третьем.'],
                en:["Blobs? Ah, those... let there be the right count, like last time.","Count the blobs, merchant. I lost track after the third."] },
      color:{ ru:['Цвет — как закат над баром, где меня ещё пускают. Тот самый.','Не тот колер — и я не узна́ю свою же смесь. А это грустно.'],
              en:['The color, like the sunset over the bar that still lets me in. That exact one.',"Wrong shade and I won't recognize my own mixture. And that's sad."] },
      size:{ ru:['Банку под мою полку. Ровно, чтоб между пустых бутылок влезла.','Габарит — строго. Дрожащими руками большую не удержу.'],
             en:['A jar to fit my shelf. Exactly, so it slots between the empties.',"Size — strict. With shaky hands I can't hold a big one."] }
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

  // Фаза 10: жёлтый персонаж. Механика (с УР.1) — хаос-панель: в фазе игры
  // обычные ползунки прячутся, справа десятки случайных крутилок/кнопок/ползунков
  // на фоне газеты; реально работает лишь по одному случайному на характеристику,
  // остальные — обманки. На УР.4 текст фона постоянно меняется (см. LEVEL4_FX.marketer).
  // ART: эмодзи-плейсхолдер 📺 (портрет — assets/npc/marketer.png; фон — MARKETER_BG_IMG).
  { tier:2, id:'marketer', emoji:'📺', img: 'assets/npc/marketer.png',
    name:{ ru:'Маркетолог с безлюдного спутника', en:'Marketer from the Empty Satellite' },
    flavors:{ ru:[
      'Смесь — по последнему тренду! Пульт настройки? О, он где-то там, ищи.',
      'Уникальное предложение! Регуляторы разбросаны — но работают не все, ха!',
      'Верю в тебя, партнёр! Крути что хочешь — сработает лишь то, что нужно.'
    ], en:[
      'A mixture per the latest trend! The tuning panel? Oh, it’s somewhere in there, go find it.',
      'A unique offer! The controls are scattered — but not all of them work, ha!',
      'I believe in you, partner! Twist whatever you like — only the right one will do a thing.'
    ]},
    ff:{
      bubbles:{ ru:['Сгустки — ключевой показатель охвата! Найди рабочую ручку, крути.','Число сгустков — это KPI. Где-то на панели живёт нужный регулятор.'],
                en:['The blobs are a key reach metric! Find the working knob, turn it.','The blob count is a KPI. Somewhere on the panel lives the right control.'] },
      color:{ ru:['Цвет бренда — святое! Но кнопка цвета спряталась среди обманок.','Оттенок — по гайдлайну. Тыкай, крути — что-то из этого и есть цвет.'],
              en:['The brand color is sacred! But the color control hides among decoys.','The shade is per the guideline. Poke, twist — one of these is the color.'] },
      size:{ ru:['Габарит — под нашу упаковку. Найди тот самый ползунок в этом хаосе.','Объём флакона — по медиаплану. Нужный регулятор где-то тут.'],
             en:['The size fits our packaging. Find that one slider in this chaos.','The vial volume is per the media plan. The right control is around here somewhere.'] }
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

  // Фаза 10: оранжевый персонаж. Механика (с УР.1) — БЕЗ фазы показа: цель дана
  // зелёными зонами прямо на треках, вместо перетаскивания — бегающий указатель
  // и кнопка «стоп» под каждым ползунком (см. LEVEL4_FX.engineer в game.js).
  // ART: эмодзи-плейсхолдер 🛰️ (портрет положить в assets/npc/engineer.png).
  { tier:3, id:'engineer', emoji:'🛰️', img: 'assets/npc/engineer.png',
    name:{ ru:'Инженер навигатора', en:'Navigator’s Engineer' },
    flavors:{ ru:[
      'Смесь для юстировки курсографа. Ловить будешь на лету — образца я не дам.',
      'Настрой по зонам на шкалах. Стрелка бежит — жми «стоп» вовремя, вот и весь фокус.',
      'Мне некогда объяснять. Зелёное — верно. Указатель не ждёт. Работай.'
    ], en:[
      "A mixture to align the coursegraph. You’ll catch it on the fly — I give no sample.",
      "Tune it by the zones on the scales. The needle runs — hit STOP in time, that’s the whole trick.",
      "No time to explain. Green is right. The pointer won’t wait. Get to it."
    ]},
    ff:{
      bubbles:{ ru:['Сгустки — метки курса. Останови стрелку в зелёном по счёту.','Число сгустков — это отсчёт до манёвра. Поймай зону.'],
                en:['The blobs are course markers. Stop the needle in the green by count.','The blob count is the countdown to the maneuver. Catch the zone.'] },
      color:{ ru:['Цвет — спектр маяка. Зелёная зона на шкале — туда и целься.','Ошибёшься спектром — навигатор уведёт корабль не туда.'],
              en:['The color is the beacon’s spectrum. Aim for the green zone on the scale.',"Miss the spectrum and the navigator takes the ship the wrong way."] },
      size:{ ru:['Габарит — под гнездо прибора. Стрелка, зона, «стоп». Ровно.','Мимо зоны по размеру — и юстировка насмарку.'],
             en:['The size fits the instrument socket. Needle, zone, STOP. Exactly.','Miss the size zone and the alignment is wasted.'] }
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

  // Фаза 10: красный персонаж. Механика (с УР.1) — кошачьи лапы: с начала фазы
  // игры на ползунки/банку вылезают огромные лапы и НЕ уходят сами, их надо
  // сгонять кликом (мяу+шлепок); чем выше уровень — тем быстрее возвращаются и
  // тем больше их. На УР.4 за идеал даёт предмет «клубок ниток» (см. game.js).
  // ART: эмодзи-плейсхолдеры (🐈 портрет, 🐾 лапы — CATLADY_PAW_IMG в game.js).
  { tier:4, id:'catlady', emoji:'🐈', img: 'assets/npc/catlady.png',
    name:{ ru:'Бабушка Мурра', en:'Grandma Murr' },
    flavors:{ ru:[
      'Смесь для моих деток. И не обращай внимания на лапки — они любопытные.',
      'Мурке нужна смесь. Точная. Если коты не мешают — значит, ты им не нравишься.',
      'Составь как надо, дорогуша. Только сперва прогони этих проглотов с прилавка.'
    ], en:[
      "A mixture for my little ones. And pay no mind to the paws — they’re curious.",
      "Murka needs a mixture. Exact. If the cats aren’t bothering you, they don’t like you.",
      "Mix it right, dearie. But first shoo these gluttons off the counter."
    ]},
    ff:{
      bubbles:{ ru:['Сгустки — как клубочки для котят. Число ровно то, что нужно.','Мои коты пересчитают сгустки лапками. Не ошибись.'],
                en:['The blobs are like little yarn balls for the kittens. The count must be exact.','My cats will count the blobs with their paws. Don’t miss.'] },
      color:{ ru:['Цвет — как шёрстка моего первого кота. Земля ему пухом.','Не тот оттенок — и коты отвернутся. А они разбираются.'],
              en:['The color, like my first cat’s fur. May he rest.',"Wrong shade and the cats turn away. And they know their shades."] },
      size:{ ru:['Банку под мою полку с кормом. Ровно, чтоб коты не столкнули.','Габарит важен: большую банку коты непременно уронят.'],
             en:['A jar for my food shelf. Just right, so the cats don’t knock it off.','Size matters: a big jar the cats will surely tip over.'] }
    } },

  /* ---------- УРОВЕНЬ 5 — на грани миров ---------- */
  // Патч: special:'matrix' — в фазах запоминания/игры по окну бегут символы;
  // идеал у него запускает систему печатей (см. game.js)
  { tier:5, id:'archivist', emoji:'📜', img: 'assets/npc/archivist.png', special:'matrix',
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
  // Патч: special:'dual_size' — вместо одного ползунка объёма два: ширина и высота
  { tier:5, id:'supernova_child', emoji:'🌟', img: 'assets/npc/supernova.png', special:'dual_size',
    // Патч: делений под ширину/высоту в 2 раза меньше, чем у остальных
    // тир-5 (26 → 13) — с двумя независимыми габаритами точный подбор
    // на полной сетке был избыточно мелочным
    sizeSteps:13,
    // Патч: и на показ, и на воссоздание +50% сверх обычного тир-5 (иначе
    // унаследовала бы таймеры тира без изменений — см. tierPool в game.js)
    memorizeMs:6900, craftMs:14963,
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
  // Патч: special:'no_timer' — ни таймера показа, ни таймера варки; игрок сам
  // жмёт кнопку "Готово", когда готов. Рейтинг дают только за точность >99%
  // (см. finalizeResult в game.js) — иначе просто стикер + ироничная реплика.
  { tier:5, id:'the_waiter', emoji:'⏳', img: 'assets/npc/waiter.png', special:'no_timer',
    name:{ ru:'Тот-Кто-Ждёт', en:'The One Who Waits' },
    flavors:{ ru:[
      'Я ждал этой смеси... дольше, чем существует твоя лавка. Подожду и точности — сколько нужно.',
      'Когда всё закончится — а всё закончится — останется только она. Пусть она будет точной, а не просто похожей.',
      'Спешить незачем — я никуда не тороплюсь. Но и снисхождения у меня почти не осталось.'
    ], en:[
      'I have waited for this mixture... longer than your shop has existed. I can wait a little longer for it to be exact.',
      'When everything ends — and everything ends — only it will remain. Let it be precise, not merely similar.',
      "No need to hurry — I'm going nowhere. But I have almost no leniency left, either."
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

// с какого уровня репутации у НПС открывается 4-я сложность его заданий —
// у каждого НПС теперь своя уникальная механика УР.4 (см. LEVEL4_FX в game.js)
const REP_L4_UNLOCK_LEVEL = 1;

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
  pete:'bottle',         marketer:'background',
  fashionista:'bottle',  collector_gz:'bottle',   dj_pulsar:'background',
  perfumer:'bottle',     guild_inspector:'background', apothecary_mo:'bottle',
  swarm_navigator:'background', vex:'bottle',     racer_kai:'background',
  archivist:'background', supernova_child:'background', the_waiter:'background',
  catlady:'background', engineer:'bottle'
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

  /* ===== Пьяница Пит (тир 1) ===== */
  pete: [
    { id:'visits', kind:'orders', t:[6,20,50], icon:'🍺',
      name:{ ru:'Завсегдатай', en:'Regular' },
      hint:{ ru:'Хорошего наливалу запоминают. И возвращаются. Снова и снова.', en:'A good pourer is remembered. And returned to. Again and again.' } },
    { id:'perf', kind:'perfects', t:[3,12,30], icon:'✨',
      name:{ ru:'До последней капли', en:'To the last drop' },
      hint:{ ru:'Идеальный уровень налива — это уважение. Пит уважение чувствует.', en:'A perfect pour level is respect. Pete can feel respect.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'🍻',
      name:{ ru:'По второй, по третьей', en:'Another round' },
      hint:{ ru:'Один идеальный стакан — случайность. Несколько подряд — праздник.', en:'One perfect glass is chance. Several in a row is a celebration.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Не просыхает', en:'Never sobers up' },
      hint:{ ru:'За один цикл Пит может зайти... ну, столько раз, сколько нальёшь.', en:'In a single cycle Pete may drop by... well, as often as you pour.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎚',
      name:{ ru:'Твёрдая рука', en:'Steady hand' },
      hint:{ ru:'Все регуляторы в деле — и уровень всё равно ровно тот. Даже с похмелья.', en:'Every slider in play — and the level still spot on. Even hungover.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Пока пена не осела', en:'Before the foam settles' },
      hint:{ ru:'Налито идеально, и таймер едва тронулся. Пит ценит расторопных.', en:'Poured perfectly, and the timer barely moved. Pete values the quick.' } },
    { id:'lvl4', kind:'level4_perfects', t:[1,5,15], icon:'🥃',
      name:{ ru:'Крепче некуда', en:'As strong as it gets' },
      hint:{ ru:'Идеал даже когда градус зашкаливает и рейтинг тает. Вот это характер.', en:'Perfect even as the proof spikes and the rating melts. Now that’s character.' } }
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
      hint:{ ru:'Ковчег наполняется не числом сосудов, а их весом.', en:'An ark is filled not by the number of vessels, but by their weight.' } },
    // ---------- Патч "Уникальные механики" ----------
    { id:'trust', kind:'stat', stat:'irTrust', t:[1,5,15], icon:'🤝',
      name:{ ru:'Взаимное доверие', en:'Mutual trust' },
      hint:{ ru:'Он не доверится тому, кто не доверяет ему. Иногда стоит уступить.', en:'He will not trust one who does not trust him. Sometimes it is worth yielding.' } },
    { id:'gift', kind:'stat', stat:'irBuffs', t:[1,5,12], icon:'🌅',
      name:{ ru:'Дар угасающих', en:'Gift of the fading' },
      hint:{ ru:'Безупречная полная работа не остаётся без ответа. Ир умеют благодарить.', en:'A flawless full work does not go unanswered. The Ir know how to thank.' } },
    { id:'defiance', kind:'stat', stat:'irDebuffPerfects', t:[1,3,8], icon:'🌑',
      name:{ ru:'Свет сквозь тень', en:'Light through the shadow' },
      hint:{ ru:'Даже его тень не помеха тому, кто помнит цвета наизусть.', en:'Even his shadow cannot stop one who knows the colors by heart.' } }
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

  /* ===== Маркетолог с безлюдного спутника (тир 2) ===== */
  marketer: [
    { id:'visits', kind:'orders', t:[5,16,40], icon:'📺',
      name:{ ru:'Постоянный клиент воронки', en:'A loyal funnel lead' },
      hint:{ ru:'Лучший лид — тот, что возвращается сам. Снова и снова.', en:'The best lead is one that returns on its own. Again and again.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'💯',
      name:{ ru:'Конверсия 100%', en:'100% conversion' },
      hint:{ ru:'Нашёл рабочую ручку среди сотни обманок — и попал точно.', en:'Found the working knob among a hundred decoys — and nailed it.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'📈',
      name:{ ru:'Растущий тренд', en:'An upward trend' },
      hint:{ ru:'Один идеал — выброс. Серия — это уже кривая роста.', en:'One perfect is an outlier. A series is a growth curve.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Агрессивная кампания', en:'An aggressive campaign' },
      hint:{ ru:'В горячий сезон маркетолог запускает касания одно за другим.', en:'In peak season the marketer fires touchpoints one after another.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Вся панель под контролем', en:'The whole panel under control' },
      hint:{ ru:'Все характеристики разом, все ручки спрятаны — и всё равно точно.', en:'Every characteristic at once, every knob hidden — and still precise.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Реклама не ждёт', en:'The ad won’t wait' },
      hint:{ ru:'Слот эфира горит. Найди рабочий регулятор быстрее таймера.', en:'The ad slot is burning. Find the working control faster than the timer.' } },
    { id:'lvl4', kind:'level4_perfects', t:[1,5,15], icon:'🗞',
      name:{ ru:'Сквозь мельтешение', en:'Through the flicker' },
      hint:{ ru:'Когда газета за панелью не стоит на месте — идеал ценится вдвойне.', en:'When the newspaper behind the panel won’t hold still, a perfect is worth twice as much.' } }
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

  /* ===== Инженер навигатора (тир 3) ===== */
  engineer: [
    { id:'visits', kind:'orders', t:[5,14,35], icon:'🛰️',
      name:{ ru:'Штатный юстировщик', en:'The staff aligner' },
      hint:{ ru:'Курсографы калибруют регулярно. Регулярно — значит, у тебя.', en:'Coursegraphs are calibrated regularly. Regularly — meaning at your place.' } },
    { id:'perf', kind:'perfects', t:[3,10,25], icon:'🎯',
      name:{ ru:'В яблочко', en:'Bullseye' },
      hint:{ ru:'Стрелка замерла точно в тёмно-зелёном. Снова и снова.', en:'The needle froze dead in the dark green. Again and again.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,7], icon:'📍',
      name:{ ru:'Серия точных остановок', en:'A run of clean stops' },
      hint:{ ru:'Одна идеальная остановка — реакция. Серия — мастерство.', en:'One perfect stop is reflex. A series is mastery.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,8], icon:'🔁',
      name:{ ru:'Плотный график юстировок', en:'A tight alignment schedule' },
      hint:{ ru:'Перед дальним прыжком приборы калибруют не по разу за цикл.', en:'Before a long jump, instruments get calibrated more than once a cycle.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Все шкалы разом', en:'Every scale at once' },
      hint:{ ru:'Указателей столько же, сколько шкал — и ни один не проскочил зону.', en:'As many needles as there are scales — and not one overshot its zone.' } },
    { id:'fast', kind:'fast_perfects', t:[1,5,12], icon:'⚡',
      name:{ ru:'Реакция навигатора', en:'A navigator’s reflex' },
      hint:{ ru:'Стрелка бежит быстро. Твоя рука — быстрее.', en:'The needle runs fast. Your hand runs faster.' } },
    { id:'lvl4', kind:'level4_perfects', t:[1,5,15], icon:'🟥',
      name:{ ru:'Мимо красного', en:'Past the red' },
      hint:{ ru:'Когда на шкалах появляются ловушки — идеал ценится вдвойне.', en:'When traps appear on the scales, a perfect is worth twice as much.' } }
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

  /* ===== Бабушка Мурра (тир 4) ===== */
  catlady: [
    { id:'visits', kind:'orders', t:[4,12,30], icon:'🐈',
      name:{ ru:'Любимый лавочник', en:'Favorite shopkeeper' },
      hint:{ ru:'Коты привыкают к рукам. И приводят хозяйку снова и снова.', en:'Cats grow used to gentle hands. And bring their owner back, again and again.' } },
    { id:'perf', kind:'perfects', t:[2,8,20], icon:'😻',
      name:{ ru:'Одобрено котами', en:'Cat-approved' },
      hint:{ ru:'Когда смесь идеальна, даже самый вредный кот мурлычет. Добейся мурлыканья.', en:'When the mixture is perfect, even the crankiest cat purrs. Earn that purr.' } },
    { id:'streak', kind:'perfect_streak', t:[2,4,6], icon:'🧶',
      name:{ ru:'Клубок удачи', en:'A ball of luck' },
      hint:{ ru:'Один идеал — везение. Ниточка идеалов подряд — уже вязание.', en:'One perfect is luck. A thread of perfects in a row is knitting.' } },
    { id:'cycle', kind:'picks_cycle', t:[3,5,7], icon:'🔁',
      name:{ ru:'Ходит как к себе домой', en:'Comes and goes like home' },
      hint:{ ru:'За один цикл бабушка с котами заглядывает столько раз, сколько ты выдержишь.', en:'In a single cycle the cat granny drops by as many times as you can bear.' } },
    { id:'hard', kind:'hard_perfects', t:[2,8,20], icon:'🎛',
      name:{ ru:'Сквозь лапы и когти', en:'Through paws and claws' },
      hint:{ ru:'Все регуляторы в деле, лапы застят весь прилавок — а смесь всё равно идеальна.', en:'Every slider in play, paws blocking the whole counter — and the mixture still perfect.' } },
    { id:'fast', kind:'fast_perfects', t:[1,4,10], icon:'⚡',
      name:{ ru:'Быстрее, чем кот моргнёт', en:'Faster than a cat blinks' },
      hint:{ ru:'Идеально и до того, как лапа успела вернуться. Коты уважают проворных.', en:'Perfect before the paw could return. Cats respect the quick.' } },
    { id:'lvl4', kind:'level4_perfects', t:[1,5,15], icon:'🧶',
      name:{ ru:'Заслужил клубок', en:'Earned the yarn' },
      hint:{ ru:'За идеал под самой тучей лап бабушка достаёт из кармана кое-что мягкое.', en:'For a perfect under the thickest swarm of paws, granny pulls something soft from her pocket.' } }
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
      hint:{ ru:'В историю входит не всё. Только весомое.', en:'Not everything makes it into history. Only what has weight.' } },
    // ---------- Патч "Уникальные механики" ----------
    { id:'seals', kind:'stat', stat:'sealGoods', t:[3,10,25], icon:'🔏',
      name:{ ru:'Сургуч и чернила', en:'Wax and ink' },
      hint:{ ru:'Его печати ложатся на чужие заявки. Не давай отмеченным страницам пустовать.', en:'His seals fall on others\u2019 orders. Do not let the marked pages stay blank.' } },
    { id:'sealperf', kind:'stat', stat:'sealPerfects', t:[2,8,20], icon:'📜',
      name:{ ru:'Отмеченные страницы', en:'The marked pages' },
      hint:{ ru:'Идеал под печатью весит больше идеала. Он входит в летопись.', en:'A perfect under a seal weighs more than a perfect. It enters the chronicle.' } },
    { id:'witness', kind:'stat', stat:'historicMoments', t:[1,3,7], icon:'🏛',
      name:{ ru:'Исторический момент', en:'A historic moment' },
      hint:{ ru:'Три печати. Три идеала. Так открываются новые тома.', en:'Three seals. Three perfects. That is how new volumes open.' } }
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
      hint:{ ru:'не. тот. свет. будет. больно. делай. тот. всегда.', en:'the wrong. light. will hurt. make. the right one. always.' } },
    // ---------- Патч "Уникальные механики" ----------
    { id:'dims', kind:'stat', stat:'novaExactDims', t:[1,6,15], icon:'📏',
      name:{ ru:'размер. как. у. мамы', en:'size. like. mother\u2019s' },
      hint:{ ru:'я. было. и. широким. и. высоким. вспомни. оба. точно.', en:'i. was. both. wide. and. tall. remember. both. exactly.' } },
    { id:'strange', kind:'stat', stat:'novaExtremePerfects', t:[1,4,10], icon:'🫧',
      name:{ ru:'странная. форма. нравится', en:'strange. shape. i like it' },
      hint:{ ru:'иногда. я. вытянутое. иногда. плоское. сделай. идеально. когда. я. странное.', en:'sometimes. i am. stretched. sometimes. flat. be perfect. when. i am. strange.' } }
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
      name:{ ru:'Красота без часов', en:'Beauty without a clock' },
      hint:{ ru:'У него больше нет часов. Но если получилось быстро — что ж, в этом тоже есть своя красота.', en:"He no longer keeps a clock. But if it came out fast anyway — well, there's a certain beauty in that too." } },
    { id:'wt', kind:'weighted', t:[4,15,40], icon:'⚖️',
      name:{ ru:'Вес ожидания', en:'The weight of waiting' },
      hint:{ ru:'Ожидание меряется не днями. Поверь тому, кто ждал.', en:'Waiting is not measured in days. Trust the one who waited.' } },
    // ---------- Патч "Без таймера": рейтинг только за точность >99% ----------
    { id:'rated', kind:'stat', stat:'waiterRatedPerfects', t:[1,5,15], icon:'💯',
      name:{ ru:'Наконец-то рейтинг', en:'Rating, at last' },
      hint:{ ru:'Обычно ему всё равно. Пока точность не переваливает за 99 — тогда он вдруг вспоминает, что умеет считать.', en:"Usually he doesn't care. Until accuracy crosses 99 — then he suddenly remembers he can count." } },
    { id:'close', kind:'stat', stat:'waiterNearMisses', t:[3,10,25], icon:'🕰',
      name:{ ru:'Мучительно рядом', en:'Agonizingly near' },
      hint:{ ru:'Стикер у тебя есть. Рейтинга у тебя нет. Он находит это забавным.', en:"You have the sticker. You don't have the rating. He finds that amusing." } }
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
  pete: { ru:'Пьяница Пит. Когда-то был кем-то важным на этой станции — теперь важен только уровень в его стакане. Уверяет, что так честнее.', en:'Drunkard Pete. Once someone important on this station — now the only thing that matters is the level in his glass. Claims it’s more honest that way.' },
  intern_beep: { ru:'Стажёр без имени в накладных — все зовут его Бип. Очень старается. Очень.', en:'An intern with no name on the invoices — everyone calls him Beep. He tries very hard. Very.' },
  trucker_chrome: { ru:'Дальнобойщик с тысячей парсеков за плечами. Дом для него — кабина, а вот кофе и смеси — только тут.', en:'A hauler with a thousand parsecs behind him. Home is the cab; coffee and mixtures are only here.' },
  fashionista: { ru:'Икона стиля с Кассиопеи. Меняет панцири по сезону и считает лавку своим тайным бутиком.', en:'A style icon from Cassiopeia. Changes shells with the season and considers the shop her secret boutique.' },
  collector_gz: { ru:'Коллекционер смесей с трёхсотлетним стажем. Никуда не торопится. Совсем.', en:'A mixture collector three hundred years into the hobby. In no hurry. At all.' },
  dj_pulsar: { ru:'Диджей, сводящий сеты из излучения настоящих пульсаров. Ищет вайб во всём, включая жидкости.', en:'A DJ who mixes sets from real pulsar emissions. Finds the vibe in everything, liquids included.' },
  marketer: { ru:'Маркетолог рекламного спутника, с которого давно все улетели. Он продолжает вещать акции в пустоту — и, кажется, не заметил, что аудитории нет.', en:'A marketer of an ad satellite everyone left long ago. He keeps broadcasting deals into the void — and seems not to have noticed there’s no audience.' },
  perfumer: { ru:'Парфюмер Тысячи Лун. Утверждает, что запах — это память, разлитая по флаконам.', en:'The Perfumer of a Thousand Moons. Claims scent is memory decanted into vials.' },
  guild_inspector: { ru:'Инспектор Гильдии зельеваров. Живёт по регламенту и носит его с собой. Весь.', en:'An inspector of the Potioners’ Guild. Lives by the regulations and carries them along. All of them.' },
  apothecary_mo: { ru:'Аптекарь с окраины сектора. За каждым его заказом — чей-то пациент.', en:'An apothecary from the sector’s edge. Behind every order of his is someone’s patient.' },
  engineer: { ru:'Инженер-юстировщик при флотском навигаторе. Живёт по приборам: если стрелка в зелёном — мир в порядке. Ни секунды лишней.', en:'An alignment engineer serving a fleet navigator. Lives by his instruments: if the needle’s in the green, the world is fine. Not a second to spare.' },
  swarm_navigator: { ru:'Голос Роя — коллективного разума из миллионов особей. Говорит «МЫ» и не преувеличивает.', en:'The voice of the Swarm — a hive mind of millions. Says "WE" and does not exaggerate.' },
  vex: { ru:'Хирург-механик. Оперирует корабли, как живых существ — потому что для него они живые.', en:'A surgeon-mechanic. Operates on ships like living beings — because to him they are.' },
  racer_kai: { ru:'Пилот плазменных гонок. Всё в её жизни делится на «до финиша» и «после».', en:'A plasma-racing pilot. Everything in her life divides into "before the finish" and "after".' },
  catlady: { ru:'Бабушка Мурра, хозяйка девяти (а может, и девяноста) космических котов. Куда идёт она — туда и лапы. Спорить бесполезно.', en:'Grandma Murr, keeper of nine (or maybe ninety) cosmic cats. Where she goes, the paws go. Arguing is useless.' },
  archivist: { ru:'Хранитель Архива на краю вселенной. Записывает всё. Вообще всё.', en:'Keeper of the Archive at the edge of the universe. Records everything. Literally everything.' },
  supernova_child: { ru:'Существо, родившееся из вспышки сверхновой. Вчера. Учится всему сразу.', en:'A being born from a supernova flash. Yesterday. Learning everything at once.' },
  the_waiter: { ru:'Никто не знает, чего он ждёт. Известно только, что уже очень давно.', en:'No one knows what he is waiting for. Only that it has been a very long time.' }
};

// ---------- Взаимоотношения между НПС (заглушки — переписать своими текстами!) ----------
// kind: 'friend' | 'enemy' | 'buddy' | 'dislike'. Друг/враг — редкие, штучные пары;
// собутыльник/неприязнь — основная масса связей. lore — почему так (заглушка,
// структуру графа менять не обязательно, текст — свободно). Направление a/b не
// важно — обе стороны читают связь одинаково (см. relationsOf в game.js).
//
// Сейчас пара может реально встретиться в одной тройке заказов ТОЛЬКО если их
// тиры соседствуют по STAGE_TABLE в game.js ([1,1,1] → [2,2,3] → [3,4,4] →
// [4,4,4]/[..,5]): валидны 1-1, 2-2, 2-3, 3-3, 3-4, 4-4, 4-5, 5-5. Тир 1 —
// изолированная группа (только между собой).
//
// "СПЯЩИЕ" связи (ниже, отдельным блоком) — межтирные пары (например,
// тир5-бармен и тир1-стажёр), которые пока НЕ могут выпасть вместе физически.
// Оставлены в графе намеренно: как только появится механика "все тиры
// мешаются в одном пуле", они заработают сами — без правок структуры графа,
// просто начнут реально пересекаться в тройках.
const NPC_RELATIONS = [
  { a:'drone', b:'janitor', kind:'friend',
    lore:{ ru:'Дрон и уборщик пересекаются на каждой смене дольше, чем кто-либо ещё на станции — тихая дружба работяг.',
           en:'The drone and the janitor cross paths every shift longer than anyone else on the station — a quiet friendship between two workers.' } },
  { a:'pete', b:'trucker_chrome', kind:'buddy',
    lore:{ ru:'Дальнобойщик всегда угощает Пита перед долгим рейсом — «за того, кто уже никуда не едет». Пит не обижается: он и правда никуда не едет.',
           en:'The trucker always buys Pete a round before a long haul — "to the one who’s going nowhere." Pete doesn’t mind: he really is going nowhere.' } },
  { a:'pete', b:'janitor', kind:'dislike',
    lore:{ ru:'Уборщик оттирает за Питом липкие круги от стаканов каждую смену — и каждую смену припоминает ему это заново.',
           en:'The janitor scrubs Pete’s sticky glass-rings off the counter every shift — and reminds him of it every shift, anew.' } },
  { a:'last_of_ir', b:'archivist', kind:'friend',
    lore:{ ru:'Хранитель памяти своего народа и хранитель архива узнали друг в друге родственную миссию — оба берегут то, что иначе будет забыто.',
           en:'The keeper of his people’s memory and the keeper of the archive recognized a kindred mission in each other — both guard what would otherwise be forgotten.' } },
  { a:'engineer', b:'swarm_navigator', kind:'friend',
    lore:{ ru:'Инженер держит в зелёном приборы того самого навигатора — Роя. Один прокладывает курс, другой не даёт стрелке соврать. Без второго нет первого.',
           en:'The engineer keeps the very navigator’s instruments in the green — the Swarm’s. One plots the course, the other keeps the needle honest. Neither works without the other.' } },
  { a:'engineer', b:'racer_kai', kind:'dislike',
    lore:{ ru:'Он ведёт корабль строго по приборам; она — по чутью и на грани. Каждый считает манеру другого способом однажды разбиться.',
           en:'He flies strictly by the instruments; she flies by instinct, on the edge. Each considers the other’s style a way to crash eventually.' } },
  { a:'tentacloid', b:'fashionista', kind:'enemy',
    lore:{ ru:'Два самых взыскательных эстета лавки не могут договориться, чей вкус безупречен — конкуренция давно перешла в открытую войну мнений.',
           en:'The shop’s two most demanding aesthetes cannot agree whose taste is flawless — the rivalry has long since become open war.' } },
  { a:'racer_kai', b:'guild_inspector', kind:'enemy',
    lore:{ ru:'Инспектор оштрафовал её больше раз, чем она финишировала первой — теперь это личное.',
           en:'The inspector has fined her more times than she’s finished first — now it’s personal.' } },
  { a:'plasma_bartender', b:'racer_kai', kind:'buddy',
    lore:{ ru:'Она отмечает у него каждую победу — и каждое поражение тоже.',
           en:'She celebrates every win here — and every loss too.' } },
  { a:'plasma_bartender', b:'swarm_navigator', kind:'buddy',
    lore:{ ru:'Никто толком не понимает, как Рой пьёт одним организмом, но бармен давно перестал спрашивать.',
           en:'No one quite understands how the Swarm drinks as one organism, but the bartender stopped asking long ago.' } },
  { a:'plasma_bartender', b:'nebula_chef', kind:'buddy',
    lore:{ ru:'После смены в туманности шеф заходит выпить туда, где никто не просит рецепт.',
           en:'After a shift in the nebula, the chef comes here to drink somewhere no one asks for the recipe.' } },
  { a:'plasma_bartender', b:'twofaced_priestess', kind:'buddy',
    lore:{ ru:'Она разрешает себе один земной грех — его коктейль на двойной закат.',
           en:'She allows herself one earthly sin — his cocktail for the double sunset.' } },
  { a:'plasma_bartender', b:'the_waiter', kind:'buddy',
    lore:{ ru:'Единственный посетитель, которого бармен никогда не торопит закрытием — тот и не заметит.',
           en:'The one patron the bartender never rushes toward closing — he wouldn’t notice anyway.' } },
  { a:'gourmet_vega', b:'perfumer', kind:'buddy',
    lore:{ ru:'Дегустатор и парфюмер часами спорят, что первично — вкус или запах — за бутылкой лучшего, что есть в лавке.',
           en:'The taster and the perfumer argue for hours over whether taste or scent comes first — over the best bottle the shop has.' } },
  { a:'apothecary_mo', b:'vex', kind:'buddy',
    lore:{ ru:'Один латает пациентов, другой — корабли; оба знают, каково это, когда пациент живой и хрупкий.',
           en:'One patches up patients, the other ships; both know what it’s like when the patient is alive and fragile.' } },
  { a:'catlady', b:'apothecary_mo', kind:'buddy',
    lore:{ ru:'Аптекарь лечит её котов бесплатно, а она приносит ему травы, каких нет ни в одном каталоге — оба выхаживают живое.',
           en:'The apothecary treats her cats for free, and she brings him herbs no catalog lists — both nurse the living.' } },
  { a:'catlady', b:'guild_inspector', kind:'dislike',
    lore:{ ru:'Девять (или девяносто) котов на прилавке — это девять (или девяносто) нарушений санитарных норм. Инспектор ведёт счёт.',
           en:'Nine (or ninety) cats on the counter are nine (or ninety) sanitation violations. The inspector keeps a tally.' } },
  { a:'intern_beep', b:'trucker_chrome', kind:'buddy',
    lore:{ ru:'Стажёр и дальнобойщик коротают смены одними и теми же историями — обоим всё равно, слышал ли другой их уже.',
           en:'The intern and the trucker pass their shifts on the same stories — neither minds that the other’s heard them before.' } },
  { a:'marketer', b:'dj_pulsar', kind:'buddy',
    lore:{ ru:'Оба вещают в пустоту и оба уверены, что их слушают. Диджей крутит сеты, маркетолог — акции; вместе им уютнее в этом самообмане.',
           en:'Both broadcast into the void and both are sure someone’s listening. The DJ spins sets, the marketer spins deals; together the self-delusion is cozier.' } },
  { a:'marketer', b:'fashionista', kind:'dislike',
    lore:{ ru:'Икона стиля называет его крикливые «−50%» оскорблением вкуса; он в ответ уверяет, что её эксклюзив — просто плохо продаваемый масс-маркет.',
           en:'The style icon calls his blaring "50% OFF" an insult to taste; he retorts that her exclusivity is just poorly marketed mass-market.' } },
  { a:'twofaced_priestess', b:'supernova_child', kind:'buddy',
    lore:{ ru:'Жрица двух богов и существо из вспышки нашли общий язык быстрее всех — обе говорят о свете как о родном.',
           en:'The priestess of two gods and the being from the flash found common ground faster than anyone — both speak of light like family.' } },
  { a:'guild_inspector', b:'dj_pulsar', kind:'dislike',
    lore:{ ru:'Пульсарные трансляции ДJ не проходят ни по одной лицензии Гильдии — инспектор ведёт на него отдельную папку.',
           en:'The DJ’s pulsar broadcasts don’t clear a single Guild license — the inspector keeps a separate file on him.' } },
  { a:'guild_inspector', b:'vex', kind:'dislike',
    lore:{ ru:'Механик модифицирует корабли за пределами любого допуска Гильдии — инспектор давно сбился со счёта нарушений.',
           en:'The mechanic modifies ships well past any Guild tolerance — the inspector lost count of the violations long ago.' } },
  { a:'guild_inspector', b:'collector_gz', kind:'dislike',
    lore:{ ru:'Коллекция хранится с нарушением половины норм складского учёта — инспектор уверен, что там нарушена и вторая половина.',
           en:'The collection is stored in violation of half the warehousing code — the inspector is sure the other half is broken too.' } },
  { a:'tentacloid', b:'dj_pulsar', kind:'dislike',
    lore:{ ru:'Пульсарный шум ДJ эстет называет искусством только в кавычках.',
           en:'The aesthete calls the DJ’s pulsar noise "art" — with heavy air quotes.' } },
  { a:'tentacloid', b:'perfumer', kind:'dislike',
    lore:{ ru:'Два самых чувствительных «носа» лавки спорят, чьё чувство прекрасного первично — зрение или обоняние.',
           en:'The shop’s two most sensitive "noses" argue over whose sense of beauty comes first — sight or scent.' } },
  { a:'nebula_chef', b:'swarm_navigator', kind:'dislike',
    lore:{ ru:'Рой заказывает порциями на всех сразу — для шефа это варварство по отношению к подаче.',
           en:'The Swarm orders in bulk for everyone at once — to the chef, that’s barbarism toward presentation.' } },
  { a:'fashionista', b:'collector_gz', kind:'dislike',
    lore:{ ru:'Икона стиля называет коллекцию «музеем нафталина» при каждой встрече.',
           en:'The style icon calls the collection a "mothball museum" every single time they meet.' } },
  { a:'logic9', b:'apothecary_mo', kind:'dislike',
    lore:{ ru:'Слово «примерно» в устах аптекаря звучит для вычислителя как саботаж точности.',
           en:'The word "approximately" from the apothecary sounds like sabotage of precision to the computer.' } },
  { a:'vex', b:'racer_kai', kind:'dislike',
    lore:{ ru:'Механик считает, что она гоняет свой корабль на убой — и каждый раз молча латает то, что она «не заметила».',
           en:'The mechanic thinks she runs her ship into the ground — and silently patches up what she "didn’t notice" every time.' } },
  { a:'archivist', b:'supernova_child', kind:'dislike',
    lore:{ ru:'Хранитель хочет описать её рождение по протоколу — ей неприятно быть строчкой в чужом каталоге.',
           en:'The Keeper wants to document her birth by the book — she hates being a line in someone else’s catalog.' } },

  // ---------- "спящие" межтирные связи (см. комментарий в начале файла) ----------
  { a:'plasma_bartender', b:'intern_beep', kind:'buddy',
    lore:{ ru:'После первой смены Бип приходит в бар отойти — бармен уже знает его заказ.',
           en:'After every first shift, Beep comes to the bar to decompress — the bartender already knows his order.' } },
  { a:'plasma_bartender', b:'trucker_chrome', kind:'buddy',
    lore:{ ru:'Дальнобойщик заходит сюда чаще, чем домой — бармен держит для него табурет.',
           en:'The trucker stops by here more often than home — the bartender keeps a stool for him.' } },
  { a:'plasma_bartender', b:'dj_pulsar', kind:'buddy',
    lore:{ ru:'ДJ сводит сеты прямо за барной стойкой — бармен единственный, кто выносит громкость.',
           en:'The DJ mixes sets right at the bar — the bartender is the only one who can stand the volume.' } },
  { a:'the_waiter', b:'collector_gz', kind:'buddy',
    lore:{ ru:'Один ждёт неизвестно чего, другой коллекционирует три века без спешки — редкое взаимопонимание двух бесконечно терпеливых.',
           en:'One waits for who-knows-what, the other has collected for three centuries without hurry — a rare understanding between two infinitely patient souls.' } },
  { a:'guild_inspector', b:'nebula_chef', kind:'dislike',
    lore:{ ru:'Шеф нарушает кодекс кухонной безопасности с художественным вдохновением — инспектор считает это отягчающим.',
           en:'The chef violates kitchen safety code with artistic inspiration — the inspector considers that an aggravating factor.' } },
  { a:'guild_inspector', b:'trucker_chrome', kind:'dislike',
    lore:{ ru:'Груз дальнобойщика никогда не совпадает с накладной идеально — инспектор находит это подозрительным систематически.',
           en:'The trucker’s cargo never quite matches the manifest — the inspector finds that suspicious, systematically.' } },
  { a:'guild_inspector', b:'twofaced_priestess', kind:'dislike',
    lore:{ ru:'Культ двойного заката не зарегистрирован ни в одном реестре Гильдии — с точки зрения инспектора, это уже нарушение.',
           en:'The double-sunset cult isn’t registered in any Guild ledger — as far as the inspector is concerned, that’s already a violation.' } },
  { a:'tentacloid', b:'janitor', kind:'dislike',
    lore:{ ru:'Эстет считает, что уборщик своим ведром оскорбляет саму идею прекрасного в этих стенах.',
           en:'The aesthete believes the janitor’s bucket insults the very idea of beauty within these walls.' } },
  { a:'tentacloid', b:'intern_beep', kind:'dislike',
    lore:{ ru:'Старание стажёра эстету кажется безвкусным — по его мнению, усердие и элегантность несовместимы.',
           en:'The intern’s eagerness strikes the aesthete as tasteless — in his view, effort and elegance don’t mix.' } },
  { a:'nebula_chef', b:'gourmet_vega', kind:'dislike',
    lore:{ ru:'Один отзыв критика может закрыть ресторан — шеф с тех пор не подпускает дегустатора ближе чем на орбиту.',
           en:'One review from the critic can close a restaurant — the chef has kept him at orbital distance ever since.' } }
];

// общие (не персональные — иначе объём текста x23) фразы-реакции на карточке
// при разворачивании; {name} — имя ДРУГОГО персонажа связи. Тон — от лица
// реагирующего, независимо от конкретной пары.
const RELATION_COMMENTS = {
  friend: { ru:[
    '{name}! Вот это удача — заглянуть сюда в один день.',
    'О, {name} здесь? Мир становится немного лучше.',
    'С {name} тут веселее переносить смены.',
    '{name} — именно тот, ради кого я задержусь подольше.'
  ], en:[
    '{name}! What a stroke of luck, being here the same day.',
    'Oh, {name} is here? The world just got a little better.',
    'Shifts are easier to bear with {name} around.',
    '{name} — exactly the reason I might stick around a while longer.'
  ]},
  enemy: { ru:[
    'Опять {name}. Может, не в этот раз?',
    '{name} здесь? Тогда я ухожу первым.',
    'Каждая встреча с {name} стоит мне нервов.',
    '{name}. Даже имя произносить неприятно.'
  ], en:[
    '{name}, again. Maybe not this time?',
    '{name} is here? Then I’m leaving first.',
    'Every run-in with {name} costs me nerves.',
    '{name}. Even the name is unpleasant to say.'
  ]},
  buddy: { ru:[
    '{name} тоже тут? Отличный будет вечер.',
    'С {name} всегда найдётся, что обсудить за стойкой.',
    '{name}! Сколько не виделись — по местным меркам.',
    'Если тут {name} — я не откажусь задержаться.'
  ], en:[
    '{name} is here too? This’ll be a good evening.',
    'There’s always something to talk about with {name} over a drink.',
    '{name}! Been a while — by local standards.',
    'If {name}’s around, I might just stick around too.'
  ]},
  dislike: { ru:[
    '{name}. Ну ладно, переживу как-нибудь.',
    'Не то чтобы я рад видеть {name} здесь.',
    '{name} снова путается под ногами.',
    'Со мной и {name} в одной лавке — тесновато.'
  ], en:[
    '{name}. Fine, I’ll survive somehow.',
    'Not that I’m thrilled {name} is here.',
    '{name}, getting underfoot again.',
    'It gets a little crowded with {name} in the same shop.'
  ]}
};

// фразы отказа "обиженного" НПС — вместо старта заказа (см. game.js)
const RELATION_REFUSE_PHRASES = { ru:[
  'Обиделся. Не сегодня.',
  'Не в настроении — выбери кого-то другого.',
  'После всего? Нет. Не сейчас.',
  'Сегодня — точно не со мной.'
], en:[
  'Offended. Not today.',
  'Not in the mood — pick someone else.',
  'After everything? No. Not now.',
  'Today — definitely not with me.'
]};

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
  pete: [
    { ru:'Раньше я подписывал накладные на весь этот док. Теперь подписываю только счета в баре.', en:'I used to sign the manifests for this whole dock. Now I only sign bar tabs.' },
    { ru:'Говорят, у меня дрожат руки. А по-моему, это станция качается.', en:'They say my hands shake. I say it’s the station swaying.' },
    { ru:'Цвет я уже путаю, форму — тоже. А вот уровень в стакане чувствую спинным мозгом.', en:'I mix up colors now, shapes too. But the level in the glass I feel in my spine.' },
    { ru:'Один умный доктор сказал: «Пит, ещё стакан — и всё». Это было двести стаканов назад.', en:'A clever doctor once said: "Pete, one more glass and that’s it." That was two hundred glasses ago.' },
    { ru:'Чем крепче смесь, тем меньше я помню. Иногда это ровно то, что нужно.', en:'The stronger the mix, the less I remember. Sometimes that’s exactly the point.' },
    { ru:'У меня была семья. Где-то на третьем кольце. Или на четвёртом. Налей — вспомню.', en:'I had a family. Somewhere on the third ring. Or the fourth. Pour me one — I’ll remember.' },
    { ru:'Ты единственный, кто наливает мне ровно столько, сколько прошу. Не больше, не меньше. Это дороже золота.', en:'You’re the only one who pours me exactly what I ask. No more, no less. That’s worth more than gold.' },
    { ru:'Когда меня не станет — налей один стакан и поставь на стойку. До нужного уровня. Я узнаю.', en:'When I’m gone, pour one glass and set it on the bar. To the right level. I’ll know.' }
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
  marketer: [
    { ru:'Мой спутник вещал на весь сектор. Потом сектор опустел. Я всё ещё в эфире.', en:'My satellite broadcast to the whole sector. Then the sector emptied. I’m still on air.' },
    { ru:'Половина ручек на моём пульте — муляжи. Так делали дешевле. Так вышло честнее, чем я думал.', en:'Half the knobs on my panel are dummies. It was cheaper that way. It turned out more honest than I expected.' },
    { ru:'Я до сих пор верю в «уникальное предложение». Кто-то же должен.', en:'I still believe in the "unique offer". Somebody has to.' },
    { ru:'Когда-то у меня была аудитория в миллиард. Теперь есть ты. Разница меньше, чем кажется.', en:'I once had a billion-strong audience. Now I have you. The difference is smaller than it seems.' },
    { ru:'Реклама — это обещание. Я разучился давать другие обещания. Только акции.', en:'Advertising is a promise. I’ve forgotten how to make other kinds. Only deals.' },
    { ru:'Газета за панелью — вчерашняя. И позавчерашняя. Даты я перестал печатать давно.', en:'The newspaper behind the panel is yesterday’s. And the day before’s. I stopped printing dates long ago.' },
    { ru:'Ты единственный, кто нашёл рабочую ручку и не выругался. За это — скидка. Навсегда.', en:'You’re the only one who found the working knob and didn’t curse. For that — a discount. Forever.' },
    { ru:'Когда спутник погаснет, последним отключится рекламный экран. Пусть светит кому-нибудь ещё.', en:'When the satellite goes dark, the ad screen will be the last to shut off. Let it shine for someone else.' }
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
  engineer: [
    { ru:'Навигатор ведёт корабль, но курс держат мои руки. Об этом в судовом журнале ни строчки.', en:'The navigator flies the ship, but my hands hold the course. Not a line about it in the log.' },
    { ru:'Я не верю глазам — я верю стрелке в зелёном. Глаза врали дважды. Стрелка — ни разу.', en:'I don’t trust my eyes — I trust the needle in the green. Eyes lied twice. The needle, never.' },
    { ru:'Однажды я нажал «стоп» на полсекунды позже. Мы вышли из прыжка у чужой звезды. Красивой, но чужой.', en:'Once I hit STOP half a second late. We dropped out of the jump by a stranger’s star. Beautiful, but a stranger’s.' },
    { ru:'Меня учили: зелёное — жизнь, красное — конец. С тех пор я вижу мир в этих двух цветах.', en:'I was taught: green is life, red is the end. I’ve seen the world in those two colors ever since.' },
    { ru:'Смесь для юстировки я беру только у тебя. У других стрелка «плавает». У тебя — стоит как вкопанная.', en:'I buy my alignment mixture only from you. With others the needle "floats". With you it stands rock-still.' },
    { ru:'Навигатор ни разу не сказал мне «спасибо». Но перед каждым прыжком смотрит на мои шкалы. Это и есть «спасибо».', en:'The navigator has never once said "thank you". But before every jump he looks at my scales. That is the "thank you".' },
    { ru:'В отпуске я не знаю, куда деть руки. Они всё тянутся к несуществующей кнопке «стоп».', en:'On leave I don’t know what to do with my hands. They keep reaching for a STOP button that isn’t there.' },
    { ru:'Когда выйду в отставку — попрошу тебя сделать смесь ровно того зелёного. Хочу видеть его на полке. Всегда.', en:'When I retire, I’ll ask you to mix that exact green. I want it on my shelf. Always.' }
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
  catlady: [
    { ru:'У меня было имя до котов. Теперь я и сама зову себя Муррой. Так короче и им понятнее.', en:'I had a name before the cats. Now even I call myself Murr. It’s shorter, and they understand it better.' },
    { ru:'Девять их или девяносто — не считала. Считать котов дурная примета: один всегда прячется.', en:'Nine or ninety — I never counted. Counting cats is bad luck: one is always hiding.' },
    { ru:'Лапы лезут на прилавок не из вредности. Им просто интересно, что ты там варишь. Мне тоже.', en:'The paws climb the counter not from spite. They’re just curious what you’re brewing. So am I.' },
    { ru:'Мой самый старый кот помнит прежнего хозяина этой лавки. Иногда мяукает на пустой угол.', en:'My oldest cat remembers this shop’s previous owner. Sometimes he meows at an empty corner.' },
    { ru:'Клубок ниток чинит всё: носок, нервы, смесь. Дам тебе один, если заслужишь.', en:'A ball of yarn mends everything: a sock, the nerves, a mixture. I’ll give you one if you earn it.' },
    { ru:'Люди на станции меня сторонятся. А коты — нет. Коты знают, кому можно доверять.', en:'People on the station keep their distance. The cats don’t. Cats know who can be trusted.' },
    { ru:'Не жалей, что лапы мешают. Однажды именно они не дадут тебе руке дрогнуть в нужный миг.', en:'Don’t resent the paws for getting in the way. One day they’ll be the very thing that steadies your hand.' },
    { ru:'Когда меня не станет, коты придут к тебе. Всех прокорми. Они уже привыкли к твоему прилавку.', en:'When I’m gone, the cats will come to you. Feed them all. They’ve grown used to your counter.' }
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
    { id:'p1', scope:'npc', icon:'📦', fx:{progress:0.12},
      name:{ ru:'Оптовый контракт', en:'Bulk contract' }, desc:{ ru:'+12% прогресса в заданиях дрона', en:'+12% progress on the drone’s orders' } },
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
    { id:'p1', scope:'global', icon:'⭐', fx:{tips:0.08},
      name:{ ru:'Рекомендация гида', en:'A guidebook mention' }, desc:{ ru:'+8% чаевых в конце цикла', en:'+8% tips at the cycle’s end' } },
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
    { id:'p1', scope:'global', icon:'🧮', fx:{speedCap:0.05},
      name:{ ru:'ПРЕМИЯ ЗА ТОЧНОСТЬ', en:'PRECISION BONUS' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p2', scope:'global', icon:'⏲', fx:{craftTime:0.05},
      name:{ ru:'ОПТИМИЗАЦИЯ ТАКТА', en:'CLOCK OPTIMIZATION' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'📊', fx:{memTime:0.2},
      name:{ ru:'РАСШИРЕННЫЙ БУФЕР', en:'EXTENDED BUFFER' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'⚡', fx:{speedCap:0.05},
      name:{ ru:'ПАРАЛЛЕЛЬНЫЙ ПОТОК', en:'PARALLEL THREAD' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p5', scope:'global', icon:'🔋', fx:{chargeAt2:true},
      name:{ ru:'СЧЁТЧИК ИДЕАЛОВ: −1', en:'PERFECT COUNTER: −1' }, desc:{ ru:'УНИКАЛЬНО: доп. заряд умения за 2 идеала вместо 3 (во всех заданиях)', en:'UNIQUE: bonus skill charge every 2 perfects instead of 3 (all orders)' } }
  ],
  last_of_ir: [
    { id:'p1', scope:'global', icon:'🌅', fx:{rep:0.08},
      name:{ ru:'Дар угасающих', en:'Gift of the fading' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
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
    { id:'p1', scope:'npc', icon:'💰', fx:{craftTime:0.12},
      name:{ ru:'Процент с банкета', en:'A cut of the banquet' }, desc:{ ru:'+12% времени на воссоздание в заданиях шефа', en:'+12% craft time on the chef’s orders' } },
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
    { id:'p1', scope:'npc', icon:'🙏', fx:{memTime:0.15},
      name:{ ru:'Подношение храма', en:'The temple’s offering' }, desc:{ ru:'+15% времени на запоминание в заданиях жрицы', en:'+15% memorize time on the priestess’s orders' } },
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
    { id:'p1', scope:'global', icon:'🍹', fx:{tips:0.08},
      name:{ ru:'За счёт заведения', en:'On the house' }, desc:{ ru:'+8% чаевых в конце цикла', en:'+8% tips at the cycle’s end' } },
    { id:'p2', scope:'global', icon:'🎵', fx:{speedCap:0.05},
      name:{ ru:'Чувство ритма', en:'A sense of rhythm' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p3', scope:'npc', icon:'🕺', fx:{memTime:0.2},
      name:{ ru:'Замедленный бит', en:'A slowed-down beat' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'🎧', fx:{craftTime:0.05},
      name:{ ru:'Фоновый грув', en:'Background groove' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p5', scope:'npc', icon:'⚡', fx:{score:0.2, speedCap:0.15},
      name:{ ru:'Хэдлайнер вечера', en:'Headliner of the night' }, desc:{ ru:'+20% очков и +15 п.п. к бонусу скорости в его заданиях', en:'+20% score and +15 pts to the speed bonus cap on his orders' } }
  ],
  pete: [
    { id:'p1', scope:'npc', icon:'🍺', fx:{craftTime:0.12},
      name:{ ru:'Постоянный клиент', en:'A loyal patron' }, desc:{ ru:'+12% времени на воссоздание в заданиях Пита', en:'+12% craft time on Pete’s orders' } },
    { id:'p2', scope:'global', icon:'🍶', fx:{craftTime:0.05},
      name:{ ru:'Твёрдая рука наливалы', en:'A steady pouring hand' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'👁', fx:{memTime:0.2},
      name:{ ru:'На глаз до капли', en:'Eyeballed to the drop' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'🍻', fx:{rep:0.08},
      name:{ ru:'Душа компании', en:'Life of the party' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🥃', fx:{score:0.2, speedCap:0.15},
      name:{ ru:'На посошок', en:'One for the road' }, desc:{ ru:'+20% очков и +15 п.п. к бонусу скорости в его заданиях', en:'+20% score and +15 pts to the speed bonus cap on his orders' } }
  ],
  janitor: [
    { id:'p1', scope:'npc', icon:'🪙', fx:{craftTime:0.12},
      name:{ ru:'Премия из тумбочки', en:'A bonus from the drawer' }, desc:{ ru:'+12% времени на воссоздание в заданиях уборщика', en:'+12% craft time on the janitor’s orders' } },
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
    { id:'p1', scope:'npc', icon:'🍬', fx:{memTime:0.15},
      name:{ ru:'Сэкономил на обеде', en:'Saved his lunch money' }, desc:{ ru:'+15% времени на запоминание в заданиях стажёра', en:'+15% memorize time on the intern’s orders' } },
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
    { id:'p1', scope:'global', icon:'💵', fx:{speedCap:0.05},
      name:{ ru:'Оплата наличными', en:'Cash payment' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
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
    { id:'p1', scope:'global', icon:'💳', fx:{rep:0.08},
      name:{ ru:'Платит не глядя', en:'Pays without looking' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
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
    { id:'p1', scope:'npc', icon:'💰', fx:{progress:0.12},
      name:{ ru:'Цена коллекционера', en:'A collector’s price' }, desc:{ ru:'+12% прогресса в заданиях коллекционера', en:'+12% progress on the collector’s orders' } },
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
    { id:'p1', scope:'global', icon:'🎟', fx:{speedCap:0.05},
      name:{ ru:'Гонорар за сет', en:'Set fee' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p2', scope:'global', icon:'🎚', fx:{speedCap:0.05},
      name:{ ru:'Держать темп', en:'Keep the tempo' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p3', scope:'npc', icon:'🎛', fx:{craftTime:0.15},
      name:{ ru:'Затянутый переход', en:'An extended blend' }, desc:{ ru:'+15% времени на воссоздание в его заданиях', en:'+15% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'📢', fx:{rep:0.08},
      name:{ ru:'Шаутаут со сцены', en:'A shout-out from the stage' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'💿', fx:{score:0.2, speedCap:0.15},
      name:{ ru:'Пиковый час', en:'Peak hour' }, desc:{ ru:'+20% очков и +15 п.п. к бонусу скорости в его заданиях', en:'+20% score and +15 pts to the speed bonus cap on his orders' } }
  ],
  marketer: [
    { id:'p1', scope:'global', icon:'📺', fx:{tips:0.08},
      name:{ ru:'Рекламный бюджет', en:'The ad budget' }, desc:{ ru:'+8% чаевых в конце цикла', en:'+8% tips at the cycle’s end' } },
    { id:'p2', scope:'global', icon:'🔎', fx:{craftTime:0.06},
      name:{ ru:'Глаз на рабочие ручки', en:'An eye for working knobs' }, desc:{ ru:'+6% времени на воссоздание во всех заданиях', en:'+6% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'🕰', fx:{craftTime:0.2},
      name:{ ru:'Продлённый эфир', en:'Extended airtime' }, desc:{ ru:'+20% времени на воссоздание в его заданиях', en:'+20% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'📢', fx:{rep:0.08},
      name:{ ru:'Вирусный охват', en:'Viral reach' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'global', icon:'💵', fx:{tipsFlat:150},
      name:{ ru:'Прямая рекламная выручка', en:'Direct ad revenue' }, desc:{ ru:'УНИКАЛЬНО: +150 чаевых в конце каждого цикла (сверх процента)', en:'UNIQUE: +150 tips at the end of every cycle (on top of the %)' } }
  ],
  perfumer: [
    { id:'p1', scope:'npc', icon:'💎', fx:{memTime:0.15},
      name:{ ru:'Плата за нюанс', en:'The price of nuance' }, desc:{ ru:'+15% времени на запоминание в заданиях парфюмера', en:'+15% memorize time on the perfumer’s orders' } },
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
    { id:'p1', scope:'global', icon:'🏛', fx:{rep:0.08},
      name:{ ru:'Гильдейская ставка', en:'The Guild rate' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
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
    { id:'p1', scope:'npc', icon:'💊', fx:{craftTime:0.12},
      name:{ ru:'Аптечная наценка', en:'The pharmacy markup' }, desc:{ ru:'+12% времени на воссоздание в заданиях аптекаря', en:'+12% craft time on the apothecary’s orders' } },
    { id:'p2', scope:'global', icon:'🧘', fx:{craftTime:0.05},
      name:{ ru:'Твёрдая рука', en:'A steady hand' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'📖', fx:{memTime:0.2},
      name:{ ru:'Рецепт наизусть', en:'The prescription by heart' }, desc:{ ru:'+20% времени на запоминание в его заданиях', en:'+20% memorize time on his orders' } },
    { id:'p4', scope:'global', icon:'❤️', fx:{rep:0.08},
      name:{ ru:'Благодарные пациенты', en:'Grateful patients' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'⚗️', fx:{score:0.2, progress:0.2},
      name:{ ru:'Горькое чудо', en:'The bitter miracle' }, desc:{ ru:'+20% очков и +20% прогресса в его заданиях', en:'+20% score and +20% progress on his orders' } }
  ],
  engineer: [
    { id:'p1', scope:'global', icon:'🛰️', fx:{speedCap:0.05},
      name:{ ru:'Флотский подряд', en:'A fleet contract' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p2', scope:'global', icon:'🎯', fx:{speedCap:0.06},
      name:{ ru:'Намётанный глаз', en:'A trained eye' }, desc:{ ru:'+6 п.п. к потолку бонуса скорости во всех заданиях', en:'+6 pts to the speed bonus cap on all orders' } },
    { id:'p3', scope:'npc', icon:'🕹', fx:{craftTime:0.18},
      name:{ ru:'Медленный ход стрелки', en:'A slow needle sweep' }, desc:{ ru:'+18% времени на воссоздание в его заданиях', en:'+18% craft time on his orders' } },
    { id:'p4', scope:'global', icon:'📡', fx:{rep:0.08},
      name:{ ru:'Слово навигатора', en:'The navigator’s word' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🟢', fx:{score:0.25, craftTime:0.1},
      name:{ ru:'Стрелка сама в зелёном', en:'The needle finds the green' }, desc:{ ru:'+10% времени и +25% очков в его заданиях', en:'+10% time and +25% score on his orders' } }
  ],
  swarm_navigator: [
    { id:'p1', scope:'npc', icon:'🍯', fx:{progress:0.12},
      name:{ ru:'Доля улья', en:'The hive’s share' }, desc:{ ru:'+12% прогресса в заданиях Роя', en:'+12% progress on the Swarm’s orders' } },
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
    { id:'p1', scope:'npc', icon:'🩺', fx:{craftTime:0.12},
      name:{ ru:'Хирургический тариф', en:'The surgical rate' }, desc:{ ru:'+12% времени на воссоздание в заданиях Векса', en:'+12% craft time on Vex’s orders' } },
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
    { id:'p1', scope:'global', icon:'🏆', fx:{speedCap:0.05},
      name:{ ru:'Призовые за этап', en:'Stage prize money' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p2', scope:'global', icon:'⚡', fx:{speedCap:0.05},
      name:{ ru:'Рефлексы пилота', en:'A pilot’s reflexes' }, desc:{ ru:'+5 п.п. к потолку бонуса скорости во всех заданиях', en:'+5 pts to the speed bonus cap on all orders' } },
    { id:'p3', scope:'npc', icon:'🔧', fx:{craftTime:0.15},
      name:{ ru:'Техпауза в боксах', en:'A technical pause in the pits' }, desc:{ ru:'+15% времени на воссоздание в её заданиях', en:'+15% craft time on her orders' } },
    { id:'p4', scope:'global', icon:'📣', fx:{rep:0.08},
      name:{ ru:'Интервью после финиша', en:'The post-race interview' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'🏁', fx:{score:0.25, craftTime:-0.12},
      name:{ ru:'Финальный круг', en:'The final lap' }, desc:{ ru:'−12% времени, но +25% очков в её заданиях', en:'−12% time but +25% score on her orders' } }
  ],
  catlady: [
    { id:'p1', scope:'npc', icon:'🐈', fx:{score:0.15},
      name:{ ru:'Гостинец от бабушки', en:'A treat from granny' }, desc:{ ru:'+15% очков за задания Бабушки Мурры', en:'+15% score on Grandma Murr’s orders' } },
    { id:'p2', scope:'global', icon:'🧶', fx:{craftTime:0.05},
      name:{ ru:'Тёплые варежки', en:'Warm mittens' }, desc:{ ru:'+5% времени на воссоздание во всех заданиях', en:'+5% craft time on all orders' } },
    { id:'p3', scope:'npc', icon:'🐾', fx:{craftTime:0.18},
      name:{ ru:'Коты не торопятся', en:'Cats are never in a hurry' }, desc:{ ru:'+18% времени на воссоздание в её заданиях', en:'+18% craft time on her orders' } },
    { id:'p4', scope:'global', icon:'😽', fx:{rep:0.08},
      name:{ ru:'Знакома со всеми', en:'She knows everyone' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
    { id:'p5', scope:'npc', icon:'😻', fx:{score:0.25, memTime:0.15},
      name:{ ru:'Мурлыканье под руку', en:'A purr at your elbow' }, desc:{ ru:'+15% времени на запоминание и +25% очков в её заданиях', en:'+15% memorize time and +25% score on her orders' } }
  ],
  archivist: [
    { id:'p1', scope:'npc', icon:'🖋', fx:{memTime:0.15},
      name:{ ru:'Гонорар летописца', en:'The chronicler’s fee' }, desc:{ ru:'+15% времени на запоминание в заданиях Хранителя', en:'+15% memorize time on the Keeper’s orders' } },
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
    { id:'p1', scope:'global', icon:'🪙', fx:{rep:0.08},
      name:{ ru:'Монеты из ниоткуда', en:'Coins from nowhere' }, desc:{ ru:'+8% к приросту репутации у всех', en:'+8% reputation gain with everyone' } },
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
