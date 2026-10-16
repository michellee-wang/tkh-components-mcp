import { content, esc, withDefaults } from '../base.js';

export default {
  name: 'legal-bar',
  title: 'Legal Bar',
  category: 'navigation',
  description:
    'Last strip of the page: lavender (#C0BFF8), 16px vertical padding, 14px text. One centered line: uppercase black links ("TERMS OF USE", "PRIVACY POLICY"), then a gray copyright line.',
  props: {
    links: { type: 'array', description: 'Items: {label, href}', default: content.legal.links },
    copyright: { type: 'string', default: content.legal.copyright },
    background: { type: 'string', default: 'var(--tkh-lavender)' },
  },
  css: `
.tkh-legal { padding: 16px 15px; font-size: 14px; line-height: 21px; }
.tkh-legal__row { display: flex; flex-wrap: wrap; justify-content: center; align-items: baseline; gap: 0 28px; }
.tkh-legal a { color: var(--tkh-black); text-transform: uppercase; }
.tkh-legal a:hover { color: var(--tkh-purple); }
.tkh-legal p { color: var(--tkh-text); margin-left: -20px; }
@media (max-width: 575.98px) { .tkh-legal p { margin-left: 0; width: 100%; text-align: center; } }
`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    return `<div class="tkh-legal" style="background:${esc(p.background)}">
  <div class="tkh-legal__row">
    ${p.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join('')}
    <p>${esc(p.copyright)}</p>
  </div>
</div>`;
  },
};
