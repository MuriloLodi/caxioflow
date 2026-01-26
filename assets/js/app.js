(function () {
  // Mobile menu
  const burger = document.querySelector('.nav-burger');
  const mobile = document.querySelector('.nav-mobile');

  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = mobile.hasAttribute('hidden') === false;
      if (open) {
        mobile.setAttribute('hidden', '');
        burger.setAttribute('aria-expanded', 'false');
      } else {
        mobile.removeAttribute('hidden');
        burger.setAttribute('aria-expanded', 'true');
      }
    });

    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobile.setAttribute('hidden', '');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-inview');
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // Parallax (leve, tipo Framer)
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  function onScroll() {
    const y = window.scrollY || 0;
    parallaxEls.forEach(el => {
      const amt = parseFloat(el.getAttribute('data-parallax') || '0');
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewport = window.innerHeight / 2;
      const delta = (center - viewport) / window.innerHeight;
      const translate = Math.max(-22, Math.min(22, -delta * 24 * amt));
      el.style.transform = `translateY(${translate}px)`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Device switch
  const deviceBtns = Array.from(document.querySelectorAll('[data-device-btn]'));
  const deviceImgs = Array.from(document.querySelectorAll('[data-device]'));

  function setDevice(which) {
    deviceBtns.forEach(b => {
      const active = b.getAttribute('data-device-btn') === which;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    deviceImgs.forEach(img => {
      img.classList.toggle('is-active', img.getAttribute('data-device') === which);
    });
  }
  deviceBtns.forEach(b => b.addEventListener('click', () => setDevice(b.getAttribute('data-device-btn'))));
  setDevice('mobile');

  // Pricing billing toggle
  const billingBtns = Array.from(document.querySelectorAll('[data-billing]'));
  const priceMonthly = document.querySelectorAll('.price-monthly');
  const priceAnnually = document.querySelectorAll('.price-annually');

  function setBilling(mode) {
    billingBtns.forEach(b => {
      const active = b.getAttribute('data-billing') === mode;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // Premium: $189 (monthly) / $87 (annually)
    priceMonthly.forEach(el => el.hidden = (mode === 'annually'));
    priceAnnually.forEach(el => el.hidden = (mode !== 'annually'));
  }

  billingBtns.forEach(b => b.addEventListener('click', () => setBilling(b.getAttribute('data-billing'))));
  setBilling('monthly');
})();
