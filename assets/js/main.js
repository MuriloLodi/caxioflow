// Caxio Flow — interactions (shared)
(function () {
  const nav = document.querySelector('[data-nav]');
  const burger = document.querySelector('[data-nav-burger]');
  const mobile = document.querySelector('[data-nav-mobile]');

  // Nav pill on scroll
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('is-pill', (window.scrollY || 0) > 50);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile menu (CSS usa .site-nav.is-open)
  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    if (!nav || !burger) return;
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
  }

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  if (mobile) {
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
  }

  // Fecha menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!nav || !nav.classList.contains('is-open')) return;
    const shell = nav.querySelector('.nav-shell');
    if (shell && !shell.contains(e.target)) closeMenu();
  });

  // Reveal on scroll
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-inview');
    });
  }, { threshold: 0.14 });
  reveals.forEach(el => io.observe(el));

  // Parallax (subtle)
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  function parallaxTick() {
    const vh = window.innerHeight || 1;
    parallaxEls.forEach(el => {
      const amt = parseFloat(el.getAttribute('data-parallax') || '0');
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const delta = (center - vh / 2) / vh;
      const y = Math.max(-24, Math.min(24, -delta * 30 * amt));
      el.style.transform = `translateY(${y}px)`;
    });
  }
  window.addEventListener('scroll', parallaxTick, { passive: true });
  parallaxTick();

  // Device switch (home page)
  const deviceBtns = Array.from(document.querySelectorAll('[data-device-btn]'));
  const deviceImgs = Array.from(document.querySelectorAll('[data-device]'));

  function setDevice(which) {
    if (!deviceBtns.length) return;
    deviceBtns.forEach(btn => {
      const active = btn.getAttribute('data-device-btn') === which;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    deviceImgs.forEach(img => {
      img.classList.toggle('is-active', img.getAttribute('data-device') === which);
    });
  }
  deviceBtns.forEach(btn => btn.addEventListener('click', () => setDevice(btn.getAttribute('data-device-btn'))));
  setDevice('mobile');

  // Pricing toggle (inside featured plan)
  const toggleBtns = Array.from(document.querySelectorAll('[data-billing]'));
  const monthlyEls = Array.from(document.querySelectorAll('[data-price-monthly]'));
  const annuallyEls = Array.from(document.querySelectorAll('[data-price-annually]'));

  function setBilling(mode) {
    if (!toggleBtns.length) return;
    toggleBtns.forEach(btn => {
      const active = btn.getAttribute('data-billing') === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    monthlyEls.forEach(el => el.hidden = (mode !== 'monthly'));
    annuallyEls.forEach(el => el.hidden = (mode !== 'annually'));
  }
  toggleBtns.forEach(btn => btn.addEventListener('click', () => setBilling(btn.getAttribute('data-billing'))));
  setBilling('monthly');

  // Resize: se voltar pro desktop, fecha menu
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();
// Scroll 3D tilt (Framer-like) — dashboard vindo "para frente"
(function () {
  const card = document.querySelector('[data-tilt-card]');
  if (!card) return;

  const section =
    card.closest('[data-tilt-section]') ||
    document.querySelector('.hero') ||
    document.body;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  let ticking = false;

  function update() {
    ticking = false;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // 0 no topo; 1 quando a hero já "subiu" um pouco (ajuste fino)
    const p = clamp((-rect.top) / (vh * 0.55), 0, 1);

    // Valores iniciais (inclinado e "mais longe") -> finais (reto e perto)
    const ty = lerp(36, 0, p);        // sobe levemente
    const sc = lerp(0.956, 1.0, p);   // aproxima (scale)
    const rx = lerp(-10, 0, p);       // tira inclinação vertical
    const rz = lerp(-2.5, 0, p);      // tira inclinação lateral

    card.style.setProperty('--ty', `${ty.toFixed(2)}px`);
    card.style.setProperty('--sc', `${sc.toFixed(4)}`);
    card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    card.style.setProperty('--rz', `${rz.toFixed(2)}deg`);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
(() => {
  const root = document.querySelector('[data-faq-root]');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('details[data-faq]'));

  items.forEach((d) => {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      items.forEach((other) => {
        if (other !== d) other.removeAttribute('open');
      });
    });
  });
})();
(() => {
  const root = document.querySelector('[data-testi]');
  if (!root) return;

  const track = root.querySelector('[data-testi-track]');
  const cards = Array.from(track.querySelectorAll('.testi-card'));
  const btnPrev = root.querySelector('[data-testi-prev]');
  const btnNext = root.querySelector('[data-testi-next]');

  const topQuote = document.querySelector('[data-testi-quote]');
  const topName  = document.querySelector('[data-testi-name]');
  const topRole  = document.querySelector('[data-testi-role]');
  const topAvatar= document.querySelector('[data-testi-person] .testi-avatar');

  if (!track || cards.length === 0 || !topQuote || !topName || !topRole || !topAvatar) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let active = 0;
  let isUserInteracting = false;
  let autoTimer = null;

  function applyActive(i) {
    active = (i + cards.length) % cards.length;

    const c = cards[active];
    topQuote.textContent = `“${c.dataset.quote || ''}”`;
    topName.textContent = c.dataset.name || '';
    topRole.textContent = c.dataset.role || '';
    topAvatar.src = c.dataset.avatar || topAvatar.src;
    topAvatar.alt = c.dataset.name ? `Foto de ${c.dataset.name}` : 'Foto do depoente';

    cards.forEach((card, idx) => {
      const dist = Math.min(4, Math.abs(idx - active)); // limita p/ não ficar gigantesco
      card.dataset.dist = String(dist);
      card.setAttribute('aria-selected', idx === active ? 'true' : 'false');
    });
  }

  function scrollToIndex(i, behavior = 'smooth') {
    const card = cards[(i + cards.length) % cards.length];
    card.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
  }

  // Clique no card: centraliza e ativa
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      isUserInteracting = true;
      applyActive(idx);
      scrollToIndex(idx);
      setTimeout(() => (isUserInteracting = false), 900);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Botões
  btnPrev?.addEventListener('click', () => {
    isUserInteracting = true;
    applyActive(active - 1);
    scrollToIndex(active);
    setTimeout(() => (isUserInteracting = false), 700);
  });

  btnNext?.addEventListener('click', () => {
    isUserInteracting = true;
    applyActive(active + 1);
    scrollToIndex(active);
    setTimeout(() => (isUserInteracting = false), 700);
  });

  // Detecta qual card está mais no “centro” do track (scroll)
  function updateActiveByScroll() {
    const rect = track.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;

    cards.forEach((card, idx) => {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const d = Math.abs(cardCenter - centerX);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    });

    if (bestIdx !== active) applyActive(bestIdx);
  }

  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateActiveByScroll);
  });

  // Auto-play (pausa quando usuário interage)
  function startAuto() {
    if (prefersReduced) return;
    stopAuto();
    autoTimer = setInterval(() => {
      if (isUserInteracting) return;
      applyActive(active + 1);
      scrollToIndex(active);
    }, 5200);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  // Pausa ao passar mouse / focar
  root.addEventListener('mouseenter', () => (isUserInteracting = true));
  root.addEventListener('mouseleave', () => (isUserInteracting = false));
  root.addEventListener('focusin', () => (isUserInteracting = true));
  root.addEventListener('focusout', () => (isUserInteracting = false));

  // Init: ativa o 2º card (fica igual print, com laterais aparecendo)
  const initial = Math.min(1, cards.length - 1);
  applyActive(initial);
  scrollToIndex(initial, 'auto');
  startAuto();
})();
// ================================
// Planos: Toggle Mensal / Anual
// ================================
(() => {
  const body = document.body;
  if (!body.classList.contains('page-plans')) return;

  const wrap = document.querySelector('[data-price-toggle]');
  if (!wrap) return;

  const btnMonthly = wrap.querySelector('[data-billing="monthly"]');
  const btnAnnual  = wrap.querySelector('[data-billing="annual"]');

  const setBilling = (mode) => {
    const isAnnual = mode === 'annual';
    body.classList.toggle('is-billing-annual', isAnnual);

    btnMonthly?.classList.toggle('is-active', !isAnnual);
    btnAnnual?.classList.toggle('is-active', isAnnual);

    try { localStorage.setItem('caxio_billing', mode); } catch(_) {}
  };

  // restore
  let saved = 'monthly';
  try { saved = localStorage.getItem('caxio_billing') || 'monthly'; } catch(_) {}
  setBilling(saved);

  btnMonthly?.addEventListener('click', () => setBilling('monthly'));
  btnAnnual?.addEventListener('click',  () => setBilling('annual'));
})();

// ================================
// FAQ accordion (abre 1 por vez)
// ================================
(() => {
  document.querySelectorAll('[data-accordion="faq"]').forEach((wrap) => {
    const all = Array.from(wrap.querySelectorAll('details'));
    all.forEach((d) => {
      d.addEventListener('toggle', () => {
        if (!d.open) return;
        all.forEach((o) => { if (o !== d) o.removeAttribute('open'); });
      });
    });
  });
})();
// ================================
// Scroll Reveal (anima no scroll)
// ================================
(() => {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  // fallback
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  els.forEach(el => io.observe(el));
})();
