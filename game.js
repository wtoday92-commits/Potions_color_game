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
    dock:      ()=>zzfx(.5,.05,180,.02,.1,.22,0,1.3,0,-40,80,.05,0,0,0,0,0,.8,.02)
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
      if(raw !== _value){ _value = raw; render(); SFX.tick(); if(onChange) onChange(_value); }
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
      configure({min,max,step,value}){ _min=min; _max=max; _step=step||1; _value=value; render(); },
      setDisabled(d){ wrap.classList.toggle('disabled', !!d); },
      // отдельный "серый и перечёркнутый" вид для регулятора, недоступного
      // на текущей сложности (отличается от .disabled — блокировки после варки)
      setDiffLocked(d){ wrap.classList.toggle('diff-locked', !!d); },
      setTrackBackground(css){ track.style.background = css; }
    };
  }

  const S = {};
  function initSliders(){
    S.color = VSlider({ mount:$('mColor'), min:0,max:5,step:1,value:2, thickness:32, thumbSize:38, colorStrip:true, staticBackground:RAINBOW_BG, onChange:updatePlayerJar });
    S.colorB = VSlider({ mount:$('mColorB'), min:0,max:5,step:1,value:2, thickness:32, thumbSize:38, colorStrip:true, staticBackground:RAINBOW_BG, onChange:updatePlayerJar });
    S.sat = VSlider({ mount:$('mSat'), min:0,max:9,step:1,value:7, thickness:32, thumbSize:38, colorStrip:true, onChange:updatePlayerJar });
    S.size = VSlider({ mount:$('mSize'), min:0,max:4,step:1,value:2, thickness:26, thumbSize:32, onChange:updatePlayerJar });
    S.count = VSlider({ mount:$('mCount'), min:1,max:5,step:1,value:3, thickness:26, thumbSize:32, onChange:updatePlayerJar });
    S.bsize = VSlider({ mount:$('mBsize'), min:0,max:4,step:1,value:2, thickness:26, thumbSize:32, onChange:updatePlayerJar });
    S.shape = VSlider({ mount:$('mShape'), min:0,max:9,step:1,value:0, thickness:26, thumbSize:32, onChange:updatePlayerJar });
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
  }
  function runTimer(durationMs, onDone){
    cancelAnimationFrame(rafId);
    const start = performance.now();
    let lastCountdownSec = -1;
    $('windowFrame').classList.remove('urgent');
    function frame(now){
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
  function packBubbles(count, r, w, topY, baseY, profile, seed){
    const rng = mulberry32(seed>>>0);
    const cx = 100;
    const yTop = topY+18;
    const bodyH = baseY - yTop;
    const margin = 4;
    const minDist = 2*r + 2.5;
    const yMinAll = yTop + r + margin, yMaxAll = baseY - r - margin;

    function xRangeAt(y){
      const yFrac = Math.min(1, Math.max(0, (y-yTop)/bodyH));
      const hw = (w/2)*shapeHalfWidthFrac(yFrac, profile) - r - margin;
      if(hw <= 0) return null;
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

  function drawJar(opts){
    const { hue, hue2=null, sat=70, sizePct, bubbleCount, bubbleR, seed, shapeIdx=0, overridePositions=null } = opts;
    const svg = $('jarSvg');
    const w = 60 + (sizePct/100)*60;
    const h = 140 + (sizePct/100)*70;
    const cx = 100, baseY = 240, topY = baseY - h;
    const sp = SHAPE_PROFILES[shapeIdx] || SHAPE_PROFILES[0];
    const bodyPath = jarOutlinePath(cx, topY, baseY, w, sp.points, sp.smooth);

    let fillDef = '', fillRef;
    if(hue2 !== null){
      fillDef = `<linearGradient id="liqGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="hsl(${hue},70%,52%)"/>
        <stop offset="100%" stop-color="hsl(${hue2},70%,52%)"/>
      </linearGradient>`;
      fillRef = 'url(#liqGrad)';
    } else {
      fillRef = `hsl(${hue}, ${sat}%, 52%)`;
    }

    const pts = overridePositions ? overridePositions : packBubbles(bubbleCount, bubbleR, w, topY, baseY, sp.points, seed);
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
      return `<ellipse cx="${(p.x+r*0.35).toFixed(1)}" cy="${(p.y+r*0.85).toFixed(1)}" rx="${(r*0.95).toFixed(1)}" ry="${(r*0.4).toFixed(1)}" fill="url(#inkDots)" opacity=".8"/>`;
    }).join('');

    svg.innerHTML = `
      <defs>
        <clipPath id="jarClip"><path d="${bodyPath}"/></clipPath>
        ${fillDef}
        <!-- staggered halftone dot pattern, like printed manga raster -->
        <pattern id="inkDots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.8" cy="1.8" r="1.15" fill="rgba(0,0,0,.30)"/>
          <circle cx="5.3" cy="5.3" r="1.15" fill="rgba(0,0,0,.30)"/>
        </pattern>
        <pattern id="inkDotsLight" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.05" fill="rgba(255,255,255,.30)"/>
          <circle cx="6" cy="6" r="1.05" fill="rgba(255,255,255,.30)"/>
        </pattern>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
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
      <g clip-path="url(#jarClip)">
        <rect x="${cx-w/2-6}" y="${topY+40}" width="${w+12}" height="${h}" fill="${fillRef}"/>
        <!-- liquid volume: dark side band + halftone shading on the right -->
        <rect x="${(cx+w*0.18).toFixed(1)}" y="${topY+40}" width="${(w*0.4).toFixed(1)}" height="${h}" fill="rgba(0,0,0,.16)"/>
        <rect x="${(cx+w*0.10).toFixed(1)}" y="${topY+40}" width="${(w*0.5).toFixed(1)}" height="${h}" fill="url(#inkDots)"/>
        <!-- light side: halftone highlight strip -->
        <rect x="${(cx-w/2).toFixed(1)}" y="${topY+40}" width="${(w*0.2).toFixed(1)}" height="${h}" fill="url(#inkDotsLight)"/>
        <!-- liquid surface: bold ink line + bright edge -->
        <rect x="${cx-w/2-6}" y="${topY+40}" width="${w+12}" height="3.2" fill="rgba(10,13,24,.85)"/>
        <rect x="${cx-w/2-6}" y="${topY+43}" width="${w+12}" height="5" fill="rgba(255,255,255,.30)"/>
        ${blobShadows}
        ${bubbleEls}
      </g>
      <path d="${bodyPath}" fill="url(#glassGrad)"/>
      <!-- thick manga ink outline with neon core -->
      <path d="${bodyPath}" fill="none" stroke="#0a0d18" stroke-width="5"/>
      <path d="${bodyPath}" fill="none" stroke="#35e0ff" stroke-width="1.8"/>
    `;
  }

  function renderShapePreview(idx){
    const svg = $('shapePreviewSvg');
    const sp = SHAPE_PROFILES[idx];
    const d = jarOutlinePath(30, 6, 64, 34, sp.points, sp.smooth);
    svg.innerHTML = `<path d="${d}" fill="rgba(53,224,255,.18)" stroke="var(--neon-light)" stroke-width="2"/>`;
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
    const allKeys = ['color','size','count','bsize'];
    if(flags.hasSat) allKeys.push('sat');
    if(flags.hasGradient) allKeys.push('colorB');
    if(flags.hasShape) allKeys.push('shape');
    const allSet = new Set(allKeys);

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
    if(level === 1) return set1;

    // level === 2: добавляем цвет, если его ещё нет; если он уже есть —
    // добавляем размер банки. Оттенок (sat) всегда идёт вместе с цветом.
    const set2 = new Set(set1);
    if(!set2.has('color')) set2.add('color');
    else set2.add('size');
    if(set2.has('color') && flags.hasSat) set2.add('sat');
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
        return merged;
      });
    return [base, ...extras];
  }
  function pickConfigForTier(tierNum, usedNames){
    const pool = tierNum < 5 ? tierPool(tierNum) : [...tierPool(5), ...SPECIAL_ORDERS];
    const fresh = pool.filter(c => !usedNames.has(c.name));
    const cfg = pick(fresh.length ? fresh : pool);
    usedNames.add(cfg.name);
    return cfg;
  }

  // build a full order descriptor: cfg + focus + matching flavor line
  function buildOrderDescriptor(cfg){
    let focus = null;
    if(cfg.type === 'normal' && cfg.tier >= 2 && Math.random() < 0.4){
      focus = pick(['bubbles','color','size']);
    }
    // flavor keeps both languages (see pickLocalized) so a language switch
    // mid-round translates the same line instead of rerolling a new one
    const flavor = focus && cfg.ff ? pickLocalized(cfg.ff[focus]) : pickLocalized(cfg.flavors);
    // avatar variant is chosen once here, so the card and the order bubble match
    const avatar = Array.isArray(cfg.img) ? pick(cfg.img) : (cfg.img || cfg.emoji);
    return { cfg, focus, flavor, avatar };
  }

  // cached so a language switch can re-render the same cards without rerolling them
  let currentOrders = [];

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
      const { cfg, focus, flavor, avatar } = ord;
      const tierColor = TIER_COLORS[cfg.tier];
      const npcNameStr = LT(cfg.name);

      const card = document.createElement('div');
      card.className = 'customer-card';
      card.style.setProperty('--tier-color', tierColor);

      const levelCardsHTML = [1,2,3].map(lvl=>{
        const reward = Math.round(cfg.reward * (REG_DIFF_REWARD_MULT[lvl]||1) * (focus?1.25:1));
        return `
          <button type="button" class="level-card" data-level="${lvl}" title="${LT(UI_TEXT['DIFF_BTN_TITLE_'+lvl])}">
            <span class="level-tag">${LT(UI_TEXT.DIFF_BTN_LABEL)}${lvl}</span>
            <span class="level-reward">${LT(UI_TEXT.REWARD_PREFIX)}${reward}</span>
          </button>`;
      }).join('');

      card.innerHTML = `
        <div class="npc-icon" tabindex="0">
          <div class="icon-glow">
            <div class="icon-img">${visualHTML(avatar,'npc-img')}</div>
          </div>
          <div class="icon-name-reveal"><span>${npcNameStr}</span></div>
        </div>
        <div class="plaque-stack">
          <div class="plaque-quote">
            <div class="quote">«${LT(flavor)}»</div>
            ${focus ? `<div class="focus-chip">${visualHTML(FOCUS_ICONS[focus],'focus-img')}<span>${LT(FOCUS_NAMES[focus])}</span></div>` : ''}
          </div>
          <div class="plaque-levels">${levelCardsHTML}</div>
        </div>
      `;

      const icon = card.querySelector('.npc-icon');
      const quote = card.querySelector('.plaque-quote');

      function expand(){
        wrap.querySelectorAll('.customer-card.expanded').forEach(c=>{ if(c!==card) c.classList.remove('expanded'); });
        card.classList.remove('name-open');
        card.classList.add('expanded');
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
          SFX.cardPick();
          startOrder(ord, parseInt(btn.dataset.level,10));
        });
      });

      wrap.appendChild(card);
    });
  }

  function showSelectScreen(){
    $('roundScreen').classList.remove('show');
    $('selectScreen').classList.add('show');
    $('resultOverlay').classList.remove('show');
    $('dayVal').textContent = dayNum;

    const tiers = getCardTiers();
    const usedNames = new Set();
    currentOrders = tiers.map(t=> buildOrderDescriptor(pickConfigForTier(t, usedNames)));
    renderCustomerCards(currentOrders);
  }

  let currentOrd = null; // remembered so a language switch can re-translate the order bubble
  let currentPhase = null; // 'scan' | 'craft' — so a language switch re-translates the phase label
  let lastResult = null; // last finalizeResult() output — so a language switch can re-translate the result overlay

  function startOrder(ord, level){
    const { cfg, focus, flavor, avatar } = ord;
    const regLevel = [1,2,3].includes(level) ? level : 3;
    currentOrd = ord;
    currentOrd.regLevel = regLevel;
    orderNum++;
    stopMovingAnim();
    $('selectScreen').classList.remove('show');
    $('roundScreen').classList.add('show');
    $('orderNum').textContent = orderNum;
    $('orderAvatar').innerHTML = visualHTML(avatar,'npc-img');
    $('orderText').textContent = LT(flavor);
    $('orderBubble').style.borderLeftColor = TIER_COLORS[cfg.tier];
    $('orderFocusTag').innerHTML = focus ? `${visualHTML(FOCUS_ICONS[focus],'focus-img')} ${LT(UI_TEXT.FOCUS_PREFIX)} ${LT(FOCUS_NAMES[focus])}` : '';
    const levelTag = $('orderLevelTag');
    if(levelTag) levelTag.textContent = LT(UI_TEXT.DIFF_BTN_LABEL) + regLevel;
    SFX.orderShow();

    const flags = computeFlags(cfg);
    const hueIdx = randInt(0, cfg.colorSteps-1);
    const sizeIdx = randInt(0, cfg.sizeSteps-1);
    const bsizeIdx = randInt(0, cfg.bsizeSteps-1);
    let count = randInt(1, cfg.countMax);

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
      const hue2Idx = randInt(0, cfg.colorSteps-1);
      target.hue2 = idxToVal(hue2Idx, cfg.colorSteps, 360);
      target.hue2Idx = hue2Idx;
    }
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
    const noBubblesPreview = !target.activeKeys.has('count') && !target.activeKeys.has('bsize');

    const targetR = 3 + (target.bsize/100)*9;
    if(cfg.type === 'moving'){
      startMovingAnim();
    } else {
      drawJar({ hue:target.hue, hue2: target.hue2 ?? null, sat:target.sat, sizePct:target.size,
        bubbleCount: noBubblesPreview ? 0 : target.count,
        bubbleR:targetR, seed:target.seed, shapeIdx: target.shapeIdx ?? 0 });
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
    runTimer(cfg.memorizeMs, ()=>{ stopMovingAnim(); startGuessPhase(); });
  }

  function startGuessPhase(){
    const cfg = target.cfg, flags = target.flags;
    $('fog').classList.add('show');
    setTimeout(()=>{ $('fog').classList.remove('show'); }, 450);
    $('jarSvg').classList.add('brewing');
    currentPhase = 'craft';
    $('phaseLabel').textContent = LT(UI_TEXT.PHASE_CRAFT);
    $('panel').classList.add('show');
    $('leftCol').classList.add('show');
    $('rightCol').classList.add('show');

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
      renderShapePreview(0);
    } else {
      $('shapeGroup').classList.add('hidden');
    }

    Object.values(S).forEach(s=>{ s.setDisabled(false); s.setDiffLocked(false); });
    applyDifficultyGating();
    updatePlayerJar();
    updateIngredientCounter(0);

    let used = 0;
    const totalDots = 20;
    const tickMs = cfg.craftMs/totalDots;
    ingTimerHandle = setInterval(()=>{
      used++;
      updateIngredientCounter(used);
      if(used>=totalDots) clearInterval(ingTimerHandle);
    }, tickMs);

    $('brewBtn').onclick = () => { SFX.brew(); finishCraft(); };

    setRingFraction(0);
    craftStartTime = performance.now();
    runTimer(cfg.craftMs, ()=>{ if(!craftLocked) finishCraft(); });
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
      S.sat.setTrackBackground(`linear-gradient(to top, hsl(${hue},0%,45%), hsl(${hue},100%,50%))`);
      $('lblSat').textContent = Math.round(sat) + '%';
    }
    let shapeIdx = 0;
    if(flags.hasShape){
      shapeIdx = S.shape.value;
      renderShapePreview(shapeIdx);
      $('lblShape').textContent = LT(SHAPE_NAMES[shapeIdx]);
    }
    $('lblColor').textContent = Math.round(hue) + '°';
    $('lblSize').textContent = Math.round(size) + '%';
    $('lblCount').textContent = count;
    $('lblBsize').textContent = Math.round(bsize) + '%';
    const r = 3 + (bsize/100)*9;
    // если и число, и размер сгустков недоступны на текущей сложности —
    // игра вообще их не генерирует (нечего показывать/угадывать)
    const noBubbles = target.activeKeys && !target.activeKeys.has('count') && !target.activeKeys.has('bsize');
    const effCount = noBubbles ? 0 : count;
    drawJar({ hue, hue2, sat, sizePct:size, bubbleCount:effCount, bubbleR:r, shapeIdx,
      seed: target.seed + 5000 + count*7 + Math.round(r*13) });
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

    // сложность регуляторов (Фаза C): недоступные игроку регуляторы не
    // участвуют в подсчёте очков — веса оставшихся нормализуются к 1
    if(target.activeKeys){
      components = components.filter(c => target.activeKeys.has(c.key));
      const totalGate = components.reduce((s,c)=>s+c.weight,0) || 1;
      components.forEach(c=>{ c.weight /= totalGate; });
    }

    // focus modifier: focused stats weigh much more, the rest much less
    if(target.focus){
      const fkeys = FOCUS_KEYS[target.focus];
      components.forEach(c=>{
        c.focused = fkeys.includes(c.key);
        c.weight *= c.focused ? 2.2 : 0.55;
      });
      const total = components.reduce((s,c)=>s+c.weight,0);
      components.forEach(c=>{ c.weight /= total; });
    }

    const overall = components.reduce((s,c)=>s+c.score*c.weight, 0);
    return { cfg, flags, components, overall };
  }

  function finishCraft(){
    craftLocked = true;
    cancelAnimationFrame(rafId);
    stopMovingAnim();
    clearInterval(ingTimerHandle);
    $('windowFrame').classList.remove('urgent');
    $('jarSvg').classList.remove('brewing');
    $('brewBtn').disabled = true;
    $('panel').classList.add('locked');
    Object.values(S).forEach(s=>s.setDisabled(true));

    const scoreData = computeScoreComponents();
    const elapsed = performance.now() - craftStartTime;
    const timeFrac = Math.min(1, elapsed/scoreData.cfg.craftMs);
    finalizeResult(scoreData, timeFrac);
  }

  function finalizeResult(scoreData, timeFrac){
    const { cfg, overall, components } = scoreData;
    const overallPct = Math.round(overall*100);
    const goodThreshold = cfg.tier >= 5 ? 0.85 : 0.8;
    const perfectThreshold = cfg.tier >= 5 ? 0.97 : 0.95;
    const good = overall >= goodThreshold;
    const perfect = overall >= perfectThreshold;

    // speed bonus up to +50%: full when done within the first third at 100% accuracy,
    // scales down with both time and accuracy
    const third = 1/3;
    const timeFactor = timeFrac <= third ? 1 : Math.max(0, 1 - (timeFrac - third)/(1 - third));
    const speedBonusFrac = 0.5 * overall * timeFactor;

    // focus raises the stakes both ways; the regulator-difficulty level chosen
    // for this order (Фаза D — выбор на плашках) scales the reward as well
    const regMult = (typeof REG_DIFF_REWARD_MULT !== 'undefined' && REG_DIFF_REWARD_MULT[target.regLevel]) || 1;
    const effReward = Math.round(cfg.reward * regMult * (target.focus ? 1.25 : 1));

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

    // cached so a language switch can re-translate the overlay without recomputing scores
    lastResult = { perfect, good, delta, speedBonusPct, overallPct, components, focus: target.focus };

    $('stickerEmoji').innerHTML = visualHTML(perfect ? STICKERS.perfect : good ? STICKERS.good : STICKERS.bad, 'sticker-img');
    $('resultTitle').textContent = LT(perfect ? UI_TEXT.RESULT_PERFECT : good ? UI_TEXT.RESULT_GOOD : UI_TEXT.RESULT_BAD);
    $('resultTitle').className = 'result-title ' + (good ? 'good' : 'bad');
    $('deltaVal').textContent = (delta>=0?'+':'') + delta;
    $('deltaVal').className = 'delta ' + (good ? 'good' : 'bad');
    $('speedNote').textContent = speedBonusPct >= 1 ? LT(UI_TEXT.SPEED_BONUS).replace('{p}', speedBonusPct) : '';
    $('overallScore').textContent = overallPct + '%';
    $('breakdown').innerHTML = components.map(c=>
      `<div class="row ${c.focused?'focused':''}"><span>${c.focused?visualHTML(FOCUS_ICONS[target.focus],'focus-img')+' ':''}${LT(c.label)}</span><span class="val">${Math.round(c.score*100)}%</span></div>`
    ).join('');

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
    if(dayNum >= 10){
      showWeekOverlay();
    } else {
      dayNum++;
      showSelectScreen();
    }
  });

  // ---------- global leaderboard ----------
  // URL базы задаётся в content.js -> CONFIG.FIREBASE_DB_URL
  const FIREBASE_DB_URL = (typeof CONFIG !== 'undefined' && CONFIG.FIREBASE_DB_URL) || '';
  const LOCAL_LB_KEY = 'potionshop_leaderboard_v1';

  async function loadLeaderboard(){
    if(FIREBASE_DB_URL){
      try{
        const res = await fetch(FIREBASE_DB_URL + '/leaderboard.json');
        const data = await res.json();
        return data ? Object.values(data) : [];
      }catch(e){ /* fall through to local */ }
    }
    try{ return JSON.parse(localStorage.getItem(LOCAL_LB_KEY) || '[]'); }
    catch(e){ return []; }
  }
  async function saveLeaderboardEntry(name, finalScore){
    const entry = { name: name || LT(UI_TEXT.ANONYMOUS), score: finalScore, date: new Date().toLocaleDateString(LANG === 'ru' ? 'ru-RU' : 'en-US') };
    if(FIREBASE_DB_URL){
      try{
        // POST appends a new child with a unique key — never overwrites existing entries
        await fetch(FIREBASE_DB_URL + '/leaderboard.json', { method:'POST', body: JSON.stringify(entry) });
        return await loadLeaderboard();
      }catch(e){ /* fall through to local */ }
    }
    let list = [];
    try{ list = JSON.parse(localStorage.getItem(LOCAL_LB_KEY) || '[]'); }catch(e){}
    list.push(entry);
    list.sort((a,b)=>b.score-a.score);
    localStorage.setItem(LOCAL_LB_KEY, JSON.stringify(list.slice(0,50)));
    return list;
  }
  // cached so a language switch can re-render the currently open leaderboard(s)
  const lastLb = {};
  function renderLeaderboard(list, highlightScore, elId){
    lastLb[elId] = { list, highlightScore };
    list.sort((a,b)=>b.score-a.score);
    $(elId).innerHTML = list.slice(0,50).map(e=>
      `<div class="lb-row ${e.score===highlightScore?'me':''}"><span>${e.name}</span><span>${e.score} · ${e.date}</span></div>`
    ).join('') || `<div style="color:var(--ink-dim);text-align:center;">${LT(UI_TEXT.LB_EMPTY)}</div>`;
  }

  $('lbBtn').addEventListener('click', async ()=>{
    SFX.uiClick();
    const list = await loadLeaderboard();
    renderLeaderboard(list, null, 'lbOverlayList');
    $('lbOverlay').classList.add('show');
  });
  $('lbCloseBtn').addEventListener('click', ()=>{ SFX.uiClick(); $('lbOverlay').classList.remove('show'); });

  async function showWeekOverlay(){
    SFX.weekEnd();
    $('resultOverlay').classList.remove('show');
    $('finalScoreVal').textContent = score;
    $('nameInput').value = '';
    const list = await loadLeaderboard();
    renderLeaderboard(list, null, 'leaderboardList');
    $('weekOverlay').classList.add('show');
  }
  $('saveScoreBtn').addEventListener('click', async ()=>{
    SFX.uiClick();
    const name = $('nameInput').value.trim().slice(0,20);
    const list = await saveLeaderboardEntry(name, score);
    renderLeaderboard(list, score, 'leaderboardList');
    $('saveScoreBtn').disabled = true;
    $('saveScoreBtn').textContent = LT(UI_TEXT.SAVE_SCORE_DONE);
  });
  $('newWeekBtn').addEventListener('click', ()=>{
    SFX.uiClick();
    dayNum = 1; score = 0; streak = 0; stage = 0; perfectStreakAtMax = 0; goodStreakAtMax = 0;
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
  function ambientTryPlay(){
    if(!ambientAudio) return;
    ambientAudio.play().catch(()=>{}); // трека может ещё не быть в assets/audio/ — тогда просто тишина
  }

  // ---------- переключатель языка ----------
  function refreshVisibleScreen(){
    if($('selectScreen').classList.contains('show') && currentOrders.length){
      renderCustomerCards(currentOrders);
    }
    if($('roundScreen').classList.contains('show') && target && currentOrd){
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
        `<div class="row ${c.focused?'focused':''}"><span>${c.focused?visualHTML(FOCUS_ICONS[focus],'focus-img')+' ':''}${LT(c.label)}</span><span class="val">${Math.round(c.score*100)}%</span></div>`
      ).join('');
    }
    Object.keys(lastLb).forEach(elId=>{
      const { list, highlightScore } = lastLb[elId];
      renderLeaderboard(list, highlightScore, elId);
    });
    if($('saveScoreBtn').disabled) $('saveScoreBtn').textContent = LT(UI_TEXT.SAVE_SCORE_DONE);
  }
  const langBtn = $('langBtn');
  if(langBtn){
    langBtn.addEventListener('click', ()=>{
      SFX.uiClick();
      LANG = LANG === 'ru' ? 'en' : 'ru';
      localStorage.setItem(LANG_KEY, LANG);
      applyI18n();
      refreshVisibleScreen();
    });
  }

  // ---------- стартовый экран: кнопка "Пришвартоваться" ----------
  const dockBtn = $('dockBtn');
  if(dockBtn){
    dockBtn.addEventListener('click', ()=>{
      SFX.dock();
      ambientTryPlay();
      const s = $('splashScreen');
      s.classList.add('fade-out');
      s.addEventListener('transitionend', ()=>{ s.style.display='none'; }, {once:true});
    }, {once:true});
  }

  applyI18n();
  initSliders();
  updateStickerTally();
  showSelectScreen();
})();
