import { content, esc, withDefaults } from '../base.js';

export default {
  name: 'pillars',
  title: 'Value Pillars (3-up icon row)',
  category: 'content',
  description:
    'Three equal columns inside a ~785px row on off-white. Each column: uppercase H3 label (21px, weight 900, nowrap, 16px below) above an 89x89 lavender circle icon with a dark purple glyph. Collapses to one column below 768px with 48px gaps.',
  props: {
    items: { type: 'array', description: 'Items: {label, icon}', default: content.pillars },
    background: { type: 'string', default: 'var(--tkh-off-white)' },
  },
  css: `
.tkh-pillars { padding: 0 15px 48px; }
.tkh-pillars__row { max-width: 785px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); }
.tkh-pillars__item { display: flex; flex-direction: column; align-items: center; padding: 0 15px; margin-bottom: 8px; }
.tkh-pillars__item h3 { margin-bottom: 16px; white-space: nowrap; text-transform: uppercase; }
.tkh-pillars__item img { width: 89px; height: 89px; display: block; }
.tkh-pillars__item .tkh-pillars__circle { width: 89px; height: 89px; border-radius: 50%; background: var(--tkh-lavender); display: flex; align-items: center; justify-content: center; color: var(--tkh-purple-nav); font-size: 40px; }
@media (max-width: 767.98px) { .tkh-pillars__row { grid-template-columns: 1fr; gap: 48px; } }
`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    const items = p.items
      .map(
        (it) => `<div class="tkh-pillars__item" data-tkh-reveal>
      <h3>${esc(it.label)}</h3>
      ${it.icon ? `<img src="${esc(it.icon)}" alt="" width="89" height="89">` : `<div class="tkh-pillars__circle">${esc(it.glyph || '')}</div>`}
    </div>`
      )
      .join('');
    return `<section class="tkh-pillars" style="background:${esc(p.background)}"><div class="tkh-pillars__row">${items}</div></section>`;
  },
};
