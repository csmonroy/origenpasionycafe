const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

// Exercise the real script with isolated form fields, without external libraries.
function setup(language = 'es-CO', business = false, fileOverride) {
  const page = fs.readFileSync(path.join(root, fileOverride || (business ? (language === 'en' ? 'en/business/index.html' : 'empresas/index.html') : (language === 'en' ? 'en/index.html' : 'index.html'))), 'utf8');
  const fields = new Map();
  function element(value = '') {
    return {
      value, listeners: {},
      addEventListener(name, handler) { this.listeners[name] = handler; },
      fire(name, event = {}) { this.listeners[name]?.(event); }
    };
  }
  for (const [, id] of page.matchAll(/\bid="([^"]+)"/g)) fields.set(id, element());
  if (fields.has('tipo')) fields.get('tipo').value = 'Cata de café de especialidad';
  if (business) fields.get('business-service').value = language === 'en' ? 'Coffee bar for events' : 'Barra de café para eventos';
  const buttons = [...page.matchAll(/data-preset="([^"]+)"/g)].map(([, preset]) => ({
    ...element(), preset, getAttribute() { return preset; }
  }));
  const context = vm.createContext({
    document: {
      documentElement: {lang: language},
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
    message() { return new URL(fields.get(business ? 'business-whatsapp' : 'waBtn').href).searchParams.get('text'); }
  };
}

test('all published presets select the correct service or coffee', () => {
  const s = setup();
  const expected = {
    cata: 'Cata de café de especialidad', curso_metodos: 'Curso de métodos',
    personalizada: 'Experiencia personalizada', eventos: 'Barra de café para eventos',
    blend_de_casa: 'Blend de Casa', bourbon_rosado: 'Bourbon Rosado', bourbon_sidra: 'Bourbon Sidra'
  };
  for (const [, preset] of html.matchAll(/data-preset="([^"]+)"/g)) {
    assert.ok(expected[preset], 'Unknown HTML preset: ' + preset);
    s.choose(preset);
    assert.ok(s.message().includes(expected[preset]), 'Incorrect message for ' + preset);
    assert.equal(s.fields.get('product-field').hidden, !['blend_de_casa', 'bourbon_rosado', 'bourbon_sidra'].includes(preset));
  }
});

test('switching from a reservation to coffee omits its date and resets quantity', () => {
  const s = setup();
  s.fields.get('fecha').value = 'sábado';
  s.fields.get('cantidad').value = '4 personas';
  s.choose('bourbon_sidra');
  assert.equal(s.fields.get('date-field').hidden, true);
  assert.equal(s.fields.get('cantidad').value, '');
  assert.ok(!s.message().includes('sábado'));
  assert.ok(!s.message().includes('4 personas'));
  assert.ok(s.message().includes('Café: Bourbon Sidra'));
  assert.ok(s.message().includes('Presentación: bolsa de 250 g'));
});

test('changing service clears the product and prevents stale coffee in reservations', () => {
  const s = setup();
  s.choose('blend_de_casa');
  s.fields.get('cantidad').value = '2';
  s.fields.get('tipo').value = 'Curso de métodos';
  s.fields.get('tipo').fire('change');
  assert.equal(s.fields.get('producto').value, '');
  assert.equal(s.fields.get('cantidad').value, '');
  assert.equal(s.fields.get('date-field').hidden, false);
  assert.ok(!s.message().includes('Blend de Casa'));
  assert.ok(s.message().includes('Curso de métodos'));
});

test('WhatsApp safely round-trips accents, special characters and new lines', () => {
  const s = setup();
  s.choose('bourbon_rosado');
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
  for (const item of schema['@graph'].filter(item => ['Organization','WebSite','WebPage'].includes(item['@type']))) assert.equal(item.url, canonical);
  assert.ok(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').includes('<loc>' + canonical + '</loc>'));
  assert.ok(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes(canonical + 'sitemap.xml'));
  assert.ok(fs.existsSync(path.join(root, 'img/social-card.png')));
});

test('English booking and coffee messages use the selected language and retain product names', () => {
  const s = setup('en');
  s.fields.get('tipo').value = 'Curso de métodos';
  s.fields.get('tipo').fire('change');
  assert.match(s.message(), /Service: Brewing methods class/);
  assert.match(s.fields.get('selection-status').textContent, /Your selection: Brewing methods class/);
  s.choose('bourbon_rosado');
  s.fields.get('cantidad').value = '3';
  s.fields.get('reservation-form').fire('input');
  assert.match(s.message(), /Coffee: Bourbon Rosado/);
  assert.match(s.message(), /Number of bags: 3/);
  assert.doesNotMatch(s.message(), /Servicio:|Personas:|Hola,/);
});

test('business quote forms encode the selected service and details in both languages', () => {
  for (const language of ['es-CO', 'en']) {
    const s = setup(language, true);
    s.fields.get('business-service').value = language === 'en' ? 'Microlot roasting' : 'Tostión de microlotes';
    s.fields.get('business-organization').value = 'Café & compañía + 10%';
    s.fields.get('business-details').value = '2 kg\n¿Disponible?';
    s.fields.get('business-form').fire('input');
    assert.ok(s.message().includes(s.fields.get('business-service').value));
    assert.ok(s.message().includes('Café & compañía + 10%'));
    assert.ok(s.message().includes('2 kg\n¿Disponible?'));
    assert.equal(new URL(s.fields.get('business-whatsapp').href).pathname, '/573012669975');
  }
});

const routes = {'/':'index.html', '/empresas/':'empresas/index.html', '/en/':'en/index.html', '/en/business/':'en/business/index.html', '/cafe-para-eventos/':'cafe-para-eventos/index.html', '/experiencias-de-cafe/':'experiencias-de-cafe/index.html', '/en/event-coffee/':'en/event-coffee/index.html', '/en/coffee-experiences/':'en/coffee-experiences/index.html'};
test('dedicated service forms prepare the right inquiry without sending it', () => {
  for (const [language,eventFile,experienceFile] of [['es-CO','cafe-para-eventos/index.html','experiencias-de-cafe/index.html'],['en','en/event-coffee/index.html','en/coffee-experiences/index.html']]) {
    const event=setup(language,true,eventFile);
    event.fields.get('business-details').value='80 asistentes, Bogotá';
    event.fields.get('business-form').fire('input');
    assert.match(event.message(),/80 asistentes, Bogotá/);
    assert.match(event.message(),language==='en'?/Coffee bar for events/:/Barra de café para eventos/);
    assert.equal(event.context.destination,undefined);
    const experience=setup(language,false,experienceFile);
    const expected=language==='en'?['Specialty coffee tasting','Brewing methods class','Personalised experience']:['Cata de café de especialidad','Curso de métodos','Experiencia personalizada'];
    for(const preset of ['cata','curso_metodos','personalizada']) {
      experience.choose(preset);
      assert.ok(experience.message().includes(expected[['cata','curso_metodos','personalizada'].indexOf(preset)]));
      assert.equal(experience.context.destination,undefined);
    }
    assert.equal(experience.fields.has('producto'),false);
  }
});

test('new pages describe their own services and navigable breadcrumb hierarchy', () => {
  for(const route of ['/cafe-para-eventos/','/experiencias-de-cafe/','/en/event-coffee/','/en/coffee-experiences/']) {
    const page=fs.readFileSync(path.join(root,routes[route]),'utf8');
    const graph=JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const breadcrumb=graph.find(x=>x['@type']==='BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.at(-1).item,'https://origenpasionycafe.com'+route);
    for(const item of breadcrumb.itemListElement) assert.ok(routes[new URL(item.item).pathname]);
    assert.ok(graph.some(x=>x['@type']==='Service'));
    assert.doesNotMatch(JSON.stringify(graph),/"@type":"Product"|aggregateRating|streetAddress/);
  }
  assert.equal((fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').match(/<loc>/g)||[]).length,8);
});

test('every page has reciprocal language links, an independent canonical and a sitemap entry', () => {
  for (const [route,file] of Object.entries(routes)) {
    const page = fs.readFileSync(path.join(root,file),'utf8');
    assert.equal((page.match(/<h1\b/g)||[]).length,1,file);
    assert.ok(page.includes(`rel="canonical" href="https://origenpasionycafe.com${route}"`),file);
    assert.ok(page.includes(`<html lang="${route.startsWith('/en/')?'en':'es-CO'}">`),file);
    assert.ok(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes(`<loc>https://origenpasionycafe.com${route}</loc>`));
    for(const [,lang,url] of page.matchAll(/rel="alternate" hreflang="([^"]+)" href="https:\/\/origenpasionycafe.com([^"]*)"/g)) {
      assert.ok(routes[url],`${file}: ${lang} destination`);
      const other=fs.readFileSync(path.join(root,routes[url]),'utf8');
      assert.ok(other.includes(`href="https://origenpasionycafe.com${route}"`),'Reciprocal language reference');
    }
    const graph=JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    assert.equal(graph.find(x=>x['@type']==='WebPage').url,'https://origenpasionycafe.com'+route);
  }
});

test('published internal routes, fragment targets and local images resolve on all eight pages', () => {
  for (const [route,file] of Object.entries(routes)) {
    const page = fs.readFileSync(path.join(root,file),'utf8');
    const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
    assert.equal(ids.length,new Set(ids).size,file+' duplicate id');
    for (const [,href] of page.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      const url=new URL(href,'https://origenpasionycafe.com'+route);
      const target=routes[url.pathname] || url.pathname.slice(1);
      assert.ok(fs.existsSync(path.join(root,target)),file+': '+href);
      if (url.hash) assert.ok(fs.readFileSync(path.join(root,target),'utf8').includes(`id="${url.hash.slice(1)}"`),file+': '+href);
    }
  }
});

test('coffee offers keep the advertised bag size and Colombian peso prices', () => {
  for (const file of ['index.html','en/index.html']) {
    const page=fs.readFileSync(path.join(root,file),'utf8');
    const graph=JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const items=graph.find(x=>x['@type']==='WebPage').mainEntity.itemListElement;
    assert.deepEqual(items.map(x=>x.item.offers.price),[25000,40000,40000]);
    for(const {item} of items) { assert.equal(item.weight.value,250); assert.equal(item.offers.priceCurrency,'COP'); assert.ok(page.includes(`id="${new URL(item.offers.url).hash.slice(1)}"`)); }
  }
});

test('social descriptions preserve currency and do not leak text outside head tags', () => {
  for (const file of Object.values(routes)) {
    const page=fs.readFileSync(path.join(root,file),'utf8');
    const description=page.match(/<meta name="description" content="([^"]+)">/)[1];
    assert.equal(page.match(/<meta property="og:description" content="([^"]+)">/)[1],description);
    assert.equal(page.match(/<meta name="twitter:description" content="([^"]+)">/)[1],description);
    const head=page.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<script[^>]*>[\s\S]*?<\/script>/g,'').replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<[^>]*>/g,'').trim();
    assert.equal(head,'',file+' has visible text in head');
  }
});

test('experience descriptions resolve to the dedicated service detail in both languages', () => {
  for (const file of ['index.html','en/index.html','experiencias-de-cafe/index.html','en/coffee-experiences/index.html']) {
    const page=fs.readFileSync(path.join(root,file),'utf8');
    const graph=JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const services=graph.filter(item=>item['@type']==='Service');
    assert.equal(services.length,3);
    for (const service of services) {
      const target=new URL(service.url);
      const destination=fs.readFileSync(path.join(root,routes[target.pathname]),'utf8');
      const detail=destination.match(new RegExp(`<article class="experience-detail" id="${target.hash.slice(1)}"[^>]*>([\\s\\S]*?)</article>`));
      assert.ok(detail,service.url);
      assert.ok(detail[1].includes(service.name),service.name);
      assert.match(detail[1],/data-preset=/);
    }
    assert.match(services[0].description,/2 (horas|hours),.*4–6/);
    assert.doesNotMatch(JSON.stringify(graph),/aggregateRating|InStock|streetAddress/);
  }
});

test('home experience choices lead to the guide without duplicating its offer cards', () => {
  for (const [homeFile,guideRoute] of [['index.html','/experiencias-de-cafe/'],['en/index.html','/en/coffee-experiences/']]) {
    const home=fs.readFileSync(path.join(root,homeFile),'utf8');
    const overview=home.match(/<section id="experiencias"[\s\S]*?<\/section>/)[0];
    assert.doesNotMatch(overview,/data-preset=|class="card"/);
    for (const id of ['cata','curso-metodos','experiencia-personalizada']) assert.ok(overview.includes(`href="${guideRoute}#${id}"`));
    const guide=fs.readFileSync(path.join(root,routes[guideRoute]),'utf8');
    assert.ok(guide.indexOf('id="preguntas"') < guide.indexOf('<section id="reservar"'));
  }
});

test('each audience has identical primary navigation labels, order and destinations', () => {
  const groups=[['index.html','experiencias-de-cafe/index.html','privacidad/index.html'],['empresas/index.html','cafe-para-eventos/index.html'],['en/index.html','en/coffee-experiences/index.html','en/privacy/index.html'],['en/business/index.html','en/event-coffee/index.html']];
  for(const group of groups){
    const menus=group.map(file=>fs.readFileSync(path.join(root,file),'utf8').match(/<ul class="nav-list" id="nav-list">([\s\S]*?)<\/ul>/)[1].replace(/ aria-current="[^"]+"/g,''));
    for(const menu of menus) assert.equal(menu,menus[0],group.join(', '));
  }
});

test('structured event enquiry includes all supplied details without sending a message', () => {
  for(const [language,file] of [['es-CO','cafe-para-eventos/index.html'],['en','en/event-coffee/index.html']]){
    const s=setup(language,true,file);
    s.fields.get('business-service').value='Barra de café para eventos';
    for(const [id,value] of [['event-date','15/12, 9:00'],['event-place','Bogotá & norte'],['event-guests','80'],['event-duration','3 h']]) s.fields.get(id).value=value;
    s.fields.get('business-form').fire('input');
    for(const value of ['15/12, 9:00','Bogotá & norte','80','3 h']) assert.ok(s.message().includes(value));
    assert.match(s.message(),language==='en'?/Service: Coffee bar for events/:/Servicio: Barra de café para eventos/);
    assert.equal(s.context.destination,undefined);
  }
});

test('responsive image candidates exist and declare their actual widths', () => {
  for (const file of Object.values(routes)) {
    const page=fs.readFileSync(path.join(root,file),'utf8');
    for (const [,srcset] of page.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of srcset.split(',')) {
        const [src,width]=candidate.trim().split(/\s+/);
        if (src.startsWith('https:')) continue;
        assert.ok(fs.existsSync(path.join(root,src.slice(1))),src);
        assert.match(width,/^\d+w$/);
        const explicitWidth=src.match(/-(\d+)\.webp$/)?.[1];
        if (explicitWidth) assert.equal(width,explicitWidth+'w');
      }
    }
  }
});
