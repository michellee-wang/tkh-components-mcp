// Writes every component as a standalone HTML file + a full-page rebuild into ./dist
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { components, renderPage, renderComponent, baseCss, tokensCss } from '../src/registry.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
mkdirSync(join(dist, 'components'), { recursive: true });

for (const c of components) {
  const r = renderComponent(c.name);
  const dir = join(root, 'components', c.name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'component.html'), r.html + '\n');
  writeFileSync(join(dir, 'component.css'), r.css + '\n');
  if (r.js) writeFileSync(join(dir, 'component.js'), r.js + '\n');
  writeFileSync(join(dist, 'components', `${c.name}.html`), renderPage([c.name], { title: `TKH: ${c.title}` }));
}
writeFileSync(join(root, 'components', 'base.css'), baseCss);
writeFileSync(join(root, 'components', 'tokens.css'), tokensCss() + '\n');
writeFileSync(join(dist, 'index.html'), renderPage());
console.log(`Exported ${components.length} components to components/ and dist/`);
