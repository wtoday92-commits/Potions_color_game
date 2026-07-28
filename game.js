/* ============================================================
   ЗЕЛЬЕВАРНЯ — game.js
   ЛОГИКА ИГРЫ. Контент (НПС, фразы, формы) — в content.js.
   Этот файл при добавлении контента трогать не нужно.
   ============================================================ */

(function(){
  const $ = id => document.getElementById(id);
  const SVGNS = 'http://www.w3.org/2000/svg';

  // ---------- локализация (Фаза B) ----------
  const LANG_KEY = 'potionshop_lang';
  let LANG = localStorage.getItem(LANG_KEY) || (typeof CONFIG !== 'undefined' && CONFIG.DEFAULT_LANG) || 'ru';

  // ---------- сложность регуляторов (Фаза C, выбор — Фаза D) ----------
  // 1 = только цвет; 2 = цвет+оттенок+размер банки; 3 = всё как раньше.
  // С Фазы D это больше не глобальная настройка в шапке — игрок выбирает
  // уровень под каждый конкретный заказ, кликая одну из трёх плашек,
  // которые выезжают из-под иконки НПС (см. renderCustomerCards/startOrder).

  // достаёт нужный язык из объекта {ru:..., en:...}; голые строки/массивы
  // (старый формат, например у пользовательских EXTRA_NPCS без перевода)
  // проходят насквозь без изменений
  function LT(val){
    if(val && typeof val === 'object' && !Array.isArray(val) && (val.ru !== undefined || val.en !== undefined)){
      const v = val[LANG];
      return v !== undefined ? v : (val.ru !== undefined ? val.ru : val.en);
    }
    return val;
  }
  // выбирает случайный элемент из {ru:[...], en:[...]}, сохраняя ОБА варианта
  // (индекс общий), чтобы при смене языка на экране заказа фраза не менялась
  // на случайную другую — просто переводилась
  function pickLocalized(src){
    if(src && typeof src === 'object' && !Array.isArray(src) && (src.ru || src.en)){
      const ru = src.ru || src.en, en = src.en || src.ru;
      const idx = randInt(0, Math.max(ru.length, en.length) - 1);
      return { ru: ru[Math.min(idx, ru.length-1)], en: en[Math.min(idx, en.length-1)] };
    }
    return pick(src); // старый формат — голый массив строк
  }
  function applyI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(typeof UI_TEXT !== 'undefined' && UI_TEXT[key] !== undefined) el.textContent = LT(UI_TEXT[key]);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el=>{
      const key = el.getAttribute('data-i18n-html');
      if(typeof UI_TEXT !== 'undefined' && UI_TEXT[key] !== undefined) el.innerHTML = LT(UI_TEXT[key]);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      if(typeof UI_TEXT !== 'undefined' && UI_TEXT[key] !== undefined) el.placeholder = LT(UI_TEXT[key]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el=>{
      const key = el.getAttribute('data-i18n-title');
      if(typeof UI_TEXT !== 'undefined' && UI_TEXT[key] !== undefined) el.title = LT(UI_TEXT[key]);
    });
    const langBtn = $('langBtn');
    if(langBtn) langBtn.textContent = LANG === 'ru' ? 'EN' : 'RU';
    document.documentElement.lang = LANG;
  }

  // ---------- ZzFX micro sound engine (public domain, zzfx.3d2k.com) ----------
  let zzfxV=.3, zzfxX;
  function zzfxEnsureCtx(){ if(!zzfxX){ try{ zzfxX = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } }
  function zzfx(...t){
    if(!zzfxX) return;
    let [q=1,k=.05,c=220,e=0,t2=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0]=t;
    let b=2*Math.PI,H=v*=500*b/zzfxX.sampleRate**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxX.sampleRate,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;
    e=99+zzfxX.sampleRate*e;m*=zzfxX.sampleRate;t2*=zzfxX.sampleRate;u*=zzfxX.sampleRate;d*=zzfxX.sampleRate;z*=500*b/zzfxX.sampleRate**3;x*=b/zzfxX.sampleRate;w*=b/zzfxX.sampleRate;A*=zzfxX.sampleRate;l=zzfxX.sampleRate*l|0;
    for(h=e+m+t2+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t2?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);
    p=zzfxX.createBuffer(1,h,zzfxX.sampleRate);p.getChannelData(0).set(Z);c=zzfxX.createBufferSource();c.buffer=p;c.connect(zzfxX.destination);c.start();
  }
  const SFX = {
    tick:      ()=>zzfx(.15,.05,900,.005,.005,.008,0,2,0,0,0,0,0,0,0,0,0,.6,.002),
    uiClick:   ()=>zzfx(.2,.05,520,.005,.01,.03,0,1.6,0,0,0,0,0,0,0,0,0,.7,.005),
    cardPick:  ()=>zzfx(.3,.05,340,.01,.04,.09,0,1.4,0,20,0,0,0,0,0,0,0,.7,.01),
    brew:      ()=>zzfx(.4,.05,160,.02,.08,.18,0,1.2,0,-30,0,0,0,0,0,0,0,.8,.03),
    orderShow: ()=>zzfx(.3,.05,440,.01,.06,.12,0,1.5,0,60,150,.06,0,0,0,0,0,.7,.02),
    countdown: ()=>zzfx(.45,.05,660,.005,.02,.06,0,2,0,0,0,0,0,0,0,0,0,.6,.01),
    perfect:   ()=>zzfx(.7,.05,520,.02,.2,.3,0,1.3,0,0,260,.08,.05,0,0,0,0,.8,.08),
    good:      ()=>zzfx(.55,.05,420,.02,.12,.22,0,1.4,0,0,130,.07,0,0,0,0,0,.75,.05),
    bad:       ()=>zzfx(.55,.05,220,.03,.15,.35,1,1.6,0,0,-60,.1,0,0,0,0,0,.8,.1),
    weekEnd:   ()=>zzfx(.6,.05,392,.03,.25,.4,0,1.2,0,0,196,.12,.08,0,0,0,0,.85,.12),
    // Фаза H: получение ачивки
    achieve:   ()=>zzfx(.55,.05,500,.02,.16,.24,0,1.4,0,40,220,.09,.04,0,0,0,0,.8,.06),
    dock:      ()=>zzfx(.5,.05,180,.02,.1,.22,0,1.3,0,-40,80,.05,0,0,0,0,0,.8,.02),
    // Фаза E: "плохие" пузыри — badClear звучит, когда игрок успел убрать
    // пузырь кликом; badPop — когда пузырь лопнул сам и сбил регулятор
    badClear:  ()=>zzfx(.35,.05,700,.005,.03,.05,0,1.8,0,10,80,.03,0,0,0,0,0,.7,.01),
    badPop:    ()=>zzfx(.5,.2,140,.01,.05,.12,2,1.8,0,-10,-200,.15,0,0,0,0,0,.7,.02),
    // Фаза 10 (Бабушка Мурра): мягкий «шлепок» лапы по клику + возмущённое «мяу»
    // (2 варианта, выбирается случайно — восходящий тон с завалом вниз, как у кошки)
    pawClick:  ()=>zzfx(.4,.05,300,.005,.03,.06,0,1.3,-3,0,0,0,0,.25,0,0,0,.6,.01),
    meow:      ()=>{ const V=[[.55,.05,560,.03,.14,.18,0,1.1,9,-7,0,0,0,0,0,0,0,.55,.06],
                              [.5,.05,690,.03,.12,.16,0,1.2,7,-9,0,0,0,0,0,0,0,.5,.05]];
                     zzfx(...V[Math.floor(Math.random()*V.length)]); }
  };
  window.addEventListener('pointerdown', zzfxEnsureCtx, {once:true});

  function mulberry32(a){
    return function(){
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a>>>15, 1 | a);
      t = t + Math.imul(t ^ t>>>7, 61 | t) ^ t;
      return ((t ^ t>>>14) >>> 0) / 4294967296;
    };
  }
  function rand(min,max){ return Math.random()*(max-min)+min; }
  function randInt(min,max){ return Math.floor(rand(min,max+1)); }
  function pick(arr){ return arr[randInt(0,arr.length-1)]; }
  // взвешенный выбор из массива [{w, ...}] — возвращает выбранный элемент целиком
  function weightedPick(items){
    let total = 0; for(const it of items) total += (it.w > 0 ? it.w : 0);
    if(total <= 0) return pick(items);
    let r = Math.random() * total;
    for(const it of items){ r -= (it.w > 0 ? it.w : 0); if(r <= 0) return it; }
    return items[items.length - 1];
  }
  function shuffleArr(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  // avatar/sticker renderer: file path -> <img>, otherwise emoji text
  // (an array means "variants" — a random one is picked)
  function visualHTML(val, cls){
    if(Array.isArray(val)) val = pick(val);
    if(typeof val === 'string' && /\.(png|jpe?g|gif|webp|svg)$/i.test(val)){
      return `<img class="${cls||''}" src="${val}" alt="">`;
    }
    return val;
  }

  // ---------- custom vertical slider ----------
  const RAINBOW_BG = "linear-gradient(to top, hsl(0,70%,50%), hsl(60,70%,50%), hsl(120,70%,50%), hsl(180,70%,50%), hsl(240,70%,50%), hsl(300,70%,50%), hsl(360,70%,50%))";

  function VSlider({mount, min, max, step=1, value, height=260, thickness=26, thumbSize=32, colorStrip=false, staticBackground=null, onChange}){
    const wrap = document.createElement('div');
    wrap.className = 'vslide-wrap';
    wrap.style.height = (height+thumbSize)+'px';
    wrap.style.width = Math.max(thickness, thumbSize)+'px';

    const track = document.createElement('div');
    track.className = 'vslide-track ' + (colorStrip ? 'colorstrip' : 'plain');
    track.style.width = thickness+'px';
    track.style.height = height+'px';
    track.style.top = (thumbSize/2)+'px';
    if(!colorStrip) track.style.borderRadius = (thickness/2)+'px';
    if(staticBackground) track.style.background = staticBackground;

    const thumb = document.createElement('div');
    thumb.className = 'vslide-thumb';
    thumb.style.width = thumbSize+'px';
    thumb.style.height = thumbSize+'px';

    wrap.appendChild(track);
    wrap.appendChild(thumb);
    mount.innerHTML = '';
    mount.appendChild(wrap);

    let _min=min, _max=max, _step=step, _value=value;

    function render(){
      const p = (_value-_min)/((_max-_min)||1);
      thumb.style.bottom = `${(p*height).toFixed(2)}px`;
    }
    function setFromClientY(clientY){
      const rect = track.getBoundingClientRect();
      let p = 1 - (clientY - rect.top)/rect.height;
      p = Math.min(1, Math.max(0, p));
      let raw = _min + p*(_max-_min);
      raw = Math.round(raw/_step)*_step;
      raw = Math.min(_max, Math.max(_min, raw));
      if(raw !== _value){
        const prev = _value;
        _value = raw; render(); SFX.tick();
        // onChange получает и старое значение — нужно механикам патча
        // (рынок времени / "сломанные" регуляторы Того-Кто-Ждёт)
        if(onChange) onChange(_value, prev);
      }
    }
    let dragging = false;
    // Фаза 8 (Гонщица УР.4): инерция «колёс» — при быстром движении ползунок
    // проскакивает по инерции, точно остановить сложнее. По умолчанию выключена;
    // setInertia(true) включает её (у Гонщицы на УР.4, на всех активных ползунках).
    let _inertia = false, _lastY = 0, _lastT = 0, _vel = 0, _momRaf = null;
    function cancelMomentum(){ if(_momRaf){ cancelAnimationFrame(_momRaf); _momRaf = null; } }
    function startMomentum(){
      cancelMomentum();
      const valuePerPx = (_max - _min) / (height || 1);
      let velVal = -_vel * valuePerPx;          // px/мс → значение/мс (движение вверх = +значение)
      if(Math.abs(velVal) < 0.0015) return;      // медленное движение — без «проскока»
      let pos = _value, lastT = performance.now();
      const tick = ()=>{
        const now = performance.now(); const dt = Math.min(48, now - lastT); lastT = now;
        pos += velVal * dt;
        velVal *= Math.pow(0.86, dt / 16);        // трение
        if(pos <= _min){ pos = _min; velVal = 0; }
        if(pos >= _max){ pos = _max; velVal = 0; }
        const snapped = Math.min(_max, Math.max(_min, Math.round(pos / _step) * _step));
        if(snapped !== _value){ const prev = _value; _value = snapped; render(); SFX.tick(); if(onChange) onChange(_value, prev); }
        if(Math.abs(velVal) > 0.0012 && pos > _min && pos < _max) _momRaf = requestAnimationFrame(tick);
        else _momRaf = null;
      };
      _momRaf = requestAnimationFrame(tick);
    }
    wrap.addEventListener('pointerdown', e=>{
      if(wrap.classList.contains('disabled')) return;
      cancelMomentum();
      dragging = true; _vel = 0; _lastY = e.clientY; _lastT = performance.now();
      try{ wrap.setPointerCapture(e.pointerId); }catch(err){}
      setFromClientY(e.clientY);
      e.preventDefault();
    });
    wrap.addEventListener('pointermove', e=>{
      if(!dragging) return;
      if(_inertia){
        const now = performance.now(), dt = now - _lastT;
        if(dt > 0){ _vel = (e.clientY - _lastY) / dt; _lastY = e.clientY; _lastT = now; }
      }
      setFromClientY(e.clientY);
    });
    window.addEventListener('pointerup', ()=>{ if(dragging){ dragging = false; if(_inertia) startMomentum(); } });
    render();

    return {
      get value(){ return _value; },
      set value(v){ _value=v; render(); },
      // Фаза E: границы нужны, чтобы "плохой" пузырь, сбивая регулятор,
      // не вытолкнул значение за пределы допустимого диапазона
      get min(){ return _min; },
      get max(){ return _max; },
      get step(){ return _step; },
      configure({min,max,step,value}){ _min=min; _max=max; _step=step||1; _value=value; render(); },
      setDisabled(d){ wrap.classList.toggle('disabled', !!d); if(d) cancelMomentum(); },
      // Фаза 8 (Гонщица УР.4): вкл/выкл инерцию «колёс»
      setInertia(on){ _inertia = !!on; if(!on) cancelMomentum(); },
      // отдельный "серый и перечёркнутый" вид для регулятора, недоступного
      // на текущей сложности (отличается от .disabled — блокировки после варки)
      setDiffLocked(d){ wrap.classList.toggle('diff-locked', !!d); },
      // Патч: произвольный CSS-флаг на обёртке ползунка ('ir-gift' — регулятор,
      // выставленный рукой Ир)
      setFlag(cls, on){ wrap.classList.toggle(cls, !!on); },
      setTrackBackground(css){ track.style.background = css; }
    };
  }

  const S = {};
  function initSliders(){
    // все игровые ползунки идут через onSliderInput(key, ...) — единая точка входа
    const oc = key => (v, old) => onSliderInput(key, v, old);
    S.color = VSlider({ mount:$('mColor'), min:0,max:5,step:1,value:2, thickness:32, thumbSize:38, colorStrip:true, staticBackground:RAINBOW_BG, onChange:oc('color') });
    S.colorB = VSlider({ mount:$('mColorB'), min:0,max:5,step:1,value:2, thickness:32, thumbSize:38, colorStrip:true, staticBackground:RAINBOW_BG, onChange:oc('colorB') });
    S.sat = VSlider({ mount:$('mSat'), min:0,max:9,step:1,value:7, thickness:32, thumbSize:38, colorStrip:true, onChange:oc('sat') });
    S.size = VSlider({ mount:$('mSize'), min:0,max:4,step:1,value:2, thickness:26, thumbSize:32, onChange:oc('size') });
    S.count = VSlider({ mount:$('mCount'), min:1,max:5,step:1,value:3, thickness:26, thumbSize:32, onChange:oc('count') });
    // Патч "УР.4" (Двуликая жрица): независимый счётчик для правой половины банки
    S.countB = VSlider({ mount:$('mCountB'), min:1,max:7,step:1,value:3, thickness:26, thumbSize:32, onChange:oc('countB') });
    S.bsize = VSlider({ mount:$('mBsize'), min:0,max:4,step:1,value:2, thickness:26, thumbSize:32, onChange:oc('bsize') });
    S.shape = VSlider({ mount:$('mShape'), min:0,max:9,step:1,value:0, thickness:26, thumbSize:32, onChange:oc('shape') });
    // Патч "УР.4" (Сверхновая): эксклюзивный ползунок — поворот (блик убран)
    S.rotation = VSlider({ mount:$('mRotation'), min:0,max:35,step:1,value:0, thickness:26, thumbSize:32, onChange:oc('rotation') });
    // Патч "УР.4" (Бармен): эксклюзивный ползунок — скорость тряски
    S.speed = VSlider({ mount:$('mSpeed'), min:0,max:10,step:1,value:0, thickness:26, thumbSize:32, onChange:oc('speed') });
    // Патч (Сверхновая): второй ползунок габарита — высота
    S.size2 = VSlider({ mount:$('mSize2'), min:0,max:4,step:1,value:2, thickness:26, thumbSize:32, onChange:oc('size2') });
    // Фаза 10 (Пьяница Пит): «уровень жидкости» (с УР.1) и «градус» (эксклюзив УР.4)
    S.fill = VSlider({ mount:$('mFill'), min:0,max:4,step:1,value:2, thickness:26, thumbSize:32, onChange:oc('fill') });
    S.degree = VSlider({ mount:$('mDegree'), min:0,max:10,step:1,value:0, thickness:26, thumbSize:32, onChange:oc('degree') });
  }
  // ---------- единая точка входа изменений игровых ползунков ----------
  // Патч "УР.4": сюда цепляются механики, которым нужно реагировать на
  // конкретное движение конкретного регулятора (связка/трение/вздрагивание) —
  // остальные (перестановка ролей, "коробка передач") не трогают эту функцию
  // вовсе, они работают на уровне подмены объектов в S{} (см. ниже).
  function onSliderInput(key, v, old){
    if(target && target.regLevel === 4){
      const cfg = target.cfg;
      // Двуликая жрица: лёгкая связка color↔colorB — два спектра, одно целое
      if(cfg.id === 'twofaced_priestess' && (key === 'color' || key === 'colorB')){
        const other = key === 'color' ? 'colorB' : 'color';
        const os = S[other];
        if(os){
          const nudge = Math.round((v-old)*0.3);
          if(nudge) os.value = Math.min(os.max, Math.max(os.min, os.value+nudge));
        }
      }
    }
    updatePlayerJar();
  }

  // (контент вынесен в content.js)


  let score = 0, streak = 0, orderNum = 0, dayNum = 1;
  let stage = 0, perfectStreakAtMax = 0, goodStreakAtMax = 0;
  // Фаза 10 (Пьяница Пит): накопленный за цикл бонус к чаевым за «градус»
  // (добавляется к 5%-чаевым в конце цикла, см. finalizeResult/showWeekOverlay)
  let peteDegreeTipBonus = 0;
  let target = null;
  let rafId = null;
  let craftLocked = false;
  let craftStartTime = 0;
  let ingTimerHandle = null;
  const stickerCounts = { perfect:0, good:0, swill:0, bad:0 };

  let movingBubbles=null, movingGeom=null, movingProfile=null, movingR=0, movingLastT=0, movingRafId=null;

  // ---------- Фаза E: "плохие" пузыри (только уровень сложности 4) ----------
  let badBubbles = [];          // живые пузыри: {id, x, y, born, seed}
  let currentBadBubbles = [];   // то же самое, но с посчитанным на этот кадр r/pct — уходит в drawJar
  let badBubbleRafId = null;
  let badBubbleLastT = 0;
  let badBubbleElapsed = 0;     // время с начала фазы "воссоздай" для этого заказа
  let nextBadBubbleSpawnAt = 0;
  let badBubbleIdSeq = 1;

  function updateStickerTally(){
    // tally always shows the first variant for stability; the result overlay stays random
    const first = v => Array.isArray(v) ? v[0] : v;
    $('stickerTally').innerHTML = `
      <span class="tally-item">${visualHTML(first(STICKERS.perfect),'tally-img')} <b>${stickerCounts.perfect}</b></span>
      <span class="tally-item">${visualHTML(first(STICKERS.good),'tally-img')} <b>${stickerCounts.good}</b></span>
      <span class="tally-item">${visualHTML(first(STICKERS.swill),'tally-img')} <b>${stickerCounts.swill}</b></span>
      <span class="tally-item">${visualHTML(first(STICKERS.bad),'tally-img')} <b>${stickerCounts.bad}</b></span>
    `;
  }

  // ---------- neon ribbon + clock-hand timer ----------
  const RING_R = 224, RING_CX = 230, RING_CY = 230;
  const CIRC = 2*Math.PI*RING_R;
  function initRing(){
    let ticks = '';
    for(let i=0;i<12;i++){
      const a = i/12*Math.PI*2;
      const x1 = RING_CX + Math.cos(a)*(RING_R-10), y1 = RING_CY + Math.sin(a)*(RING_R-10);
      const x2 = RING_CX + Math.cos(a)*(RING_R-2),  y2 = RING_CY + Math.sin(a)*(RING_R-2);
      ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(53,224,255,.35)" stroke-width="2"/>`;
    }
    $('ringSvg').innerHTML = `
      <defs>
        <linearGradient id="neonRib" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#35e0ff"/>
          <stop offset="55%" stop-color="#b866ff"/>
          <stop offset="100%" stop-color="#ff4dd2"/>
        </linearGradient>
      </defs>
      <circle cx="${RING_CX}" cy="${RING_CY}" r="${RING_R}" fill="none" stroke="rgba(53,224,255,.12)" stroke-width="10"/>
      ${ticks}
      <circle id="ringFg" cx="${RING_CX}" cy="${RING_CY}" r="${RING_R}" fill="none"
        stroke="url(#neonRib)" stroke-width="10" stroke-linecap="round"
        stroke-dasharray="${CIRC}" stroke-dashoffset="0"
        transform="rotate(-90 ${RING_CX} ${RING_CY})"/>
      <g id="clockHand">
        <line x1="${RING_CX}" y1="${RING_CY-RING_R+22}" x2="${RING_CX}" y2="${RING_CY-RING_R-4}"
          stroke="#ff4dd2" stroke-width="4" stroke-linecap="round"/>
        <circle cx="${RING_CX}" cy="${RING_CY-RING_R-4}" r="4.5" fill="#ff4dd2"/>
      </g>
    `;
  }
  function setRingFraction(frac){
    const fg = $('ringFg');
    if(fg) fg.setAttribute('stroke-dashoffset', (CIRC*frac).toFixed(2));
    const hand = $('clockHand');
    if(hand){
      const angle = (1-frac)*360;
      hand.setAttribute('transform', `rotate(${angle.toFixed(2)} ${RING_CX} ${RING_CY})`);
    }
    // Патч "УР.4" (Коллекционер): тот же таймер, но линией под сеткой баночек
    const collectorFill = document.getElementById('collectorTimerFill');
    if(collectorFill) collectorFill.style.width = Math.max(0, (1-frac)*100).toFixed(1)+'%';
  }
  let timerDurationMs = 0;
  function runTimer(durationMs, onDone){
    cancelAnimationFrame(rafId);
    const start = performance.now();
    timerDurationMs = durationMs;
    let lastCountdownSec = -1;
    $('windowFrame').classList.remove('urgent');
    function frame(now){
      const durationMs = timerDurationMs;
      const elapsed = now - start;
      const frac = Math.min(1, elapsed/durationMs);
      setRingFraction(frac);
      const remaining = durationMs - elapsed;
      if(remaining <= 3000 && remaining > 0){
        $('windowFrame').classList.add('urgent');
        const sec = Math.ceil(remaining/1000);
        if(sec !== lastCountdownSec){ lastCountdownSec = sec; SFX.countdown(); }
      }
      if(frac >= 1){ $('windowFrame').classList.remove('urgent'); onDone(); return; }
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);
  }

  // ---------- shape-aware packing ----------
  function shapeHalfWidthFrac(yFrac, profile){
    let wf = profile[profile.length-1][1];
    for(let i=0;i<profile.length-1;i++){
      const [t0,wf0]=profile[i], [t1,wf1]=profile[i+1];
      if(yFrac>=t0 && yFrac<=t1){ const f=(yFrac-t0)/((t1-t0)||1); wf = wf0+(wf1-wf0)*f; break; }
    }
    return wf;
  }
  function packBubbles(count, r, w, topY, baseY, profile, seed, halfSide){
    const rng = mulberry32(seed>>>0);
    const cx = 100;
    const yTop = topY+18;
    const bodyH = baseY - yTop;
    const margin = 4;
    const minDist = 2*r + 2.5;
    const yMinAll = yTop + r + margin, yMaxAll = baseY - r - margin;
    // Патч "УР.4" (Двуликая жрица): банка разделена на 2 половины — сгустки
    // каждой стороны упаковываются каждый в своей половине независимо
    const halfGap = 3;

    function xRangeAt(y){
      const yFrac = Math.min(1, Math.max(0, (y-yTop)/bodyH));
      const hw = (w/2)*shapeHalfWidthFrac(yFrac, profile) - r - margin;
      if(hw <= 0) return null;
      // Патч (Двуликая жрица): в тесной банке (маленький объём + крупные
      // сгустки) halfGap+r раньше мог схлопнуть диапазон половины в null —
      // сгусток тогда падал в аварийный фолбэк packBubbles ({x:cx,...}), т.е.
      // ровно на границу, и визуально "заходил" на чужую половину. Теперь
      // диапазон вместо null всегда зажимается, но строго по свою сторону cx.
      if(halfSide === 'left'){
        const lo = cx-hw;
        const hi = Math.min(cx-0.5, Math.max(lo, cx-halfGap-r));
        return [lo, hi];
      }
      if(halfSide === 'right'){
        const hi = cx+hw;
        const lo = Math.max(cx+0.5, Math.min(hi, cx+halfGap+r));
        return [lo, hi];
      }
      return [cx-hw, cx+hw];
    }

    const pts = [];
    for(let i=0;i<count;i++){
      let placed = false;
      for(let t=0;t<300 && !placed;t++){
        const y = yMinAll + rng()*(yMaxAll-yMinAll);
        const xr = xRangeAt(y);
        if(!xr) continue;
        const x = xr[0] + rng()*(xr[1]-xr[0]);
        let ok = true;
        for(const p of pts){ const dx=x-p.x, dy=y-p.y; if(dx*dx+dy*dy < minDist*minDist){ ok=false; break; } }
        if(ok){ pts.push({x,y}); placed=true; }
      }
      if(!placed){
        outer:
        for(let gy=yMinAll; gy<=yMaxAll; gy+=minDist*0.9){
          const xr = xRangeAt(gy);
          if(!xr) continue;
          for(let gx=xr[0]; gx<=xr[1]; gx+=minDist*0.9){
            let ok = true;
            for(const p of pts){ const dx=gx-p.x, dy=gy-p.y; if(dx*dx+dy*dy < minDist*minDist){ ok=false; break; } }
            if(ok){ pts.push({x:gx,y:gy}); placed=true; break outer; }
          }
        }
      }
      if(!placed){
        let best=null, bestScore=-1;
        for(let s=0;s<40;s++){
          const y = yMinAll + rng()*(yMaxAll-yMinAll);
          const xr = xRangeAt(y);
          if(!xr) continue;
          const x = xr[0] + rng()*(xr[1]-xr[0]);
          let minD = pts.length ? Infinity : 999999;
          for(const p of pts){ const dx=x-p.x, dy=y-p.y; minD = Math.min(minD, dx*dx+dy*dy); }
          if(minD > bestScore){ bestScore = minD; best = {x,y}; }
        }
        pts.push(best || {x:cx, y:(yMinAll+yMaxAll)/2});
      }
    }
    return pts;
  }

  function jarOutlinePath(cx, topY, baseY, w, profile, smooth){
    const yTop = topY+18, h = baseY - yTop;
    const pts = profile.map(([t,wf]) => ({x:(w/2)*wf, y: yTop + t*h}));
    function buildSide(ptsArr, sign){
      if(!smooth){
        return ptsArr.map((p,i)=> `${i===0?'M':'L'} ${(cx+sign*p.x).toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
      }
      let d = `M ${(cx+sign*ptsArr[0].x).toFixed(1)} ${ptsArr[0].y.toFixed(1)} `;
      for(let i=0;i<ptsArr.length-1;i++){
        const cur=ptsArr[i], next=ptsArr[i+1];
        const mx=(cur.x+next.x)/2, my=(cur.y+next.y)/2;
        d += `Q ${(cx+sign*cur.x).toFixed(1)} ${cur.y.toFixed(1)} ${(cx+sign*mx).toFixed(1)} ${my.toFixed(1)} `;
      }
      d += `L ${(cx+sign*ptsArr[ptsArr.length-1].x).toFixed(1)} ${ptsArr[ptsArr.length-1].y.toFixed(1)} `;
      return d;
    }
    const left = buildSide(pts, -1);
    const rightRev = buildSide([...pts].reverse(), 1).replace(/^M/, 'L');
    return left + ' ' + rightRev + ' Z';
  }

  // ---------- ectoplasm blob path ----------
  function blobPath(cx, cy, r, seed){
    const rng = mulberry32((seed*7919+13)>>>0);
    const n = 7;
    const pts = [];
    for(let i=0;i<n;i++){
      const a = i/n*Math.PI*2;
      const rr = r*(0.78 + rng()*0.44);
      pts.push({x:cx+Math.cos(a)*rr, y:cy+Math.sin(a)*rr});
    }
    let d = '';
    for(let i=0;i<n;i++){
      const cur = pts[i], next = pts[(i+1)%n];
      const mx = (cur.x+next.x)/2, my = (cur.y+next.y)/2;
      if(i===0) d = `M ${mx.toFixed(1)} ${my.toFixed(1)} `;
      const nn = pts[(i+1)%n], next2mid = pts[(i+2)%n];
      const m2x = (nn.x+next2mid.x)/2, m2y = (nn.y+next2mid.y)/2;
      d += `Q ${nn.x.toFixed(1)} ${nn.y.toFixed(1)} ${m2x.toFixed(1)} ${m2y.toFixed(1)} `;
    }
    return d + 'Z';
  }

  // Фаза E: угловатый, "колючий" контур — визуально отличает "плохой"
  // пузырь от обычных мягких эктоплазменных сгустков
  function badBlobPath(cx, cy, r, seed){
    const rng = mulberry32((seed*104729+7)>>>0);
    const n = 6;
    const pts = [];
    for(let i=0;i<n;i++){
      const a = i/n*Math.PI*2;
      const rr = r*(i%2===0 ? (0.95+rng()*0.3) : (0.5+rng()*0.22));
      pts.push({x:cx+Math.cos(a)*rr, y:cy+Math.sin(a)*rr});
    }
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} `;
    for(let i=1;i<=n;i++){ const p = pts[i%n]; d += `L ${p.x.toFixed(1)} ${p.y.toFixed(1)} `; }
    return d + 'Z';
  }

  function drawJar(opts){
    const svg = $('jarSvg');
    svg.innerHTML = buildJarMarkup(opts);
    // Патч "УР.4" (Сверхновая): поворот всей банки — CSS-трансформ, а не
    // перерисовка путей, проще и дешевле
    svg.style.transform = opts.rotationDeg ? `rotate(${opts.rotationDeg}deg)` : '';
  }

  // Патч (Коллекционер): построение разметки банки вынесено из drawJar в
  // отдельную функцию — так карточки в сетке 4x4 рендерят ПОЛНОЦЕННОЕ зелье
  // (тот же путь, что и обычная игра), а не упрощённую схему. idPrefix нужен,
  // чтобы у нескольких банок на экране одновременно (сетка) id defs/clipPath
  // не пересекались (иначе все клипались бы по контуру первой банки).
  function buildJarMarkup(opts, idPrefix=''){
    // Патч (Сверхновая): heightPct — независимая высота банки; если не
    // передана, высота как раньше следует за sizePct (единый "объём")
    // Патч "УР.4": rotationDeg — эксклюзивный регулятор Сверхновой
    // Патч "УР.4" (Двуликая жрица): splitHalves — банка на 2 половины, у
    // каждой свой независимый счётчик сгустков (bubbleCountB — левая,
    // bubbleCount — правая, см. ветку splitHalves ниже)
    // Патч (кастомные бутыли): customBottle — рисованный сосуд вместо
    // процедурного контура (см. CUSTOM_BOTTLES в content.js); заменяет только
    // крышку/тело/донышко снаружи — clip-path/пузыри/жидкость внутри те же
    // Фаза 10 (Пьяница Пит): fillPct — уровень жидкости в банке (0..100).
    // null = банка полна до верха (обычное поведение всех остальных). Чем
    // меньше — тем ниже поверхность жидкости; сгустки при этом пакуются только
    // в оставшемся объёме (не висят в воздухе над жидкостью).
    const { hue, hue2=null, sat=70, sizePct, heightPct=null, bubbleCount, bubbleR, seed, shapeIdx=0,
            overridePositions=null, badBubbles=[], rotationDeg=null, fillPct=null,
            splitHalves=false, bubbleCountB=0, showGrid=false, customBottle=null, capIdx=0, decor=null } = opts;
    // несколько банок на экране одновременно (сетка Коллекционера) не должны
    // делить между собой id defs/clipPath — иначе все клипались бы по контуру первой
    const cJarClip = `${idPrefix}jarClip`, cInkDots = `${idPrefix}inkDots`,
          cInkDotsLight = `${idPrefix}inkDotsLight`, cGlassGrad = `${idPrefix}glassGrad`,
          cLiqGrad = `${idPrefix}liqGrad`, cBodyWallGrad = `${idPrefix}bodyWallGrad`;
    const w = 60 + (sizePct/100)*60;
    const h = 140 + ((heightPct ?? sizePct)/100)*70;
    const cx = 100, baseY = 240, topY = baseY - h;

    // Фаза 10 (Пьяница Пит): поверхность жидкости. При полном объёме (fillPct
    // null или 100) — на topY+40, как у всех. Ниже fillPct — ниже поверхность;
    // на самом дне оставляем тонкий слой, чтобы цвет всё же читался.
    const liqFullTopY = topY + 40;
    const liqEmptyTopY = baseY - 14;
    const liqTopY = (fillPct == null) ? liqFullTopY
      : liqEmptyTopY + (liqFullTopY - liqEmptyTopY) * Math.max(0, Math.min(1, fillPct/100));
    // сгустки пакуем только в оставшемся объёме жидкости (не над поверхностью)
    const packTopY = (fillPct == null) ? topY : (liqTopY - 18);

    // Патч (кастомные бутыли): геометрия рисованного сосуда — общий хелпер
    // customBottleGeom() (см. рядом с computeJarGeom), им же пользуется
    // физика летающих сгустков/сетка Векса, чтобы не расходиться с отрисовкой.
    // Верх clip-региона — как у обычной банки (topY+18): крышка рисуется
    // ПОСЛЕ жидкости отдельным непрозрачным слоем и сама перекрывает всё,
    // что за ней, поэтому её не нужно вычитать из зоны пузырей/жидкости.
    let bottleGeom = null, sp;
    if(customBottle){
      bottleGeom = customBottleGeom(customBottle, w, h);
      const artX = (cx - w/2) - customBottle.holeX0*bottleGeom.artScale;
      const artOnW = customBottle.artW * bottleGeom.artScale;
      Object.assign(bottleGeom, { artX, artOnW,
        capY: topY, bodyY: topY + bottleGeom.capOnH, baseYArt: baseY - bottleGeom.baseOnH });
      sp = bottleGeom;
    } else {
      sp = SHAPE_PROFILES[shapeIdx] || SHAPE_PROFILES[0];
    }
    const bodyPath = jarOutlinePath(cx, topY, baseY, w, sp.points, sp.smooth);

    // Патч (крышки, v2): крышка — САМОСТОЯТЕЛЬНАЯ фигура (свой path, свой
    // халo/заливка/обводка), а не единый контур с телом — так она читается
    // как крышечка НА банке, а не как продолжение самой банки. Садится
    // чуть внахлёст на шов (без зазора), но остаётся визуально отдельным
    // объектом. Ширина — заведомо ≤ ширины банки (widthScale<1 почти
    // всегда), чтобы не разъезжаться за пределы рисунка на макс. объёме.
    // clip-path/жидкость по-прежнему строятся только по bodyPath.
    const outlinePath = bodyPath;
    const capStyle = (customBottle || (decor && decor.capImg)) ? null : (CAP_PROFILES[capIdx] || null);
    let capShapeEls = '', capExtras = '';
    if(capStyle){
      const capW = w * (capStyle.widthScale ?? 0.75);
      const capH = w * capStyle.heightFrac;
      const overlap = Math.min(14, capH*0.35); // нахлёст на тело банки, чтобы не было щели
      const seamY = topY + 18 + overlap;        // нижний край крышки
      const revPts = [...capStyle.points].reverse().map(([ct,wf]) => [1-ct, wf]);
      const capPath = jarOutlinePath(cx, seamY-capH-18, seamY, capW, revPts, capStyle.smooth);
      capShapeEls = `
        <path d="${capPath}" fill="rgba(53,224,255,.05)"/>
        <path d="${capPath}" fill="#0d1430"/>
        <path d="${capPath}" fill="none" stroke="#0a0d18" stroke-width="4.5"/>
        <path d="${capPath}" fill="none" stroke="#35e0ff" stroke-width="1.6"/>
      `;
      const hwAt = (ct) => (capW/2)*shapeHalfWidthFrac(ct, capStyle.points);
      const yAt = (ct) => seamY - ct*capH;
      if(capStyle.ridgeAt != null){
        const ry = yAt(capStyle.ridgeAt), rhw = hwAt(capStyle.ridgeAt);
        capExtras += `<ellipse cx="${cx}" cy="${ry.toFixed(1)}" rx="${rhw.toFixed(1)}" ry="2.2" fill="none" stroke="rgba(53,224,255,.6)" stroke-width="1.5"/>`;
      }
      if(capStyle.spokesAt != null){
        const sy = yAt(capStyle.spokesAt), shw = hwAt(capStyle.spokesAt);
        for(let a=0;a<3;a++){
          const dx = (a-1)*shw*0.62;
          capExtras += `<line x1="${cx}" y1="${sy.toFixed(1)}" x2="${(cx+dx).toFixed(1)}" y2="${sy.toFixed(1)}" stroke="#0a0d18" stroke-width="2.6"/>`;
        }
      }
      if(capStyle.antenna){
        const topCapY = seamY - capH;
        capExtras += `<line x1="${cx}" y1="${(topCapY-16).toFixed(1)}" x2="${cx}" y2="${topCapY.toFixed(1)}" stroke="#0a0d18" stroke-width="5"/>
          <line x1="${cx}" y1="${(topCapY-16).toFixed(1)}" x2="${cx}" y2="${topCapY.toFixed(1)}" stroke="#35e0ff" stroke-width="2"/>
          <circle cx="${cx}" cy="${(topCapY-18).toFixed(1)}" r="4.5" fill="#ff4dd2" stroke="#0a0d18" stroke-width="1.8"/>`;
      }
    }

    // Патч (растровые декор-слои): крышка/наклейка — НЕобязательные PNG
    // поверх уже готовой процедурной банки. Они не клипают жидкость и не
    // участвуют в физике пузырей — крышка сидит НАД зоной жидкости (сажается
    // нижним краем ровно на шов y=topY+18, ширина "дышит" вместе с w, как и
    // процедурная), наклейка — чисто декоративный слой поверх пузырей.
    let capImgEl = '', stickerEl = '', capImgFilterDef = '';
    if(decor && decor.capImg){
      // по умолчанию крышка ~на 30% уже банки (см. референсы бутылей —
      // крышка у них всегда заметно уже тела, не вровень с ним)
      const cw = w * (decor.capImgWidthMult ?? 0.7);
      const ch = cw * (decor.capImgAspect ?? 1);
      // нахлёст на тело банки — та же логика, что и у процедурных крышек,
      // но заметно скромнее (крышка не должна казаться утопленной в горлышко)
      const overlap = decor.capImgOverlap ?? Math.min(8, ch*0.15);
      const seamY = topY + 18 + overlap;
      // Патч (дуотон): растровая крышка рисовалась в своём "фотографичном"
      // металлическом стиле (штриховка, градиенты) — визуально не сочетался
      // с плоской векторной банкой (одна линия, заливка цветом). Вместо
      // перегенерации арта — перекрашиваем его SVG-фильтром в ту же
      // чернильно-неоновую пару цветов, что и сама банка, плюс добавляем
      // такой же неоновый glow по силуэту — тогда оба читаются одним стилем.
      const cFilter = `${idPrefix}capDuotone`;
      if(!customBottle){
        capImgFilterDef = `<filter id="${cFilter}" x="-40%" y="-40%" width="180%" height="180%">
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0.208  0 0 0 0 0.878  0 0 0 0 1  0 0 0 1 0" result="glowColor"/>
          <feGaussianBlur in="glowColor" stdDeviation="4" result="glowBlur"/>
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
          <feComponentTransfer in="gray" result="duotone">
            <feFuncR type="table" tableValues="0.039 0.208"/>
            <feFuncG type="table" tableValues="0.051 0.878"/>
            <feFuncB type="table" tableValues="0.094 1"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glowBlur"/>
            <feMergeNode in="duotone"/>
          </feMerge>
        </filter>`;
      }
      const filterAttr = customBottle ? '' : ` filter="url(#${cFilter})"`;
      capImgEl = `<image href="${decor.capImg}" x="${(cx-cw/2).toFixed(1)}" y="${(seamY-ch).toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" preserveAspectRatio="none"${filterAttr}/>`;
    }
    if(decor && decor.stickerImg){
      const yTopBody = topY+18;
      const sw = w * (decor.stickerWidthMult ?? 0.45);
      const sh = sw * (decor.stickerAspect ?? 1);
      const sy = yTopBody + (baseY-yTopBody-sh) * (decor.stickerYFrac ?? 0.5);
      stickerEl = `<image href="${decor.stickerImg}" x="${(cx-sw/2).toFixed(1)}" y="${sy.toFixed(1)}" width="${sw.toFixed(1)}" height="${sh.toFixed(1)}" preserveAspectRatio="none"/>`;
    }

    // Патч "УР.4" (Векс): сетка — рабочий магнит для сгустков, не просто
    // ориентир, поэтому считается по ЗАФИКСИРОВАННОМУ на весь раунд
    // target.size, а не по текущему sizePct (тот может быть просто ползунком
    // игрока "Объём") — иначе нарисованные линии/узлы разъехались бы с
    // реальными точками, куда магнитятся сгустки. У кастомной бутыли нижний
    // ряд сетки не должен заезжать в сужающуюся (овальную) зону донышка —
    // иначе узлы оказываются за пределами нарисованного стекла.
    let gridEls = '';
    if(showGrid && target){
      const gGeom = computeJarGeom(target.size);
      let gy0 = gGeom.topY+40, gy1 = gGeom.baseY;
      if(target.customBottle){
        const bg = customBottleGeom(target.customBottle, gGeom.w, gGeom.h);
        gy0 = gGeom.topY + bg.capOnH;
        const safeLf = (target.customBottle.baseTaper.find(([,wf])=>wf<0.999) || [1])[0];
        const span = gGeom.h - 18;
        const safeT = 1 - bg.baseOnH*(1-safeLf)/span;
        gy1 = gGeom.topY + 18 + safeT*span;
      }
      const gx0 = gGeom.cx - gGeom.w/2, gx1 = gGeom.cx + gGeom.w/2;
      const cols = L4_VEX_GRID_COLS, rows = L4_VEX_GRID_ROWS;
      for(let i=1;i<cols;i++){
        const gx = (gx0 + (gx1-gx0)*i/cols).toFixed(1);
        gridEls += `<line x1="${gx}" y1="${gy0.toFixed(1)}" x2="${gx}" y2="${gy1.toFixed(1)}" stroke="rgba(255,255,255,.28)" stroke-width="1"/>`;
      }
      for(let j=1;j<rows;j++){
        const gy = (gy0 + (gy1-gy0)*j/rows).toFixed(1);
        gridEls += `<line x1="${gx0.toFixed(1)}" y1="${gy}" x2="${gx1.toFixed(1)}" y2="${gy}" stroke="rgba(255,255,255,.28)" stroke-width="1"/>`;
      }
      // узлы — маленькие маркеры точно на пересечениях, куда магнитятся сгустки
      for(let i=1;i<cols;i++){
        for(let j=1;j<rows;j++){
          const nx = (gx0 + (gx1-gx0)*i/cols).toFixed(1);
          const ny = (gy0 + (gy1-gy0)*j/rows).toFixed(1);
          gridEls += `<circle cx="${nx}" cy="${ny}" r="2.4" fill="rgba(255,255,255,.5)"/>`;
        }
      }
    }

    let fillDef = '', fillRef;
    if(hue2 !== null){
      fillDef = `<linearGradient id="${cLiqGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="hsl(${hue},70%,52%)"/>
        <stop offset="100%" stop-color="hsl(${hue2},70%,52%)"/>
      </linearGradient>`;
      fillRef = `url(#${cLiqGrad})`;
    } else {
      fillRef = `hsl(${hue}, ${sat}%, 52%)`;
    }

    let pts;
    if(overridePositions){
      pts = overridePositions;
    } else if(splitHalves){
      // Патч (Двуликая жрица): "Сгустки Б" держат левую половину (как и
      // раньше), "Сгустки А" — только правую (раньше задевали обе)
      pts = [
        ...packBubbles(bubbleCountB, bubbleR, w, packTopY, baseY, sp.points, seed+7331, 'left'),
        ...packBubbles(bubbleCount, bubbleR, w, packTopY, baseY, sp.points, seed, 'right')
      ];
    } else {
      pts = packBubbles(bubbleCount, bubbleR, w, packTopY, baseY, sp.points, seed);
    }
    // перегородка посередине банки — видимая граница двух половин
    const splitDividerEl = splitHalves
      ? `<line x1="${cx}" y1="${(topY+18).toFixed(1)}" x2="${cx}" y2="${baseY.toFixed(1)}" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-dasharray="3,3"/>`
      : '';
    // ectoplasm blobs: soft halo + irregular blob + bright core
    const bubbleEls = pts.map((p,i)=>{
      const r = p.r || bubbleR;
      return `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(r*1.55).toFixed(1)}" fill="rgba(125,255,106,.16)"/>
        <path d="${blobPath(p.x, p.y, r, seed+i*31)}" fill="rgba(125,255,106,.78)" stroke="#0a0d18" stroke-width="2.2"/>\n        <path d="${blobPath(p.x, p.y, r, seed+i*31)}" fill="none" stroke="rgba(220,255,210,.7)" stroke-width="0.8"/>
        <circle cx="${(p.x-r*0.25).toFixed(1)}" cy="${(p.y-r*0.25).toFixed(1)}" r="${(r*0.3).toFixed(1)}" fill="rgba(255,255,255,.8)"/>
      `;
    }).join('');

    // blob halftone shadows (printed-ink feel under each ectoplasm chunk)
    const blobShadows = pts.map(p=>{
      const r = p.r || bubbleR;
      return `<ellipse cx="${(p.x+r*0.35).toFixed(1)}" cy="${(p.y+r*0.85).toFixed(1)}" rx="${(r*0.95).toFixed(1)}" ry="${(r*0.4).toFixed(1)}" fill="url(#${cInkDots})" opacity=".8"/>`;
    }).join('');


    // Фаза E: "плохие" пузыри — рисуются ПОСЛЕ clip-path'а (не внутри
    // <g clip-path>), чтобы клик по ним не зависел от обрезки контейнера
    const badBubbleEls = badBubbles.map(b=>{
      const glowOpacity = (0.22 + 0.5*b.pct).toFixed(2);
      const glowR = (b.r*(1.7+0.5*b.pct)).toFixed(1);
      return `
        <g class="bad-bubble" data-bad-id="${b.id}">
          <circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${glowR}" fill="rgba(255,93,106,${glowOpacity})"/>
          <path d="${badBlobPath(b.x,b.y,b.r,b.seed)}" fill="#ff5d6a" stroke="#3d0209" stroke-width="2"/>
          <path d="${badBlobPath(b.x,b.y,b.r,b.seed)}" fill="none" stroke="rgba(255,205,208,.75)" stroke-width="0.8"/>
          <circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${Math.max(1.4,b.r*0.22).toFixed(1)}" fill="#2a0106"/>
        </g>`;
    }).join('');

    // Патч (кастомные бутыли): 9-slice сборка — крышка и донышко берут свой
    // масштаб от ширины банки w (одинаковый по X и Y, без искажений),
    // тело получает всё, что осталось по высоте, и тянется только вертикально
    // (сам рисунок тела — почти прямоугольная безликая полоса, так что
    // растяжение незаметно). Донышко рисуется ПОСЛЕ жидкости/пузырей: его
    // "дальняя" часть уже сведена художником к ~30% альфы в самом PNG, чтобы
    // сквозь неё было видно содержимое банки, а "ближняя" стенка остаётся
    // непрозрачной поверх жидкости.
    let bottleCapEl = '', bottleBodyEl = '', bottleBaseEl = '', bottleGlowEl = '', bodyWallGradDef = '';
    if(customBottle){
      const { capOnH, baseOnH, bodyOnH, artX, artOnW, capY, bodyY, baseYArt } = bottleGeom;
      const img = (href, y, hh) => `<image href="${href}" x="${artX.toFixed(1)}" y="${y.toFixed(1)}" width="${artOnW.toFixed(1)}" height="${hh.toFixed(1)}" preserveAspectRatio="none"/>`;
      bottleCapEl = img(customBottle.cap, capY, capOnH);
      // Патч (векторные стенки): тело — не картинка, а горизонтальный
      // градиент (замерен по пикселям исходника) на прямоугольнике той же
      // ширины/позиции, что раньше занимала image — растр на сильном
      // растяжении мылился, вектор чёткий на любом масштабе. gradientUnits
      // по умолчанию objectBoundingBox — офсеты 0..1 сами лягут на ширину
      // rect'а, независимо от текущего artOnW.
      if(customBottle.bodyWallStops){
        bodyWallGradDef = `<linearGradient id="${cBodyWallGrad}" x1="0" y1="0" x2="1" y2="0">
          ${customBottle.bodyWallStops.map(([off,color,op]) =>
            `<stop offset="${off}" stop-color="${color}" stop-opacity="${op}"/>`).join('')}
        </linearGradient>`;
        bottleBodyEl = `<rect x="${artX.toFixed(1)}" y="${bodyY.toFixed(1)}" width="${artOnW.toFixed(1)}" height="${bodyOnH.toFixed(1)}" fill="url(#${cBodyWallGrad})"/>`;
      } else {
        bottleBodyEl = img(customBottle.body, bodyY, bodyOnH);
      }
      bottleBaseEl = img(customBottle.base, baseYArt, baseOnH);
      bottleGlowEl = [
        customBottle.glowCap ? img(customBottle.glowCap, capY, capOnH) : '',
        customBottle.glowBody ? img(customBottle.glowBody, bodyY, bodyOnH) : '',
        customBottle.glowBase ? img(customBottle.glowBase, baseYArt, baseOnH) : ''
      ].join('');
    }

    return `
      <defs>
        <clipPath id="${cJarClip}"><path d="${bodyPath}"/></clipPath>
        ${fillDef}
        ${bodyWallGradDef}
        ${capImgFilterDef}
        <!-- staggered halftone dot pattern, like printed manga raster -->
        <pattern id="${cInkDots}" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.8" cy="1.8" r="1.15" fill="rgba(0,0,0,.30)"/>
          <circle cx="5.3" cy="5.3" r="1.15" fill="rgba(0,0,0,.30)"/>
        </pattern>
        <pattern id="${cInkDotsLight}" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.05" fill="rgba(255,255,255,.30)"/>
          <circle cx="6" cy="6" r="1.05" fill="rgba(255,255,255,.30)"/>
        </pattern>
        <linearGradient id="${cGlassGrad}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="rgba(159,242,255,.28)"/>
          <stop offset="18%" stop-color="rgba(159,242,255,.02)"/>
          <stop offset="100%" stop-color="rgba(159,242,255,.06)"/>
        </linearGradient>
      </defs>
      ${customBottle ? '' : `
      <!-- neon halo (drawn first, widest) -->
      <path d="${outlinePath}" fill="none" stroke="rgba(53,224,255,.28)" stroke-width="8"/>
      <!-- container body + cap, one continuous outline -->
      <path d="${outlinePath}" fill="rgba(53,224,255,.05)"/>
      `}
      <g clip-path="url(#${cJarClip})">
        <rect x="${cx-w/2-6}" y="${liqTopY.toFixed(1)}" width="${w+12}" height="${(baseY+20-liqTopY).toFixed(1)}" fill="${fillRef}"/>
        <!-- liquid volume: dark side band + halftone shading on the right -->
        <rect x="${(cx+w*0.18).toFixed(1)}" y="${liqTopY.toFixed(1)}" width="${(w*0.4).toFixed(1)}" height="${(baseY+20-liqTopY).toFixed(1)}" fill="rgba(0,0,0,.16)"/>
        <rect x="${(cx+w*0.10).toFixed(1)}" y="${liqTopY.toFixed(1)}" width="${(w*0.5).toFixed(1)}" height="${(baseY+20-liqTopY).toFixed(1)}" fill="url(#${cInkDots})"/>
        <!-- light side: halftone highlight strip -->
        <rect x="${(cx-w/2).toFixed(1)}" y="${liqTopY.toFixed(1)}" width="${(w*0.2).toFixed(1)}" height="${(baseY+20-liqTopY).toFixed(1)}" fill="url(#${cInkDotsLight})"/>
        <!-- liquid surface: bold ink line + bright edge -->
        <rect x="${cx-w/2-6}" y="${liqTopY.toFixed(1)}" width="${w+12}" height="3.2" fill="rgba(10,13,24,.85)"/>
        <rect x="${cx-w/2-6}" y="${(liqTopY+3).toFixed(1)}" width="${w+12}" height="5" fill="rgba(255,255,255,.30)"/>
        ${gridEls}
        ${blobShadows}
        ${bubbleEls}
        ${splitDividerEl}
      </g>
      ${customBottle ? `${bottleCapEl}${bottleBodyEl}${bottleBaseEl}${bottleGlowEl}` : `
      <path d="${outlinePath}" fill="url(#${cGlassGrad})"/>
      <!-- thick manga ink outline with neon core -->
      <path d="${outlinePath}" fill="none" stroke="#0a0d18" stroke-width="5"/>
      <path d="${outlinePath}" fill="none" stroke="#35e0ff" stroke-width="1.8"/>
      <!-- крышечка — отдельная фигура поверх банки -->
      ${capShapeEls}
      ${capExtras}
      `}
      ${capImgEl}
      ${badBubbleEls}
      ${stickerEl}
    `;
  }

  function idxToVal(idx, steps, maxVal){ return steps<=1 ? 0 : idx*(maxVal/(steps-1)); }
  function satFromIdx(idx){ return 30 + idx*(70/9); }
  function curveScore(raw){ return Math.pow(Math.max(0, Math.min(1, raw)), 1.6); }

  function computeJarGeom(sizePct){
    const w = 60 + (sizePct/100)*60;
    const h = 140 + (sizePct/100)*70;
    const baseY = 240, topY = baseY - h;
    return { w, h, topY, baseY, cx:100 };
  }
  // Патч (кастомные бутыли): единая геометрия/профиль кастомного сосуда —
  // используется и в отрисовке (buildJarMarkup), и в физике летающих
  // сгустков (Бармен), и в спавне "плохих" пузырей (дрон), и в сетке Векса,
  // чтобы все они одинаково понимали, где верх/низ банки и как сужается
  // донышко. Крышка НЕ вычитается из высоты — она рисуется ПОСЛЕ жидкости
  // отдельным непрозрачным слоем и сама перекрывает всё, что за ней; верх
  // banки для физики/clip — как у обычной процедурной банки (topY+18).
  // Донышко, наоборот, нарисовано в перспективе (овал) — профиль сужается
  // в самом низу по замеру CUSTOM_BOTTLES[].baseTaper, иначе жидкость/пузыри
  // торчат прямоугольными углами за пределами овала.
  function customBottleGeom(customBottle, w, h){
    const artScale = w / customBottle.holeW;
    const capOnH = customBottle.capH * artScale;
    const baseOnH = customBottle.baseH * artScale;
    const bodyOnH = Math.max(4, h - capOnH - baseOnH);
    // соответствует внутренней высоте jarOutlinePath/packBubbles/stepPhysics
    // (везде yTop = topY+18) — без этой поправки точки сужения крышки/донышка
    // съезжают на фиксные 18 единиц от того, где реально нарисованы контуры
    const span = h - 18;
    // crownTaper: крышка не прямоугольная — узкая макушка/шейка внутри
    // непрямоугольного колпака, поэтому у неё СВОЙ профиль сужения сверху,
    // не только плоская "wf=1" заглушка, как раньше. lf считается от НИЗА
    // куска крышки (т.е. от верха банки), поэтому переводится в t иначе,
    // чем донышко (которое считается от НИЗА банки)
    const capPts = (customBottle.capTaper || [[0,0],[1,1]]).map(([lf,wf]) => {
      const t = (lf*capOnH - 18) / span;
      return [t, wf];
    });
    const basePts = (customBottle.baseTaper || [[0,1],[1,1]]).map(([lf,wf]) => {
      const t = 1 - baseOnH*(1-lf)/span;
      return [t, wf];
    });
    return {
      artScale, capOnH, baseOnH, bodyOnH,
      points: [...capPts, ...basePts], smooth: true
    };
  }
  function stepPhysics(bubbles, geom, profile, r, dt){
    const yTop = geom.topY+18;
    const yMinAll = yTop + r + 4, yMaxAll = geom.baseY - r - 4;
    bubbles.forEach(b=>{ b.x += b.vx*dt; b.y += b.vy*dt; });
    bubbles.forEach(b=>{
      const yFrac = Math.min(1, Math.max(0, (b.y-yTop)/(geom.baseY-yTop)));
      const hw = (geom.w/2)*shapeHalfWidthFrac(yFrac, profile) - r - 4;
      if(hw>0){
        const xMin=geom.cx-hw, xMax=geom.cx+hw;
        if(b.x<xMin){ b.x=xMin; b.vx=Math.abs(b.vx); }
        if(b.x>xMax){ b.x=xMax; b.vx=-Math.abs(b.vx); }
      }
      if(b.y<yMinAll){ b.y=yMinAll; b.vy=Math.abs(b.vy); }
      if(b.y>yMaxAll){ b.y=yMaxAll; b.vy=-Math.abs(b.vy); }
    });
    for(let i=0;i<bubbles.length;i++){
      for(let j=i+1;j<bubbles.length;j++){
        const a=bubbles[i], c=bubbles[j];
        const dx=c.x-a.x, dy=c.y-a.y;
        const dist=Math.hypot(dx,dy)||0.001;
        const minD=(a.r||r)+(c.r||r);
        if(dist<minD){
          const nx=dx/dist, ny=dy/dist;
          const overlap=(minD-dist)/2;
          a.x-=nx*overlap; a.y-=ny*overlap;
          c.x+=nx*overlap; c.y+=ny*overlap;
          const avn=a.vx*nx+a.vy*ny, cvn=c.vx*nx+c.vy*ny;
          const avt_x=a.vx-avn*nx, avt_y=a.vy-avn*ny;
          const cvt_x=c.vx-cvn*nx, cvt_y=c.vy-cvn*ny;
          a.vx=avt_x+cvn*nx; a.vy=avt_y+cvn*ny;
          c.vx=cvt_x+avn*nx; c.vy=cvt_y+avn*ny;
        }
      }
    }
  }
  function makePhysicsBubbles(count, r, geom, profile, seed, speed){
    const pts = packBubbles(count, r, geom.w, geom.topY, geom.baseY, profile, seed);
    const rng = mulberry32((seed+31)>>>0);
    return pts.map(p=>{
      const ang = rng()*Math.PI*2;
      return { x:p.x, y:p.y, vx:Math.cos(ang)*speed, vy:Math.sin(ang)*speed, r };
    });
  }
  function stopMovingAnim(){
    if(movingRafId){ cancelAnimationFrame(movingRafId); movingRafId=null; }
    movingLastT = 0;
  }
  function startMovingAnim(){
    stopMovingAnim();
    const geom = computeJarGeom(target.size);
    const r = 3 + (target.bsize/100)*9;
    const profile = target.customBottle ? customBottleGeom(target.customBottle, geom.w, geom.h).points : SHAPE_PROFILES[target.shapeIdx||0].points;
    movingBubbles = makePhysicsBubbles(target.count, r, geom, profile, target.seed, target.moveSpeed);
    movingGeom = geom; movingProfile = profile; movingR = r; movingLastT = 0;
    function frame(t){
      if(!movingLastT) movingLastT = t;
      const dt = Math.min(0.05, (t-movingLastT)/1000); movingLastT = t;
      stepPhysics(movingBubbles, movingGeom, movingProfile, movingR, dt);
      drawJar({ hue:target.hue, hue2:null, sat:target.sat, sizePct:target.size, bubbleCount:0, bubbleR:movingR,
        shapeIdx: target.shapeIdx||0, seed: target.seed, overridePositions: movingBubbles,
        customBottle: target.customBottle, capIdx: target.capIdx, decor: target.decor });
      movingRafId = requestAnimationFrame(frame);
    }
    movingRafId = requestAnimationFrame(frame);
  }

  // ---------- Патч (Хранитель Архива): "матричный дождь" ----------
  // Плотные колонки символов бегут сверху вниз ПОВЕРХ банки — специально
  // мешают разглядеть точный цвет/форму/число сгустков, а не просто украшают фон.
  let matrixEl = null, matrixInterval = null;
  function startMatrixRain(){
    stopMatrixRain();
    const frame = $('windowFrame');
    if(!frame) return;
    const glyphs = (typeof MATRIX_GLYPHS !== 'undefined') ? MATRIX_GLYPHS : '01ΞΔΨ';
    matrixEl = document.createElement('div');
    matrixEl.className = 'matrix-rain';
    const cols = 16;
    for(let i=0;i<cols;i++){
      const col = document.createElement('div');
      col.className = 'matrix-col';
      col.style.left = (2 + i*(96/(cols-1))) + '%';
      col.style.animationDuration = (3 + Math.random()*4).toFixed(2) + 's';
      col.style.animationDelay = (-Math.random()*8).toFixed(2) + 's';
      col.style.fontSize = (14 + Math.random()*10).toFixed(0) + 'px';
      matrixEl.appendChild(col);
    }
    // вставляем ПОСЛЕ банки (поверх jarSvg) — теперь дождь реально закрывает обзор
    frame.appendChild(matrixEl);
    const refill = ()=>{
      matrixEl.querySelectorAll('.matrix-col').forEach(col=>{
        let txt = '';
        const n = 20 + ((Math.random()*8)|0);
        for(let j=0;j<n;j++) txt += glyphs[(Math.random()*glyphs.length)|0] + '\n';
        col.textContent = txt;
      });
    };
    refill();
    matrixInterval = setInterval(refill, 160);
  }
  function stopMatrixRain(){
    if(matrixInterval){ clearInterval(matrixInterval); matrixInterval = null; }
    if(matrixEl){ matrixEl.remove(); matrixEl = null; }
  }

  // ---------- Фаза E: логика "плохих" пузырей (только у дрона, УР.4) ----------
  // Растут сами по себе; если игрок не успевает кликнуть — лопаются и
  // дёргают случайный АКТИВНЫЙ регулятор на одно деление в случайную сторону.
  function stopBadBubbles(){
    if(badBubbleRafId){ cancelAnimationFrame(badBubbleRafId); badBubbleRafId = null; }
    badBubbles = [];
    currentBadBubbles = [];
    badBubbleLastT = 0;
    badBubbleElapsed = 0;
    stopDroneCursor();
  }
  // Фаза 8 (Дрон УР.4): курсор-«прицел» с ИНЕРЦИЕЙ. Он с лагом догоняет палец
  // (проще промахнуться мимо растущего пузыря); лопает тот пузырь, что оказался
  // под ним (elementFromPoint — курсор pointer-events:none, потому «видит»
  // пузырь под собой). Прямой тап по пузырю на УР.4 отключён (см. pointerdown).
  let l4DroneCursor = null, l4DroneCurX = 0, l4DroneCurY = 0, l4DronePtrX = 0,
      l4DronePtrY = 0, l4DroneRaf = null, l4DroneMoveHandler = null;
  function startDroneCursor(){
    const wf = $('windowFrame'); if(!wf || l4DroneCursor) return;
    wf.classList.add('l4-drone-cursor-active');
    const c = document.createElement('div'); c.className = 'l4-drone-cursor'; c.textContent = '✥';
    wf.appendChild(c); l4DroneCursor = c;
    const rect = wf.getBoundingClientRect();
    l4DroneCurX = l4DronePtrX = rect.width / 2;
    l4DroneCurY = l4DronePtrY = rect.height / 2;
    l4DroneMoveHandler = (e)=>{ const r = wf.getBoundingClientRect(); l4DronePtrX = e.clientX - r.left; l4DronePtrY = e.clientY - r.top; };
    wf.addEventListener('pointermove', l4DroneMoveHandler);
    const step = ()=>{
      l4DroneCurX += (l4DronePtrX - l4DroneCurX) * 0.12; // инерция (лаг курсора)
      l4DroneCurY += (l4DronePtrY - l4DroneCurY) * 0.12;
      if(l4DroneCursor){ l4DroneCursor.style.left = l4DroneCurX + 'px'; l4DroneCursor.style.top = l4DroneCurY + 'px'; }
      const wfr = wf.getBoundingClientRect();
      const el = document.elementFromPoint(wfr.left + l4DroneCurX, wfr.top + l4DroneCurY);
      const g = el && el.closest ? el.closest('[data-bad-id]') : null;
      if(g){ const id = Number(g.getAttribute('data-bad-id')); const b = badBubbles.find(x => x.id === id); if(b) popBadBubble(b, true); }
      l4DroneRaf = requestAnimationFrame(step);
    };
    l4DroneRaf = requestAnimationFrame(step);
  }
  function stopDroneCursor(){
    const wf = $('windowFrame');
    if(wf){ wf.classList.remove('l4-drone-cursor-active'); if(l4DroneMoveHandler) wf.removeEventListener('pointermove', l4DroneMoveHandler); }
    if(l4DroneRaf){ cancelAnimationFrame(l4DroneRaf); l4DroneRaf = null; }
    if(l4DroneCursor){ l4DroneCursor.remove(); l4DroneCursor = null; }
    l4DroneMoveHandler = null;
  }
  function scheduleNextBadBubble(){
    nextBadBubbleSpawnAt = badBubbleElapsed + rand(BAD_BUBBLE_CONFIG.minSpawnMs, BAD_BUBBLE_CONFIG.maxSpawnMs);
  }
  function spawnBadBubble(){
    const geom = computeJarGeom(target.size);
    const profile = target.customBottle ? customBottleGeom(target.customBottle, geom.w, geom.h).points : SHAPE_PROFILES[target.shapeIdx || 0].points;
    const r0 = BAD_BUBBLE_CONFIG.startRadius;
    const yTop = geom.topY + 18, yMinAll = yTop + r0 + 6, yMaxAll = geom.baseY - r0 - 6;
    let x = geom.cx, y = (yMinAll + yMaxAll) / 2, tries = 0, placed = false;
    while(tries < 24 && !placed){
      tries++;
      const yy = rand(yMinAll, yMaxAll);
      const yFrac = Math.min(1, Math.max(0, (yy - yTop) / (geom.baseY - yTop)));
      const hw = (geom.w/2) * shapeHalfWidthFrac(yFrac, profile) - r0 - 6;
      if(hw <= 0) continue;
      const xx = geom.cx + rand(-hw, hw);
      const clashes = badBubbles.some(b => Math.hypot(b.x-xx, b.y-yy) < (b.r||r0) + r0 + 8);
      if(!clashes){ x = xx; y = yy; placed = true; }
    }
    badBubbles.push({ id: badBubbleIdSeq++, x, y, born: badBubbleElapsed, seed: randInt(1,99999) });
  }
  function jarGlitchFlash(){
    const wf = $('windowFrame');
    if(!wf) return;
    wf.classList.remove('glitch'); void wf.offsetWidth; wf.classList.add('glitch');
    setTimeout(()=>wf.classList.remove('glitch'), 350);
  }
  // сбивает случайный АКТИВНЫЙ на этой сложности регулятор на одно деление
  function jitterRandomRegulator(){
    if(!target || !target.activeKeys) return;
    const keys = [...target.activeKeys].filter(k => S[k]);
    if(!keys.length) return;
    const slider = S[pick(keys)];
    const dir = Math.random() < 0.5 ? -1 : 1;
    let v = slider.value + dir*(slider.step||1);
    v = Math.min(slider.max, Math.max(slider.min, v));
    slider.value = v;
    updatePlayerJar();
    SFX.badPop();
    jarGlitchFlash();
  }
  function popBadBubble(b, byPlayer){
    badBubbles = badBubbles.filter(x => x !== b);
    if(byPlayer) SFX.badClear();
    else jitterRandomRegulator();
  }
  // Фаза 8 (8C): включена ли уникальная механика персонажа id для текущего заказа —
  // на УР.4 всегда, либо с УР.1, если id ∈ MECH_FROM_L1. Общий предикат для развязки
  // старого точечного гейтинга `regLevel === 4 && cfg.id === X` по нескольким местам.
  function mechActive(id){
    return !!(target && target.cfg && target.cfg.id === id
      && (target.regLevel === 4 || MECH_FROM_L1.has(id)));
  }
  function droneBombsActive(){ return mechActive('drone'); }
  function badBubbleFrame(now){
    if(!droneBombsActive() || currentPhase !== 'craft' || craftLocked){ badBubbleRafId = null; return; }
    if(!badBubbleLastT) badBubbleLastT = now;
    const dt = now - badBubbleLastT;
    badBubbleLastT = now;
    badBubbleElapsed += dt;

    if(badBubbleElapsed >= nextBadBubbleSpawnAt && badBubbles.length < BAD_BUBBLE_CONFIG.maxAlive){
      spawnBadBubble();
      scheduleNextBadBubble();
    }

    const toRender = [];
    badBubbles.slice().forEach(b=>{
      const age = badBubbleElapsed - b.born;
      const pct = Math.min(1, age / BAD_BUBBLE_CONFIG.growMs);
      if(pct >= 1){
        popBadBubble(b, false);
      } else {
        const r = BAD_BUBBLE_CONFIG.startRadius + pct*(BAD_BUBBLE_CONFIG.popRadius - BAD_BUBBLE_CONFIG.startRadius);
        toRender.push({ id:b.id, x:b.x, y:b.y, seed:b.seed, r, pct });
      }
    });
    currentBadBubbles = toRender;
    updatePlayerJar();

    badBubbleRafId = requestAnimationFrame(badBubbleFrame);
  }
  // клик/тап по "плохому" пузырю — делегирование на весь jarSvg, т.к.
  // сами элементы пересоздаются каждый кадр
  const jarSvgEl = $('jarSvg');
  if(jarSvgEl){
    jarSvgEl.addEventListener('pointerdown', e=>{
      if(!droneBombsActive() || currentPhase !== 'craft' || craftLocked) return;
      if(target && target.regLevel === 4) return; // УР.4: лопает только курсор-с-инерцией
      const g = e.target.closest ? e.target.closest('[data-bad-id]') : null;
      if(!g) return;
      e.stopPropagation();
      const id = Number(g.getAttribute('data-bad-id'));
      const b = badBubbles.find(x => x.id === id);
      if(b) popBadBubble(b, true);
    });
  }

  // ============================================================
  // Патч "Уникальные механики УР.4": единый диспетчер
  // ============================================================
  // Регистрируется по cfg.id. Поля обработчика (все опциональны):
  //  setup()             — сразу после computeActiveKeys, ДО первого drawJar
  //                        этого заказа; тут рандомизируются свои поля target.
  //  memorizeStart()     — доп. эффект НАД обычным runTimer(memDuration,...)
  //  replaceMemorize(onDone) — полностью берёт на себя тайминг фазы "запоминай"
  //                        (обязан сам вызвать onDone); взаимоисключимо с
  //                        memorizeStart — обработчик даёт только одно из двух.
  //  craftStart()        — сразу после обычной настройки фазы "воссоздай"
  //  stop()              — общая уборка (интервалы/DOM/слушатели); вызывается
  //                        и в начале нового заказа, и по завершении текущего
  //  scoreBonus(scoreData, timeFrac) — в finalizeResult, до расчёта delta;
  //                        может вернуть { ratingMultAdd, repBonus, thresholdOverride }
  const LEVEL4_FX = {};
  let level4Active = null; // текущий обработчик этого заказа (или null)

  // Фаза 8 (8B): персонажи, чья уникальная механика включается уже с УР.1
  // (а не только на УР.4). По мере реворка (8C) сюда добавляются новые id.
  // Механика при этом опирается на target.activeKeys, поэтому естественно
  // масштабируется по уровню сложности (меньше ползунков — меньше механики).
  // Фаза 8 (8C): персонажи, чья уникальная механика работает с УР.1, а не только
  // на УР.4. Добавление id сюда включает их LEVEL4_FX-хуки на всех уровнях
  // (механика опирается на target.activeKeys → масштабируется под уровень сама).
  // Батч A (dj_pulsar/apothecary_mo/logic9/racer_kai) — «чистые»: их эффект целиком
  // в LEVEL4_FX, без внешнего гейтинга regLevel===4 (эмбиент/таймер/степпер по
  // activeKeys), поэтому безопасно активируются с УР.1 без иных правок.
  const MECH_FROM_L1 = new Set([
    'trucker_chrome', 'collector_gz', 'fashionista', 'tentacloid', 'vex',
    // Батч A: dj_pulsar/apothecary_mo/logic9/racer_kai — эффект целиком в LEVEL4_FX,
    // без внешнего гейта. janitor: механика-грязь тоже целиком в LEVEL4_FX
    // (канвас поверх банки, без завязки на ползунки); внешняя строка — лишь
    // доп-бонус +1000 за УР.4-вариант, безвредно остаётся УР.4-only.
    'dj_pulsar', 'apothecary_mo', 'logic9', 'racer_kai', 'janitor',
    // Батч B: drone — «плохие пузыри» живут вне LEVEL4_FX (droneBombsActive),
    // но членство здесь используем как единый флаг «механика с УР.1». У drone нет
    // LEVEL4_FX-обработчика, поэтому для диспетчера это безвредно (level4Active=undefined).
    'drone',
    // Батч B: guild_inspector (лист «Допусков» без показа, скоринг по допуску) и
    // gourmet_vega (дегустация с одной переигровкой) — механика с УР.1; их точечный
    // гейтинг regLevel===4 в finalize/показе развязан через mechActive(). УР.4-новинки
    // (допрос инспектора / подсветка близости дегустации) — отдельно.
    'guild_inspector', 'gourmet_vega',
    // Фаза 8 (2): perfumer (пэд цвет×накал с УР.1, кастомная раскладка ползунков) и
    // swarm_navigator (детали-перетаскивание с УР.1, кастомная раскладка) — см.
    // computeActiveKeys. isFlySwarm-рендер развязан через mechActive().
    'perfumer', 'swarm_navigator',
    // Фаза 10: Бабушка Мурра — кошачьи лапы-помеха с УР.1 (см. LEVEL4_FX.catlady)
    'catlady',
    // Фаза 10: Инженер навигатора — бегающий указатель + зоны, без показа (см. LEVEL4_FX.engineer)
    'engineer',
    // Фаза 10: Маркетолог — хаос-панель случайных контролов с УР.1 (см. LEVEL4_FX.marketer)
    'marketer'
  ]);

  // Персонажи, которым НЕЛЬЗЯ вешать фокус-модификатор (кастомная раскладка
  // ползунков — стат-фокус лёг бы на особый/неактивный регулятор и сломал набор).
  // Используется и в buildOrderDescriptor, и в addRandomModifier (Жетон дебоша).
  const MOD_FOCUS_EXCLUDE = new Set(['vex', 'perfumer', 'collector_gz']);

  // Фаза 8 (баланс таймеров, 2026-07-27): базовые тайминги были слишком длинными.
  // Глобально режем БАЗУ (cfg.memorizeMs/craftMs): показ −30%, игра −50%.
  // Множители механик (степпер ×1.5, инспектор ×2 и т.п.) и абсолютные бонусы
  // (предметы, УР.4-бонус, секунды Ир) применяются ПОВЕРХ и не масштабируются.
  // Числа временные — пользователь ещё потестит и, возможно, урежет сильнее.
  const MEM_TIME_SCALE = 0.7;
  const CRAFT_TIME_SCALE = 0.5;

  function level4SetupOrder(){
    const fromL1 = MECH_FROM_L1.has(target.cfg.id);
    level4Active = (target.regLevel === 4 || fromL1) ? LEVEL4_FX[target.cfg.id] : null;
    if(level4Active && level4Active.setup) level4Active.setup();
  }
  function level4Stop(){
    if(level4Active && level4Active.stop) level4Active.stop();
  }
  function level4StartMemorize(memDuration, onDone){
    if(level4Active && level4Active.replaceMemorize){
      level4Active.replaceMemorize(onDone);
    } else {
      runTimer(memDuration, onDone);
      if(level4Active && level4Active.memorizeStart) level4Active.memorizeStart();
    }
  }
  function level4StartCraft(){
    if(level4Active && level4Active.craftStart) level4Active.craftStart();
  }
  function level4ScoreBonus(scoreData, timeFrac){
    if(level4Active && level4Active.scoreBonus){
      try { return level4Active.scoreBonus(scoreData, timeFrac) || null; } catch(e){ return null; }
    }
    return null;
  }

  // ============================================================
  // Механики УР.4 — блок 1: построены на подмене S{} / onSliderInput
  // ============================================================

  // ---------- Тентаклоид: считает только ОДИН случайный скрытый параметр ----------
  // Патч: старая механика (роли регуляторов перемешаны — двигаешь "Размер",
  // меняется "Сгустки") заменена целиком. Теперь он смотрит на смесь и
  // замечает только ОДНУ вещь в ней, полностью игнорируя остальное (даже
  // если остальное идеально или ужасно) — игрок не знает, какой параметр
  // решает, пока не увидит результат (см. computeScoreComponents ниже).
  LEVEL4_FX.tentacloid = {
    setup(){
      const keys = shuffleArr([...(target.activeKeys||[])].filter(k => S[k]));
      target.tentacloidKey = keys[0] || null;
      // Фаза 8, УР.4: считает ДВЕ характеристики и берёт меньшую (см. скоринг)
      target.tentacloidKey2 = (target.regLevel === 4 && keys.length >= 2) ? keys[1] : null;
    },
    craftStart(){
      // Патч (Фаза 0): баннер переехал из-под зелья (bottom:4%, перекрывал банку)
      // в статичную плашку НАД циферблатом и зельем — вставляем перед .control-row.
      const row = document.querySelector('.control-row');
      if(!row || !row.parentNode) return;
      let el = document.getElementById('l4TentaBanner');
      if(!el){ el = document.createElement('div'); el.id = 'l4TentaBanner'; el.className = 'l4-tenta-banner'; }
      el.textContent = LT(UI_TEXT.TENTACLOID_UNDECIDED_BANNER);
      row.parentNode.insertBefore(el, row);
    },
    stop(){
      const el = document.getElementById('l4TentaBanner'); if(el) el.remove();
    }
  };

  // ---------- Дальнобойщик Хром: тряска (слабее) + "коробка передач" ----------
  // Патч: убрали дешёвое мигание (truckerBlackoutFlash) и скрытую перестановку
  // значений — вместо этого сам трек ползунка теперь ветвистая ломаная линия
  // (как схема переключения передач), и значение честно идёт по её длине от
  // начала к концу. Сложность — в том, что на глаз трудно прикинуть, где по
  // такой линии сейчас находится ползунок, а не в скрытой перетасовке чисел.
  const TRUCKER_GEAR_PATHS = [
    [[50,92],[50,66],[20,66],[20,40],[50,40],[50,14]],
    [[50,92],[50,70],[80,70],[80,44],[50,44],[50,18],[80,18],[80,8]],
    [[50,92],[25,80],[25,54],[75,54],[75,28],[50,16],[50,8]],
    [[50,92],[75,78],[75,52],[25,52],[25,26],[75,26],[75,8]],
    [[50,92],[50,60],[30,60],[30,36],[70,36],[70,12],[50,12],[50,8]],
    [[50,92],[20,84],[20,58],[60,58],[60,32],[35,32],[35,10],[50,10],[50,8]],
    [[50,92],[50,72],[78,72],[78,48],[22,48],[22,24],[50,24],[50,8]],
    [[50,92],[22,82],[22,56],[64,56],[64,32],[38,32],[38,10],[50,10]],
    [[50,92],[50,64],[74,64],[74,40],[26,40],[26,20],[74,20],[74,8]],
    [[50,92],[30,78],[70,78],[70,52],[30,52],[30,26],[70,26],[50,10],[50,8]]
  ];
  function gearPathMetrics(pts){
    const cum = [0];
    for(let i=1;i<pts.length;i++){
      cum.push(cum[i-1] + Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]));
    }
    return { cum, total: cum[cum.length-1] || 1 };
  }
  function gearPointAtFrac(pts, cum, total, frac){
    const target = Math.max(0,Math.min(1,frac))*total;
    for(let i=1;i<pts.length;i++){
      if(target <= cum[i] || i === pts.length-1){
        const segLen = (cum[i]-cum[i-1]) || 1;
        const t = Math.max(0,Math.min(1,(target-cum[i-1])/segLen));
        return [ pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t ];
      }
    }
    return pts[pts.length-1];
  }
  function gearFracAtXY(pts, cum, total, x, y){
    let bestD = Infinity, bestFrac = 0;
    for(let i=1;i<pts.length;i++){
      const x1=pts[i-1][0], y1=pts[i-1][1], x2=pts[i][0], y2=pts[i][1];
      const dx=x2-x1, dy=y2-y1;
      const segLen2 = dx*dx+dy*dy || 1;
      let t = ((x-x1)*dx + (y-y1)*dy)/segLen2;
      t = Math.max(0,Math.min(1,t));
      const d = Math.hypot(x-(x1+dx*t), y-(y1+dy*t));
      if(d < bestD){ bestD = d; bestFrac = (cum[i-1] + t*Math.hypot(dx,dy))/total; }
    }
    return bestFrac;
  }
  // real — настоящий VSlider (значение/скоринг по-прежнему живут в нём),
  // widget лишь рисует и водит "ползунок" по ветвистому пути и синхронизирует
  // real.value туда-обратно, плюс сам зовёт onSliderInput (как обычный драг)
  function makeGearPathWidget(real, mount, key){
    const shape = TRUCKER_GEAR_PATHS[randInt(0, TRUCKER_GEAR_PATHS.length-1)];
    const { cum, total } = gearPathMetrics(shape);
    const realWrap = mount.querySelector('.vslide-wrap');
    if(realWrap) realWrap.style.display = 'none';
    const holder = document.createElement('div');
    holder.className = 'l4-gearpath-holder';
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox','0 0 100 100');
    svg.setAttribute('class','l4-gearpath-svg');
    const trackEl = document.createElementNS(NS,'path');
    trackEl.setAttribute('d', 'M' + shape.map(p=>p.join(',')).join(' L'));
    trackEl.setAttribute('class','l4-gearpath-track');
    svg.appendChild(trackEl);
    const thumbEl = document.createElementNS(NS,'circle');
    thumbEl.setAttribute('r','7');
    thumbEl.setAttribute('class','l4-gearpath-thumb');
    svg.appendChild(thumbEl);
    holder.appendChild(svg);
    mount.appendChild(holder);

    const steps = real.max - real.min + 1;
    const valueToFrac = v => steps>1 ? (v-real.min)/(steps-1) : 0;
    const fracToValue = f => real.min + Math.round(f*(steps-1));
    function render(){
      const [x,y] = gearPointAtFrac(shape, cum, total, valueToFrac(real.value));
      thumbEl.setAttribute('cx', x.toFixed(1)); thumbEl.setAttribute('cy', y.toFixed(1));
    }
    render();

    let dragging = false;
    function handleMove(clientX, clientY){
      const rect = svg.getBoundingClientRect();
      if(!rect.width || !rect.height) return;
      const x = (clientX-rect.left)/rect.width*100, y = (clientY-rect.top)/rect.height*100;
      const frac = gearFracAtXY(shape, cum, total, x, y);
      const newVal = fracToValue(frac);
      if(newVal !== real.value){
        const old = real.value;
        real.value = newVal;
        render();
        onSliderInput(key, newVal, old);
        SFX.tick();
      } else render();
    }
    svg.addEventListener('pointerdown', e=>{
      if(realWrap && (realWrap.classList.contains('disabled') || realWrap.classList.contains('diff-locked'))) return;
      dragging = true;
      try{ svg.setPointerCapture(e.pointerId); }catch(err){}
      handleMove(e.clientX, e.clientY);
      e.preventDefault();
    });
    svg.addEventListener('pointermove', e=>{ if(dragging) handleMove(e.clientX, e.clientY); });
    window.addEventListener('pointerup', ()=>{ dragging = false; });

    return {
      get value(){ return real.value; },
      set value(v){ real.value = v; render(); },
      get min(){ return real.min; }, get max(){ return real.max; }, get step(){ return real.step; },
      configure(o){ real.configure(o); render(); },
      setDisabled(d){ real.setDisabled(d); svg.style.pointerEvents = d ? 'none' : 'auto'; },
      setDiffLocked(d){ real.setDiffLocked(d); svg.style.pointerEvents = d ? 'none' : 'auto'; },
      setFlag(cls,on){ real.setFlag(cls,on); },
      setTrackBackground(){ /* трек теперь SVG-путь, фон не подставляем */ },
      _destroy(){ holder.remove(); if(realWrap) realWrap.style.display = ''; }
    };
  }
  let l4TruckerReal = null, l4TruckerWidgets = null, l4TruckerKeys = [], l4TruckerCurIdx = 0;
  const TRUCKER_LEFT_KEYS = ['color','colorB','sat']; // эти обычно живут в leftCol
  // показать ОДИН правый регулятор (по индексу), спрятать остальные
  function l4TruckerUpdateVisible(){
    l4TruckerKeys.forEach((k,i)=>{
      const mount = $(L4_MOUNT_ID[k]);
      const group = mount && mount.closest('.vslider-group');
      if(group) group.classList.toggle('l4-trucker-off', i !== l4TruckerCurIdx);
    });
  }
  // правка пользователя: переключение ЗАКОЛЬЦОВАНО (size→count→bsize→size…) с
  // анимацией «уезжает вбок и растворяется, с другой стороны заезжает новый»
  // (клипается рамкой регулятора — .l4-trucker-col .vslider-group overflow:hidden).
  let l4TruckerSwitching = false;
  function l4TruckerHolder(i){
    const m = $(L4_MOUNT_ID[l4TruckerKeys[i]]);
    const g = m && m.closest('.vslider-group');
    return { g, h: g && g.querySelector('.l4-gearpath-holder') };
  }
  function l4TruckerSwitch(){
    if(l4TruckerSwitching || l4TruckerKeys.length < 2) return;
    l4TruckerSwitching = true;
    SFX.uiClick();
    const oldO = l4TruckerHolder(l4TruckerCurIdx);
    const newIdx = (l4TruckerCurIdx + 1) % l4TruckerKeys.length; // закольцовано
    if(oldO.h) oldO.h.classList.add('l4-gp-out');
    setTimeout(()=>{
      if(oldO.g) oldO.g.classList.add('l4-trucker-off');
      if(oldO.h) oldO.h.classList.remove('l4-gp-out');
      l4TruckerCurIdx = newIdx;
      const newO = l4TruckerHolder(newIdx);
      if(newO.g) newO.g.classList.remove('l4-trucker-off');
      if(newO.h){
        newO.h.classList.add('l4-gp-prep'); void newO.h.offsetWidth;
        newO.h.classList.remove('l4-gp-prep'); newO.h.classList.add('l4-gp-in');
        setTimeout(()=>{ newO.h.classList.remove('l4-gp-in'); l4TruckerSwitching = false; }, 280);
      } else { l4TruckerSwitching = false; }
    }, 240);
  }
  LEVEL4_FX.trucker_chrome = {
    memorizeStart(){
      $('windowFrame').classList.add('l4-shake');
    },
    craftStart(){
      // Правка (пользователь): «коробка передач» — ОДИН крупный правый регулятор
      // (размер/сгустки/разм. сгуст.) за раз + стрелка-переключатель справа.
      // Новые ползунки со сложностью не добавляются рядом — переключаются кнопкой.
      // Цвет/накал остаются слева обычными ползунками.
      const rightCol = $('rightCol');
      if(rightCol) rightCol.classList.add('l4-trucker-col');
      l4TruckerReal = {}; l4TruckerWidgets = {};
      l4TruckerKeys = [...target.activeKeys].filter(k => S[k] && L4_MOUNT_ID[k] && !TRUCKER_LEFT_KEYS.includes(k));
      l4TruckerKeys.forEach(k=>{
        const mount = $(L4_MOUNT_ID[k]);
        if(!mount) return;
        l4TruckerReal[k] = S[k];
        S[k] = makeGearPathWidget(S[k], mount, k);
        l4TruckerWidgets[k] = S[k];
        const holder = mount.querySelector('.l4-gearpath-holder');
        if(holder) holder.classList.add('l4-gearpath-big'); // крупный, ~длина левых слайдеров
      });
      l4TruckerCurIdx = 0;
      l4TruckerUpdateVisible();
      // стрелка-переключатель (только если правых регуляторов больше одного)
      if(l4TruckerKeys.length > 1 && rightCol && !document.getElementById('l4TruckerNext')){
        const btn = document.createElement('button');
        btn.type = 'button'; btn.id = 'l4TruckerNext'; btn.className = 'l4-trucker-next';
        btn.innerHTML = '▸'; btn.title = LT(UI_TEXT.TRUCKER_NEXT_TITLE);
        btn.addEventListener('click', (e)=>{ e.stopPropagation(); l4TruckerSwitch(); });
        rightCol.appendChild(btn);
      }
      target.craftDuration += 4000;
      target.craftBaseDuration += 4000;
      updatePlayerJar();
    },
    stop(){
      $('windowFrame').classList.remove('l4-shake');
      const rightCol = $('rightCol');
      if(rightCol) rightCol.classList.remove('l4-trucker-col');
      const nb = document.getElementById('l4TruckerNext'); if(nb) nb.remove();
      l4TruckerKeys.forEach(k=>{
        const mount = $(L4_MOUNT_ID[k]);
        const group = mount && mount.closest('.vslider-group');
        if(group) group.classList.remove('l4-trucker-off');
      });
      l4TruckerKeys = [];
      if(l4TruckerWidgets){
        Object.keys(l4TruckerWidgets).forEach(k=>{
          if(l4TruckerWidgets[k]._destroy) l4TruckerWidgets[k]._destroy();
        });
        l4TruckerWidgets = null;
      }
      if(l4TruckerReal){
        Object.keys(l4TruckerReal).forEach(k=>{ S[k] = l4TruckerReal[k]; });
        l4TruckerReal = null;
      }
    }
  };

  // ---------- Инспектор Гильдии: "Допуски" — текстовый лист вместо визуальной подгонки ----------
  // Патч: фазы показа больше нет вообще (см. ветку 'guild_inspector' в
  // showMemorize) — сразу лист "Допуски" со сплошным текстом (не список),
  // числа вшиты в предложения, чтобы их нужно было выискивать чтением, а не
  // глазами. Таймер на воссоздание удвоен (craftStart ниже) — компенсация за
  // то, что читать длиннее, чем смотреть на банку.
  function inspectorKeyBounds(key){
    const cfg = target.cfg;
    switch(key){
      case 'color': case 'colorB': return { min:0, max:cfg.colorSteps-1 };
      case 'size': case 'size2':   return { min:0, max:cfg.sizeSteps-1 };
      case 'bsize':                return { min:0, max:cfg.bsizeSteps-1 };
      case 'count':                return { min:1, max:cfg.countMax };
      case 'sat': case 'shape':    return { min:0, max:9 };
      default: return { min:0, max:0 };
    }
  }
  function inspectorDecoyIdx(key){
    switch(key){
      case 'color': return target.hueIdx;
      case 'colorB': return target.hue2Idx;
      case 'size': return target.sizeIdx;
      case 'size2': return target.size2Idx;
      case 'bsize': return target.bsizeIdx;
      case 'count': return target.count;
      case 'sat': return target.satIdx;
      case 'shape': return target.shapeIdx;
      default: return 0;
    }
  }
  function inspectorFormatValue(key, idx){
    const cfg = target.cfg;
    switch(key){
      case 'color': case 'colorB': return Math.round(idxToVal(idx, cfg.colorSteps, 360)) + '°';
      case 'size': case 'size2':   return Math.round(idxToVal(idx, cfg.sizeSteps, 100)) + '%';
      case 'bsize':                return Math.round(idxToVal(idx, cfg.bsizeSteps, 100)) + '%';
      case 'sat':                  return Math.round(satFromIdx(idx)) + '%';
      default: return String(idx);
    }
  }
  // Патч: числа теперь вшиты прямо в предложение о каждом показателе (не
  // "Ярлык: значение" строкой) — фраза на каждый ключ своя, по-русски и
  // по-английски напрямую (этот текст не авторский лор, а служебный, потому
  // без LT/content.js)
  const INSPECTOR_KEY_PHRASE = {
    color:  v => LANG==='ru' ? `спектр смеси обязан лечь ровно на отметку ${v}` : `the mixture's spectrum must land exactly on the ${v} mark`,
    colorB: v => LANG==='ru' ? `второй спектр градиента должен встать на ${v}` : `the gradient's second spectrum must sit at ${v}`,
    size:   v => LANG==='ru' ? `объём сосуда обязан встать на отметке ${v}` : `the vessel's volume must sit at the ${v} mark`,
    size2:  v => LANG==='ru' ? `высота сосуда отдельно выставляется на ${v}` : `the vessel's height, separately, is set to ${v}`,
    bsize:  v => LANG==='ru' ? `калибр каждого сгустка выставлен на отметке ${v}` : `each blob's caliber is set at the ${v} mark`,
    count:  v => LANG==='ru' ? `внутри обязано плавать ровно ${v} сгустков по счёту` : `there must be exactly ${v} blobs floating inside, by count`,
    sat:    v => LANG==='ru' ? `накал цвета выставляется на отметке ${v}` : `the color's intensity is set at the ${v} mark`,
    shape:  v => LANG==='ru' ? `форма сосуда должна соответствовать образцу №${v}` : `the vessel's shape must match reference #${v}`
  };
  function inspectorActiveKeys(){
    return [...(target.activeKeys||[])].filter(k => S[k] && target.inspectorTarget && target.inspectorTarget[k] !== undefined);
  }
  // сплошной абзац предложений вместо списка "Ярлык: значение" — плюс порядок
  // показателей каждый раз перемешан (по сиду заказа), чтобы нельзя было
  // просто запомнить, "какое число по счёту" отвечает за нужный параметр
  function inspectorJoinSentences(keys){
    const rng = mulberry32((target.seed+4271)>>>0);
    const order = [...keys];
    for(let i=order.length-1;i>0;i--){
      const j = Math.floor(rng()*(i+1));
      [order[i],order[j]] = [order[j],order[i]];
    }
    const clauses = order.map(k=>{
      const gen = INSPECTOR_KEY_PHRASE[k];
      return gen ? gen(inspectorFormatValue(k, target.inspectorTarget[k])) : null;
    }).filter(Boolean);
    if(!clauses.length) return '';
    let s;
    if(clauses.length === 1) s = clauses[0];
    else {
      const and = LANG==='ru' ? ', а ' : ', and ';
      s = clauses.slice(0,-1).join(', ') + and + clauses[clauses.length-1];
    }
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }
  function inspectorBuildText(){
    const keys = inspectorActiveKeys();
    const tpl = INSPECTOR_TOLERANCE_TEMPLATES[target.inspectorTemplateIdx % INSPECTOR_TOLERANCE_TEMPLATES.length];
    return LT(tpl).replace('{SENTENCES}', inspectorJoinSentences(keys)).replace(/\{TOL\}/g, target.inspectorTolerance);
  }
  function l4InspectorShowTolBtn(){
    const wf = $('windowFrame');
    if(!wf || document.getElementById('l4InspectorTolBtn')) return;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.id = 'l4InspectorTolBtn'; btn.className = 'l4-inspector-tol-btn';
    const isL4 = target.regLevel === 4;
    btn.textContent = LT(isL4 ? UI_TEXT.INSPECTOR_INTERROGATE_BTN : UI_TEXT.INSPECTOR_TOL_BTN);
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const el = $('inspectorTolText');
      const titleEl = document.querySelector('#inspectorTolOverlay h3');
      // Фаза 8 (УР.4): вместо листа «Допусков» — протокол допроса (логическая загадка)
      if(target.regLevel === 4){
        if(el) el.innerHTML = inspectorBuildInterrogationHTML();
        if(titleEl) titleEl.textContent = LT(UI_TEXT.INSPECTOR_INTERROGATE_BTN);
      } else {
        if(el) el.textContent = inspectorBuildText();
        if(titleEl) titleEl.textContent = LT(UI_TEXT.INSPECTOR_TOL_BTN);
      }
      $('inspectorTolOverlay').classList.add('show');
    });
    wf.appendChild(btn);
  }
  function l4InspectorHideTolBtn(){
    const el = document.getElementById('l4InspectorTolBtn'); if(el) el.remove();
  }
  // ---------- Инспектор УР.4: логическая загадка-допрос ----------
  // Двое дают показания по каждому активному показателю. По каждому показателю
  // РОВНО один лжёт (называет неверное значение), другой — правду (эталон).
  // Заключение инспектора называет лжеца по каждому показателю → верным считаем
  // показание другого. (Один и тот же может лгать про одно и говорить правду про
  // другое; обоих лжецами по одному показателю инспектор назначить не может.)
  const INSPECTOR_SUSPECTS = [
    { ru:'Задержанный в капюшоне', en:'the hooded detainee' },
    { ru:'Тип с бегающими глазами', en:'the shifty-eyed one' },
    { ru:'Дрожащий контрабандист', en:'the trembling smuggler' },
    { ru:'Молчун у стены', en:'the wall-hugging mute' },
    { ru:'Наглый барыга', en:'the smug dealer' },
    { ru:'Потный курьер', en:'the sweaty courier' }
  ];
  function inspectorParamName(k){
    const m = { color:UI_TEXT.LABEL_SPECTRUM, colorB:UI_TEXT.LABEL_SPECTRUM_B, size:UI_TEXT.LABEL_VOLUME,
      size2:UI_TEXT.LABEL_HEIGHT, bsize:UI_TEXT.LABEL_BSIZE, count:UI_TEXT.LABEL_COUNT,
      sat:UI_TEXT.LABEL_SATURATION, shape:UI_TEXT.LABEL_SHAPE };
    return m[k] ? LT(m[k]) : k;
  }
  function inspectorBuildInterrogationHTML(){
    const keys = inspectorActiveKeys();
    const it = target.inspectorInterrogation;
    if(!it) return inspectorBuildText();
    const clausesFor = (who)=>{
      const cl = keys.map(k=>{
        const gen = INSPECTOR_KEY_PHRASE[k];
        const idx = it.stmts[k][who];
        return gen ? gen(inspectorFormatValue(k, idx)) : null;
      }).filter(Boolean);
      if(!cl.length) return '';
      const s = cl.length === 1 ? cl[0]
        : cl.slice(0,-1).join(', ') + (LANG==='ru'?', а ':', and ') + cl[cl.length-1];
      return s.charAt(0).toUpperCase() + s.slice(1) + '.';
    };
    const concl = keys.map(k=>{
      const liar = LT(it.stmts[k].liar === 'A' ? it.nameObjA : it.nameObjB);
      const p = inspectorParamName(k);
      return LANG==='ru' ? `по «${p}» лжёт ${liar}` : `on “${p}”, ${liar} lies`;
    });
    const intro = LANG==='ru'
      ? 'Протокол допроса. Двое дают показания по эталонной смеси — по каждому показателю один говорит правду, другой лжёт.'
      : 'Interrogation record. Two testify about the reference mixture — on each trait one tells the truth, the other lies.';
    const lead = LANG==='ru' ? 'Заключение инспектора: ' : 'Inspector’s conclusion: ';
    const verdict = LANG==='ru'
      ? 'Верным считай показание того, кто НЕ уличён во лжи по этому показателю.'
      : 'Take as true the statement of whoever is NOT caught lying on that trait.';
    return `<p>${intro}</p>`
      + `<p><b>${LT(it.nameObjA)}:</b> ${clausesFor('A')}</p>`
      + `<p><b>${LT(it.nameObjB)}:</b> ${clausesFor('B')}</p>`
      + `<p class="insp-concl"><b>${lead}</b>${concl.length ? concl.join('; ') + '. ' : ''}${verdict}</p>`;
  }
  LEVEL4_FX.guild_inspector = {
    setup(){
      const keys = [...(target.activeKeys||[])].filter(k => S[k]);
      const tol = randInt(1, 3);
      target.inspectorTolerance = tol;
      target.inspectorTarget = {};
      keys.forEach(k=>{
        const b = inspectorKeyBounds(k);
        const decoy = inspectorDecoyIdx(k);
        let val = randInt(b.min, b.max);
        let guard = 30;
        while(Math.abs(val-decoy) <= tol && guard-- > 0) val = randInt(b.min, b.max);
        target.inspectorTarget[k] = val;
      });
      target.inspectorTemplateIdx = randInt(0, INSPECTOR_TOLERANCE_TEMPLATES.length-1);
      // Фаза 8 (УР.4): строим допрос — показания двух и «кто лжёт» по каждому показателю
      if(target.regLevel === 4){
        const pair = shuffleArr(INSPECTOR_SUSPECTS.slice());
        const nameObjA = pair[0], nameObjB = pair[1];
        const stmts = {};
        keys.forEach(k=>{
          const trueIdx = target.inspectorTarget[k];
          const b = inspectorKeyBounds(k);
          let falseIdx = randInt(b.min, b.max), guard = 30;
          while(Math.abs(falseIdx - trueIdx) <= tol && guard-- > 0) falseIdx = randInt(b.min, b.max);
          const liar = Math.random() < 0.5 ? 'A' : 'B';
          stmts[k] = { A: liar==='A' ? falseIdx : trueIdx, B: liar==='B' ? falseIdx : trueIdx, liar };
        });
        target.inspectorInterrogation = {
          nameObjA, nameObjB,
          nameA: LT(nameObjA), nameB: LT(nameObjB), stmts
        };
      }
    },
    craftStart(){
      l4InspectorShowTolBtn();
      // Патч: фазы показа больше нет — таймер на воссоздание удваиваем,
      // чтобы хватило времени спокойно прочитать сплошной текст "Допусков"
      target.craftDuration *= 2;
      target.craftBaseDuration *= 2;
    },
    stop(){
      l4InspectorHideTolBtn();
      const ov = $('inspectorTolOverlay'); if(ov) ov.classList.remove('show');
    }
  };

  // ---------- Векс: перетаскивание сгустков на запомненные места ----------
  // Патч: механика заменена целиком. На запоминании сгустки стоят на своих
  // местах (плюс реплика Векса внизу). На игре они разлетаются внутри той
  // же зоны банки, и их нужно руками перетащить обратно как можно точнее —
  // это отдельный, более весомый компонент результата (см. computeScoreComponents).
  // Патч: сетка внутри банки — теперь не просто ориентир, а рабочий магнит.
  // Сгустки могут сидеть ТОЛЬКО на пересечениях сетки и нигде больше — даже
  // во время перетаскивания элемент отображается в ближайшем СВОБОДНОМ узле
  // (не под курсором), а не в произвольной точке. Сетка считается по
  // ЗАФИКСИРОВАННОМУ на весь раунд target.size, а не по текущему ползунку
  // "Объём" — иначе узлы "уезжали" бы от места, где реально стоят сгустки.
  const L4_VEX_BLOB_R = 9; // в единицах viewBox банки (0..200 x 0..260) — для скоринга/визуала блоба
  const L4_VEX_GRID_COLS = 4, L4_VEX_GRID_ROWS = 5; // те же деления, что и раньше рисовала визуальная сетка
  let l4VexItems = [], l4VexIsCraft = false, l4VexGridCache = [];
  function l4VexViewBoxToWfPercent(vx, vy){
    const wf = $('windowFrame'), svg = $('jarSvg');
    if(!wf || !svg) return { x:50, y:50 };
    const wfRect = wf.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const vb = (svg.viewBox && svg.viewBox.baseVal) || { width:200, height:260 };
    if(!wfRect.width || !svgRect.width) return { x:50, y:50 };
    // jarSvg вписан в свой квадратный бокс с сохранением пропорций
    // (preserveAspectRatio по умолчанию) — учитываем "письма-ящики" по бокам
    const scale = Math.min(svgRect.width/vb.width, svgRect.height/vb.height);
    const dispW = vb.width*scale, dispH = vb.height*scale;
    const offX = svgRect.left + (svgRect.width-dispW)/2;
    const offY = svgRect.top + (svgRect.height-dispH)/2;
    const screenX = offX + vx*scale, screenY = offY + vy*scale;
    return {
      x: (screenX-wfRect.left)/wfRect.width*100,
      y: (screenY-wfRect.top)/wfRect.height*100
    };
  }
  // строит фиксированный список узлов сетки (% от windowFrame), один раз на раунд
  function l4VexBuildGrid(){
    const geom = computeJarGeom(target.size);
    const gx0 = geom.cx - geom.w/2, gx1 = geom.cx + geom.w/2;
    // Патч (кастомные бутыли): верхний и нижний ряд сетки не должны
    // заезжать в сужающиеся зоны крышки/донышка — узлы сетки рисуются
    // отдельными HTML-элементами поверх экрана, БЕЗ какого-либо клипа, и
    // ничем не перекрываются, в отличие от самой банки в SVG.
    let gy0 = geom.topY+40, gy1 = geom.baseY;
    if(target.customBottle){
      const bg = customBottleGeom(target.customBottle, geom.w, geom.h);
      gy0 = geom.topY + bg.capOnH;
      const safeLf = (target.customBottle.baseTaper.find(([,wf])=>wf<0.999) || [1])[0];
      const span = geom.h - 18;
      const safeT = 1 - bg.baseOnH*(1-safeLf)/span;
      gy1 = geom.topY + 18 + safeT*span;
    }
    const pts = [];
    for(let i=1;i<L4_VEX_GRID_COLS;i++){
      for(let j=1;j<L4_VEX_GRID_ROWS;j++){
        const vx = gx0 + (gx1-gx0)*i/L4_VEX_GRID_COLS;
        const vy = gy0 + (gy1-gy0)*j/L4_VEX_GRID_ROWS;
        pts.push(l4VexViewBoxToWfPercent(vx, vy));
      }
    }
    l4VexGridCache = pts;
  }
  // n РАЗНЫХ случайных узлов сетки (с их индексами — для учёта занятости)
  function l4VexGeneratePositions(n){
    return shuffleArr(l4VexGridCache.map((p,idx)=>({ idx, x:p.x, y:p.y }))).slice(0, n);
  }
  function l4VexNearestFreeNodeIdx(x, y, selfItem){
    let best = -1, bestD = Infinity;
    l4VexGridCache.forEach((p, idx)=>{
      if(l4VexItems.some(it => it !== selfItem && it.gridIdx === idx)) return;
      const d = Math.hypot(p.x-x, p.y-y);
      if(d < bestD){ bestD = d; best = idx; }
    });
    return best;
  }
  function l4VexCreateEl(item){
    const wf = $('windowFrame');
    if(!wf) return;
    const el = document.createElement('div');
    el.className = 'l4-vex-blob';
    el.style.left = item.x+'%'; el.style.top = item.y+'%';
    wf.appendChild(el);
    item.el = el;
    el.addEventListener('pointerdown', e=>{
      if(!l4VexIsCraft) return;
      e.stopPropagation();
      item.dragging = true;
      try{ el.setPointerCapture(e.pointerId); }catch(err){}
      el.classList.add('dragging');
    });
    el.addEventListener('pointermove', e=>{
      if(!item.dragging) return;
      const rect = wf.getBoundingClientRect();
      const rawX = Math.max(2, Math.min(98, (e.clientX-rect.left)/rect.width*100));
      const rawY = Math.max(2, Math.min(98, (e.clientY-rect.top)/rect.height*100));
      // магнит: сгусток визуально всегда лежит в ближайшем СВОБОДНОМ узле,
      // а не под курсором — курсор просто выбирает, к какому узлу тянуть
      const idx = l4VexNearestFreeNodeIdx(rawX, rawY, item);
      if(idx !== -1){
        item.gridIdx = idx;
        item.x = l4VexGridCache[idx].x; item.y = l4VexGridCache[idx].y;
        el.style.left = item.x+'%'; el.style.top = item.y+'%';
      }
    });
    el.addEventListener('pointerup', ()=>{
      if(!item.dragging) return;
      item.dragging = false;
      el.classList.remove('dragging');
      SFX.tick();
    });
  }
  LEVEL4_FX.vex = {
    setup(){
      l4VexBuildGrid();
      target.vexPositions = l4VexGeneratePositions(target.count);
    },
    memorizeStart(){
      l4VexIsCraft = false;
      l4VexItems = (target.vexPositions||[]).map(p=>({ x:p.x, y:p.y, gridIdx:p.idx, dragging:false, el:null }));
      l4VexItems.forEach(item=>l4VexCreateEl(item));
      // Патч (Фаза 0): убрали нижнюю реплику Векса (l4VexLine) — она была
      // нечитаема на фоне циферблата и перекрывала зелье. Механика подсказки
      // не требует. Удаление в craftStart/stop оставлено (безвредно).
    },
    craftStart(){
      l4VexIsCraft = true;
      const el = document.getElementById('l4VexLine'); if(el) el.remove();
      // разлетаются по другим узлам той же сетки — нужно вернуть каждый на своё место
      const scattered = l4VexGeneratePositions(l4VexItems.length);
      l4VexItems.forEach((item,i)=>{
        item.x = scattered[i].x; item.y = scattered[i].y; item.gridIdx = scattered[i].idx; item.dragging = false;
        if(item.el){ item.el.style.left = item.x+'%'; item.el.style.top = item.y+'%'; item.el.classList.add('l4-vex-scatter'); }
      });
      // Патч: "Сгустки" и "Разм. сгуст." Вексу не нужны — позиция сгустков и
      // так фиксированного размера/числа, эти ползунки только сбивали с толку
      const countGroup = $('mCount') && $('mCount').closest('.vslider-group');
      if(countGroup) countGroup.classList.add('l4-fly-hidden');
      const bsizeGroup = $('mBsize') && $('mBsize').closest('.vslider-group');
      if(bsizeGroup) bsizeGroup.classList.add('l4-fly-hidden');
    },
    stop(){
      l4VexIsCraft = false;
      const line = document.getElementById('l4VexLine'); if(line) line.remove();
      // Патч: level4Stop() зовётся ДО computeScoreComponents() — сохраняем
      // финальные позиции на target, иначе к моменту подсчёта очков их уже
      // не будет (l4VexItems затрётся)
      target.vexFinalPositions = l4VexItems.map(item=>({ x:item.x, y:item.y }));
      l4VexItems.forEach(item=>{ if(item.el) item.el.remove(); });
      l4VexItems = [];
      const countGroup = $('mCount') && $('mCount').closest('.vslider-group');
      if(countGroup) countGroup.classList.remove('l4-fly-hidden');
      const bsizeGroup = $('mBsize') && $('mBsize').closest('.vslider-group');
      if(bsizeGroup) bsizeGroup.classList.remove('l4-fly-hidden');
    }
  };

  // ---------- Хранитель Архива: печать на одном регуляторе по очереди ----------
  // Патч: первая печать — на случайном ползунке (как и раньше). Дальше он
  // печатает только ползунок, который уже выставлен ВЕРНО — если верных
  // несколько, чередует между ними по кругу. Если верно не выставлен ни
  // один — печати в этот раз просто нет (все ползунки временно свободны).
  const L4_ARCHIVIST_CORRECT_THRESHOLD = 0.9;
  let l4ArchivistTimer = null, l4ArchivistKey = null, l4ArchivistLastCorrect = null;
  function archivistReseal(isFirst){
    if(!target || target.cfg.id !== 'archivist') return;
    if(l4ArchivistKey && S[l4ArchivistKey]){
      S[l4ArchivistKey].setDisabled(false);
      S[l4ArchivistKey].setFlag && S[l4ArchivistKey].setFlag('l4-sealed', false);
    }
    const keys = [...target.activeKeys].filter(k => S[k]);
    if(!keys.length) return;
    let nextKey = null;
    if(isFirst){
      nextKey = pick(keys);
    } else {
      const { components } = computeScoreComponents();
      const correctKeys = components.filter(c => keys.includes(c.key) && c.score >= L4_ARCHIVIST_CORRECT_THRESHOLD).map(c => c.key);
      if(correctKeys.length){
        const prevIdx = correctKeys.indexOf(l4ArchivistLastCorrect);
        nextKey = correctKeys[(prevIdx+1) % correctKeys.length];
      }
    }
    l4ArchivistKey = nextKey;
    if(!nextKey) return; // ни один ползунок не выставлен верно — печати нет
    l4ArchivistLastCorrect = nextKey;
    S[l4ArchivistKey].setDisabled(true);
    S[l4ArchivistKey].setFlag && S[l4ArchivistKey].setFlag('l4-sealed', true);
  }
  LEVEL4_FX.archivist = {
    craftStart(){
      l4ArchivistKey = null;
      l4ArchivistLastCorrect = null;
      archivistReseal(true);
      l4ArchivistTimer = setInterval(()=>archivistReseal(false), 5000);
    },
    stop(){
      if(l4ArchivistTimer){ clearInterval(l4ArchivistTimer); l4ArchivistTimer = null; }
      if(l4ArchivistKey && S[l4ArchivistKey]){
        S[l4ArchivistKey].setDisabled(false);
        S[l4ArchivistKey].setFlag && S[l4ArchivistKey].setFlag('l4-sealed', false);
      }
      l4ArchivistKey = null;
    }
  };

  // ============================================================
  // Механики УР.4 — блок 2: визуальные/таймерные оверлеи
  // ============================================================

  // ---------- Коллекционер: игра заменена целиком — 16 баночек вместо регуляторов ----------
  // Патч: фаза запоминания теперь ОБЫЧНАЯ (туман/хаос убраны). На игре нет
  // ни одного регулятора и ни циферблата — 4x4 сетка баночек, из которых
  // только одна полностью совпадает с образцом (цвет+форма+кол-во сгустков);
  // часть декоев совпадают ровно по одному из трёх признаков. Размер везде
  // одинаковый средний — размер как параметр тут не участвует вовсе.
  function l4CollectorDifferentInt(val, min, max){
    if(max <= min) return val;
    let v = randInt(min, max), guard = 20;
    while(v === val && guard-- > 0) v = randInt(min, max);
    return v;
  }
  // Фаза 8 (8C): размер сетки растёт по уровню сложности — 2×2 / 3×3 / 4×4 / 5×5.
  function collectorGridN(){
    const L = (target && target.regLevel) || 1;
    return L >= 4 ? 25 : L === 3 ? 16 : L === 2 ? 9 : 4;
  }
  function l4CollectorBuildJars(){
    const cfg = target.cfg;
    const N = collectorGridN();
    const jars = new Array(N);
    const correctIdx = randInt(0, N-1);
    let decoyI = 0;
    for(let i=0;i<N;i++){
      if(i === correctIdx){
        jars[i] = { hue: target.hue, count: target.count, shapeIdx: target.shapeIdx, seed: randInt(1,99999), correct:true };
        continue;
      }
      const cat = ['color','count','shape'][decoyI % 3]; decoyI++;
      let hueIdx = target.hueIdx, count = target.count, shapeIdx = target.shapeIdx;
      if(cat === 'color'){
        count = l4CollectorDifferentInt(count, 1, cfg.countMax);
        shapeIdx = l4CollectorDifferentInt(shapeIdx, 0, SHAPE_PROFILES.length-1);
      } else if(cat === 'count'){
        hueIdx = l4CollectorDifferentInt(hueIdx, 0, cfg.colorSteps-1);
        shapeIdx = l4CollectorDifferentInt(shapeIdx, 0, SHAPE_PROFILES.length-1);
      } else {
        hueIdx = l4CollectorDifferentInt(hueIdx, 0, cfg.colorSteps-1);
        count = l4CollectorDifferentInt(count, 1, cfg.countMax);
      }
      jars[i] = { hue: idxToVal(hueIdx, cfg.colorSteps, 360), count, shapeIdx, seed: randInt(1,99999), correct:false };
    }
    return jars;
  }
  function l4CollectorRenderJarSVG(jar, idx){
    // Патч: каждая ячейка сетки рендерит ПОЛНОЦЕННОЕ зелье — тем же
    // построителем разметки, что и обычная игра (drawJar), а не упрощённую
    // схему "форма+цвет+точки". Размер везде одинаковый средний — размер
    // тут не признак, поэтому sizePct/bubbleR фиксированы.
    const inner = buildJarMarkup({
      hue: jar.hue, sizePct: 50, bubbleCount: Math.min(jar.count, 10), bubbleR: 7,
      seed: jar.seed, shapeIdx: jar.shapeIdx
    }, `col${idx}_`);
    return `<svg viewBox="0 0 200 260" class="collector-jar-svg">${inner}</svg>`;
  }
  function l4CollectorRenderGrid(){
    const grid = $('collectorGrid');
    if(!grid || !target.collectorJars) return;
    grid.innerHTML = '';
    // число колонок = √N (2×2..5×5) — задаётся динамически по уровню
    const cols = Math.round(Math.sqrt(target.collectorJars.length)) || 5;
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    target.collectorJars.forEach((jar, i)=>{
      const cell = document.createElement('div');
      cell.className = 'collector-jar-cell';
      cell.innerHTML = l4CollectorRenderJarSVG(jar, i);
      cell.addEventListener('click', ()=> l4CollectorChoose(i));
      grid.appendChild(cell);
    });
  }
  function l4CollectorChoose(i){
    if(craftLocked || !target.collectorJars) return;
    target.collectorChoiceCorrect = !!target.collectorJars[i].correct;
    SFX.brew();
    finishCraft();
  }
  // Фаза 6 (адаптация предметов): у Коллекционера ползунков нет — «подсказка»
  // (звёздная карта / философский камень / клубок) подсвечивает верную баночку.
  function l4CollectorHighlightCorrect(){
    const grid = $('collectorGrid'); if(!grid || !target || !target.collectorJars) return false;
    const idx = target.collectorJars.findIndex(j => j.correct);
    const cells = grid.querySelectorAll('.collector-jar-cell');
    if(idx >= 0 && cells[idx]){ cells[idx].classList.add('collector-hint'); return true; }
    return false;
  }
  LEVEL4_FX.collector_gz = {
    setup(){
      if(target.shapeIdx === undefined || target.shapeIdx === null){
        target.shapeIdx = randInt(0, SHAPE_PROFILES.length-1);
      }
      // Патч (Ежедневный заказ): "верная" баночка одна на всех игроков —
      // берём её из детерминированного по дате сида, а не из Math.random()
      if(isDailyMode){
        const rng = mulberry32((seedFromDate(new Date()) ^ 0x5A17) >>> 0);
        const cfg = target.cfg;
        target.hueIdx = Math.floor(rng()*cfg.colorSteps);
        target.hue = idxToVal(target.hueIdx, cfg.colorSteps, 360);
        target.count = 1 + Math.floor(rng()*cfg.countMax);
        target.shapeIdx = Math.floor(rng()*SHAPE_PROFILES.length);
      }
      // 15 декоев — ВСЕГДА через обычный Math.random(), разные у каждого
      // игрока и при каждой попытке, даже в дневном режиме
      target.collectorJars = l4CollectorBuildJars();
    },
    craftStart(){
      $('leftCol').classList.add('hidden');
      $('rightCol').classList.add('hidden');
      $('windowFrame').closest('.window-wrap').classList.add('hidden');
      $('panel').classList.add('hidden');
      $('collectorGridWrap').classList.remove('hidden');
      l4CollectorRenderGrid();
    },
    stop(){
      $('leftCol').classList.remove('hidden');
      $('rightCol').classList.remove('hidden');
      $('windowFrame').closest('.window-wrap').classList.remove('hidden');
      $('panel').classList.remove('hidden');
      $('collectorGridWrap').classList.add('hidden');
      const grid = $('collectorGrid'); if(grid) grid.innerHTML = '';
    }
  };

  // ---------- Последний из Ир: мигание планетой убрано целиком ----------
  // Патч: выглядело странно и не несло смысла. Баффы/дебаффы Ир (см.
  // IR_EFFECTS в content.js) усилены и реализованы напрямую в
  // startOrder()/startGuessPhase()/finalizeResult(), отдельная механика
  // УР.4 ему больше не нужна.
  LEVEL4_FX.last_of_ir = {};

  // ---------- Гонщица Кай: гоночный отсчёт + чекпоинты на самом кольце-таймере ----------
  // 3 засечки на кольце (разного цвета/размера — видно, где именно они) —
  // при пересечении банка трясётся всё сильнее и играет свой отсчёт "3…2…GO!"
  let l4KaiTimers = [], l4KaiTimer = null, l4KaiCheckpoints = [], l4KaiCheckpointIdx = 0,
      l4KaiCheckpointsDone = 0, l4KaiCraftStartAt = 0;
  const L4_KAI_MARKS = [
    { f:0.33, color:'#35e0ff', w:4, len:16 },
    { f:0.66, color:'#ff4dd2', w:6, len:22 },
    { f:0.9,  color:'#ff5d6a', w:8, len:30 }
  ];
  LEVEL4_FX.racer_kai = {
    memorizeStart(){
      const dur = target.memDuration || target.cfg.memorizeMs;
      [3,2,1].forEach((n,i)=>{
        l4KaiTimers.push(setTimeout(()=> l4KaiShowCountdown(String(n), false), Math.max(0,dur-3000)+i*1000));
      });
    },
    craftStart(){
      const dur = target.craftDuration || target.cfg.craftMs;
      l4KaiCheckpoints = L4_KAI_MARKS.map(m=> Math.round(dur*m.f));
      l4KaiCheckpointIdx = 0; l4KaiCheckpointsDone = 0;
      l4KaiCraftStartAt = performance.now();
      l4KaiTimer = setInterval(l4KaiCheckCheckpoint, 200);
      l4KaiDrawRingMarks();
      // Фаза 8 (УР.4): ползунки-«колёса» с инерцией — только на УР.4 (база с УР.1 —
      // засечки/тряска/отсчёт; инерция это УР.4-усиление).
      if(target.regLevel === 4){
        [...(target.activeKeys || [])].forEach(k=>{ if(S[k] && S[k].setInertia) S[k].setInertia(true); });
      }
    },
    stop(){
      l4KaiTimers.forEach(clearTimeout); l4KaiTimers = [];
      if(l4KaiTimer){ clearInterval(l4KaiTimer); l4KaiTimer = null; }
      const el = document.getElementById('l4KaiCountdown');
      if(el) el.remove();
      l4KaiClearRingMarks();
      const jarSvg = $('jarSvg');
      if(jarSvg) jarSvg.classList.remove('l4-kai-shake-1','l4-kai-shake-2','l4-kai-shake-3');
      Object.keys(S).forEach(k=>{ if(S[k] && S[k].setInertia) S[k].setInertia(false); });
    },
    scoreBonus(){
      return l4KaiCheckpointsDone > 0 ? { ratingMultAdd: 0.05*l4KaiCheckpointsDone } : null;
    }
  };
  function l4KaiShowCountdown(label, big){
    const wf = $('windowFrame');
    if(!wf) return;
    let el = document.getElementById('l4KaiCountdown');
    if(!el){ el = document.createElement('div'); el.id = 'l4KaiCountdown'; el.className = 'l4-race-countdown'; wf.appendChild(el); }
    el.textContent = label;
    el.classList.toggle('go', !!big);
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    SFX.countdown();
  }
  function l4KaiDrawRingMarks(){
    const svg = $('ringSvg');
    if(!svg) return;
    l4KaiClearRingMarks();
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','l4-kai-marks');
    g.setAttribute('transform', `rotate(-90 ${RING_CX} ${RING_CY})`);
    L4_KAI_MARKS.forEach(m=>{
      const a = m.f * Math.PI * 2;
      const x1 = RING_CX + Math.cos(a)*(RING_R-m.len), y1 = RING_CY + Math.sin(a)*(RING_R-m.len);
      const x2 = RING_CX + Math.cos(a)*(RING_R+6), y2 = RING_CY + Math.sin(a)*(RING_R+6);
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', x1.toFixed(1)); line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1)); line.setAttribute('y2', y2.toFixed(1));
      line.setAttribute('stroke', m.color); line.setAttribute('stroke-width', m.w);
      line.setAttribute('stroke-linecap', 'round');
      g.appendChild(line);
    });
    svg.appendChild(g);
  }
  function l4KaiClearRingMarks(){
    const svg = $('ringSvg');
    const g = svg && svg.querySelector('.l4-kai-marks');
    if(g) g.remove();
  }
  function l4KaiCheckCheckpoint(){
    if(!target || target.cfg.id !== 'racer_kai' || currentPhase !== 'craft' || craftLocked) return;
    const elapsed = performance.now() - l4KaiCraftStartAt;
    if(l4KaiCheckpointIdx < l4KaiCheckpoints.length && elapsed >= l4KaiCheckpoints[l4KaiCheckpointIdx]){
      const sd = computeScoreComponents();
      if(sd.overall >= 0.55) l4KaiCheckpointsDone++;
      l4KaiCheckpointIdx++;
      const jarSvg = $('jarSvg');
      if(jarSvg){
        jarSvg.classList.remove('l4-kai-shake-1','l4-kai-shake-2','l4-kai-shake-3');
        jarSvg.classList.add('l4-kai-shake-'+Math.min(3,l4KaiCheckpointIdx));
      }
      const isLast = l4KaiCheckpointIdx >= l4KaiCheckpoints.length;
      l4KaiShowCountdown(isLast ? LT(UI_TEXT.L4_KAI_GO) : String(4-l4KaiCheckpointIdx), isLast);
    }
  }

  // ---------- DJ Пульсар: механика убрана целиком — вместо неё живой бит ----------
  // Патч: раньше это была игра "попади в такт" (комбо/рейтинг). Теперь никакой
  // механики нет — просто на заднем фоне играет синтезированный электронный
  // бит (Web Audio, без файла-ассета), и вся игровая панель пульсирует в такт:
  // ползунки, банка, плашка заказа и плашка "Готово!".
  const L4_DJ_BEAT_MS = 500;
  let l4DjAudioCtx = null, l4DjBeatTimer = null, l4DjBeatCount = 0;
  function l4DjCtx(){
    if(!l4DjAudioCtx){
      try{ l4DjAudioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ l4DjAudioCtx = null; }
    }
    if(l4DjAudioCtx && l4DjAudioCtx.state === 'suspended') l4DjAudioCtx.resume().catch(()=>{});
    return l4DjAudioCtx;
  }
  function l4DjKick(){
    const ctx = l4DjCtx(); if(!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(46, t+0.15);
    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t+0.18);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t+0.2);
  }
  function l4DjHat(){
    const ctx = l4DjCtx(); if(!ctx) return;
    const t = ctx.currentTime;
    const n = Math.round(ctx.sampleRate*0.05);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<n;i++) data[i] = (Math.random()*2-1) * (1-i/n);
    const noise = ctx.createBufferSource(); noise.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.10, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t+0.05);
    noise.connect(hp); hp.connect(gain); gain.connect(ctx.destination);
    noise.start(t); noise.stop(t+0.06);
  }
  function l4DjBassBlip(){
    const ctx = l4DjCtx(); if(!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t+0.09);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t+0.1);
  }
  function l4DjPulseTargets(){
    return [
      $('windowFrame'), $('panel'), $('orderBubble'),
      ...document.querySelectorAll('.vslide-wrap')
    ].filter(Boolean);
  }
  LEVEL4_FX.dj_pulsar = {
    setup(){
      l4DjBeatCount = 0;
      // Патч (Фаза 0): непрерывная пульсация циферблата на ВЕСЬ заказ DJ (и показ,
      // и игра). Раньше пульс держался только на классе-биту через setInterval и
      // на фазе запоминания мог «затухать». Теперь само кольцо-циферблат крутит
      // бесконечную CSS-анимацию (в композиторе, не зависит от JS-таймеров) —
      // гарантированно пульсирует всю фазу; бит-«кик» ниже добавляется поверх.
      const ring = $('ringSvg'); if(ring) ring.classList.add('dj-ring-pulse');
      l4DjBeatTimer = setInterval(()=>{
        l4DjBeatCount++;
        l4DjKick();
        if(l4DjBeatCount % 2 === 0) l4DjHat();
        if(l4DjBeatCount % 4 === 2) l4DjBassBlip();
        l4DjPulseTargets().forEach(el=>{
          el.classList.remove('l4-dj-beat'); void el.offsetWidth; el.classList.add('l4-dj-beat');
        });
        // Фаза 8 (УР.4): «физика падения» — в фазе варки ползунки подтекают вниз
        // в такт биту (гравитация), игрок держит их наверху, попадая в ритм.
        // Только УР.4 (база с УР.1 — просто пульс/бит без гравитации).
        // Правка (пользователь): падают в 2 раза реже (каждый 2-й бит), музыка/
        // пульс остаются на 500 мс — раньше менялось слишком быстро.
        if(currentPhase === 'craft' && target && target.regLevel === 4 && l4DjBeatCount % 2 === 0){
          (target.activeKeys || []).forEach(k=>{
            const s = S[k]; if(!s || s.value <= s.min) return;
            if(Math.random() < 0.45){
              const prev = s.value;
              s.value = Math.max(s.min, s.value - (s.step || 1));
              onSliderInput(k, s.value, prev);
            }
          });
        }
      }, L4_DJ_BEAT_MS);
    },
    stop(){
      if(l4DjBeatTimer){ clearInterval(l4DjBeatTimer); l4DjBeatTimer = null; }
      const ring = $('ringSvg'); if(ring) ring.classList.remove('dj-ring-pulse');
      l4DjPulseTargets().forEach(el=> el.classList.remove('l4-dj-beat'));
    }
  };

  // ---------- Стажёр Бип: механики нет (Фаза 8, 8C) ----------
  // Самый базовый обучающий персонаж — обычные ползунки на всех уровнях, без
  // уникальной механики. Прежняя УР.4-угадайка «Что там у других?» удалена.
  // (Оверлей #beepGuessOverlay в index.html остаётся неиспользуемым — уберём
  //  в финальной чистке, Фаза 13.)

  // ============================================================
  // Механики УР.4 — блок 3: новые виджеты ввода
  // ============================================================

  // ---------- Логика-9: слайдеры заменены на степпер (+ / − по одному делению) ----------
  const L4_MOUNT_ID = { color:'mColor', colorB:'mColorB', sat:'mSat', size:'mSize', count:'mCount', bsize:'mBsize', shape:'mShape', size2:'mSize2' };
  let l4Logic9Boxes = {};
  LEVEL4_FX.logic9 = {
    craftStart(){
      // Патч: степпер по одному делению медленнее, чем свободный слайдер —
      // таймер на воссоздание увеличен в полтора раза, чтобы хватало кликов
      target.craftDuration = Math.round(target.craftDuration * 1.5);
      target.craftBaseDuration = Math.round(target.craftBaseDuration * 1.5);
      [...target.activeKeys].filter(k => S[k] && L4_MOUNT_ID[k]).forEach(k=>{
        const mount = $(L4_MOUNT_ID[k]);
        if(!mount) return;
        mount.style.position = 'relative';
        const group = mount.closest('.vslider-group');
        if(group) group.classList.add('l4-stepper-group');
        S[k].setFlag('l4-nodrag', true);
        const box = document.createElement('div');
        box.className = 'l4-stepper';
        box.innerHTML = `<button type="button" class="l4-stepper-btn l4-stepper-up">+</button>
          <div class="l4-stepper-val"></div>
          <button type="button" class="l4-stepper-btn l4-stepper-down">−</button>`;
        mount.appendChild(box);
        const valEl = box.querySelector('.l4-stepper-val');
        const refresh = ()=>{ valEl.textContent = S[k].value; };
        box.querySelector('.l4-stepper-up').addEventListener('click', (e)=>{
          e.stopPropagation();
          const sl = S[k], old = sl.value;
          sl.value = Math.min(sl.max, sl.value + (sl.step||1));
          onSliderInput(k, sl.value, old);
          refresh(); SFX.tick();
        });
        box.querySelector('.l4-stepper-down').addEventListener('click', (e)=>{
          e.stopPropagation();
          const sl = S[k], old = sl.value;
          sl.value = Math.max(sl.min, sl.value - (sl.step||1));
          onSliderInput(k, sl.value, old);
          refresh(); SFX.tick();
        });
        refresh();
        l4Logic9Boxes[k] = box;
      });
    },
    stop(){
      Object.keys(l4Logic9Boxes).forEach(k=>{
        l4Logic9Boxes[k].remove();
        const mount = $(L4_MOUNT_ID[k]);
        const group = mount && mount.closest('.vslider-group');
        if(group) group.classList.remove('l4-stepper-group');
        if(S[k]) S[k].setFlag('l4-nodrag', false);
      });
      l4Logic9Boxes = {};
    }
  };

  // ---------- Логик-9 УР.4: бонус-раунд «сбей сгустки» (самолётик) ----------
  // После ≥годноты (см. finishCraft): банка на весь размер, сгустки (мин. 3)
  // падают сверху, снизу самолётик по линии (курсор → X), стреляет раз в секунду.
  // Доля сбитых → множитель рейтинга (+0..+50%). Всё DOM+rAF поверх windowFrame.
  let l4L9Layer = null, l4L9Blobs = [], l4L9Bullets = [], l4L9Raf = null,
      l4L9FireTimer = null, l4L9EndTimer = null, l4L9Move = null,
      l4L9ReleaseTimer = null, l4L9IntroTimer = null,
      l4L9PlaneX = 50, l4L9Shot = 0, l4L9Total = 0;
  function l4Logic9Cleanup(){
    if(l4L9Raf){ cancelAnimationFrame(l4L9Raf); l4L9Raf = null; }
    if(l4L9FireTimer){ clearInterval(l4L9FireTimer); l4L9FireTimer = null; }
    if(l4L9ReleaseTimer){ clearTimeout(l4L9ReleaseTimer); clearInterval(l4L9ReleaseTimer); l4L9ReleaseTimer = null; }
    if(typeof target !== 'undefined' && target) target._l9HideBlobs = false;
    if(l4L9IntroTimer){ clearTimeout(l4L9IntroTimer); l4L9IntroTimer = null; }
    if(l4L9EndTimer){ clearTimeout(l4L9EndTimer); l4L9EndTimer = null; }
    const wf = $('windowFrame');
    if(wf){ if(l4L9Move) wf.removeEventListener('pointermove', l4L9Move); wf.classList.remove('l4-logic-dim'); }
    l4L9Move = null;
    if(l4L9Layer){ l4L9Layer.remove(); l4L9Layer = null; }
    l4L9Blobs = []; l4L9Bullets = [];
  }
  function l4Logic9Fire(){
    if(!l4L9Layer) return;
    const el = document.createElement('div'); el.className = 'l4-logic-bullet';
    el.style.left = l4L9PlaneX+'%'; el.style.top = '82%';
    l4L9Layer.appendChild(el);
    l4L9Bullets.push({ x: l4L9PlaneX, y: 82, el });
    if(SFX.tick) SFX.tick();
  }
  function l4Logic9Frame(){
    // пули вверх
    l4L9Bullets = l4L9Bullets.filter(bl=>{
      bl.y -= 2.6;
      if(bl.y < -4){ if(bl.el) bl.el.remove(); return false; }
      bl.el.style.left = bl.x+'%'; bl.el.style.top = bl.y+'%';
      return true;
    });
    // сгустки падают ТОЛЬКО прямо вниз (без разлёта), и только «выпущенные» (по очереди)
    l4L9Blobs.forEach(b=>{
      if(!b.alive || !b.released) return;
      b.y += b.vy;
      b.x += (b.vx || 0);                                   // диагональ
      if(b.x < 12){ b.x = 12; b.vx = Math.abs(b.vx); }      // отскок от стенок банки
      if(b.x > 88){ b.x = 88; b.vx = -Math.abs(b.vx); }
      if(b.y >= 84){ b.alive = false; b.el.classList.add('miss'); setTimeout(()=>{ if(b.el) b.el.remove(); }, 220); return; }
      b.el.style.left = b.x+'%'; b.el.style.top = b.y+'%';
      for(const bl of l4L9Bullets){
        if(bl.y > -5 && Math.abs(bl.x-b.x) < 6.5 && Math.abs(bl.y-b.y) < 6){
          b.alive = false; l4L9Shot++;
          b.el.classList.add('hit'); setTimeout(()=>{ if(b.el) b.el.remove(); }, 220);
          bl.y = -20; if(bl.el) bl.el.style.top = '-20%';
          if(SFX.good) SFX.good();
          break;
        }
      }
    });
    const plane = document.getElementById('l4LogicPlane');
    if(plane) plane.style.left = l4L9PlaneX+'%';
    // конец, когда ВСЕ выпущены и разрешены (сбиты/упали)
    if(l4L9Blobs.every(b => !b.alive) && !l4L9ReleaseTimer){ l4Logic9Finish(); return; }
    l4L9Raf = requestAnimationFrame(l4Logic9Frame);
  }
  function l4Logic9Finish(){
    const frac = l4L9Total ? l4L9Shot / l4L9Total : 1;
    l4Logic9Cleanup();
    // множитель рейтинга: всё сбил +50%, половина +25%, всё мимо +0%
    target.logic9RatingMult = frac * 0.5;
    target.logic9BonusDone = true;
    const p = target._pendingScore || {};
    finalizeResult(p.scoreData || computeScoreComponents(), p.timeFrac != null ? p.timeFrac : 1);
  }
  function l4Logic9StartShooter(){
    const wf = $('windowFrame');
    l4Logic9Cleanup(); // на всякий случай — остатки прошлого
    if(!wf){ l4Logic9Finish(); return; }
    const N = Math.max(3, target.count || 0);
    l4L9Total = N; l4L9Shot = 0; l4L9PlaneX = 50;
    const layer = document.createElement('div');
    layer.className = 'l4-logic-layer'; layer.id = 'l4LogicLayer';
    wf.appendChild(layer); l4L9Layer = layer;
    // фон (циферблат + зельё) за 2с интро размывается и сереет
    wf.classList.add('l4-logic-dim');
    const hint = document.createElement('div'); hint.className = 'l4-logic-hint';
    hint.textContent = LT(UI_TEXT.LOGIC9_SHOOT_HINT); layer.appendChild(hint);
    const plane = document.createElement('div'); plane.className = 'l4-logic-plane'; plane.id = 'l4LogicPlane';
    plane.textContent = '🛩️'; plane.style.left = '50%'; layer.appendChild(plane);
    // правка пользователя: сгустки «уходят» из банки наверх — прячем их в зелье
    target._l9HideBlobs = true; updatePlayerJar();
    // сгустки собираются ВМЕСТЕ наверху (кучкой у центра), пока не «выпущены».
    // Правка: выглядят как настоящие сгустки зелья (тот же blobPath), а не ⚫.
    for(let i=0;i<N;i++){
      const el = document.createElement('div'); el.className = 'l4-logic-blob';
      const seed = randInt(1, 99999), bp = blobPath(20, 20, 14, seed);
      el.innerHTML = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="21" fill="rgba(125,255,106,.16)"/>`
        + `<path d="${bp}" fill="rgba(125,255,106,.85)" stroke="#0a0d18" stroke-width="2.4"/>`
        + `<path d="${bp}" fill="none" stroke="rgba(220,255,210,.7)" stroke-width="0.9"/>`
        + `<circle cx="15.5" cy="15.5" r="4.2" fill="rgba(255,255,255,.8)"/></svg>`;
      layer.appendChild(el);
      const x = 22 + (i + 0.5) * (56 / N);
      // правка: медленнее на ~50% + могут лететь по ДИАГОНАЛИ (небольшой vx, отскок от стенок)
      const b = { x, y: 8, vy: 0.28 + Math.random()*0.17, vx: (Math.random()-0.5)*0.55, alive:true, released:false, el };
      el.style.left = x+'%'; el.style.top = '8%';
      l4L9Blobs.push(b);
    }
    l4L9Move = (e)=>{
      const rect = wf.getBoundingClientRect(); if(!rect.width) return;
      l4L9PlaneX = Math.min(90, Math.max(10, (e.clientX-rect.left)/rect.width*100));
    };
    wf.addEventListener('pointermove', l4L9Move);
    // 2 секунды «приготовься»: фон темнеет, сгустки ждут наверху, потом — по очереди вниз
    l4L9IntroTimer = setTimeout(()=>{
      l4L9IntroTimer = null;
      if(!l4L9Layer) return;
      l4L9FireTimer = setInterval(l4Logic9Fire, 470); // правка: стреляет в ~1.5 раза чаще
      l4Logic9Fire();
      // правка пользователя: сгустки летят в СЛУЧАЙНОМ порядке, с РАЗНЫМ интервалом —
      // иногда почти одновременно два подряд (крошечный разрыв), максимум тоже урезан.
      const order = shuffleArr(l4L9Blobs.map((_, i) => i));
      let oi = 0;
      const releaseNext = ()=>{
        if(!l4L9Layer || oi >= order.length){ l4L9ReleaseTimer = null; return; }
        const b = l4L9Blobs[order[oi]]; if(b) b.released = true; oi++;
        // 35% — почти сразу следующий (40-170мс), иначе умеренный разрыв (220-820мс)
        const gap = Math.random() < 0.35 ? randInt(40, 170) : randInt(220, 820);
        l4L9ReleaseTimer = setTimeout(releaseNext, gap);
      };
      releaseNext();
      l4L9EndTimer = setTimeout(l4Logic9Finish, 30000); // страховка
      l4L9Raf = requestAnimationFrame(l4Logic9Frame);
    }, 2000);
  }

  // ---------- Парфюмер: цвет×накал одним 2D-пэдом вместо двух слайдеров ----------
  let l4PerfumerEl = null;
  LEVEL4_FX.perfumer = {
    craftStart(){
      $('colorGroupA') && $('colorGroupA').classList.add('l4-pad-hidden');
      $('satGroup') && $('satGroup').classList.add('l4-pad-hidden');
      const leftCol = $('leftCol');
      if(!leftCol) return;
      // Фаза 8 (УР.4): прямоугольный пэд «цвет×накал» превращается в ЦВЕТОВОЙ КРУГ
      // (hue = угол, накал = радиус от центра). На УР.1-3 — прежний пэд.
      const isWheel = target.regLevel === 4;
      const wrap = document.createElement('div');
      wrap.className = 'vslider-group l4-perfumer-pad-group';
      wrap.innerHTML = `<div class="vslider-label">${LT(UI_TEXT.LABEL_SPECTRUM)} × ${LT(UI_TEXT.LABEL_SATURATION)}</div>
        <div class="l4-pad${isWheel ? ' l4-wheel' : ''}" id="l4PerfumerPad"><div class="l4-pad-cursor" id="l4PerfumerCursor"></div></div>`;
      leftCol.appendChild(wrap);
      l4PerfumerEl = wrap;
      const pad = wrap.querySelector('#l4PerfumerPad');
      const cursor = wrap.querySelector('#l4PerfumerCursor');
      let setFromXY;
      if(isWheel){
        const HUE_CONIC = 'conic-gradient(from 0deg, hsl(0,70%,50%), hsl(60,70%,50%), hsl(120,70%,50%), hsl(180,70%,50%), hsl(240,70%,50%), hsl(300,70%,50%), hsl(360,70%,50%))';
        pad.style.background = `radial-gradient(circle at 50% 50%, rgba(30,32,50,.96) 0%, rgba(30,32,50,.2) 52%, rgba(30,32,50,0) 72%), ${HUE_CONIC}`;
        setFromXY = (clientX, clientY)=>{
          const rect = pad.getBoundingClientRect();
          const cx = rect.width/2, cy = rect.height/2, rmax = Math.min(cx, cy) || 1;
          let dx = (clientX-rect.left) - cx, dy = (clientY-rect.top) - cy;
          let dist = Math.hypot(dx, dy);
          if(dist > rmax){ const k = rmax/dist; dx*=k; dy*=k; dist = rmax; }
          let frac = Math.atan2(dy, dx) / (2*Math.PI); if(frac < 0) frac += 1; // 0..1 по кругу
          const hueOld = S.color.value, satOld = S.sat.value;
          const hueVal = Math.min(S.color.max, Math.round(frac * (S.color.max + 1)) % (S.color.max + 1));
          const satVal = Math.round((dist/rmax) * S.sat.max);
          S.color.value = hueVal; S.sat.value = satVal;
          cursor.style.left = ((cx+dx)/rect.width*100)+'%';
          cursor.style.top = ((cy+dy)/rect.height*100)+'%';
          onSliderInput('color', hueVal, hueOld);
          onSliderInput('sat', satVal, satOld);
          SFX.tick();
        };
        const ang0 = (S.color.value/((S.color.max)||1)) * 2*Math.PI;
        const r0 = S.sat.value/((S.sat.max)||1);
        cursor.style.left = (50 + Math.cos(ang0)*r0*50)+'%';
        cursor.style.top = (50 + Math.sin(ang0)*r0*50)+'%';
      } else {
        pad.style.background = `linear-gradient(to right, rgba(30,32,50,.9), rgba(30,32,50,0)), ${RAINBOW_BG}`;
        setFromXY = (clientX, clientY)=>{
          const rect = pad.getBoundingClientRect();
          const px = Math.min(1, Math.max(0, (clientX-rect.left)/rect.width));
          const py = Math.min(1, Math.max(0, (clientY-rect.top)/rect.height));
          const hueOld = S.color.value, satOld = S.sat.value;
          const hueVal = Math.round((1-py) * S.color.max);
          const satVal = Math.round(px * S.sat.max);
          S.color.value = hueVal; S.sat.value = satVal;
          cursor.style.left = (px*100)+'%'; cursor.style.top = (py*100)+'%';
          onSliderInput('color', hueVal, hueOld);
          onSliderInput('sat', satVal, satOld);
          SFX.tick();
        };
        const px0 = S.sat.value/S.sat.max, py0 = 1-(S.color.value/S.color.max);
        cursor.style.left = (px0*100)+'%'; cursor.style.top = (py0*100)+'%';
      }
      let dragging = false;
      pad.addEventListener('pointerdown', e=>{
        dragging = true;
        try{ pad.setPointerCapture(e.pointerId); }catch(err){}
        setFromXY(e.clientX, e.clientY);
        e.preventDefault();
      });
      pad.addEventListener('pointermove', e=>{ if(dragging) setFromXY(e.clientX, e.clientY); });
      window.addEventListener('pointerup', ()=>{ dragging = false; });
    },
    stop(){
      $('colorGroupA') && $('colorGroupA').classList.remove('l4-pad-hidden');
      $('satGroup') && $('satGroup').classList.remove('l4-pad-hidden');
      if(l4PerfumerEl){ l4PerfumerEl.remove(); l4PerfumerEl = null; }
    }
  };

  // ---------- Дитя Сверхновой: доп. эксклюзивный регулятор (поворот) ----------
  // Патч: блик убран целиком (был практически не виден на банке — бесполезный
  // регулятор). Поворот теперь чаще выпадает заметным (≥30°), а не почти нулевым.
  LEVEL4_FX.supernova_child = {
    setup(){
      let rotIdx = randInt(0,35);
      if(rotIdx < 3 && Math.random() < 0.8) rotIdx = randInt(3,35);
      target.rotation = rotIdx*10;
    },
    craftStart(){
      $('rotationGroup') && $('rotationGroup').classList.remove('hidden');
      S.rotation.configure({ min:0, max:35, step:1, value:0 });
      updatePlayerJar();
    },
    stop(){
      $('rotationGroup') && $('rotationGroup').classList.add('hidden');
    }
  };

  // ============================================================
  // Механики УР.4 — блок 4: составные (несколько фаз/эффектов сразу)
  // ============================================================

  // ---------- Аптекарь Мо: полоска "состояния пациента" + доп. рейтинг ----------
  let l4ApothTimer = null, l4ApothFrac = 1;
  LEVEL4_FX.apothecary_mo = {
    craftStart(){
      l4ApothFrac = 1;
      const wf = $('windowFrame');
      // Патч (полоска не обрезана): window-frame — круглая область с
      // overflow:hidden (клип идёт по border-radius:50%, а не по квадрату),
      // поэтому вертикальная полоска у левого края обрезалась сверху/снизу
      // краем окружности. Вешаем её на .window-wrap (родитель, без круглого
      // клипа) — она встаёт СНАРУЖИ циферблата, в зазоре до левых регуляторов.
      const wrap = wf ? wf.parentElement : null;
      if(wrap && wf){
        const bar = document.createElement('div');
        bar.className = 'l4-vitals-bar'; bar.id = 'l4VitalsBar';
        bar.innerHTML = '<div class="l4-vitals-fill" id="l4VitalsFill"></div>';
        wrap.appendChild(bar);
        // .window-wrap центрирует круглый циферблат флексом и может быть
        // шире него на узких/широких экранах — меряем реальные пиксели,
        // а не полагаемся на проценты, чтобы полоска всегда прилипала
        // ровно к левому краю круга, а не куда-то в пустое место сбоку
        const wrapRect = wrap.getBoundingClientRect();
        const frameRect = wf.getBoundingClientRect();
        bar.style.left = Math.round(frameRect.left - wrapRect.left - 18) + 'px';
        bar.style.top = Math.round(frameRect.top - wrapRect.top + frameRect.height*0.04) + 'px';
        bar.style.bottom = 'auto';
        bar.style.height = Math.round(frameRect.height*0.92) + 'px';
      }
      // Фаза 8 (УР.4): поверх зелья постоянно бежит полоса сердцебиения (ЭКГ).
      // Базовая механика (полоска состояния) — на всех уровнях; ЭКГ — только УР.4.
      if(target.regLevel === 4 && wf){
        const hb = document.createElement('div');
        hb.className = 'l4-heartbeat'; hb.id = 'l4Heartbeat';
        hb.innerHTML = `<svg viewBox="0 0 200 40" preserveAspectRatio="none" class="l4-hb-svg"><path class="l4-hb-line" d="M0,20 H14 l3,-12 l4,24 l3,-12 H50 M50,20 H64 l3,-12 l4,24 l3,-12 H100 M100,20 H114 l3,-12 l4,24 l3,-12 H150 M150,20 H164 l3,-12 l4,24 l3,-12 H200"/></svg>`;
        wf.appendChild(hb);
      }
      const start = performance.now();
      const dur = target.craftDuration || target.cfg.craftMs;
      l4ApothTimer = setInterval(()=>{
        const frac = Math.max(0, 1 - (performance.now()-start)/dur);
        l4ApothFrac = frac;
        const fill = document.getElementById('l4VitalsFill');
        if(fill) fill.style.height = (frac*100)+'%';
        const jarSvg = $('jarSvg');
        if(jarSvg) jarSvg.style.filter = `saturate(${(0.25+frac*0.75).toFixed(2)}) blur(${((1-frac)*2.2).toFixed(2)}px)`;
        // сердцебиение учащается по мере ухудшения «состояния пациента»
        const hb = document.getElementById('l4Heartbeat');
        if(hb){ const svg = hb.querySelector('.l4-hb-svg'); if(svg) svg.style.animationDuration = (1.6 + frac*2.2).toFixed(2)+'s'; }
      }, 150);
    },
    stop(){
      if(l4ApothTimer){ clearInterval(l4ApothTimer); l4ApothTimer = null; }
      const bar = document.getElementById('l4VitalsBar'); if(bar) bar.remove();
      const hb = document.getElementById('l4Heartbeat'); if(hb) hb.remove();
      const jarSvg = $('jarSvg'); if(jarSvg) jarSvg.style.filter = '';
    },
    scoreBonus(){
      if(l4ApothFrac <= 0) return null;
      return { ratingMultAdd: 0.5*l4ApothFrac, repBonus: Math.round(4*l4ApothFrac) };
    }
  };

  // ---------- Тот-Кто-Ждёт: банка в виде песочных часов ----------
  // Патч: метроном + угадай-секунды убраны целиком (работало ужасно и
  // непонятно). Вместо этого — просто фиксированная форма банки (песочные
  // часы, SHAPE_PROFILES[4]) на УР.4. Награда за строгие 100% реализована
  // отдельно в finalizeResult()/startOrder() (см. waiterSlowPending ниже).
  LEVEL4_FX.the_waiter = {
    setup(){
      target.shapeIdx = 4; // "Песочные часы" в SHAPE_PROFILES/SHAPE_NAMES
    }
  };

  // ---------- Модница: УР.4 — на запоминании ничего необычного (обычный
  // показ, чуть дольше), на воссоздании доступен только ОДИН ползунок ----------
  // Патч: убрали цикл из 4 цветов на фазе показа целиком — вместо него
  // простая блокировка регуляторов на фазе игры (см. также бонус +1.5с к
  // memDuration в startOrder — "fashionistaL4Bonus").
  // Патч: "дальше" раньше выбирал случайный ползунок (мог вернуться к уже
  // отредактированному раньше, чем добрался до остальных) — теперь порядок
  // перемешивается ОДИН раз в начале раунда и "дальше" просто идёт по кругу
  // этого порядка, так что каждый ползунок посещается ровно один раз за
  // круг, а по исчерпании круг повторяется в том же порядке.
  let l4FashionActiveKey = null, l4FashionOrder = [], l4FashionOrderIdx = 0;
  LEVEL4_FX.fashionista = {
    craftStart(){
      const keys = [...target.activeKeys].filter(k => S[k]);
      if(!keys.length) return;
      l4FashionOrder = shuffleArr(keys);
      l4FashionOrderIdx = 0;
      l4FashionActiveKey = l4FashionOrder[0];
      l4FashionApplyLocks();
      l4FashionShowPhrase();
      l4FashionAddConfirmBtn();
    },
    stop(){
      l4FashionActiveKey = null;
      l4FashionOrder = []; l4FashionOrderIdx = 0;
      [...target.activeKeys].filter(k => S[k]).forEach(k => S[k].setDisabled(false));
      const el = document.getElementById('l4FashionPhrase'); if(el) el.remove();
      const btn = document.getElementById('l4FashionConfirmBtn'); if(btn) btn.remove();
    }
  };
  function l4FashionApplyLocks(){
    [...target.activeKeys].filter(k => S[k]).forEach(k=>{
      S[k].setDisabled(k !== l4FashionActiveKey);
    });
  }
  // Фаза 8, УР.4: текущий регулятор считается «идеальным», если выставлен точно
  // в цель (для основных дискретных характеристик). Прочее (накал и т.п.) не
  // блокируем — чтобы не было софтлока.
  function l4FashionKeyPerfect(key){
    if(!S[key] || !target) return true;
    const v = S[key].value;
    switch(key){
      case 'color':  return v === target.hueIdx;
      case 'size':   return v === target.sizeIdx;
      case 'bsize':  return v === target.bsizeIdx;
      case 'count':  return v === target.count;
      default:       return true;
    }
  }
  function l4FashionNextKey(){
    if(l4FashionOrder.length <= 1) return;
    // Фаза 8 (8C), УР.4: «Дальше» не откроет следующий, пока текущий не идеален —
    // каждое преждевременное нажатие сопровождается возмущённой репликой Модницы.
    if(target.regLevel === 4 && !l4FashionKeyPerfect(l4FashionActiveKey)){
      l4FashionShowPhrase();
      SFX.badPop();
      return;
    }
    l4FashionOrderIdx = (l4FashionOrderIdx + 1) % l4FashionOrder.length;
    l4FashionActiveKey = l4FashionOrder[l4FashionOrderIdx];
    l4FashionApplyLocks();
    l4FashionShowPhrase();
    SFX.uiClick();
  }
  function l4FashionAddConfirmBtn(){
    const wf = $('windowFrame');
    if(!wf || document.getElementById('l4FashionConfirmBtn')) return;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.id = 'l4FashionConfirmBtn'; btn.className = 'l4-fashion-confirm';
    btn.textContent = LT(UI_TEXT.FASHION_CONFIRM_BTN);
    btn.addEventListener('click', (e)=>{ e.stopPropagation(); l4FashionNextKey(); });
    wf.appendChild(btn);
  }
  function l4FashionShowPhrase(){
    const wf = $('windowFrame');
    if(!wf) return;
    let el = document.getElementById('l4FashionPhrase');
    if(!el){ el = document.createElement('div'); el.id = 'l4FashionPhrase'; el.className = 'l4-fashion-phrase'; wf.appendChild(el); }
    el.textContent = typeof FASHIONISTA_BOSSY_PHRASES !== 'undefined' ? LT(pickLocalized(FASHIONISTA_BOSSY_PHRASES)) : '';
  }

  // ---------- Дегустатор (Гурман с Веги): кнопка "Дегустировать" + доделка
  // зелья после первой "какашки" (см. finishCraft/finalizeResult) ----------
  LEVEL4_FX.gourmet_vega = {
    craftStart(){
      const btn = $('brewBtn');
      if(btn) btn.textContent = LT(UI_TEXT.TASTE_BTN);
      // Фаза 8 (УР.4): сброс состояния «дегустации-близости»
      if(target.regLevel === 4){
        target.l4TasteCount = 0;
        target.l4GourmetLocked = new Set();
        l4GourmetClearProx();
      }
    },
    stop(){
      const btn = $('brewBtn');
      if(btn) btn.textContent = LT(UI_TEXT.BREW_BTN);
      const el = document.getElementById('l4TasteNote'); if(el) el.remove();
      l4GourmetClearProx();
    }
  };
  // Целевое значение параметра key для текущего заказа (тот же маппинг, что
  // freezeLockedValue) — нужно для подсветки близости у Гурмана на УР.4.
  function l4TargetValueFor(k){
    const t = target; if(!t) return null;
    switch(k){
      case 'color':  return t.hueIdx;
      case 'colorB': return t.hue2Idx ?? t.hueIdx;
      case 'sat':    return t.satIdx ?? 7;
      case 'size':   return t.sizeIdx;
      case 'size2':  return t.size2Idx ?? t.sizeIdx;
      case 'count':  return t.count;
      case 'bsize':  return t.bsizeIdx;
      case 'shape':  return t.shapeIdx ?? 0;
      default: return null;
    }
  }
  const L4_PROX_CLASSES = ['l4-prox-exact','l4-prox-1','l4-prox-2','l4-prox-3','l4-prox-4'];
  function l4GourmetClearProx(){
    Object.values(S).forEach(s=>{ if(s && s.setFlag) L4_PROX_CLASSES.forEach(c=>s.setFlag(c,false)); });
  }
  // Фаза 8 (Гурман УР.4): одна «проба» — красит активные ползунки по близости к
  // цели (красный далеко → синий точно) и фиксирует точно угаданные.
  function l4GourmetTaste(){
    const active = target.activeKeys || new Set();
    if(!target.l4GourmetLocked) target.l4GourmetLocked = new Set();
    active.forEach(k=>{
      const s = S[k]; if(!s) return;
      if(target.l4GourmetLocked.has(k)) return; // уже зафиксирован
      const tv = l4TargetValueFor(k); if(tv == null) return;
      const range = (s.max - s.min) || 1;
      const dist = Math.abs(s.value - tv);
      L4_PROX_CLASSES.forEach(c=>s.setFlag(c,false));
      if(dist === 0){
        s.setFlag('l4-prox-exact', true);
        s.setDisabled(true);
        target.l4GourmetLocked.add(k);
      } else {
        const p = dist / range;
        const bucket = p <= 0.1 ? 'l4-prox-1' : p <= 0.25 ? 'l4-prox-2' : p <= 0.5 ? 'l4-prox-3' : 'l4-prox-4';
        s.setFlag(bucket, true);
      }
    });
    SFX.tick();
  }
  function l4GourmetAllLocked(){
    if(!target || !target.activeKeys) return false;
    const locked = target.l4GourmetLocked || new Set();
    for(const k of target.activeKeys){ if(S[k] && !locked.has(k)) return false; }
    return true;
  }
  function l4TasteShowRetryNote(){
    const wf = $('windowFrame');
    if(!wf) return;
    let el = document.getElementById('l4TasteNote');
    if(!el){ el = document.createElement('div'); el.id = 'l4TasteNote'; el.className = 'l4-taste-note'; wf.appendChild(el); }
    el.textContent = LT(UI_TEXT.TASTE_RETRY_NOTE);
    SFX.badPop();
  }

  // ---------- Двуликая жрица: банка разделена на 2 половины — свой независимый
  // счётчик сгустков у каждой (макс. 7 на сторону) ----------
  LEVEL4_FX.twofaced_priestess = {
    setup(){
      target.count = Math.min(target.count, 7);
      target.countB = randInt(1, 7);
    },
    craftStart(){
      const group = $('countBGroup');
      if(group) group.classList.remove('hidden');
      S.countB.configure({ min:1, max:7, step:1, value:Math.ceil(7/2) });
      // основной счётчик тоже ограничиваем семью — обе половины равноправны
      S.count.configure({ min:1, max:7, step:1, value:Math.min(7, S.count.value) });
      const lbl = $('countLabel');
      if(lbl){ lbl.setAttribute('data-i18n','LABEL_COUNT_A'); lbl.textContent = LT(UI_TEXT.LABEL_COUNT_A); }
      updatePlayerJar();
    },
    stop(){
      const group = $('countBGroup');
      if(group) group.classList.add('hidden');
      const lbl = $('countLabel');
      if(lbl){ lbl.setAttribute('data-i18n','LABEL_COUNT'); lbl.textContent = LT(UI_TEXT.LABEL_COUNT); }
    }
  };

  // ---------- Бармен плазма-бара: сгустки летают внутри банки на фазе
  // "воссоздай", скорость полёта = ползунок "Скорость" в реальном времени ----------
  // Патч: механику "схвати банку курсором и тряхни" убрали целиком — она
  // никак не была связана со скоростью, а сам полёт во время игры вообще не
  // показывался, поэтому ползунок "Скорость" крутили вслепую. Теперь сгустки
  // летают постоянно, читая текущее значение ползунка каждый кадр — так же,
  // как размер/число/цвет читаются с их ползунков — так что скорость можно
  // выставить на глаз, а движение сразу видно при любой правке любого ползунка.
  let l4BarMoveRafId = null, l4BarMoveBubbles = [], l4BarMoveLastT = 0;
  function l4BarStopMove(){
    if(l4BarMoveRafId){ cancelAnimationFrame(l4BarMoveRafId); l4BarMoveRafId = null; }
    l4BarMoveLastT = 0;
    l4BarMoveBubbles = [];
  }
  function l4BarRescaleSpeed(bubbles, speed){
    bubbles.forEach(b=>{
      const mag = Math.hypot(b.vx, b.vy) || 1;
      const scale = speed/mag;
      b.vx *= scale; b.vy *= scale;
    });
  }
  function l4BarStartMove(){
    l4BarStopMove();
    const cfg = target.cfg;
    function frame(t){
      if(!target || target.cfg.id !== 'plasma_bartender' || currentPhase !== 'craft'){ l4BarMoveRafId = null; return; }
      if(!l4BarMoveLastT) l4BarMoveLastT = t;
      const dt = Math.min(0.05, (t-l4BarMoveLastT)/1000); l4BarMoveLastT = t;
      const size = idxToVal(S.size.value, cfg.sizeSteps, 100);
      const bsize = idxToVal(S.bsize.value, cfg.bsizeSteps, 100);
      const geom = computeJarGeom(size);
      // Патч (кастомные бутыли): профиль зависит от текущей ширины/высоты
      // (донышко сужается пропорционально им), поэтому пересчитывается
      // каждый тик вместе с geom, а не один раз при старте механики
      const profile = target.customBottle ? customBottleGeom(target.customBottle, geom.w, geom.h).points : SHAPE_PROFILES[target.shapeIdx||0].points;
      const r = 3 + (bsize/100)*9;
      const speed = Math.max(5, S.speed.value*10);
      const n = S.count.value;
      if(l4BarMoveBubbles.length === 0 && n > 0){
        l4BarMoveBubbles = makePhysicsBubbles(n, r, geom, profile, target.seed, speed);
      } else {
        // "Сгустки" подвинули прямо на игре — досоздаём/обрезаем на лету
        while(l4BarMoveBubbles.length < n){
          const spot = packBubbles(1, r, geom.w, geom.topY, geom.baseY, profile, randInt(1,999999))[0];
          const ang = Math.random()*Math.PI*2;
          l4BarMoveBubbles.push({ x:spot.x, y:spot.y, vx:Math.cos(ang)*speed, vy:Math.sin(ang)*speed, r });
        }
        if(l4BarMoveBubbles.length > n) l4BarMoveBubbles.length = n;
      }
      l4BarMoveBubbles.forEach(b=>{ b.r = r; });
      l4BarRescaleSpeed(l4BarMoveBubbles, speed);
      stepPhysics(l4BarMoveBubbles, geom, profile, r, dt);
      const hue = idxToVal(S.color.value, cfg.colorSteps, 360);
      drawJar({ hue, hue2:null, sat:70, sizePct:size, bubbleCount:0, bubbleR:r,
        shapeIdx: target.shapeIdx||0, seed: target.seed, overridePositions: l4BarMoveBubbles,
        customBottle: target.customBottle, capIdx: target.capIdx, decor: target.decor });
      l4BarMoveRafId = requestAnimationFrame(frame);
    }
    l4BarMoveRafId = requestAnimationFrame(frame);
  }
  LEVEL4_FX.plasma_bartender = {
    setup(){
      // Патч: скорость полёта — эксклюзивный регулятор для этого НПС. Та же
      // цифра идёт и в анимацию на фазе показа (target.moveSpeed), и как цель
      // для ползунка на фазе игры (target.speed) — раньше это были два никак
      // не связанных случайных числа, и ползунок было не откалибровать визуально.
      target.speed = randInt(0,10)*10;
      target.moveSpeed = Math.max(15, target.speed);
      // Патч (сгустки не должны упираться друг в друга): очень маленькая
      // банка не может физически вместить много очень крупных сгустков без
      // наложения — сужаем целевой размер сгустков, пока они не помещаются
      // с запасом (та же формула минимальной дистанции, что и в packBubbles)
      const sizeFrac = target.size/100;
      const w = 60 + sizeFrac*60, h = 140 + sizeFrac*70;
      const usableArea = w*h*0.5;
      let safety = 0;
      while(safety++ < 20){
        const r = 3 + (target.bsize/100)*9;
        const footprint = Math.pow(2*r+2.5, 2) * 1.15;
        if(target.count*footprint <= usableArea || target.bsize <= 0) break;
        target.bsize = Math.max(0, target.bsize - 10);
      }
    },
    craftStart(){
      $('speedGroup') && $('speedGroup').classList.remove('hidden');
      S.speed.configure({ min:0, max:10, step:1, value:0 });
      l4BarStartMove();
    },
    stop(){
      l4BarStopMove();
      $('speedGroup') && $('speedGroup').classList.add('hidden');
    }
  };

  // ---------- Хозяин Роя: детали разлетаются из банки на запоминании,
  // на воссоздании нужно вручную перетащить каждую с циферблата обратно ----------
  const L4_FLY_ZONE = { xMin:35, xMax:65, yMin:38, yMax:82 }; // % от #windowFrame — грубая зона "банки"
  // Патч: мухи → разные механические детали (у каждой свой символ)
  const L4_SWARM_PARTS = ['⚙️','🔩','🔧','🔗','🧲','🪛','🔋','⛓️'];
  // ART-SWAP (Навигатор Роя): чтобы заменить эмодзи-детали на картинки — впиши
  // сюда пути к изображениям в том же порядке (или на нужные индексы). Пустой/
  // отсутствующий слот => используется эмодзи из L4_SWARM_PARTS.
  // Напр.: const L4_SWARM_PARTS_IMG = ['assets/npc/part1.png','assets/npc/part2.png', ...];
  const L4_SWARM_PARTS_IMG = [];
  let l4FlyItems = [], l4FlySpawnTimeouts = [], l4FlyWalkTimer = null, l4FlyDriftTimer = null, l4FlyIsCraft = false;
  function l4FlyInZone(xPct, yPct){
    return xPct >= L4_FLY_ZONE.xMin && xPct <= L4_FLY_ZONE.xMax && yPct >= L4_FLY_ZONE.yMin && yPct <= L4_FLY_ZONE.yMax;
  }
  function l4FlyUpdateCount(){
    if(!S.count) return;
    const inside = l4FlyItems.filter(f=>f.inside).length;
    S.count.value = Math.max(S.count.min, Math.min(S.count.max, inside));
  }
  function l4FlyCreateEl(fly){
    const wf = $('windowFrame');
    if(!wf) return;
    const el = document.createElement('div');
    el.className = 'l4-fly';
    // ART-SWAP: если для этого индекса задана картинка — рисуем её вместо эмодзи
    const imgSrc = L4_SWARM_PARTS_IMG[fly.id % L4_SWARM_PARTS.length];
    if(imgSrc){
      el.classList.add('l4-fly-img');
      el.style.backgroundImage = `url("${imgSrc}")`;
    } else {
      el.textContent = fly.symbol || '⚙️';
    }
    el.style.left = fly.x+'%'; el.style.top = fly.y+'%';
    wf.appendChild(el);
    fly.el = el;
    el.addEventListener('pointerdown', e=>{
      if(!l4FlyIsCraft) return;
      e.stopPropagation();
      fly.dragging = true;
      try{ el.setPointerCapture(e.pointerId); }catch(err){}
      el.classList.add('dragging');
    });
    el.addEventListener('pointermove', e=>{
      if(!fly.dragging) return;
      const rect = wf.getBoundingClientRect();
      fly.x = Math.max(2, Math.min(98, (e.clientX-rect.left)/rect.width*100));
      fly.y = Math.max(2, Math.min(98, (e.clientY-rect.top)/rect.height*100));
      el.style.left = fly.x+'%'; el.style.top = fly.y+'%';
    });
    el.addEventListener('pointerup', ()=>{
      if(!fly.dragging) return;
      fly.dragging = false;
      el.classList.remove('dragging');
      fly.inside = l4FlyInZone(fly.x, fly.y);
      el.classList.toggle('inside', fly.inside);
      l4FlyUpdateCount();
      updatePlayerJar();
      SFX.tick();
    });
  }
  function l4FlyRandomWalk(fly){
    // как только деталь улетела на циферблат — она замирает на месте
    // (даём её рассмотреть и запомнить, а не заставляем целиться в движущуюся цель)
    if(fly.dragging || l4FlyIsCraft || fly.flownOut || Math.random() < 0.35) return;
    fly.x = Math.max(L4_FLY_ZONE.xMin+3, Math.min(L4_FLY_ZONE.xMax-3, fly.x + rand(-4,4)));
    fly.y = Math.max(L4_FLY_ZONE.yMin+3, Math.min(L4_FLY_ZONE.yMax-3, fly.y + rand(-4,4)));
    if(fly.el){ fly.el.style.left = fly.x+'%'; fly.el.style.top = fly.y+'%'; }
  }
  function l4SwarmShowHint(){
    const wf = $('windowFrame');
    if(!wf) return;
    let hint = document.getElementById('l4SwarmHint');
    if(!hint){ hint = document.createElement('div'); hint.id = 'l4SwarmHint'; hint.className = 'l4-swarm-hint'; wf.appendChild(hint); }
    hint.textContent = LT(UI_TEXT.SWARM_RETURN_TEXT);
    hint.classList.add('show');
  }
  LEVEL4_FX.swarm_navigator = {
    memorizeStart(){
      l4FlyIsCraft = false;
      l4FlyItems = [];
      const n = target.count;
      const half = (target.memDuration || target.cfg.memorizeMs || 6000) / 2;
      for(let i=0;i<n;i++){
        const delay = (i/n) * half;
        l4FlySpawnTimeouts.push(setTimeout(()=>{
          // рождаются ВНУТРИ банки — начало показа
          const fly = { id:i, x:50+rand(-6,6), y:58+rand(-10,10), inside:true, dragging:false,
                        flownOut:false, el:null, symbol: L4_SWARM_PARTS[i % L4_SWARM_PARTS.length] };
          l4FlyItems.push(fly);
          l4FlyCreateEl(fly);
          fly.el.classList.add('inside');
          setTimeout(()=>{
            // разлетаются НАРУЖУ, на циферблат — это и есть то, что нужно запомнить
            const angle = (i/Math.max(1,n))*Math.PI*2 + Math.random()*0.4;
            const r = 32+Math.random()*10;
            fly.x = 50+Math.cos(angle)*r; fly.y = 50+Math.sin(angle)*r;
            fly.inside = false; fly.flownOut = true;
            if(fly.el){
              fly.el.style.left = fly.x+'%'; fly.el.style.top = fly.y+'%';
              fly.el.classList.remove('inside'); fly.el.classList.add('flying-out');
            }
            if(i === n-1) l4SwarmShowHint();
          }, 260);
        }, delay));
      }
      l4FlyWalkTimer = setInterval(()=>{ l4FlyItems.forEach(l4FlyRandomWalk); }, 900);
    },
    craftStart(){
      l4FlyIsCraft = true;
      if(l4FlyWalkTimer){ clearInterval(l4FlyWalkTimer); l4FlyWalkTimer = null; }
      // детали уже разлетелись во время запоминания — просто разрешаем перетаскивание
      l4FlyItems.forEach(fly=>{ fly.dragging = false; });
      // Фаза 8 (уточнение пользователя): дрейф деталей во время игры — это
      // отдельная УР.4-механика («сложнее поймать»). На УР.1-3 детали статичны
      // (ловить легче), на УР.4 — дрейфуют. Дрейфуют только НЕ перетаскиваемые и
      // ещё НЕ возвращённые в банку детали; движение плавное (CSS transition).
      if(l4FlyDriftTimer){ clearInterval(l4FlyDriftTimer); l4FlyDriftTimer = null; }
      if(target.regLevel === 4){
        l4FlyDriftTimer = setInterval(()=>{
          l4FlyItems.forEach(f=>{
            if(f.dragging || f.inside) return;
            f.x = Math.max(4, Math.min(96, f.x + rand(-2.6, 2.6)));
            f.y = Math.max(6, Math.min(94, f.y + rand(-2.6, 2.6)));
            if(f.el){ f.el.style.left = f.x+'%'; f.el.style.top = f.y+'%'; }
          });
        }, 620);
      }
      l4FlyUpdateCount();
      l4SwarmShowHint();
      updatePlayerJar();
      // руками перетаскивать детали дольше, чем крутить ползунок — небольшая добавка времени
      target.craftDuration += 3000;
      target.craftBaseDuration += 3000;
      const mount = $('mCount');
      const group = mount && mount.closest('.vslider-group');
      if(group) group.classList.add('l4-fly-hidden');
      // Патч: "Разм. сгуст." тут ни на что не влияет (детали — фиксированные
      // иконки, а не пузыри) — прячем тот же способом, что и "Сгустки"
      const bmount = $('mBsize');
      const bgroup = bmount && bmount.closest('.vslider-group');
      if(bgroup) bgroup.classList.add('l4-fly-hidden');
    },
    stop(){
      l4FlySpawnTimeouts.forEach(clearTimeout); l4FlySpawnTimeouts = [];
      if(l4FlyWalkTimer){ clearInterval(l4FlyWalkTimer); l4FlyWalkTimer = null; }
      if(l4FlyDriftTimer){ clearInterval(l4FlyDriftTimer); l4FlyDriftTimer = null; }
      l4FlyItems.forEach(f=>{ if(f.el) f.el.remove(); });
      l4FlyItems = [];
      l4FlyIsCraft = false;
      const hint = document.getElementById('l4SwarmHint'); if(hint) hint.remove();
      const mount = $('mCount');
      const group = mount && mount.closest('.vslider-group');
      if(group) group.classList.remove('l4-fly-hidden');
      const bmount = $('mBsize');
      const bgroup = bmount && bmount.closest('.vslider-group');
      if(bgroup) bgroup.classList.remove('l4-fly-hidden');
    }
  };

  // ---------- Уборщик Пятого Дока: грязная банка, чистка курсором-тряпкой ----------
  let l4JanitorCanvas = null, l4JanitorCursorEl = null, l4JanitorMoveHandler = null,
      l4JanitorSampleTimer = null, l4JanitorCleanFrac = 0, l4JanitorRefogTimer = null;
  function l4JanitorPaintGrime(canvas){
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(55,48,28,.85)';
    ctx.fillRect(0,0,w,h);
    for(let i=0;i<18;i++){
      ctx.beginPath();
      const cx = Math.random()*w, cy = Math.random()*h, r = 14+Math.random()*26;
      const g = 25+Math.random()*30|0;
      ctx.fillStyle = `rgba(${30+Math.random()*40|0},${g},${10+Math.random()*15|0},${(0.5+Math.random()*0.35).toFixed(2)})`;
      ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.fill();
    }
  }
  // Уборщик УР.4: экран снова запотевает — периодически докидываем грязь на
  // случайные места (source-over поверх текущего состояния), чтобы игроку
  // приходилось перечищать. Меньше и полупрозрачнее исходной грязи.
  function l4JanitorRefogSome(canvas){
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.globalCompositeOperation = 'source-over';
    for(let i=0;i<6;i++){
      ctx.beginPath();
      const cx = Math.random()*w, cy = Math.random()*h, r = 16+Math.random()*30;
      const g = 25+Math.random()*30|0;
      ctx.fillStyle = `rgba(${30+Math.random()*40|0},${g},${10+Math.random()*15|0},${(0.4+Math.random()*0.3).toFixed(2)})`;
      ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.fill();
    }
  }
  // Фаза 8 (Уборщик): размер губки по уровню — большая на УР.1 (легче отмыть),
  // меньше с ростом сложности (труднее). Радиус в пикселях канваса (≈ px окна).
  function l4JanitorSpongeR(){
    const lvl = (target && target.regLevel) || 3;
    return ({ 1: 74, 2: 60, 3: 50, 4: 40 })[lvl] || 55;
  }
  function l4JanitorWipeAt(canvas, clientX, clientY){
    const rect = canvas.getBoundingClientRect();
    if(!rect.width || !rect.height) return;
    const ctx = canvas.getContext('2d');
    const x = (clientX-rect.left) * (canvas.width/rect.width);
    const y = (clientY-rect.top) * (canvas.height/rect.height);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, l4JanitorSpongeR(), 0, Math.PI*2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  function l4JanitorSampleClean(canvas){
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    let cleaned = 0, total = 0;
    const step = 16;
    for(let y=step/2; y<h; y+=step){
      for(let x=step/2; x<w; x+=step){
        total++;
        if(ctx.getImageData(x,y,1,1).data[3] < 60) cleaned++;
      }
    }
    return total ? cleaned/total : 0;
  }
  function l4JanitorSetupCanvas(){
    const wf = $('windowFrame');
    if(!wf) return null;
    const canvas = document.createElement('canvas');
    canvas.className = 'l4-grime-canvas';
    const rect = wf.getBoundingClientRect();
    canvas.width = Math.round(rect.width) || 460;
    canvas.height = Math.round(rect.height) || 460;
    wf.appendChild(canvas);
    l4JanitorPaintGrime(canvas);
    return canvas;
  }
  function l4JanitorAttachCursor(){
    const wf = $('windowFrame');
    if(!wf) return;
    wf.classList.add('l4-janitor-active');
    const cursor = document.createElement('div');
    cursor.className = 'l4-janitor-cursor';
    cursor.textContent = '🧽';
    // Фаза 8: визуальный размер губки по уровню (в такт радиусу чистки)
    cursor.style.fontSize = Math.round(l4JanitorSpongeR() * 0.95) + 'px';
    wf.appendChild(cursor);
    l4JanitorCursorEl = cursor;
    l4JanitorMoveHandler = (e)=>{
      const rect = wf.getBoundingClientRect();
      cursor.style.left = (e.clientX-rect.left)+'px';
      cursor.style.top = (e.clientY-rect.top)+'px';
      if(l4JanitorCanvas) l4JanitorWipeAt(l4JanitorCanvas, e.clientX, e.clientY);
    };
    wf.addEventListener('pointermove', l4JanitorMoveHandler);
  }
  function l4JanitorDetach(){
    const wf = $('windowFrame');
    if(wf){
      wf.classList.remove('l4-janitor-active');
      if(l4JanitorMoveHandler) wf.removeEventListener('pointermove', l4JanitorMoveHandler);
    }
    if(l4JanitorCursorEl){ l4JanitorCursorEl.remove(); l4JanitorCursorEl = null; }
    if(l4JanitorCanvas){ l4JanitorCanvas.remove(); l4JanitorCanvas = null; }
    if(l4JanitorSampleTimer){ clearInterval(l4JanitorSampleTimer); l4JanitorSampleTimer = null; }
    if(l4JanitorRefogTimer){ clearInterval(l4JanitorRefogTimer); l4JanitorRefogTimer = null; }
    l4JanitorMoveHandler = null;
  }
  LEVEL4_FX.janitor = {
    memorizeStart(){
      l4JanitorCleanFrac = 0;
      l4JanitorCanvas = l4JanitorSetupCanvas();
      l4JanitorAttachCursor();
    },
    craftStart(){
      // грязь возвращается заново — чистка на запоминании сюда не переносится
      if(l4JanitorCanvas){ l4JanitorCanvas.remove(); l4JanitorCanvas = null; }
      l4JanitorCleanFrac = 0;
      l4JanitorCanvas = l4JanitorSetupCanvas();
      if(!l4JanitorCursorEl) l4JanitorAttachCursor();
      l4JanitorSampleTimer = setInterval(()=>{
        if(l4JanitorCanvas) l4JanitorCleanFrac = l4JanitorSampleClean(l4JanitorCanvas);
      }, 400);
      // Фаза 8 (УР.4): экран запотевает снова — каждые ~2с добавляем грязь
      if(target.regLevel === 4){
        l4JanitorRefogTimer = setInterval(()=>{
          if(l4JanitorCanvas) l4JanitorRefogSome(l4JanitorCanvas);
        }, 2000);
      }
    },
    stop(){
      // финальный замер — ДО удаления канваса, чтобы scoreBonus() (он вызовется
      // уже после stop() в finalizeResult) увидел точный итоговый процент
      if(l4JanitorCanvas) l4JanitorCleanFrac = l4JanitorSampleClean(l4JanitorCanvas);
      l4JanitorDetach();
    },
    scoreBonus(){
      if(l4JanitorCleanFrac <= 0) return null;
      return { ratingMultAdd: 0.5*l4JanitorCleanFrac, repBonus: Math.round(4*l4JanitorCleanFrac) };
    }
  };

  // ---------- Фаза 10: Бабушка Мурра (кошачьи лапы) ----------
  // Механика с УР.1: на фазе игры на ползунки и банку СРАЗУ вылезают огромные
  // кошачьи лапы и НЕ уходят сами — их надо быстро кликнуть, чтобы убрать (с
  // «мяу» и шлепком). Убранная лапа возвращается снова через паузу; чем выше
  // уровень — тем короче пауза и тем больше лап одновременно. Скоринг не
  // трогает — это чистая помеха (борьба за видимость под таймером).
  // ART-SWAP: положить ~10 картинок кошачьих лап (PNG с прозрачностью) в
  // assets/npc/paws/ и вписать сюда пути — тогда вместо эмодзи 🐾 будут они
  // (случайная на каждую лапу). Напр.: ['assets/npc/paws/paw1.png', ...].
  const CATLADY_PAW_IMG = [];
  let l4PawTimer = null, l4PawHosts = [];
  // сколько лап одновременно и как быстро возвращаются — по уровню сложности
  function l4PawMaxCount(lvl){ return ({1:1, 2:2, 3:2, 4:3})[lvl] || 2; }
  // правка пользователя: лапы возвращаются заметно медленнее
  function l4PawReturnMs(lvl){ return ({1:5200, 2:4200, 3:3400, 4:2600})[lvl] || 4200; }
  const L4_PAW_HITS_NEEDED = 3; // сколько БЫСТРЫХ кликов нужно, чтобы согнать лапу
  // цели, которые лапа может перекрыть: ТОЛЬКО видимые ползунки (правка
  // пользователя — на само зелье/банку лапы не лезут).
  function l4PawTargets(){
    return [...document.querySelectorAll('.vslider-group')].filter(g => !g.classList.contains('hidden'));
  }
  function l4PawImg(){
    // ART-SWAP: положить ~10 картинок лап в assets/npc/paws/ и вписать пути в
    // CATLADY_PAW_IMG (content.js). Пока пусто → эмодзи-плейсхолдер 🐾.
    const arr = (typeof CATLADY_PAW_IMG !== 'undefined' && CATLADY_PAW_IMG.length) ? CATLADY_PAW_IMG : null;
    return arr ? pick(arr) : '🐾';
  }
  function l4PawSpawnOne(){
    const covered = new Set(l4PawHosts);
    const free = l4PawTargets().filter(t => !covered.has(t));
    if(!free.length) return false;
    const host = pick(free);
    host.classList.add('l4-paw-host');
    const paw = document.createElement('div');
    paw.className = 'l4-paw';
    // лёгкий случайный разворот/сдвиг — чтобы лапы не выглядели одинаково
    const rot = randInt(-18, 18);
    paw.style.setProperty('--paw-rot', rot + 'deg');
    paw.innerHTML = visualHTML(l4PawImg(), 'l4-paw-img');
    // правка пользователя: одна лапа сгоняется НЕСКОЛЬКИМИ быстрыми кликами.
    // Обычный (одиночный) клик — лапа лишь трясётся; серия из L4_PAW_HITS_NEEDED
    // быстрых кликов (без пауз >800мс) — убирает её.
    let hits = 0, lastHit = 0;
    const onHit = (e)=>{
      if(e){ e.preventDefault(); e.stopPropagation(); }
      const now = performance.now();
      if(now - lastHit > 800) hits = 0; // серия прервалась — считаем заново
      lastHit = now; hits++;
      SFX.pawClick();
      paw.classList.remove('l4-paw-shake'); void paw.offsetWidth; paw.classList.add('l4-paw-shake');
      if(hits >= L4_PAW_HITS_NEEDED){
        SFX.meow();
        paw.classList.add('l4-paw-off');
        host.classList.remove('l4-paw-host');
        l4PawHosts = l4PawHosts.filter(h => h !== host);
        setTimeout(()=>paw.remove(), 180);
      }
    };
    paw.addEventListener('pointerdown', onHit);
    host.appendChild(paw);
    l4PawHosts.push(host);
    return true;
  }
  function l4PawDetach(){
    if(l4PawTimer){ clearInterval(l4PawTimer); l4PawTimer = null; }
    document.querySelectorAll('.l4-paw').forEach(p => p.remove());
    document.querySelectorAll('.l4-paw-host').forEach(h => h.classList.remove('l4-paw-host'));
    l4PawHosts = [];
  }
  LEVEL4_FX.catlady = {
    craftStart(){
      l4PawDetach();
      const lvl = target.regLevel;
      const maxPaws = l4PawMaxCount(lvl);
      // лапы стоят сразу с начала фазы игры
      for(let i=0;i<maxPaws;i++) l4PawSpawnOne();
      // и «докидываются» обратно, если игрок какие-то согнал (быстрее с уровнем)
      l4PawTimer = setInterval(()=>{
        if(l4PawHosts.length < maxPaws) l4PawSpawnOne();
      }, l4PawReturnMs(lvl));
    },
    stop(){ l4PawDetach(); }
  };

  // ---------- Фаза 10: Инженер навигатора (бегающий указатель + зоны) ----------
  // Механика с УР.1: фазы запоминания НЕТ (цель показана как зоны прямо на треке).
  // Вместо перетаскивания — треугольный указатель бегает по шкале синусоидой
  // (медленно у краёв, быстро в центре). Кнопка «стоп» под ползунком фиксирует
  // значение = позиция указателя. Оценка по зоне попадания: тёмно-зелёная = 100%,
  // зелёная = 75%, синяя (бычий глаз) = 100%, красная (УР.4) = 0% (ловушка),
  // мимо всех зон = 0%. Зоны/пороги растут по уровню (труднее).
  // half-widths — доли трека (0..1); score — доля попадания.
  const ENG_ZONES = {
    1: { green:{w:0.20, v:1.00} },
    2: { green:{w:0.17, v:0.75}, dark:{w:0.07, v:1.00} },
    3: { green:{w:0.15, v:0.70}, dark:{w:0.08, v:0.85}, blue:{w:0.035, v:1.00} },
    4: { green:{w:0.14, v:0.70}, dark:{w:0.075, v:0.85}, blue:{w:0.03, v:1.00}, red:{w:0.24, v:0.00} }
  };
  // правка пользователя: медленнее и плавнее (но не слишком)
  const ENG_PERIOD_MS = { 1:2500, 2:2200, 3:1900, 4:1600 }; // период пробега указателя
  const ENG_KEYS = ['color','size','count','bsize'];
  let engState = null; // { pointers:{key:{el, frac, phase, trackH, wrap, stopped}}, rafId }
  function engScorableKey(k){ return ENG_KEYS.includes(k); }
  function engClamp01(v){ return Math.max(0, Math.min(1, v)); }
  function engCenterFrac(key){
    const cfg = target.cfg;
    if(key === 'color') return engClamp01((target.hueIdx||0)/Math.max(1, cfg.colorSteps-1));
    if(key === 'size')  return engClamp01((target.sizeIdx||0)/Math.max(1, cfg.sizeSteps-1));
    if(key === 'bsize') return engClamp01((target.bsizeIdx||0)/Math.max(1, cfg.bsizeSteps-1));
    if(key === 'count') return engClamp01(((target.count||1)-1)/Math.max(1, cfg.countMax-1));
    return 0.5;
  }
  function engZoneScore(dist, lvl){
    const z = ENG_ZONES[lvl] || ENG_ZONES[1];
    if(z.blue && dist <= z.blue.w) return z.blue.v;
    if(z.dark && dist <= z.dark.w) return z.dark.v;
    if(dist <= z.green.w) return z.green.v;
    if(z.red && dist <= z.red.w) return 0;                       // красная ловушка
    // мимо всех зон — мягкий распад по близости (чтоб не был чистый ноль)
    return Math.max(0, 0.35 * (1 - (dist - z.green.w) / 0.35));
  }
  // фон-градиент трека: правка пользователя — ПЛАВНЫЕ переходы между зонами
  // (одиночные стопы, CSS сам интерполирует), а не резкие полосы. Центр c —
  // ярче всего (bull's-eye), к краям зелёный тускнеет; на УР.4 снаружи — красный.
  function engGradient(c, lvl){
    const z = ENG_ZONES[lvl] || ENG_ZONES[1];
    const base = '#1a2233';
    const core = z.blue ? '#48b4ff' : '#5cff77';        // ядро (синий/яркий-зелёный)
    const mid  = 'rgba(125,255,106,.92)';               // тёмно-зелёная зона
    const soft = 'rgba(125,255,106,.34)';               // край зелёной, тускнеет
    const red  = 'rgba(255,93,106,.85)';                // красная ловушка (УР.4)
    const gw = z.green.w, dw = z.dark ? z.dark.w : gw * 0.5;
    const st = (f, col) => `${col} ${(engClamp01(f) * 100).toFixed(1)}%`;
    const s = [ st(0, base) ];
    if(z.red){ const rw = z.red.w; s.push(st(c - rw, base)); s.push(st(c - (gw + rw) / 2, red)); }
    s.push(st(c - gw, soft));
    s.push(st(c - dw, mid));
    s.push(st(c, core));
    s.push(st(c + dw, mid));
    s.push(st(c + gw, soft));
    if(z.red){ const rw = z.red.w; s.push(st(c + (gw + rw) / 2, red)); s.push(st(c + rw, base)); }
    s.push(st(1, base));
    return 'linear-gradient(to top,' + s.join(',') + ')';
  }
  function engStopKey(key){
    if(!engState) return;
    const p = engState.pointers[key];
    if(!p || p.stopped) return;
    p.stopped = true;
    // значение ползунка = позиция указателя
    const s = S[key];
    if(s){ const v = Math.round(s.min + p.frac*(s.max - s.min)); s.value = Math.min(s.max, Math.max(s.min, v)); }
    if(!target.engStopped) target.engStopped = {};
    target.engStopped[key] = p.frac;
    p.el.classList.add('eng-pointer-stopped');
    if(p.btn){ p.btn.disabled = true; p.btn.classList.add('eng-stopped'); }
    SFX.uiClick();
    updatePlayerJar();
  }
  function engBuildOne(key, lvl){
    const mount = $('m' + key.charAt(0).toUpperCase() + key.slice(1));
    if(!mount) return;
    const wrap = mount.querySelector('.vslide-wrap');
    const track = mount.querySelector('.vslide-track');
    const group = mount.closest('.vslider-group');
    if(!wrap || !track || !group) return;
    const s = S[key];
    if(s) s.setDisabled(true); // перетаскивать нельзя — только «стоп»
    wrap.classList.add('eng-no-thumb'); // правка: сам ползунок (бегунок) скрыт
    const c = engCenterFrac(key);
    track.style.background = engGradient(c, lvl);
    const trackH = track.getBoundingClientRect().height || parseFloat(track.style.height) || 260;
    // треугольный указатель справа от трека
    const el = document.createElement('div');
    el.className = 'eng-pointer';
    wrap.appendChild(el);
    // кнопка «стоп» под ползунком
    let btn = group.querySelector('.eng-stop-btn');
    if(!btn){
      btn = document.createElement('button');
      btn.className = 'eng-stop-btn';
      btn.textContent = LT((typeof UI_TEXT !== 'undefined' && UI_TEXT.ENG_STOP_BTN) || {ru:'СТОП',en:'STOP'});
      group.appendChild(btn);
    }
    btn.disabled = false; btn.classList.remove('eng-stopped');
    // правка пользователя: стоп РОВНО в момент НАЖАТИЯ (pointerdown), а не отпускания —
    // click срабатывает на release и ощущался как «пинг». engStopKey защищён от повтора.
    btn.onclick = null;
    btn.addEventListener('pointerdown', (e)=>{ e.preventDefault(); engStopKey(key); });
    engState.pointers[key] = { el, btn, frac:0.5, phase: Math.random()*Math.PI*2, trackH, stopped:false };
  }
  function engFrame(now){
    if(!engState) return;
    const lvl = target.regLevel;
    const period = ENG_PERIOD_MS[lvl] || 1500;
    const w = 2*Math.PI / period;
    for(const key in engState.pointers){
      const p = engState.pointers[key];
      if(p.stopped) continue;
      // синус: медленно у краёв, быстро в центре
      p.frac = 0.5 + 0.5*Math.sin(p.phase + now*w);
      p.el.style.bottom = (p.frac * p.trackH).toFixed(1) + 'px';
    }
    engState.rafId = requestAnimationFrame(engFrame);
  }
  function engStart(){
    engStop();
    engState = { pointers:{}, rafId:null };
    target.engStopped = {};
    const lvl = target.regLevel;
    const keys = [...(target.activeKeys || [])].filter(engScorableKey);
    keys.forEach(k => engBuildOne(k, lvl));
    engState.rafId = requestAnimationFrame(engFrame);
  }
  function engStop(){
    if(engState){
      if(engState.rafId) cancelAnimationFrame(engState.rafId);
      for(const key in engState.pointers){ const p = engState.pointers[key]; if(p.el) p.el.remove(); }
      engState = null;
    }
    document.querySelectorAll('.eng-stop-btn').forEach(b => b.remove());
  }
  LEVEL4_FX.engineer = {
    craftStart(){ engStart(); },
    stop(){ engStop(); }
  };

  // ---------- Фаза 10: Маркетолог с безлюдного спутника (хаос-панель) ----------
  // Механика с УР.1: в фазе игры обычные колонки ползунков прячутся, справа —
  // панель из десятков случайно разбросанных контролов трёх типов (ползунок,
  // крутилка, кнопки +/−) на фоне газеты (рекламные обрывки просвечивают). Для
  // КАЖДОЙ активной характеристики реально работает ровно ОДИН случайный контрол
  // (пишет в S[key] → банка/скоринг как обычно), остальные — обманки (крутятся,
  // но ни на что не влияют). На УР.4 текст газеты постоянно меняется (хаос).
  // Скоринг и фаза показа НЕ меняются — это чистая обфускация ввода.
  // ART-SWAP: MARKETER_BG_IMG — картинка-газета вместо процедурных обрывков.
  const MARKETER_BG_IMG = null;
  let marketerState = null;
  function mkRandType(){ return pick(['slider','dial','button']); }
  function mkMakeControl(type){
    const el = document.createElement('div');
    el.className = 'mk-ctrl mk-' + type;
    if(type === 'button'){
      el.innerHTML = `<button class="mk-btn mk-up" type="button">▲</button><button class="mk-btn mk-dn" type="button">▼</button>`;
    } else if(type === 'dial'){
      el.innerHTML = `<div class="mk-knob"><span class="mk-knob-mark"></span></div>`;
    } else {
      el.innerHTML = `<div class="mk-strack"><div class="mk-sthumb"></div></div>`;
    }
    return el;
  }
  function mkFlash(el, ok){
    el.classList.remove(ok ? 'mk-real-hit' : 'mk-wiggle');
    void el.offsetWidth;
    el.classList.add(ok ? 'mk-real-hit' : 'mk-wiggle');
  }
  function mkWire(el, type, key){
    const real = !!key;
    const s = real ? S[key] : null;
    let norm = s ? (s.value - s.min)/((s.max - s.min) || 1) : 0.5;
    const apply = ()=>{
      norm = Math.max(0, Math.min(1, norm));
      if(real && s){ s.value = Math.round(s.min + norm*(s.max - s.min)); updatePlayerJar(); }
    };
    const feedback = ()=>{ if(real){ SFX.tick(); } else { SFX.uiClick(); mkFlash(el, false); } };
    if(type === 'button'){
      const step = 1 / Math.max(1, s ? (s.max - s.min) : 6);
      const up = el.querySelector('.mk-up'), dn = el.querySelector('.mk-dn');
      up.onclick = e=>{ e.preventDefault(); norm += step; apply(); feedback(); };
      dn.onclick = e=>{ e.preventDefault(); norm -= step; apply(); feedback(); };
    } else if(type === 'dial'){
      const knob = el.querySelector('.mk-knob'), mark = el.querySelector('.mk-knob-mark');
      let dragging = false, lastY = 0;
      const setRot = ()=>{ mark.style.transform = `rotate(${(norm*300 - 150).toFixed(0)}deg)`; };
      knob.addEventListener('pointerdown', e=>{ dragging = true; lastY = e.clientY; try{ knob.setPointerCapture(e.pointerId); }catch(_){}; e.preventDefault(); });
      knob.addEventListener('pointermove', e=>{ if(!dragging) return; const dy = lastY - e.clientY; lastY = e.clientY; norm += dy*0.012; apply(); setRot(); feedback(); });
      knob.addEventListener('pointerup', ()=>{ dragging = false; });
      knob.addEventListener('pointercancel', ()=>{ dragging = false; });
      setRot();
    } else {
      const track = el.querySelector('.mk-strack'), thumb = el.querySelector('.mk-sthumb');
      const setY = clientY=>{ const r = track.getBoundingClientRect(); norm = 1 - (clientY - r.top)/(r.height || 1); apply(); thumb.style.bottom = (Math.max(0,Math.min(1,norm))*100).toFixed(0) + '%'; feedback(); };
      let dragging = false;
      track.addEventListener('pointerdown', e=>{ dragging = true; try{ track.setPointerCapture(e.pointerId); }catch(_){}; setY(e.clientY); e.preventDefault(); });
      track.addEventListener('pointermove', e=>{ if(dragging) setY(e.clientY); });
      track.addEventListener('pointerup', ()=>{ dragging = false; });
      track.addEventListener('pointercancel', ()=>{ dragging = false; });
      thumb.style.bottom = (norm*100).toFixed(0) + '%';
    }
  }
  function mkFillNews(bg){
    if(MARKETER_BG_IMG){ bg.style.backgroundImage = `url(${MARKETER_BG_IMG})`; bg.innerHTML = ''; return; }
    const ads = (typeof MARKETER_ADS !== 'undefined' && MARKETER_ADS.length) ? MARKETER_ADS : [{ru:'РАСПРОДАЖА',en:'SALE'}];
    let html = '';
    for(let i=0;i<11;i++){
      const a = LT(pick(ads));
      html += `<span class="mk-ad" style="left:${randInt(1,68)}%;top:${randInt(1,90)}%;font-size:${randInt(9,19)}px;transform:rotate(${randInt(-10,10)}deg)">${a}</span>`;
    }
    bg.innerHTML = html;
  }
  function marketerBuild(){
    marketerStop();
    const row = document.querySelector('.control-row');
    if(!row) return;
    // правка пользователя: банку НЕ меняем (размер/видимость), лишь сдвигаем влево —
    // панель справа. leftCol/rightCol прячем.
    row.classList.add('mk-row');
    const left = $('leftCol'), right = $('rightCol');
    if(left) left.classList.add('mk-hidden');
    if(right) right.classList.add('mk-hidden');
    const panel = document.createElement('div');
    panel.className = 'marketer-panel';
    // фон-«газета»: ART-SWAP MARKETER_BG_IMG (пользователь подставит картинку),
    // иначе процедурные обрывки. Рамка панели — в CSS (.marketer-panel).
    const bg = document.createElement('div');
    bg.className = 'mk-news';
    mkFillNews(bg);
    panel.appendChild(bg);
    // правка пользователя: контролы КРУПНЫЕ и НЕ налезают друг на друга — раскладка
    // сеткой (grid авто-заполнение), лёгкий случайный разворот для «хаоса».
    const grid = document.createElement('div');
    grid.className = 'mk-grid';
    panel.appendChild(grid);
    row.appendChild(panel);
    const activeKeys = [...(target.activeKeys || [])].filter(k => S[k] && ['color','size','count','bsize'].includes(k));
    const specs = activeKeys.map(k => ({ real:true, key:k, type: mkRandType() }));
    const decoyCount = Math.max(6, 12 - activeKeys.length); // всего ~12 КРУПНЫХ контролов
    for(let i=0;i<decoyCount;i++) specs.push({ real:false, type: mkRandType() });
    shuffleArr(specs).forEach(spec=>{
      const cell = document.createElement('div');
      cell.className = 'mk-cell';
      const el = mkMakeControl(spec.type);
      el.style.setProperty('--mk-rot', randInt(-13, 13) + 'deg');
      cell.appendChild(el);
      grid.appendChild(cell);
      mkWire(el, spec.type, spec.real ? spec.key : null);
    });
    marketerState = { panel, bg, textTimer:null };
    // УР.4: газета «плывёт» — обрывки текста меняются
    if(target.regLevel === 4){
      marketerState.textTimer = setInterval(()=>{ if(marketerState) mkFillNews(bg); }, 900);
    }
  }
  function marketerStop(){
    if(marketerState){
      if(marketerState.textTimer) clearInterval(marketerState.textTimer);
      if(marketerState.panel) marketerState.panel.remove();
      marketerState = null;
    }
    document.querySelectorAll('.marketer-panel').forEach(p => p.remove());
    const row = document.querySelector('.control-row'); if(row) row.classList.remove('mk-row');
    const left = $('leftCol'), right = $('rightCol');
    if(left) left.classList.remove('mk-hidden');
    if(right) right.classList.remove('mk-hidden');
  }
  LEVEL4_FX.marketer = {
    craftStart(){ marketerBuild(); },
    stop(){ marketerStop(); }
  };

  // ---------- сложность регуляторов (Фаза C) ----------
  // Возвращает Set ключей регуляторов, доступных игроку на данном уровне
  // сложности (1/2/3) для конкретного заказа (target уже собран в startOrder:
  // содержит cfg, flags, focus).
  // Правила (см. roadmap.md / фаза C):
  //  - 3: всё доступно, как раньше (полный набор из flags)
  //  - без модификатора и без "усложнения" (обычный normal-заказ):
  //      1: только цвет
  //      2: цвет (+оттенок, если есть) + размер банки
  //  - с модификатором (focus): 1 — только регуляторы модификатора;
  //      2 — плюс цвет (если модификатор не цвет) либо плюс размер банки
  //      (если модификатор — цвет)
  //  - с "усложнением" 5-го уровня (type: gradient/shape/moving, фокуса
  //    у них не бывает): 1 — только регуляторы усложнения; 2 — плюс ещё
  //    один регулятор по тому же принципу (цвет, если его не было)
  function computeActiveKeys(level, target){
    const flags = target.flags, focus = target.focus, cfg = target.cfg;
    // Патч (Сверхновая): при dual_size габарит распадается на ширину
    // ('size') и высоту ('size2') — они всегда ходят парой
    const dual = cfg.special === 'dual_size';
    const allKeys = ['color','size','count','bsize'];
    if(dual) allKeys.splice(2, 0, 'size2');
    if(flags.hasSat) allKeys.push('sat');
    if(flags.hasGradient) allKeys.push('colorB');
    if(flags.hasShape) allKeys.push('shape');
    // Патч "УР.4" (Сверхновая): эксклюзивный регулятор — поворот
    if(cfg.id === 'supernova_child' && level === 4) allKeys.push('rotation');
    // Патч "УР.4" (Бармен): эксклюзивный регулятор — скорость тряски
    if(cfg.id === 'plasma_bartender' && level === 4) allKeys.push('speed');
    // Патч "УР.4" (Двуликая жрица): второй, независимый счётчик сгустков
    if(cfg.id === 'twofaced_priestess' && level === 4) allKeys.push('countB');
    // Векс (Фаза 8: механика на всех уровнях): доп. компонент результата —
    // положение сгустков (их таскают к узлам сетки)
    if(cfg.id === 'vex') allKeys.push('vexPosition');
    const allSet = new Set(allKeys);
    // Векс: сгустки фиксированного числа/размера — обычные "Сгустки"/"Разм. сгуст."
    // ему не нужны ни на экране, ни в очках (число задаётся уровнем, размер — дрэгом)
    if(cfg.id === 'vex'){ allSet.delete('count'); allSet.delete('bsize'); }
    // Патч "УР.4" (Хозяин Роя): детали — фиксированные иконки без размера,
    // "Разм. сгуст." тут нечего оценивать (счётчик "Сгустки" при этом остаётся —
    // он и есть механика "сколько деталей вернули в банку")
    if(cfg.id === 'swarm_navigator' && level === 4){ allSet.delete('bsize'); }

    // ---- Фаза 8 (2, по запросу пользователя): кастомная раскладка у двух НПС ----
    // Парфюмер: его фишка — пэд «цвет × накал» — работает с УР.1. Размера банки
    // на УР.1 у него НЕТ (банка стандартная); УР.2 +размер банки; УР.3 +сгустки
    // +размер сгустков; УР.4 = как УР.3 (накал у него и так с УР.1).
    if(cfg.id === 'perfumer'){
      const p = new Set(['color']);
      if(allSet.has('sat')) p.add('sat');
      if(level >= 2) p.add('size');
      if(level >= 3){ p.add('count'); p.add('bsize'); }
      return p;
    }
    // Навигатор Роя (уточнение пользователя): отдельных ползунков «Сгустки»/
    // «Разм. сгуст.» у него НЕТ. Но «детали» — это его механика: сколько деталей
    // перетащил обратно в банку, пишется в count (l4FlyUpdateCount), слайдер count
    // при этом СКРЫТ (l4-fly-hidden) и ведётся перетаскиванием. Поэтому count
    // остаётся в наборе (иначе детали не скорятся), а bsize исключён совсем.
    // Раскладка: УР.1 — только детали (count-drag); УР.2 +цвет +размер банки;
    // УР.3 +накал; УР.4 — детали ещё и дрейфуют (ловить сложнее).
    if(cfg.id === 'swarm_navigator'){
      const s = new Set(['count']);
      if(level >= 2){ s.add('color'); s.add('size'); }
      if(level >= 3 && allSet.has('sat')) s.add('sat');
      return s;
    }
    // Фаза 10 (Пьяница Пит): его фишка — «уровень жидкости» (fill) — с УР.1.
    // Раскладка: УР.1 размер+цвет+уровень; УР.2 +сгустки; УР.3 +размер сгустков;
    // УР.4 +«градус» (degree) — эксклюзивный ползунок риск/награда (в скоринге
    // не участвует, влияет на рейтинг/чаевые — см. finalizeResult).
    if(cfg.id === 'pete'){
      const p = new Set(['size', 'color', 'fill']);
      if(level >= 2) p.add('count');
      if(level >= 3) p.add('bsize');
      if(level >= 4){ p.add('degree'); if(allSet.has('sat')) p.add('sat'); } // накал на УР.4
      return p;
    }

    // ---- Фаза 8 (8A): новый порядок раскрытия ползунков по уровням ----
    // УР.1 — габарит + цвет; УР.2 — +количество сгустков; УР.3 — +размер
    // сгустков; УР.4 — +накал (у кого есть) и эксклюзивные регуляторы УР.4.
    // Поправки на тип: shape — форма вместо цвета; gradient — оба спектра;
    // dual_size — габарит распадается на ширину+высоту (ходят парой).
    const out = new Set();
    const add = k => { if(allSet.has(k)) out.add(k); };
    // УР.1: базовые «габарит + цвет» (с поправкой на тип)
    add('size'); if(dual) add('size2');
    if(flags.hasShape) add('shape'); else add('color');
    if(flags.hasGradient) add('colorB');
    if(cfg.id === 'vex') add('vexPosition'); // Векс: дрэг-компонент активен на всех уровнях
    // Модификатор фокуса: на УР.1/2 сужаем набор до фокусных характеристик
    // (фокус несёт игровую суть — прежнее поведение модификатора); УР.3+ — общий порядок
    if(focus && level < 3){
      const f = new Set(FOCUS_KEYS[focus].filter(k => allSet.has(k)));
      if(dual && f.has('size')) f.add('size2');
      if(f.size){
        if(level >= 2) f.add('count'); // мягкий шаг вверх на УР.2
        return f;
      }
    }
    if(level >= 2) add('count');
    if(level >= 3) add('bsize');
    if(level >= 4){
      add('sat');
      add('rotation'); add('speed'); add('countB'); add('vexPosition');
    }
    return out;
  }

  function computeFlags(cfg){
    return {
      hasGradient: cfg.type === 'gradient',
      hasShape: cfg.type === 'shape',
      hasSat: cfg.type !== 'gradient' && cfg.tier >= 4
    };
  }

  // ============================================================
  // Фаза 3: ЛОГИКА ПРОГРЕССИИ (конфиг — PROGRESSION в content.js)
  // Всё производное вычисляется из накопленного xp; хранилище (profile.js)
  // держит только сырой xp + metNpcs. Если конфига нет — легаси-поведение
  // (всё открыто, цикл 10, пул 3), чтобы ничего не сломать.
  // ============================================================
  const PROG = (typeof PROGRESSION !== 'undefined') ? PROGRESSION : null;
  const PROG_CUM = (()=>{ const cum=[]; let s=0; if(PROG) PROG.levels.forEach(l=>{ s+=l.xp; cum.push(s); }); return cum; })();
  const PROG_MAX = PROG ? PROG.levels.length : 0;
  // Правка пользователя: после последнего уровня прогрессия ПРОДОЛЖАЕТСЯ бесконечно —
  // каждый следующий уровень требует всё больше рейтинга и даёт немного чаевых.
  const PROG_BEYOND_STEP = 5000; // насколько растёт требуемый xp за каждый уровень сверх последнего
  const PROG_BEYOND_TIPS = 200;  // фикс. чаевые за каждый новый уровень сверх последнего
  function progXp(){ return window.PotionProfile ? window.PotionProfile.getProgressionXp() : 0; }
  function progLevelIncrement(level){ // xp, нужный чтобы достичь этого уровня (1-based)
    if(!PROG) return Infinity;
    if(level <= PROG_MAX) return PROG.levels[level-1].xp;
    const lastInc = PROG.levels[PROG_MAX-1].xp;
    return lastInc + (level - PROG_MAX) * PROG_BEYOND_STEP; // растёт линейно
  }
  function progCumXp(level){ let s=0; for(let l=1;l<=level;l++) s += progLevelIncrement(l); return s; }
  function progLevel(xp){
    if(xp == null) xp = progXp();
    if(!PROG) return 0;
    let lvl = 0, s = 0, guard = 0;
    for(let l=1; guard++ < 10000; l++){ s += progLevelIncrement(l); if(xp >= s) lvl = l; else break; }
    return lvl; // число завершённых баров (0..9 и ВЫШЕ — бесконечно)
  }
  function progCycleDays(){
    if(!PROG) return 10;
    let d = PROG.startCycleDays; const lvl = Math.min(progLevel(), PROG_MAX);
    for(let i=0;i<lvl;i++){ if(PROG.levels[i].cycleDays != null) d = PROG.levels[i].cycleDays; }
    return d;
  }
  function progPoolSize(){
    if(!PROG) return 3;
    let p = PROG.startPoolSize; const lvl = Math.min(progLevel(), PROG_MAX);
    for(let i=0;i<lvl;i++){ if(PROG.levels[i].poolSize != null) p = PROG.levels[i].poolSize; }
    return p;
  }
  function progMechUnlocked(name){
    if(!PROG) return true; // без конфига — всё открыто (легаси)
    const lvl = Math.min(progLevel(), PROG_MAX); // сверх-уровни не открывают новых механик
    for(let i=0;i<lvl;i++){ if((PROG.levels[i].mechanics||[]).includes(name)) return true; }
    return false;
  }
  function progUnlockedNpcSet(xp){
    if(!PROG) return null; // null == «все открыты» (легаси)
    if(xp == null) xp = progXp();
    const set = new Set(PROG.startNpcs);
    PROG.levels.forEach((l,i)=>{
      const barStart = i > 0 ? PROG_CUM[i-1] : 0;
      (l.npcMarks||[]).forEach(m=>{ if(xp >= barStart + m.at * l.xp) set.add(m.id); });
    });
    return set;
  }
  function isNpcUnlocked(id){
    const set = progUnlockedNpcSet();
    return set ? set.has(id) : true;
  }
  // Начисление xp по итогам цикла + сбор событий (новые НПС / новый уровень)
  // для тостов. Возвращает { levelsGained:[n,...], newNpcs:[id,...] }.
  function progApplyCycleScore(cycleScore){
    if(!PROG || !window.PotionProfile) return { levelsGained:[], newNpcs:[] };
    const before = { lvl: progLevel(), npcs: progUnlockedNpcSet() };
    window.PotionProfile.addProgressionXp(cycleScore);
    const after = { lvl: progLevel(), npcs: progUnlockedNpcSet() };
    const levelsGained = [];
    for(let l = before.lvl + 1; l <= after.lvl; l++) levelsGained.push(l);
    const newNpcs = [...after.npcs].filter(id => !before.npcs.has(id));
    // Правка пользователя: за каждый новый уровень СВЕРХ последнего — немного чаевых
    const beyondCount = levelsGained.filter(l => l > PROG_MAX).length;
    let beyondTips = 0;
    if(beyondCount && !isDailyMode && window.PotionProfile && window.PotionProfile.addTips){
      beyondTips = beyondCount * PROG_BEYOND_TIPS;
      window.PotionProfile.addTips(beyondTips);
    }
    return { levelsGained, newNpcs, beyondTips };
  }
  // Фаза 3 (3D): скрываем кнопки/UI существующих систем, пока они не открыты
  // прогрессией. В дейлике прогрессия не действует — показываем как раньше.
  function updateProgressionGates(){
    const setVis = (id, on)=>{ const el = $(id); if(el) el.style.display = on ? '' : 'none'; };
    setVis('collectionBtn', isDailyMode || progMechUnlocked('collection'));
    setVis('charactersBtn', isDailyMode || progMechUnlocked('characters'));
    // Пассивки — часть системы персонажей: открываются вместе с вкладкой
    // персонажей (Ур.2). До этого кнопка ⚡ скрыта.
    setVis('passivesBtn', isDailyMode || progMechUnlocked('characters'));
    const cl = $('cycleLenVal'); if(cl) cl.textContent = isDailyMode ? 10 : progCycleDays();
    // Фаза 5: счётчик чаевых виден после открытия (Ур.4), в дейлике — нет
    const tipsC = $('tipsCounter');
    if(tipsC){
      const tipsOn = !isDailyMode && progMechUnlocked('tips');
      tipsC.style.display = tipsOn ? '' : 'none';
      if(tipsOn){ const tv = $('tipsVal'); if(tv && window.PotionProfile) tv.textContent = window.PotionProfile.getTips(); }
    }
    refreshShopDockState(); // Фаза 6: видимость/доступность кнопок магазина/инвентаря
    refreshSkillDock();     // Фаза 7: панель умений/заряды
    renderProgressionBar();
  }

  // ============================================================
  // Фаза 6: магазин / инвентарь
  // ============================================================
  const SHOP_BY_ID = {};
  if(typeof SHOP_ITEMS !== 'undefined') SHOP_ITEMS.forEach(it=> SHOP_BY_ID[it.id] = it);
  const shopSelGrade = {}; // выбранный в карточке магазина грейд (itemId → 0..2)

  // грейд i (0..2) открыт по прогрессии: Ур.4/5/8 → shop_grade_1..3
  function shopGradeUnlocked(i){ return progMechUnlocked('shop_grade_' + (i+1)); }
  function defaultSelGrade(item){
    let g = 0;
    for(let i=0;i<item.grades.length;i++){ if(shopGradeUnlocked(i)) g = i; }
    return g;
  }

  // видимость дока и доступность кнопок: магазин — только 1-й день цикла и вне
  // заказа; инвентарь — всегда, кроме фазы запоминания; оба скрыты в дейлике и
  // до открытия по прогрессии (Ур.4)
  function refreshShopDockState(){
    const dock = $('shopDock');
    const on = !isDailyMode && progMechUnlocked('shop');
    if(dock) dock.style.display = on ? '' : 'none';
    if(!on) return;
    const roundActive = $('roundScreen').classList.contains('show');
    const shopBtn = $('shopBtn'), invBtn = $('inventoryBtn');
    if(shopBtn) shopBtn.disabled = !(dayNum === 1 && !roundActive);
    if(invBtn) invBtn.disabled = (roundActive && currentPhase === 'scan');
  }

  // можно ли применить предмет прямо сейчас (зависит от usePhase)
  function itemUsableNow(item){
    const roundActive = $('roundScreen').classList.contains('show');
    if(item.usePhase === 'craft') return roundActive && currentPhase === 'craft' && !!target && !craftLocked;
    return $('selectScreen').classList.contains('show'); // 'select'
  }

  function regKeyLabel(key){
    const m = { color:UI_TEXT.LABEL_SPECTRUM, colorB:UI_TEXT.LABEL_SPECTRUM, sat:UI_TEXT.LABEL_SATURATION,
      size:UI_TEXT.LABEL_VOLUME, size2:UI_TEXT.LABEL_HEIGHT, count:UI_TEXT.LABEL_COUNT_QTY,
      bsize:UI_TEXT.LABEL_COUNT_SIZE, shape:UI_TEXT.LABEL_SHAPE, rotation:UI_TEXT.LABEL_ROTATION,
      speed:UI_TEXT.LABEL_SPEED, countB:UI_TEXT.LABEL_COUNT_B };
    return m[key] || { ru:key, en:key };
  }
  // какие регуляторы можно указать предмету (паприка — только основные, где
  // зелёная зона осмысленна; джиггер — любой активный засчитываемый)
  function pickableKeysForItem(item){
    const keys = [...(target && target.activeKeys ? target.activeKeys : [])].filter(k => S[k]);
    // джиггер отключает только «обычные» характеристики (не спец-компоненты вроде vexPosition)
    if(item.effect === 'jigger') return keys.filter(k => ['color','size','bsize','count'].includes(k));
    return keys;
  }

  // Правка (пользователь): описание и иконка предмета должны меняться при смене
  // грейда. gradeEffectDesc строит по грейду фразу-эффект (число из параметров
  // грейда), а иконка берётся из grade.icon (если задан путь) с фолбэком на item.icon.
  function gradeEffectDesc(item, grade){
    const g = grade || {};
    switch(item.effect){
      case 'time': case 'memtime': { const s = (g.bonusMs||0)/1000; return { ru:`Эффект: +${s} сек к таймеру.`, en:`Effect: +${s}s to the timer.` }; }
      case 'jigger':
        if(g.mode === 'random2') return { ru:'Эффект: отключает 2 случайных регулятора (не влияют на рейтинг).', en:'Effect: disables 2 random regulators (excluded from score).' };
        return g.mode === 'random'
        ? { ru:'Эффект: отключает случайный регулятор (не влияет на рейтинг).', en:'Effect: disables a random regulator (excluded from score).' }
        : { ru:'Эффект: отключает выбранный тобой регулятор (не влияет на рейтинг).', en:'Effect: disables a regulator of your choice (excluded from score).' };
      case 'repboost': { const r = g.rep||0; return { ru:`Эффект: за годноту+ репутация +${r}, за брак −${r} сверх обычного.`, en:`Effect: on a good+ result reputation +${r}, on a botch −${r} beyond the usual.` }; }
      case 'nudge': { const n = g.count === 'all' ? {ru:'все ползунки',en:'all sliders'} : (g.count===2 ? {ru:'2 случайных ползунка',en:'2 random sliders'} : {ru:'1 случайный ползунок',en:'1 random slider'}); return { ru:`Эффект: в конце подвинет ${n.ru} на деление ближе к цели.`, en:`Effect: at the end nudges ${n.en} one notch toward the target.` }; }
      case 'chip': { const lo = Math.round((g.lo||0)*100), hi = Math.round((g.hi||0)*100); return { ru:`Эффект: итог заказа сдвигается на ${lo>=0?'+':''}${lo}%…+${hi}%.`, en:`Effect: shifts the order result by ${lo>=0?'+':''}${lo}%…+${hi}%.` }; }
      case 'flatbonus': return { ru:`Эффект: +${g.flat||0} рейтинга за годноту.`, en:`Effect: +${g.flat||0} rating on a good result.` };
      case 'rewardmult': { const p = Math.round((g.mult||0)*100); return { ru:`Эффект: +${p}% рейтинга за годноту/идеал.`, en:`Effect: +${p}% rating for a good/perfect.` }; }
      case 'shield': { const p = Math.round((g.cut||0)*100); return { ru:`Эффект: штраф за брак уменьшается на ${p}%.`, en:`Effect: botch penalty reduced by ${p}%.` }; }
      case 'speedlock': { const p = Math.round((g.lock||0)*100); return { ru:`Эффект: гарантирует минимум ${p}% бонуса за скорость.`, en:`Effect: guarantees at least ${p}% of the speed bonus.` }; }
      case 'charge': return { ru:`Эффект: +${g.add||1} заряд(а) умений (потолок 3).`, en:`Effect: +${g.add||1} skill charge(s) (cap 3).` };
      case 'revealall': return { ru:'Эффект: зелёная зона верного значения на ВСЕХ доступных регуляторах.', en:'Effect: a green zone of the right value on EVERY available regulator.' };
      case 'truesolve': return { ru:`Эффект: ставит ${g.count||2} регулятора точно на верные значения и фиксирует.`, en:`Effect: sets ${g.count||2} regulators exactly right and locks them.` };
      case 'addmod': return { ru:'Эффект: добавляет случайному подходящему гостю дня случайный модификатор.', en:'Effect: adds a random modifier to a random eligible guest.' };
      default: return null;
    }
  }
  function itemDescHTML(item, grade){
    const eff = gradeEffectDesc(item, grade);
    return `${LT(item.desc)}${eff ? ` <b class="item-eff">${LT(eff)}</b>` : ''}`;
  }
  function itemIconFor(item, grade){
    return visualHTML((grade && grade.icon) || item.icon, 'item-img');
  }

  function renderShop(){
    const host = $('shopList'); if(!host) return;
    const PP = window.PotionProfile;
    $('shopBalanceVal').textContent = PP ? PP.getTips() : 0;
    host.innerHTML = '';
    SHOP_ITEMS.forEach(item=>{
      if(item.grantOnly) return; // Фаза 10: подарочные предметы (клубок) в магазине не продаются
      const isUnique = !!item.unique;
      let g;
      if(isUnique){ g = 0; }
      else { if(shopSelGrade[item.id] == null) shopSelGrade[item.id] = defaultSelGrade(item); g = shopSelGrade[item.id]; }
      const grade = item.grades[g];
      const unlocked = isUnique ? progMechUnlocked('unique_items') : shopGradeUnlocked(g);
      const canAfford = PP && PP.getTips() >= grade.price;
      const buyable = unlocked && canAfford;
      const owned = PP ? PP.itemQty(item.id, g) : 0;
      // столбик грейдов только у обычных предметов; у уникальных — бейдж ★
      const gradesHTML = isUnique
        ? `<div class="item-grades"><div class="grade-pip unique-pip" title="${LT(UI_TEXT.SHOP_UNIQUE_TAG)}">★</div></div>`
        : `<div class="item-grades">${item.grades.map((gr,i)=>{
            const unl = shopGradeUnlocked(i);
            return `<div class="grade-pip ${i===g?'selected':''} ${unl?'':'locked'}" data-grade="${i}" title="${unl?LT(gr.label):LT(UI_TEXT.SHOP_LOCKED_GRADE)}">${i+1}</div>`;
          }).join('')}</div>`;
      const nameSuffix = isUnique
        ? `<span class="item-grade-note unique-note">· ★ ${LT(UI_TEXT.SHOP_UNIQUE_TAG)}</span>`
        : `<span class="item-grade-note">· ${LT(UI_TEXT.ITEM_GRADE_LABEL)} ${g+1} (${LT(grade.label)})</span>`;
      const lockedNote = unlocked ? '' :
        `<span class="item-grade-note">(${LT(isUnique ? UI_TEXT.SHOP_UNIQUE_LOCKED : UI_TEXT.SHOP_LOCKED_GRADE)})</span>`;
      const card = document.createElement('div');
      card.className = 'item-card' + (isUnique ? ' item-unique' : '');
      card.innerHTML = `
        <div class="item-icon">${itemIconFor(item, grade)}</div>
        <div class="item-body">
          <div class="item-name">${LT((grade && grade.name) || item.name)} ${nameSuffix}</div>
          <div class="item-desc">${itemDescHTML(item, grade)}</div>
          <div class="item-action">
            <button class="item-buy-btn" ${buyable?'':'disabled'}>${LT(UI_TEXT.SHOP_BUY)}</button>
            <span class="item-price">🪙 ${grade.price}</span>
            <span class="item-owned">${LT(UI_TEXT.SHOP_OWNED)} ${owned}</span>
            ${lockedNote}
          </div>
        </div>
        ${gradesHTML}`;
      if(!isUnique) card.querySelectorAll('.grade-pip').forEach(pip=>{
        pip.addEventListener('click', ()=>{
          const gi = parseInt(pip.dataset.grade,10);
          if(!shopGradeUnlocked(gi)){ SFX.badPop(); return; }
          shopSelGrade[item.id] = gi; SFX.uiClick(); renderShop();
        });
      });
      const buyBtn = card.querySelector('.item-buy-btn');
      if(buyBtn) buyBtn.addEventListener('click', ()=> buyItem(item, g));
      host.appendChild(card);
    });
  }

  function buyItem(item, g){
    const PP = window.PotionProfile; if(!PP) return;
    const unlocked = item.unique ? progMechUnlocked('unique_items') : shopGradeUnlocked(g);
    if(!unlocked){ SFX.badPop(); return; }
    if(!PP.spendTips(item.grades[g].price)){
      SFX.badPop(); showToast({ icon:'🪙', prefix:UI_TEXT.SHOP_NEED_TIPS, name:'' }); return;
    }
    PP.addItem(item.id, g, 1);
    SFX.cardPick();
    showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_BOUGHT_TOAST, name:item.name });
    updateProgressionGates(); // обновить счётчик чаевых в топбаре
    renderShop();
  }

  function renderInventory(){
    const host = $('inventoryList'); if(!host) return;
    const PP = window.PotionProfile;
    host.innerHTML = '';
    const list = PP ? PP.inventoryList() : [];
    if(!list.length){ host.innerHTML = `<div class="shop-empty">${LT(UI_TEXT.INV_EMPTY)}</div>`; return; }
    list.forEach(entry=>{
      const item = SHOP_BY_ID[entry.id]; if(!item) return;
      const grade = item.grades[entry.grade];
      const usable = itemUsableNow(item);
      const hint = item.usePhase === 'craft' ? UI_TEXT.INV_USE_CRAFT_ONLY : UI_TEXT.INV_USE_SELECT_ONLY;
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <div class="item-icon">${itemIconFor(item, grade)}</div>
        <div class="item-body">
          <div class="item-name">${LT((grade && grade.name) || item.name)} <span class="item-grade-note">· ${LT(UI_TEXT.ITEM_GRADE_LABEL)} ${entry.grade+1} (${LT(grade.label)})</span></div>
          <div class="item-desc">${itemDescHTML(item, grade)}</div>
          <div class="item-action">
            <button class="item-use-btn" ${usable?'':'disabled'}>${LT(UI_TEXT.INV_USE)}</button>
            <span class="item-owned">×${entry.qty}</span>
            ${usable?'':`<span class="item-grade-note">(${LT(hint)})</span>`}
          </div>
          <div class="reg-pick-host"></div>
        </div>`;
      const useBtn = card.querySelector('.item-use-btn');
      if(useBtn) useBtn.addEventListener('click', ()=> useItem(item, entry.grade, card));
      host.appendChild(card);
    });
  }

  function useItem(item, grade, card){
    if(!itemUsableNow(item)){ SFX.badPop(); return; }
    // Фаза 6: у Коллекционера ползунков нет — джиггер/глаз без аналога отклоняем
    // сразу (не показывая пикер регулятора). Остальное разрулит applyItemEffect.
    if(target && target.cfg.id === 'collector_gz' && (item.effect === 'jigger' || item.effect === 'nudge')){
      SFX.badPop(); showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_NO_TARGET, name:'' }); return;
    }
    // выбор регулятора нужен только джиггеру в режиме «на выбор» (choose*)
    const needsPick = item.effect === 'jigger' && /^choose/.test(item.grades[grade].mode || '');
    if(needsPick){ showRegPicker(item, grade, card); return; }
    applyItemEffect(item, grade, null);
  }

  function showRegPicker(item, grade, card){
    const host = card.querySelector('.reg-pick-host'); if(!host) return;
    const keys = pickableKeysForItem(item);
    if(!keys.length){ SFX.badPop(); applyItemEffect(item, grade, null); return; } // нет подходящих — применяем как есть
    host.innerHTML = `<div class="item-grade-note">${LT(UI_TEXT.INV_PICK_REG)}</div><div class="reg-pick-row">` +
      keys.map(k=>`<button class="reg-pick-btn" data-key="${k}">${LT(regKeyLabel(k))}</button>`).join('') +
      `<button class="reg-pick-btn cancel" data-key="">${LT(UI_TEXT.INV_PICK_CANCEL)}</button></div>`;
    host.querySelectorAll('.reg-pick-btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        const k = b.dataset.key;
        if(!k){ host.innerHTML=''; SFX.uiClick(); return; }
        applyItemEffect(item, grade, k);
      });
    });
  }

  function paprikaFrac(key){
    const cfg = target.cfg;
    if(key==='color') return target.hueIdx/((cfg.colorSteps-1)||1);
    if(key==='size')  return target.sizeIdx/((cfg.sizeSteps-1)||1);
    if(key==='bsize') return target.bsizeIdx/((cfg.bsizeSteps-1)||1);
    if(key==='count') return (target.count-1)/((cfg.countMax-1)||1);
    return 0.5;
  }
  function applyPaprikaZone(key, zone, mark){
    if(!S[key]) return;
    const frac = paprikaFrac(key);
    const lo = Math.max(0, frac - zone) * 100;
    const hi = Math.min(1, frac + zone) * 100;
    // паприка — мягкая зелёная зона; "Барменский глаз" — тонкая яркая метка
    const col = mark ? 'rgba(120,240,255,.92)' : 'rgba(80,255,140,.5)';
    const band = `linear-gradient(to top, transparent ${lo}%, ${col} ${lo}%, ${col} ${hi}%, transparent ${hi}%)`;
    const base = (key === 'color') ? RAINBOW_BG : 'rgba(53,224,255,.12)';
    S[key].setTrackBackground(band + ', ' + base);
    S[key].setFlag(mark ? 'item-mark' : 'item-paprika', true);
  }

    // ставит регулятор точно на верное значение и фиксирует (Философский камень)
  function setSliderToTarget(key){
    if(!S[key] || !target) return false;
    let v = null;
    if(key === 'color') v = target.hueIdx;
    else if(key === 'size') v = target.sizeIdx;
    else if(key === 'bsize') v = target.bsizeIdx;
    else if(key === 'count') v = target.count;
    if(v == null) return false;
    S[key].value = v;
    S[key].setDisabled(true);
    S[key].setFlag('item-solved', true);
    return true;
  }

  // Фаза 6 (Барменский глаз): в конце игры двигает ползунки на 1 деление ближе к
  // цели. count: 1 | 2 | 'all' — сколько случайных активных регуляторов подвинуть.
  function applyEyeNudge(){
    if(!target || !target.itemFx || target.itemFx.nudge == null) return;
    const tgtIdx = { color:target.hueIdx, colorB:target.hue2Idx, size:target.sizeIdx,
      size2:target.size2Idx, bsize:target.bsizeIdx, count:target.count,
      fill:target.fillIdx, sat:target.satIdx };
    let keys = [...(target.activeKeys || [])].filter(k => S[k] && tgtIdx[k] != null);
    const n = target.itemFx.nudge;
    if(n !== 'all') keys = shuffleArr(keys).slice(0, n);
    keys.forEach(k=>{
      const cur = S[k].value, t = tgtIdx[k];
      if(cur < t) S[k].value = Math.min(t, cur + 1);
      else if(cur > t) S[k].value = Math.max(t, cur - 1);
    });
    if(keys.length) updatePlayerJar();
  }

  // Уникальный "Жетон дебоша": добавляет случайный модификатор случайному
  // подходящему гостю дня, соблюдая правила Фазы 3 (без дублей; несколько — только
  // красным+ и при Ур.7). Возвращает изменённый заказ или null (некому).
  function addRandomModifier(){
    if(isDailyMode) return null;
    const multiOn = progMechUnlocked('modifiers_multi');
    const new3On  = progMechUnlocked('modifiers_new3');
    const cands = (currentOrders || []).filter(o => o.cfg.tier >= 2 && o.cfg.id !== 'tentacloid');
    for(const o of shuffleArr(cands)){
      const modCount = (o.focus ? 1 : 0) + ((o.mods && o.mods.length) || 0);
      if(modCount > 0 && !(multiOn && o.cfg.tier >= 4)) continue; // второй модификатор нельзя
      if(modCount >= 3) continue; // жёсткий лимит
      const kinds = [];
      // Фаза 6 (аудит предметов): фокус нельзя вешать на персонажей с кастомной
      // раскладкой ползунков — та же логика, что в buildOrderDescriptor
      // (иначе Жетон дебоша мог дать фокус Вексу/Парфюмеру/Коллекционеру).
      if(o.cfg.type === 'normal' && !o.focus && !MOD_FOCUS_EXCLUDE.has(o.cfg.id)) kinds.push('focus');
      if(new3On){
        if(o.cfg.special !== 'no_timer' && !(o.mods || []).includes('timer')) kinds.push('timer');
        if(!(o.mods || []).includes('duck')) kinds.push('duck');
        if(!(o.mods || []).includes('rampage')) kinds.push('rampage');
      }
      if(!kinds.length) continue;
      const k = pick(kinds);
      // Навигатору Роя фокус только по спектру/габаритам (сгустков-слайдера нет)
      if(k === 'focus') o.focus = pick(o.cfg.id === 'swarm_navigator' ? ['color','size'] : ['bubbles','color','size']);
      else { o.mods = o.mods || []; o.mods.push(k); }
      return o;
    }
    return null;
  }

  function applyItemEffect(item, grade, key){
    const PP = window.PotionProfile; if(!PP) return;
    // Уникальный "Жетон дебоша" — проверяем успех ДО списания (иначе тратим впустую)
    if(item.effect === 'addmod'){
      const o = addRandomModifier();
      if(!o){ SFX.badPop(); showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_NO_TARGET, name:'' }); return; }
      PP.consumeItem(item.id, grade);
      renderCustomerCards(currentOrders); // показать новую плашку
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
      SFX.cardPick(); closeInventory(); return;
    }
    // Фаза 6 (адаптация под Коллекционера): у него ползунков нет — сетка зелий.
    //  • «подсказки» (revealall/truesolve) подсвечивают верную баночку;
    //  • предметы-на-ползунок без аналога в сетке (jigger/nudge) — отказ без траты.
    if(target && target.cfg.id === 'collector_gz'){
      if(item.effect === 'jigger' || item.effect === 'nudge'){
        SFX.badPop(); showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_NO_TARGET, name:'' }); return; // не тратим
      }
      if(item.effect === 'revealall' || item.effect === 'truesolve'){
        if(!PP.consumeItem(item.id, grade)){ SFX.badPop(); return; }
        l4CollectorHighlightCorrect();
        showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
        SFX.cardPick(); closeInventory(); return;
      }
    }
    if(!PP.consumeItem(item.id, grade)){ SFX.badPop(); return; }
    const gr = item.grades[grade];
    if(item.effect === 'time'){
      pendingItemFx.timeBonusMs += gr.bonusMs || 0;
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_TIME_TOAST, name:'' });
    } else if(item.effect === 'memtime'){
      pendingItemFx.memBonusMs += gr.bonusMs || 0;
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_TIME_TOAST, name:'' });
    } else if(item.effect === 'charge'){
      if(window.PotionProfile) window.PotionProfile.addCharge(gr.add || 1);
      refreshSkillDock();
      showToast({ icon:item.icon, prefix:UI_TEXT.SKILL_CHARGE_GAINED, name:'' });
    } else if(item.effect === 'flatbonus'){
      if(target) target.itemFx.flatBonus = (target.itemFx.flatBonus || 0) + (gr.flat || 0);
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'rewardmult'){
      if(target) target.itemFx.rewardMult = (target.itemFx.rewardMult || 0) + (gr.mult || 0);
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'shield'){
      if(target) target.itemFx.shieldCut = Math.max(target.itemFx.shieldCut || 0, gr.cut || 0);
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'speedlock'){
      if(target) target.itemFx.speedLock = Math.max(target.itemFx.speedLock || 0, gr.lock || 0);
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'nudge'){
      // Фаза 6 (Барменский глаз, новый эффект): в конце игры подвинет ползунки
      // на 1 деление к цели (1 / 2 / все — по грейду). Само движение — в finishCraft.
      if(target) target.itemFx.nudge = gr.count; // 1 | 2 | 'all'
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'jigger'){
      // Грейд 3 (random2) отключает 2 случайных регулятора, остальные — 1
      const wantCount = gr.mode === 'random2' ? 2 : 1;
      let chosen = [];
      if(gr.mode === 'random' || gr.mode === 'random2'){
        chosen = shuffleArr(pickableKeysForItem(item)).slice(0, wantCount);
      } else if(key){ chosen = [key]; }
      if(chosen.length && target){
        target.itemFx.jiggerKey = chosen.length === 1 ? chosen[0] : chosen;
        chosen.forEach(k=>{ if(S[k]){ S[k].setDisabled(true); S[k].setFlag('item-jigger', true); } });
        updatePlayerJar();
      }
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'repboost'){
      // Фаза 6 (Космическая паприка, новый эффект): усиливает репутационный итог —
      // за годноту+ больше репутации, за брак больше отнимает (см. finalizeResult).
      if(target) target.itemFx.repBoost = (target.itemFx.repBoost || 0) + (gr.rep || 0);
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'chip'){
      if(target) target.itemFx.chip = { lo:gr.lo, hi:gr.hi };
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'revealall'){
      // Звёздная карта: зелёная зона на всех доступных основных регуляторах
      const keys = [...(target && target.activeKeys ? target.activeKeys : [])]
        .filter(k => S[k] && ['color','size','bsize','count'].includes(k));
      keys.forEach(k => applyPaprikaZone(k, gr.zone));
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    } else if(item.effect === 'truesolve'){
      // Философский камень: ставит N случайных регуляторов точно и фиксирует
      const keys = shuffleArr([...(target && target.activeKeys ? target.activeKeys : [])]
        .filter(k => S[k] && ['color','size','bsize','count'].includes(k)));
      let solved = 0;
      for(const k of keys){ if(solved >= (gr.count || 1)) break; if(setSliderToTarget(k)) solved++; }
      if(solved) updatePlayerJar();
      showToast({ icon:item.icon, prefix:UI_TEXT.ITEM_USED_TOAST, name:item.name });
    }
    SFX.cardPick();
    closeInventory();
  }

  function openShop(){
    if(isDailyMode || !progMechUnlocked('shop')) return;
    if(dayNum !== 1){ SFX.badPop(); showToast({ icon:'🛒', prefix:UI_TEXT.SHOP_ONLY_DAY1, name:'' }); return; }
    renderShop(); $('shopOverlay').classList.add('show'); SFX.uiClick();
  }
  function closeShop(){ $('shopOverlay').classList.remove('show'); }
  function openInventory(){
    if(isDailyMode || !progMechUnlocked('shop')) return;
    if($('roundScreen').classList.contains('show') && currentPhase === 'scan') return; // не в запоминании
    renderInventory(); $('inventoryOverlay').classList.add('show'); SFX.uiClick();
  }
  function closeInventory(){ $('inventoryOverlay').classList.remove('show'); }

  { // проводка кнопок магазина/инвентаря
    const b1 = $('shopBtn'); if(b1) b1.addEventListener('click', openShop);
    const b2 = $('inventoryBtn'); if(b2) b2.addEventListener('click', openInventory);
    const c1 = $('shopCloseBtn'); if(c1) c1.addEventListener('click', ()=>{ SFX.uiClick(); closeShop(); });
    const c2 = $('inventoryCloseBtn'); if(c2) c2.addEventListener('click', ()=>{ SFX.uiClick(); closeInventory(); });
  }

  // ============================================================
  // Режим разработчика (тест) — кнопка внизу справа
  // ============================================================
  // Вкл: много чаевых + огромный xp (вся прогрессия) + максимум репутации у всех
  // НПС (+все отмечены встреченными). Выкл: возврат реального профиля игрока из
  // бэкапа (см. profile.js). Профиль игрока не теряется — dev пишется поверх
  // бэкапа, при выходе восстанавливается.
  function applyDevOverrides(){
    const PP = window.PotionProfile; if(!PP) return;
    PP.data.progression = PP.data.progression || { xp:0, metNpcs:[] };
    PP.data.progression.xp = 1000000; // заведомо больше суммы всех порогов прогрессии
    PP.data.tips = { balance: 999999, lifetime: Math.max((PP.data.tips && PP.data.tips.lifetime) || 0, 999999) };
    if(typeof ALL_NPCS !== 'undefined'){
      ALL_NPCS.forEach(n=>{ PP.setReputation(n.id, 999); PP.markNpcMet(n.id); });
    }
    if(PP.addCharge) PP.addCharge(3); // Фаза 7: полный запас зарядов умений для теста
    PP.save();
  }
  function toggleDevMode(){
    const PP = window.PotionProfile; if(!PP) return;
    if(PP.isDevMode()){
      PP.exitDevMode();
    } else {
      PP.enterDevMode();
      applyDevOverrides();
    }
    location.reload(); // чистая переинициализация с новым/восстановленным профилем
  }
  function refreshDevBtn(){
    const b = $('devModeBtn');
    if(b && window.PotionProfile) b.classList.toggle('dev-on', window.PotionProfile.isDevMode());
  }
  {
    const db = $('devModeBtn');
    if(db) db.addEventListener('click', ()=>{ SFX.uiClick(); toggleDevMode(); });
    refreshDevBtn();
  }

  // ============================================================
  // Фаза 7: умения игрока (панель слева + заряды)
  // ============================================================
  // конфиг персонажа по id — из пулов тиров (с влитыми таймерами/шагами) + спецы
  function cfgById(id){
    for(let t=1;t<=5;t++){ const c = tierPool(t).find(x=>x.id===id); if(c) return c; }
    if(typeof SPECIAL_ORDERS !== 'undefined'){ const s = SPECIAL_ORDERS.find(x=>x.id===id); if(s) return s; }
    return null;
  }

  function refreshSkillDock(){
    const dock = $('skillDock'); if(!dock) return;
    const on = !isDailyMode && progMechUnlocked('skill_1');
    dock.style.display = on ? '' : 'none';
    if(!on) return;
    const onSelect = $('selectScreen').classList.contains('show');
    const charges = window.PotionProfile ? window.PotionProfile.getCharges() : 0;
    const grid = $('skillGrid'); grid.innerHTML = '';
    SKILLS.forEach(sk=>{
      if(!progMechUnlocked(sk.flag)) return; // ещё не открыт прогрессией
      const btn = document.createElement('button');
      btn.className = 'skill-btn';
      btn.innerHTML = visualHTML(sk.icon, 'skill-img');
      btn.title = LT(sk.name) + ' — ' + LT(sk.desc);
      const stub = sk.mode === 'stub';
      btn.disabled = stub || !onSelect || charges <= 0;
      btn.addEventListener('click', ()=>{ SFX.uiClick(); useSkill(sk); });
      grid.appendChild(btn);
    });
    const cp = $('skillCharges'); cp.innerHTML = '';
    for(let i=0;i<3;i++){ const d = document.createElement('div'); d.className = 'charge-pip' + (i < charges ? ' full' : ''); cp.appendChild(d); }
  }

  // «Вам уже пора»: обновить всех гостей дня на новых (текущих не повторять)
  function refreshDaySkill(){
    const usedNames = new Set(currentOrders.map(o => o.cfg.name));
    let tiers = getCardTiers();
    const poolSize = progPoolSize();
    if(tiers.length > poolSize) tiers = tiers.slice(0, poolSize);
    else while(tiers.length < poolSize) tiers.push(tiers[tiers.length - 1]);
    currentOrders = tiers.map(t => buildOrderDescriptor(pickConfigForTier(t, usedNames)));
    renderSelectBanners();
    renderCustomerCards(currentOrders);
  }

  function useSkill(sk){
    if(sk.mode === 'stub'){ SFX.badPop(); showToast({ icon:sk.icon, prefix:UI_TEXT.SKILL_STUB_NOTE, name:'' }); return; }
    if(!$('selectScreen').classList.contains('show')){ SFX.badPop(); showToast({ icon:'✨', prefix:UI_TEXT.SKILL_ONLY_SELECT, name:'' }); return; }
    const PP = window.PotionProfile;
    if(!PP || PP.getCharges() <= 0){ SFX.badPop(); showToast({ icon:'✨', prefix:UI_TEXT.SKILL_NO_CHARGES, name:'' }); return; }
    if(sk.mode === 'refresh'){
      PP.spendCharge();
      refreshDaySkill();
      showToast({ icon:sk.icon, prefix:UI_TEXT.SKILL_REFRESH_TOAST, name:'' });
      refreshSkillDock();
      return;
    }
    openSkillPicker(sk); // who / ban
  }

  // окно выбора персонажей для «Кто там?» (1) и «Этих не пускайте» (до 3)
  let skillPickCtx = null;
  function openSkillPicker(sk){
    const unlockedSet = progUnlockedNpcSet();
    const seen = new Set(); const ids = [];
    const add = c => { if(!seen.has(c.id)){ seen.add(c.id); if(!unlockedSet || unlockedSet.has(c.id)) ids.push(c.id); } };
    for(let t=1;t<=5;t++) tierPool(t).forEach(add);
    if(typeof SPECIAL_ORDERS !== 'undefined') SPECIAL_ORDERS.forEach(add);
    const list = sk.mode === 'ban' ? ids.filter(id => !bannedNpcs.has(id)) : ids;
    skillPickCtx = { mode:sk.mode, selected:new Set(), max: sk.mode === 'ban' ? 3 : 1 };
    $('skillPickTitle').textContent = LT(sk.mode === 'ban' ? UI_TEXT.SKILL_PICK_BAN_TITLE : UI_TEXT.SKILL_PICK_WHO_TITLE);
    const grid = $('skillPickGrid'); grid.innerHTML = '';
    list.forEach(id=>{
      const cfg = cfgById(id); if(!cfg) return;
      const cell = document.createElement('div'); cell.className = 'skill-pick-cell';
      const avatar = Array.isArray(cfg.img) ? cfg.img[0] : (cfg.img || cfg.emoji);
      cell.innerHTML = `<div class="pick-portrait">${visualHTML(avatar,'pick-img')}</div><div class="pick-name">${LT(cfg.name)}</div>`;
      cell.addEventListener('click', ()=>{
        SFX.uiClick();
        if(skillPickCtx.selected.has(id)){ skillPickCtx.selected.delete(id); cell.classList.remove('selected'); return; }
        if(skillPickCtx.selected.size >= skillPickCtx.max){
          if(skillPickCtx.max === 1){ skillPickCtx.selected.clear(); grid.querySelectorAll('.selected').forEach(e=>e.classList.remove('selected')); }
          else { SFX.badPop(); return; }
        }
        skillPickCtx.selected.add(id); cell.classList.add('selected');
      });
      grid.appendChild(cell);
    });
    $('skillOverlay').classList.add('show');
  }
  function closeSkillPicker(){ $('skillOverlay').classList.remove('show'); skillPickCtx = null; }
  {
    const cf = $('skillPickConfirm');
    if(cf) cf.addEventListener('click', ()=>{
      if(!skillPickCtx){ closeSkillPicker(); return; }
      const sel = [...skillPickCtx.selected];
      if(!sel.length){ SFX.badPop(); return; }
      const PP = window.PotionProfile;
      if(!PP || !PP.spendCharge()){ SFX.badPop(); return; }
      if(skillPickCtx.mode === 'who'){
        guaranteedNextNpc = sel[0];
        const c = cfgById(sel[0]);
        showToast({ icon:'👀', prefix:UI_TEXT.SKILL_GUARANTEED_TOAST, name: c ? c.name : '' });
      } else {
        sel.forEach(id => bannedNpcs.add(id));
        showToast({ icon:'🚫', prefix:UI_TEXT.SKILL_BANNED_TOAST, name:'' });
      }
      SFX.cardPick();
      closeSkillPicker();
      refreshSkillDock();
    });
    const cc = $('skillPickCancel');
    if(cc) cc.addEventListener('click', ()=>{ SFX.uiClick(); closeSkillPicker(); });
  }

  // Фаза 3 (3B): подсказка на финале шкалы — что откроется по её завершении
  function progFinalHint(bar){
    const parts = [];
    (bar.mechanics || []).forEach(m => { const lbl = UI_TEXT.PROG_MECH_LABELS[m]; if(lbl) parts.push(LT(lbl)); });
    if(bar.cycleDays != null) parts.push(LT(UI_TEXT.PROG_GRANT_CYCLE_DAYS).replace('{n}', bar.cycleDays));
    if(bar.poolSize != null) parts.push(LT(UI_TEXT.PROG_GRANT_POOL_SIZE).replace('{n}', bar.poolSize));
    return LT(UI_TEXT.PROG_FINAL_HINT_PREFIX) + ' ' + (parts.join(', ') || '—');
  }
  function renderProgressionBar(){
    const wrap = $('progBar'); if(!wrap) return;
    if(isDailyMode || !PROG){ wrap.style.display = 'none'; return; }
    wrap.style.display = '';
    const xp = progXp(), level = progLevel();
    const track = $('progBarTrack'), fill = $('progBarFill');
    track.querySelectorAll('.prog-mark').forEach(m => m.remove());
    if(level >= PROG_MAX){ // лавка развита — но уровни продолжаются (за каждый — чаевые)
      const startCum = progCumXp(level);          // xp для достижения текущего уровня
      const inc = progLevelIncrement(level + 1);  // сколько до следующего
      const inBar = Math.max(0, xp - startCum);
      fill.style.width = (Math.max(0, Math.min(1, inBar / inc)) * 100).toFixed(1) + '%';
      $('progBarLevel').textContent = LT(UI_TEXT.PROG_BAR_LEVEL) + ' ' + level;
      $('progBarXp').textContent = Math.round(inBar) + ' / ' + inc;
      return;
    }
    const barStart = level > 0 ? PROG_CUM[level-1] : 0;
    const bar = PROG.levels[level];
    const inBar = Math.max(0, xp - barStart);
    const frac = Math.max(0, Math.min(1, inBar / bar.xp));
    fill.style.width = (frac * 100).toFixed(1) + '%';
    $('progBarLevel').textContent = LT(UI_TEXT.PROG_BAR_LEVEL) + ' ' + level;
    $('progBarXp').textContent = Math.round(inBar) + ' / ' + bar.xp;
    (bar.npcMarks || []).forEach(m => {
      const el = document.createElement('div');
      const unlocked = xp >= barStart + m.at * bar.xp;
      el.className = 'prog-mark npc' + (unlocked ? ' unlocked' : '');
      el.style.left = (m.at * 100).toFixed(1) + '%';
      // локед-отметку НЕ спойлим (какой именно НПС) — только «скоро новый»
      const npc = unlocked ? npcById(m.id) : null;
      el.title = unlocked
        ? LT(UI_TEXT.PROG_MARK_UNLOCKED_NPC) + (npc ? ': ' + LT(npc.name) : '')
        : LT(UI_TEXT.PROG_MARK_LOCKED_NPC);
      track.appendChild(el);
    });
    const fin = document.createElement('div');
    fin.className = 'prog-mark final' + (frac >= 1 ? ' reached' : '');
    fin.style.left = '100%';
    fin.title = progFinalHint(bar);
    track.appendChild(fin);
  }

  function getCardTiers(){
    let tiers = [...STAGE_TABLE[stage]];
    if(stage === MAX_STAGE){
      let tier5Count = 0;
      if(perfectStreakAtMax >= 3) tier5Count = 3;
      else if(perfectStreakAtMax === 2) tier5Count = 2;
      else if(perfectStreakAtMax === 1) tier5Count = 1;
      else if(goodStreakAtMax >= 3) tier5Count = 2;
      else if(goodStreakAtMax >= 2) tier5Count = 1;
      for(let i=0;i<tier5Count;i++){ tiers[tiers.length-1-i] = 5; }
    }
    return tiers;
  }
  // pool of NPCs for a tier: the base one from DIFFICULTIES + everyone from
  // EXTRA_NPCS with that tier (extras inherit timers/steps/reward from the base)
  function tierPool(tierNum){
    const base = DIFFICULTIES[tierNum-1];
    const extras = (typeof EXTRA_NPCS !== 'undefined' ? EXTRA_NPCS : [])
      .filter(n => n.tier === tierNum)
      .map(n => {
        const merged = { ...base, ...n, type:'normal' };
        if(!n.img) delete merged.img; // картинка НЕ наследуется — только своя
        // Фаза E: 4-й уровень сложности пока есть только у стартового дрона —
        // остальные НПС того же тира его не наследуют (добавим позже, отдельно)
        if(!n.level4) delete merged.level4;
        return merged;
      });
    return [base, ...extras];
  }
  // ---------- Патч "Взаимоотношения между НПС" ----------
  // граф связей — NPC_RELATIONS (content.js): {a, b, kind:'friend'|'enemy'|'buddy'|'dislike', lore}
  const REL_REP_FRIEND = 3, REL_REP_BUDDY = 1, REL_REP_ENEMY_BASE = 3, REL_REP_DISLIKE_BASE = 1;
  function relationKey(a, b){ return [a, b].sort().join('|'); }
  // Патч "Разгрузка": связи — механика не для новичка с первой минуты.
  // Порог репутации, с которого связи персонажа вообще начинают работать,
  // зависит от его тира: 1 (зелёный) — репутация 1+; 2-3 (жёлтый/оранжевый)
  // — репутация 2+; 4-5 (красный/фиолетовый) — репутация 3+.
  function relationRepNeed(tier){
    if(tier <= 1) return 1;
    if(tier <= 3) return 2;
    return 3;
  }
  function relationUnlockedFor(npcId){
    // Фаза 3: вся система взаимоотношений открывается прогрессией с Ур.6
    // (поверх порога репутации по тиру). В дейлике связи и так выключены.
    if(!progMechUnlocked('relations')) return false;
    const npc = npcById(npcId);
    if(!npc) return false;
    return npcRepLevel(npcId) >= relationRepNeed(npc.tier);
  }
  function findRelation(idA, idB){
    if(typeof NPC_RELATIONS === 'undefined') return null;
    // Патч "Ежедневный заказ": связей нет вовсе — ни у кого, никогда
    if(isDailyMode) return null;
    const rel = NPC_RELATIONS.find(r => (r.a===idA && r.b===idB) || (r.a===idB && r.b===idA));
    if(!rel) return null;
    // связь становится видна/активна только когда ОБА участника набрали
    // репутацию, достаточную для их собственного тира
    if(!relationUnlockedFor(idA) || !relationUnlockedFor(idB)) return null;
    return rel;
  }
  function relationState(npcId){
    if(!window.PotionProfile) return null;
    return (window.PotionProfile.data.npcRelationsState || {})[npcId] || null;
  }
  function isRelationLeftCycle(npcId){
    const st = relationState(npcId);
    return !!(st && st.leftCycle);
  }

  // ============================================================
  // Патч "Ежедневный особый заказ" — параллельный режим с общим для всех
  // игроков сидом на ПОСЛЕДОВАТЕЛЬНОСТЬ ПЕРСОНАЖЕЙ (не на банки — hue/size/
  // count и т.д. остаются случайными для каждого игрока, это сознательное
  // решение против заучивания цепочки по скриншоту).
  // ============================================================
  let isDailyMode = false;
  let dailyDifficulty = null; // 'easy' | 'mid' | 'hard'
  let dailySequence = null;   // 30 id (10 дней × 3), считается один раз на сегодня

  // Патч: UTC, а не локальные getFullYear/getMonth/getDate — иначе "новый
  // день" наступал бы у каждого игрока в свою полночь по часовому поясу
  // устройства, и ежедневный заказ не был бы общим для всех одновременно
  function seedFromDate(d){
    return ((d.getUTCFullYear()*10000 + (d.getUTCMonth()+1)*100 + d.getUTCDate()) >>> 0);
  }
  function seededShuffle(arr, rng){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(rng()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }
  // все 23 персонажа гарантированно встречаются хотя бы раз; добор до 30
  // слотов берётся из ПРОДОЛЖЕНИЯ того же сид-генератора (не нового Math.random)
  function buildDailySequence(){
    const ids = (typeof ALL_NPCS !== 'undefined' ? ALL_NPCS : []).map(n=>n.id);
    const rng = mulberry32(seedFromDate(new Date()));
    const first = seededShuffle(ids, rng);
    const extra = seededShuffle(ids, rng).slice(0, 30-first.length);
    return [...first, ...extra];
  }
  // "переодевает" настоящего персонажа (имя/эмодзи/портрет/флейвор/type/
  // special — личность и уникальная механика УР.4 остаются) в одинаковые
  // числовые характеристики выбранной сложности дня
  function dailyReskinCfg(realCfg, profile){
    return { ...realCfg,
      // Патч: у большинства EXTRA_NPCS type в их собственной записи не задан
      // вовсе (в аркаде его молча подставляет tierPool() как 'normal') — тут
      // тот же дефолт нужен явно, иначе они никогда не были focus-eligible
      // в дневном режиме (см. buildOrderDescriptor) и модификаторы почти не
      // выпадали
      type: realCfg.type || 'normal',
      tier: profile.scoreTier,
      reward: profile.reward,
      memorizeMs: profile.memorizeMs,
      craftMs: profile.craftMs,
      colorSteps: profile.colorSteps,
      sizeSteps: profile.sizeSteps,
      countMax: profile.countMax,
      bsizeSteps: profile.bsizeSteps,
      dailyLevels: profile.levels,
      dailyColor: profile.color
    };
  }
  function dailyPoolForDay(dayIdx){
    if(!dailySequence) dailySequence = buildDailySequence();
    const profile = (typeof DAILY_DIFFICULTY_PROFILES !== 'undefined' && DAILY_DIFFICULTY_PROFILES[dailyDifficulty])
      || { levels:[1,2,3], color:null, reward:130, memorizeMs:5000, craftMs:13800, colorSteps:14, sizeSteps:11, countMax:10, bsizeSteps:11, scoreTier:3 };
    const npcs = (typeof ALL_NPCS !== 'undefined' ? ALL_NPCS : []);
    const slots = dailySequence.slice(dayIdx*3, dayIdx*3+3);
    return slots.map(id=>{
      const real = npcs.find(n=>n.id===id) || npcs[0];
      return dailyReskinCfg(real, profile);
    });
  }
  function enterDailyMode(diffKey){
    isDailyMode = true;
    dailyDifficulty = diffKey;
    dailySequence = buildDailySequence();
    ['collectionBtn','charactersBtn','passivesBtn'].forEach(id=>{
      const el = $(id); if(el) el.classList.add('hidden');
    });
    dayNum = 1; score = 0; streak = 0; stage = 0; perfectStreakAtMax = 0; goodStreakAtMax = 0; peteDegreeTipBonus = 0; pogromRemovedIds.clear(); pendingItemFx.timeBonusMs = 0; pendingItemFx.memBonusMs = 0; bannedNpcs.clear(); guaranteedNextNpc = null;
    $('scoreVal').textContent = score;
    $('streakVal').textContent = streak;
    $('dayVal').textContent = dayNum;
    if(typeof loadDailyYesterdayTop === 'function') loadDailyYesterdayTop();
    showSelectScreen();
  }

  // Фаза 9: «грейд выше своего». Вес кандидата по разрыву тиров (0 = родной тир):
  // родной доминирует, чужой выпадает изредка и тем реже, чем дальше от своего.
  const GRADE_WEIGHT = [1, 0.15, 0.05, 0.02, 0.008];
  // Награда подставленного персонажа масштабируется к целевому грейду (иначе
  // «фиолетовый» слот с зелёной наградой был бы невыгоден). Числа — стартовые.
  const GRADE_REWARD_MULT = [1, 1.6, 2.3, 3.2, 4.5];
  function gradeUpCfg(cfg, targetTier){
    const gap = Math.min(targetTier - cfg.tier, GRADE_REWARD_MULT.length - 1);
    // клон (НЕ мутируем общий ALL_NPCS): тот же id/механика/имя, но выше тир и
    // награда. Тир влияет на цвет карточки/пузыря, пороги (тир-5), доступность
    // модификаторов; id/имя неизменны — репутация/связи/LEVEL4_FX работают как есть.
    return Object.assign({}, cfg, { tier: targetTier, gradedFrom: cfg.tier,
      reward: Math.round(cfg.reward * GRADE_REWARD_MULT[gap]) });
  }
  function pickConfigForTier(tierNum, usedNames){
    const tierPoolFor = t => t < 5 ? tierPool(t) : [...tierPool(5), ...SPECIAL_ORDERS];
    // доступен: открыт прогрессией (аркада) + не ушёл (обида/Погром/бан умения)
    const isAvail = c => (isDailyMode || !progUnlockedNpcSet() || isNpcUnlocked(c.id))
      && !isRelationLeftCycle(c.id) && !pogromRemovedIds.has(c.id) && !bannedNpcs.has(c.id);
    // Фаза 9: кандидаты слота — персонажи РОДНОГО тира (полный вес) + НИЖНИХ тиров
    // «грейдом выше» (вес GRADE_WEIGHT[разрыв]). Ещё не использованные сегодня —
    // жёсткий запрет дублей в дне. В дейлике грейд-вариативности нет (своя
    // последовательность, pickConfigForTier там не используется).
    const gradeVariety = !isDailyMode;
    const cands = [];
    for(let t = tierNum; t >= (gradeVariety ? 1 : tierNum); t--){
      const w = GRADE_WEIGHT[Math.min(tierNum - t, GRADE_WEIGHT.length - 1)];
      tierPoolFor(t).forEach(c=>{ if(isAvail(c) && !usedNames.has(c.name)) cands.push({ c, w }); });
    }
    let chosen = cands.length ? weightedPick(cands).c : null;
    if(!chosen){
      // родной+нижние тиры исчерпаны без повтора — добираем свежего из ВЕРХНИХ
      // тиров (тоже без дубля); повтор имени — лишь абсолютный крайний случай
      for(let t = tierNum + 1; t <= 5 && !chosen; t++){
        const up = tierPoolFor(t).filter(c => isAvail(c) && !usedNames.has(c.name));
        if(up.length) chosen = pick(up);
      }
      if(!chosen){ const base = tierPoolFor(tierNum).filter(isAvail); chosen = pick(base.length ? base : tierPoolFor(tierNum)); }
    }
    // родной тир — как есть; ниже — клонируем «грейдом выше своего»
    const cfg = chosen.tier < tierNum ? gradeUpCfg(chosen, tierNum) : chosen;
    usedNames.add(cfg.name);
    return cfg;
  }

  // build a full order descriptor: cfg + focus + matching flavor line.
  // forceFocus — Патч "Ежедневный заказ": гарантированный модификатор
  // (вместо обычных случайных 40%) — см. вызов ниже в showSelectScreen
  function buildOrderDescriptor(cfg, forceFocus){
    // Фаза 3: модификаторы. focus (спектр/сгустки/габариты) — старый "фокус-
    // заказ", остаётся одиночным полем и меняет ВЕСА параметров. Новые
    // "поведенческие" модификаторы (Ур.4: timer/duck/rampage) копятся в mods[]
    // и меняют условия заказа. На Ур.7 у красных+ (тир 4-5) персонажей их может
    // быть несколько сразу (focus считается за один модификатор). Без дублей.
    let focus = null, mods = [];
    // фокус-заказы в аркаде — с Ур.3 прогрессии; в дейлике — как раньше.
    const modifiersOn = isDailyMode || progMechUnlocked('modifiers');
    // новые модификаторы (Ур.4) и мультимодификаторы (Ур.7) — только в аркаде
    const new3On  = !isDailyMode && progMechUnlocked('modifiers_new3');
    const multiOn = !isDailyMode && progMechUnlocked('modifiers_multi');
    // Патч (Тентаклоид): у него никогда не бывает обычных модификаторов —
    // его собственная механика (один скрытый решающий параметр) их заменяет
    const baseEligible  = cfg.tier >= 2 && cfg.id !== 'tentacloid';
    // фокус меняет веса регуляторов — нужен обычный набор ползунков (type normal).
    // Исключены персонажи с кастомной раскладкой ползунков (Фаза 8), где стат-фокус
    // ложился бы на неактивный/особый регулятор и ломал набор: Векс (сгустки
    // таскаются), Парфюмер (пэд цвет×накал, своя раскладка), Навигатор (детали).
    // Полностью без фокуса: Векс и Парфюмер (кастомный набор), Коллекционер
    // (грид-выбор — стат-фокус ему не применим: ни сгустков, ни габаритов, ни
    // спектра в привычном смысле). Навигатор фокус ПОЛУЧАЕТ, но ограниченный —
    // только спектр/габариты (сгустков у него нет), см. focusTypesFor ниже.
    const focusTypesFor = id => id === 'swarm_navigator' ? ['color', 'size'] : ['bubbles', 'color', 'size'];
    const focusEligible = modifiersOn && baseEligible && cfg.type === 'normal' && !MOD_FOCUS_EXCLUDE.has(cfg.id);
    if(modifiersOn && baseEligible && (forceFocus || Math.random() < 0.4)){
      // какие "виды" модификаторов доступны этому персонажу
      const kinds = [];
      if(focusEligible) kinds.push('focus');
      if(new3On){
        if(cfg.special !== 'no_timer') kinds.push('timer'); // у Того-Кто-Ждёт нет таймера игры
        kinds.push('duck');
        kinds.push('rampage');
      }
      if(kinds.length){
        // правка пользователя: почти всегда 1 модификатор. На Ур.7 у красных+
        // ИНОГДА 2 (редко — за цикл можно и не встретить), а 3 — почти невозможно.
        let count = 1;
        if(multiOn && cfg.tier >= 4){
          const r = Math.random();
          if(r < 0.015) count = 3;       // 3 модификатора — невероятно редко (~1.5%)
          else if(r < 0.12) count = 2;   // 2 — редко (~10%)
        }
        count = Math.min(count, kinds.length);
        shuffleArr(kinds).slice(0, count).forEach(k=>{
          if(k === 'focus') focus = pick(focusTypesFor(cfg.id));
          else mods.push(k);
        });
      }
    }
    const hasAnyMod = !!focus || mods.length > 0;
    // Фаза I: иногда вместо обычной реплики — уже открытая лорная фраза
    // (подсвечивается другим цветом). НЕ на заказах с модификатором: там реплика
    // несёт игровую информацию и заменять её нельзя.
    let flavor = null, isLore = false;
    // Патч "Ежедневный заказ": лорные фразы разблокируются достижениями
    // аркадного профиля — в дневном режиме их не подмешиваем вовсе
    if(!isDailyMode && !hasAnyMod && window.PotionProfile && typeof NPC_LORE !== 'undefined' && NPC_LORE[cfg.id]){
      const unl = (((window.PotionProfile.data.lorePhrases||{}).unlockedByNpc||{})[cfg.id]) || [];
      const chance = (typeof LORE_PHRASE_CHANCE !== 'undefined') ? LORE_PHRASE_CHANCE : 0.35;
      if(unl.length && Math.random() < chance){
        const ph = NPC_LORE[cfg.id][ unl[randInt(0, unl.length-1)] ];
        if(ph){ flavor = ph; isLore = true; }
      }
    }
    // flavor keeps both languages (see pickLocalized) so a language switch
    // mid-round translates the same line instead of rerolling a new one
    if(!flavor) flavor = focus && cfg.ff ? pickLocalized(cfg.ff[focus]) : pickLocalized(cfg.flavors);
    // avatar variant is chosen once here, so the card and the order bubble match
    const avatar = Array.isArray(cfg.img) ? pick(cfg.img) : (cfg.img || cfg.emoji);
    return { cfg, focus, mods, flavor, avatar, isLore };
  }

  // cached so a language switch can re-render the same cards without rerolling them
  let currentOrders = [];

  // Фаза 3, модификатор "Погром": id персонажей, "подравшихся" в этом цикле —
  // до конца цикла они больше не выпадают (см. pickConfigForTier). Сбрасывается
  // в началах цикла (там же, где dayNum = 1).
  let pogromRemovedIds = new Set();

  // Фаза 6, магазин: отложенные эффекты предметов, применённых в фазе выбора
  // (сейчас — только бонус времени от "Сломанного секундомера"). Действуют на
  // СЛЕДУЮЩИЙ заказ, гасятся при старте варки. Эффекты, применённые во время
  // варки, живут в target.itemFx (сбрасывается на каждый заказ).
  let pendingItemFx = { timeBonusMs: 0, memBonusMs: 0 };

  // Фаза 7: умения. guaranteedNextNpc — id гостя, гарантированно попадающего в
  // следующую тройку («Кто там?»). bannedNpcs — id, не появляющиеся до конца
  // цикла («Этих не пускайте»). Сбрасываются в началах цикла.
  let guaranteedNextNpc = null;
  let bannedNpcs = new Set();

  // Патч "Взаимоотношения": разовые эффекты на ДРУГИХ НПС тройки, связанных с
  // тем, кого игрок только что выбрал для заказа. Возвращает мс задержки
  // перед стартом заказа (чтобы анимация на карточке успела доиграть), 0 —
  // если эффектов не было (тройка без связей — без задержки).
  function applyRelationPickEffects(chosenId, orders, chosenIdx, wrap){
    if(!window.PotionProfile) return 0;
    let anyAnimated = false;
    orders.forEach((o, j)=>{
      if(j === chosenIdx) return;
      const otherId = o.cfg.id;
      const rel = findRelation(chosenId, otherId);
      if(!rel) return;
      const otherCard = wrap.children[j];
      const before = window.PotionProfile.data.npcReputation[otherId] || { value:0 };
      const beforeVal = before.value;
      if(rel.kind === 'friend'){
        const rep = window.PotionProfile.adjustReputation(otherId, REL_REP_FRIEND);
        maybeRepLevelUp(otherId, beforeVal, rep.value);
        if(otherCard){
          otherCard.classList.add('relation-hit-good');
          setTimeout(()=> otherCard.classList.remove('relation-hit-good'), 700);
        }
        anyAnimated = true;
      } else if(rel.kind === 'buddy'){
        const rep = window.PotionProfile.adjustReputation(otherId, REL_REP_BUDDY);
        maybeRepLevelUp(otherId, beforeVal, rep.value);
      } else if(rel.kind === 'enemy' || rel.kind === 'dislike'){
        const bump = window.PotionProfile.bumpGrudge(otherId);
        const scale = Math.min(bump.state.grudge, 3);
        const base = rel.kind === 'enemy' ? REL_REP_ENEMY_BASE : REL_REP_DISLIKE_BASE;
        window.PotionProfile.adjustReputation(otherId, -base * scale);
        if(rel.kind === 'enemy' && otherCard){
          otherCard.classList.add('relation-hit-bad');
          setTimeout(()=> otherCard.classList.remove('relation-hit-bad'), 700);
          anyAnimated = true;
        }
        const npc = npcById(otherId);
        if(bump.justOffended && npc){
          showToast({ icon:'😤', prefix: UI_TEXT.REL_OFFENDED_TOAST, name: LT(npc.name) });
        }
        if(bump.justLeft && npc){
          showToast({ icon:'🚪', prefix: UI_TEXT.REL_LEFT_TOAST, name: LT(npc.name) });
        }
      }
    });
    return anyAnimated ? 650 : 0;
  }

  // Фаза 3: плашки модификаторов заказа — фокус (спектр/сгустки/габариты) +
  // поведенческие (таймер/утка/погром). hideEmpty=true → пусто, когда нет
  // модификаторов (для реплики-пузыря в раунде); иначе чип "без модификатора".
  function modChipsHTML(focus, mods, hideEmpty){
    const chips = [];
    if(focus){
      chips.push(`<div class="focus-chip">${visualHTML(FOCUS_ICONS[focus],'focus-img')}<span>${LT(FOCUS_NAMES[focus])}</span></div>`);
    }
    (mods||[]).forEach(m=>{
      chips.push(`<div class="focus-chip mod-${m}" title="${LT(MOD_DESC[m])}">${visualHTML(MOD_ICONS[m],'focus-img')}<span>${LT(MOD_NAMES[m])}</span></div>`);
    });
    if(!chips.length){
      return hideEmpty ? '' : `<div class="focus-chip no-focus"><span class="no-focus-icon">✕</span><span>${LT(UI_TEXT.NO_FOCUS_LABEL)}</span></div>`;
    }
    return chips.join('');
  }

  // Фаза D (v2): иконка непися — просто круг с портретом (2x крупнее) и
  // свечением/рамкой в цвет tier. Имя больше не рисуется полукругом (было
  // нечитаемо) — по клику на иконку оно выезжает справа от неё обычным
  // читаемым шрифтом, повторный клик — прячет обратно. Модификатор задания
  // (если есть) больше не всплывающий бейдж поверх текста, а отдельный
  // "отсек" внутри самой плашки — свой цвет текста/иконки, без наложений.
  function renderCustomerCards(orders){
    const wrap = $('customerCards');
    wrap.innerHTML = '';
    orders.forEach((ord, i)=>{
      const { cfg, focus, flavor, avatar, isLore } = ord;
      // Патч "Ежедневный заказ": свой цвет рамки вместо TIER_COLORS (там нет синего)
      const tierColor = cfg.dailyColor || TIER_COLORS[cfg.tier];
      const npcNameStr = LT(cfg.name);

      const card = document.createElement('div');
      card.className = 'customer-card' + (ord.sealed ? ' sealed' : '');
      card.style.setProperty('--tier-color', tierColor);

      // Фаза E: 4-й уровень сложности показывается только у НПС с cfg.level4
      // (пока — только у стартового дрона)
      // Фаза J: 4-я сложность открывается и по репутации (см. level4Available)
      // Патч "Ежедневный заказ": у "переодетых" cfg свой фиксированный список
      // уровней (см. dailyLevels) — репутация в этом режиме не участвует
      const levels = cfg.dailyLevels ? cfg.dailyLevels : (level4Available(cfg) ? [1,2,3,4] : [1,2,3]);
      const levelCardsHTML = levels.map(lvl=>{
        const reward = Math.round(cfg.reward * (REG_DIFF_REWARD_MULT[lvl]||1) * (focus?1.25:1));
        return `
          <button type="button" class="level-card ${lvl===4?'level-4':''}" data-level="${lvl}" title="${LT(UI_TEXT['DIFF_BTN_TITLE_'+lvl])}">
            <span class="level-tag">${LT(UI_TEXT.DIFF_BTN_LABEL)}${lvl}${lvl===4?' ⚠':''}</span>
            <span class="level-reward">${LT(UI_TEXT.REWARD_PREFIX)}${reward}</span>
          </button>`;
      }).join('');

      card.innerHTML = `
        <div class="npc-icon" tabindex="0">
          <div class="icon-glow">
            <div class="icon-img">${visualHTML(avatar,'npc-img')}</div>
          </div>
          ${ord.sealed ? `<div class="seal-badge" title="${LT(UI_TEXT.ARCH_SEAL_TAG)}">📜</div>` : ''}
          ${cfg.gradedFrom ? `<div class="grade-badge" title="${LT(UI_TEXT.GRADE_UP_TAG)}">↑</div>` : ''}
          <div class="icon-name-reveal"><span>${npcNameStr}</span></div>
        </div>
        <div class="plaque-stack">
          <div class="plaque-quote">
            <div class="quote${isLore ? ' lore' : ''}">«${LT(flavor)}»</div>
            ${modChipsHTML(focus, ord.mods)}
          </div>
          <div class="plaque-levels">${levelCardsHTML}</div>
        </div>
        <div class="relation-notes"></div>
      `;

      const icon = card.querySelector('.npc-icon');
      const quote = card.querySelector('.plaque-quote');
      const relNotesEl = card.querySelector('.relation-notes');

      // Патч "Взаимоотношения": с кем из ЭТОЙ тройки у этого НПС есть связь
      const relMatches = orders
        .map((o, j) => j===i ? null : { other:o, rel: findRelation(cfg.id, o.cfg.id) })
        .filter(m => m && m.rel);

      function expand(){
        wrap.querySelectorAll('.customer-card.expanded').forEach(c=>{ if(c!==card) c.classList.remove('expanded'); });
        card.classList.remove('name-open');
        card.classList.add('expanded');
        if(relMatches.length && window.PotionProfile){
          relNotesEl.innerHTML = relMatches.map(m=>{
            const pool = (typeof RELATION_COMMENTS !== 'undefined') ? RELATION_COMMENTS[m.rel.kind] : null;
            const line = pool ? LT(pickLocalized(pool)).replace('{name}', LT(m.other.cfg.name)) : '';
            return `<div class="relation-note ${m.rel.kind}">${line}</div>`;
          }).join('');
          relNotesEl.classList.add('has-notes');
          relMatches.forEach(m=>{
            const key = relationKey(cfg.id, m.other.cfg.id);
            if(window.PotionProfile.discoverRelation(key)){
              showToast({ icon:'🔗', prefix: UI_TEXT.REL_DISCOVERED_TOAST,
                name: LT(cfg.name) + ' × ' + LT(m.other.cfg.name) });
            }
          });
        } else {
          relNotesEl.classList.remove('has-notes');
          relNotesEl.innerHTML = '';
        }
      }
      function collapse(){ card.classList.remove('expanded'); }

      quote.addEventListener('click', ()=>{
        SFX.uiClick();
        expand();
      });
      icon.addEventListener('click', ()=>{
        SFX.uiClick();
        if(card.classList.contains('expanded')){ collapse(); return; }
        card.classList.toggle('name-open');
      });
      card.querySelectorAll('.level-card').forEach(btn=>{
        btn.addEventListener('click', (e)=>{
          e.stopPropagation();
          const lvl = parseInt(btn.dataset.level,10);
          // Патч "Взаимоотношения": обиженный на игрока НПС может отказать
          // (нет в ежедневном режиме и пока связи этого НПС не разблокированы репутацией)
          const st = (!isDailyMode && relationUnlockedFor(cfg.id)) ? relationState(cfg.id) : null;
          if(st && st.offended && Math.random() < 0.5){
            SFX.badPop();
            card.classList.add('relation-hit-bad');
            setTimeout(()=> card.classList.remove('relation-hit-bad'), 500);
            showToast({ icon:'😤', prefix: LT(cfg.name), name: LT(pickLocalized(RELATION_REFUSE_PHRASES)) });
            return;
          }
          SFX.cardPick();
          // Патч (Ир): на УР.1/2 он сперва показывает меню доверия
          if(cfg.special === 'trust' && lvl < 3){ openIrTrustMenu(ord, lvl); return; }
          const delayMs = applyRelationPickEffects(cfg.id, orders, i, wrap);
          if(delayMs > 0) setTimeout(()=> startOrder(ord, lvl), delayMs);
          else startOrder(ord, lvl);
        });
      });

      wrap.appendChild(card);
    });
  }

  // ============================================================
  // Патч "Уникальные механики тир-5": состояние сессии
  // ============================================================
  // Ир: ожидающий бафф/дебафф на следующее задание — {kind:'buff'|'debuff'}
  let irPending = null;
  // Патч "УР.4" (Тот-Кто-Ждёт): строгие 100% дарят бафф на СЛЕДУЮЩИЙ заказ
  // (у любого НПС) — таймер идёт вдвое медленнее (см. WAITER_SLOW_BUFF)
  let waiterSlowPending = false;
  // Патч (Ир, усиленный бафф "Второй рассвет"): переигровка теперь не разовая —
  // держится, пока результат не идеален и пока игрок сам не примет его (nextBtn)
  let irReplayActive = false;
  // Патч (Ир, усиленный дебафф "Дважды безупречно"): на переигровку идеала
  // обязательно вешаем ЕЩЁ один из двух других дебаффов ('mono'|'time_minus')
  let irForceReplayExtra = null;
  // Хранитель: активная кампания печатей — { remaining, total, resolved,
  // perfects, perfectNpcs:[], tripleActive }
  let archSeal = null;
  // снимок состояния цикла до применения результата — для "переигровок" Ир
  let preResultSnapshot = null;

  // локализованная строка с подстановкой {name}
  function localizedWithName(tpl, nameObj){
    const nm = (v)=> (nameObj && typeof nameObj === 'object') ? (nameObj[v] ?? nameObj.ru ?? nameObj.en) : nameObj;
    if(tpl && typeof tpl === 'object'){
      return { ru: String(tpl.ru ?? tpl.en).replace('{name}', nm('ru')),
               en: String(tpl.en ?? tpl.ru).replace('{name}', nm('en')) };
    }
    return String(tpl).replace('{name}', nm('ru'));
  }

  // баннеры эффектов на экране выбора ("поле заданий")
  function renderSelectBanners(){
    const host = $('selectBanners');
    if(!host) return;
    let html = '';
    if(irPending){
      const isBuff = irPending.kind === 'buff';
      html += `<div class="fx-banner ${isBuff?'buff':'debuff'}">
        <span class="fx-banner-icon">${isBuff?'🌅':'🌑'}</span>
        <span>${LT(isBuff ? UI_TEXT.IR_FX_BUFF_TAG : UI_TEXT.IR_FX_DEBUFF_TAG)}</span></div>`;
    }
    if(archSeal && archSeal.remaining >= 0 && (archSeal.remaining > 0 || archSeal.tripleActive)){
      const shown = archSeal.remaining + (archSeal.tripleActive ? 1 : 0);
      html += `<div class="fx-banner seal">${LT(UI_TEXT.ARCH_SEAL_BANNER).replace('{n}', shown)}</div>`;
    }
    host.innerHTML = html;
  }

  function showSelectScreen(){
    $('roundScreen').classList.remove('show');
    $('selectScreen').classList.add('show');
    $('resultOverlay').classList.remove('show');
    updateNickBadge(); // Фаза 4: ник внизу слева (только аркадный основной режим)
    updateProgressionGates(); // Фаза 3: актуализируем видимость кнопок/длину цикла
    $('dayVal').textContent = dayNum;

    // Патч "Ежедневный заказ": пул на день — фиксированная (по сиду дня)
    // тройка персонажей, а не случайные тиры прогрессии
    if(isDailyMode){
      const dailyPool = dailyPoolForDay(dayNum-1);
      // Патч: модификаторы — с ПЕРВОГО дня (не с 4-5), и минимум у ДВУХ из
      // трёх персонажей дня (обычные случайные 40% на каждого слишком часто
      // давали дни вообще без модификаторов) — форсируем нужное число, среди
      // тех, кому модификатор в принципе доступен (см. focusEligible выше)
      const eligibleIdx = dailyPool
        .map((cfg,i)=>({cfg,i}))
        .filter(o => o.cfg.type === 'normal' && o.cfg.tier >= 2 && o.cfg.id !== 'tentacloid' && o.cfg.id !== 'vex')
        .map(o=>o.i);
      const forceIdx = new Set(shuffleArr(eligibleIdx).slice(0, Math.min(2, eligibleIdx.length)));
      currentOrders = dailyPool.map((cfg,i) => buildOrderDescriptor(cfg, forceIdx.has(i)));
      renderSelectBanners();
      renderCustomerCards(currentOrders);
      return;
    }

    // Фаза 3: размер пула дня задаётся прогрессией (2 → 3 → 4). STAGE_TABLE даёт
    // ряд из 3 тиров — подрезаем/добираем до нужного числа карточек.
    let tiers = getCardTiers();
    const poolSize = progPoolSize();
    if(tiers.length > poolSize) tiers = tiers.slice(0, poolSize);
    else while(tiers.length < poolSize) tiers.push(tiers[tiers.length - 1]);
    const usedNames = new Set();
    currentOrders = tiers.map(t=> buildOrderDescriptor(pickConfigForTier(t, usedNames)));

    // Фаза 7, умение «Кто там?»: гарантируем гостя в этой тройке (один раз)
    if(guaranteedNextNpc){
      const already = currentOrders.some(o => o.cfg.id === guaranteedNextNpc);
      if(!already){
        const gcfg = cfgById(guaranteedNextNpc);
        if(gcfg) currentOrders[randInt(0, currentOrders.length - 1)] = buildOrderDescriptor(gcfg);
      }
      guaranteedNextNpc = null;
    }

    // Патч (Хранитель): пока идёт кампания печатей — в каждой тройке одно
    // задание отмечается печатью (кроме самого Хранителя). Заряд тратится
    // на тройку независимо от того, выберет ли игрок отмеченного.
    // (кампания печатей — прогрессия, завязанная на профиль — в дневном
    // режиме её нет, см. ранний return выше)
    if(archSeal && archSeal.remaining > 0){
      const candidates = currentOrders.filter(o => o.cfg.id !== 'archivist');
      if(candidates.length){
        const chosen = pick(candidates);
        chosen.sealed = true;
        chosen.isKeeper = true;
        chosen.focus = null; chosen.mods = []; // печать заменяет реплику — модификаторы снимаются, чтобы не терять игровую информацию
        chosen.flavor = localizedWithName(pickLocalized(ARCH_SEAL_ORDER_PHRASES), chosen.cfg.name);
        archSeal.remaining--;
        archSeal.tripleActive = true;
      }
    }
    renderSelectBanners();
    renderCustomerCards(currentOrders);
  }

  // ---------- Патч (Ир): меню доверия ----------
  let irTrustCtx = null; // {ord, level}
  function openIrTrustMenu(ord, level){
    irTrustCtx = { ord, level };
    const ov = $('irTrustOverlay');
    if(!ov){ startOrder(ord, level); return; }
    $('irTrustPortrait').innerHTML = visualHTML(ord.avatar, 'npc-img');
    $('irTrustPhrase').textContent = LT(pickLocalized(IR_TRUST_PHRASES));
    $('irTrustKeepBtn').textContent = LT(UI_TEXT.IR_TRUST_KEEP).replace('{n}', level);
    $('irTrustAcceptBtn').textContent = LT(UI_TEXT.IR_TRUST_ACCEPT);
    ov.classList.add('show');
  }
  const irKeepBtnEl = $('irTrustKeepBtn');
  if(irKeepBtnEl) irKeepBtnEl.addEventListener('click', ()=>{
    SFX.uiClick();
    $('irTrustOverlay').classList.remove('show');
    if(irTrustCtx) startOrder(irTrustCtx.ord, irTrustCtx.level);
    irTrustCtx = null;
  });
  const irAcceptBtnEl = $('irTrustAcceptBtn');
  if(irAcceptBtnEl) irAcceptBtnEl.addEventListener('click', ()=>{
    SFX.cardPick();
    $('irTrustOverlay').classList.remove('show');
    if(window.PotionProfile) window.PotionProfile.bumpNpcStat('last_of_ir', 'irTrust', 1);
    checkNpcAchievements('last_of_ir');
    if(irTrustCtx) startOrder(irTrustCtx.ord, 3);
    irTrustCtx = null;
  });

  let currentOrd = null; // remembered so a language switch can re-translate the order bubble
  let currentPhase = null; // 'scan' | 'craft' — so a language switch re-translates the phase label
  let lastResult = null; // last finalizeResult() output — so a language switch can re-translate the result overlay

  function startOrder(ord, level){
    const { cfg, focus, flavor, avatar } = ord;
    let regLevel = [1,2,3,4].includes(level) ? level : 3;
    // Патч "Ежедневный заказ": у "переодетых" cfg свой список уровней —
    // репутация тут не участвует вообще (см. cfg.dailyLevels в enterDailyMode)
    const allowLevel4 = cfg.dailyLevels ? cfg.dailyLevels.includes(4) : level4Available(cfg);
    if(regLevel === 4 && !allowLevel4) regLevel = 3; // защита: 4 доступен только там, где разрешён
    currentOrd = ord;
    currentOrd.regLevel = regLevel;
    orderNum++;
    // Фаза 3: отмечаем первую встречу персонажа. markNpcMet вернёт true ровно
    // один раз — тогда вместо обычной фразы показываем приветствие с намёком
    // на механику (3C). В коллекции персонаж тоже появляется только после встречи.
    const firstMeet = (!isDailyMode && window.PotionProfile) ? window.PotionProfile.markNpcMet(cfg.id) : false;
    const greeting = (firstMeet && typeof NPC_GREETINGS !== 'undefined') ? NPC_GREETINGS[cfg.id] : null;
    // Патч (Диджей Пульсар): на время его заказа общий эмбиент приглушаем до
    // нуля (не мешать его собственному ритму) — на любом другом заказе звук
    // возвращается
    setDjAmbientDuck(cfg.id === 'dj_pulsar');
    stopMovingAnim();
    stopBadBubbles(); // сбрасываем "плохие" пузыри прошлого заказа, если были
    stopMatrixRain();      // Патч: дождь символов прошлого заказа
    level4Stop();           // Патч: механика УР.4 прошлого заказа, если была
    $('windowFrame').classList.remove('ir-mono');
    $('selectScreen').classList.remove('show');
    $('roundScreen').classList.add('show');
    $('orderNum').textContent = orderNum;
    $('orderAvatar').innerHTML = visualHTML(avatar,'npc-img');
    $('orderText').textContent = LT(greeting || flavor); // Фаза 3: первая встреча → приветствие
    $('orderText').classList.toggle('greeting', !!greeting);
    $('orderText').classList.toggle('lore', !greeting && !!ord.isLore); // Фаза I: лор — другим цветом
    $('orderText').classList.toggle('keeper', !greeting && !!ord.isKeeper); // Патч: фраза Хранителя — золотом
    $('orderBubble').style.borderLeftColor = TIER_COLORS[cfg.tier];
    $('orderFocusTag').innerHTML = modChipsHTML(focus, ord.mods, true);
    const levelTag = $('orderLevelTag');
    if(levelTag) levelTag.textContent = LT(UI_TEXT.DIFF_BTN_LABEL) + regLevel;
    SFX.orderShow();

    const flags = computeFlags(cfg);
    // Парфюмер (Фаза 8: механика с УР.1): «накал» доступен ему на ВСЕХ уровнях —
    // его фишка это пэд цвет×накал (обычно sat требует tier>=4, у него исключение).
    if(cfg.id === 'perfumer') flags.hasSat = true;
    // Пит (правка пользователя): накал у него ЕСТЬ на УР.4 (хоть он и зелёный —
    // обычно sat только tier>=4). Включаем флаг; активируется на УР.4 в computeActiveKeys.
    if(cfg.id === 'pete') flags.hasSat = true;
    const hueIdx = randInt(0, cfg.colorSteps-1);
    const sizeIdx = randInt(0, cfg.sizeSteps-1);
    let bsizeIdx = randInt(0, cfg.bsizeSteps-1);
    let count = randInt(1, cfg.countMax);
    // Патч (Шеф туманности): число сгустков выше 5 выпадает СИЛЬНО чаще
    if(cfg.countBias === 'high' && cfg.countMax > 5){
      count = Math.random() < 0.82 ? randInt(6, cfg.countMax) : randInt(1, 5);
    }
    // Векс (Фаза 8: механика на всех уровнях): число сгустков растёт по уровню —
    // 3 / 4 / 5 / (5-7). Размер — средний (никогда не самый большой и не самый
    // маленький — их удобно хватать и таскать к узлам сетки).
    if(cfg.id === 'vex'){
      count = regLevel >= 4 ? randInt(5, 7) : (regLevel === 3 ? 5 : (regLevel === 2 ? 4 : 3));
      const bLo = Math.round(cfg.bsizeSteps*0.35), bHi = Math.round(cfg.bsizeSteps*0.7);
      bsizeIdx = randInt(Math.max(0,bLo), Math.min(cfg.bsizeSteps-1, Math.max(bLo,bHi)));
    }

    target = {
      cfg, type: cfg.type, flags, focus, mods: ord.mods || [], itemFx: {}, regLevel,
      hue: idxToVal(hueIdx, cfg.colorSteps, 360), hueIdx,
      size: idxToVal(sizeIdx, cfg.sizeSteps, 100), sizeIdx,
      bsize: idxToVal(bsizeIdx, cfg.bsizeSteps, 100), bsizeIdx,
      count,
      sat: 70,
      seed: randInt(1,99999)
    };
    if(flags.hasGradient){
      // Патч (Двуликая жрица, Фаза 0): разброс между половинами теперь ПОЧТИ
      // гарантирован. Раньше переигрывали лишь точное совпадение, из-за чего
      // часто выпадали соседние (едва различимые) оттенки. Теперь требуем
      // заметную дистанцию по ЦВЕТОВОМУ КРУГУ (с учётом заворота 0↔max), сильно
      // давя соседние цвета. ~6% оставляем полный рандом ради разнообразия.
      const steps = cfg.colorSteps;
      const circDist = (a,b)=>{ const d = Math.abs(a-b); return Math.min(d, steps-d); };
      const minSep = Math.max(1, Math.round(steps * 0.30));
      let hue2Idx = randInt(0, steps-1);
      if(steps > 2 && Math.random() > 0.06){
        let guard = 24;
        while(circDist(hue2Idx, hueIdx) < minSep && guard-- > 0) hue2Idx = randInt(0, steps-1);
      }
      target.hue2 = idxToVal(hue2Idx, steps, 360);
      target.hue2Idx = hue2Idx;
    }
    // Патч (Сверхновая): второй габарит — высота ('size' здесь = ширина).
    // Ширина и высота всегда хоть немного, но разные — иначе банка
    // выглядит квадратной и разница между габаритами не читается
    if(cfg.special === 'dual_size'){
      const minGap = Math.max(2, Math.round(cfg.sizeSteps*0.15));
      let size2Idx = randInt(0, cfg.sizeSteps-1);
      let guard = 20;
      while(Math.abs(size2Idx-sizeIdx) < minGap && guard-- > 0) size2Idx = randInt(0, cfg.sizeSteps-1);
      target.size2 = idxToVal(size2Idx, cfg.sizeSteps, 100);
      target.size2Idx = size2Idx;
    }
    // Фаза 10 (Пьяница Пит): «уровень жидкости» — цель заказа (учитывается в
    // скоринге). Минимум ~1 деление, чтобы жидкости всегда было видно на глаз
    // (совсем пустая банка бесцветна и нечитаема).
    if(cfg.id === 'pete'){
      const fillIdx = randInt(1, cfg.sizeSteps-1);
      target.fillIdx = fillIdx;
      target.fill = idxToVal(fillIdx, cfg.sizeSteps, 100);
    }
    // Патч (Ир): ожидающий бафф/дебафф превращается в конкретный эффект
    // этого заказа — один из трёх соответствующего знака
    if(irPending && typeof IR_EFFECTS !== 'undefined'){
      const def = pick(IR_EFFECTS[irPending.kind] || IR_EFFECTS.buff);
      target.irEffect = { kind: irPending.kind, id: def.id, def };
      irPending = null;
    }
    // Патч (Ир, усиленное "Дважды безупречно"): на переигровку идеала
    // обязательно вешаем ещё один из двух других дебаффов
    if(ord._irReplay && irForceReplayExtra && typeof IR_EFFECTS !== 'undefined'){
      const extraDef = IR_EFFECTS.debuff.find(d => d.id === irForceReplayExtra);
      if(extraDef) target.irEffect = { kind:'debuff', id: extraDef.id, def: extraDef };
      irForceReplayExtra = null;
    }
    // Патч "УР.4" (Тот-Кто-Ждёт): дар за прошлые строгие 100% — этот заказ
    // (у любого НПС) идёт с таймером вдвое медленнее
    if(waiterSlowPending){
      target.waiterSlowBuff = true;
      waiterSlowPending = false;
    }
    // Патч (Хранитель): печать на заказе
    if(ord.sealed) target.sealed = true;

    // тег активного эффекта в шапке заказа ("поле заданий")
    const fxTag = $('orderFxTag');
    if(fxTag){
      let fxHtml = '';
      if(target.irEffect){
        const d = target.irEffect.def;
        fxHtml += `<span class="fx-chip ${target.irEffect.kind}" title="${LT(d.desc)}">${d.icon} ${LT(d.name)}</span>`;
      }
      if(target.sealed) fxHtml += `<span class="fx-chip seal">📜 ${LT(UI_TEXT.ARCH_SEAL_TAG)}</span>`;
      if(target.waiterSlowBuff && typeof WAITER_SLOW_BUFF !== 'undefined'){
        fxHtml += `<span class="fx-chip buff" title="${LT(WAITER_SLOW_BUFF.desc)}">${WAITER_SLOW_BUFF.icon} ${LT(WAITER_SLOW_BUFF.name)}</span>`;
      }
      fxTag.innerHTML = fxHtml;
    }
    // Патч (Хранитель): дождь символов в фазах запоминания и игры
    if(cfg.special === 'matrix' || target.sealed) startMatrixRain();
    if(flags.hasShape){ target.shapeIdx = randInt(0, SHAPE_PROFILES.length-1); }
    // Патч (кастомные бутыли): рисованный сосуд у всех, кроме тех, у кого
    // силуэт банки — часть их собственной механики (Шеф угадывает форму;
    // Коллекционер УР.4 и Тот-Кто-Ждёт УР.4 полагаются на свой конкретный
    // силуэт). shapeIdx=1 ("Блок") — самый близкий к прямоугольной прорези
    // кастомного арта профиль, нужен для clip-path/раскладки пузырей.
    const customBottleExcluded = flags.hasShape
      || cfg.id === 'collector_gz'
      || (cfg.id === 'the_waiter' && regLevel === 4);
    if(!customBottleExcluded && typeof CUSTOM_BOTTLES_ENABLED !== 'undefined' && CUSTOM_BOTTLES_ENABLED && CUSTOM_BOTTLES.length){
      target.customBottle = pick(CUSTOM_BOTTLES);
      target.shapeIdx = 1;
      // Патч (Сверхновая + кастомная бутыль): крышка+донышко тянутся от
      // ШИРИНЫ, а не высоты — на широкой-и-плоской комбинации им может не
      // хватить высоты, и они сплющиваются друг в друга. Если высота от
      // рандома выпала ниже безопасного минимума для уже выпавшей ширины —
      // поднимаем её (не трогая ширину, она уже отрисована на карточке).
      if(cfg.special === 'dual_size'){
        const cb = target.customBottle;
        const wNow = 60 + (target.size/100)*60;
        const capBaseOnW = (cb.capH + cb.baseH) / cb.holeW; // во сколько раз крышка+донышко больше ширины
        const hMin = wNow*capBaseOnW + 20; // +20 — чтобы тело не схлопывалось в полоску
        const size2Min = Math.max(0, Math.min(100, ((hMin-140)/70)*100));
        if(target.size2 < size2Min){
          target.size2 = size2Min;
          target.size2Idx = Math.round((size2Min/100)*(cfg.sizeSteps-1));
        }
      }
    }
    if(flags.hasSat){
      const satIdx = randInt(0,9);
      target.sat = satFromIdx(satIdx);
      target.satIdx = satIdx;
    }
    if(cfg.type === 'moving'){
      target.count = randInt(5, Math.max(5,cfg.countMax));
      target.moveSpeed = randInt(45, 95);
    }
    // Патч (крышки): своя крышка на персонажа — фиксированная (не зависит
    // от заказа), поэтому берётся из справочника по id, а не рандомится
    target.capIdx = (typeof NPC_CAP_STYLE !== 'undefined' && NPC_CAP_STYLE[cfg.id]) || 0;
    // Патч (растровые декор-слои): крышка/наклейка поверх математической
    // банки — необязательно, пока список пуст (см. NPC_DECOR в content.js)
    target.decor = (typeof NPC_DECOR !== 'undefined' && NPC_DECOR[cfg.id]) || null;

    // считаем доступные регуляторы уже сейчас (а не только в начале фазы
    // "воссоздай") — чтобы фаза показа тоже не рисовала сгустки, которых
    // на этой сложности всё равно не будет в задании
    target.activeKeys = computeActiveKeys(regLevel, target);
    level4SetupOrder(); // Патч "УР.4": рандомизация своих полей target для этого НПС
    // Правка (пользователь): у Парфюмера на УР.1 размер банки не участвует — банка
    // должна быть СТАНДАРТНОЙ (средний размер), а не случайно зафиксированной.
    if(cfg.id === 'perfumer' && !target.activeKeys.has('size')){
      const midIdx = Math.floor((cfg.sizeSteps - 1) / 2);
      target.sizeIdx = midIdx;
      target.size = idxToVal(midIdx, cfg.sizeSteps, 100);
    }
    // Правка (пользователь): у Коллекционера сложность меняет ТОЛЬКО размер сетки —
    // форма/сгустки/цвет банки показываются и учитываются на всех уровнях (иначе
    // на УР.1 банка запоминания без сгустков, а в сетке выбора сгустки везде).
    const isCollectorMech = target.cfg.id === 'collector_gz';
    const noBubblesPreview = !isCollectorMech && !target.activeKeys.has('count') && !target.activeKeys.has('bsize');

    const targetR = 3 + (target.bsize/100)*9;
    // Патч "УР.4" (Хозяин Роя): мухи рисуются отдельными DOM-элементами,
    // а не SVG-пузырьками — банка всегда пустая по count для него
    const isFlySwarm = mechActive('swarm_navigator');
    // Патч "УР.4" (Двуликая жрица): банка разделена на 2 половины со своими
    // независимыми счётчиками сгустков
    const isTwofacedSplit = cfg.id === 'twofaced_priestess' && regLevel === 4;
    // Патч "УР.4" (Векс): сгустки — отдельные перетаскиваемые DOM-элементы,
    // а не SVG-пузырьки — банка всегда пустая по count для него
    const isVexDrag = cfg.id === 'vex';
    if(cfg.type === 'moving'){
      startMovingAnim();
    } else {
      drawJar({ hue:target.hue, hue2: target.hue2 ?? null, sat:target.sat, sizePct:target.size,
        heightPct: target.size2 ?? null,
        bubbleCount: (isFlySwarm || isVexDrag) ? 0 : (noBubblesPreview ? 0 : target.count),
        bubbleR:targetR, seed:target.seed, shapeIdx: target.shapeIdx ?? 0,
        splitHalves: isTwofacedSplit, bubbleCountB: isTwofacedSplit ? (target.countB||0) : 0,
        showGrid: isVexDrag, customBottle: target.customBottle, capIdx: target.capIdx, decor: target.decor,
        // Фаза 10 (Пит): показываем и уровень жидкости
        fillPct: (cfg.id === 'pete') ? target.fill : null,
        // Патч "УР.4" (Сверхновая): банку на фазе показа тоже нужно повернуть —
        // раньше поворот применялся только к банке игрока на фазе игры
        rotationDeg: (cfg.id === 'supernova_child' && regLevel === 4) ? target.rotation : null });
    }

    $('fog').classList.remove('show');
    $('panel').classList.remove('show');
    $('panel').classList.remove('locked');
    $('leftCol').classList.remove('show');
    $('rightCol').classList.remove('show');
    currentPhase = 'scan';
    refreshShopDockState(); // Фаза 6: в фазе запоминания инвентарь недоступен
    refreshSkillDock();     // Фаза 7: умения вне экрана выбора недоступны
    $('phaseLabel').textContent = LT(UI_TEXT.PHASE_SCAN);
    $('brewBtn').disabled = false;
    craftLocked = false;

    initRing();
    setRingFraction(0);
    // Фаза J: эффекты активных пассивок фиксируются на весь заказ
    target.passiveFx = computePassiveFx(cfg.id);
    // Патч (Уборщик УР.4): +1с на запоминание — компенсация за то, что
    // внимание всё время уходит на протирку грязного стекла тряпкой
    const janitorL4Bonus = (cfg.id === 'janitor' && regLevel === 4) ? 1000 : 0;
    // Патч (Модница УР.4): фаза показа теперь обычная (цикл цветов убран) —
    // таймер чуть длиннее, раз регуляторы на игре будут открываться по одному
    const fashionistaL4Bonus = (cfg.id === 'fashionista' && regLevel === 4) ? 1500 : 0;
    // Фаза 6, "Тоник ясности": отложенный бонус времени запоминания (применён в фазе выбора)
    let clarityBonus = 0;
    if(pendingItemFx.memBonusMs){ clarityBonus = pendingItemFx.memBonusMs; pendingItemFx.memBonusMs = 0; }
    // Правка (пользователь): фиолетовый грейд (тир 5, в т.ч. по грейд-вариативности)
    // — на запоминание +30% времени.
    const purpleMemMult = cfg.tier === 5 ? 1.3 : 1;
    const memDuration = Math.round(cfg.memorizeMs * MEM_TIME_SCALE * purpleMemMult * (1 + (target.passiveFx.memTime || 0))) + janitorL4Bonus + fashionistaL4Bonus + clarityBonus;
    target.memDuration = memDuration; // Патч "УР.4": механики фазы показа читают отсюда
    // Тот-Кто-Ждёт: у него нет таймера ни на запоминание, ни на варку —
    // игрок сам решает, когда готов, кнопкой "Готово, воссоздаю"
    $('waiterReadyWrap').classList.remove('show');
    if(cfg.special === 'no_timer'){
      $('waiterReadyBtn').onclick = () => {
        $('waiterReadyWrap').classList.remove('show');
        stopMovingAnim();
        startGuessPhase();
      };
      $('waiterReadyWrap').classList.add('show');
      // Патч "УР.4": у Того-Кто-Ждёт своя механика запоминания (метроном+числа)
      // даже без обычного таймера — цепляем через тот же хук memorizeStart
      if(level4Active && level4Active.memorizeStart) level4Active.memorizeStart();
    } else if(mechActive('guild_inspector') || (mechActive('gourmet_vega') && regLevel === 4) || mechActive('engineer')){
      // Инспектор Гильдии (с УР.1) — сразу лист "Допусков" без показа.
      // Гурман на УР.4 (Ф8) — фазы показа тоже нет: цель ищется «дегустацией».
      // Инженер навигатора (Фаза 10, с УР.1) — показа нет: цель показана зонами
      // на треках, задача — вовремя остановить бегущий указатель.
      stopMovingAnim();
      startGuessPhase();
    } else {
      level4StartMemorize(memDuration, ()=>{ stopMovingAnim(); startGuessPhase(); });
    }
  }

  function startGuessPhase(){
    const cfg = target.cfg, flags = target.flags;
    $('fog').classList.add('show');
    setTimeout(()=>{ $('fog').classList.remove('show'); }, 450);
    $('jarSvg').classList.add('brewing');
    currentPhase = 'craft';
    refreshShopDockState(); // Фаза 6: в фазе варки инвентарь снова доступен
    refreshSkillDock();     // Фаза 7: умения вне экрана выбора недоступны
    $('phaseLabel').textContent = LT(UI_TEXT.PHASE_CRAFT);

    S.color.configure({ min:0, max:cfg.colorSteps-1, step:1, value:Math.floor((cfg.colorSteps-1)/2) });
    S.size.configure({ min:0, max:cfg.sizeSteps-1, step:1, value:Math.floor((cfg.sizeSteps-1)/2) });
    S.bsize.configure({ min:0, max:cfg.bsizeSteps-1, step:1, value:Math.floor((cfg.bsizeSteps-1)/2) });
    S.count.configure({ min:1, max:cfg.countMax, step:1, value:Math.ceil(cfg.countMax/2) });

    if(flags.hasGradient){
      $('colorLabelA').textContent = LT(UI_TEXT.LABEL_SPECTRUM_A);
      $('colorGroupB').classList.remove('hidden');
      S.colorB.configure({ min:0, max:cfg.colorSteps-1, step:1, value:Math.floor((cfg.colorSteps-1)/2) });
    } else {
      $('colorLabelA').textContent = LT(UI_TEXT.LABEL_SPECTRUM);
      $('colorGroupB').classList.add('hidden');
    }

    if(flags.hasSat){
      $('satGroup').classList.remove('hidden');
      S.sat.configure({ min:0, max:9, step:1, value:7 });
    } else {
      $('satGroup').classList.add('hidden');
    }

    if(flags.hasShape){
      $('shapeGroup').classList.remove('hidden');
      S.shape.configure({ min:0, max:9, step:1, value:0 });
    } else {
      $('shapeGroup').classList.add('hidden');
    }

    // ---------- Патч (Сверхновая): ширина + высота вместо объёма ----------
    const dual = cfg.special === 'dual_size';
    const sizeLabelEl = $('sizeLabel');
    if(sizeLabelEl){
      // меняем и текст, и data-i18n — так переключение языка (applyI18n)
      // само подхватит правильную подпись
      sizeLabelEl.setAttribute('data-i18n', dual ? 'LABEL_WIDTH' : 'LABEL_VOLUME');
      sizeLabelEl.textContent = LT(dual ? UI_TEXT.LABEL_WIDTH : UI_TEXT.LABEL_VOLUME);
    }
    if(dual){
      $('size2Group').classList.remove('hidden');
      S.size2.configure({ min:0, max:cfg.sizeSteps-1, step:1, value:Math.floor((cfg.sizeSteps-1)/2) });
    } else {
      $('size2Group').classList.add('hidden');
    }

    // ---------- Фаза 10 (Пьяница Пит): уровень жидкости + градус ----------
    if(cfg.id === 'pete'){
      $('fillGroup').classList.remove('hidden');
      S.fill.configure({ min:0, max:cfg.sizeSteps-1, step:1, value:Math.floor((cfg.sizeSteps-1)/2) });
      const l4 = target.regLevel === 4;
      $('degreeGroup').classList.toggle('hidden', !l4);
      // градус стартует с нуля: не хочешь риска — не трогаешь, рейтинг не страдает
      if(l4) S.degree.configure({ min:0, max:10, step:1, value:0 });
    } else {
      $('fillGroup').classList.add('hidden');
      $('degreeGroup').classList.add('hidden');
    }

    // сброс визуальных флагов патча с прошлого раунда
    Object.values(S).forEach(s=>{ if(s.setFlag){ s.setFlag('ir-gift', false); } });
    S.color.setTrackBackground(RAINBOW_BG);
    S.colorB.setTrackBackground(RAINBOW_BG);
    // Фаза 6: снять подсказки/метки предметов прошлого заказа со всех ползунков
    ['color','colorB','size','count','bsize','size2','sat','shape','speed','rotation'].forEach(k=>{
      if(!S[k]) return;
      if(!['color','colorB'].includes(k)) S[k].setTrackBackground(''); // цветным фон уже вернули к радуге выше
      S[k].setFlag('item-paprika', false); S[k].setFlag('item-mark', false); S[k].setFlag('item-jigger', false); S[k].setFlag('item-solved', false);
    });

    Object.values(S).forEach(s=>{ s.setDisabled(false); s.setDiffLocked(false); });
    applyDifficultyGating();

    // ---------- Патч (Ир): эффекты фазы геймплея ----------
    const irFx = target.irEffect;
    if(irFx && irFx.id === 'mono'){
      // выцветший мир (усилено): банка и палитра — чёрно-белые, И края банки
      // сильно размыты — так сложнее оценить на глаз габариты
      $('windowFrame').classList.add('ir-mono');
      const GRAY_BG = 'linear-gradient(to top, hsl(0,0%,18%), hsl(0,0%,88%))';
      S.color.setTrackBackground(GRAY_BG);
      S.colorB.setTrackBackground(GRAY_BG);
    }
    if(irFx && irFx.id === 'gift'){
      // рука Ир (усилено): 2 случайных доступных регулятора выставлены
      // точно в цель, светятся и не двигаются
      const keys = [...(target.activeKeys||[])].filter(k => S[k]);
      const chosen = [];
      const pool = [...keys];
      for(let i=0;i<2 && pool.length;i++){
        const idx = randInt(0, pool.length-1);
        chosen.push(pool.splice(idx,1)[0]);
      }
      chosen.forEach(k=>{
        freezeLockedValue(k);
        S[k].setFlag('ir-gift', true);
      });
      target.irGiftKeys = chosen;
    }

    // Патч (визуальный сброс ползунков): показываем панель регуляторов
    // только ТЕПЕРЬ, когда все .configure() выше уже поставили ползунки
    // на стартовые для этого раунда позиции — игрок больше не видит,
    // как они "прыгают" в дефолт в момент открытия фазы воссоздания.
    $('panel').classList.add('show');
    $('leftCol').classList.add('show');
    $('rightCol').classList.add('show');

    updatePlayerJar();
    updateIngredientCounter(0);

    // Фаза E: на 4-ом уровне сложности время на "воссоздай" немного больше —
    // компенсация за то, что внимание постоянно отвлекается на "плохие" пузыри.
    // Фаза J: пассивка craftTime растягивает (или ужимает, если < 0) базу.
    const pfx = target.passiveFx || {};
    // Правка (пользователь): фиолетовый грейд (тир 5) — на игру +50% времени.
    const purpleCraftMult = cfg.tier === 5 ? 1.5 : 1;
    let craftDuration = Math.round(cfg.craftMs * CRAFT_TIME_SCALE * purpleCraftMult * (1 + (pfx.craftTime || 0)))
      + (target.regLevel === 4 ? (typeof LEVEL4_TIME_BONUS_MS !== 'undefined' ? LEVEL4_TIME_BONUS_MS : 0) : 0);
    // Патч (Ир): подаренные / украденные секунды
    // Патч (усилено): +4с / -2с вместо +2с / -1с
    if(irFx && irFx.id === 'time_plus') craftDuration += 4000;
    if(irFx && irFx.id === 'time_minus') craftDuration = Math.max(1500, craftDuration - 2000);
    // Патч "УР.4" (Тот-Кто-Ждёт): дар "вдвое медленнее" — на СЛЕДУЮЩИЙ заказ
    if(target.waiterSlowBuff) craftDuration *= 2;
    // Фаза 3, модификатор "Таймер": на воссоздание на 25% меньше времени.
    // Применяем к базе (craftBaseDuration тоже), чтобы бонус за скорость мерился
    // относительно уже урезанного окна, а не полного.
    if(target.mods && target.mods.includes('timer')) craftDuration = Math.max(1500, Math.round(craftDuration * 0.75));
    // Фаза 6, "Сломанный секундомер": отложенный бонус времени (применён в фазе выбора)
    if(pendingItemFx.timeBonusMs){ craftDuration += pendingItemFx.timeBonusMs; pendingItemFx.timeBonusMs = 0; }
    target.craftDuration = craftDuration;
    target.craftBaseDuration = craftDuration; // для честного timeFrac, даже когда таймер не тикает

    level4StartCraft(); // Патч "УР.4": может добавить время в target.craftDuration
    craftDuration = target.craftDuration; // подхватываем правку выше, если была

    $('brewBtn').onclick = () => { SFX.brew(); finishCraft(); };

    setRingFraction(0);
    craftStartTime = performance.now();
    // Тот-Кто-Ждёт: без таймера на "воссоздай" — ни дозаполнения счётчика,
    // ни автозавершения; кнопка "Готово!" — единственный выход из фазы
    if(cfg.special !== 'no_timer'){
      let used = 0;
      const totalDots = 20;
      const tickMs = craftDuration/totalDots;
      ingTimerHandle = setInterval(()=>{
        used++;
        updateIngredientCounter(used);
        if(used>=totalDots) clearInterval(ingTimerHandle);
      }, tickMs);
      runTimer(craftDuration, ()=>{ if(!craftLocked) finishCraft(true); }); // Патч: true = таймер истёк сам
    }

    // запускаем "плохие" пузыри у дрона: на УР.4 или с УР.1 (drone ∈ MECH_FROM_L1).
    // у остальных НПС на УР.4 — свои уникальные механики (см. LEVEL4_FX)
    if(droneBombsActive()){
      badBubbleElapsed = 0;
      badBubbles = [];
      currentBadBubbles = [];
      badBubbleLastT = 0;
      scheduleNextBadBubble();
      badBubbleRafId = requestAnimationFrame(badBubbleFrame);
      if(target.regLevel === 4) startDroneCursor(); // Фаза 8: курсор-с-инерцией
    }
  }

  // регулятор, недоступный на текущей сложности, замирает РОВНО на том
  // значении, которое игрок уже видел на фазе показа — а не на новом
  // случайном. Иначе банка визуально "прыгает" (например меняет размер)
  // сразу после исчезновения тумана, и это ложно намекает, что этот
  // параметр тоже нужно подгонять, хотя ползунок недоступен.
  function freezeLockedValue(key){
    const t = target;
    switch(key){
      case 'color':  S.color.value = t.hueIdx; break;
      case 'colorB': S.colorB.value = t.hue2Idx ?? t.hueIdx; break;
      case 'sat':    S.sat.value = t.satIdx ?? 7; break;
      case 'size':   S.size.value = t.sizeIdx; break;
      case 'size2':  S.size2.value = t.size2Idx ?? t.sizeIdx; break; // Патч (Сверхновая)
      case 'count':  S.count.value = t.count; break;
      case 'bsize':  S.bsize.value = t.bsizeIdx; break;
      case 'shape':  S.shape.value = t.shapeIdx ?? 0; break;
    }
  }
  // применяет систему сложности регуляторов (Фаза C) к текущему заказу:
  // считает, какие регуляторы доступны, блокирует остальные визуально
  // (серые + перечёркнутые) и фиксирует их на случайной величине
  function applyDifficultyGating(){
    const flags = target.flags;
    const active = target.activeKeys || computeActiveKeys(target.regLevel, target);
    target.activeKeys = active;

    const relevant = ['color','size','count','bsize'];
    if(target.cfg.special === 'dual_size') relevant.push('size2'); // Патч (Сверхновая)
    if(flags.hasSat) relevant.push('sat');
    if(flags.hasGradient) relevant.push('colorB');
    if(flags.hasShape) relevant.push('shape');

    relevant.forEach(key=>{
      const slider = S[key];
      if(!slider) return;
      const isActive = active.has(key);
      // Фаза 8 (правка пользователя): неактивные на этом уровне регуляторы
      // прячем ПОЛНОСТЬЮ (а не показываем серыми/зачёркнутыми). Значение всё
      // равно фиксируем — оно не участвует в скоринге (см. computeScoreComponents).
      const mount = $('m' + key.charAt(0).toUpperCase() + key.slice(1));
      const group = mount ? mount.closest('.vslider-group') : null;
      if(group) group.classList.toggle('hidden', !isActive);
      slider.setDiffLocked(false);
      if(!isActive) freezeLockedValue(key);
    });
  }

  function updateIngredientCounter(used){
    const total = 20;
    let html = '';
    for(let i=0;i<total;i++) html += `<span class="dot ${i<used?'used':''}"></span>`;
    $('ingCounter').innerHTML = html;
  }

  function updatePlayerJar(){
    if(!target) return;
    const cfg = target.cfg, flags = target.flags;
    const hue = idxToVal(S.color.value, cfg.colorSteps, 360);
    const size = idxToVal(S.size.value, cfg.sizeSteps, 100);
    const bsize = idxToVal(S.bsize.value, cfg.bsizeSteps, 100);
    const count = S.count.value;
    let hue2 = null, sat = 70;
    if(flags.hasGradient){
      hue2 = idxToVal(S.colorB.value, cfg.colorSteps, 360);
      $('lblColorB').textContent = Math.round(hue2) + '°';
    }
    if(flags.hasSat){
      sat = satFromIdx(S.sat.value);
      // Патч (Ир, дебафф "выцветший мир"): дорожка оттенка тоже серая
      const mono = target.irEffect && target.irEffect.id === 'mono' && currentPhase === 'craft';
      S.sat.setTrackBackground(mono
        ? 'linear-gradient(to top, hsl(0,0%,25%), hsl(0,0%,80%))'
        : `linear-gradient(to top, hsl(${hue},0%,45%), hsl(${hue},100%,50%))`);
      $('lblSat').textContent = Math.round(sat) + '%';
    }
    let shapeIdx = 0;
    if(flags.hasShape){
      shapeIdx = S.shape.value;
      $('lblShape').textContent = LT(SHAPE_NAMES[shapeIdx]);
    }
    // Патч "УР.4" (Тот-Кто-Ждёт): банка игрока тоже в форме песочных часов
    if(cfg.id === 'the_waiter' && target.regLevel === 4){
      shapeIdx = target.shapeIdx;
    }
    // Патч (Сверхновая): высота банки живёт на отдельном ползунке
    let heightPct = null;
    if(cfg.special === 'dual_size'){
      heightPct = idxToVal(S.size2.value, cfg.sizeSteps, 100);
      const lbl2 = $('lblSize2');
      if(lbl2) lbl2.textContent = Math.round(heightPct) + '%';
    }
    // Патч "УР.4" (Сверхновая): поворот — свой эксклюзивный ползунок (блик убран)
    let rotationDeg = null;
    if(cfg.id === 'supernova_child' && target.regLevel === 4 && S.rotation){
      rotationDeg = S.rotation.value*10;
      const lblR = $('lblRotation'); if(lblR) lblR.textContent = rotationDeg + '°';
    }
    // Патч "УР.4" (Бармен): скорость тряски — свой эксклюзивный ползунок
    if(cfg.id === 'plasma_bartender' && target.regLevel === 4 && S.speed){
      const lblSp = $('lblSpeed'); if(lblSp) lblSp.textContent = (S.speed.value*10) + '%';
    }
    // Патч "УР.4" (Двуликая жрица): второй, независимый счётчик сгустков
    const isTwofacedSplit = cfg.id === 'twofaced_priestess' && target.regLevel === 4 && S.countB;
    if(isTwofacedSplit){
      const lblCB = $('lblCountB'); if(lblCB) lblCB.textContent = S.countB.value;
    }
    // Фаза 10 (Пьяница Пит): «уровень жидкости» — свой ползунок; «градус» — УР.4
    let fillPct = null;
    if(cfg.id === 'pete'){
      fillPct = idxToVal(S.fill.value, cfg.sizeSteps, 100);
      const lblF = $('lblFill'); if(lblF) lblF.textContent = Math.round(fillPct) + '%';
      if(target.regLevel === 4 && S.degree){
        const lblD = $('lblDegree'); if(lblD) lblD.textContent = (S.degree.value*10) + '°';
      }
    }
    $('lblColor').textContent = Math.round(hue) + '°';
    $('lblSize').textContent = Math.round(size) + '%';
    $('lblCount').textContent = count;
    $('lblBsize').textContent = Math.round(bsize) + '%';
    const r = 3 + (bsize/100)*9;
    // если и число, и размер сгустков недоступны на текущей сложности —
    // игра вообще их не генерирует (нечего показывать/угадывать)
    const noBubbles = target.activeKeys && !target.activeKeys.has('count') && !target.activeKeys.has('bsize');
    const isFlySwarm = mechActive('swarm_navigator');
    const isVexDrag = cfg.id === 'vex';
    // Логик-9 УР.4: во время бонус-раунда сгустки «уходят» из банки наверх — прячем их
    const effCount = (noBubbles || isFlySwarm || isVexDrag || target._l9HideBlobs) ? 0 : count;
    drawJar({ hue, hue2, sat, sizePct:size, heightPct, bubbleCount:effCount, bubbleR:r, shapeIdx,
      rotationDeg, fillPct,
      splitHalves: isTwofacedSplit, bubbleCountB: isTwofacedSplit ? S.countB.value : 0,
      seed: target.seed + 5000 + count*7 + Math.round(r*13), badBubbles: currentBadBubbles,
      showGrid: isVexDrag, customBottle: target.customBottle, capIdx: target.capIdx, decor: target.decor });
  }

  function hueDist(a,b){ const d = Math.abs(a-b)%360; return d>180 ? 360-d : d; }

  // ---------- scoring ----------
  function computeScoreComponents(){
    const cfg = target.cfg, flags = target.flags;
    const guess = {
      hue: idxToVal(S.color.value, cfg.colorSteps, 360),
      size: idxToVal(S.size.value, cfg.sizeSteps, 100),
      bsize: idxToVal(S.bsize.value, cfg.bsizeSteps, 100),
      count: S.count.value
    };
    const sizeScore = curveScore(1 - Math.abs(guess.size - target.size)/100);
    const countScore = curveScore(1 - Math.abs(guess.count - target.count)/cfg.countMax);
    const bsizeScore = curveScore(1 - Math.abs(guess.bsize - target.bsize)/100);

    let components;
    if(flags.hasGradient){
      const hue2 = idxToVal(S.colorB.value, cfg.colorSteps, 360);
      const colorAScore = curveScore(1 - hueDist(guess.hue, target.hue)/180);
      const colorBScore = curveScore(1 - hueDist(hue2, target.hue2)/180);
      components = [
        {key:'color', label:UI_TEXT.LABEL_SPECTRUM_A, score:colorAScore, weight:0.225},
        {key:'colorB', label:UI_TEXT.LABEL_SPECTRUM_B, score:colorBScore, weight:0.225},
        {key:'size', label:UI_TEXT.LABEL_VOLUME, score:sizeScore, weight:0.15},
        {key:'count', label:UI_TEXT.LABEL_COUNT_QTY, score:countScore, weight:0.25},
        {key:'bsize', label:UI_TEXT.LABEL_COUNT_SIZE, score:bsizeScore, weight:0.15}
      ];
    } else if(flags.hasShape){
      const colorScore = curveScore(1 - hueDist(guess.hue, target.hue)/180);
      const satScore = curveScore(1 - Math.abs(satFromIdx(S.sat.value) - target.sat)/70);
      const shapeIdx = S.shape.value;
      const shapeScore = curveScore(shapeIdx === target.shapeIdx ? 1 : Math.max(0, 1 - Math.abs(shapeIdx-target.shapeIdx)/4));
      components = [
        {key:'color', label:UI_TEXT.LABEL_SPECTRUM, score:colorScore, weight:0.15},
        {key:'sat', label:UI_TEXT.LABEL_SATURATION, score:satScore, weight:0.1},
        {key:'shape', label:UI_TEXT.LABEL_SHAPE, score:shapeScore, weight:0.25},
        {key:'size', label:UI_TEXT.LABEL_VOLUME, score:sizeScore, weight:0.15},
        {key:'count', label:UI_TEXT.LABEL_COUNT_QTY, score:countScore, weight:0.2},
        {key:'bsize', label:UI_TEXT.LABEL_COUNT_SIZE, score:bsizeScore, weight:0.15}
      ];
    } else if(flags.hasSat){
      const colorScore = curveScore(1 - hueDist(guess.hue, target.hue)/180);
      const satScore = curveScore(1 - Math.abs(satFromIdx(S.sat.value) - target.sat)/70);
      components = [
        {key:'color', label:UI_TEXT.LABEL_SPECTRUM, score:colorScore, weight:0.3},
        {key:'sat', label:UI_TEXT.LABEL_SATURATION, score:satScore, weight:0.15},
        {key:'size', label:UI_TEXT.LABEL_VOLUME, score:sizeScore, weight:0.15},
        {key:'count', label:UI_TEXT.LABEL_COUNT_QTY, score:countScore, weight:0.2},
        {key:'bsize', label:UI_TEXT.LABEL_COUNT_SIZE, score:bsizeScore, weight:0.2}
      ];
    } else {
      const colorScore = curveScore(1 - hueDist(guess.hue, target.hue)/180);
      components = [
        {key:'color', label:UI_TEXT.LABEL_SPECTRUM, score:colorScore, weight:0.35},
        {key:'size', label:UI_TEXT.LABEL_VOLUME, score:sizeScore, weight:0.2},
        {key:'count', label:UI_TEXT.LABEL_COUNT_QTY, score:countScore, weight:0.25},
        {key:'bsize', label:UI_TEXT.LABEL_COUNT_SIZE, score:bsizeScore, weight:0.2}
      ];
    }

    // Патч "УР.4" (Двуликая жрица): компонент "сгустки" распадается на
    // независимые "А" (левая половина) и "Б" (правая), допуск теперь по
    // семи делениям, а не по обычному cfg.countMax
    if(cfg.id === 'twofaced_priestess' && target.regLevel === 4 && S.countB){
      const ci = components.findIndex(c => c.key === 'count');
      if(ci !== -1){
        const half = components[ci].weight / 2;
        const countAScore = curveScore(1 - Math.abs(S.count.value - target.count)/7);
        const countBScore = curveScore(1 - Math.abs(S.countB.value - (target.countB ?? 0))/7);
        components.splice(ci, 1,
          {key:'count',  label:UI_TEXT.LABEL_COUNT_A, score:countAScore, weight:half},
          {key:'countB', label:UI_TEXT.LABEL_COUNT_B, score:countBScore, weight:half}
        );
      }
    }
    // Патч (Сверхновая): компонент "объём" распадается на "ширину" и
    // "высоту" — каждая по половине исходного веса
    if(cfg.special === 'dual_size'){
      const si = components.findIndex(c => c.key === 'size');
      if(si !== -1){
        const half = components[si].weight / 2;
        const height = idxToVal(S.size2.value, cfg.sizeSteps, 100);
        const size2Score = curveScore(1 - Math.abs(height - (target.size2 ?? target.size))/100);
        components.splice(si, 1,
          {key:'size',  label:UI_TEXT.LABEL_WIDTH,  score:sizeScore,  weight:half},
          {key:'size2', label:UI_TEXT.LABEL_HEIGHT, score:size2Score, weight:half}
        );
      }
    }
    // Патч "УР.4" (Сверхновая): доп. эксклюзивный компонент — поворот (блик убран)
    if(cfg.id === 'supernova_child' && target.regLevel === 4 && S.rotation){
      const rotScore = curveScore(1 - hueDist(S.rotation.value*10, target.rotation ?? 0)/180);
      components.push(
        {key:'rotation', label:UI_TEXT.LABEL_ROTATION, score:rotScore, weight:0.15}
      );
    }
    // Патч "УР.4" (Бармен): доп. эксклюзивный компонент — скорость тряски
    if(cfg.id === 'plasma_bartender' && target.regLevel === 4 && S.speed){
      const speedScore = curveScore(1 - Math.abs(S.speed.value*10 - (target.speed ?? 0))/100);
      components.push(
        {key:'speed', label:UI_TEXT.LABEL_SPEED, score:speedScore, weight:0.15}
      );
    }
    // Патч "УР.4" (Векс): доп. компонент — насколько точно сгустки вернули
    // на места (вес заметно выше остальных характеристик), допуск разлёта
    // подобран так, чтобы 100% было реально достижимо руками
    if(cfg.id === 'vex' && target.vexPositions && target.vexFinalPositions && target.vexFinalPositions.length){
      const perBlob = target.vexFinalPositions.map((item,i)=>{
        const tgt = target.vexPositions[i];
        if(!tgt) return 1;
        const d = Math.hypot(item.x-tgt.x, item.y-tgt.y);
        return Math.max(0, 1 - Math.max(0, d-6)/19);
      });
      const posScore = perBlob.length ? perBlob.reduce((a,b)=>a+b,0)/perBlob.length : 1;
      components.push(
        {key:'vexPosition', label:UI_TEXT.LABEL_VEX_POSITION, score:posScore, weight:0.4}
      );
    }

    // Фаза 10 (Пьяница Пит): «уровень жидкости» — полноценный оцениваемый
    // параметр (наравне с цветом/объёмом). Вес нормализуется ниже вместе с
    // остальными по activeKeys.
    if(cfg.id === 'pete' && S.fill){
      const guessFill = idxToVal(S.fill.value, cfg.sizeSteps, 100);
      const fillScore = curveScore(1 - Math.abs(guessFill - (target.fill ?? 0))/100);
      components.push({ key:'fill', label:UI_TEXT.LABEL_FILL, score:fillScore, weight:0.2 });
    }

    // Фаза 10 (Инженер навигатора): оценка не по «похожести», а по зоне, в
    // которой игрок остановил бегущий указатель (тёмно-зелёная/синяя=100%,
    // зелёная=75%, красная УР.4=0%, мимо=распад). Переопределяем score каждого
    // основного компонента; веса/нормализация — общие ниже.
    if(cfg.id === 'engineer'){
      components.forEach(c=>{
        if(!engScorableKey(c.key)) return;
        const cf = engCenterFrac(c.key);
        let sf;
        if(target.engStopped && target.engStopped[c.key] != null) sf = target.engStopped[c.key];
        else if(engState && engState.pointers[c.key]) sf = engState.pointers[c.key].frac; // не нажал «стоп» — где указатель сейчас
        else { const s = S[c.key]; sf = s ? (s.value - s.min)/((s.max - s.min)||1) : 0.5; }
        c.score = engZoneScore(Math.abs(sf - cf), target.regLevel);
      });
    }

    // сложность регуляторов (Фаза C): недоступные игроку регуляторы не
    // участвуют в подсчёте очков — веса оставшихся нормализуются к 1
    if(target.activeKeys){
      components = components.filter(c => target.activeKeys.has(c.key));
      const totalGate = components.reduce((s,c)=>s+c.weight,0) || 1;
      components.forEach(c=>{ c.weight /= totalGate; });
    }
    // Фаза 6, "Потрёпанный джиггер": отключённый регулятор не участвует в
    // подсчёте — веса оставшихся нормализуются заново
    if(target.itemFx && target.itemFx.jiggerKey){
      // грейд 3 отключает 2 регулятора — jiggerKey может быть массивом
      const jkArr = Array.isArray(target.itemFx.jiggerKey) ? target.itemFx.jiggerKey : [target.itemFx.jiggerKey];
      const before = components.length;
      components = components.filter(c => !jkArr.includes(c.key) && !(c.key === 'size2' && jkArr.includes('size')));
      if(components.length && components.length < before){
        const t = components.reduce((s,c)=>s+c.weight,0) || 1;
        components.forEach(c=>{ c.weight /= t; });
      }
    }
    // Тентаклоид (Фаза 8: механика на всех уровнях): считает ТОЛЬКО скрытый(е)
    // параметр(ы) — остальные полностью игнорируются. УР.1-3 — один параметр;
    // УР.4 — ДВА, и берётся МЕНЬШИЙ из их score (вес целиком на худший из двух).
    if(cfg.id === 'tentacloid' && target.tentacloidKey){
      const hiddenKeys = [target.tentacloidKey];
      if(target.tentacloidKey2) hiddenKeys.push(target.tentacloidKey2);
      const relevant = components.filter(c => hiddenKeys.includes(c.key));
      if(relevant.length){
        const worst = relevant.reduce((a,b)=> b.score < a.score ? b : a);
        components.forEach(c=>{ c.weight = (c === worst) ? 1 : 0; });
        worst.decisive = true; // подсветка в разбивке — "вот что решило"
      }
    }

    // focus modifier: focused stats weigh much more, the rest much less
    if(target.focus){
      const fkeys = FOCUS_KEYS[target.focus];
      components.forEach(c=>{
        // Патч (Сверхновая): 'size2' считается фокусным вместе с 'size'
        c.focused = fkeys.includes(c.key) || (c.key === 'size2' && fkeys.includes('size'));
        c.weight *= c.focused ? 2.2 : 0.55;
      });
      const total = components.reduce((s,c)=>s+c.weight,0);
      components.forEach(c=>{ c.weight /= total; });
    }

    const overall = components.reduce((s,c)=>s+c.score*c.weight, 0);
    return { cfg, flags, components, overall };
  }

  function finishCraft(auto){
    // Патч "УР.4" (Дегустатор): первая "какашка" не завершает раунд — можно
    // доделать зелье с того же места, тем же таймером (он просто продолжает
    // тикать). Раунд по-настоящему заканчивается только на 2-й сдаче,
    // или если 1-я сдача сразу good/perfect.
    // Фаза 8 (Гурман УР.4): «дегустация-близость» — до 2 проб, точные ползунки
    // фиксируются; после проб (или когда всё зафиксировано) кнопка «Подать»
    // финализирует. Заменяет базовую одну-переигровку (та — только УР.1-3).
    if(mechActive('gourmet_vega') && target.regLevel === 4){
      if(!target.l4GourmetLocked) target.l4GourmetLocked = new Set();
      target.l4TasteCount = target.l4TasteCount || 0;
      if(target.l4TasteCount < 2 && !l4GourmetAllLocked()){
        target.l4TasteCount++;
        l4GourmetTaste();
        const done = target.l4TasteCount >= 2 || l4GourmetAllLocked();
        const btn = $('brewBtn'); if(btn) btn.textContent = LT(done ? UI_TEXT.TASTE_SERVE_BTN : UI_TEXT.TASTE_BTN);
        return; // это проба, не финализация
      }
    }
    // База (УР.1-3): первая «какашка» не завершает раунд — одна переигровка тем же таймером.
    else if(mechActive('gourmet_vega') && !target.l4TasteFirstBad){
      const peek = computeScoreComponents();
      const peekGoodThreshold = peek.cfg.tier >= 5 ? 0.85 : 0.8;
      if(peek.overall < peekGoodThreshold){
        target.l4TasteFirstBad = true;
        l4TasteShowRetryNote();
        return;
      }
    }
    craftLocked = true;
    cancelAnimationFrame(rafId);
    // Патч (визуальный сброс ползунков #2): прячем колонки регуляторов ДО
    // level4Stop() — иначе все ~450мс перед result-overlay (пока крутится
    // "celebrate"-анимация банки) игрок видел, как уникальная механика УР.4
    // (степпер/шестерёнки/разделённая банка и т.п.) сбрасывается на обычные
    // ползунки прямо на виду — #panel.locked тут не помогает, он дималит
    // только счётчик ингредиентов и кнопку "Готово!", а не leftCol/rightCol.
    $('leftCol').classList.remove('show');
    $('rightCol').classList.remove('show');
    stopMovingAnim();
    stopBadBubbles();
    stopMatrixRain(); // Патч (Хранитель): дождь символов гаснет с таймером
    level4Stop();      // Патч "УР.4": интервалы/DOM конкретной механики
    clearInterval(ingTimerHandle);
    $('windowFrame').classList.remove('urgent');
    $('windowFrame').classList.remove('ir-mono'); // Патч (Ир): мир снова цветной
    $('jarSvg').classList.remove('brewing');
    $('brewBtn').disabled = true;
    $('panel').classList.add('locked');
    Object.values(S).forEach(s=>s.setDisabled(true));
    target.autoFinish = !!auto; // Патч (стикеры): таймер истёк сам

    applyEyeNudge(); // Фаза 6 (Барменский глаз): подвинуть ползунки к цели ДО подсчёта

    const scoreData = computeScoreComponents();
    const elapsed = performance.now() - craftStartTime;
    // Патч (Тот-Кто-Ждёт): timeFrac считаем от БАЗОВОЙ длительности —
    // докупленные секунды не должны раздувать бонус за скорость
    const craftDuration = target.craftBaseDuration || target.craftDuration || scoreData.cfg.craftMs;
    const timeFrac = Math.min(1, elapsed/craftDuration);
    // Логик-9 УР.4: после ≥годноты — бонус-раунд «сбей сгустки». Результат
    // (finalizeResult) откладывается до конца мини-игры; множитель рейтинга
    // (доля сбитых × 50%) применяется в finalizeResult.
    if(target.cfg.id === 'logic9' && target.regLevel === 4 && !target.logic9BonusDone){
      const gt = scoreData.cfg.tier >= 5 ? 0.85 : 0.8;
      if(scoreData.overall >= gt){
        target._pendingScore = { scoreData, timeFrac };
        l4Logic9StartShooter();
        return;
      }
    }
    finalizeResult(scoreData, timeFrac);
  }

  function finalizeResult(scoreData, timeFrac){
    let { cfg, overall, components } = scoreData;
    // Фаза 8 (8C): у Бипа механики больше нет — он самый базовый обучающий
    // персонаж, рейтинг считается как у обычного заказа.
    // Патч "УР.4" (Инспектор Гильдии): реальная цель — числа из листа
    // "Допуски" (нет больше показанного образца, который надо избегать —
    // фазы показа для него нет вообще). Результат = доля параметров,
    // попавших в допуск ±N.
    if(mechActive('guild_inspector') && target.inspectorTarget){
      const keys = inspectorActiveKeys();
      const tol = target.inspectorTolerance || 2;
      let missed = 0;
      keys.forEach(k=>{
        const val = S[k].value;
        if(Math.abs(val - target.inspectorTarget[k]) > tol) missed++;
      });
      overall = missed === 0 ? 1 : Math.max(0.80, 0.94 - missed*0.03);
    }
    // Коллекционер (Фаза 8: механика на всех уровнях): бинарный результат —
    // попал в правильную баночку из сетки (идеал) или нет, никаких полутонов
    if(cfg.id === 'collector_gz'){
      overall = target.collectorChoiceCorrect ? 1 : 0;
    }
    const overallPct = Math.round(overall*100);
    const goodThreshold = cfg.tier >= 5 ? 0.85 : 0.8;
    const perfectThreshold = cfg.tier >= 5 ? 0.97 : 0.95;
    // Фаза 2 (П7): «Пойло» — грейд между браком и годнотой. Настоящий брак
    // теперь только НИЖЕ swillThreshold; всё, что дотянуло до полосы пойла, но
    // не до годноты — пойло (малый ±рейтинг). Идеал/годнота не тронуты.
    const swillThreshold = cfg.tier >= 5 ? 0.62 : 0.55;
    const good = overall >= goodThreshold;
    const perfect = overall >= perfectThreshold;
    const swill = !good && overall >= swillThreshold;

    // ---------- Патч: контекст для особых стикеров + снимок для переигровок ----------
    // серии читаем из профиля ДО recordOrderResult (он их обновит ниже)
    const pData0 = window.PotionProfile ? window.PotionProfile.data : null;
    const st0 = (pData0 && pData0.streaks) || {};
    const perfectRunNow = perfect ? ((st0.perfectCurrent||0) + 1) : 0;
    const goodRunNow   = good ? ((st0.goodPlusCurrent||0) + 1) : 0;
    const badRunBefore = st0.badCurrent || 0;
    // снимок состояния цикла — если Ир заставит/позволит переиграть заказ,
    // всё это откатывается ровно к моменту "до результата"
    preResultSnapshot = {
      score, streak, stage, perfectStreakAtMax, goodStreakAtMax,
      stickerCounts: { ...stickerCounts },
      archSeal: archSeal ? { ...archSeal, perfectNpcs: [...(archSeal.perfectNpcs||[])] } : null
    };

    // бонус за скорость: потолок зависит от выбранного уровня сложности
    // регуляторов (см. SPEED_BONUS_MULT в content.js) — полный потолок при
    // укладывании в первую треть таймера и 100% точности, дальше падает
    // и по времени, и по точности
    const third = 1/3;
    let timeFactor = timeFrac <= third ? 1 : Math.max(0, 1 - (timeFrac - third)/(1 - third));
    // Фаза 6 ("Ускоритель варки"): гарантирует минимальную долю бонуса за скорость
    if(target.itemFx && target.itemFx.speedLock) timeFactor = Math.max(timeFactor, target.itemFx.speedLock);
    // Фаза J: пассивка speedCap поднимает потолок бонуса за скорость
    const pfx = target.passiveFx || {};
    const speedCap = ((typeof SPEED_BONUS_MULT !== 'undefined' && SPEED_BONUS_MULT[target.regLevel]) ?? 0.5) + (pfx.speedCap || 0);
    const speedBonusFrac = speedCap * overall * timeFactor;

    // focus raises the stakes both ways; the regulator-difficulty level chosen
    // for this order (Фаза D — выбор на плашках) scales the reward as well.
    // Фаза J: пассивка score умножает итоговую награду.
    const regMult = (typeof REG_DIFF_REWARD_MULT !== 'undefined' && REG_DIFF_REWARD_MULT[target.regLevel]) || 1;
    const effReward = Math.round(cfg.reward * regMult * (target.focus ? 1.25 : 1) * (1 + (pfx.score || 0)));

    let delta, speedBonusPct = 0;
    if(good){
      const base = Math.round(effReward*overall);
      delta = Math.round(base*(1+speedBonusFrac));
      speedBonusPct = Math.round(speedBonusFrac*100);
      streak++;
    } else if(swill){
      // Пойло: малый ±рейтинг. Ближе к годноте (верх полосы) — небольшой плюс,
      // ближе к браку (низ) — небольшой минус. Без бонуса за скорость, серия
      // сбрасывается (это не победа).
      const band = Math.max(0.0001, goodThreshold - swillThreshold);
      const f = Math.min(1, Math.max(0, (overall - swillThreshold) / band)); // 0..1
      delta = Math.round(effReward * (f - 0.5) * 0.30);
      streak = 0;
    } else {
      delta = -Math.round(effReward*(1-overall));
      streak = 0;
    }
    // Патч "УР.4": некоторые механики дают доп. рейтинг/репутацию/меняют
    // порог засчитывания (аптекарь, Тот-Кто-Ждёт, коллекционер, бармен...)
    const l4Bonus = level4ScoreBonus(scoreData, timeFrac) || {};
    if(l4Bonus.ratingMultAdd && good) delta = Math.round(delta * (1 + l4Bonus.ratingMultAdd));
    // Патч (Тот-Кто-Ждёт): у него рейтинг дают только за точность выше 99%
    // (или 95%, если поймал ритм метронома на УР.4) — во всех остальных
    // случаях очки за заказ не начисляются и не отнимаются (стикер и стадия
    // прогресса при этом идут своим обычным чередом)
    if(cfg.special === 'no_timer' && overall < (l4Bonus.waiterThresholdOverride ?? 0.99)) delta = 0;
    // Патч (Хранитель): печать переписывает арифметику — брак не отнимает
    // очки (просто ноль), годнота и идеал приносят больше рейтинга и
    // дополнительную репутацию этого НПС
    if(target.sealed){
      if(!good) delta = 0;
      else if(perfect) delta = Math.round(delta * 1.3);
      else delta = Math.round(delta * 1.15);
      if(good && window.PotionProfile){
        window.PotionProfile.adjustReputation(cfg.id, perfect ? 4 : 2);
      }
    }
    // Патч (Шеф туманности): усиленный разброс — идеал платит заметно больше,
    // брак забирает заметно больше, а "годнота" не даёт вообще ничего (для
    // него посредственность хуже честного провала — только реплика на экране)
    if(cfg.id === 'nebula_chef'){
      if(perfect) delta = Math.round(delta * 1.6);
      else if(good) delta = 0;
      else delta = Math.round(delta * 1.5);
    }
    // Патч "УР.4" (Дегустатор): 1-я сдача (сразу good/perfect, без "какашки"
    // до этого) — идеал x2, годнота x0.5. 2-я сдача (после "какашки" на
    // 1-й) — идеал стандартный, годнота ноль, повторная какашка x2 штрафа.
    if(mechActive('gourmet_vega')){
      if(target.l4TasteFirstBad){
        if(good && !perfect) delta = 0;
        else if(!good) delta = Math.round(delta * 2);
      } else {
        if(perfect) delta = Math.round(delta * 2);
        else if(good) delta = Math.round(delta * 0.5);
      }
    }
    // Патч "УР.4" (Инспектор Гильдии): бонус за скорость не учитывается —
    // если рейтинг вообще положен (good), всегда фиксированные +50%.
    if(mechActive('guild_inspector') && good){
      delta = Math.round(effReward * overall * 1.5);
    }
    // Патч "УР.4" (Стажёр Бип): бафф "+33% рейтинга" за визит без истории —
    // действует на этот (любой) заказ, если ещё не исчерпан, ДО того как
    // сам Бип, возможно, выдаст новый бафф за СВОЙ заказ без истории
    // Патч "Ежедневный заказ": репутации тут нет вовсе — бонус к рейтингу
    // (ratingMultAdd/waiterThresholdOverride выше) остаётся, а repBonus молча игнорируется
    if(!isDailyMode && l4Bonus.repBonus && good && window.PotionProfile) window.PotionProfile.adjustReputation(cfg.id, l4Bonus.repBonus);
    // Фаза 3, поведенческие модификаторы — итоговые множители рейтинга:
    //  • "Важная утка": усиливает и плюс (good/идеал), и минус (брак). Пойло — нейтрально.
    //  • "Погром": ×2 рейтинга (и, как следствие, чаевых — они 5% от рейтинга цикла).
    //    Штраф за брак не удваиваем — расплата за Погром это уход из цикла + удар
    //    по репутации других гостей дня (см. обработчик nextBtn).
    const mods = target.mods || [];
    if(mods.includes('duck')){
      if(good) delta = Math.round(delta * 1.6);
      else if(!swill) delta = Math.round(delta * 1.6); // усиленный штраф за брак
    }
    if(mods.includes('rampage') && delta > 0) delta = delta * 2;
    // Фаза 6: предметы, влияющие на итоговый рейтинг заказа.
    if(target.itemFx){
      const fx = target.itemFx;
      // "Утяжелённый шейкер": +% рейтинга за годноту/идеал
      if(fx.rewardMult && good) delta = Math.round(delta * (1 + fx.rewardMult));
      // "Звёздная соль": фиксированная прибавка за годноту
      if(fx.flatBonus && good) delta += fx.flatBonus;
      // "Фишка неудачника": ±случайная доля в диапазоне грейда (напр. −5%…+5%)
      if(fx.chip){
        const f = fx.chip.lo + Math.random() * (fx.chip.hi - fx.chip.lo);
        delta = Math.round(delta * (1 + f));
      }
      // "Страховочный трос": смягчает потерю рейтинга при браке (cut — доля,
      // на которую урезается штраф; 1.0 — потерь нет вовсе)
      if(fx.shieldCut && delta < 0) delta = Math.round(delta * (1 - fx.shieldCut));
    }
    // Логик-9 УР.4: бонус-раунд «сбей сгустки» — множитель к рейтингу за годноту
    // (доля сбитых × 50%: всё сбил +50%, половина +25%, всё мимо +0%)
    if(target.logic9RatingMult && good) delta = Math.round(delta * (1 + target.logic9RatingMult));
    // Фаза 10 (Пьяница Пит, УР.4): «градус» — риск/награда. Чем выше градус,
    // тем меньше рейтинга (даже за идеал), но тем больше чаевых в конце цикла:
    // на максимальном градусе доля чаевых с этого зелья ×1.5 (peteDegreeTipBonus
    // добавляется к 5%-чаевым в showWeekOverlay). Штраф — только с положительной
    // дельты (брак градус не усугубляет).
    if(cfg.id === 'pete' && target.regLevel === 4 && S.degree && S.degree.value > 0 && delta > 0){
      const g = S.degree.value / S.degree.max; // 0..1
      const rawPos = delta;
      delta = Math.round(delta * (1 - 0.5*g)); // макс. градус — половина рейтинга
      peteDegreeTipBonus += rawPos * 0.05 * g; // компенсация чаевыми (до +50% доли)
    }
    score = Math.max(0, score + delta);
    $('scoreVal').textContent = score;
    $('streakVal').textContent = streak;

    if(perfect) stickerCounts.perfect++; else if(good) stickerCounts.good++; else if(swill) stickerCounts.swill++; else stickerCounts.bad++;
    updateStickerTally();

    // Фаза 7: начисление зарядов умений (аркада; в дейлике умений нет).
    //  • каждые 3 идеала за цикл → +1 заряд;
    //  • сразу: Тот-Кто-Ждёт при 99%+ и Последний из Ир при 95%+.
    if(!isDailyMode && window.PotionProfile){
      // Фаза 11: пассивка-уникалка «chargeAt2» снижает порог с 3 идеалов до 2
      if(perfect && window.PotionProfile.bumpPerfectCharge(passiveHasFlag('chargeAt2') ? 2 : 3)){
        showToast({ icon:'✨', prefix:UI_TEXT.SKILL_CHARGE_GAINED, name:'' });
      }
      if((cfg.id === 'the_waiter' && overall >= 0.99) || (cfg.id === 'last_of_ir' && overall >= 0.95)){
        window.PotionProfile.addCharge(1);
        showToast({ icon:'✨', prefix:UI_TEXT.SKILL_CHARGE_GAINED, name:'' });
      }
      // Фаза 10 (Бабушка Мурра, УР.4): за идеал дарит «клубок ниток» в инвентарь
      // (предмет grantOnly — в магазине не купить; ставит один регулятор точно)
      if(perfect && cfg.id === 'catlady' && target.regLevel === 4 && window.PotionProfile.addItem){
        window.PotionProfile.addItem('yarn', 0, 1);
        showToast({ icon:'🧶', prefix:UI_TEXT.CATLADY_YARN_TOAST, name:'' });
      }
    }

    if(swill){
      // Пойло не двигает стадию (ни вверх, ни вниз), но обрывает серии на максимуме
      perfectStreakAtMax = 0; goodStreakAtMax = 0;
    } else if(!good){
      stage = Math.max(0, stage-1);
      perfectStreakAtMax = 0; goodStreakAtMax = 0;
    } else if(stage < MAX_STAGE){
      stage = Math.min(MAX_STAGE, stage+1);
      perfectStreakAtMax = 0; goodStreakAtMax = 0;
    } else {
      if(perfect){ perfectStreakAtMax++; goodStreakAtMax = 0; }
      else { goodStreakAtMax++; perfectStreakAtMax = 0; }
    }

    // Патч "Взаимоотношения": обиженный на игрока НПС форсирует стикер-какашку
    // (экран результата + альбом коллекции показывают именно его) и добавочно
    // подъедает репутацию (см. ниже) — очки/streak/стадия и ачивки этого НПС
    // считаются по НАСТОЯЩЕМУ результату и не трогаются, спойлится только вид
    // Патч "Ежедневный заказ": ни друзей, ни врагов, ни обид тут нет.
    // Патч "Разгрузка": и в аркаде — пока связи этого НПС не разблокированы репутацией
    const offendedSt = (!isDailyMode && relationUnlockedFor(cfg.id)) ? relationState(cfg.id) : null;
    const forcedBad = !!(offendedSt && offendedSt.offended);
    const effGood = forcedBad ? false : good;
    const effPerfect = forcedBad ? false : perfect;
    const effSwill = forcedBad ? false : swill; // обиженный НПС форсит именно брак

    // Фаза G: фиксируем КОНКРЕТНЫЙ вариант стикера один раз здесь (а не
    // внутри visualHTML), чтобы одно и то же значение ушло и на экран
    // результата, и в profile.stats.stickersSeen для альбома в Коллекции.
    // Патч: особые стикеры выпадают ТОЛЬКО по своим условиям (см.
    // STICKER_SPECIALS в content.js); обычные — случайно из "базовых".
    const stickerCat = effPerfect ? 'perfect' : effGood ? 'good' : effSwill ? 'swill' : 'bad';
    const stickerArr = STICKERS[stickerCat];
    let stickerIdx = 0;
    if(forcedBad){
      const poopIdx = stickerArr.indexOf('💩');
      stickerIdx = poopIdx >= 0 ? poopIdx : 0;
    } else if(Array.isArray(stickerArr)){
      // Патч "Ежедневный заказ": особые стикеры читают серии/рейтинг из
      // аркадного профиля — в дневном режиме их не считаем, только "базовые" 3
      const specials = (!isDailyMode && typeof STICKER_SPECIALS !== 'undefined' && STICKER_SPECIALS[stickerCat]) || [];
      const dualNow = cfg.special === 'dual_size';
      const novaExact = dualNow && components
        .filter(c => c.key === 'size' || c.key === 'size2')
        .every(c => c.score >= 0.999) && components.some(c => c.key === 'size2');
      const stickCtx = {
        perfect, good, swill, overall, components, target, timeFrac,
        autoFinish: !!target.autoFinish,
        scoreAfter: score, dayNum,
        perfectRun: perfectRunNow, goodRun: goodRunNow, badRunBefore,
        perfectThreshold, goodThreshold, novaExact,
        tipsLifetime: window.PotionProfile ? window.PotionProfile.getTipsLifetime() : 0 // Фаза 5
      };
      const eligible = specials.filter(sp => { try { return !!sp.check(stickCtx); } catch(e){ return false; } });
      if(eligible.length){
        const seen = (pData0 && pData0.stats && pData0.stats.stickersSeen && pData0.stats.stickersSeen[stickerCat]) || [];
        const unseen = eligible.filter(sp => !seen.includes(sp.idx));
        stickerIdx = (unseen.length ? pick(unseen) : pick(eligible)).idx;
      } else {
        const specialIdx = new Set(specials.map(sp => sp.idx));
        const commons = stickerArr.map((_,i)=>i).filter(i => !specialIdx.has(i));
        stickerIdx = commons.length ? pick(commons) : randInt(0, stickerArr.length-1);
      }
    }
    const stickerVal = Array.isArray(stickerArr) ? stickerArr[stickerIdx] : stickerArr;

    // Фаза G (доп.): вес этого зелья для "коллекционного" прогресса — см.
    // подробный комментарий у PROGRESS_DIFF_WEIGHT в content.js. Считаем
    // всегда (даже для бракованных — profile.js всё равно использует его
    // только при perfect), чтобы формула жила в одном месте.
    const tierWeight = (typeof BASELINE_TIER_REWARD !== 'undefined' && BASELINE_TIER_REWARD)
      ? cfg.reward / BASELINE_TIER_REWARD : 1;
    const diffWeight = (typeof PROGRESS_DIFF_WEIGHT !== 'undefined' && PROGRESS_DIFF_WEIGHT[target.regLevel]) || 1;
    // Фаза J: пассивка progress умножает вес прогресса
    const progressWeight = tierWeight * diffWeight * (1 + (pfx.progress || 0));

    // Фаза F/G/I/J: тихо копим статистику/стрики/ленту идеалов/репутацию/
    // альбом/статы по НПС в профиль игрока. recordOrderResult возвращает
    // репутацию до/после — по ней ловим повышение уровня.
    // Патч "Ежедневный заказ": весь этот блок — накопительный аркадный
    // профиль (репутация/стрики/статистика по НПС/ачивки) — в дневном
    // режиме ничего из этого не пишем и не проверяем вовсе.
    if(!isDailyMode && window.PotionProfile){
      const repRes = window.PotionProfile.recordOrderResult({
        npcId: cfg.id, perfect, good, swill, delta, stickerCat, stickerIdx, progressWeight,
        regLevel: target.regLevel, focus: target.focus,
        fastThird: timeFrac <= 1/3,
        repMult: 1 + (pfx.rep || 0)
      });
      if(repRes) maybeRepLevelUp(cfg.id, repRes.repBefore, repRes.repAfter);
      // Патч "Взаимоотношения": обиженный НПС не ценит даже настоящий успех —
      // репутация всё равно немного проседает, поверх обычного расчёта выше
      if(forcedBad) window.PotionProfile.adjustReputation(cfg.id, -2);
      // Фаза 6 (Космическая паприка / repboost): усиливает репутационный итог —
      // за годноту+ добавляет репутацию, за брак — дополнительно отнимает
      // (пойло нейтрально). Поверх обычного расчёта recordOrderResult.
      if(target.itemFx && target.itemFx.repBoost){
        const rb = target.itemFx.repBoost;
        if(good){
          const before = (window.PotionProfile.data.npcReputation[cfg.id] || {}).value || 0;
          const r = window.PotionProfile.adjustReputation(cfg.id, rb);
          maybeRepLevelUp(cfg.id, before, r ? r.value : before);
        } else if(!swill){
          window.PotionProfile.adjustReputation(cfg.id, -rb);
        }
      }
    }
    // Фаза J: с первого выполненного заказа состав пассивок заморожен до нового цикла
    cycleStarted = true;

    if(!isDailyMode){
      // Фаза H: общие ачивки — автопроверка после каждого заказа + "ручная"
      // ачивка за молниеносный идеал на максимальной сложности регуляторов
      // тира 5 (первая треть таймера, timeFrac уже посчитан выше по стеку)
      checkGeneralAchievements();
      if(perfect && cfg.tier >= 5 && target.regLevel >= 3 && timeFrac <= 1/3){
        unlockManualAchievement('speedrun', 1);
      }
      // Фаза I: ачивки этого НПС (градации, лорные фразы, награда за комплект)
      checkNpcAchievements(cfg.id);
    }

    // ============================================================
    // Патч "Уникальные механики тир-5": развязка заказа
    // ============================================================
    let npcNoteText = '';   // реплика НПС на экране результата
    let replayMode = null;  // null | 'optional' (дар Ир) | 'forced' (испытание Ир)

    // ---------- Ир: выдача баффа/дебаффа (только его заказ, УР.3+) ----------
    // (реплики/баф-дебаф — часть его личности, остаются и в дневном режиме;
    // bumpNpcStat/checkNpcAchievements — накопительная бухгалтерия, только аркада)
    if(cfg.id === 'last_of_ir' && target.regLevel >= 3){
      if(perfect){
        irPending = { kind:'buff' };
        npcNoteText = LT(pickLocalized(IR_GRANT_PHRASES.buff));
        if(!isDailyMode){
          if(window.PotionProfile) window.PotionProfile.bumpNpcStat('last_of_ir', 'irBuffs', 1);
          checkNpcAchievements('last_of_ir');
        }
      } else if(!good){
        irPending = { kind:'debuff' };
        npcNoteText = LT(pickLocalized(IR_GRANT_PHRASES.debuff));
      } else {
        // годнота: "ты не очень-то старался" — только рейтинг, ничего больше
        npcNoteText = LT(pickLocalized(IR_GOOD_PHRASES));
      }
    }

    // ---------- Ир: срабатывание эффекта на ЭТОМ заказе ----------
    const irFx = target.irEffect;
    if(irFx){
      if(!isDailyMode && irFx.kind === 'debuff' && perfect && window.PotionProfile){
        // идеал под тенью Ир — отдельная ачивка
        window.PotionProfile.bumpNpcStat('last_of_ir', 'irDebuffPerfects', 1);
        checkNpcAchievements('last_of_ir');
      }
      if(irFx.id === 'replay' && !perfect) irReplayActive = true;
      if(irFx.id === 'force_replay' && perfect){
        replayMode = 'forced';
        // Патч (усилено): переигровка идеала обязательно тащит ещё один
        // дебафф — блюр/ч-б или укороченный таймер, выбирается случайно
        irForceReplayExtra = Math.random() < 0.5 ? 'mono' : 'time_minus';
      }
      // эффект одноразовый: после этого заказа иконка исчезает
      target.irEffectConsumed = true;
    }
    // Патч (усиленный "Второй рассвет"): переигровка держится, пока результат
    // не идеален — не только в момент выдачи баффа, а на КАЖДОЙ последующей
    // попытке, пока игрок сам не согласится принять результат
    if(irReplayActive && !perfect) replayMode = 'optional';

    // ---------- Тот-Кто-Ждёт: рейтинг только за >99% — иначе его ирония ----------
    // (ирония/реплики — его личность, остаются; статистика — только аркада)
    if(cfg.special === 'no_timer'){
      if(overall >= 0.99){
        if(!isDailyMode && window.PotionProfile) window.PotionProfile.bumpNpcStat('the_waiter', 'waiterRatedPerfects', 1);
      } else {
        if(!isDailyMode && window.PotionProfile) window.PotionProfile.bumpNpcStat('the_waiter', 'waiterNearMisses', 1);
        npcNoteText = good
          ? LT(pickLocalized(WAITER_NOTE_CLOSE))
          : LT(pickLocalized(WAITER_NOTE_FAR));
      }
      if(!isDailyMode) checkNpcAchievements('the_waiter');
      // Патч "УР.4": строго 100% (не просто >99%) дарит бафф на СЛЕДУЮЩИЙ
      // заказ (у любого НПС) — таймер вдвое медленнее, см. WAITER_SLOW_BUFF
      if(target.regLevel === 4 && overall >= 0.999) waiterSlowPending = true;
    }

    // ---------- Шеф туманности: годнота не платит ничего — только реплика ----------
    if(cfg.id === 'nebula_chef' && good && !perfect){
      npcNoteText = LT(pickLocalized(NEBULA_CHEF_MEH_PHRASES));
    }

    // ---------- Тентаклоид: раскрывает на результатах, какой параметр
    // на самом деле решал (см. LEVEL4_FX.tentacloid — components[].decisive) ----------
    if(cfg.id === 'tentacloid'){
      const decisiveComp = components.find(c => c.decisive);
      if(decisiveComp){
        npcNoteText = LT(pickLocalized(TENTACLOID_REVEAL_PHRASES)).replace('{PARAM}', LT(decisiveComp.label));
      }
    }

    // ---------- Дегустатор: реплика на каждый из 4 исходов дегустации ----------
    if(mechActive('gourmet_vega')){
      if(target.l4TasteFirstBad){
        if(perfect) npcNoteText = LT(pickLocalized(GOURMET_SATISFIED_PHRASES));
        else if(good) npcNoteText = LT(pickLocalized(GOURMET_UNIMPRESSED_PHRASES));
        else npcNoteText = LT(pickLocalized(GOURMET_INDIGNANT_PHRASES));
      } else {
        if(perfect) npcNoteText = LT(pickLocalized(GOURMET_PRAISE_PHRASES));
        else if(good) npcNoteText = LT(UI_TEXT.TASTE_HALF_TAG);
      }
    }

    // ---------- Сверхновая: точные габариты / странные пропорции (только аркада-статистика) ----------
    if(!isDailyMode && cfg.special === 'dual_size' && window.PotionProfile){
      const dims = components.filter(c => c.key === 'size' || c.key === 'size2');
      if(dims.length === 2 && dims.every(c => c.score >= 0.999))
        window.PotionProfile.bumpNpcStat('supernova_child', 'novaExactDims', 1);
      if(perfect && Math.abs((target.size ?? 0) - (target.size2 ?? 0)) >= 60)
        window.PotionProfile.bumpNpcStat('supernova_child', 'novaExtremePerfects', 1);
      checkNpcAchievements('supernova_child');
    }

    // ---------- Хранитель: кампания печатей — вся прогрессия, только аркада ----------
    if(!isDailyMode){
      if(target.sealed && window.PotionProfile){
        if(good) window.PotionProfile.bumpNpcStat('archivist', 'sealGoods', 1);
        if(perfect) window.PotionProfile.bumpNpcStat('archivist', 'sealPerfects', 1);
        checkNpcAchievements('archivist');
      }
      // тройка с печатью сыграна (выбрали отмеченного или нет — заряд ушёл)
      if(archSeal && archSeal.tripleActive){
        archSeal.resolved++;
        archSeal.tripleActive = false;
        if(target.sealed && perfect){
          archSeal.perfects++;
          archSeal.perfectNpcs.push(cfg.id);
        }
        if(archSeal.resolved >= archSeal.total){
          // кампания печатей завершена
          if(archSeal.perfects === 3 && archSeal.total === 3){
            // ИСТОРИЧЕСКИЙ МОМЕНТ: 3 идеала на 3 печатях
            npcNoteText = LT(pickLocalized(ARCH_HISTORIC_PHRASES));
            if(window.PotionProfile){
              window.PotionProfile.bumpNpcStat('archivist', 'historicMoments', 1);
              // Хранитель раскрывает по одной случайной незакрытой ачивке
              // каждого из троих — прямым текстом (см. renderCharacters)
              archSeal.perfectNpcs.forEach(npcId=>{
                const defs = NPC_ACHIEVEMENTS[npcId] || [];
                const pAch = ((window.PotionProfile.data.achievements||{}).npc||{})[npcId] || {};
                const locked = defs.filter(d => (pAch[d.id]||0) < 3);
                if(locked.length) window.PotionProfile.setKeeperHint(npcId, pick(locked).id);
              });
              checkNpcAchievements('archivist');
            }
          }
          archSeal = null;
        }
      }
      // ---------- Хранитель: идеал у него самого запускает печати ----------
      if(cfg.id === 'archivist' && perfect){
        const n = Math.min(3, Math.max(1, target.regLevel >= 3 ? 3 : target.regLevel));
        archSeal = { remaining:n, total:n, resolved:0, perfects:0, perfectNpcs:[], tripleActive:false };
        npcNoteText = LT(pickLocalized(ARCH_SEAL_PHRASES));
      }
    }

    // cached so a language switch can re-translate the overlay without recomputing scores
    lastResult = { perfect, good, swill, delta, speedBonusPct, overallPct, components, focus: target.focus };

    $('stickerEmoji').innerHTML = visualHTML(stickerVal, 'sticker-img');
    $('resultTitle').textContent = LT(perfect ? UI_TEXT.RESULT_PERFECT : good ? UI_TEXT.RESULT_GOOD : swill ? UI_TEXT.RESULT_SWILL : UI_TEXT.RESULT_BAD);
    $('resultTitle').className = 'result-title ' + (good ? 'good' : swill ? 'swill' : 'bad');
    $('deltaVal').textContent = (delta>=0?'+':'') + delta;
    $('deltaVal').className = 'delta ' + (good ? 'good' : swill ? 'swill' : 'bad');
    $('speedNote').textContent = speedBonusPct >= 1 ? LT(UI_TEXT.SPEED_BONUS).replace('{p}', speedBonusPct) : '';
    $('overallScore').textContent = overallPct + '%';
    $('breakdown').innerHTML = components.map(c=>
      `<div class="row ${c.focused?'focused':''} ${c.decisive?'decisive':''}"><span>${c.focused?visualHTML(FOCUS_ICONS[target.focus],'focus-img')+' ':''}${c.decisive?'🗿 ':''}${LT(c.label)}</span><span class="val">${Math.round(c.score*100)}%</span></div>`
    ).join('');

    // Патч: реплика НПС (Ир / Хранитель) + кнопки переигровки Ир
    const npcNoteEl = $('npcNote');
    if(npcNoteEl){
      npcNoteEl.textContent = npcNoteText;
      npcNoteEl.style.display = npcNoteText ? '' : 'none';
    }
    const replayBtnEl = $('replayBtn');
    if(replayBtnEl){
      replayBtnEl.style.display = replayMode ? '' : 'none';
      if(replayMode) replayBtnEl.textContent = LT(replayMode === 'forced' ? UI_TEXT.IR_FORCE_REPLAY_BTN : UI_TEXT.IR_REPLAY_BTN);
    }
    // принудительная переигровка: "Дальше" спрятана, идеал придётся доказать дважды
    $('nextBtn').style.display = (replayMode === 'forced') ? 'none' : '';

    const jar = $('jarSvg');
    jar.classList.remove('shake','celebrate');
    void jar.offsetWidth;
    if(perfect){ SFX.perfect(); jar.classList.add('celebrate'); }
    else if(good){ SFX.good(); jar.classList.add('celebrate'); }
    else if(swill){ SFX.tick(); } // пойло — нейтральный отклик, без празднования и тряски
    else { SFX.bad(); jar.classList.add('shake'); }
    setTimeout(()=> $('resultOverlay').classList.add('show'), 450);
  }

  $('nextBtn').addEventListener('click', ()=>{
    SFX.uiClick();
    Object.values(S).forEach(s=>s.setDisabled(false));
    preResultSnapshot = null; // Патч: снимок больше не нужен
    irReplayActive = false; // Патч (Ир): принял результат — переигровки на этом заказе больше нет
    // Фаза F: 1 день = 1 выполненный заказ, см. profile.js
    if(window.PotionProfile) window.PotionProfile.recordDayPlayed();
    // Фаза 3, модификатор "Погром": персонаж "дерётся" — по завершении его дня
    // он выбывает из цикла и портит репутацию остальным гостям этого дня
    // (в дейлике репутации/модификатора нет — см. buildOrderDescriptor).
    if(!isDailyMode && currentOrd && (currentOrd.mods||[]).includes('rampage')){
      pogromRemovedIds.add(currentOrd.cfg.id);
      if(window.PotionProfile){
        currentOrders.forEach(o=>{
          if(o.cfg.id !== currentOrd.cfg.id) window.PotionProfile.adjustReputation(o.cfg.id, -2);
        });
      }
      const nm = LT(currentOrd.cfg.name);
      showToast({ icon:'💥', prefix: LT(UI_TEXT.MOD_RAMPAGE_TOAST), name: nm });
    }
    // Фаза 3: длина цикла в аркаде растёт по прогрессии (5→…→10); дейлик — 10.
    const cycleLen = isDailyMode ? 10 : progCycleDays();
    if(dayNum >= cycleLen){
      showWeekOverlay();
    } else {
      dayNum++;
      showSelectScreen();
    }
  });

  // ---------- Патч (Ир): переигровка заказа ----------
  // "Второй рассвет" (бафф, по желанию) и "Дважды безупречно" (дебафф,
  // принудительно). Откатываем цикл к состоянию "до результата" и заново
  // запускаем ТОТ ЖЕ заказ (с новой случайной целью). Записи в профиле от
  // первой попытки остаются — история не переписывается, только рейтинг.
  const replayBtnHook = $('replayBtn');
  if(replayBtnHook) replayBtnHook.addEventListener('click', ()=>{
    SFX.cardPick();
    if(preResultSnapshot){
      score = preResultSnapshot.score;
      streak = preResultSnapshot.streak;
      stage = preResultSnapshot.stage;
      perfectStreakAtMax = preResultSnapshot.perfectStreakAtMax;
      goodStreakAtMax = preResultSnapshot.goodStreakAtMax;
      stickerCounts.perfect = preResultSnapshot.stickerCounts.perfect;
      stickerCounts.good = preResultSnapshot.stickerCounts.good;
      stickerCounts.swill = preResultSnapshot.stickerCounts.swill || 0;
      stickerCounts.bad = preResultSnapshot.stickerCounts.bad;
      archSeal = preResultSnapshot.archSeal
        ? { ...preResultSnapshot.archSeal, perfectNpcs: [...preResultSnapshot.archSeal.perfectNpcs] }
        : null;
      $('scoreVal').textContent = score;
      $('streakVal').textContent = streak;
      updateStickerTally();
      preResultSnapshot = null;
    }
    Object.values(S).forEach(s=>s.setDisabled(false));
    $('resultOverlay').classList.remove('show');
    $('nextBtn').style.display = '';
    // эффект Ир уже сработал — на переигровке его не будет
    if(currentOrd) currentOrd._irReplay = true;
    irPending = null;
    startOrder(currentOrd, currentOrd.regLevel);
  });

  // ---------- global leaderboard (Фаза 4) ----------
  // Вошёл в аккаунт → ОБЩИЙ онлайн-лидерборд в Supabase (пишут только
  // зарегистрированные — RLS auth.uid()=user_id; читают все). Гость → локальный
  // лидерборд на localStorage, как раньше. Прежний Firebase-путь убран.
  const LOCAL_LB_KEY = 'potionshop_leaderboard_v1';
  function lbOnline(){ return !!(window.PotionAuth && window.PotionAuth.isLoggedIn() && window.PotionAuth.isConfigured()); }

  // boardKey — необязательный { local, remote }; без него — обычный аркадный
  // рейтинг. remote — id доски в Supabase (arcade / daily/<diff>/<date>).
  async function loadLeaderboard(boardKey){
    const localKey = boardKey ? boardKey.local : LOCAL_LB_KEY;
    const board = boardKey ? boardKey.remote : 'arcade';
    if(lbOnline()){
      const rows = await window.PotionAuth.leaderboardLoad(board);
      if(rows){
        // created_at → date для рендера (renderLeaderboard ждёт .date)
        return rows.map(r => ({ name: r.name, score: r.score,
          date: r.created_at ? new Date(r.created_at).toLocaleDateString(LANG === 'ru' ? 'ru-RU' : 'en-US') : '' }));
      }
    }
    try{ return JSON.parse(localStorage.getItem(localKey) || '[]'); }
    catch(e){ return []; }
  }
  async function saveLeaderboardEntry(name, finalScore, boardKey){
    const localKey = boardKey ? boardKey.local : LOCAL_LB_KEY;
    const board = boardKey ? boardKey.remote : 'arcade';
    const entry = { name: name || LT(UI_TEXT.ANONYMOUS), score: finalScore, date: new Date().toLocaleDateString(LANG === 'ru' ? 'ru-RU' : 'en-US') };
    if(lbOnline()){
      const ok = await window.PotionAuth.leaderboardSave(board, entry.name, finalScore);
      if(ok) return await loadLeaderboard(boardKey);
      // не удалось записать онлайн — не теряем результат, падаем в локальное
    }
    let list = [];
    try{ list = JSON.parse(localStorage.getItem(localKey) || '[]'); }catch(e){}
    list.push(entry);
    list.sort((a,b)=>b.score-a.score);
    localStorage.setItem(localKey, JSON.stringify(list.slice(0,50)));
    return list;
  }
  // ---------- Патч "Ежедневный заказ": свой рейтинг на (сложность, дата) ----------
  // Патч: UTC — та же доска у всех игроков одновременно, независимо от
  // часового пояса (см. seedFromDate выше — та же причина)
  function dateStrFor(d){
    return `${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,'0')}${String(d.getUTCDate()).padStart(2,'0')}`;
  }
  function dailyBoardKey(diffKey, d){
    const ds = dateStrFor(d);
    return { local: `potionshop_daily_${diffKey}_${ds}`, remote: `daily/${diffKey}/${ds}` };
  }
  function currentDailyBoardKey(){ return dailyBoardKey(dailyDifficulty, new Date()); }
  function yesterdayDailyBoardKey(){
    // вычитаем ровно сутки из UTC-таймстампа — setDate() сдвигал бы по
    // ЛОКАЛЬНОМУ календарю, что рядом с полуночью могло дать не тот UTC-день
    const y = new Date(Date.now() - 86400000);
    return dailyBoardKey(dailyDifficulty, y);
  }
  // Стадия 4: топ-3 вчерашнего дня больше НЕ висит рядом с заданиями —
  // он переехал в окно рейтинга (см. renderYesterdayInOverlay + кнопка lbBtn).
  // Функцию оставляем как no-op (её ещё дёргают из enterDailyMode и т.д.),
  // на всякий случай гасим старый select-элемент, если он вдруг показан.
  async function loadDailyYesterdayTop(){
    const host = $('dailyYesterdayTop');
    if(host){ host.classList.add('hidden'); host.innerHTML = ''; }
  }
  // Стадия 4: рендер топ-3 вчерашнего дня В ОКНЕ рейтинга (только в дейлике)
  async function renderYesterdayInOverlay(){
    const host = $('lbYesterday');
    if(!host) return;
    if(!isDailyMode){ host.classList.add('hidden'); host.innerHTML = ''; return; }
    const list = await loadLeaderboard(yesterdayDailyBoardKey());
    const top3 = [...list].sort((a,b)=>b.score-a.score).slice(0,3);
    if(!top3.length){ host.classList.add('hidden'); host.innerHTML = ''; return; }
    host.classList.remove('hidden');
    host.innerHTML = `<div class="dyt-title">${LT(UI_TEXT.DAILY_YESTERDAY_TITLE)}</div>` +
      top3.map((e,i)=>`<div class="dyt-row"><span><span class="dyt-rank">${i+1}.</span>${escapeHtml(e.name)}</span><span>${e.score}</span></div>`).join('') +
      `<div class="dyt-today-label">${LT(UI_TEXT.DAILY_TODAY_TITLE)}</div>`;
  }
  // cached so a language switch can re-render the currently open leaderboard(s)
  const lastLb = {};
  // имя игрока для лидерборда — произвольный пользовательский текст, попадающий
  // в общую Firebase-базу и рендерящийся у всех остальных игроков, поэтому
  // экранируем его перед вставкой в innerHTML
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function renderLeaderboard(list, highlightScore, elId){
    lastLb[elId] = { list, highlightScore };
    list.sort((a,b)=>b.score-a.score);
    $(elId).innerHTML = list.slice(0,50).map(e=>
      `<div class="lb-row ${e.score===highlightScore?'me':''}"><span>${escapeHtml(e.name)}</span><span>${e.score} · ${escapeHtml(e.date)}</span></div>`
    ).join('') || `<div style="color:var(--ink-dim);text-align:center;">${LT(UI_TEXT.LB_EMPTY)}</div>`;
  }

  $('lbBtn').addEventListener('click', async ()=>{
    SFX.uiClick();
    await renderYesterdayInOverlay();           // Стадия 4: вчерашний топ сверху (дейлик)
    const list = await loadLeaderboard(isDailyMode ? currentDailyBoardKey() : undefined);
    renderLeaderboard(list, null, 'lbOverlayList');
    $('lbOverlay').classList.add('show');
  });
  $('lbCloseBtn').addEventListener('click', ()=>{ SFX.uiClick(); $('lbOverlay').classList.remove('show'); });
  // Патч "УР.4" (Инспектор Гильдии): закрыть лист "Допуски"
  const inspectorTolCloseBtnEl = $('inspectorTolCloseBtn');
  if(inspectorTolCloseBtnEl) inspectorTolCloseBtnEl.addEventListener('click', ()=>{
    SFX.uiClick(); $('inspectorTolOverlay').classList.remove('show');
  });
  // Патч "УР.4" (Стажёр Бип): "Готово" внутри мини-игры — это и есть
  // настоящее завершение раунда (см. finishCraft — туда мы попали как раз
  // потому, что нажали главную "Готово!"/"Что там у других?" один раз)
  // ============================================================
  // Фаза G: Коллекция — статистика, лента идеалов, альбом стикеров,
  // репутация неписей. Читает только window.PotionProfile.data — ничего
  // тут не пишет обратно в профиль (это делает только finalizeResult()).
  // ============================================================

  // ---------- Фаза J: уровни репутации ----------
  // Реальные пороги — REP_LEVELS в content.js (кумулятивные значения).
  // Уровень N достигнут при value >= REP_LEVELS[N-1]; progress — доля
  // пути до следующего порога (для прогресс-баров). Фолбэк на старый
  // REP_LEVEL_STEP оставлен на случай отсутствия REP_LEVELS.
  function repLevelInfo(value){
    const v = Math.max(0, value || 0);
    if(typeof REP_LEVELS !== 'undefined' && Array.isArray(REP_LEVELS) && REP_LEVELS.length){
      let level = 0;
      while(level < REP_LEVELS.length && v >= REP_LEVELS[level]) level++;
      if(level >= REP_LEVELS.length) return { level, progress: 1, maxed: true };
      const prev = level === 0 ? 0 : REP_LEVELS[level-1];
      const next = REP_LEVELS[level];
      return { level, progress: (v - prev) / ((next - prev) || 1), maxed: false };
    }
    const step = (typeof REP_LEVEL_STEP !== 'undefined') ? REP_LEVEL_STEP : 50;
    return { level: Math.floor(v/step), progress: (v % step)/step, maxed: false };
  }
  function npcRepLevel(npcId){
    if(!window.PotionProfile || !npcId) return 0;
    const rep = window.PotionProfile.data.npcReputation[npcId];
    return repLevelInfo(rep ? rep.value : 0).level;
  }
  // Фаза J: 4-я сложность доступна либо по флагу cfg.level4 (стартовый
  // дрон), либо когда репутация с НПС достигла REP_L4_UNLOCK_LEVEL.
  // Механика пока общая ("плохие" пузыри) — уникальные на каждого НПС
  // добавятся отдельным патчем.
  function level4Available(cfg){
    if(cfg.level4) return true;
    const need = (typeof REP_L4_UNLOCK_LEVEL !== 'undefined') ? REP_L4_UNLOCK_LEVEL : 99;
    return npcRepLevel(cfg.id) >= need;
  }

  // count может быть дробным (Фаза G доп.: вес сложности) — рисуем целые
  // заполненные слоты, а следующий слот показываем частично залитым, чтобы
  // прогресс было видно даже между целыми стикерами
  function renderRibbonDots(count, total, iconVal, filledCls){
    const full = Math.floor(count);
    const frac = Math.max(0, Math.min(1, count - full));
    let html = '';
    for(let i=0;i<total;i++){
      if(i < full){
        html += `<div class="ribbon-dot filled ${filledCls||''}">${visualHTML(iconVal,'ribbon-icon')}</div>`;
      } else if(i === full && frac > 0.02){
        html += `<div class="ribbon-dot partial ${filledCls||''}" style="--fill:${Math.round(frac*100)}%"></div>`;
      } else {
        html += `<div class="ribbon-dot"></div>`;
      }
    }
    return html;
  }

  // ============================================================
  // Фаза H: общие ачивки — проверка + всплывающие уведомления.
  // Список определений — GENERAL_ACHIEVEMENTS в content.js. Большинство
  // проверяются автоматически (check(profileData)); три "ручные" (речь про
  // молниеносный идеал на макс. сложности и место в глобальном рейтинге)
  // открываются напрямую из finalizeResult()/saveScoreBtn — их неудобно
  // выразить как чистую функцию от одного профиля.
  // ============================================================
  let achToastQueue = [];
  let achToastShowing = false;
  function achDef(id){
    return (typeof GENERAL_ACHIEVEMENTS !== 'undefined') ? GENERAL_ACHIEVEMENTS.find(a=>a.id===id) : null;
  }
  // Фаза I/J: обобщённый тост — иконка + серый префикс + название.
  // prefix/name могут быть локализованными объектами {ru,en} или строкой.
  function showToast({ icon, prefix, name }){
    achToastQueue.push({ icon, prefix, name });
    if(!achToastShowing) drainAchToastQueue();
  }
  // Фаза H v2: тост показывает название + римский номер порога (если
  // у ачивки порогов больше одного). Иконка — картинка (img), если
  // владелец её прописал в content.js, иначе эмодзи.
  const ACH_ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
  function showAchievementToast(ach, tier){
    // Фаза 3 (3D): до открытия коллекции игрок не получает уведомлений об
    // ачивках (прогресс копится молча — тосты появятся после разблокировки).
    if(!progMechUnlocked('collection')) return;
    const total = generalAchTierCount(ach);
    let nm = LT(ach.name);
    if(total > 1 && tier) nm += ' ' + (ACH_ROMAN[tier-1] || tier);
    showToast({ icon: ach.img || ach.icon || '🏆', prefix: UI_TEXT.ACH_TOAST_PREFIX, name: nm });
  }
  function drainAchToastQueue(){
    const t = achToastQueue.shift();
    if(!t){ achToastShowing = false; return; }
    achToastShowing = true;
    SFX.achieve();
    let host = $('achToastHost');
    if(!host){
      host = document.createElement('div');
      host.id = 'achToastHost';
      document.body.appendChild(host);
    }
    const toast = document.createElement('div');
    toast.className = 'ach-toast';
    toast.innerHTML = `
      <div class="ach-toast-icon">${visualHTML(t.icon||'🏆','ach-toast-img')}</div>
      <div class="ach-toast-body">
        <div class="ach-toast-prefix">${LT(t.prefix)}</div>
        <div class="ach-toast-name">${LT(t.name)}</div>
      </div>`;
    host.appendChild(toast);
    requestAnimationFrame(()=> toast.classList.add('show'));
    setTimeout(()=>{
      toast.classList.remove('show');
      toast.addEventListener('transitionend', ()=>{ toast.remove(); drainAchToastQueue(); }, {once:true});
    }, 3200);
  }
  // ---------- Фаза H v2: пороговые общие ачивки ----------
  // сколько порогов у ачивки (у ручных они лежат в tiers[])
  function generalAchTierCount(ach){
    if(ach.manual) return ach.tiers ? ach.tiers.length : 1;
    return (ach.t || []).length;
  }
  // фактический тир: авто — из value(profile) против порогов t,
  // ручные — из сохранённой записи профиля
  function generalAchTier(ach, p){
    if(ach.manual) return storedGeneralTier(p, ach.id);
    let v = 0;
    try{ v = ach.value ? ach.value(p) : 0; }catch(e){}
    let tier = 0;
    for(let i=0;i<ach.t.length;i++){ if(v >= ach.t[i]) tier = i+1; }
    return tier;
  }
  // сохранённый тир (старые записи {unlockedAt} без tier = 1 порог)
  function storedGeneralTier(p, achId){
    const rec = (p.achievements.general || {})[achId];
    if(!rec) return 0;
    return (typeof rec.tier === 'number') ? rec.tier : 1;
  }
  // прогоняет все НЕ-ручные ачивки против текущего профиля; новые пороги
  // фиксирует в профиле и (если не silent) показывает тост
  function checkGeneralAchievements(silent){
    if(!window.PotionProfile || typeof GENERAL_ACHIEVEMENTS === 'undefined') return;
    const p = window.PotionProfile.data;
    GENERAL_ACHIEVEMENTS.forEach(ach=>{
      if(ach.manual) return;
      try{
        const cur = generalAchTier(ach, p);
        const was = storedGeneralTier(p, ach.id);
        if(cur > was){
          window.PotionProfile.setGeneralAchievementTier(ach.id, cur);
          if(!silent) showAchievementToast(ach, cur);
        }
      }catch(e){ /* защитно — плохая ачивка не должна ронять игру */ }
    });
  }
  // открывает порог "ручной" ачивки (tier — номер порога, по умолчанию 1)
  function unlockManualAchievement(id, tier){
    if(!window.PotionProfile) return;
    const p = window.PotionProfile.data;
    const t = Math.max(1, (tier|0) || 1);
    if(storedGeneralTier(p, id) >= t) return;
    window.PotionProfile.setGeneralAchievementTier(id, t);
    const ach = achDef(id);
    if(ach) showAchievementToast(ach, t);
  }

  // ============================================================
  // Фаза I: ачивки неписей + лорные фразы + награды за комплект.
  // Определения — NPC_ACHIEVEMENTS/NPC_LORE/NPC_REWARDS в content.js.
  // ============================================================
  // достаёт значение метрики "вида" ачивки из profile.npcStats[npcId]
  function npcAchValue(kind, ns, def){
    if(!ns) return 0;
    switch(kind){
      case 'orders':          return ns.orders||0;
      case 'perfects':        return ns.perfects||0;
      case 'perfect_streak':  return ns.perfectStreakBest||0;
      case 'no_bad_streak':   return ns.noBadStreakBest||0;
      case 'bads':            return ns.bads||0;
      case 'picks_cycle':     return ns.picksCycleBest||0;
      case 'hard_perfects':   return ns.hardPerfects||0;
      case 'fast_perfects':   return ns.fastPerfects||0;
      case 'level4_perfects': return ns.level4Perfects||0;
      case 'focus_perfects': {
        const fp = ns.focusPerfects||{};
        if(def && def.focus) return fp[def.focus]||0;
        return (fp.bubbles||0)+(fp.color||0)+(fp.size||0);
      }
      case 'weighted':        return ns.weighted||0;
      // Патч "Уникальные механики": обобщённые "статовые" ачивки —
      // значение лежит прямо в npcStats под ключом def.stat
      case 'stat':            return (def && def.stat ? ns[def.stat] : 0) || 0;
      default: return 0;
    }
  }
  // Патч (Хранитель): условие ачивки открытым текстом — для "прямых
  // указаний" из исторического момента. Шаблоны — в content.js.
  function keeperAchExplain(def){
    let tpl = null;
    if(def.kind === 'stat' && typeof NPC_STAT_EXPLAIN !== 'undefined') tpl = NPC_STAT_EXPLAIN[def.stat];
    if(!tpl && typeof NPC_ACH_KIND_EXPLAIN !== 'undefined') tpl = NPC_ACH_KIND_EXPLAIN[def.kind];
    if(!tpl) return LT(def.hint);
    return LT(tpl).replace('{t}', (def.t || []).join(' / '));
  }
  // текущая градация ачивки (0..3) по порогам def.t
  function npcAchTier(def, ns){
    const v = npcAchValue(def.kind, ns, def);
    let tier = 0;
    for(let i=0;i<def.t.length;i++){ if(v >= def.t[i]) tier = i+1; }
    return tier;
  }
  const TIER_KEYS = [null, 'TIER_BRONZE', 'TIER_SILVER', 'TIER_GOLD'];
  function npcById(id){ return (typeof ALL_NPCS !== 'undefined') ? ALL_NPCS.find(n=>n.id===id) : null; }

  // прогоняет ачивки одного НПС; каждая НОВАЯ градация даёт тост и
  // открывает следующую лорную фразу; полный комплект золота — награду
  function checkNpcAchievements(npcId){
    if(!window.PotionProfile || typeof NPC_ACHIEVEMENTS === 'undefined') return;
    const defs = NPC_ACHIEVEMENTS[npcId];
    if(!defs) return;
    const p = window.PotionProfile.data;
    const ns = p.npcStats ? p.npcStats[npcId] : null;
    const npc = npcById(npcId);
    let newTierSteps = 0;
    defs.forEach(def=>{
      const cur = ((p.achievements.npc && p.achievements.npc[npcId]) || {})[def.id] || 0;
      const now = npcAchTier(def, ns);
      if(now > cur){
        window.PotionProfile.setNpcAchievementTier(npcId, def.id, now);
        newTierSteps += (now - cur);
        showToast({ icon: def.icon || '🏆', prefix: UI_TEXT.NPC_ACH_TOAST_PREFIX,
          name: LT(def.name) + ' (' + LT(UI_TEXT[TIER_KEYS[now]]) + ')' });
      }
    });
    // лорные фразы: одна на каждую новую градацию, последовательно
    if(newTierSteps > 0 && typeof NPC_LORE !== 'undefined' && NPC_LORE[npcId]){
      const total = NPC_LORE[npcId].length;
      let unlockedCount = (((p.lorePhrases.unlockedByNpc||{})[npcId])||[]).length;
      let opened = 0;
      while(newTierSteps-- > 0 && unlockedCount < total){
        window.PotionProfile.unlockLorePhrase(npcId, unlockedCount);
        unlockedCount++; opened++;
      }
      if(opened > 0 && npc){
        showToast({ icon:'📖', prefix: UI_TEXT.LORE_TOAST_PREFIX, name: npc.name });
      }
    }
    // награда за полный комплект золота
    const storedNow = (p.achievements.npc && p.achievements.npc[npcId]) || {};
    const allGold = defs.length > 0 && defs.every(def=> (storedNow[def.id]||0) === 3);
    if(allGold){
      const type = (typeof NPC_REWARDS !== 'undefined' && NPC_REWARDS[npcId]) || 'background';
      const rw = ((p.rewards.byNpc||{})[npcId]) || {};
      const already = type === 'background' ? !!rw.background : !!rw.bottleSkin;
      if(!already){
        if(type === 'background') window.PotionProfile.unlockReward(npcId, 'background', true);
        else window.PotionProfile.unlockReward(npcId, 'bottleSkin', 'default');
        showToast({ icon:'🎁', prefix: UI_TEXT.REWARD_TOAST_PREFIX,
          name: LT(type === 'background' ? UI_TEXT.REWARD_BACKGROUND : UI_TEXT.REWARD_BOTTLE) + (npc ? ' — ' + LT(npc.name) : '') });
      }
    }
  }
  // тост при повышении уровня репутации (repBefore/After — из recordOrderResult)
  function maybeRepLevelUp(npcId, repBefore, repAfter){
    const before = repLevelInfo(repBefore).level;
    const after = repLevelInfo(repAfter).level;
    if(after <= before) return;
    const npc = npcById(npcId);
    showToast({ icon:'💠', prefix: UI_TEXT.REP_TOAST_PREFIX,
      name: (npc ? LT(npc.name) : npcId) + ' — ' + LT(UI_TEXT.REP_LEVEL_LABEL) + after });
    const need = (typeof REP_L4_UNLOCK_LEVEL !== 'undefined') ? REP_L4_UNLOCK_LEVEL : 99;
    if(npc && !npc.level4 && before < need && after >= need){
      showToast({ icon:'⚠️', prefix: LT(npc.name), name: LT(UI_TEXT.REP_L4_NOTE).replace('{n}', need) });
    }
  }

  // ============================================================
  // Фаза J: пассивки. Определения — NPC_PASSIVES в content.js.
  // Пассивка с индексом i открыта, если уровень репутации НПС >= i+1.
  // Активных — до 3; состав можно менять только ПОКА цикл не начался
  // (до первого выполненного заказа цикла).
  // ============================================================
  let cycleStarted = false;

  function passiveDefs(npcId){ return (typeof NPC_PASSIVES !== 'undefined' && NPC_PASSIVES[npcId]) || []; }
  function passiveUnlocked(npcId, passiveId){
    const arr = passiveDefs(npcId);
    const idx = arr.findIndex(pv=>pv.id===passiveId);
    if(idx < 0) return false;
    return npcRepLevel(npcId) >= idx + 1;
  }
  // выбрасывает из active всё, что больше не открыто (репутация могла упасть)
  function sanitizeActivePassives(){
    if(!window.PotionProfile) return [];
    const p = window.PotionProfile.data;
    const act = (p.passives && Array.isArray(p.passives.active)) ? p.passives.active : [];
    const clean = act.filter(a=> a && passiveUnlocked(a.npcId, a.passiveId)).slice(0, 3);
    if(clean.length !== act.length) window.PotionProfile.setActivePassives(clean);
    return clean;
  }
  // суммарные эффекты активных пассивок для заказа конкретного НПС:
  // global-пассивки работают всегда, npc-пассивки — только "у своего" НПС
  function computePassiveFx(npcId){
    // Фаза 11: tips — множитель к чаевым цикла (global). Числовые ключи
    // складываются; булевы «уникалки» (chargeAt2/tipsFlat…) — через passiveHasFlag.
    const fx = { score:0, craftTime:0, memTime:0, speedCap:0, rep:0, progress:0, tips:0 };
    sanitizeActivePassives().forEach(a=>{
      const def = passiveDefs(a.npcId).find(pv=>pv.id===a.passiveId);
      if(!def) return;
      if(def.scope === 'npc' && a.npcId !== npcId) return;
      Object.keys(def.fx||{}).forEach(k=>{ if(typeof fx[k] === 'number' && typeof def.fx[k] === 'number') fx[k] += def.fx[k]; });
    });
    return fx;
  }
  // Фаза 11: активна ли хоть одна пассивка с булевым флагом-«уникалкой»
  // (chargeAt2, tipsFlat...). Для tipsFlat — суммирует числовое значение.
  function passiveHasFlag(flag){
    return sanitizeActivePassives().some(a=>{
      const def = passiveDefs(a.npcId).find(pv=>pv.id===a.passiveId);
      return def && def.fx && def.fx[flag];
    });
  }
  function passiveFlatSum(flag){
    let sum = 0;
    sanitizeActivePassives().forEach(a=>{
      const def = passiveDefs(a.npcId).find(pv=>pv.id===a.passiveId);
      if(def && def.fx && typeof def.fx[flag] === 'number') sum += def.fx[flag];
    });
    return sum;
  }
  function togglePassive(npcId, passiveId){
    if(cycleStarted) return false;
    if(!passiveUnlocked(npcId, passiveId)) return false;
    const act = sanitizeActivePassives();
    const i = act.findIndex(a=>a.npcId===npcId && a.passiveId===passiveId);
    if(i >= 0) act.splice(i, 1);
    else {
      if(act.length >= 3) return false;
      act.push({ npcId, passiveId });
    }
    window.PotionProfile.setActivePassives(act);
    return true;
  }

  // ============================================================
  // Меню "Персонажи" (вынесено из Коллекции): список НПС ↔ детальная
  // вкладка одного НПС. Клик по строке — открыть, клик по портрету —
  // закрыть обратно в список.
  // ============================================================
  let charDetailId = null;

  function npcListIcon(n){
    return visualHTML(Array.isArray(n.img) ? n.img[0] : (n.img || n.emoji), 'char-img');
  }

  function renderCharacters(){
    if(!window.PotionProfile) return;
    const host = $('charactersContent');
    if(!host) return;
    const p = window.PotionProfile.data;
    const allNpcs = (typeof ALL_NPCS !== 'undefined') ? ALL_NPCS : [];
    // Фаза 3 (3C): в коллекции персонаж появляется только ПОСЛЕ первой встречи.
    // Старые профили (до 3A) — показываем тех, с кем уже была история
    // (репутация/заказы), чтобы ничего не «пропало». Без конфига прогрессии —
    // легаси: показываем всех.
    const metInCollection = n => {
      if(!PROG || !window.PotionProfile) return true;
      if(window.PotionProfile.isNpcMet(n.id)) return true;
      const rep = p.npcReputation && p.npcReputation[n.id];
      const ns = p.npcStats && p.npcStats[n.id];
      return !!(rep && rep.value > 0) || !!(ns && ns.orders > 0);
    };
    const npcs = allNpcs.filter(metInCollection);
    if(charDetailId && !npcs.some(n=>n.id===charDetailId)) charDetailId = null;

    if(!charDetailId){
      // ---------- режим списка ----------
      if(!npcs.length){ host.innerHTML = `<div class="char-hint">${LT(UI_TEXT.CHAR_EMPTY_HINT)}</div>`; return; }
      host.innerHTML = `<div class="char-hint">${LT(UI_TEXT.CHAR_OPEN_HINT)}</div>
        <div class="char-list">` + npcs.map(n=>{
          const rep = (p.npcReputation && p.npcReputation[n.id]) || { value:0 };
          const info = repLevelInfo(rep.value);
          const tierColor = `var(--t${n.tier})`;
          const defs = (typeof NPC_ACHIEVEMENTS !== 'undefined' && NPC_ACHIEVEMENTS[n.id]) || [];
          const stored = (p.achievements.npc && p.achievements.npc[n.id]) || {};
          const anyCount = defs.filter(d=>(stored[d.id]||0) > 0).length;
          const goldCount = defs.filter(d=>(stored[d.id]||0) === 3).length;
          return `<div class="char-row" data-npc="${n.id}" style="--tier-color:${tierColor}">
            <div class="char-row-icon">${npcListIcon(n)}</div>
            <div class="char-row-info">
              <div class="char-row-name"><span>${LT(n.name)}</span><span class="char-row-level">${LT(UI_TEXT.REP_LEVEL_LABEL)}${info.level}</span></div>
              <div class="rep-bar"><div class="rep-bar-fill" style="width:${Math.round(info.progress*100)}%;background:${tierColor}"></div></div>
              <div class="char-row-sub">${LT(UI_TEXT.CHAR_ACH_TITLE)}: ${anyCount}/${defs.length}${goldCount ? ` · 🥇 ${goldCount}` : ''}</div>
            </div>
          </div>`;
        }).join('') + `</div>`;
      host.querySelectorAll('.char-row').forEach(row=>{
        row.addEventListener('click', ()=>{ SFX.uiClick(); charDetailId = row.dataset.npc; renderCharacters(); });
      });
      return;
    }

    // ---------- детальная вкладка НПС ----------
    const n = npcs.find(x=>x.id===charDetailId);
    const rep = (p.npcReputation && p.npcReputation[n.id]) || { value:0 };
    const info = repLevelInfo(rep.value);
    const tierColor = `var(--t${n.tier})`;
    const defs = (typeof NPC_ACHIEVEMENTS !== 'undefined' && NPC_ACHIEVEMENTS[n.id]) || [];
    const stored = (p.achievements.npc && p.achievements.npc[n.id]) || {};
    const loreArr = (typeof NPC_LORE !== 'undefined' && NPC_LORE[n.id]) || [];
    const loreUnl = (((p.lorePhrases.unlockedByNpc||{})[n.id])||[]).length;
    const desc = (typeof NPC_LORE_DESC !== 'undefined' && NPC_LORE_DESC[n.id]) || null;
    const passives = passiveDefs(n.id);
    const repLvl = info.level;
    const active = sanitizeActivePassives();

    // Патч (Хранитель): его прямые указания — ачивка помечается печатью,
    // а вместо туманного намёка пишется условие ОТКРЫТЫМ ТЕКСТОМ
    const keeperHintId = ((p.keeperHints||{}).byNpc||{})[n.id] || null;
    const achCells = defs.map(def=>{
      const tier = stored[def.id] || 0;
      const pips = [1,2,3].map(t=>`<span class="ach-pip t${t} ${tier>=t?'on':''}"></span>`).join('');
      const isKeeper = keeperHintId === def.id;
      // подсказка (hint) — художественный намёк курсивом; для пустого
      // слота это единственная информация об ачивке. Указание Хранителя
      // заменяет намёк на прямое условие.
      const hint = isKeeper
        ? `<div class="npc-ach-hint keeper-hint"><span class="keeper-mark">📜 ${LT(UI_TEXT.ARCH_HINT_MARK)}</span><br>${keeperAchExplain(def)}</div>`
        : `<div class="npc-ach-hint"><i>${LT(def.hint)}</i></div>`;
      const keeperCls = isKeeper ? ' keeper' : '';
      if(tier > 0){
        return `<div class="npc-ach-cell unlocked tier-${tier}${keeperCls}">
          <div class="npc-ach-icon">${def.icon||'🏆'}${isKeeper?'<span class="keeper-badge">📜</span>':''}</div>
          <div class="npc-ach-name">${LT(def.name)}</div>
          <div class="ach-pips">${pips}</div>${hint}
        </div>`;
      }
      return `<div class="npc-ach-cell locked${keeperCls}">
        <div class="npc-ach-icon">?${isKeeper?'<span class="keeper-badge">📜</span>':''}</div>
        <div class="ach-pips">${pips}</div>${hint}
      </div>`;
    }).join('');

    const passRows = passives.map((pv, idx)=>{
      const unlocked = repLvl >= idx + 1;
      const isActive = active.some(a=>a.npcId===n.id && a.passiveId===pv.id);
      return `<div class="passive-card ${pv.scope} ${unlocked?'unlocked':'locked'} ${isActive?'active':''}">
        <div class="passive-icon">${unlocked ? (pv.icon||'⚡') : '🔒'}</div>
        <div class="passive-info">
          <div class="passive-name">${unlocked ? LT(pv.name) : (LT(UI_TEXT.PASSIVE_LEVEL_LABEL) + (idx+1))}</div>
          ${unlocked ? `<div class="passive-desc">${LT(pv.desc)}</div>` : ''}
        </div>
        <div class="passive-scope">${LT(pv.scope==='npc' ? UI_TEXT.PASSIVE_SCOPE_NPC : UI_TEXT.PASSIVE_SCOPE_GLOBAL)}</div>
      </div>`;
    }).join('');

    const rwType = (typeof NPC_REWARDS !== 'undefined' && NPC_REWARDS[n.id]) || 'background';
    const rw = ((p.rewards.byNpc||{})[n.id]) || {};
    const rwGot = rwType === 'background' ? !!rw.background : !!rw.bottleSkin;
    const l4need = (typeof REP_L4_UNLOCK_LEVEL !== 'undefined') ? REP_L4_UNLOCK_LEVEL : 0;

    // Патч "Взаимоотношения": показываем только связи, которые игрок уже
    // встретил на экране выбора (см. expand() в renderCustomerCards) —
    // неоткрытые не спойлерим вообще
    const REL_ICON = { friend:'🤝', enemy:'⚔️', buddy:'🍺', dislike:'😒' };
    const REL_LABEL_KEY = { friend:'REL_KIND_FRIEND', enemy:'REL_KIND_ENEMY', buddy:'REL_KIND_BUDDY', dislike:'REL_KIND_DISLIKE' };
    const discoveredRels = (typeof NPC_RELATIONS !== 'undefined' ? NPC_RELATIONS : [])
      .filter(r => r.a === n.id || r.b === n.id)
      .map(r => ({ rel:r, otherId: r.a === n.id ? r.b : r.a }))
      .filter(x => window.PotionProfile.isRelationDiscovered(relationKey(n.id, x.otherId)));
    const relRows = discoveredRels.map(x=>{
      const otherNpc = npcById(x.otherId);
      return `<div class="char-relation-row ${x.rel.kind}">
        <div class="char-relation-icon">${REL_ICON[x.rel.kind]}</div>
        <div class="char-relation-info">
          <div class="char-relation-head">
            <span class="char-relation-kind">${LT(UI_TEXT[REL_LABEL_KEY[x.rel.kind]])}</span>
            <span class="char-relation-name">${otherNpc ? LT(otherNpc.name) : x.otherId}</span>
          </div>
          <div class="char-relation-lore">${LT(x.rel.lore)}</div>
        </div>
      </div>`;
    }).join('');

    host.innerHTML = `
      <div class="char-detail" style="--tier-color:${tierColor}">
        <div class="char-detail-head">
          <div class="char-detail-icon" id="charDetailPortrait" title="${LT(UI_TEXT.CHAR_BACK_HINT)}">${visualHTML(Array.isArray(n.img)?n.img[0]:(n.img||n.emoji),'char-img-big')}</div>
          <div class="char-detail-headinfo">
            <div class="char-detail-name">${LT(n.name)}</div>
            <div class="char-detail-rep">
              <span>${LT(UI_TEXT.CHAR_REP_TITLE)} · ${LT(UI_TEXT.REP_LEVEL_LABEL)}${info.level}</span>
              <div class="rep-bar"><div class="rep-bar-fill" style="width:${Math.round(info.progress*100)}%;background:${tierColor}"></div></div>
            </div>
            ${(!n.level4 && l4need) ? `<div class="char-l4-note ${repLvl>=l4need?'done':''}">${LT(UI_TEXT.REP_L4_NOTE).replace('{n}', l4need)}</div>` : ''}
            <div class="char-back-hint">${LT(UI_TEXT.CHAR_BACK_HINT)}</div>
          </div>
        </div>
        ${desc ? `<div class="char-section"><div class="collection-section-title">${LT(UI_TEXT.CHAR_LORE_TITLE)}</div>
          <div class="char-lore-desc">${LT(desc)}</div>
          <div class="char-lore-count">${loreUnl}/${loreArr.length} ${LT(UI_TEXT.CHAR_LORE_UNLOCKED)}</div></div>` : ''}
        ${relRows ? `<div class="char-section"><div class="collection-section-title">${LT(UI_TEXT.REL_SECTION_TITLE)}</div>
          <div class="char-relation-list">${relRows}</div></div>` : ''}
        <div class="char-section"><div class="collection-section-title">${LT(UI_TEXT.CHAR_PASSIVES_TITLE)}</div>
          <div class="passive-list">${passRows}</div></div>
        <div class="char-section"><div class="collection-section-title">${LT(UI_TEXT.CHAR_ACH_TITLE)}</div>
          <div class="npc-ach-grid">${achCells}</div></div>
        <div class="char-section"><div class="collection-section-title">${LT(UI_TEXT.CHAR_REWARD_TITLE)}</div>
          <div class="char-reward ${rwGot?'unlocked':'locked'}">
            <span class="char-reward-icon">${rwGot?'🎁':'🔒'}</span>
            <span>${LT(rwType==='background' ? UI_TEXT.REWARD_BACKGROUND : UI_TEXT.REWARD_BOTTLE)}${rwGot ? ' — ' + LT(UI_TEXT.REWARD_UNLOCKED_NOTE) : ''}</span>
            ${rwGot ? '' : `<span class="char-reward-note">${LT(UI_TEXT.REWARD_LOCKED)}</span>`}
          </div>
        </div>
      </div>`;

    const portrait = $('charDetailPortrait');
    if(portrait) portrait.addEventListener('click', ()=>{ SFX.uiClick(); charDetailId = null; renderCharacters(); });
    // подсказка на слоте ачивки: на десктопе — по наведению (CSS),
    // на тач-экранах — по тапу (класс hint-open)
    host.querySelectorAll('.npc-ach-cell').forEach(cell=>{
      cell.addEventListener('click', ()=> cell.classList.toggle('hint-open'));
    });
  }

  // ============================================================
  // Фаза J: быстрая панель пассивок (отдельная кнопка ⚡) — выбрать
  // до 3 активных на цикл, не залезая в большое меню персонажей.
  // ============================================================
  function renderPassivesPanel(){
    if(!window.PotionProfile) return;
    const host = $('passivesContent');
    if(!host) return;
    const active = sanitizeActivePassives();
    const npcs = (typeof ALL_NPCS !== 'undefined') ? ALL_NPCS : [];
    let anyUnlocked = false;
    const groups = npcs.map(n=>{
      const passives = passiveDefs(n.id);
      const lvl = npcRepLevel(n.id);
      const unlocked = passives.map((pv,idx)=>({pv,idx})).filter(x=> lvl >= x.idx+1);
      if(!unlocked.length) return '';
      anyUnlocked = true;
      const cards = unlocked.map(({pv})=>{
        const isActive = active.some(a=>a.npcId===n.id && a.passiveId===pv.id);
        return `<div class="passive-card selectable ${pv.scope} ${isActive?'active':''} ${cycleStarted?'frozen':''}" data-npc="${n.id}" data-passive="${pv.id}">
          <div class="passive-icon">${pv.icon||'⚡'}</div>
          <div class="passive-info">
            <div class="passive-name">${LT(pv.name)}</div>
            <div class="passive-desc">${LT(pv.desc)}</div>
          </div>
          <div class="passive-scope">${LT(pv.scope==='npc' ? UI_TEXT.PASSIVE_SCOPE_NPC : UI_TEXT.PASSIVE_SCOPE_GLOBAL)}</div>
        </div>`;
      }).join('');
      return `<div class="passive-group" style="--tier-color:var(--t${n.tier})">
        <div class="passive-group-head">
          <span class="passive-group-icon">${npcListIcon(n)}</span>
          <span>${LT(n.name)}</span>
        </div>${cards}
      </div>`;
    }).join('');
    host.innerHTML = `
      <div class="passives-slots">${LT(UI_TEXT.PASSIVES_SLOTS)}: <b>${active.length}/3</b></div>
      <div class="passives-hint">${LT(UI_TEXT.PASSIVES_HINT)}</div>
      ${cycleStarted ? `<div class="passives-locked-note">${LT(UI_TEXT.PASSIVES_LOCKED_NOTE)}</div>` : ''}
      ${(!cycleStarted && active.length >= 3) ? `<div class="passives-locked-note">${LT(UI_TEXT.PASSIVES_FULL_NOTE)}</div>` : ''}
      ${anyUnlocked ? groups : `<div class="passives-empty">${LT(UI_TEXT.PASSIVES_EMPTY)}</div>`}`;
    host.querySelectorAll('.passive-card.selectable').forEach(card=>{
      card.addEventListener('click', ()=>{
        if(cycleStarted) return;
        if(togglePassive(card.dataset.npc, card.dataset.passive)){
          SFX.uiClick();
          renderPassivesPanel();
        }
      });
    });
  }

  // кнопки и закрытие оверлеев "Персонажи" / "Пассивки"
  const charactersBtnEl = $('charactersBtn');
  if(charactersBtnEl) charactersBtnEl.addEventListener('click', ()=>{
    SFX.uiClick(); charDetailId = null; renderCharacters(); $('charactersOverlay').classList.add('show');
  });
  const charactersCloseBtnEl = $('charactersCloseBtn');
  if(charactersCloseBtnEl) charactersCloseBtnEl.addEventListener('click', ()=>{ SFX.uiClick(); $('charactersOverlay').classList.remove('show'); });
  const passivesBtnEl = $('passivesBtn');
  if(passivesBtnEl) passivesBtnEl.addEventListener('click', ()=>{
    SFX.uiClick(); renderPassivesPanel(); $('passivesOverlay').classList.add('show');
  });
  const passivesCloseBtnEl = $('passivesCloseBtn');
  if(passivesCloseBtnEl) passivesCloseBtnEl.addEventListener('click', ()=>{ SFX.uiClick(); $('passivesOverlay').classList.remove('show'); });

  function renderCollection(){
    if(!window.PotionProfile) return;
    const p = window.PotionProfile.data;
    const st = p.stats;

    $('collectionStats').innerHTML = `
      <div class="stat-row"><span>${LT(UI_TEXT.STATS_DAYS)}</span><b>${st.totalDaysPlayed}</b></div>
      <div class="stat-row"><span>${LT(UI_TEXT.STATS_CYCLES)}</span><b>${st.cyclesCompleted}</b></div>
      <div class="stat-row"><span>${LT(UI_TEXT.STATS_TOTAL_SCORE)}</span><b>${st.totalScoreEarned}</b></div>
      <div class="stat-row"><span>${LT(UI_TEXT.STATS_BEST_CYCLE)}</span><b>${st.bestCycleScore}</b></div>
      <div class="stat-row"><span>${LT(UI_TEXT.STATS_ORDERS)}</span><b>${st.totalOrders}</b></div>
    `;

    // ---- лента идеалов (20 позиций, сброс) + платиновая лента ----
    // (Фаза G доп.): необязательная своя картинка для платины —
    // STICKERS.platinum в content.js, иначе используем обычный "идеал"
    const perfectIcon = Array.isArray(STICKERS.perfect) ? STICKERS.perfect[0] : STICKERS.perfect;
    const platinumIcon = STICKERS.platinum
      ? (Array.isArray(STICKERS.platinum) ? STICKERS.platinum[0] : STICKERS.platinum)
      : perfectIcon;
    $('perfectRibbon').innerHTML = renderRibbonDots(p.perfectRibbon.count, 20, perfectIcon);
    $('perfectRibbonCaption').textContent = `${p.perfectRibbon.count.toFixed(1)} / 20`;
    const platCount = p.perfectRibbon.platinumCount || 0;
    $('platinumBlock').style.display = platCount > 0 ? '' : 'none';
    $('platinumRibbon').innerHTML = renderRibbonDots(Math.min(platCount,20), Math.min(Math.max(platCount,1),20), platinumIcon, 'platinum')
      + (platCount > 20 ? `<div class="ribbon-overflow">+${platCount-20}</div>` : '');

    // ---- альбом стикеров: силуэт для ещё не выбитых вариантов ----
    // (Фаза G доп.): необязательная своя картинка для замка —
    // ALBUM_LOCK_ICON в content.js, иначе рисуется просто "?"
    const seen = (st.stickersSeen) || { perfect:[], good:[], swill:[], bad:[] };
    const lockIcon = (typeof ALBUM_LOCK_ICON !== 'undefined') ? ALBUM_LOCK_ICON : null;
    const albumRow = (cat, labelKey)=>{
      const arr = STICKERS[cat];
      const variants = Array.isArray(arr) ? arr : [arr];
      // Патч: особые стикеры (условные) в альбоме помечаются, а закрытые
      // ячейки несут подсказку-намёк в title — чтобы их хотелось выбить
      const specials = (typeof STICKER_SPECIALS !== 'undefined' && STICKER_SPECIALS[cat]) || [];
      const cells = variants.map((v,i)=>{
        const unlocked = (seen[cat]||[]).includes(i);
        const sp = specials.find(s => s.idx === i);
        const lockedHtml = lockIcon ? visualHTML(lockIcon,'album-img') : '<span class="album-lock">?</span>';
        const title = (!unlocked && sp)
          ? ` title="${LT(sp.hint || UI_TEXT.ALBUM_SPECIAL_HINT)}"` : '';
        return `<div class="album-cell ${unlocked?'unlocked':'locked'}${sp?' special':''}"${title}>${unlocked ? visualHTML(v,'album-img') : lockedHtml}</div>`;
      }).join('');
      return `<div class="album-row"><div class="album-row-label">${LT(UI_TEXT[labelKey])}</div><div class="album-row-cells">${cells}</div></div>`;
    };
    $('stickerAlbum').innerHTML =
      albumRow('perfect', 'ALBUM_LABEL_PERFECT') +
      albumRow('good', 'ALBUM_LABEL_GOOD') +
      albumRow('swill', 'ALBUM_LABEL_SWILL') +
      albumRow('bad', 'ALBUM_LABEL_BAD');

    // ---- Фаза H v2: общие ачивки с порогами ----
    // Одна крупная карточка на метрику; под ней ряд блоков-порогов,
    // загорающихся по нарастающей палитре. Наведение на карточку —
    // описание; наведение на блок — порог этого блока. На мобилке
    // тап по карточке показывает/прячет описание.
    if(typeof GENERAL_ACHIEVEMENTS !== 'undefined'){
      const escAttr = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
      const fmtInt = n => Math.floor(n).toLocaleString(LANG === 'ru' ? 'ru-RU' : 'en-US');
      let segsOn = 0, segsTotal = 0;
      const cards = GENERAL_ACHIEVEMENTS.map(ach=>{
        const total = generalAchTierCount(ach);
        // берём максимум из "живого" и сохранённого тира — достигнутый
        // порог не гаснет, даже если метрика-«лучший результат» вдруг
        // окажется ниже (защита от сбросов статистики)
        const tier = Math.max(generalAchTier(ach, p), storedGeneralTier(p, ach.id));
        segsTotal += total; segsOn += Math.min(tier, total);
        let segs = '';
        for(let i=0;i<total;i++){
          const on = i < tier;
          const hintTxt = ach.manual
            ? LT((ach.tiers && ach.tiers[i] && ach.tiers[i].hint) || ach.desc)
            : fmtInt(ach.t[i]);
          segs += `<span class="ach2-seg ${on?'on':''} c${(i%9)+1}" data-hint="${escAttr(hintTxt)}"></span>`;
        }
        let progLine;
        if(ach.manual){
          progLine = `${Math.min(tier,total)}/${total}`;
        } else {
          let val = 0; try{ val = ach.value(p); }catch(e){}
          progLine = (tier < total)
            ? `${fmtInt(val)} / ${fmtInt(ach.t[tier])}`
            : `${fmtInt(val)} ✓`;
        }
        const full = tier >= total;
        return `<div class="ach2-card ${tier>0?'unlocked':'locked'} ${full?'full':''}">
          <div class="ach2-visual">${visualHTML(ach.img || ach.icon || '🏆','ach2-img')}</div>
          <div class="ach2-name">${LT(ach.name)}</div>
          <div class="ach2-tiers">${segs}</div>
          <div class="ach2-progress">${full ? `<span class="full-mark">★ ${LT(UI_TEXT.ACH_FULL_MARK)}</span>` : progLine}</div>
          <div class="ach2-hint">${LT(ach.desc)}</div>
        </div>`;
      }).join('');
      $('achProgressLabel').textContent = `${LT(UI_TEXT.ACH_PROGRESS_LABEL)}: ${segsOn}/${segsTotal}`;
      $('achievementsGrid').innerHTML = cards;
      // мобилка: тап по карточке — показать/спрятать описание
      $('achievementsGrid').querySelectorAll('.ach2-card').forEach(c=>{
        c.addEventListener('click', ()=> c.classList.toggle('hint-open'));
      });
    }

    // Фаза I/J: репутация переехала из Коллекции в отдельное меню
    // "Персонажи" (кнопка 👥) — см. renderCharacters().
  }

  $('collectionBtn').addEventListener('click', ()=>{
    SFX.uiClick();
    renderCollection();
    $('collectionOverlay').classList.add('show');
  });
  $('collectionCloseBtn').addEventListener('click', ()=>{ SFX.uiClick(); $('collectionOverlay').classList.remove('show'); });

  // ---------- UI-патч 2: вкладки Коллекции ----------
  // Длинный скролл из 4 секций разложен на вкладки (Статистика / Лента /
  // Стикеры / Ачивки). Выбранная вкладка живёт в DOM-классах, так что
  // между открытиями Коллекции она сохраняется в рамках сессии.
  function setCollectionTab(tab){
    document.querySelectorAll('#collectionTabs .ctab').forEach(b=>{
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('#collectionOverlay .ctab-page').forEach(pg=>{
      pg.classList.toggle('show', pg.dataset.page === tab);
    });
  }
  const collectionTabsEl = $('collectionTabs');
  if(collectionTabsEl){
    collectionTabsEl.addEventListener('click', e=>{
      const btn = e.target.closest('.ctab');
      if(!btn) return;
      SFX.uiClick();
      setCollectionTab(btn.dataset.tab);
    });
  }

  // ---------- UI-патч 2: мини-меню ⚙ (язык + громкость) ----------
  // Правая группа топбара была перегружена; редкоиспользуемые
  // язык и громкость спрятаны в выпадающее меню под шестерёнкой.
  const settingsWrap = $('settingsWrap');
  const settingsBtn = $('settingsBtn');
  if(settingsBtn && settingsWrap){
    settingsBtn.addEventListener('click', e=>{
      e.stopPropagation();
      SFX.uiClick();
      settingsWrap.classList.toggle('open');
    });
    // клик вне меню — закрыть (сам ползунок громкости внутри не закрывает)
    document.addEventListener('click', e=>{
      if(!settingsWrap.contains(e.target)) settingsWrap.classList.remove('open');
    });
  }

  async function showWeekOverlay(){
    SFX.weekEnd();
    // Патч "Ежедневный заказ": цикл-аккаунтинг (recordCycleEnd/общие ачивки)
    // и свой рейтинг вместо общего аркадного
    if(!isDailyMode){
      if(window.PotionProfile) window.PotionProfile.recordCycleEnd(score);
      // Фаза 4: сохранить прогресс онлайн (кросс-девайс) — если игрок вошёл
      if(window.PotionAuth && window.PotionAuth.isLoggedIn()) window.PotionAuth.syncUp();
      // Фаза 3: рейтинг цикла идёт в xp прогрессии; тостим новых персонажей и
      // новые уровни лавки (открытые механики применяются автоматически —
      // производны от уровня).
      const progEvents = progApplyCycleScore(score);
      progEvents.newNpcs.forEach(id=>{
        const npc = npcById(id);
        if(npc) showToast({ icon: npc.img || npc.emoji || '🧪', prefix: UI_TEXT.PROG_NPC_UNLOCK_TOAST, name: npc.name });
      });
      progEvents.levelsGained.forEach(l=>{
        showToast({ icon:'⭐', prefix: UI_TEXT.PROG_LEVEL_UP_TOAST, name: String(l) });
      });
      // Фаза 5: чаевые — 5% от рейтинга цикла (после открытия на Ур.4)
      // Фаза 10 (Пьяница Пит): + накопленный за цикл бонус за «градус»
      // Фаза 11: пассивки — множитель tips (×) + плоская добавка tipsFlat
      if(progMechUnlocked('tips') && window.PotionProfile){
        const tipsMult = 1 + (computePassiveFx('').tips || 0);
        const tip = Math.round(score * 0.05 * tipsMult + peteDegreeTipBonus + passiveFlatSum('tipsFlat'));
        if(tip > 0){
          window.PotionProfile.addTips(tip);
          showToast({ icon:'🪙', prefix: UI_TEXT.TIPS_EARNED_TOAST, name: '+' + tip });
        }
      }
      checkGeneralAchievements();
    }
    $('resultOverlay').classList.remove('show');
    $('finalScoreVal').textContent = score;
    // Фаза 4: ник вписывается автоматически из профиля игрока
    $('nameInput').value = authNick();
    // Фаза 4: в лидерборд записываем только если результат ВЫШЕ личного рекорда
    const boardId = isDailyMode ? currentDailyBoardKey().local : 'arcade';
    const isRecord = !window.PotionAuth || score > window.PotionAuth.getBest(boardId);
    const sbtn = $('saveScoreBtn');
    if(sbtn){
      sbtn.disabled = !isRecord || score <= 0;
      sbtn.textContent = LT(isRecord ? UI_TEXT.SAVE_SCORE_BTN : UI_TEXT.SAVE_SCORE_NOT_RECORD);
    }
    const list = await loadLeaderboard(isDailyMode ? currentDailyBoardKey() : undefined);
    renderLeaderboard(list, null, 'leaderboardList');
    $('weekOverlay').classList.add('show');
  }
  $('saveScoreBtn').addEventListener('click', async ()=>{
    SFX.uiClick();
    const name = ($('nameInput').value.trim() || authNick()).slice(0,20);
    // фиксируем личный рекорд для будущего гейта
    if(window.PotionAuth){ const bId = isDailyMode ? currentDailyBoardKey().local : 'arcade'; window.PotionAuth.setBestIfHigher(bId, score); }
    const list = await saveLeaderboardEntry(name, score, isDailyMode ? currentDailyBoardKey() : undefined);
    renderLeaderboard(list, score, 'leaderboardList');
    $('saveScoreBtn').disabled = true;
    $('saveScoreBtn').textContent = LT(UI_TEXT.SAVE_SCORE_DONE);
    if(!isDailyMode){
      // Фаза H: "ручные" ачивки за место в глобальном рейтинге — рейтинг уже
      // отсортирован по убыванию в renderLeaderboard(); ищем нашу свежесохранённую
      // запись по очкам (приближённо — при равенстве очков берём самую первую)
      const sorted = [...list].sort((a,b)=>b.score-a.score);
      const rank = sorted.findIndex(e=>e.score === score);
      // Фаза H v2: одна ачивка "Слава галактики" с двумя порогами
      if(rank >= 0 && rank < 10) unlockManualAchievement('leaderboard', rank === 0 ? 2 : 1);
    }
  });
  $('newWeekBtn').addEventListener('click', ()=>{
    SFX.uiClick();
    dayNum = 1; score = 0; streak = 0; stage = 0; perfectStreakAtMax = 0; goodStreakAtMax = 0; peteDegreeTipBonus = 0; pogromRemovedIds.clear(); pendingItemFx.timeBonusMs = 0; pendingItemFx.memBonusMs = 0; bannedNpcs.clear(); guaranteedNextNpc = null;
    if(!isDailyMode){
      // Фаза J: новый цикл — состав пассивок снова можно менять,
      // счётчики "за цикл" (picksCycle) в профиле обнуляются
      cycleStarted = false;
      if(window.PotionProfile) window.PotionProfile.startCycle();
    } else {
      // тот же день можно переиграть — сид персонажей не меняется до полуночи
      loadDailyYesterdayTop();
    }
    $('scoreVal').textContent = score;
    $('streakVal').textContent = streak;
    $('saveScoreBtn').disabled = false;
    $('saveScoreBtn').textContent = LT(UI_TEXT.SAVE_SCORE_BTN);
    $('weekOverlay').classList.remove('show');
    showSelectScreen();
  });

  // ---------- эмбиент + громкость ----------
  const ambientAudio = $('ambientAudio');
  const volumeSlider = $('volumeSlider');
  const volumeIcon = $('volumeIcon');
  // Патч (Диджей Пульсар): на время его заказа общий эмбиент приглушаем до
  // нуля — свой ритм он ставит сам, второй трек поверх только мешает
  let djAmbientDucked = false;
  function setDjAmbientDuck(on){
    if(!ambientAudio || on === djAmbientDucked) return;
    djAmbientDucked = on;
    ambientAudio.volume = on ? 0 : (volumeSlider ? volumeSlider.value/100 : .6);
  }
  function setVolumeIcon(v){
    if(!volumeIcon) return;
    volumeIcon.textContent = v <= 0 ? '🔇' : (v < .5 ? '🔉' : '🔊');
  }
  if(ambientAudio){ ambientAudio.volume = volumeSlider ? volumeSlider.value/100 : .6; }
  setVolumeIcon(ambientAudio ? ambientAudio.volume : .6);
  if(volumeSlider){
    volumeSlider.addEventListener('input', ()=>{
      const v = volumeSlider.value/100;
      if(ambientAudio) ambientAudio.volume = v;
      setVolumeIcon(v);
    });
  }
  // диагностика: если трек не грузится (неверный путь/имя файла —
  // самая частая причина "музыка не играет"), пишем в консоль, чтобы
  // это было видно в devtools вместо тихого молчания
  if(ambientAudio){
    ambientAudio.addEventListener('error', ()=>{
      console.warn('[ambient] Не удалось загрузить трек — проверь, что файл действительно лежит по пути из <source src="..."> в index.html (регистр букв и путь важны на большинстве хостингов).');
    });
  }
  function ambientTryPlay(){
    if(!ambientAudio) return;
    const p = ambientAudio.play();
    if(p && p.catch){
      p.catch(err=>{
        // автоплей мог не пройти (редко — клик уже даёт "жест пользователя"),
        // либо трек ещё не подгрузился к моменту клика — пробуем ещё раз
        // на следующее взаимодействие со страницей
        console.warn('[ambient] play() отклонён, повторим при следующем клике:', err && err.message);
        window.addEventListener('pointerdown', ()=> ambientAudio.play().catch(()=>{}), {once:true});
      });
    }
  }

  // ---------- переключатель языка ----------
  function refreshVisibleScreen(){
    if($('selectScreen').classList.contains('show') && currentOrders.length){
      renderSelectBanners(); // Патч: баннеры Ир/печатей тоже переводим
      renderCustomerCards(currentOrders);
    }
    if($('roundScreen').classList.contains('show') && target && currentOrd){
      // Патч: фишки активных эффектов в шапке заказа
      const fxTagEl = $('orderFxTag');
      if(fxTagEl){
        let fxHtml = '';
        if(target.irEffect && !target.irEffectConsumed){
          const d = target.irEffect.def;
          fxHtml += `<span class="fx-chip ${target.irEffect.kind}" title="${LT(d.desc)}">${d.icon} ${LT(d.name)}</span>`;
        }
        if(target.sealed) fxHtml += `<span class="fx-chip seal">📜 ${LT(UI_TEXT.ARCH_SEAL_TAG)}</span>`;
        if(target.waiterSlowBuff && typeof WAITER_SLOW_BUFF !== 'undefined'){
          fxHtml += `<span class="fx-chip buff" title="${LT(WAITER_SLOW_BUFF.desc)}">${WAITER_SLOW_BUFF.icon} ${LT(WAITER_SLOW_BUFF.name)}</span>`;
        }
        fxTagEl.innerHTML = fxHtml;
      }
      $('orderText').textContent = LT(currentOrd.flavor);
      $('orderFocusTag').innerHTML = modChipsHTML(currentOrd.focus, currentOrd.mods, true);
      const levelTag = $('orderLevelTag');
      if(levelTag && currentOrd.regLevel) levelTag.textContent = LT(UI_TEXT.DIFF_BTN_LABEL) + currentOrd.regLevel;
      $('phaseLabel').textContent = currentPhase === 'craft' ? LT(UI_TEXT.PHASE_CRAFT) : LT(UI_TEXT.PHASE_SCAN);
      $('colorLabelA').textContent = LT(target.flags.hasGradient ? UI_TEXT.LABEL_SPECTRUM_A : UI_TEXT.LABEL_SPECTRUM);
      if(target.flags.hasShape) $('lblShape').textContent = LT(SHAPE_NAMES[S.shape.value]);
    }
    if($('resultOverlay').classList.contains('show') && lastResult){
      const { perfect, good, swill, delta, speedBonusPct, overallPct, components, focus } = lastResult;
      $('resultTitle').textContent = LT(perfect ? UI_TEXT.RESULT_PERFECT : good ? UI_TEXT.RESULT_GOOD : swill ? UI_TEXT.RESULT_SWILL : UI_TEXT.RESULT_BAD);
      $('speedNote').textContent = speedBonusPct >= 1 ? LT(UI_TEXT.SPEED_BONUS).replace('{p}', speedBonusPct) : '';
      $('breakdown').innerHTML = components.map(c=>
        `<div class="row ${c.focused?'focused':''} ${c.decisive?'decisive':''}"><span>${c.focused?visualHTML(FOCUS_ICONS[focus],'focus-img')+' ':''}${c.decisive?'🗿 ':''}${LT(c.label)}</span><span class="val">${Math.round(c.score*100)}%</span></div>`
      ).join('');
    }
    Object.keys(lastLb).forEach(elId=>{
      const { list, highlightScore } = lastLb[elId];
      renderLeaderboard(list, highlightScore, elId);
    });
    if($('saveScoreBtn').disabled) $('saveScoreBtn').textContent = LT(UI_TEXT.SAVE_SCORE_DONE);
    if($('collectionOverlay').classList.contains('show')) renderCollection();
    // Фаза I/J: открытые меню "Персонажи" и "Пассивки" тоже переводим на лету
    if($('charactersOverlay') && $('charactersOverlay').classList.contains('show')) renderCharacters();
    if($('passivesOverlay') && $('passivesOverlay').classList.contains('show')) renderPassivesPanel();
  }
  // ---------- кнопки-картинки сплэша (Пришвартоваться / Дейлик) ----------
  // показываем картинку под текущий язык; кросс-фейд — последовательный:
  // старая уходит в прозрачность, затем проявляется новая.
  function revealSplashButtons(){
    document.querySelectorAll('.plaque-img.lang-' + LANG).forEach(im => im.classList.add('show'));
  }
  function swapSplashButtons(){
    document.querySelectorAll('.plaque-img').forEach(im => im.classList.remove('show'));
    setTimeout(revealSplashButtons, 500); // после фейд-аута предыдущей (см. .plaque-img transition)
  }

  function toggleLanguage(){
    SFX.uiClick();
    LANG = LANG === 'ru' ? 'en' : 'ru';
    localStorage.setItem(LANG_KEY, LANG);
    applyI18n();
    refreshVisibleScreen();
    swapSplashButtons();          // сменить картинку кнопок под новый язык
  }
  // первое появление — плавно, ~через 1с от старта (чтобы не опередить видео)
  setTimeout(revealSplashButtons, 1000);
  const langBtn = $('langBtn');
  if(langBtn) langBtn.addEventListener('click', toggleLanguage);
  // Патч "Ежедневный заказ": та же кнопка языка, но прямо на сплэше
  const splashLangBtn = $('splashLangBtn');
  if(splashLangBtn) splashLangBtn.addEventListener('click', toggleLanguage);

  // ---------- кнопка "на весь экран" (сплэш + основная игра) ----------
  function fsElement(){ return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function toggleFullscreen(){
    const el = document.documentElement;
    if(!fsElement()){
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if(req) req.call(el);
    } else {
      const ex = document.exitFullscreen || document.webkitExitFullscreen;
      if(ex) ex.call(document);
    }
  }
  // пока НЕ на весь экран — кнопка мягко светится (CSS-класс на body)
  function syncFsGlow(){ document.body.classList.toggle('fullscreen-on', !!fsElement()); }
  ['fsBtn','splashFsBtn'].forEach(id=>{
    const b = $(id);
    if(b) b.addEventListener('click', ()=>{ SFX.uiClick(); toggleFullscreen(); });
  });
  document.addEventListener('fullscreenchange', syncFsGlow);
  document.addEventListener('webkitfullscreenchange', syncFsGlow);
  syncFsGlow();

  function dismissSplash(){
    const s = $('splashScreen');
    s.classList.add('fade-out');
    s.addEventListener('transitionend', ()=>{ s.style.display='none'; }, {once:true});
  }
  // Патч (Фаза 0): возврат на стартовый экран БЕЗ перезагрузки страницы.
  // location.reload() всегда сбрасывал полноэкранный режим — поэтому в
  // fullscreen делаем чистый сброс состояния на месте (аналог "нового цикла"
  // из newWeekBtn) и заново показываем сплэш. Так выйти из полного экрана можно
  // только кнопкой fullscreen.
  function returnToSplash(){
    cancelAnimationFrame(rafId);
    level4Stop();
    stopBadBubbles();
    stopMovingAnim();
    stopMatrixRain();
    setDjAmbientDuck(false);
    isDailyMode = false;
    dayNum = 1; score = 0; streak = 0; stage = 0; perfectStreakAtMax = 0; goodStreakAtMax = 0; peteDegreeTipBonus = 0; pogromRemovedIds.clear(); pendingItemFx.timeBonusMs = 0; pendingItemFx.memBonusMs = 0; bannedNpcs.clear(); guaranteedNextNpc = null;
    cycleStarted = false;
    if(window.PotionProfile) window.PotionProfile.startCycle();
    $('scoreVal').textContent = score;
    $('streakVal').textContent = streak;
    $('dayVal').textContent = dayNum;
    ['resultOverlay','weekOverlay','dailyDifficultyOverlay'].forEach(id=>{
      const o = $(id); if(o) o.classList.remove('show');
    });
    showSelectScreen();
    const s = $('splashScreen');
    if(s){ s.style.display = ''; s.classList.remove('fade-out'); }
    updateNickBadge(); // Фаза 4: вернулись на сплэш — прячем ник-бейдж
  }
  // ---------- стартовый экран: кнопка "Пришвартоваться" (обычная аркада) ----------
  const dockBtn = $('dockBtn');
  if(dockBtn){
    // Патч (Фаза 0): убрали {once:true} — после возврата на стартовый экран
    // (returnToSplash, без перезагрузки) сплэш показывается снова и его нужно
    // уметь пришвартовать повторно. Защита от повторного клика — по видимости.
    dockBtn.addEventListener('click', ()=>{
      if($('splashScreen').style.display === 'none') return;
      SFX.dock();
      ambientTryPlay();
      dismissSplash();
      updateNickBadge(); // Фаза 4: показать ник внизу при входе в аркаду
    });
  }

  // ---------- стартовый экран: "Ежедневный особый заказ" ----------
  // Модалка сложности всплывает ПОВЕРХ сплэша (не дисмиссим его сразу) —
  // так можно отменить выбор и остаться на сплэше без "мигания" экрана.
  const dailyDockBtn = $('dailyDockBtn');
  if(dailyDockBtn){
    dailyDockBtn.addEventListener('click', ()=>{
      SFX.uiClick();
      $('dailyDifficultyOverlay').classList.add('show');
    });
  }
  function chooseDailyDifficulty(diffKey){
    SFX.dock();
    ambientTryPlay();
    $('dailyDifficultyOverlay').classList.remove('show');
    dismissSplash();
    enterDailyMode(diffKey);
  }
  const dailyDiffBtns = {
    easy: $('dailyDiffEasyBtn'), mid: $('dailyDiffMidBtn'), hard: $('dailyDiffHardBtn')
  };
  Object.keys(dailyDiffBtns).forEach(key=>{
    if(dailyDiffBtns[key]) dailyDiffBtns[key].addEventListener('click', ()=> chooseDailyDifficulty(key));
  });
  const dailyDiffCancelBtn = $('dailyDiffCancelBtn');
  if(dailyDiffCancelBtn){
    dailyDiffCancelBtn.addEventListener('click', ()=>{
      SFX.uiClick();
      $('dailyDifficultyOverlay').classList.remove('show');
    });
  }

  // ---------- выход обратно на стартовый экран (из аркады или ежедневного режима) ----------
  // Простейший надёжный сброс всего игрового состояния (аркада/ежедневный
  // режим, текущий раунд, таймеры) — перезагрузка страницы; сплэш всегда
  // показывается заново при загрузке, прогресс профиля лежит в localStorage.
  const backToStartBtn = $('backToStartBtn');
  if(backToStartBtn){
    backToStartBtn.addEventListener('click', ()=>{
      SFX.uiClick();
      // В полном экране не перезагружаем страницу (иначе fullscreen слетает) —
      // сбрасываем состояние на месте. Вне fullscreen оставляем надёжный reload.
      if(fsElement()) returnToSplash();
      else location.reload();
    });
  }

  // ---------- Фаза 4: авторизация (гостевой режим по умолчанию) ----------
  function authNick(){ return (window.PotionAuth && window.PotionAuth.getNickname()) || LT(UI_TEXT.AUTH_GUEST_LABEL); }
  function refreshAuthUI(){
    const A = window.PotionAuth; if(!A) return;
    const nick = A.getNickname(), loggedIn = A.isLoggedIn();
    const sn = $('splashNick'); if(sn) sn.textContent = '👤 ' + nick;
    const lg = $('loginBtn'), rg = $('registerBtn'), lo = $('logoutBtn');
    if(lg) lg.classList.toggle('hidden', loggedIn);
    if(rg) rg.classList.toggle('hidden', loggedIn);
    if(lo) lo.classList.toggle('hidden', !loggedIn);
  }
  function updateNickBadge(){
    const badge = $('playerNickBadge'); if(!badge) return;
    const s = $('splashScreen');
    const splashGone = s && (s.style.display === 'none' || s.classList.contains('fade-out'));
    const show = !!splashGone && !isDailyMode;
    badge.classList.toggle('hidden', !show);
    if(show){ const t = $('playerNickText'); if(t) t.textContent = authNick(); }
  }
  let authMode = 'login';
  function setAuthMode(mode){
    authMode = mode;
    const isReg = mode === 'register';
    const tl = $('authTabLogin'), tr = $('authTabRegister');
    if(tl) tl.classList.toggle('active', !isReg);
    if(tr) tr.classList.toggle('active', isReg);
    const nf = $('authNick'); if(nf) nf.classList.toggle('hidden', !isReg);
    const sb = $('authSubmit'); if(sb) sb.textContent = LT(isReg ? UI_TEXT.AUTH_SUBMIT_REGISTER : UI_TEXT.AUTH_SUBMIT_LOGIN);
  }
  function openAuth(mode){
    setAuthMode(mode || 'login');
    const m = $('authMsg'); if(m){ m.textContent = ''; m.classList.remove('err'); }
    $('authOverlay').classList.add('show');
  }
  async function submitAuth(){
    const A = window.PotionAuth; if(!A) return;
    const login = $('authLogin').value.trim(), pw = $('authPassword').value, nick = $('authNick').value.trim();
    const msg = $('authMsg');
    if(!login || !pw){ if(msg){ msg.classList.add('err'); msg.textContent = LT(UI_TEXT.AUTH_NEED_FIELDS); } return; }
    A.setRememberDevice($('authRemember').checked);
    const res = authMode === 'register' ? await A.register(login, pw, nick) : await A.login(login, pw);
    if(res.ok){
      $('authOverlay').classList.remove('show'); refreshAuthUI(); updateNickBadge();
    } else if(res.reason === 'not_configured'){
      // Supabase ещё не подключён — играем гостем; если вписал ник, применим его
      if(authMode === 'register' && nick) A.setNickname(nick);
      if(msg){ msg.classList.remove('err'); msg.textContent = LT(UI_TEXT.AUTH_SOON); }
      refreshAuthUI(); updateNickBadge();
    } else if(msg){ msg.classList.add('err'); msg.textContent = res.message || LT(UI_TEXT.AUTH_SOON); }
  }
  function changeNick(){
    const A = window.PotionAuth; if(!A) return;
    const name = prompt(LT(UI_TEXT.AUTH_NICK_PROMPT), A.getNickname());
    if(name && A.setNickname(name)){ refreshAuthUI(); updateNickBadge(); }
  }
  (function wireAuth(){
    const on = (id, fn) => { const el = $(id); if(el) el.addEventListener('click', fn); };
    on('loginBtn', ()=>{ SFX.uiClick(); openAuth('login'); });
    on('registerBtn', ()=>{ SFX.uiClick(); openAuth('register'); });
    on('logoutBtn', ()=>{ SFX.uiClick(); window.PotionAuth.logout(); refreshAuthUI(); updateNickBadge(); });
    on('authTabLogin', ()=>{ SFX.uiClick(); setAuthMode('login'); });
    on('authTabRegister', ()=>{ SFX.uiClick(); setAuthMode('register'); });
    on('authSubmit', ()=>{ SFX.uiClick(); submitAuth(); });
    on('authCloseBtn', ()=>{ SFX.uiClick(); $('authOverlay').classList.remove('show'); });
    on('splashNick', ()=>{ SFX.uiClick(); changeNick(); });
    on('playerNickBadge', ()=>{ SFX.uiClick(); changeNick(); });
  })();

  if(window.PotionProfile) window.PotionProfile.load();
  // Фаза J: загрузка страницы = свежий цикл — счётчики "за цикл"
  // обнуляются, состав пассивок можно менять до первого заказа;
  // заодно выбрасываем из активных пассивки, переставшие быть открытыми
  if(window.PotionProfile){
    window.PotionProfile.startCycle();
    sanitizeActivePassives();
  }
  // Фаза H v2: (1) миграция старых одиночных ачивок на пороговые
  // (карта GENERAL_ACH_MIGRATION в content.js) — важно для "ручных",
  // которые нельзя пересчитать из статистики; (2) тихая догоняющая
  // синхронизация тиров — без тоста-спама при заходе
  if(window.PotionProfile && typeof GENERAL_ACHIEVEMENTS !== 'undefined'){
    const p = window.PotionProfile.data;
    const g = p.achievements.general || {};
    if(typeof GENERAL_ACH_MIGRATION !== 'undefined'){
      Object.keys(GENERAL_ACH_MIGRATION).forEach(oldId=>{
        if(!g[oldId]) return;
        const pair = GENERAL_ACH_MIGRATION[oldId];
        window.PotionProfile.setGeneralAchievementTier(pair[0], pair[1]);
        window.PotionProfile.removeGeneralAchievement(oldId);
      });
    }
    checkGeneralAchievements(true); // silent
  }
  applyI18n();
  refreshAuthUI(); // Фаза 4: заполнить ник/кнопки авторизации на сплэше
  // Фаза 4: восстановить онлайн-сессию (если «запомнить устройство») и подтянуть
  // кросс-девайс профиль — асинхронно, потом обновить ник в UI
  if(window.PotionAuth && window.PotionAuth.restore){
    window.PotionAuth.restore().then(()=>{ refreshAuthUI(); updateNickBadge(); }).catch(()=>{});
  }
  initSliders();
  updateStickerTally();
  showSelectScreen();
})();
