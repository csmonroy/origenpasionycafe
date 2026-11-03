/* Genera versiones inglesas estáticas: no se necesita JavaScript para leerlas. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const dictionary = JSON.parse(fs.readFileSync(path.join(root, 'content/en.json'), 'utf8'));
const origin = 'https://origenpasionycafe.com';
const pages = [
  { file: 'index.html', enFile: 'en/index.html', es: '/', en: '/en/', business: false,
    titles: ['Café fresco, catas y cursos de café en Bogotá | Origen, Pasión y Café', 'Coffee, tastings & brewing classes in Bogotá | Origen, Pasión y Café'],
    descriptions: ['Café de especialidad de tostión reciente en Bogotá. Bolsas de 250 g desde $25.000 COP, catas y cursos. Descubre la frescura con Origen, Pasión y Café.', 'Recently roasted specialty coffee in Bogotá. 250 g bags from COP $25,000, coffee tastings and brewing classes. Discover Origen, Pasión y Café.'] },
  { file: 'empresas/index.html', enFile: 'en/business/index.html', es: '/empresas/', en: '/en/business/', business: true,
    titles: ['Café para empresas en Bogotá | Origen, Pasión y Café', 'Coffee for businesses in Bogotá | Origen, Pasión y Café'],
    descriptions: ['Soluciones de café para empresas en Bogotá: café verde, pedidos por volumen, tostión de microlotes y barra para eventos. Conversemos sobre tu proyecto.', 'Coffee solutions for businesses in Bogotá: green coffee, bulk orders, microlot roasting and event coffee bars. Let’s discuss your project.'] },
  { file: 'cafe-para-eventos/index.html', enFile: 'en/event-coffee/index.html', es: '/cafe-para-eventos/', en: '/en/event-coffee/', business: true, kind: 'events',
    titles: ['Café para eventos en Bogotá | Barra de café | Origen', 'Coffee bars for events in Bogotá | Origen, Pasión y Café'],
    descriptions: ['Barra de café de especialidad para eventos corporativos, asambleas de copropietarios y encuentros de marca en Bogotá. Cotiza una propuesta para tu evento.', 'Specialty coffee bars for corporate events, condominium meetings and brand gatherings in Bogotá. Request a proposal tailored to your event.'] },
  { file: 'experiencias-de-cafe/index.html', enFile: 'en/coffee-experiences/index.html', es: '/experiencias-de-cafe/', en: '/en/coffee-experiences/', business: false, kind: 'experiences',
    titles: ['Experiencias y catas de café en Bogotá | Origen, Pasión y Café', 'Coffee experiences & tastings in Bogotá | Origen, Pasión y Café'],
    descriptions: ['Descubre experiencias de café en Bogotá: catas desde $80.000 COP, cursos de métodos y sesiones personalizadas. Grupos pequeños y aprendizaje práctico.', 'Discover coffee experiences in Bogotá: tastings from COP $80,000, brewing classes and personalised sessions. Small groups and hands-on learning.'] }
];
function translate(html) {
  // Traduce texto y atributos accesibles; conserva IDs y valores internos del formulario.
  const chunks = html.split(/(<[^>]*>)/g);
  let skip = false;
  return chunks.map(chunk => {
    if (chunk.startsWith('<')) {
      if (/^<(script|style)\b/.test(chunk)) skip = true;
      if (/^<\/(script|style)>/.test(chunk)) skip = false;
      return chunk.replace(/(alt|aria-label|placeholder)="([^"]*)"/g, (all,key,value) => `${key}="${dictionary[value] || value}"`);
    }
    if (skip || !chunk.trim()) return chunk;
    const key = chunk.trim();
    if (key.endsWith('| Origen, Pasión y Café') || key.endsWith('| Origen')) return chunk;
    if (!(key in dictionary)) throw new Error('Falta traducción: '+key);
    return chunk.replace(key, dictionary[key]);
  }).join('');
}
function metadata(html, page, english) {
  const i = english ? 1 : 0, url = origin + (english ? page.en : page.es), lang = english ? 'en' : 'es-CO';
  html = html.replace(/<html lang="[^"]+">/, `<html lang="${lang}">`)
    .replace(/<title>.*?<\/title>/, `<title>${page.titles[i]}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${page.descriptions[i]}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+">/g, '');
  html = html.replace('</title>', `</title>\n  <link rel="alternate" hreflang="es" href="${origin+page.es}">\n  <link rel="alternate" hreflang="en" href="${origin+page.en}">\n  <link rel="alternate" hreflang="x-default" href="${origin+page.es}">`);
  for (const [key,value] of Object.entries({'og:title':page.titles[i], 'og:description':page.descriptions[i], 'og:url':url, 'og:locale':english?'en_US':'es_CO', 'og:image:alt':english?'Origen, Pasión y Café — specialty coffee in Bogotá':'Origen, Pasión y Café — café de especialidad en Bogotá', 'twitter:title':page.titles[i], 'twitter:description':page.descriptions[i]})) {
    html = html.replace(new RegExp(`(<meta (?:property|name)="${key}" content=")[^"]*(">)`), (_,before,after) => before+value+after);
  }
  const org = {'@type':'Organization','@id':origin+'/#organization',name:'Origen, Pasión y Café',url:origin+'/',logo:origin+'/img/logo.png',telephone:'+573012669975',email:'contacto@origenpasionycafe.com',areaServed:{'@type':'City',name:'Bogotá'},sameAs:['https://www.facebook.com/OrigenPasionyCafeCo/','https://www.instagram.com/origenpasionycafe/','https://www.tiktok.com/@origenpasionycafe']};
  const web = {'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:org.name,inLanguage:['es-CO','en'],publisher:{'@id':org['@id']}};
  const content = {'@type':'WebPage','@id':url+'#webpage',url,name:page.titles[i],description:page.descriptions[i],inLanguage:lang,isPartOf:{'@id':web['@id']},about:{'@id':org['@id']}};
  const services = [];
  if (page.kind === 'events') {
    const service = {'@type':'Service','@id':url+'#service',url,name:english?'Coffee bar for events in Bogotá':'Barra de café para eventos en Bogotá',description:page.descriptions[i],provider:{'@id':org['@id']},areaServed:{'@type':'City',name:'Bogotá'},image:origin+'/img/barra-eventos.webp'};
    services.push(service);
    content.mainEntity={'@id':service['@id']};
  } else if (page.business) {
    const esNames=['Barra de café para eventos','Café en verde','Café tostado por volumen','Tostión de microlotes'];
    const enNames=['Coffee bar for events','Green coffee','Bulk roasted coffee','Microlot roasting'];
    const ids=['barra','verde','volumen','tostion'];
    content.mainEntity={'@type':'ItemList',itemListElement:esNames.map((name,j)=>({'@type':'ListItem',position:j+1,item:{'@type':'Service',name:english?enNames[j]:name,url:url+'#'+ids[j],provider:{'@id':org['@id']},areaServed:{'@type':'City',name:'Bogotá'}}}))};
  } else {
    const products=[['Blend de Casa','blend-de-casa',25000],['Bourbon Rosado','bourbon-rosado',40000],['Bourbon Sidra','bourbon-sidra',40000]];
    if (page.kind !== 'experiences') content.mainEntity={'@type':'ItemList',itemListElement:products.map(([name,id,price],j)=>({'@type':'ListItem',position:j+1,item:{'@type':'Product','@id':url+'#product-'+id,name:name+' · 250 g',url:url+'#'+id,image:origin+'/img/'+id+'-1254.webp',description:english?'Recently roasted specialty coffee. 250 g bag.':'Café de especialidad de tostión reciente. Bolsa de 250 g.',brand:{'@type':'Brand',name:org.name},weight:{'@type':'QuantitativeValue',value:250,unitCode:'GRM'},offers:{'@type':'Offer',price,priceCurrency:'COP',url:url+'#'+id,seller:{'@id':org['@id']}}}}))};
    const experiences = [
      ['cata','Cata de café de especialidad','Specialty coffee tasting','2 horas, para 4–6 personas. Desde $80.000 COP.','2 hours, for 4–6 people. From COP $80,000.'],
      ['curso-metodos','Curso de métodos','Brewing methods class','2–3 horas, para 1–4 personas. Desde $160.000 COP.','2–3 hours, for 1–4 people. From COP $160,000.'],
      ['experiencia-personalizada','Experiencia personalizada','Personalised experience','2–4 horas, para 1–4 personas. Desde $220.000 COP.','2–4 hours, for 1–4 people. From COP $220,000.']
    ];
    for (const [id,esName,enName,esDescription,enDescription] of experiences) {
      services.push({'@type':'Service','@id':url+'#'+id,url:url+'#'+id,name:english?enName:esName,description:english?enDescription:esDescription,provider:{'@id':org['@id']},areaServed:{'@type':'City',name:'Bogotá'}});
    }
    content.about = [{'@id':org['@id']},...services.map(service=>({'@id':service['@id']}))];
    if (page.kind === 'experiences') content.mainEntity = {'@type':'ItemList',itemListElement:services.map((service,j)=>({'@type':'ListItem',position:j+1,item:{'@id':service['@id']}}))};
  }
  const schema = {'@context':'https://schema.org','@graph':[org,web,content,...services]};
  if (page.kind) {
    const parent=page.business ? (english?'/en/business/':'/empresas/') : (english?'/en/':'/');
    const breadcrumb={'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[
      {'@type':'ListItem',position:1,name:page.business?(english?'For businesses & events':'Para empresas y eventos'):(english?'For individuals':'Para personas'),item:origin+parent},
      {'@type':'ListItem',position:2,name:page.business?(english?'Coffee for events':'Café para eventos'):(english?'Coffee experiences':'Experiencias de café'),item:url}
    ]};
    content.breadcrumb={'@id':breadcrumb['@id']};
    schema['@graph'].push(breadcrumb);
  }
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">\n'+JSON.stringify(schema,null,2)+'\n  </script>');
}
for (const page of pages) {
  let spanish = fs.readFileSync(path.join(root,page.file),'utf8');
  const english = translate(spanish)
    .replace(/href="(\/[^"\s]*)"/g,(all,href)=>{
      const [pathname,...fragment]=href.split('#');
      const target=pages.find(candidate=>candidate.es===pathname);
      return target ? `href="${target.en}${fragment.length?'#'+fragment.join('#'):''}"` : all;
    })
    .replace(/<nav class="language-switch"[\s\S]*?<\/nav>/, `<nav class="language-switch" aria-label="Language"><a href="${page.es}" lang="es" hreflang="es" aria-label="Español">ES</a><a href="${page.en}" lang="en" hreflang="en" aria-label="English" aria-current="page">EN</a></nav>`)
    .replace(/href="https:\/\/wa.me\/573012669975\?text=([^"]+)"/g,(all,encoded)=> {
      const original = decodeURIComponent(encoded);
      let message = 'Hello, I’d like to ask about coffee and experiences at Origen, Pasión y Café.';
      if (page.business) {
        message='Hello, I’d like a coffee proposal for my organisation.';
        if(original.includes('barra de café')) message='Hello, I’m interested in a coffee bar for an event. Could we discuss a proposal?';
        else if(original.includes('en verde')) message='Hello, I’m interested in green coffee. Could we discuss available lots?';
        else if(original.includes('por volumen')) message='Hello, I’m interested in bulk roasted coffee. Could we discuss a quote?';
        else if(original.includes('microlotes')) message='Hello, I’m interested in microlot roasting with your Kaleido M10S. Could we discuss a proposal?';
      }
      return 'href="https://wa.me/573012669975?text='+encodeURIComponent(message)+'"';
    });
  fs.mkdirSync(path.dirname(path.join(root,page.enFile)),{recursive:true});
  fs.writeFileSync(path.join(root,page.enFile),metadata(english,page,true));
  fs.writeFileSync(path.join(root,page.file),metadata(spanish,page,false));
}
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.flatMap(p=>[p.es,p.en]).map(url=>'  <url><loc>'+origin+url+'</loc></url>').join('\n')+'\n</urlset>\n');
console.log(`${pages.length*2} páginas estáticas y sitemap generados.`);
