const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../analytics.js'),'utf8');
function setup(saved,hostname='origenpasionycafe.com') {
  const handlers={},scripts=[],writes=[],fields={tipo:{value:'Curso de métodos'},'business-service':{value:'Barra de café para eventos'}};
  const buttons={};
  for(const value of ['accepted','rejected'])buttons[value]={dataset:{privacyChoice:value},addEventListener:(_,fn)=>buttons[value].click=fn};
  const panel={hidden:true,querySelector:()=>({focus(){}})};
  const document={title:'Origen',documentElement:{lang:'es-CO'},referrer:'https://www.google.com/search?q=private@example.com',cookie:'_ga=abc; _ga_PF2M4L02YS=def; other=keep',getElementById:id=>id==='privacy-panel'?panel:fields[id],querySelectorAll:s=>s==='[data-privacy-choice]'?Object.values(buttons):[],addEventListener:(name,fn)=>handlers[name]=fn,createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
  const window={location:{hostname,pathname:'/experiencias-de-cafe/',search:'?email=private@example.com',hash:'#private',reload(){window.reloaded=true;}}};
  const context=vm.createContext({window,document,Date,URL,localStorage:{getItem:()=>saved,setItem:(k,v)=>writes.push([k,v])}});
  vm.runInContext(source,context);
  const anchor={id:'waBtn',href:'https://wa.me/573012669975?text=Secret%20customer%20message',closest:()=>null};
  return {window,panel,scripts,writes,fields,choose:v=>buttons[v].click(),click:()=>handlers.click({target:{closest:()=>anchor}}),submit:()=>handlers.submit({target:{id:'reservation-form'}}),events:()=>Array.from(window.dataLayer||[],x=>Array.from(x))};
}
test('analytics loads only after valid consent, never on preview hosts',()=>{
  for(const saved of [null,'broken',JSON.stringify({value:'rejected',at:Date.now()}),JSON.stringify({value:'accepted',at:0}),JSON.stringify({value:'accepted',at:Date.now()+86400000})]){
    const s=setup(saved);s.click();assert.equal(s.scripts.length,0);assert.equal(s.events().length,0);
  }
  const preview=setup(JSON.stringify({value:'accepted',at:Date.now()}),'127.0.0.1');assert.equal(preview.scripts.length,0);
  const accepted=setup(null);assert.equal(accepted.panel.hidden,false);accepted.choose('accepted');assert.equal(accepted.scripts.length,1);assert.equal(accepted.panel.hidden,true);
  accepted.choose('accepted');assert.equal(accepted.scripts.length,1);
});
test('events exclude query strings, fragments, WhatsApp messages and arbitrary form values',()=>{
  const s=setup(null);s.choose('accepted');s.click();s.submit();
  let events=s.events();const config=events.find(x=>x[0]==='config')[2];
  assert.equal(config.page_location,'https://origenpasionycafe.com/experiencias-de-cafe/');assert.equal(config.page_referrer,'https://www.google.com/');
  assert.equal(config.allow_google_signals,false);assert.equal(config.allow_ad_personalization_signals,false);
  assert.equal(events.filter(x=>x[1]==='page_view').length,1);
  assert.equal(events.find(x=>x[1]==='whatsapp_click')[2].service_interest,'brewing_class');
  s.fields.tipo.value='private@example.com';s.click();events=s.events();assert.equal(events.at(-1)[2].service_interest,'general');
  assert.doesNotMatch(JSON.stringify(events),/private@example|Secret|wa\.me|#private/);
});
test('withdrawal stops later contact events and unloads the tag',()=>{
  const s=setup(null);s.choose('accepted');const before=s.events().length;s.choose('rejected');s.click();s.submit();assert.equal(s.events().length,before);assert.equal(s.window.reloaded,true);assert.equal(s.window['ga-disable-G-PF2M4L02YS'],true);assert.equal(JSON.parse(s.writes.at(-1)[1]).value,'rejected');
});
test('Bing verification, consent controls and bilingual privacy pages are published',()=>{
  const root=require('node:path').join(__dirname,'..');
  for(const file of ['index.html','empresas/index.html','cafe-para-eventos/index.html','experiencias-de-cafe/index.html','en/index.html','en/business/index.html','en/event-coffee/index.html','en/coffee-experiences/index.html','privacidad/index.html','en/privacy/index.html']){
    const html=fs.readFileSync(require('node:path').join(root,file),'utf8');assert.equal((html.match(/src="\/analytics.js/g)||[]).length,1);assert.equal((html.match(/id="privacy-panel"/g)||[]).length,1);assert.match(html,/data-privacy-choice="rejected"/);assert.match(html,/data-privacy-settings/);
    if(file.includes('privacy/')||file.startsWith('privacidad/')){assert.match(html,/noindex, follow/);assert.doesNotMatch(html,/"@type": "Product"|"@type": "Service"/);}
  }
  assert.match(fs.readFileSync(require('node:path').join(root,'index.html'),'utf8'),/name="msvalidate.01" content="07E571AC163FFADBBF28C20DA3B3D0D6"/);
});
