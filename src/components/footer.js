import { content, esc, withDefaults } from '../base.js';

const pin = `<svg viewBox="0 0 24 24" width="18" height="22" aria-hidden="true"><path fill="currentColor" d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9zm0 12.5A3.5 3.5 0 1 1 12 5.5a3.5 3.5 0 0 1 0 7z"/></svg>`;
const mail = `<svg viewBox="0 0 24 18" width="22" height="17" aria-hidden="true"><path fill="currentColor" d="M0 0h24v2.2L12 10 0 2.2V0zm0 4.6l12 7.8 12-7.8V18H0V4.6z"/></svg>`;

export default {
  name: 'footer',
  title: 'Site Footer (link columns, contact, brand block, social, badges)',
  category: 'navigation',
  description:
    'Light gray (#E2E2E2) footer with 48px vertical padding. Link columns have 21px Lato Black headings (24px below) and 16px black links with small chevron markers (8px apart, 20px indent). The Contact column uses map-pin and envelope icons. The brand block holds a large horizontal logo, 5 black circular social icons (max 40px, evenly spaced) and 2 trust badges. At 1200px+ the brand block is the first (left) column of a ~83% wide row; below that it moves to the bottom and centers.',
  props: {
    columns: { type: 'array', description: 'Columns: {title, links: [{label, href}]}', default: content.footer.columns },
    contact: { type: 'object', description: '{address: string[], email}', default: content.footer.contact },
    logo: { type: 'string', default: content.logo.footer },
    social: { type: 'array', description: 'Items: {label, href, icon}', default: content.footer.social },
    badges: { type: 'array', description: 'Items: {label, href, image}', default: content.footer.badges },
    background: { type: 'string', default: 'var(--tkh-footer-gray)' },
  },
  css: `
.tkh-footer { padding: 48px 15px; color: var(--tkh-black); }
.tkh-footer__row { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; max-width: 1140px; margin: 0 auto; }
.tkh-footer__links { flex: 0 0 100%; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; row-gap: 24px; }
.tkh-footer__col { flex: 0 0 33.333%; padding: 0 15px; margin-bottom: 8px; display: flex; justify-content: center; }
.tkh-footer__col h2 { font-size: 21px; line-height: 26.25px; font-weight: 900; color: var(--tkh-black); margin-bottom: 24px; }
.tkh-footer__col ul { list-style: none; padding-left: 20px; }
.tkh-footer__col li { position: relative; margin-top: 8px; font-size: 16px; line-height: 24px; }
.tkh-footer__col li a::before {
  content: ''; position: absolute; left: -16px; top: 9px; width: 6px; height: 6px;
  border-top: 1.5px solid currentColor; border-right: 1.5px solid currentColor; transform: rotate(45deg);
}
.tkh-footer__col a:hover { color: var(--tkh-purple); }
.tkh-footer__contact li { display: flex; gap: 14px; align-items: flex-start; font-size: 16px; line-height: 24px; margin-top: 8px; margin-left: -28px; }
.tkh-footer__contact li a::before { display: none; }
.tkh-footer__contact svg { flex: 0 0 auto; margin-top: 2px; width: 22px; }
.tkh-footer__brand { flex: 0 0 100%; order: 99; max-width: 640px; padding: 0 15px; margin-bottom: 16px; text-align: center; }
.tkh-footer__logo { width: 91.66%; display: block; margin: 0 auto 16px; }
.tkh-footer__social { display: flex; justify-content: space-around; align-items: center; width: 91.66%; margin: 0 auto; }
.tkh-footer__social img { width: 40px; height: 40px; border-radius: 50%; display: block; transition: transform .3s; }
.tkh-footer__social a:hover img { transform: translateY(-2px); }
.tkh-footer__badges { display: flex; justify-content: center; gap: 12px; margin-top: 16px; }
.tkh-footer__badges img { height: 90px; width: auto; display: block; }
@media (max-width: 767.98px) { .tkh-footer__col { flex-basis: 50%; justify-content: flex-start; } }
@media (min-width: 1200px) {
  .tkh-footer__row { max-width: 1320px; flex-wrap: nowrap; align-items: center; gap: 24px; }
  .tkh-footer__brand { order: -1; flex: 0 0 30%; margin-bottom: 0; }
  .tkh-footer__links { flex: 1 1 auto; }
}
`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    const cols = p.columns
      .map(
        (c) => `<div class="tkh-footer__col"><div>
      <h2>${esc(c.title)}</h2>
      <ul>${c.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul>
    </div></div>`
      )
      .join('');
    const contact = p.contact
      ? `<div class="tkh-footer__col"><div>
      <h2>Contact Info</h2>
      <ul class="tkh-footer__contact">
        <li>${pin}<span>${p.contact.address.map(esc).join('<br>')}</span></li>
        <li>${mail}<a href="mailto:${esc(p.contact.email)}">${esc(p.contact.email)}</a></li>
      </ul>
    </div></div>`
      : '';
    const social = p.social
      .map((s) => `<a href="${esc(s.href)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}"><img src="${esc(s.icon)}" alt="${esc(s.label)}"></a>`)
      .join('');
    const badges = p.badges
      .map((b) => `<a href="${esc(b.href)}" target="_blank" rel="noopener"><img src="${esc(b.image)}" alt="${esc(b.label)}"></a>`)
      .join('');
    return `<footer class="tkh-footer" style="background:${esc(p.background)}">
  <div class="tkh-footer__row">
    <div class="tkh-footer__brand">
      <img class="tkh-footer__logo" src="${esc(p.logo)}" alt="The Knowledge House">
      <div class="tkh-footer__social">${social}</div>
      <div class="tkh-footer__badges">${badges}</div>
    </div>
    <div class="tkh-footer__links">${cols}${contact}</div>
  </div>
</footer>`;
  },
};
