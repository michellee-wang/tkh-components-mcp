import { esc, withDefaults, button } from '../base.js';

export default {
  name: 'button',
  title: 'Ripple Button (primitive)',
  category: 'primitive',
  description:
    'Square-cornered Lato Bold button. On hover a circle grows from the cursor entry point (width/height 0.6s) and floods the button. primary = gold #FFC20A with purple text that floods purple and turns the text white. tertiary = purple #332459 with white text that floods white and turns the text purple. Sizes: sm (16px, 13px 27px padding), md (18px, 20px 60px padding). rounded adds an 8px radius (used only on the "Apply Today" button).',
  props: {
    label: { type: 'string', default: 'Donate' },
    href: { type: 'string', default: '#' },
    variant: { type: 'string', enum: ['primary', 'tertiary'], default: 'primary' },
    size: { type: 'string', enum: ['sm', 'md'], default: 'md' },
    rounded: { type: 'boolean', default: false },
    newTab: { type: 'boolean', default: false },
  },
  css: '',
  render(props) {
    const p = withDefaults(Object.fromEntries(Object.entries(this.props).map(([k, v]) => [k, v.default])), props);
    return `<div style="padding:24px;display:flex;gap:16px;background:#fff">${button(p)}</div>`;
  },
};
