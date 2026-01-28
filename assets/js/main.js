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
