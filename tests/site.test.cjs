const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

// Exercise the real script with isolated form fields, without external libraries.
function setup() {
  const fields = new Map();
  function element(value = '') {
    return {
      value, listeners: {},
      addEventListener(name, handler) { this.listeners[name] = handler; },
      fire(name, event = {}) { this.listeners[name]?.(event); }
    };
  }
  for (const [, id] of html.matchAll(/\bid="([^"]+)"/g)) fields.set(id, element());
  fields.get('tipo').value = 'Cata de café de especialidad';
  const buttons = [...html.matchAll(/data-preset="([^"]+)"/g)].map(([, preset]) => ({
    ...element(), preset, getAttribute() { return preset; }
  }));
  const context = vm.createContext({
    document: {
      querySelector: () => null,
      getElementById: id => fields.get(id),
      querySelectorAll: () => buttons
    },
    window: { location: { assign(url) { context.destination = url; } } }
  });
  vm.runInContext(source, context);
  return {
    fields, context,
    choose(preset) { buttons.find(button => button.preset === preset).fire('click'); },
    message() { return new URL(fields.get('waBtn').href).searchParams.get('text'); }
  };
}

test('all published presets select the correct service or coffee', () => {
  const s = setup();
  const expected = {
    cata: 'Cata de café de especialidad', curso_metodos: 'Curso de métodos',
    personalizada: 'Experiencia personalizada', eventos: 'Barra de café para eventos',
    blend_casa: 'Blend Casa', origen_frutal: 'Origen Frutal', origen_exotico: 'Origen Exótico'
  };
  for (const [, preset] of html.matchAll(/data-preset="([^"]+)"/g)) {
    assert.ok(expected[preset], 'Unknown HTML preset: ' + preset);
    s.choose(preset);
    assert.ok(s.message().includes(expected[preset]), 'Incorrect message for ' + preset);
    assert.equal(s.fields.get('product-field').hidden, !preset.includes('casa') && !preset.startsWith('origen_'));
  }
});

test('switching from a reservation to coffee omits its date and resets quantity', () => {
  const s = setup();
  s.fields.get('fecha').value = 'sábado';
  s.fields.get('cantidad').value = '4 personas';
  s.choose('origen_exotico');
  assert.equal(s.fields.get('date-field').hidden, true);
  assert.equal(s.fields.get('cantidad').value, '');
  assert.ok(!s.message().includes('sábado'));
  assert.ok(!s.message().includes('4 personas'));
  assert.ok(s.message().includes('Café: Origen Exótico'));
  assert.ok(s.message().includes('Presentación: bolsa de 250 g'));
});

test('changing service clears the product and prevents stale coffee in reservations', () => {
  const s = setup();
  s.choose('blend_casa');
  s.fields.get('cantidad').value = '2';
  s.fields.get('tipo').value = 'Curso de métodos';
  s.fields.get('tipo').fire('change');
  assert.equal(s.fields.get('producto').value, '');
  assert.equal(s.fields.get('cantidad').value, '');
  assert.equal(s.fields.get('date-field').hidden, false);
  assert.ok(!s.message().includes('Blend Casa'));
  assert.ok(s.message().includes('Curso de métodos'));
});

test('WhatsApp safely round-trips accents, special characters and new lines', () => {
  const s = setup();
  s.choose('origen_frutal');
  const comment = '¿Café & más? + 50%\nMolido para V60';
  s.fields.get('comentario').value = comment;
  s.fields.get('cantidad').value = '2';
  s.fields.get('reservation-form').fire('input');
  assert.ok(s.message().includes(comment));
  assert.ok(s.message().includes('Cantidad de bolsas: 2'));
  const url = new URL(s.fields.get('waBtn').href);
  assert.equal(url.origin + url.pathname, 'https://wa.me/573012669975');
  assert.equal([...url.searchParams.keys()].length, 1);
});

test('all contact links have a usable no-JavaScript destination', () => {
  for (const id of ['waBtn', 'waFloat']) {
    const tag = html.match(new RegExp('<a[^>]*id="' + id + '"[^>]*>'))[0];
    assert.match(tag, /href="https:\/\/wa\.me\/573012669975\?text=.+?"/);
  }
  assert.doesNotMatch(source + html, /AOS\.|unpkg\.com|whatsapp:\/\//);
});

test('internal links, form labels and presets reference existing targets', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
  assert.equal(ids.length, new Set(ids).size, 'Duplicate id');
  for (const [, id] of html.matchAll(/(?:href="#|\bfor=")([^"#]+)"/g)) assert.ok(ids.includes(id), id);
  assert.doesNotMatch(html, /href="#"/);
});

test('SEO metadata and sitemap agree on the canonical domain', () => {
  const canonical = 'https://origenpasionycafe.com/';
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<title>.*café en Bogotá/);
  assert.match(html, /name="description" content="[^"]+"/);
  assert.ok(html.includes('rel="canonical" href="' + canonical + '"'));
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  for (const item of schema['@graph']) assert.equal(item.url, canonical);
  assert.ok(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').includes('<loc>' + canonical + '</loc>'));
  assert.ok(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes(canonical + 'sitemap.xml'));
  assert.ok(fs.existsSync(path.join(root, 'img/social-card.png')));
});
