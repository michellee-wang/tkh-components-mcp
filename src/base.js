// Shared foundation: tokens as CSS variables, typography, buttons, scrollbar, reveal animation.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const tokens = JSON.parse(readFileSync(join(here, 'tokens.json'), 'utf8'));
export const content = JSON.parse(readFileSync(join(here, 'content.json'), 'utf8'));

export const FONT_LINK = tokens.font.family.import;

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Merge user props over defaults (shallow; arrays replace). */
export const withDefaults = (defaults, props = {}) => ({ ...defaults, ...(props || {}) });

export function tokensCss() {
  const c = tokens.color;
  return `:root {
  --tkh-purple: ${c.purple.value};
  --tkh-purple-news: ${c.purpleNews.value};
  --tkh-purple-nav: ${c.purpleNav.value};
  --tkh-gold: ${c.gold.value};
  --tkh-lavender: ${c.lavender.value};
  --tkh-off-white: ${c.offWhite.value};
  --tkh-footer-gray: ${c.footerGray.value};
  --tkh-dropdown-gray: ${c.dropdownGray.value};
  --tkh-text: ${c.text.value};
  --tkh-black: ${c.black.value};
  --tkh-white: ${c.white.value};
  --tkh-font: ${tokens.font.family.value};
  --tkh-container: ${tokens.layout.containerMax};
  --tkh-header-h: ${tokens.layout.headerHeight};
  --tkh-shadow-dropdown: ${tokens.shadow.dropdown};
}`;
}

export const baseCss = `${tokensCss()}

*, *::before, *::after { box-sizing: border-box; }
html { overflow-x: hidden; }
body {
  margin: 0;
  font-family: var(--tkh-font);
  font-size: 18px; line-height: 27px; font-weight: 400;
  color: var(--tkh-text);
  background-color: var(--tkh-purple);
  overflow-x: hidden;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4, h5, h6, p { margin: 0; }
h2 { font-size: 36px; line-height: 45px; font-weight: 900; color: var(--tkh-black); }
h3 { font-size: 21px; line-height: 29.4px; font-weight: 900; color: var(--tkh-black); }
a { color: inherit; text-decoration: none; transition: color .3s; }
img { max-width: 100%; }
ul { margin: 0; padding: 0; }

.tkh-container { width: 100%; max-width: var(--tkh-container); margin: 0 auto; padding: 0 15px; }

/* Scrollbar: 5px, gold thumb over a faint track (reads purple because body is purple) */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background-color: rgba(16,16,16,.05); }
::-webkit-scrollbar-thumb { background-color: var(--tkh-gold); }

/* Buttons with cursor-origin circular ripple fill */
.tkh-btn {
  position: relative; z-index: 0; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--tkh-font); font-weight: 700; text-align: center; white-space: nowrap;
  border: 0; border-radius: 0; cursor: pointer; text-decoration: none;
  transition: color .3s;
}
.tkh-btn > .tkh-ripple {
  position: absolute; z-index: -1; display: block; width: 0; height: 0;
  border-radius: 50%; transform: translate(-50%, -50%);
  transition: width .6s, height .6s; pointer-events: none;
}
.tkh-btn:hover > .tkh-ripple { width: var(--tkh-ripple, 640px); height: var(--tkh-ripple, 640px); }
.tkh-btn--sm { font-size: 16px; line-height: 17.6px; padding: 13px 27px; }
.tkh-btn--md { font-size: 18px; line-height: 19.8px; padding: 20px 60px; }
/* primary: gold -> purple flood, text white */
.tkh-btn--primary { background-color: var(--tkh-gold); color: var(--tkh-purple); }
.tkh-btn--primary > .tkh-ripple { background-color: var(--tkh-purple); }
.tkh-btn--primary:hover { color: var(--tkh-white); }
/* tertiary: purple -> white flood, text purple */
.tkh-btn--tertiary { background-color: var(--tkh-purple); color: var(--tkh-white); }
.tkh-btn--tertiary > .tkh-ripple { background-color: var(--tkh-white); }
.tkh-btn--tertiary:hover { color: var(--tkh-purple); }
.tkh-btn--rounded { border-radius: 8px; }

/* Scroll reveal (AOS "fade", 400ms ease) */
[data-tkh-reveal] { opacity: 0; transition: opacity .4s ease; }
[data-tkh-reveal].is-revealed { opacity: 1; }
@media (prefers-reduced-motion: reduce) { [data-tkh-reveal] { opacity: 1; transition: none; } }
`;

export const baseJs = `(() => {
  // Ripple origin follows the cursor entry/exit point.
  document.querySelectorAll('.tkh-btn').forEach((btn) => {
    let r = btn.querySelector('.tkh-ripple');
    if (!r) { r = document.createElement('span'); r.className = 'tkh-ripple'; btn.appendChild(r); }
    const place = (e) => {
      const b = btn.getBoundingClientRect();
      r.style.left = (e.clientX - b.left) + 'px';
      r.style.top = (e.clientY - b.top) + 'px';
      btn.style.setProperty('--tkh-ripple', Math.ceil(Math.max(b.width, b.height) * 2.5) + 'px');
    };
    btn.addEventListener('mouseenter', place);
    btn.addEventListener('mouseleave', place);
  });
  // Fade-in on scroll.
  const els = document.querySelectorAll('[data-tkh-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-revealed')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-revealed'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -120px 0px' });
  els.forEach((e) => io.observe(e));
})();`;

/** Shared button markup helper. */
export function button({ label, href = '#', variant = 'primary', size = 'md', rounded = false, newTab = true, style = '' }) {
  const cls = ['tkh-btn', `tkh-btn--${variant}`, `tkh-btn--${size}`, rounded ? 'tkh-btn--rounded' : ''].filter(Boolean).join(' ');
  const target = newTab ? ' target="_blank" rel="noopener"' : '';
  const st = style ? ` style="${esc(style)}"` : '';
  return `<a class="${cls}" href="${esc(href)}"${target}${st}>${esc(label)}<span class="tkh-ripple"></span></a>`;
}
