import { content, esc, withDefaults, button } from '../base.js';

export default {
  name: 'header',
  title: 'Site Header (desktop nav + dropdowns + mobile burger)',
  category: 'navigation',
  description:
    'White 96px header. Logo left, bold purple nav links right with a gold hover underline that grows from the center (scaleX 0 to 1, 0.3s), Superfish-style gray dropdown panels, and a gold square "Donate" button with a purple ripple fill. Below 992px the nav collapses into a 2-line burger that opens a fullscreen purple overlay.',
  props: {
    logo: { type: 'string', description: 'Logo image URL', default: content.logo.desktop },
    logoAlt: { type: 'string', default: 'TKH Logo' },
    homeHref: { type: 'string', default: '/' },
    nav: { type: 'array', description: 'Items: {label, href, children?: [{label, href}]}', default: content.nav },
    cta: { type: 'object', description: '{label, href} for the gold button', default: content.donate },
  },
  css: `
.tkh-header { background: var(--tkh-white); position: relative; z-index: 50; }
.tkh-header__inner { height: var(--tkh-header-h); display: flex; align-items: center; justify-content: space-between; }
.tkh-header__logo img { height: 64px; width: auto; display: block; }
.tkh-header__right { display: flex; align-items: center; }
.tkh-nav { display: flex; align-items: center; list-style: none; gap: 18px; margin-right: 21px; }
.tkh-nav > li { position: relative; }
.tkh-nav > li > a { display: block; font-size: 18px; line-height: 27px; font-weight: 700; color: var(--tkh-purple-nav); padding: 34px 0; }
.tkh-nav > li > a > span { position: relative; padding: 0 8px; }
.tkh-nav > li > a > span::after {
  content: ''; position: absolute; left: 0; bottom: -5px; width: 100%; height: 2px;
  background: var(--tkh-gold); transform: scaleX(0); transition: all .3s;
}
.tkh-nav > li:hover > a { color: var(--tkh-gold); }
.tkh-nav > li:hover > a > span::after { transform: scaleX(1); }
.tkh-nav__sub {
  position: absolute; top: calc(100% - 3px); left: -17px; min-width: 250px;
  list-style: none; padding: 30px 0 30px 20px; background: var(--tkh-dropdown-gray);
  box-shadow: var(--tkh-shadow-dropdown);
  opacity: 0; visibility: hidden; transform: translateY(6px);
  transition: opacity .3s, transform .3s, visibility .3s;
}
.tkh-nav > li:hover > .tkh-nav__sub, .tkh-nav > li:focus-within > .tkh-nav__sub { opacity: 1; visibility: visible; transform: none; }
.tkh-nav__sub a { display: flex; align-items: center; padding: 4px 40px; font-size: 16px; line-height: 1.8; color: var(--tkh-purple-nav); white-space: nowrap; }
.tkh-nav__sub a:hover { color: var(--tkh-white); }
.tkh-burger { display: none; width: 34px; height: 20px; position: relative; background: none; border: 0; cursor: pointer; padding: 0; }
.tkh-burger span { position: absolute; left: 0; width: 100%; height: 2px; background: var(--tkh-purple-nav); transition: transform .3s, top .3s; }
.tkh-burger span:nth-child(1) { top: 4px; }
.tkh-burger span:nth-child(2) { top: 14px; }
.tkh-header.is-open .tkh-burger span { background: var(--tkh-white); }
.tkh-header.is-open .tkh-burger span:nth-child(1) { top: 9px; transform: rotate(45deg); }
.tkh-header.is-open .tkh-burger span:nth-child(2) { top: 9px; transform: rotate(-45deg); }
.tkh-overlay {
  position: fixed; inset: 0; background: var(--tkh-purple); z-index: 40;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
  opacity: 0; visibility: hidden; transition: opacity .4s, visibility .4s; overflow-y: auto; padding: 100px 20px 40px;
}
.tkh-overlay a { color: var(--tkh-white); font-size: 28px; font-weight: 900; }
.tkh-overlay a:hover { color: var(--tkh-gold); }
.tkh-overlay .tkh-overlay__sub a { font-size: 16px; font-weight: 400; color: var(--tkh-lavender); }
.tkh-overlay .tkh-overlay__sub { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 18px; margin-top: -10px; }
.tkh-header.is-open + .tkh-overlay { opacity: 1; visibility: visible; }
@media (max-width: 991.98px) {
  .tkh-header__inner { height: auto; padding-top: 16px; padding-bottom: 16px; }
  .tkh-header__logo img { height: 5vh; min-height: 36px; }
  .tkh-nav, .tkh-header__right .tkh-btn { display: none; }
  .tkh-burger { display: block; z-index: 60; }
  .tkh-header.is-open { background: transparent; position: fixed; inset: 0 0 auto 0; }
}
`,
  js: `(() => {
  document.querySelectorAll('.tkh-header').forEach((h) => {
    const b = h.querySelector('.tkh-burger');
    if (b) b.addEventListener('click', () => {
      const open = h.classList.toggle('is-open');
      b.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  });
})();`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    const items = p.nav
      .map((it) => {
        const sub = it.children?.length
          ? `<ul class="tkh-nav__sub">${it.children.map((c) => `<li><a href="${esc(c.href)}">${esc(c.label)}</a></li>`).join('')}</ul>`
          : '';
        return `<li><a href="${esc(it.href)}"><span>${esc(it.label)}</span></a>${sub}</li>`;
      })
      .join('');
    const overlay = p.nav
      .map((it) => {
        const sub = it.children?.length
          ? `<div class="tkh-overlay__sub">${it.children.map((c) => `<a href="${esc(c.href)}">${esc(c.label)}</a>`).join('')}</div>`
          : '';
        return `<a href="${esc(it.href)}">${esc(it.label)}</a>${sub}`;
      })
      .join('');
    return `<header class="tkh-header">
  <div class="tkh-container tkh-header__inner">
    <a class="tkh-header__logo" href="${esc(p.homeHref)}"><img src="${esc(p.logo)}" alt="${esc(p.logoAlt)}"></a>
    <div class="tkh-header__right">
      <nav aria-label="Main"><ul class="tkh-nav">${items}</ul></nav>
      ${p.cta ? button({ ...p.cta, variant: 'primary', size: 'sm' }) : ''}
      <button class="tkh-burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="tkh-overlay">${overlay}${p.cta ? button({ ...p.cta, variant: 'primary', size: 'md' }) : ''}</div>`;
  },
};
