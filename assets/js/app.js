/* Instituto Lumière · Resultados (antes e depois) */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');

  /* ---------------- dados ----------------
     Para incluir um caso novo: salve as fotos em assets/img como
     caso-XX-antes.webp e caso-XX-depois.webp (mesmo tamanho e
     enquadramento) e acrescente uma linha aqui, na posição em que ele
     deve aparecer. w e h são a largura e a altura das fotos. */
  const CASES = [
    { id: 'caso-01', w: 1200, h: 600, tag: 'Prótese protocolo', title: 'De volta à mesa, sem medo.',
      text: 'Sem dentes na arcada, a paciente convivia com a insegurança na hora de comer e de sorrir. Com a prótese protocolo sobre implantes, os dentes fixos devolveram firmeza para mastigar e naturalidade ao sorriso.' },
    { id: 'caso-11', w: 1200, h: 900, tag: 'Prótese protocolo', title: 'Um sorriso que acompanha a idade.',
      text: 'Dentes desgastados e escurecidos deram lugar a uma reabilitação com protocolo, pensada para respeitar a harmonia do rosto. Natural, firme e com a cara da paciente.' },
    { id: 'caso-04', w: 1200, h: 900, tag: 'Prótese protocolo', title: 'Sorrir de novo, de boca aberta.',
      text: 'Com poucos dentes e muita insegurança para sorrir, o paciente fez a reabilitação completa com protocolo. O planejamento digital guiou cada implante até o resultado final.' },
    { id: 'caso-06', w: 1200, h: 900, tag: 'Prótese protocolo', title: 'Firmeza para mastigar o que gosta.',
      text: 'Dentes comprometidos que vinham sendo remendados por anos. A prótese protocolo trouxe estabilidade e devolveu o prazer de comer sem preocupação.' },
    { id: 'caso-07', w: 1200, h: 600, tag: 'Prótese protocolo', title: 'Luz no sorriso, leveza na rotina.',
      text: 'Dentes escurecidos e com perdas foram substituídos por uma arcada fixa sobre implantes. Um sorriso claro, proporcional e seguro para o dia a dia.' },
    { id: 'caso-10', w: 1200, h: 720, tag: 'Reabilitação do sorriso', title: 'O mesmo sorriso, mais confiante.',
      text: 'Com cor, forma e alinhamento planejados para o rosto da paciente, a reabilitação deixou o sorriso mais harmônico sem perder a naturalidade.' },
    { id: 'caso-02', w: 1200, h: 545, tag: 'Facetas e coroas', title: 'Proporção e harmonia.',
      text: 'Espaços, diferenças de tamanho e desgastes corrigidos com facetas e coroas. Detalhe por detalhe, para um resultado equilibrado e natural.' },
    { id: 'caso-03', w: 1200, h: 600, tag: 'Facetas', title: 'Dentes fraturados, sorriso inteiro.',
      text: 'Os dentes da frente, fraturados e desgastados, foram restaurados com facetas. Forma e cor devolvidas com precisão.' }
  ];
  const img = (c, lado) => `assets/img/${c.id}-${lado}.webp?v=2`;

  const ba = $('#ba');
  const stage = $('#stage');
  const viewer = $('.viewer');
  const thumbs = $('#thumbs');
  const segBtns = $$('.seg button');
  let current = 0;

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
    const c = CASES[current];
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
    b.setAttribute('aria-label', `Caso ${i + 1}: ${c.tag}`);
    b.innerHTML = `<img src="${img(c, 'depois')}" alt="" loading="lazy"><span>${pad(i + 1)}</span>`;
    b.addEventListener('click', () => show(i, true));
    thumbs.appendChild(b);
  });
  // depois que a página abre, deixa todas as fotos prontas para trocar sem espera
  addEventListener('load', () => setTimeout(() => CASES.forEach(c => { new Image().src = img(c, 'antes'); new Image().src = img(c, 'depois'); }), 800));

  function show(i, animate) {
    current = (i + CASES.length) % CASES.length;
    const c = CASES[current];
    const inner = $('#infoInner');
    history.replaceState(null, '', '#' + c.id);
    $$('.thumb', thumbs).forEach((t, k) => {
      t.classList.toggle('active', k === current);
      t.setAttribute('aria-selected', k === current);
    });
    const act = $$('.thumb', thumbs)[current];
    thumbs.scrollTo({ left: act.offsetLeft - thumbs.clientWidth / 2 + act.clientWidth / 2, behavior: animate ? 'smooth' : 'auto' });
    const apply = () => {
      const a = $('.ba-after', ba), b = $('.ba-before img', ba);
      a.src = img(c, 'depois'); a.width = c.w; a.height = c.h;
      b.src = img(c, 'antes'); b.width = c.w; b.height = c.h;
      $('#vTag').textContent = c.tag;
      $('#vTitle').textContent = c.title;
      $('#vText').textContent = c.text;
      $('#vNum').textContent = pad(current + 1);
      document.title = `${c.title} | Resultados Lumière`;
      set(50);
      fit();
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

  // #caso-04 no endereço abre direto naquele caso
  const start = CASES.findIndex(c => c.id === location.hash.slice(1));
  show(start >= 0 ? start : 0);
  addEventListener('hashchange', () => {
    const i = CASES.findIndex(c => c.id === location.hash.slice(1));
    if (i >= 0 && i !== current) show(i, true);
  });
})();
