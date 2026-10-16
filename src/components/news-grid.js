import { content, esc, withDefaults } from '../base.js';

export default {
  name: 'news-grid',
  title: 'Recent News Grid',
  category: 'content',
  description:
    'Deep purple (#342459) section. Centered column (~75% width, 48px padding). White H2 + 18px white subtitle. Cards flow 3 across at 1200px+, 2 across at 992px+ (an odd last card is centered), and 1 below that. Each card is a single link that opens in a new tab: a 210px-tall cover image (no radius, no shadow) + a centered white 20px/28px weight-500 title, 16px above.',
  props: {
    title: { type: 'string', default: content.news.title },
    subtitle: { type: 'string', default: content.news.subtitle },
    items: { type: 'array', description: 'Items: {title, href, image}', default: content.news.items },
    background: { type: 'string', default: 'var(--tkh-purple-news)' },
  },
  css: `
.tkh-news { padding: 0 15px; }
.tkh-news__col { max-width: 75%; margin: 0 auto; padding: 48px; text-align: center; }
.tkh-news__col > h2 { color: var(--tkh-white); margin-bottom: 8px; }
.tkh-news__sub { color: var(--tkh-white); margin-bottom: 16px; }
.tkh-news__grid { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; margin: 0 -15px; }
.tkh-news__card { flex: 0 0 100%; padding: 16px; }
.tkh-news__card a { display: block; margin: 4px; }
.tkh-news__img { height: 210px; width: 100%; background-size: cover; background-position: center; background-repeat: no-repeat; }
.tkh-news__card h3 { color: var(--tkh-white); font-size: 20px; line-height: 28px; font-weight: 500; margin-top: 16px; text-align: center; }
.tkh-news__card a:hover h3 { color: var(--tkh-gold); }
@media (min-width: 992px) { .tkh-news__card { flex-basis: 50%; } }
@media (min-width: 1200px) { .tkh-news__card { flex-basis: 33.333%; } }
@media (max-width: 767.98px) { .tkh-news__col { max-width: 100%; padding: 32px 0; } }
`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    const cards = p.items
      .map(
        (n) => `<div class="tkh-news__card" data-tkh-reveal>
        <a href="${esc(n.href)}" target="_blank" rel="noopener">
          <div class="tkh-news__img" style="background-image:url('${esc(n.image)}')"></div>
          <h3>${esc(n.title)}</h3>
        </a>
      </div>`
      )
      .join('');
    return `<section class="tkh-news" style="background:${esc(p.background)}">
  <div class="tkh-news__col">
    <h2 data-tkh-reveal>${esc(p.title)}</h2>
    <p class="tkh-news__sub" data-tkh-reveal>${esc(p.subtitle)}</p>
    <div class="tkh-news__grid">${cards}</div>
  </div>
</section>`;
  },
};
