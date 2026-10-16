# tkh-components-mcp

UI components, design tokens, and a UI/UX spec rebuilt from **theknowledgehouse.org**, served over the Model Context Protocol (MCP). Any MCP client (Claude Desktop, Claude Code, Cursor, etc.) can browse the components, customize them with props, and generate full pages in the TKH style.

- **No dependencies.** Plain Node 18+. Nothing to `npm install`.
- **Transport:** stdio (newline-delimited JSON-RPC 2.0). Protocol versions 2025-06-18, 2025-03-26, and 2024-11-05.

## Quick start

```bash
cd tkh-components-mcp
node scripts/test.js      # 14 protocol smoke tests
node scripts/export.js    # writes components/<name>/component.{html,css,js} + dist/*.html
open dist/index.html      # full homepage rebuild
```

## Connect it to a client

**Claude Code**
```bash
claude mcp add tkh-components -- node /ABSOLUTE/PATH/tkh-components-mcp/server.js
```

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`) / **Cursor** (`~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "tkh-components": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/tkh-components-mcp/server.js"]
    }
  }
}
```

## Tools

| Tool | What it does |
|---|---|
| `list_components` | Lists all components (optional `category` filter) |
| `get_component` | `name` + `format`: `spec`, `html`, `css`, `js`, `bundle` (default), `standalone`, `raw` (original captured markup). Accepts `props` overrides |
| `search_components` | Keyword search, e.g. "slider", "dropdown" |
| `get_design_tokens` | `json` / `css` (custom properties) / `base-css` (globals, ripple buttons, reveal) |
| `get_design_spec` | The full written UI/UX spec |
| `get_site_content` | Scraped content (nav, testimonials, news, footer...) as JSON |
| `render_page` | Composes `sections` (names, or `{name, props}`) into one standalone HTML doc. Optional `outputPath` writes it to disk |

**Resources:** `tkh://design-spec`, `tkh://tokens.json`, `tkh://base.css`, `tkh://content.json`, `tkh://page.html`, `tkh://component/{name}`, and `tkh://raw/{name}`.
**Prompt:** `build_tkh_page(goal)`.

## Components

| name | category | notes |
|---|---|---|
| `header` | navigation | Gold underline hover, gray dropdowns, Donate ripple button, burger + fullscreen overlay below 992px |
| `announcement-bar` | marketing | Lavender strip + rounded purple CTA |
| `hero-video` | hero | Wave-line bg + 16:9 autoplay video (or `image`) |
| `mission` | content | Centered H2 + paragraphs on off-white |
| `pillars` | content | 3-up uppercase label + 89px lavender icon circles |
| `testimonials` | social-proof | Seamless-loop slider, 8s autoplay, auto-height, BACK n/total NEXT |
| `news-grid` | content | Purple section, 3/2/1 responsive cards |
| `footer` | navigation | Link columns w/ chevrons, contact icons, logo, social, badges |
| `legal-bar` | navigation | Lavender legal strip |
| `button` | primitive | Ripple button: `primary` (gold) / `tertiary` (purple), `sm`/`md`, `rounded` |

### Example call
```json
{ "name": "render_page", "arguments": {
  "title": "Volunteer with us",
  "sections": [
    "header",
    { "name": "announcement-bar", "props": { "text": "Mentor sign-ups close Friday!", "cta": { "label": "Sign Up", "href": "/volunteer" } } },
    { "name": "mission", "props": { "title": "Give back to the pipeline", "paragraphs": ["..."] } },
    "testimonials", "footer", "legal-bar"
  ],
  "outputPath": "./out/volunteer.html"
} }
```

## Layout

```
server.js               MCP server (stdio)
src/base.js             tokens -> CSS vars, globals, ripple button, reveal JS
src/registry.js         component registry, renderPage, search
src/components/*.js     one module per component: {name, description, props, css, js, render()}
src/tokens.json         measured design tokens
src/content.json        scraped homepage content (defaults for props)
components/_raw/*.html  original markup captured from the live site (reference)
components/<name>/      exported static html/css/js per component
dist/                   standalone previews (index.html = full page)
DESIGN_SPEC.md          written UI/UX spec
```

## Notes

- Images and the hero video are hot-linked from the TKH CloudFront CDN. Swap them via props for your own project.
- The originals use Bootstrap 4, Swiper, AOS, and jQuery. These rebuilds swap those for small vanilla CSS/JS with the same measured values and timings.
- The mobile fullscreen menu is an approximation. The desktop layout was measured directly.
- The brand, logos, photos, and copy belong to The Knowledge House. Use this as a design reference, or with their permission.
