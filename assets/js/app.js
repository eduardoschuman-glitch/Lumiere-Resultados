/* Instituto Lumière · Resultados (antes e depois) */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');

  /* ---------------- dados ----------------
     Os casos aparecem nesta ordem: primeiro os protocolos, depois a
     prótese e por último as facetas. Cada caso tem uma ou mais fotos
     (views). A primeira é a que abre; as outras aparecem como miniaturas
     embaixo da foto ("Mais fotos deste caso").
     Para incluir uma foto: salve o par em assets/img como NOME-antes.webp
     e NOME-depois.webp (mesmo tamanho, sorrisos alinhados) e acrescente
     { src: 'NOME', w: largura, h: altura } nas views do caso. */
  const CASES = [
    // ---------- protocolo ----------
    { id: 'caso-01', tag: 'Prótese protocolo', title: 'De volta à mesa, sem medo.',
      text: 'Sem dentes na arcada, a paciente convivia com a insegurança na hora de comer e de sorrir. Com a prótese protocolo sobre implantes, os dentes fixos devolveram firmeza para mastigar e naturalidade ao sorriso.',
      views: [{ src: 'caso-01', w: 1200, h: 600 }, { src: 'caso-01-2', w: 1200, h: 643 }] },
    { id: 'caso-04', tag: 'Prótese protocolo', title: 'Sorrir de novo, de boca aberta.',
      text: 'Com poucos dentes e muita insegurança para sorrir, o paciente fez a reabilitação completa com protocolo. O planejamento digital guiou cada implante até o resultado final.',
      views: [{ src: 'caso-04', w: 1200, h: 900 }] },
    { id: 'caso-06', tag: 'Prótese protocolo', title: 'Firmeza para mastigar o que gosta.',
      text: 'Dentes comprometidos que vinham sendo remendados por anos. A prótese protocolo trouxe estabilidade e devolveu o prazer de comer sem preocupação.',
      views: [{ src: 'caso-06', w: 1200, h: 900 }] },
    { id: 'caso-07', tag: 'Prótese protocolo', title: 'Luz no sorriso, leveza na rotina.',
      text: 'Dentes escurecidos e com perdas foram substituídos por uma arcada fixa sobre implantes. Um sorriso claro, proporcional e seguro para o dia a dia.',
      views: [{ src: 'caso-07', w: 1200, h: 600 }] },
    { id: 'caso-11', tag: 'Prótese protocolo', title: 'Um sorriso que acompanha a idade.',
      text: 'Dentes desgastados e escurecidos deram lugar a uma reabilitação com protocolo, pensada para respeitar a harmonia do rosto. Natural, firme e com a cara da paciente.',
      views: [{ src: 'caso-11', w: 1200, h: 900 }, { src: 'caso-11-2', w: 1200, h: 680 }] },
    { id: 'caso-12', tag: 'Prótese protocolo', title: 'O mesmo sorriso, mais confiante.',
      text: 'Com cor, forma e alinhamento planejados para o rosto da paciente, a reabilitação deixou o sorriso mais harmônico sem perder a naturalidade.',
      views: [{ src: 'caso-12', w: 1200, h: 1200 }] },
    // ---------- prótese ----------
    { id: 'caso-10', tag: 'Prótese', title: 'Um sorriso inteiro outra vez.',
      text: 'Dentes escurecidos e com falhas deram lugar a uma prótese planejada para o rosto da paciente. Um sorriso mais claro e completo, que aparece por inteiro nas fotos.',
      views: [{ src: 'caso-10', w: 1200, h: 1591 }, { src: 'caso-10-2', w: 737, h: 1341 }] },
    // ---------- facetas ----------
    { id: 'caso-02', tag: 'Facetas e coroas', title: 'Proporção e harmonia.',
      text: 'Espaços, diferenças de tamanho e desgastes corrigidos com facetas e coroas. Detalhe por detalhe, para um resultado equilibrado e natural.',
      views: [{ src: 'caso-02', w: 1200, h: 545 }, { src: 'caso-02-2', w: 1020, h: 462 }] },
    { id: 'caso-03', tag: 'Facetas', title: 'Dentes fraturados, sorriso inteiro.',
      text: 'Os dentes da frente, fraturados e desgastados, foram restaurados com facetas. Forma e cor devolvidas com precisão.',
      views: [{ src: 'caso-03', w: 1200, h: 600 }, { src: 'caso-03-2', w: 1200, h: 458 }] },
    { id: 'caso-08', tag: 'Facetas', title: 'Mais uniforme, com a cara dele.',
      text: 'Facetas com cor, forma e tamanho planejados para o rosto do paciente deixaram o sorriso mais uniforme e harmônico, sem perder a naturalidade.',
      views: [{ src: 'caso-08', w: 1200, h: 639 }, { src: 'caso-08-2', w: 1200, h: 644 }] },
    { id: 'caso-09', tag: 'Facetas', title: 'Forma e proporção refeitas.',
      text: 'Os dentes da frente ganharam facetas com forma e tamanho redesenhados, deixando o sorriso mais uniforme e equilibrado.',
      views: [{ src: 'caso-09', w: 1200, h: 660 }] }
  ];
  const img = (v, lado) => `assets/img/${v.src}-${lado}.webp?v=7`;

  const ba = $('#ba');
  const stage = $('#stage');
  const viewer = $('.viewer');
  const thumbs = $('#thumbs');
  const viewsEl = $('#views');
  const segBtns = $$('.seg button');
  let current = 0;           // caso aberto
  let view = 0;              // foto aberta dentro do caso

  /* ---------------- comparador ---------------- */
  let dragging = false;
  const set = pct => {
    pct = Math.max(0, Math.min(100, pct));
    ba.style.setProperty('--pos', pct + '%');
    ba.setAttribute('aria-valuenow', Math.round(pct));
    ba.classList.toggle('only-before', pct >= 99);
    ba.classList.toggle('only-after', pct <= 1);
    segBtns.forEach(b => b.classList.toggle('on', Math.abs(+b.dataset.pos - pct) < 1));
  };
  const animTo = pct => {
    if (reduce) return set(pct);
    ba.classList.add('anim');
    set(pct);
    clearTimeout(animTo.t);
    animTo.t = setTimeout(() => ba.classList.remove('anim'), 550);
  };
  const fromEvent = e => {
    const r = ba.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };
  ba.addEventListener('pointerdown', e => {
    stopHint();
    dragging = true;
    ba.classList.remove('anim');
    ba.classList.add('dragging');
    fromEvent(e);
    ba.setPointerCapture(e.pointerId);
  });
  ba.addEventListener('pointermove', e => { if (dragging) fromEvent(e); });
  const end = () => { dragging = false; ba.classList.remove('dragging'); };
  ba.addEventListener('pointerup', end);
  ba.addEventListener('pointercancel', end);
  ba.addEventListener('keydown', e => {
    const cur = +ba.getAttribute('aria-valuenow');
    if (e.key === 'ArrowLeft') { set(cur - 5); e.preventDefault(); e.stopPropagation(); }
    if (e.key === 'ArrowRight') { set(cur + 5); e.preventDefault(); e.stopPropagation(); }
  });

  segBtns.forEach(b => b.addEventListener('click', () => { stopHint(); animTo(+b.dataset.pos); }));

  // pequena demonstração do arraste quando o caso abre
  let hintTimers = [];
  function stopHint() { hintTimers.forEach(clearTimeout); hintTimers = []; }
  function hint() {
    if (reduce) return;
    stopHint();
    [72, 28, 50].forEach((p, i) => hintTimers.push(setTimeout(() => animTo(p), 450 + i * 560)));
  }

  // a foto ocupa o maior espaço possível sem distorcer: a altura livre é
  // a da tela menos o que vem abaixo dela (texto e miniaturas)
  function fit() {
    const c = CASES[current].views[view];
    const cs = getComputedStyle(viewer);
    const rows = cs.gridTemplateRows.split(' ').map(parseFloat);
    const gap = parseFloat(cs.rowGap) || 0;
    const below = rows.slice(1).reduce((a, b) => a + b, 0) + gap * (rows.length - 1);
    const H = viewer.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - below;
    const W = stage.clientWidth;
    const w = Math.max(120, Math.min(W, H * c.w / c.h));
    ba.style.width = Math.floor(w) + 'px';
    ba.style.height = Math.floor(w * c.h / c.w) + 'px';
  }
  new ResizeObserver(() => fit()).observe(viewer);
  if (document.fonts) document.fonts.ready.then(fit);

  /* ---------------- miniaturas ---------------- */
  $('#vTotal').textContent = pad(CASES.length);
  CASES.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'thumb';
    b.setAttribute('role', 'tab');
    const n = c.views.length;
    b.setAttribute('aria-label', `Caso ${i + 1}: ${c.tag}${n > 1 ? `, ${n} fotos` : ''}`);
    b.innerHTML = `<img src="${img(c.views[0], 'depois')}" alt="" loading="lazy"><span>${pad(i + 1)}</span>${n > 1 ? `<em>${n} fotos</em>` : ''}`;
    b.addEventListener('click', () => show(i, true));
    thumbs.appendChild(b);
  });
  // depois que a página abre, deixa todas as fotos prontas para trocar sem espera
  addEventListener('load', () => setTimeout(() => CASES.forEach(c => c.views.forEach(v => {
    new Image().src = img(v, 'antes'); new Image().src = img(v, 'depois');
  })), 800));

  // fotos do mesmo paciente: miniaturas embaixo da foto principal
  function renderViews() {
    const c = CASES[current];
    viewsEl.classList.toggle('single', c.views.length < 2);
    const list = $('.views-list', viewsEl);
    list.innerHTML = '';
    if (c.views.length < 2) return;
    c.views.forEach((v, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'vthumb' + (k === view ? ' active' : '');
      b.setAttribute('aria-label', `Foto ${k + 1} deste caso`);
      b.setAttribute('aria-pressed', k === view);
      b.innerHTML = `<img src="${img(v, 'antes')}" alt=""><img src="${img(v, 'depois')}" alt=""><span>${k + 1}</span>`;
      b.addEventListener('click', () => { if (k !== view) showView(k); });
      list.appendChild(b);
    });
  }

  function setHash() {
    history.replaceState(null, '', '#' + CASES[current].id + (view ? '-' + (view + 1) : ''));
  }

  function loadImages() {
    const v = CASES[current].views[view];
    const a = $('.ba-after', ba), b = $('.ba-before img', ba);
    a.src = img(v, 'depois'); a.width = v.w; a.height = v.h;
    b.src = img(v, 'antes'); b.width = v.w; b.height = v.h;
    set(50);
    fit();
  }

  // troca só a foto (mesmo paciente), mantendo o texto
  function showView(k) {
    view = k;
    setHash();
    $$('.vthumb', viewsEl).forEach((b, j) => { b.classList.toggle('active', j === k); b.setAttribute('aria-pressed', j === k); });
    const apply = () => { loadImages(); ba.style.opacity = 1; hint(); };
    stopHint();
    if (reduce) return apply();
    ba.style.opacity = 0;
    setTimeout(apply, 250);
  }

  function show(i, animate, k = 0) {
    current = (i + CASES.length) % CASES.length;
    view = Math.max(0, Math.min(k, CASES[current].views.length - 1));
    const c = CASES[current];
    const inner = $('#infoInner');
    setHash();
    $$('.thumb', thumbs).forEach((t, j) => {
      t.classList.toggle('active', j === current);
      t.setAttribute('aria-selected', j === current);
    });
    const act = $$('.thumb', thumbs)[current];
    thumbs.scrollTo({ left: act.offsetLeft - thumbs.clientWidth / 2 + act.clientWidth / 2, behavior: animate ? 'smooth' : 'auto' });
    const apply = () => {
      $('#vTag').textContent = c.tag;
      $('#vTitle').textContent = c.title;
      $('#vText').textContent = c.text;
      $('#vNum').textContent = pad(current + 1);
      document.title = `${c.title} | Resultados Lumière`;
      renderViews();
      loadImages();
      inner.classList.remove('out');
      ba.style.opacity = 1;
      hint();
    };
    stopHint();
    if (!animate || reduce) return apply();
    inner.classList.add('out');
    ba.style.opacity = 0;
    setTimeout(apply, 280);
  }

  $('#prevBtn').addEventListener('click', () => show(current - 1, true));
  $('#nextBtn').addEventListener('click', () => show(current + 1, true));

  // arrastar o dedo para o lado no texto também troca de caso
  let sx = null, sy = 0;
  $('#info').addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
  addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1), true);
  });

  // teclado (computador): setas trocam de caso, A e D mostram antes e depois
  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') show(current + 1, true);
    else if (e.key === 'ArrowLeft') show(current - 1, true);
    else if (e.key === 'a' || e.key === 'A') { stopHint(); animTo(100); }
    else if (e.key === 'd' || e.key === 'D') { stopHint(); animTo(0); }
    else if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); stopHint(); animTo(50); }
  });

  // texto do caso: mostrar ou esconder (fica salvo neste aparelho)
  const textBtn = $('#textBtn');
  const setText = on => {
    viewer.classList.toggle('no-text', !on);
    textBtn.setAttribute('aria-pressed', on);
    try { localStorage.setItem('lumiere-texto', on ? '1' : '0'); } catch (e) {}
    fit();
  };
  let textOn = true;
  try { textOn = localStorage.getItem('lumiere-texto') !== '0'; } catch (e) {}
  setText(textOn);
  textBtn.addEventListener('click', () => setText(viewer.classList.contains('no-text')));

  /* ---------------- tela cheia e tela sempre acesa ---------------- */
  const root = document.documentElement;
  const fsOn = () => document.fullscreenElement || document.webkitFullscreenElement;
  const canFs = root.requestFullscreen || root.webkitRequestFullscreen;
  const standalone = matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || navigator.standalone;
  $$('.fs-btn').forEach(b => {
    if (!canFs || standalone) { b.hidden = true; return; }
    b.addEventListener('click', () => {
      if (fsOn()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
    });
  });
  const paintFs = () => $$('.fs-btn use').forEach(u => u.setAttribute('href', fsOn() ? '#i-shrink' : '#i-expand'));
  document.addEventListener('fullscreenchange', paintFs);
  document.addEventListener('webkitfullscreenchange', paintFs);

  // durante a apresentação a tela do tablet não apaga sozinha
  let lock = null;
  const keepAwake = async () => {
    if (!('wakeLock' in navigator) || lock || document.visibilityState !== 'visible') return;
    try { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); } catch (e) {}
  };
  addEventListener('pointerdown', keepAwake);
  document.addEventListener('visibilitychange', keepAwake);

  /* ---------------- funciona sem internet depois da primeira visita ---------------- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  // #caso-04 abre direto naquele caso; #caso-01-2 abre a segunda foto do caso 1
  const fromHash = () => {
    const m = location.hash.slice(1).match(/^(caso-\d+)(?:-(\d+))?$/);
    if (!m) return null;
    const i = CASES.findIndex(c => c.id === m[1]);
    return i < 0 ? null : [i, m[2] ? +m[2] - 1 : 0];
  };
  const start = fromHash() || [0, 0];
  show(start[0], false, start[1]);
  addEventListener('hashchange', () => {
    const h = fromHash();
    if (!h) return;
    if (h[0] !== current) show(h[0], true, h[1]);
    else if (h[1] !== view && h[1] < CASES[current].views.length) showView(h[1]);
  });
})();
