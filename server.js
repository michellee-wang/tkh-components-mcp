#!/usr/bin/env node
// TKH Components MCP server: zero-dependency, stdio transport (newline-delimited JSON-RPC 2.0).
import { createInterface } from 'node:readline';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import {
  components, byName, summary, spec, renderComponent, renderPage, search, getRaw,
  tokens, content, tokensCss, baseCss, DEFAULT_PAGE,
} from './src/registry.js';

const here = dirname(fileURLToPath(import.meta.url));
const SERVER_INFO = { name: 'tkh-components', title: 'The Knowledge House UI Components', version: '1.0.0' };
const SUPPORTED = ['2025-06-18', '2025-03-26', '2024-11-05'];
const designSpec = () => readFileSync(join(here, 'DESIGN_SPEC.md'), 'utf8');
const log = (...a) => process.stderr.write(`[tkh-mcp] ${a.join(' ')}\n`);

const names = components.map((c) => c.name);
const sectionSchema = {
  oneOf: [
    { type: 'string', enum: names },
    { type: 'object', properties: { name: { type: 'string', enum: names }, props: { type: 'object' } }, required: ['name'] },
  ],
};

// ---------- Tools ----------
const tools = [
  {
    name: 'list_components',
    title: 'List components',
    description: 'List every saved TKH component (name, title, category, description, prop names). Optionally filter by category.',
    inputSchema: { type: 'object', properties: { category: { type: 'string', description: 'navigation | marketing | hero | content | social-proof | primitive' } } },
    annotations: { readOnlyHint: true },
    run: ({ category } = {}) => json(components.filter((c) => !category || c.category === category).map(summary)),
  },
  {
    name: 'get_component',
    title: 'Get component',
    description:
      'Get one component. format: "spec" (props schema + defaults), "html" (rendered markup), "css", "js", "bundle" (html+css+js, default), "standalone" (full HTML doc with base styles, ready to open), or "raw" (original markup captured from theknowledgehouse.org). Pass props to override the default content.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', enum: names },
        format: { type: 'string', enum: ['spec', 'html', 'css', 'js', 'bundle', 'standalone', 'raw'], default: 'bundle' },
        props: { type: 'object', description: 'Prop overrides. Call with format "spec" to see the available props.' },
      },
      required: ['name'],
    },
    annotations: { readOnlyHint: true },
    run: ({ name, format = 'bundle', props }) => {
      const c = byName[name];
      if (!c) throw new Error(`Unknown component "${name}". Available: ${names.join(', ')}`);
      if (format === 'spec') return json(spec(c));
      if (format === 'raw') {
        const raw = getRaw(name);
        return text(raw ?? `No raw capture saved for "${name}".`);
      }
      if (format === 'standalone') return text(renderPage([{ name, props }], { title: `TKH: ${c.title}` }));
      const r = renderComponent(name, props);
      if (format === 'html') return text(r.html);
      if (format === 'css') return text(r.css);
      if (format === 'js') return text(r.js || '/* no script */');
      return text(
        `<!-- ${c.title} -->\n<!-- Requires base styles: get_design_tokens {format:"css"} or tkh://base.css -->\n` +
          `<style>\n${r.css}\n</style>\n${r.html}${r.js ? `\n<script>\n${r.js}\n</script>` : ''}`
      );
    },
  },
  {
    name: 'search_components',
    title: 'Search components',
    description: 'Keyword search across component names, descriptions, categories and props (e.g. "slider", "dropdown", "cards").',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
    annotations: { readOnlyHint: true },
    run: ({ query }) => json(search(query)),
  },
  {
    name: 'get_design_tokens',
    title: 'Get design tokens',
    description:
      'Design tokens measured from the live site (colors, Lato type scale, spacing, layout, motion, scrollbar). format "json" (default), "css" (CSS custom properties only), or "base-css" (tokens + global styles + ripple buttons + reveal animation).',
    inputSchema: { type: 'object', properties: { format: { type: 'string', enum: ['json', 'css', 'base-css'], default: 'json' } } },
    annotations: { readOnlyHint: true },
    run: ({ format = 'json' } = {}) => (format === 'css' ? text(tokensCss()) : format === 'base-css' ? text(baseCss) : json(tokens)),
  },
  {
    name: 'get_design_spec',
    title: 'Get UI/UX spec',
    description: 'The full written UI/UX specification of theknowledgehouse.org homepage (layout, typography, colors, interactions, responsive rules).',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    run: () => text(designSpec()),
  },
  {
    name: 'get_site_content',
    title: 'Get site content',
    description: 'Structured content scraped from the homepage (nav tree, announcement, mission, pillars, 5 testimonials, news, footer links, social, badges). Useful as a template for your own props.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    run: () => json(content),
  },
  {
    name: 'render_page',
    title: 'Render page',
    description:
      'Compose components into one standalone HTML page (base styles, Lato font, per-component CSS/JS deduped). sections defaults to the full homepage order. Optionally write the result to outputPath.',
    inputSchema: {
      type: 'object',
      properties: {
        sections: { type: 'array', items: sectionSchema, description: `Defaults to ${JSON.stringify(DEFAULT_PAGE)}` },
        title: { type: 'string' },
        extraCss: { type: 'string', description: 'CSS appended after component styles' },
        outputPath: { type: 'string', description: 'If set, the HTML is written to this file path' },
      },
    },
    annotations: { readOnlyHint: false, destructiveHint: false },
    run: ({ sections, title, extraCss, outputPath } = {}) => {
      const html = renderPage(sections?.length ? sections : DEFAULT_PAGE, { title, extraCss });
      if (outputPath) {
        const p = resolve(outputPath);
        mkdirSync(dirname(p), { recursive: true });
        writeFileSync(p, html);
        return text(`Wrote ${html.length} bytes to ${p}`);
      }
      return text(html);
    },
  },
];

// ---------- Resources ----------
const staticResources = [
  { uri: 'tkh://design-spec', name: 'design-spec', title: 'UI/UX spec', mimeType: 'text/markdown', read: designSpec },
  { uri: 'tkh://tokens.json', name: 'tokens', title: 'Design tokens (JSON)', mimeType: 'application/json', read: () => JSON.stringify(tokens, null, 2) },
  { uri: 'tkh://base.css', name: 'base-css', title: 'Base CSS (tokens + globals + buttons)', mimeType: 'text/css', read: () => baseCss },
  { uri: 'tkh://content.json', name: 'content', title: 'Scraped site content', mimeType: 'application/json', read: () => JSON.stringify(content, null, 2) },
  { uri: 'tkh://page.html', name: 'page', title: 'Full homepage rebuild', mimeType: 'text/html', read: () => renderPage() },
  ...components.flatMap((c) => [
    { uri: `tkh://component/${c.name}`, name: c.name, title: c.title, description: c.description, mimeType: 'text/html', read: () => renderPage([c.name], { title: `TKH: ${c.title}` }) },
    ...(getRaw(c.name) ? [{ uri: `tkh://raw/${c.name}`, name: `raw-${c.name}`, title: `${c.title} (original captured markup)`, mimeType: 'text/html', read: () => getRaw(c.name) }] : []),
  ]),
];
const resourceTemplates = [
  { uriTemplate: 'tkh://component/{name}', name: 'component', title: 'Component preview (standalone HTML)', mimeType: 'text/html' },
  { uriTemplate: 'tkh://raw/{name}', name: 'raw-component', title: 'Original captured markup', mimeType: 'text/html' },
];

// ---------- Prompts ----------
const prompts = [
  {
    name: 'build_tkh_page',
    title: 'Build a page in the TKH style',
    description: 'Guides the model to assemble a new page from TKH components and tokens.',
    arguments: [{ name: 'goal', description: 'What the page is for', required: true }],
    get: ({ goal }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Build a page for: ${goal}\n\nUse the tkh-components MCP server. Steps: 1) call get_design_tokens and list_components; 2) pick sections and call get_component {format:"spec"} for each to see props; 3) call render_page with sections + props tailored to the goal. Keep the style rules: Lato only (400/700/900), sharp corners (8px radius only on the announcement CTA), purple #332459 / gold #FFC20A / lavender #C0BFF8 / off-white #F6F3F1, gold underline nav hover, cursor-origin ripple buttons, fade-in on scroll.`,
          },
        },
      ],
    }),
  },
];

// ---------- JSON-RPC plumbing ----------
function text(t) { return { content: [{ type: 'text', text: t }] }; }
function json(o) { return { content: [{ type: 'text', text: JSON.stringify(o, null, 2) }], structuredContent: Array.isArray(o) ? { items: o } : o }; }
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
const reply = (id, result) => send({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

function readResource(uri) {
  let r = staticResources.find((x) => x.uri === uri);
  if (!r) {
    const m = uri.match(/^tkh:\/\/(component|raw)\/([\w-]+)$/);
    if (m && byName[m[2]]) {
      const body = m[1] === 'raw' ? getRaw(m[2]) : renderPage([m[2]]);
      if (body) return { contents: [{ uri, mimeType: 'text/html', text: body }] };
    }
    throw Object.assign(new Error(`Resource not found: ${uri}`), { code: -32002 });
  }
  return { contents: [{ uri, mimeType: r.mimeType, text: r.read() }] };
}

const handlers = {
  initialize: (params) => ({
    protocolVersion: SUPPORTED.includes(params?.protocolVersion) ? params.protocolVersion : SUPPORTED[0],
    capabilities: { tools: { listChanged: false }, resources: { listChanged: false, subscribe: false }, prompts: { listChanged: false } },
    serverInfo: SERVER_INFO,
    instructions:
      'UI component library recreated from theknowledgehouse.org. Start with list_components / get_design_tokens, inspect props with get_component {format:"spec"}, then render_page to assemble a full HTML page.',
  }),
  ping: () => ({}),
  'tools/list': () => ({ tools: tools.map(({ run, ...t }) => t) }),
  'tools/call': async ({ name, arguments: args }) => {
    const t = tools.find((x) => x.name === name);
    if (!t) throw Object.assign(new Error(`Unknown tool: ${name}`), { code: -32602 });
    try {
      return await t.run(args || {});
    } catch (e) {
      return { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true };
    }
  },
  'resources/list': () => ({ resources: staticResources.map(({ read, ...r }) => r) }),
  'resources/templates/list': () => ({ resourceTemplates }),
  'resources/read': ({ uri }) => readResource(uri),
  'prompts/list': () => ({ prompts: prompts.map(({ get, ...p }) => p) }),
  'prompts/get': ({ name, arguments: args }) => {
    const p = prompts.find((x) => x.name === name);
    if (!p) throw Object.assign(new Error(`Unknown prompt: ${name}`), { code: -32602 });
    return p.get(args || {});
  },
};

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', async (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return fail(null, -32700, 'Parse error'); }
  const batch = Array.isArray(msg) ? msg : [msg];
  for (const m of batch) {
    const isRequest = m.id !== undefined && m.id !== null;
    if (!m.method) continue; // responses from client: ignore
    const h = handlers[m.method];
    if (!h) { if (isRequest) fail(m.id, -32601, `Method not found: ${m.method}`); continue; }
    try {
      const result = await h(m.params || {});
      if (isRequest) reply(m.id, result);
    } catch (e) {
      if (isRequest) fail(m.id, e.code || -32603, e.message);
    }
  }
});
rl.on('close', () => process.exit(0));
log(`ready: ${tools.length} tools, ${staticResources.length} resources, ${components.length} components`);
