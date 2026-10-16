import { content, esc, withDefaults } from '../base.js';

export default {
  name: 'mission',
  title: 'Mission Statement Block',
  category: 'content',
  description:
    'Warm off-white (#F6F3F1) section. Centered column (max about 979px). H2 36px/45px Lato Black, then paragraphs at 18px/27px in black, centered, with 48px outer margin and 30px between paragraphs. Each block fades in on scroll.',
  props: {
    title: { type: 'string', default: content.mission.title },
    paragraphs: { type: 'array', description: 'Array of strings', default: content.mission.paragraphs },
    background: { type: 'string', default: 'var(--tkh-off-white)' },
  },
  css: `
.tkh-mission { padding: 16px; }
.tkh-mission__col { max-width: 979px; margin: 0 auto; padding: 24px; text-align: center; }
.tkh-mission__body { margin: 48px; }
.tkh-mission__body p { color: var(--tkh-black); font-size: 18px; line-height: 27px; }
.tkh-mission__body p + p { margin-top: 30px; }
@media (max-width: 767.98px) { .tkh-mission__body { margin: 8px; } .tkh-mission h2 { font-size: 30px; line-height: 38px; } }
`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    return `<section class="tkh-mission" style="background:${esc(p.background)}">
  <div class="tkh-mission__col">
    <h2 data-tkh-reveal>${esc(p.title)}</h2>
    <div class="tkh-mission__body" data-tkh-reveal>${p.paragraphs.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
  </div>
</section>`;
  },
};
