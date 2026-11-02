/* Genera versiones inglesas estáticas: no se necesita JavaScript para leerlas. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const dictionary = JSON.parse(fs.readFileSync(path.join(root, 'content/en.json'), 'utf8'));
const origin = 'https://origenpasionycafe.com';
const pages = [
  { file: 'index.html', enFile: 'en/index.html', es: '/', en: '/en/', business: false,
    titles: ['Café fresco, catas y cursos de café en Bogotá | Origen, Pasión y Café', 'Fresh specialty coffee & tastings in Bogotá | Origen, Pasión y Café'],
    descriptions: ['Café de especialidad tostado a demanda en Bogotá. Bolsas de 250 g desde $25.000 COP, catas y cursos. Descubre la frescura con Origen, Pasión y Café.', 'Specialty coffee roasted to order in Bogotá. 250 g bags from COP $25,000, coffee tastings and brewing classes. Discover Origen, Pasión y Café.'] },
  { file: 'empresas/index.html', enFile: 'en/business/index.html', es: '/empresas/', en: '/en/business/', business: true,
    titles: ['Barra de café para eventos y empresas en Bogotá | Origen, Pasión y Café', 'Event coffee bars & business coffee in Bogotá | Origen, Pasión y Café'],
    descriptions: ['Barra de café para eventos corporativos y asambleas en Bogotá. Café verde, café por volumen y tostión de microlotes con Kaleido M10S. Solicita tu propuesta.', 'Coffee bars for corporate events and condominium meetings in Bogotá. Green coffee, bulk orders and microlot roasting with Kaleido M10S. Request a proposal.'] }
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
    if (key.endsWith('| Origen, Pasión y Café')) return chunk;
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
  if (page.business) {
    const esNames=['Barra de café para eventos','Café en verde','Café tostado por volumen','Tostión de microlotes'];
    const enNames=['Coffee bar for events','Green coffee','Bulk roasted coffee','Microlot roasting'];
    const ids=['barra','verde','volumen','tostion'];
    content.mainEntity={'@type':'ItemList',itemListElement:esNames.map((name,j)=>({'@type':'ListItem',position:j+1,item:{'@type':'Service',name:english?enNames[j]:name,url:url+'#'+ids[j],provider:{'@id':org['@id']},areaServed:{'@type':'City',name:'Bogotá'}}}))};
  } else {
    const products=[['Blend de Casa','blend-de-casa',25000],['Bourbon Rosado','bourbon-rosado',40000],['Bourbon Sidra','bourbon-sidra',40000]];
    content.mainEntity={'@type':'ItemList',itemListElement:products.map(([name,id,price],j)=>({'@type':'ListItem',position:j+1,item:{'@type':'Product',name:name+' · 250 g',image:origin+'/img/'+id+'.jpg',description:english?'Specialty coffee roasted in batches to order. 250 g bag.':'Café de especialidad tostado en lotes a demanda. Bolsa de 250 g.',brand:{'@type':'Brand',name:org.name},weight:{'@type':'QuantitativeValue',value:250,unitCode:'GRM'},offers:{'@type':'Offer',price,priceCurrency:'COP',url:url+'#'+id,seller:{'@id':org['@id']}}}}))};
  }
  const schema = {'@context':'https://schema.org','@graph':[org,web,content]};
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">\n'+JSON.stringify(schema,null,2)+'\n  </script>');
}
for (const page of pages) {
  let spanish = fs.readFileSync(path.join(root,page.file),'utf8');
  const english = translate(spanish)
    .replace(/(href=")\/#/g,'$1/en/#')
    .replaceAll('href="/empresas/"','href="/en/business/"')
    .replaceAll('href="/"','href="/en/"')
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
console.log('Cuatro páginas estáticas y sitemap generados.');
