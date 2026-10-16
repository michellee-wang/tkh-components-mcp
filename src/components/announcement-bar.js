import { content, esc, withDefaults, button } from '../base.js';

export default {
  name: 'announcement-bar',
  title: 'Announcement Bar',
  category: 'marketing',
  description:
    '80px lavender (#C0BFF8) strip directly under the header. Centered row: 20px black message (emoji-friendly) + 16px gap + a 151x52 purple "Apply Today" button with 8px radius and a white ripple fill. Stacks vertically below 768px.',
  props: {
    text: { type: 'string', default: content.announcement.text },
    cta: { type: 'object', description: '{label, href}', default: content.announcement.cta },
    background: { type: 'string', description: 'CSS color', default: 'var(--tkh-lavender)' },
  },
  css: `
.tkh-announce { min-height: 80px; display: flex; align-items: center; justify-content: center; padding: 14px 15px; text-align: center; }
.tkh-announce__row { display: flex; align-items: center; justify-content: center; gap: 16px; }
.tkh-announce__text { font-size: 20px; line-height: 30px; color: var(--tkh-black); }
.tkh-announce .tkh-btn { width: 151px; height: 52px; padding: 0; font-size: 16.2px; }
@media (max-width: 767.98px) { .tkh-announce__row { flex-direction: column; gap: 8px; } }
`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    return `<section class="tkh-announce" style="background:${esc(p.background)}">
  <div class="tkh-announce__row">
    <p class="tkh-announce__text">${esc(p.text)}</p>
    ${p.cta ? button({ ...p.cta, variant: 'tertiary', size: 'md', rounded: true }) : ''}
  </div>
</section>`;
  },
};
