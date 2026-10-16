// Smoke test: spawns the server over stdio and exercises the MCP surface.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const server = spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), '..', 'server.js')], { stdio: ['pipe', 'pipe', 'inherit'] });
let buf = '';
const pending = new Map();
server.stdout.on('data', (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i); buf = buf.slice(i + 1);
    const m = JSON.parse(line);
    pending.get(m.id)?.(m); pending.delete(m.id);
  }
});
let id = 0;
const call = (method, params) => new Promise((res) => { const n = ++id; pending.set(n, res); server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: n, method, params }) + '\n'); });
const ok = (label, cond, extra = '') => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${label} ${extra}`); if (!cond) process.exitCode = 1; };

const init = await call('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '0' } });
ok('initialize', init.result?.serverInfo?.name === 'tkh-components', init.result?.protocolVersion);
server.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

const tl = await call('tools/list');
ok('tools/list', tl.result.tools.length === 7, tl.result.tools.map((t) => t.name).join(', '));
const lc = await call('tools/call', { name: 'list_components', arguments: {} });
ok('list_components', JSON.parse(lc.result.content[0].text).length === 10);
const sp = await call('tools/call', { name: 'get_component', arguments: { name: 'testimonials', format: 'spec' } });
ok('get_component spec', JSON.parse(sp.result.content[0].text).props.items.default.length === 5);
const html = await call('tools/call', { name: 'get_component', arguments: { name: 'announcement-bar', format: 'html', props: { text: 'Hello world', cta: { label: 'Go', href: '/x' } } } });
ok('get_component html w/ props', html.result.content[0].text.includes('Hello world') && html.result.content[0].text.includes('>Go<'));
const raw = await call('tools/call', { name: 'get_component', arguments: { name: 'header', format: 'raw' } });
ok('get_component raw', raw.result.content[0].text.includes('vlt-navbar'));
const tok = await call('tools/call', { name: 'get_design_tokens', arguments: { format: 'css' } });
ok('get_design_tokens css', tok.result.content[0].text.includes('--tkh-gold: #FFC20A'));
const srch = await call('tools/call', { name: 'search_components', arguments: { query: 'slider autoplay' } });
ok('search_components', JSON.parse(srch.result.content[0].text)[0]?.name === 'testimonials');
const page = await call('tools/call', { name: 'render_page', arguments: { sections: ['header', { name: 'mission', props: { title: 'Custom' } }, 'legal-bar'] } });
ok('render_page', page.result.content[0].text.startsWith('<!doctype html>') && page.result.content[0].text.includes('Custom'));
const bad = await call('tools/call', { name: 'get_component', arguments: { name: 'nope' } });
ok('unknown component -> isError', bad.result.isError === true);
const rl = await call('resources/list');
ok('resources/list', rl.result.resources.length > 10, `${rl.result.resources.length} resources`);
const rr = await call('resources/read', { uri: 'tkh://component/pillars' });
ok('resources/read', rr.result.contents[0].text.includes('WE SERVE'));
const pl = await call('prompts/get', { name: 'build_tkh_page', arguments: { goal: 'volunteer signup' } });
ok('prompts/get', pl.result.messages[0].content.text.includes('volunteer signup'));
const nf = await call('foo/bar');
ok('unknown method -> -32601', nf.error?.code === -32601);
server.stdin.end();
