import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { baseCss, baseJs, tokens, content, tokensCss, FONT_LINK, esc } from './base.js';

import header from './components/header.js';
import announcementBar from './components/announcement-bar.js';
import heroVideo from './components/hero-video.js';
import mission from './components/mission.js';
import pillars from './components/pillars.js';
import testimonials from './components/testimonials.js';
import newsGrid from './components/news-grid.js';
import footer from './components/footer.js';
import legalBar from './components/legal-bar.js';
import buttonC from './components/button.js';

const here = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(here, '..', 'components', '_raw');

/** Page order matches the live homepage. */
export const components = [header, announcementBar, heroVideo, mission, pillars, testimonials, newsGrid, footer, legalBar, buttonC];
export const byName = Object.fromEntries(components.map((c) => [c.name, c]));
/** Raw captured markup file name differs for a few components. */
const RAW_ALIAS = { 'news-grid': 'news', header: 'header' };

export const DEFAULT_PAGE = ['header', 'announcement-bar', 'hero-video', 'mission', 'pillars', 'testimonials', 'news-grid', 'footer', 'legal-bar'];

export function getRaw(name) {
  const f = join(RAW_DIR, `${RAW_ALIAS[name] || name}.html`);
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
}

export function summary(c) {
  return { name: c.name, title: c.title, category: c.category, description: c.description, props: Object.keys(c.props) };
}

export function spec(c) {
  return {
    name: c.name,
    title: c.title,
    category: c.category,
    description: c.description,
    props: Object.fromEntries(
      Object.entries(c.props).map(([k, v]) => [k, { type: v.type, description: v.description, enum: v.enum, default: v.default }])
    ),
    hasScript: Boolean(c.js),
    hasRawCapture: Boolean(getRaw(c.name)),
  };
}

function assertComponent(name) {
  const c = byName[name];
  if (!c) throw new Error(`Unknown component "${name}". Available: ${components.map((x) => x.name).join(', ')}`);
  return c;
}

export function renderComponent(name, props) {
  const c = assertComponent(name);
  return { html: c.render(props || {}), css: c.css.trim(), js: (c.js || '').trim() };
}

/** Build a complete standalone HTML document from a list of sections. */
export function renderPage(sections = DEFAULT_PAGE, { title = 'THE KNOWLEDGE HOUSE', extraCss = '', favicon = content.logo.favicon } = {}) {
  const list = sections.map((s) => (typeof s === 'string' ? { name: s } : s));
  const used = [];
  const body = list
    .map(({ name, props }) => {
      const c = assertComponent(name);
      if (!used.includes(c)) used.push(c);
      return c.render(props || {});
    })
    .join('\n');
  const css = [baseCss, ...used.map((c) => c.css), extraCss].filter(Boolean).join('\n');
  const js = [...used.map((c) => c.js).filter(Boolean), baseJs].join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="icon" href="${esc(favicon)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_LINK}">
<style>
${css}
</style>
</head>
<body>
${body}
<script>
${js}
</script>
</body>
</html>`;
}

export function search(query) {
  const q = query.toLowerCase().split(/\s+/).filter(Boolean);
  return components
    .map((c) => {
      const hay = `${c.name} ${c.title} ${c.category} ${c.description} ${Object.keys(c.props).join(' ')}`.toLowerCase();
      const score = q.reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0);
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => summary(x.c));
}

export { tokens, content, baseCss, baseJs, tokensCss };
