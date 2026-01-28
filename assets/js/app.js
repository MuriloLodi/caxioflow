/* Dreelio static site behaviors:
   - Floating nav on scroll
   - Reveal animations on scroll (IntersectionObserver)
   - Active link highlighting
*/
(function(){
  const nav = document.querySelector('[data-nav]');
  const setFloating = () => {
    if(!nav) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('nav--floating', y > 80);
  };
  window.addEventListener('scroll', setFloating, {passive:true});
  setFloating();

  // Active link
  const path = (location.pathname || "").replace(/\/+$/, "");
  const isBlog = /\/blog(\/|$)/.test(path);
  document.querySelectorAll('[data-nav] a[data-nav-link]').forEach(a=>{
    const key = a.getAttribute('data-nav-link');
    if(key === 'blog' && isBlog) a.classList.add('is-active');
    if(key !== 'blog' && !isBlog && (location.pathname === '/' || location.pathname.endsWith('/index.html') || location.pathname.endsWith('/'))) {
      // only highlight home on the landing if you want later
    }
  });

  // Reveal
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if('IntersectionObserver' in window && items.length){
    const io = new IntersectionObserver((entries)=>{
      for (const e of entries){
        if(e.isIntersecting){
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      }
    }, {threshold:0.12});
    items.forEach(el=>io.observe(el));
  } else {
    items.forEach(el=>el.classList.add('in-view'));
  }

  // Share (best-effort)
  document.querySelectorAll('[data-share]').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      ev.preventDefault();
      const url = btn.getAttribute('data-url') || location.href;
      const text = btn.getAttribute('data-text') || document.title;
      if(navigator.share){
        navigator.share({title: document.title, text, url}).catch(()=>{});
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });
})();
