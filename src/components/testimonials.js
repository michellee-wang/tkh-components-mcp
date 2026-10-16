import { content, esc, withDefaults } from '../base.js';

export default {
  name: 'testimonials',
  title: 'Testimonials Slider',
  category: 'social-proof',
  description:
    'Wave-line background section with a left-aligned slider (~83% width on desktop). Each slide is two halves: left = portrait (30vh tall, background-size contain; source images are circular headshots with a thin gold ring), right = min-height 420px, vertically centered: "TESTIMONIALS" H2 (36px, 900, uppercase, 48px below), the quote in 18px/27px #525252 (48px below), the name in black prefixed with a long dash, and the role line in black. Seamless loop, 1000ms slide, 8s autoplay that keeps running after interaction, auto-height. Centered controls below: BACK  n/total  NEXT (13px bold, 2px tracking, uppercase).',
  props: {
    heading: { type: 'string', default: 'Testimonials' },
    items: { type: 'array', description: 'Items: {quote, name, role, image}', default: content.testimonials },
    background: { type: 'string', description: 'Background image URL', default: content.testimonialsBackground },
    autoplayMs: { type: 'number', default: 8000 },
    speedMs: { type: 'number', default: 1000 },
  },
  css: `
.tkh-testi { background-color: var(--tkh-off-white); background-size: cover; background-position: center; padding: 16px; }
.tkh-testi__col { width: 83.333%; padding: 0 15px; }
.tkh-testi__viewport { overflow: hidden; transition: height 1s; }
.tkh-testi__track { display: flex; will-change: transform; }
.tkh-testi__slide { flex: 0 0 100%; display: grid; grid-template-columns: 1fr 1fr; align-items: center; }
.tkh-testi__photo { height: 30vh; min-height: 220px; background-size: contain; background-position: center; background-repeat: no-repeat; margin-bottom: 16px; }
.tkh-testi__text { min-height: 420px; display: flex; align-items: center; padding: 16px; }
.tkh-testi__text h2 { text-transform: uppercase; margin: 8px 0 48px; }
.tkh-testi__quote { margin-bottom: 48px; color: var(--tkh-text); }
.tkh-testi__name, .tkh-testi__role { color: var(--tkh-black); }
.tkh-testi__role { margin-bottom: 16px; }
.tkh-testi__controls { display: flex; align-items: center; justify-content: center; height: 60px; padding: 0 30px; margin-top: 24px; color: var(--tkh-black); }
.tkh-testi__btn { background: none; border: 0; cursor: pointer; font: 700 13px/1 var(--tkh-font); letter-spacing: 2px; text-transform: uppercase; color: inherit; padding: 8px 0; transition: color .3s; }
.tkh-testi__btn:hover { color: var(--tkh-gold); }
.tkh-testi__frac { font-size: 16px; margin: 0 25px; }
@media (max-width: 991.98px) {
  .tkh-testi__col { width: 100%; }
  .tkh-testi__slide { grid-template-columns: 1fr; }
  .tkh-testi__text { min-height: 0; }
}
`,
  js: `(() => {
  document.querySelectorAll('.tkh-testi').forEach((root) => {
    const vp = root.querySelector('.tkh-testi__viewport');
    const track = root.querySelector('.tkh-testi__track');
    const real = [...track.children];
    const n = real.length; if (!n) return;
    const speed = +root.dataset.speed || 1000, delay = +root.dataset.autoplay || 8000;
    track.prepend(real[n - 1].cloneNode(true));
    track.append(real[0].cloneNode(true));
    let i = 1, busy = false, timer;
    const cur = root.querySelector('.tkh-testi__cur');
    const setH = () => { vp.style.height = track.children[i].offsetHeight + 'px'; };
    const go = (to, animate = true) => {
      i = to;
      track.style.transition = animate ? 'transform ' + speed + 'ms ease' : 'none';
      track.style.transform = 'translateX(' + (-100 * i) + '%)';
      cur.textContent = ((i - 1 + n) % n) + 1;
      setH();
    };
    track.addEventListener('transitionend', (e) => {
      if (e.target !== track) return;
      busy = false;
      if (i === 0) go(n, false);
      if (i === n + 1) go(1, false);
    });
    const step = (d) => { if (busy) return; busy = true; go(i + d); };
    const restart = () => { clearInterval(timer); timer = setInterval(() => step(1), delay); };
    root.querySelector('.tkh-testi__prev').addEventListener('click', () => { step(-1); restart(); });
    root.querySelector('.tkh-testi__next').addEventListener('click', () => { step(1); restart(); });
    window.addEventListener('resize', setH);
    window.addEventListener('load', setH);
    go(1, false); restart();
  });
})();`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    const slides = p.items
      .map(
        (t) => `<div class="tkh-testi__slide">
        <div class="tkh-testi__photo" style="background-image:url('${esc(t.image)}')" role="img" aria-label="${esc(t.name)}"></div>
        <div class="tkh-testi__text"><div>
          <h2>${esc(p.heading)}</h2>
          <p class="tkh-testi__quote">${esc(t.quote)}</p>
          <p class="tkh-testi__name">&#8212; ${esc(t.name)}</p>
          <p class="tkh-testi__role">${esc(t.role)}</p>
        </div></div>
      </div>`
      )
      .join('');
    return `<section class="tkh-testi" style="background-image:url('${esc(p.background)}')" data-autoplay="${p.autoplayMs}" data-speed="${p.speedMs}">
  <div class="tkh-testi__col">
    <div class="tkh-testi__viewport" data-tkh-reveal><div class="tkh-testi__track">${slides}</div></div>
    <div class="tkh-testi__controls">
      <button class="tkh-testi__btn tkh-testi__prev" aria-label="Previous slide">Back</button>
      <span class="tkh-testi__frac"><span class="tkh-testi__cur">1</span>/<span>${p.items.length}</span></span>
      <button class="tkh-testi__btn tkh-testi__next" aria-label="Next slide">Next</button>
    </div>
  </div>
</section>`;
  },
};
