const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const origin = 'https://origenpasionycafe.com';
function files(dir = root) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [path.relative(root, file).replaceAll('\\', '/')];
  });
}
const published = new Map(files().filter(file => file.endsWith('.html')).map(file => {
  const route = file.endsWith('index.html') ? '/' + file.slice(0, -10) : '/' + file;
  return [route, fs.readFileSync(path.join(root, file), 'utf8')];
}));
function links(html) { return [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match => match[1]); }

test('all content pages are reachable from the home page; the 404 page offers both exits', () => {
  const reached = new Set(), queue = ['/'];
  while (queue.length) {
    const route = queue.shift();
    if (reached.has(route)) continue;
    reached.add(route);
    for (const href of links(published.get(route))) {
      const url = new URL(href, origin + route);
      if (url.origin === origin && published.has(url.pathname) && !reached.has(url.pathname)) queue.push(url.pathname);
    }
  }
  assert.deepEqual([...reached].sort(), [...published.keys()].filter(route => route !== '/404.html').sort());
  assert.deepEqual(links(published.get('/404.html')), ['/', '/en/']);
});

test('every page has valid local links, assets, labels and fragment destinations', () => {
  for (const [route, html] of published) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, route + ': duplicate ID');
    for (const [, id] of html.matchAll(/\bfor="([^"]+)"/g)) assert.ok(ids.includes(id), route + ': label ' + id);
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/g)) refs.push(...srcset.split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
    for (const ref of refs) {
      const url = new URL(ref, origin + route);
      if (url.origin !== origin) continue;
      const file = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
      assert.ok(fs.existsSync(path.join(root, decodeURIComponent(file.slice(1)))), route + ': ' + ref);
      if (url.hash) assert.ok(published.get(url.pathname)?.includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), route + ': ' + ref);
    }
  }
});

test('all shipped images are referenced by the published pages or shared styles', () => {
  const runtime = [...published.values()].join('\n') + fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  for (const image of files(path.join(root, 'img'))) assert.ok(runtime.includes(image), 'Unreferenced image: ' + image);
});

test('translation dictionary only contains text and accessible attributes used by current pages', () => {
  const used = new Set();
  for (const route of ['/', '/empresas/', '/privacidad/']) {
    let skip = false;
    for (const chunk of published.get(route).split(/(<[^>]*>)/g)) {
      if (chunk.startsWith('<')) {
        if (/^<(script|style)\b/.test(chunk)) skip = true;
        if (/^<\/(script|style)>/.test(chunk)) skip = false;
        for (const [, value] of chunk.matchAll(/(?:alt|aria-label|placeholder)="([^"]*)"/g)) used.add(value);
      } else if (!skip && chunk.trim() && !chunk.trim().endsWith('| Origen, Pasión y Café')) used.add(chunk.trim());
    }
  }
  const dictionary = JSON.parse(fs.readFileSync(path.join(root, 'content/en.json'), 'utf8'));
  for (const key of Object.keys(dictionary)) assert.ok(used.has(key), 'Unused translation: ' + key);
});
