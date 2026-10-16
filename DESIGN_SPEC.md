# The Knowledge House homepage: UI/UX spec

Source: https://www.theknowledgehouse.org/ (measured at a 1177px desktop viewport).

## Foundations
- **Stack (original):** Bootstrap 4 grid (container max 1140px, 15px gutters), Swiper, AOS 2.3.1, Superfish menus, Font Awesome 4.7, Lato via Google Fonts, VLThemes (`vlt-*`) template.
- **Font:** Lato only. Weights 400 / 500 / 700 / 900. Antialiased. `overflow-x: hidden` on html/body.
- **Type scale:**
  - Body 18px/27px 400 #525252
  - H2 36px/45px 900 #000
  - H3 21px/29.4px 900 #000
  - Nav 18px/27px 700 #291B4B
  - Dropdown 16px/1.8 400 #291B4B
  - Announcement 20px/30px #000
  - News title 20px/28px 500 #fff
  - Footer heading 21px 900
  - Footer link 16px/24px
  - Slider control 13px 700 uppercase, 2px tracking
  - Legal 14px
- **Colors:**
  - Purple #332459 (body bg, buttons)
  - News purple #342459
  - Nav purple #291B4B
  - Gold #FFC20A
  - Lavender #C0BFF8
  - Off-white #F6F3F1
  - Footer gray #E2E2E2
  - Dropdown gray #E7E7E7
  - Text gray #525252
- **Shape:** Sharp corners everywhere. The only exception is the "Apply Today" button (8px radius). Social icons are circles. No card shadows.
- **Scrollbar:** 5px, gold thumb, rgba(16,16,16,.05) track over the purple body.

## Sections (top to bottom)
1. **Header** (96px, white, not sticky)
   - Logo on the left (64px tall).
   - Nav on the right: About, Programs, Training Solutions, Locations, Get Involved. About 34px between items.
   - Gold square Donate button (16px bold, 13px 27px padding).
   - Hover: text turns gold, and a 2px gold underline at bottom -5px scales from 0 to 1 (0.3s).
   - Dropdowns: #E7E7E7 panel, padding 30px 0 30px 20px, shadow 0 5px 10px rgba(16,16,16,.05). Items have 4px 40px padding and turn white on hover.
2. **Announcement bar** (80px, lavender)
   - Centered 20px message, then a 16px gap, then a 151x52 purple "Apply Today" button with 8px radius.
3. **Hero** (about 641px)
   - Light gray background with lavender wave-line art in the corners.
   - Centered 926x521 autoplay/muted/loop video: a pre-rendered timeline of years. Each frame has a giant black year, a purple column with the year rotated, a B&W photo, a purple caps subtitle, a thick black rule, and a bold caption.
4. **Mission** (off-white)
   - Centered column, about 979px.
   - H2 "11 years of Tech Workforce Development".
   - Two centered black 18px paragraphs, 48px outer margin, 30px apart.
5. **Pillars** (off-white)
   - 3 columns in about 785px: WE SERVE / WE EMPOWER / WE EDUCATE.
   - Each is an uppercase H3 above an 89px lavender circle icon with a purple glyph.
6. **Testimonials**
   - Wave-line background. Slider is left-aligned at about 83% width.
   - Each slide: portrait on the left (30vh, contain, circular photo with a gold ring), text on the right (min-height 420px): "TESTIMONIALS" H2, a #525252 quote, then the name and role in black.
   - Behavior: slide effect, 1000ms, 8s autoplay, loop, auto-height.
   - Controls: BACK n/total NEXT.
7. **Recent News** (#342459)
   - White H2 and subtitle.
   - Cards go 3/2/1 across at 1200/992/below. Each has a 210px cover image and a centered white 20px/500 title, and opens in a new tab.
8. **Footer** (#E2E2E2, 48px padding)
   - Columns: About, Programs, Locations, Get Involved, Contact Info (pin + envelope icons).
   - Chevron list markers.
   - Brand block: big logo, 5 black circle social icons (40px), Charity Navigator + Candid badges. It's the left column at 1200px+ and moves to the bottom below that.
9. **Legal bar** (lavender, 14px)
   - TERMS OF USE, PRIVACY POLICY, and the copyright, centered.

## Interactions
- **Ripple buttons:** a circle span grows from the cursor entry point (width/height 0.6s).
  - Primary: gold, floods purple, text turns white.
  - Tertiary: purple, floods white, text turns purple.
- **Scroll reveal:** AOS fade (400ms ease, no delay) on headings, paragraphs, pillars, slides, and news cards.
- **Links:** color transitions in 0.3s. External CTAs and news open in a new tab.

## Responsive
- **Below 992px:** the mobile header shows the logo at 5vh plus a 2-line burger, which opens a fullscreen nav overlay.
- **Below 768px:** the announcement stacks, pillars become 1 column, and footer columns go 2-up.
