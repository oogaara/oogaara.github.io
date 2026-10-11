const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mobileNav.hidden = isOpen;
});

mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
}));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.desktop-nav a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (![...navLinks].some(link => link.getAttribute('href') === `#${entry.target.id}`)) return;
    navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => observer.observe(section));

const assemblyScene = document.querySelector('[data-assembly-scene]');
if (assemblyScene && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const conduit = document.querySelector('.scroll-conduit');
  const portfolioMain = document.querySelector('.portfolio-main');
  const clamp = value => Math.max(0, Math.min(1, value));
  const phase = (value, start, end) => clamp((value - start) / (end - start));
  let frame = 0;

  const updateAssembly = () => {
    frame = 0;
    const section = assemblyScene.querySelector('.projects');
    const sceneRect = assemblyScene.getBoundingClientRect();
    const pinned = window.matchMedia('(min-width: 901px)').matches;
    const distance = assemblyScene.offsetHeight - section.offsetHeight;
    const progress = pinned
      ? clamp(-sceneRect.top / Math.max(1, distance))
      : clamp((window.innerHeight * .9 - section.getBoundingClientRect().top) / (window.innerHeight * .75));

    const core = phase(progress, .16, .78);
    const neon = phase(progress, .34, .94);
    const third = phase(progress, .24, .44);
    const second = phase(progress, .47, .67);
    const first = phase(progress, .67, .86);
    const scan = neon > 0 && neon < 1 ? Math.sin(neon * Math.PI) : 0;
    const style = assemblyScene.style;

    style.setProperty('--pole-cut', `${Math.round((1 - core) * 100)}%`);
    style.setProperty('--neon-cut', `${Math.round((1 - neon) * 100)}%`);
    style.setProperty('--guide-opacity', phase(progress, .02, .17).toFixed(3));
    style.setProperty('--segment-one', first.toFixed(3));
    style.setProperty('--segment-two', second.toFixed(3));
    style.setProperty('--segment-three', third.toFixed(3));
    style.setProperty('--segment-one-y', `${Math.round((1 - first) * 30)}px`);
    style.setProperty('--segment-two-y', `${Math.round((1 - second) * 35)}px`);
    style.setProperty('--segment-three-y', `${Math.round((1 - third) * 38)}px`);
    style.setProperty('--scan-opacity', scan.toFixed(3));
    style.setProperty('--scan-y', `${Math.round(neon * 100)}%`);
    style.setProperty('--ambient-shift', `${Math.round((progress - .5) * 64)}px`);
    style.setProperty('--ambient-opacity', (.18 + progress * .16).toFixed(3));

    if (conduit && portfolioMain) {
      const pole = assemblyScene.querySelector('.assembly-pole');
      const neonLine = assemblyScene.querySelector('.pole-neon');
      const mainRect = portfolioMain.getBoundingClientRect();
      const span = Math.max(1, assemblyScene.offsetTop + pole.offsetTop);
      const head = Math.max(0, Math.min(span, window.innerHeight * .78 - mainRect.top));
      const heroHeight = portfolioMain.querySelector('.hero').offsetHeight;
      const conduitStyle = conduit.style;
      const gutterX = Math.max(10, Math.round(portfolioMain.clientWidth * .022));
      const poleX = neonLine.getBoundingClientRect().left - mainRect.left + 2;
      conduitStyle.setProperty('--trace-x', `${gutterX}px`);
      conduitStyle.setProperty('--bridge-width', `${Math.max(0, Math.round(poleX - gutterX))}px`);
      conduitStyle.setProperty('--trace-span', `${Math.round(span)}px`);
      conduitStyle.setProperty('--trace-progress', (head / span).toFixed(5));
      conduitStyle.setProperty('--bridge-progress', phase(head / span, .96, 1).toFixed(3));
      conduitStyle.setProperty('--node-one', phase(head / span, .25, .265).toFixed(3));
      conduitStyle.setProperty('--node-two', phase(head / span, .54, .555).toFixed(3));
      conduitStyle.setProperty('--node-three', phase(head / span, .83, .845).toFixed(3));
      conduitStyle.setProperty('--hero-line-height', `${heroHeight}px`);
      conduitStyle.setProperty('--trace-origin-progress', Math.min(1, head / heroHeight).toFixed(5));
      conduitStyle.setProperty('--trace-head-y', `${Math.round(head)}px`);
      const headOpacity = head < span
        ? head < 360 || head > span - 140 ? .72 : .18
        : Math.max(0, 1 - progress * 5);
      conduitStyle.setProperty('--trace-head-opacity', String(headOpacity));
    }
  };

  const requestAssembly = () => {
    if (!frame) frame = requestAnimationFrame(updateAssembly);
  };
  window.addEventListener('scroll', requestAssembly, { passive: true });
  window.addEventListener('resize', requestAssembly);
  requestAssembly();
}
