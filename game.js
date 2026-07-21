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
    badPop:    ()=>zzfx(.5,.2,140,.01,.05,.12,2,1.8,0,-10,-200,.15,0,0,0,0,0,.7,.02)
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
    wrap.addEventListener('pointerdown', e=>{
      if(wrap.classList.contains('disabled')) return;
      dragging = true;
      try{ wrap.setPointerCapture(e.pointerId); }catch(err){}
      setFromClientY(e.clientY);
      e.preventDefault();
    });
    wrap.addEventListener('pointermove', e=>{ if(dragging) setFromClientY(e.clientY); });
    window.addEventListener('pointerup', ()=>{ dragging = false; });
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
      setDisabled(d){ wrap.classList.toggle('disabled', !!d); },
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
  let target = null;
  let rafId = null;
  let craftLocked = false;
  let craftStartTime = 0;
  let ingTimerHandle = null;
  const stickerCounts = { perfect:0, good:0, bad:0 };

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
      if(halfSide === 'left'){
        const lo = cx-hw, hi = cx-halfGap-r;
        return hi > lo ? [lo, hi] : null;
      }
      if(halfSide === 'right'){
        const lo = cx+halfGap+r, hi = cx+hw;
        return hi > lo ? [lo, hi] : null;
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
    // Патч "УР.4": rotationDeg — эксклюзивный регулятор Сверхновой;
    // garnishPts — декоративные "гарниши" Шефа туманности (не считаются в count)
    // Патч "УР.4" (Двуликая жрица): splitHalves — банка на 2 половины, у
    // каждой свой независимый счётчик сгустков (bubbleCount — левая,
    // bubbleCountB — правая)
    const { hue, hue2=null, sat=70, sizePct, heightPct=null, bubbleCount, bubbleR, seed, shapeIdx=0,
            overridePositions=null, badBubbles=[], rotationDeg=null, garnishPts=null,
            splitHalves=false, bubbleCountB=0, showGrid=false } = opts;
    // несколько банок на экране одновременно (сетка Коллекционера) не должны
    // делить между собой id defs/clipPath — иначе все клипались бы по контуру первой
    const cJarClip = `${idPrefix}jarClip`, cInkDots = `${idPrefix}inkDots`,
          cInkDotsLight = `${idPrefix}inkDotsLight`, cGlassGrad = `${idPrefix}glassGrad`,
          cLiqGrad = `${idPrefix}liqGrad`;
    const w = 60 + (sizePct/100)*60;
    const h = 140 + ((heightPct ?? sizePct)/100)*70;
    const cx = 100, baseY = 240, topY = baseY - h;
    const sp = SHAPE_PROFILES[shapeIdx] || SHAPE_PROFILES[0];
    const bodyPath = jarOutlinePath(cx, topY, baseY, w, sp.points, sp.smooth);

    // Патч "УР.4" (Векс): сетка-ориентир внутри банки — подстраивается под
    // текущие w/h банки, чтобы игрок видел, куда возвращать сгустки
    let gridEls = '';
    if(showGrid){
      const gx0 = cx - w/2, gx1 = cx + w/2, gy0 = topY+40, gy1 = baseY;
      const cols = 4, rows = 5;
      for(let i=1;i<cols;i++){
        const gx = (gx0 + (gx1-gx0)*i/cols).toFixed(1);
        gridEls += `<line x1="${gx}" y1="${gy0.toFixed(1)}" x2="${gx}" y2="${gy1.toFixed(1)}" stroke="rgba(255,255,255,.28)" stroke-width="1"/>`;
      }
      for(let j=1;j<rows;j++){
        const gy = (gy0 + (gy1-gy0)*j/rows).toFixed(1);
        gridEls += `<line x1="${gx0.toFixed(1)}" y1="${gy}" x2="${gx1.toFixed(1)}" y2="${gy}" stroke="rgba(255,255,255,.28)" stroke-width="1"/>`;
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
        ...packBubbles(bubbleCountB, bubbleR, w, topY, baseY, sp.points, seed+7331, 'left'),
        ...packBubbles(bubbleCount, bubbleR, w, topY, baseY, sp.points, seed, 'right')
      ];
    } else {
      pts = packBubbles(bubbleCount, bubbleR, w, topY, baseY, sp.points, seed);
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

    // Патч "УР.4" (Шеф туманности): декоративные "гарниши" — почти как
    // настоящие сгустки, но чуть иначе поблёскивают (в count не входят)
    const garnishEls = (garnishPts||[]).map((p,i)=>{
      const r = p.r || bubbleR*0.85;
      return `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(r*1.5).toFixed(1)}" fill="rgba(255,217,138,.18)"/>
        <path d="${blobPath(p.x, p.y, r, seed+900+i*17)}" fill="rgba(255,217,138,.7)" stroke="#3a2607" stroke-width="2"/>
        <circle cx="${(p.x-r*0.2).toFixed(1)}" cy="${(p.y-r*0.2).toFixed(1)}" r="${(r*0.35).toFixed(1)}" fill="rgba(255,255,255,.9)"/>`;
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

    return `
      <defs>
        <clipPath id="${cJarClip}"><path d="${bodyPath}"/></clipPath>
        ${fillDef}
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
      <!-- tech cap: node + antenna, inked -->
      <line x1="${cx}" y1="${topY-22}" x2="${cx}" y2="${topY-6}" stroke="#0a0d18" stroke-width="5"/>
      <line x1="${cx}" y1="${topY-22}" x2="${cx}" y2="${topY-6}" stroke="#35e0ff" stroke-width="2"/>
      <circle cx="${cx}" cy="${topY-24}" r="4.5" fill="#ff4dd2" stroke="#0a0d18" stroke-width="1.8"/>
      <rect x="${cx-16}" y="${topY-8}" width="32" height="24" rx="5" fill="#0d1430" stroke="#0a0d18" stroke-width="4.5"/>
      <rect x="${cx-16}" y="${topY-8}" width="32" height="24" rx="5" fill="none" stroke="#35e0ff" stroke-width="1.6"/>
      <line x1="${cx-9}" y1="${topY+2}" x2="${cx+9}" y2="${topY+2}" stroke="rgba(53,224,255,.6)" stroke-width="1.5"/>
      <!-- neon halo (drawn first, widest) -->
      <path d="${bodyPath}" fill="none" stroke="rgba(53,224,255,.28)" stroke-width="8"/>
      <!-- container body -->
      <path d="${bodyPath}" fill="rgba(53,224,255,.05)"/>
      <g clip-path="url(#${cJarClip})">
        <rect x="${cx-w/2-6}" y="${topY+40}" width="${w+12}" height="${h}" fill="${fillRef}"/>
        <!-- liquid volume: dark side band + halftone shading on the right -->
        <rect x="${(cx+w*0.18).toFixed(1)}" y="${topY+40}" width="${(w*0.4).toFixed(1)}" height="${h}" fill="rgba(0,0,0,.16)"/>
        <rect x="${(cx+w*0.10).toFixed(1)}" y="${topY+40}" width="${(w*0.5).toFixed(1)}" height="${h}" fill="url(#${cInkDots})"/>
        <!-- light side: halftone highlight strip -->
        <rect x="${(cx-w/2).toFixed(1)}" y="${topY+40}" width="${(w*0.2).toFixed(1)}" height="${h}" fill="url(#${cInkDotsLight})"/>
        <!-- liquid surface: bold ink line + bright edge -->
        <rect x="${cx-w/2-6}" y="${topY+40}" width="${w+12}" height="3.2" fill="rgba(10,13,24,.85)"/>
        <rect x="${cx-w/2-6}" y="${topY+43}" width="${w+12}" height="5" fill="rgba(255,255,255,.30)"/>
        ${gridEls}
        ${blobShadows}
        ${bubbleEls}
        ${garnishEls}
        ${splitDividerEl}
      </g>
      <path d="${bodyPath}" fill="url(#${cGlassGrad})"/>
      <!-- thick manga ink outline with neon core -->
      <path d="${bodyPath}" fill="none" stroke="#0a0d18" stroke-width="5"/>
      <path d="${bodyPath}" fill="none" stroke="#35e0ff" stroke-width="1.8"/>
      ${badBubbleEls}
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
    const profile = SHAPE_PROFILES[target.shapeIdx||0].points;
    movingBubbles = makePhysicsBubbles(target.count, r, geom, profile, target.seed, target.moveSpeed);
    movingGeom = geom; movingProfile = profile; movingR = r; movingLastT = 0;
    function frame(t){
      if(!movingLastT) movingLastT = t;
      const dt = Math.min(0.05, (t-movingLastT)/1000); movingLastT = t;
      stepPhysics(movingBubbles, movingGeom, movingProfile, movingR, dt);
      drawJar({ hue:target.hue, hue2:null, sat:target.sat, sizePct:target.size, bubbleCount:0, bubbleR:movingR,
        shapeIdx: target.shapeIdx||0, seed: target.seed, overridePositions: movingBubbles });
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
  }
  function scheduleNextBadBubble(){
    nextBadBubbleSpawnAt = badBubbleElapsed + rand(BAD_BUBBLE_CONFIG.minSpawnMs, BAD_BUBBLE_CONFIG.maxSpawnMs);
  }
  function spawnBadBubble(){
    const geom = computeJarGeom(target.size);
    const profile = SHAPE_PROFILES[target.shapeIdx || 0].points;
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
  function badBubbleFrame(now){
    if(!target || target.regLevel !== 4 || currentPhase !== 'craft' || craftLocked){ badBubbleRafId = null; return; }
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
      if(!target || target.regLevel !== 4 || currentPhase !== 'craft' || craftLocked) return;
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

  function level4SetupOrder(){
    level4Active = (target.regLevel === 4) ? LEVEL4_FX[target.cfg.id] : null;
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
      const keys = [...(target.activeKeys||[])].filter(k => S[k]);
      target.tentacloidKey = keys.length ? pick(keys) : null;
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
  let l4TruckerReal = null, l4TruckerWidgets = null;
  const TRUCKER_LEFT_KEYS = ['color','colorB','sat']; // эти обычно живут в leftCol
  LEVEL4_FX.trucker_chrome = {
    memorizeStart(){
      $('windowFrame').classList.add('l4-shake');
    },
    craftStart(){
      // Патч: цвет/накал (спектр) больше не трогаем вообще — остаются
      // слева и выглядят как обычные ползунки. "Коробка передач" — только
      // у новых правых регуляторов (размер/сгустки/разм. сгуст.)
      const rightCol = $('rightCol');
      if(rightCol) rightCol.classList.add('l4-trucker-col');
      l4TruckerReal = {}; l4TruckerWidgets = {};
      [...target.activeKeys].filter(k => S[k] && L4_MOUNT_ID[k] && !TRUCKER_LEFT_KEYS.includes(k)).forEach(k=>{
        const mount = $(L4_MOUNT_ID[k]);
        if(!mount) return;
        l4TruckerReal[k] = S[k];
        S[k] = makeGearPathWidget(S[k], mount, k);
        l4TruckerWidgets[k] = S[k];
      });
      target.craftDuration += 6000;
      target.craftBaseDuration += 6000;
      updatePlayerJar();
    },
    stop(){
      $('windowFrame').classList.remove('l4-shake');
      const rightCol = $('rightCol');
      if(rightCol) rightCol.classList.remove('l4-trucker-col');
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
    btn.textContent = LT(UI_TEXT.INSPECTOR_TOL_BTN);
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      $('inspectorTolText').textContent = inspectorBuildText();
      $('inspectorTolOverlay').classList.add('show');
    });
    wf.appendChild(btn);
  }
  function l4InspectorHideTolBtn(){
    const el = document.getElementById('l4InspectorTolBtn'); if(el) el.remove();
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
  // Патч: сгустки теперь всегда упаковываются ВНУТРИ реального контура банки
  // (как обычные пузыри — через packBubbles/SHAPE_PROFILES), а не в грубом
  // прямоугольнике % от windowFrame — иначе на маленькой банке они вылезали
  // за стекло. Размер сгустка фиксирован (ползунок "Разм. сгуст." Вексу не нужен).
  const L4_VEX_BLOB_R = 9; // в единицах viewBox банки (0..200 x 0..260)
  let l4VexItems = [], l4VexIsCraft = false;
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
  function l4VexGeneratePositions(n){
    const geom = computeJarGeom(target.size);
    const profile = SHAPE_PROFILES[target.shapeIdx||0].points;
    const pts = packBubbles(n, L4_VEX_BLOB_R, geom.w, geom.topY, geom.baseY, profile, randInt(1,999999));
    return pts.map(p => l4VexViewBoxToWfPercent(p.x, p.y));
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
      item.x = Math.max(2, Math.min(98, (e.clientX-rect.left)/rect.width*100));
      item.y = Math.max(2, Math.min(98, (e.clientY-rect.top)/rect.height*100));
      el.style.left = item.x+'%'; el.style.top = item.y+'%';
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
      target.vexPositions = l4VexGeneratePositions(target.count);
    },
    memorizeStart(){
      l4VexIsCraft = false;
      l4VexItems = (target.vexPositions||[]).map(p=>({ x:p.x, y:p.y, dragging:false, el:null }));
      l4VexItems.forEach(item=>l4VexCreateEl(item));
      const wf = $('windowFrame');
      if(wf){
        let el = document.getElementById('l4VexLine');
        if(!el){ el = document.createElement('div'); el.id = 'l4VexLine'; el.className = 'l4-vex-line'; wf.appendChild(el); }
        el.textContent = LT(UI_TEXT.VEX_MEMORIZE_LINE);
      }
    },
    craftStart(){
      l4VexIsCraft = true;
      const el = document.getElementById('l4VexLine'); if(el) el.remove();
      // разлетаются внутри той же зоны — нужно вернуть каждый на своё место
      const scattered = l4VexGeneratePositions(l4VexItems.length);
      l4VexItems.forEach((item,i)=>{
        item.x = scattered[i].x; item.y = scattered[i].y; item.dragging = false;
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
  let l4ArchivistTimer = null, l4ArchivistKey = null;
  function archivistReseal(){
    if(!target || target.cfg.id !== 'archivist') return;
    if(l4ArchivistKey && S[l4ArchivistKey]){
      S[l4ArchivistKey].setDisabled(false);
      S[l4ArchivistKey].setFlag && S[l4ArchivistKey].setFlag('l4-sealed', false);
    }
    const keys = [...target.activeKeys].filter(k => S[k]);
    if(!keys.length) return;
    l4ArchivistKey = pick(keys);
    S[l4ArchivistKey].setDisabled(true);
    S[l4ArchivistKey].setFlag && S[l4ArchivistKey].setFlag('l4-sealed', true);
  }
  LEVEL4_FX.archivist = {
    craftStart(){
      l4ArchivistKey = null;
      archivistReseal();
      l4ArchivistTimer = setInterval(archivistReseal, 5000);
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
  function l4CollectorBuildJars(){
    const cfg = target.cfg;
    const jars = new Array(16);
    const correctIdx = randInt(0, 15);
    let decoyI = 0;
    for(let i=0;i<16;i++){
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
    },
    stop(){
      l4KaiTimers.forEach(clearTimeout); l4KaiTimers = [];
      if(l4KaiTimer){ clearInterval(l4KaiTimer); l4KaiTimer = null; }
      const el = document.getElementById('l4KaiCountdown');
      if(el) el.remove();
      l4KaiClearRingMarks();
      const jarSvg = $('jarSvg');
      if(jarSvg) jarSvg.classList.remove('l4-kai-shake-1','l4-kai-shake-2','l4-kai-shake-3');
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
      l4DjBeatTimer = setInterval(()=>{
        l4DjBeatCount++;
        l4DjKick();
        if(l4DjBeatCount % 2 === 0) l4DjHat();
        if(l4DjBeatCount % 4 === 2) l4DjBassBlip();
        l4DjPulseTargets().forEach(el=>{
          el.classList.remove('l4-dj-beat'); void el.offsetWidth; el.classList.add('l4-dj-beat');
        });
      }, L4_DJ_BEAT_MS);
    },
    stop(){
      if(l4DjBeatTimer){ clearInterval(l4DjBeatTimer); l4DjBeatTimer = null; }
      l4DjPulseTargets().forEach(el=> el.classList.remove('l4-dj-beat'));
    }
  };

  // ---------- Стажёр Бип: механика полностью заменена ----------
  // Патч: раньше — подсказка-пузырь и авто-сбитый регулятор. Теперь у Бипа
  // на УР.4 нет фазы запоминания и нет цели вообще ("принимает любой
  // коктейль") — вся логика (мгновенный старт крафта, рейтинг как среднее
  // трёх предыдущих визитов, бафф +33% на 3 следующих заказа) реализована
  // напрямую в startOrder()/finalizeResult(), регуляторы ни на что не влияют.
  LEVEL4_FX.intern_beep = {};

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

  // ---------- Парфюмер: цвет×накал одним 2D-пэдом вместо двух слайдеров ----------
  let l4PerfumerEl = null;
  LEVEL4_FX.perfumer = {
    craftStart(){
      $('colorGroupA') && $('colorGroupA').classList.add('l4-pad-hidden');
      $('satGroup') && $('satGroup').classList.add('l4-pad-hidden');
      const leftCol = $('leftCol');
      if(!leftCol) return;
      const wrap = document.createElement('div');
      wrap.className = 'vslider-group l4-perfumer-pad-group';
      wrap.innerHTML = `<div class="vslider-label">${LT(UI_TEXT.LABEL_SPECTRUM)} × ${LT(UI_TEXT.LABEL_SATURATION)}</div>
        <div class="l4-pad" id="l4PerfumerPad"><div class="l4-pad-cursor" id="l4PerfumerCursor"></div></div>`;
      leftCol.appendChild(wrap);
      l4PerfumerEl = wrap;
      const pad = wrap.querySelector('#l4PerfumerPad');
      const cursor = wrap.querySelector('#l4PerfumerCursor');
      pad.style.background = `linear-gradient(to right, rgba(30,32,50,.9), rgba(30,32,50,0)), ${RAINBOW_BG}`;
      function setFromXY(clientX, clientY){
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
      const px0 = S.sat.value/S.sat.max, py0 = 1-(S.color.value/S.color.max);
      cursor.style.left = (px0*100)+'%'; cursor.style.top = (py0*100)+'%';
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
      const start = performance.now();
      const dur = target.craftDuration || target.cfg.craftMs;
      l4ApothTimer = setInterval(()=>{
        const frac = Math.max(0, 1 - (performance.now()-start)/dur);
        l4ApothFrac = frac;
        const fill = document.getElementById('l4VitalsFill');
        if(fill) fill.style.height = (frac*100)+'%';
        const jarSvg = $('jarSvg');
        if(jarSvg) jarSvg.style.filter = `saturate(${(0.25+frac*0.75).toFixed(2)}) blur(${((1-frac)*2.2).toFixed(2)}px)`;
      }, 150);
    },
    stop(){
      if(l4ApothTimer){ clearInterval(l4ApothTimer); l4ApothTimer = null; }
      const bar = document.getElementById('l4VitalsBar'); if(bar) bar.remove();
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
  function l4FashionShuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }
  LEVEL4_FX.fashionista = {
    craftStart(){
      const keys = [...target.activeKeys].filter(k => S[k]);
      if(!keys.length) return;
      l4FashionOrder = l4FashionShuffle(keys);
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
  function l4FashionNextKey(){
    if(l4FashionOrder.length <= 1) return;
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

  // ---------- Шеф туманности: гарниши-обманки среди настоящих сгустков ----------
  // ---------- Дегустатор (Гурман с Веги): кнопка "Дегустировать" + доделка
  // зелья после первой "какашки" (см. finishCraft/finalizeResult) ----------
  LEVEL4_FX.gourmet_vega = {
    craftStart(){
      const btn = $('brewBtn');
      if(btn) btn.textContent = LT(UI_TEXT.TASTE_BTN);
    },
    stop(){
      const btn = $('brewBtn');
      if(btn) btn.textContent = LT(UI_TEXT.BREW_BTN);
      const el = document.getElementById('l4TasteNote'); if(el) el.remove();
    }
  };
  function l4TasteShowRetryNote(){
    const wf = $('windowFrame');
    if(!wf) return;
    let el = document.getElementById('l4TasteNote');
    if(!el){ el = document.createElement('div'); el.id = 'l4TasteNote'; el.className = 'l4-taste-note'; wf.appendChild(el); }
    el.textContent = LT(UI_TEXT.TASTE_RETRY_NOTE);
    SFX.badPop();
  }

  LEVEL4_FX.nebula_chef = {
    setup(){
      const n = randInt(2,3), pts = [];
      for(let i=0;i<n;i++) pts.push({ x:100+rand(-24,24), y:170+rand(-38,38), r:3+Math.random()*3.5 });
      target.garnishPts = pts;
    }
  };

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
    const profile = SHAPE_PROFILES[target.shapeIdx||0].points;
    function frame(t){
      if(!target || target.cfg.id !== 'plasma_bartender' || currentPhase !== 'craft'){ l4BarMoveRafId = null; return; }
      if(!l4BarMoveLastT) l4BarMoveLastT = t;
      const dt = Math.min(0.05, (t-l4BarMoveLastT)/1000); l4BarMoveLastT = t;
      const size = idxToVal(S.size.value, cfg.sizeSteps, 100);
      const bsize = idxToVal(S.bsize.value, cfg.bsizeSteps, 100);
      const geom = computeJarGeom(size);
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
        shapeIdx: target.shapeIdx||0, seed: target.seed, overridePositions: l4BarMoveBubbles });
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
  let l4FlyItems = [], l4FlySpawnTimeouts = [], l4FlyWalkTimer = null, l4FlyIsCraft = false;
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
    el.textContent = fly.symbol || '⚙️';
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
      l4JanitorSampleTimer = null, l4JanitorCleanFrac = 0;
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
  function l4JanitorWipeAt(canvas, clientX, clientY){
    const rect = canvas.getBoundingClientRect();
    if(!rect.width || !rect.height) return;
    const ctx = canvas.getContext('2d');
    const x = (clientX-rect.left) * (canvas.width/rect.width);
    const y = (clientY-rect.top) * (canvas.height/rect.height);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    // Патч: радиус протирки растёт вместе с курсором-тряпкой (2.5x, было 22)
    ctx.arc(x, y, 55, 0, Math.PI*2);
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
    // Патч "УР.4" (Векс): доп. компонент результата — положение сгустков
    if(cfg.id === 'vex' && level === 4) allKeys.push('vexPosition');
    const allSet = new Set(allKeys);
    // Патч "УР.4" (Векс): сгустки всегда одного размера и фиксированного
    // числа — "Сгустки"/"Разм. сгуст." ему не нужны ни на экране, ни в очках
    if(cfg.id === 'vex' && level === 4){ allSet.delete('count'); allSet.delete('bsize'); }
    // Патч "УР.4" (Хозяин Роя): детали — фиксированные иконки без размера,
    // "Разм. сгуст." тут нечего оценивать (счётчик "Сгустки" при этом остаётся —
    // он и есть механика "сколько деталей вернули в банку")
    if(cfg.id === 'swarm_navigator' && level === 4){ allSet.delete('bsize'); }

    if(level >= 3) return allSet;

    let base;
    if(focus){
      base = FOCUS_KEYS[focus].filter(k => allSet.has(k));
    } else if(cfg.type === 'gradient'){
      base = ['color','colorB'];
    } else if(cfg.type === 'shape'){
      base = ['shape','size'];
    } else if(cfg.type === 'moving'){
      base = ['count','bsize'];
    } else {
      base = ['color'];
    }
    const set1 = new Set(base);
    if(dual && set1.has('size')) set1.add('size2');
    if(level === 1) return set1;

    // level === 2: добавляем цвет, если его ещё нет; если он уже есть —
    // добавляем размер банки. Оттенок (sat) всегда идёт вместе с цветом.
    const set2 = new Set(set1);
    if(!set2.has('color')) set2.add('color');
    else set2.add('size');
    if(set2.has('color') && flags.hasSat) set2.add('sat');
    if(dual && set2.has('size')) set2.add('size2');
    return set2;
  }

  function computeFlags(cfg){
    return {
      hasGradient: cfg.type === 'gradient',
      hasShape: cfg.type === 'shape',
      hasSat: cfg.type !== 'gradient' && cfg.tier >= 4
    };
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
  function findRelation(idA, idB){
    if(typeof NPC_RELATIONS === 'undefined') return null;
    return NPC_RELATIONS.find(r => (r.a===idA && r.b===idB) || (r.a===idB && r.b===idA)) || null;
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

  function seedFromDate(d){
    return ((d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate()) >>> 0);
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
    dayNum = 1; score = 0; streak = 0; stage = 0; perfectStreakAtMax = 0; goodStreakAtMax = 0;
    $('scoreVal').textContent = score;
    $('streakVal').textContent = streak;
    $('dayVal').textContent = dayNum;
    if(typeof loadDailyYesterdayTop === 'function') loadDailyYesterdayTop();
    showSelectScreen();
  }

  function pickConfigForTier(tierNum, usedNames){
    const pool = tierNum < 5 ? tierPool(tierNum) : [...tierPool(5), ...SPECIAL_ORDERS];
    // Патч "Взаимоотношения": НПС, который "ушёл" из-за обиды, не выпадает
    // до конца цикла — если это оставит пул пустым, лучше не блокировать
    // генерацию тройки вовсе, чем сломать раунд
    const notLeft = pool.filter(c => !isRelationLeftCycle(c.id));
    const basePool = notLeft.length ? notLeft : pool;
    const fresh = basePool.filter(c => !usedNames.has(c.name));
    const cfg = pick(fresh.length ? fresh : basePool);
    usedNames.add(cfg.name);
    return cfg;
  }

  // build a full order descriptor: cfg + focus + matching flavor line
  function buildOrderDescriptor(cfg){
    let focus = null;
    // Патч (Тентаклоид): у него никогда не бывает обычных модификаторов —
    // его собственная механика (один скрытый решающий параметр) их заменяет
    if(cfg.type === 'normal' && cfg.tier >= 2 && cfg.id !== 'tentacloid' && Math.random() < 0.4){
      focus = pick(['bubbles','color','size']);
    }
    // Фаза I: иногда вместо обычной реплики — уже открытая лорная фраза
    // (подсвечивается другим цветом). НЕ на фокус-заказах: там реплика
    // несёт игровую информацию и заменять её нельзя.
    let flavor = null, isLore = false;
    // Патч "Ежедневный заказ": лорные фразы разблокируются достижениями
    // аркадного профиля — в дневном режиме их не подмешиваем вовсе
    if(!isDailyMode && !focus && window.PotionProfile && typeof NPC_LORE !== 'undefined' && NPC_LORE[cfg.id]){
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
    return { cfg, focus, flavor, avatar, isLore };
  }

  // cached so a language switch can re-render the same cards without rerolling them
  let currentOrders = [];

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
          <div class="icon-name-reveal"><span>${npcNameStr}</span></div>
        </div>
        <div class="plaque-stack">
          <div class="plaque-quote">
            <div class="quote${isLore ? ' lore' : ''}">«${LT(flavor)}»</div>
            ${focus
              ? `<div class="focus-chip">${visualHTML(FOCUS_ICONS[focus],'focus-img')}<span>${LT(FOCUS_NAMES[focus])}</span></div>`
              : `<div class="focus-chip no-focus"><span class="no-focus-icon">✕</span><span>${LT(UI_TEXT.NO_FOCUS_LABEL)}</span></div>`}
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
          const st = relationState(cfg.id);
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
  // Патч "УР.4" (Стажёр Бип): точность последних 3 закрытых заказов (любых
  // НПС) — его собственный рейтинг считается как их среднее. beepBuffRemaining —
  // сколько ещё СЛЕДУЮЩИХ заказов (любых НПС) получают +33% к рейтингу,
  // выданные Бипом за визит без истории.
  let orderAccuracyHistory = [];
  let beepBuffRemaining = 0;
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
    $('dayVal').textContent = dayNum;

    // Патч "Ежедневный заказ": пул на день — фиксированная (по сиду дня)
    // тройка персонажей, а не случайные тиры прогрессии
    if(isDailyMode){
      currentOrders = dailyPoolForDay(dayNum-1).map(cfg => buildOrderDescriptor(cfg));
      renderSelectBanners();
      renderCustomerCards(currentOrders);
      return;
    }

    const tiers = getCardTiers();
    const usedNames = new Set();
    currentOrders = tiers.map(t=> buildOrderDescriptor(pickConfigForTier(t, usedNames)));

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
        chosen.focus = null; // печать заменяет реплику — фокус снимается, чтобы не терять игровую информацию
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
    stopMovingAnim();
    stopBadBubbles(); // сбрасываем "плохие" пузыри прошлого заказа, если были
    stopMatrixRain();      // Патч: дождь символов прошлого заказа
    level4Stop();           // Патч: механика УР.4 прошлого заказа, если была
    $('windowFrame').classList.remove('ir-mono');
    $('selectScreen').classList.remove('show');
    $('roundScreen').classList.add('show');
    $('orderNum').textContent = orderNum;
    $('orderAvatar').innerHTML = visualHTML(avatar,'npc-img');
    $('orderText').textContent = LT(flavor);
    $('orderText').classList.toggle('lore', !!ord.isLore); // Фаза I: лор — другим цветом
    $('orderText').classList.toggle('keeper', !!ord.isKeeper); // Патч: фраза Хранителя — золотом
    $('orderBubble').style.borderLeftColor = TIER_COLORS[cfg.tier];
    $('orderFocusTag').innerHTML = focus ? `${visualHTML(FOCUS_ICONS[focus],'focus-img')} ${LT(UI_TEXT.FOCUS_PREFIX)} ${LT(FOCUS_NAMES[focus])}` : '';
    const levelTag = $('orderLevelTag');
    if(levelTag) levelTag.textContent = LT(UI_TEXT.DIFF_BTN_LABEL) + regLevel;
    SFX.orderShow();

    const flags = computeFlags(cfg);
    // Патч "УР.4" (Парфюмер): на УР.4 у него появляется "накал" — обычно
    // недоступен тир-3 НПС (флаг требует tier>=4) — это его личное исключение
    if(cfg.id === 'perfumer' && regLevel === 4) flags.hasSat = true;
    const hueIdx = randInt(0, cfg.colorSteps-1);
    const sizeIdx = randInt(0, cfg.sizeSteps-1);
    let bsizeIdx = randInt(0, cfg.bsizeSteps-1);
    let count = randInt(1, cfg.countMax);
    // Патч (Шеф туманности): число сгустков выше 5 выпадает СИЛЬНО чаще
    if(cfg.countBias === 'high' && cfg.countMax > 5){
      count = Math.random() < 0.82 ? randInt(6, cfg.countMax) : randInt(1, 5);
    }
    // Патч "УР.4" (Векс): сгустков всегда 4-7, размер — средний (никогда
    // не самый большой и не самый маленький — их удобно хватать и таскать)
    if(cfg.id === 'vex' && regLevel === 4){
      count = randInt(4, 7);
      const bLo = Math.round(cfg.bsizeSteps*0.35), bHi = Math.round(cfg.bsizeSteps*0.7);
      bsizeIdx = randInt(Math.max(0,bLo), Math.min(cfg.bsizeSteps-1, Math.max(bLo,bHi)));
    }

    target = {
      cfg, type: cfg.type, flags, focus, regLevel,
      hue: idxToVal(hueIdx, cfg.colorSteps, 360), hueIdx,
      size: idxToVal(sizeIdx, cfg.sizeSteps, 100), sizeIdx,
      bsize: idxToVal(bsizeIdx, cfg.bsizeSteps, 100), bsizeIdx,
      count,
      sat: 70,
      seed: randInt(1,99999)
    };
    if(flags.hasGradient){
      // Патч (Двуликая жрица): оба оттенка очень редко совпадают —
      // при совпадении переигрываем второй спектр (кроме редких ~5%)
      let hue2Idx = randInt(0, cfg.colorSteps-1);
      if(cfg.colorSteps > 1 && hue2Idx === hueIdx && Math.random() > 0.05){
        let guard = 12;
        while(hue2Idx === hueIdx && guard-- > 0) hue2Idx = randInt(0, cfg.colorSteps-1);
      }
      target.hue2 = idxToVal(hue2Idx, cfg.colorSteps, 360);
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
    if(flags.hasSat){
      const satIdx = randInt(0,9);
      target.sat = satFromIdx(satIdx);
      target.satIdx = satIdx;
    }
    if(cfg.type === 'moving'){
      target.count = randInt(5, Math.max(5,cfg.countMax));
      target.moveSpeed = randInt(45, 95);
    }

    // считаем доступные регуляторы уже сейчас (а не только в начале фазы
    // "воссоздай") — чтобы фаза показа тоже не рисовала сгустки, которых
    // на этой сложности всё равно не будет в задании
    target.activeKeys = computeActiveKeys(regLevel, target);
    level4SetupOrder(); // Патч "УР.4": рандомизация своих полей target для этого НПС
    const noBubblesPreview = !target.activeKeys.has('count') && !target.activeKeys.has('bsize');

    const targetR = 3 + (target.bsize/100)*9;
    // Патч "УР.4" (Хозяин Роя): мухи рисуются отдельными DOM-элементами,
    // а не SVG-пузырьками — банка всегда пустая по count для него
    const isFlySwarm = cfg.id === 'swarm_navigator' && regLevel === 4;
    // Патч "УР.4" (Двуликая жрица): банка разделена на 2 половины со своими
    // независимыми счётчиками сгустков
    const isTwofacedSplit = cfg.id === 'twofaced_priestess' && regLevel === 4;
    // Патч "УР.4" (Векс): сгустки — отдельные перетаскиваемые DOM-элементы,
    // а не SVG-пузырьки — банка всегда пустая по count для него
    const isVexDrag = cfg.id === 'vex' && regLevel === 4;
    if(cfg.type === 'moving'){
      startMovingAnim();
    } else {
      drawJar({ hue:target.hue, hue2: target.hue2 ?? null, sat:target.sat, sizePct:target.size,
        heightPct: target.size2 ?? null,
        bubbleCount: (isFlySwarm || isVexDrag) ? 0 : (noBubblesPreview ? 0 : target.count),
        bubbleR:targetR, seed:target.seed, shapeIdx: target.shapeIdx ?? 0,
        splitHalves: isTwofacedSplit, bubbleCountB: isTwofacedSplit ? (target.countB||0) : 0,
        showGrid: isVexDrag });
    }

    $('fog').classList.remove('show');
    $('panel').classList.remove('show');
    $('panel').classList.remove('locked');
    $('leftCol').classList.remove('show');
    $('rightCol').classList.remove('show');
    currentPhase = 'scan';
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
    const memDuration = Math.round(cfg.memorizeMs * (1 + (target.passiveFx.memTime || 0))) + janitorL4Bonus + fashionistaL4Bonus;
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
    } else if(cfg.id === 'intern_beep' && regLevel === 4){
      // Патч "УР.4" (Стажёр Бип): фазы запоминания нет вообще — он "принимает
      // любой коктейль", играть начинаем мгновенно
      stopMovingAnim();
      startGuessPhase();
    } else if(cfg.id === 'guild_inspector' && regLevel === 4){
      // Патч "УР.4" (Инспектор Гильдии): фазы показа "запрещённого образца"
      // больше нет — сразу лист "Допусков" с текстом (таймер там же удвоен)
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

    // сброс визуальных флагов патча с прошлого раунда
    Object.values(S).forEach(s=>{ if(s.setFlag){ s.setFlag('ir-gift', false); } });
    S.color.setTrackBackground(RAINBOW_BG);
    S.colorB.setTrackBackground(RAINBOW_BG);

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
    let craftDuration = Math.round(cfg.craftMs * (1 + (pfx.craftTime || 0)))
      + (target.regLevel === 4 ? (typeof LEVEL4_TIME_BONUS_MS !== 'undefined' ? LEVEL4_TIME_BONUS_MS : 0) : 0);
    // Патч (Ир): подаренные / украденные секунды
    // Патч (усилено): +4с / -2с вместо +2с / -1с
    if(irFx && irFx.id === 'time_plus') craftDuration += 4000;
    if(irFx && irFx.id === 'time_minus') craftDuration = Math.max(1500, craftDuration - 2000);
    // Патч "УР.4" (Тот-Кто-Ждёт): дар "вдвое медленнее" — на СЛЕДУЮЩИЙ заказ
    if(target.waiterSlowBuff) craftDuration *= 2;
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

    // запускаем "плохие" пузыри только у дрона на 4-ом уровне — у остальных
    // НПС на УР.4 теперь свои уникальные механики (см. LEVEL4_FX ниже)
    if(target.regLevel === 4 && cfg.id === 'drone'){
      badBubbleElapsed = 0;
      badBubbles = [];
      currentBadBubbles = [];
      badBubbleLastT = 0;
      scheduleNextBadBubble();
      badBubbleRafId = requestAnimationFrame(badBubbleFrame);
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
      slider.setDiffLocked(!isActive);
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
    $('lblColor').textContent = Math.round(hue) + '°';
    $('lblSize').textContent = Math.round(size) + '%';
    $('lblCount').textContent = count;
    $('lblBsize').textContent = Math.round(bsize) + '%';
    const r = 3 + (bsize/100)*9;
    // если и число, и размер сгустков недоступны на текущей сложности —
    // игра вообще их не генерирует (нечего показывать/угадывать)
    const noBubbles = target.activeKeys && !target.activeKeys.has('count') && !target.activeKeys.has('bsize');
    const isFlySwarm = cfg.id === 'swarm_navigator' && target.regLevel === 4;
    const isVexDrag = cfg.id === 'vex' && target.regLevel === 4;
    const effCount = (noBubbles || isFlySwarm || isVexDrag) ? 0 : count;
    drawJar({ hue, hue2, sat, sizePct:size, heightPct, bubbleCount:effCount, bubbleR:r, shapeIdx,
      rotationDeg, garnishPts: target.garnishPts || null,
      splitHalves: isTwofacedSplit, bubbleCountB: isTwofacedSplit ? S.countB.value : 0,
      seed: target.seed + 5000 + count*7 + Math.round(r*13), badBubbles: currentBadBubbles,
      showGrid: isVexDrag });
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
    if(cfg.id === 'vex' && target.regLevel === 4 && target.vexPositions && target.vexFinalPositions && target.vexFinalPositions.length){
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

    // сложность регуляторов (Фаза C): недоступные игроку регуляторы не
    // участвуют в подсчёте очков — веса оставшихся нормализуются к 1
    if(target.activeKeys){
      components = components.filter(c => target.activeKeys.has(c.key));
      const totalGate = components.reduce((s,c)=>s+c.weight,0) || 1;
      components.forEach(c=>{ c.weight /= totalGate; });
    }
    // Патч "УР.4" (Тентаклоид): считает ТОЛЬКО один (случайный, скрытый до
    // конца раунда) параметр — остальные полностью игнорируются, что бы
    // игрок с ними ни сделал (даже если бы они были идеальны или ужасны)
    if(cfg.id === 'tentacloid' && target.regLevel === 4 && target.tentacloidKey){
      const hasKey = components.some(c => c.key === target.tentacloidKey);
      if(hasKey) components.forEach(c=>{
        const isIt = c.key === target.tentacloidKey;
        c.weight = isIt ? 1 : 0;
        if(isIt) c.decisive = true; // подсветка в разбивке результата — "вот на что он смотрел"
      });
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
    if(target.cfg.id === 'gourmet_vega' && target.regLevel === 4 && !target.l4TasteFirstBad){
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

    const scoreData = computeScoreComponents();
    const elapsed = performance.now() - craftStartTime;
    // Патч (Тот-Кто-Ждёт): timeFrac считаем от БАЗОВОЙ длительности —
    // докупленные секунды не должны раздувать бонус за скорость
    const craftDuration = target.craftBaseDuration || target.craftDuration || scoreData.cfg.craftMs;
    const timeFrac = Math.min(1, elapsed/craftDuration);
    finalizeResult(scoreData, timeFrac);
  }

  function finalizeResult(scoreData, timeFrac){
    let { cfg, overall, components } = scoreData;
    const rawOverall = overall; // до подмены Бипом — идёт в историю точности
    // Патч "УР.4" (Стажёр Бип): ему неважно, что накрутил игрок — свой
    // рейтинг он определяет средней точностью трёх ПРЕДЫДУЩИХ посетителей.
    // Если истории меньше трёх — просто принимает коктейль без рейтинга и
    // дарит бафф (+33% рейтинга) на трёх следующих посетителей.
    const beepBuffActiveNow = beepBuffRemaining > 0;
    let beepNoHistory = false;
    if(cfg.id === 'intern_beep' && target.regLevel === 4){
      if(orderAccuracyHistory.length >= 3){
        overall = orderAccuracyHistory.slice(-3).reduce((a,b)=>a+b,0)/3;
      } else {
        beepNoHistory = true;
      }
    }
    // Патч "УР.4" (Инспектор Гильдии): реальная цель — числа из листа
    // "Допуски" (нет больше показанного образца, который надо избегать —
    // фазы показа для него нет вообще). Результат = доля параметров,
    // попавших в допуск ±N.
    if(cfg.id === 'guild_inspector' && target.regLevel === 4 && target.inspectorTarget){
      const keys = inspectorActiveKeys();
      const tol = target.inspectorTolerance || 2;
      let missed = 0;
      keys.forEach(k=>{
        const val = S[k].value;
        if(Math.abs(val - target.inspectorTarget[k]) > tol) missed++;
      });
      overall = missed === 0 ? 1 : Math.max(0.80, 0.94 - missed*0.03);
    }
    // Патч "УР.4" (Коллекционер): бинарный результат — попал в правильную
    // баночку из 16 (идеал) или нет (худший результат), никаких полутонов
    if(cfg.id === 'collector_gz' && target.regLevel === 4){
      overall = target.collectorChoiceCorrect ? 1 : 0;
    }
    const overallPct = Math.round(overall*100);
    const goodThreshold = cfg.tier >= 5 ? 0.85 : 0.8;
    const perfectThreshold = cfg.tier >= 5 ? 0.97 : 0.95;
    const good = overall >= goodThreshold;
    const perfect = overall >= perfectThreshold;

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
    const timeFactor = timeFrac <= third ? 1 : Math.max(0, 1 - (timeFrac - third)/(1 - third));
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
    if(cfg.id === 'gourmet_vega' && target.regLevel === 4){
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
    if(cfg.id === 'guild_inspector' && target.regLevel === 4 && good){
      delta = Math.round(effReward * overall * 1.5);
    }
    // Патч "УР.4" (Стажёр Бип): бафф "+33% рейтинга" за визит без истории —
    // действует на этот (любой) заказ, если ещё не исчерпан, ДО того как
    // сам Бип, возможно, выдаст новый бафф за СВОЙ заказ без истории
    if(beepBuffActiveNow){
      delta = Math.round(delta * 1.33);
      beepBuffRemaining = Math.max(0, beepBuffRemaining - 1);
    }
    if(cfg.id === 'intern_beep' && target.regLevel === 4 && beepNoHistory){
      delta = 0;
      beepBuffRemaining = 3;
    }
    // история точности — по НЕПОДМЕНЁННОЙ реальной точности этого заказа,
    // нужна для рейтинга следующих визитов Бипа
    orderAccuracyHistory.push(rawOverall);
    if(orderAccuracyHistory.length > 3) orderAccuracyHistory.shift();
    // Патч "Ежедневный заказ": репутации тут нет вовсе — бонус к рейтингу
    // (ratingMultAdd/waiterThresholdOverride выше) остаётся, а repBonus молча игнорируется
    if(!isDailyMode && l4Bonus.repBonus && good && window.PotionProfile) window.PotionProfile.adjustReputation(cfg.id, l4Bonus.repBonus);
    score = Math.max(0, score + delta);
    $('scoreVal').textContent = score;
    $('streakVal').textContent = streak;

    if(perfect) stickerCounts.perfect++; else if(good) stickerCounts.good++; else stickerCounts.bad++;
    updateStickerTally();

    if(!good){
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
    // Патч "Ежедневный заказ": ни друзей, ни врагов, ни обид тут нет
    const offendedSt = isDailyMode ? null : relationState(cfg.id);
    const forcedBad = !!(offendedSt && offendedSt.offended);
    const effGood = forcedBad ? false : good;
    const effPerfect = forcedBad ? false : perfect;

    // Фаза G: фиксируем КОНКРЕТНЫЙ вариант стикера один раз здесь (а не
    // внутри visualHTML), чтобы одно и то же значение ушло и на экран
    // результата, и в profile.stats.stickersSeen для альбома в Коллекции.
    // Патч: особые стикеры выпадают ТОЛЬКО по своим условиям (см.
    // STICKER_SPECIALS в content.js); обычные — случайно из "базовых".
    const stickerCat = effPerfect ? 'perfect' : effGood ? 'good' : 'bad';
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
        perfect, good, overall, components, target, timeFrac,
        autoFinish: !!target.autoFinish,
        scoreAfter: score, dayNum,
        perfectRun: perfectRunNow, goodRun: goodRunNow, badRunBefore,
        perfectThreshold, novaExact
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
        npcId: cfg.id, perfect, good, delta, stickerCat, stickerIdx, progressWeight,
        regLevel: target.regLevel, focus: target.focus,
        fastThird: timeFrac <= 1/3,
        repMult: 1 + (pfx.rep || 0)
      });
      if(repRes) maybeRepLevelUp(cfg.id, repRes.repBefore, repRes.repAfter);
      // Патч "Взаимоотношения": обиженный НПС не ценит даже настоящий успех —
      // репутация всё равно немного проседает, поверх обычного расчёта выше
      if(forcedBad) window.PotionProfile.adjustReputation(cfg.id, -2);
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

    // ---------- Дегустатор: реплика на каждый из 4 исходов дегустации ----------
    if(cfg.id === 'gourmet_vega' && target.regLevel === 4){
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
    lastResult = { perfect, good, delta, speedBonusPct, overallPct, components, focus: target.focus };

    $('stickerEmoji').innerHTML = visualHTML(stickerVal, 'sticker-img');
    $('resultTitle').textContent = LT(perfect ? UI_TEXT.RESULT_PERFECT : good ? UI_TEXT.RESULT_GOOD : UI_TEXT.RESULT_BAD);
    $('resultTitle').className = 'result-title ' + (good ? 'good' : 'bad');
    $('deltaVal').textContent = (delta>=0?'+':'') + delta;
    $('deltaVal').className = 'delta ' + (good ? 'good' : 'bad');
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
    if(dayNum >= 10){
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

  // ---------- global leaderboard ----------
  // URL базы задаётся в content.js -> CONFIG.FIREBASE_DB_URL
  const FIREBASE_DB_URL = (typeof CONFIG !== 'undefined' && CONFIG.FIREBASE_DB_URL) || '';
  const LOCAL_LB_KEY = 'potionshop_leaderboard_v1';

  // boardKey — необязательный { local, remote }; без него — обычный
  // аркадный общий рейтинг (как и раньше). Дневной режим передаёт свой ключ.
  async function loadLeaderboard(boardKey){
    const localKey = boardKey ? boardKey.local : LOCAL_LB_KEY;
    const remotePath = boardKey ? boardKey.remote : 'leaderboard';
    if(FIREBASE_DB_URL){
      try{
        const res = await fetch(FIREBASE_DB_URL + '/' + remotePath + '.json');
        const data = await res.json();
        // база может ответить 200 с телом {error:"Permission denied"} (например,
        // если правила базы разрешают только путь /leaderboard) — это НЕ валидный
        // список записей, нужно явно отличать от настоящих данных
        if(res.ok && data && typeof data === 'object' && !data.error) return Object.values(data);
      }catch(e){ /* fall through to local */ }
    }
    try{ return JSON.parse(localStorage.getItem(localKey) || '[]'); }
    catch(e){ return []; }
  }
  async function saveLeaderboardEntry(name, finalScore, boardKey){
    const localKey = boardKey ? boardKey.local : LOCAL_LB_KEY;
    const remotePath = boardKey ? boardKey.remote : 'leaderboard';
    const entry = { name: name || LT(UI_TEXT.ANONYMOUS), score: finalScore, date: new Date().toLocaleDateString(LANG === 'ru' ? 'ru-RU' : 'en-US') };
    if(FIREBASE_DB_URL){
      try{
        // POST appends a new child with a unique key — never overwrites existing entries
        const res = await fetch(FIREBASE_DB_URL + '/' + remotePath + '.json', { method:'POST', body: JSON.stringify(entry) });
        const data = await res.json();
        if(res.ok && data && !data.error) return await loadLeaderboard(boardKey);
        // если база отказала (напр. правила не разрешают этот путь) — не теряем
        // результат молча, падаем в локальное сохранение ниже
      }catch(e){ /* fall through to local */ }
    }
    let list = [];
    try{ list = JSON.parse(localStorage.getItem(localKey) || '[]'); }catch(e){}
    list.push(entry);
    list.sort((a,b)=>b.score-a.score);
    localStorage.setItem(localKey, JSON.stringify(list.slice(0,50)));
    return list;
  }
  // ---------- Патч "Ежедневный заказ": свой рейтинг на (сложность, дата) ----------
  function dateStrFor(d){
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  }
  function dailyBoardKey(diffKey, d){
    const ds = dateStrFor(d);
    return { local: `potionshop_daily_${diffKey}_${ds}`, remote: `daily/${diffKey}/${ds}` };
  }
  function currentDailyBoardKey(){ return dailyBoardKey(dailyDifficulty, new Date()); }
  function yesterdayDailyBoardKey(){
    const y = new Date(); y.setDate(y.getDate()-1);
    return dailyBoardKey(dailyDifficulty, y);
  }
  async function loadDailyYesterdayTop(){
    const host = $('dailyYesterdayTop');
    if(!host) return;
    const list = await loadLeaderboard(yesterdayDailyBoardKey());
    const top3 = [...list].sort((a,b)=>b.score-a.score).slice(0,3);
    if(!top3.length){ host.classList.add('hidden'); host.innerHTML = ''; return; }
    host.classList.remove('hidden');
    host.innerHTML = `<div class="dyt-title">${LT(UI_TEXT.DAILY_YESTERDAY_TITLE)}</div>` +
      top3.map((e,i)=>`<div class="dyt-row"><span><span class="dyt-rank">${i+1}.</span>${escapeHtml(e.name)}</span><span>${e.score}</span></div>`).join('');
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
    const fx = { score:0, craftTime:0, memTime:0, speedCap:0, rep:0, progress:0 };
    sanitizeActivePassives().forEach(a=>{
      const def = passiveDefs(a.npcId).find(pv=>pv.id===a.passiveId);
      if(!def) return;
      if(def.scope === 'npc' && a.npcId !== npcId) return;
      Object.keys(def.fx||{}).forEach(k=>{ if(fx[k] !== undefined) fx[k] += def.fx[k]; });
    });
    return fx;
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
    const npcs = (typeof ALL_NPCS !== 'undefined') ? ALL_NPCS : [];
    if(charDetailId && !npcs.some(n=>n.id===charDetailId)) charDetailId = null;

    if(!charDetailId){
      // ---------- режим списка ----------
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
    const seen = (st.stickersSeen) || { perfect:[], good:[], bad:[] };
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
      checkGeneralAchievements();
    }
    $('resultOverlay').classList.remove('show');
    $('finalScoreVal').textContent = score;
    $('nameInput').value = '';
    const list = await loadLeaderboard(isDailyMode ? currentDailyBoardKey() : undefined);
    renderLeaderboard(list, null, 'leaderboardList');
    $('weekOverlay').classList.add('show');
  }
  $('saveScoreBtn').addEventListener('click', async ()=>{
    SFX.uiClick();
    const name = $('nameInput').value.trim().slice(0,20);
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
    dayNum = 1; score = 0; streak = 0; stage = 0; perfectStreakAtMax = 0; goodStreakAtMax = 0;
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
      $('orderFocusTag').innerHTML = currentOrd.focus
        ? `${visualHTML(FOCUS_ICONS[currentOrd.focus],'focus-img')} ${LT(UI_TEXT.FOCUS_PREFIX)} ${LT(FOCUS_NAMES[currentOrd.focus])}`
        : '';
      const levelTag = $('orderLevelTag');
      if(levelTag && currentOrd.regLevel) levelTag.textContent = LT(UI_TEXT.DIFF_BTN_LABEL) + currentOrd.regLevel;
      $('phaseLabel').textContent = currentPhase === 'craft' ? LT(UI_TEXT.PHASE_CRAFT) : LT(UI_TEXT.PHASE_SCAN);
      $('colorLabelA').textContent = LT(target.flags.hasGradient ? UI_TEXT.LABEL_SPECTRUM_A : UI_TEXT.LABEL_SPECTRUM);
      if(target.flags.hasShape) $('lblShape').textContent = LT(SHAPE_NAMES[S.shape.value]);
    }
    if($('resultOverlay').classList.contains('show') && lastResult){
      const { perfect, good, delta, speedBonusPct, overallPct, components, focus } = lastResult;
      $('resultTitle').textContent = LT(perfect ? UI_TEXT.RESULT_PERFECT : good ? UI_TEXT.RESULT_GOOD : UI_TEXT.RESULT_BAD);
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
  function toggleLanguage(){
    SFX.uiClick();
    LANG = LANG === 'ru' ? 'en' : 'ru';
    localStorage.setItem(LANG_KEY, LANG);
    applyI18n();
    refreshVisibleScreen();
  }
  const langBtn = $('langBtn');
  if(langBtn) langBtn.addEventListener('click', toggleLanguage);
  // Патч "Ежедневный заказ": та же кнопка языка, но прямо на сплэше
  const splashLangBtn = $('splashLangBtn');
  if(splashLangBtn) splashLangBtn.addEventListener('click', toggleLanguage);

  function dismissSplash(){
    const s = $('splashScreen');
    s.classList.add('fade-out');
    s.addEventListener('transitionend', ()=>{ s.style.display='none'; }, {once:true});
  }
  // ---------- стартовый экран: кнопка "Пришвартоваться" (обычная аркада) ----------
  const dockBtn = $('dockBtn');
  if(dockBtn){
    dockBtn.addEventListener('click', ()=>{
      SFX.dock();
      ambientTryPlay();
      dismissSplash();
    }, {once:true});
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
      location.reload();
    });
  }

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
  initSliders();
  updateStickerTally();
  showSelectScreen();
})();
