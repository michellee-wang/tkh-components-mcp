import { content, esc, withDefaults } from '../base.js';

export default {
  name: 'hero-video',
  title: 'Hero Video Stage',
  category: 'hero',
  description:
    'Full-width stage (about 641px tall on desktop) with a light-gray background image of flowing lavender wave-line art, and a centered 16:9 video (max 926px wide) that autoplays muted on loop. On the live site the video is a pre-rendered timeline slideshow (giant year, purple column with rotated year, B&W photo, purple caps subtitle, thick black rule, bold caption). Swap `video` for your own MP4, or pass `image` to show a still instead.',
  props: {
    video: { type: 'string', description: 'MP4 URL (omit if using image)', default: content.hero.video },
    poster: { type: 'string', default: content.hero.poster },
    image: { type: 'string', description: 'Optional still image instead of video', default: '' },
    background: { type: 'string', description: 'Section background image URL', default: content.hero.background },
    controls: { type: 'boolean', default: false },
  },
  css: `
.tkh-hero { background-color: #F3F4F3; background-size: cover; background-position: center; padding: 57px 15px 63px; display: flex; justify-content: center; }
.tkh-hero__media { width: min(926px, 100%); aspect-ratio: 16 / 9; display: block; object-fit: contain; background: transparent; }
@media (max-width: 767.98px) { .tkh-hero { padding: 24px 0; } }
`,
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    const media = p.image
      ? `<img class="tkh-hero__media" src="${esc(p.image)}" alt="">`
      : `<video class="tkh-hero__media" src="${esc(p.video)}" poster="${esc(p.poster)}" autoplay muted loop playsinline${p.controls ? ' controls' : ''}></video>`;
    return `<section class="tkh-hero" style="background-image:url('${esc(p.background)}')">${media}</section>`;
  },
};
