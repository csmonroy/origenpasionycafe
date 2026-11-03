/* Optional, consent-based measurement. Never send form text or WhatsApp URLs. */
(() => {
  'use strict';
  const id = 'G-PF2M4L02YS';
  const key = 'origen-analytics-choice-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const panel = document.getElementById('privacy-panel');
  if (!panel) return;
  const routes = {'/':'home','/en/':'home','/empresas/':'business','/en/business/':'business','/privacidad/':'privacy','/en/privacy/':'privacy'};
  const page = routes[window.location.pathname];
  // Preview environments never send production measurements.
  const production = window.location.hostname === 'origenpasionycafe.com' && Boolean(page);
  const services = {'Cata de café de especialidad':'tasting','Curso de métodos':'brewing_class','Experiencia personalizada':'personalised','Comprar café para casa':'coffee','Barra de café para eventos':'events','Coffee bar for events':'events','Café en verde':'green_coffee','Green coffee':'green_coffee','Café tostado por volumen':'bulk_coffee','Bulk roasted coffee':'bulk_coffee','Tostión de microlotes':'roasting','Microlot roasting':'roasting'};
  let choice = null;
  let started = false;
  let opener = null;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && ['accepted','rejected'].includes(saved.value) && saved.at <= Date.now() && Date.now()-saved.at < lifetime) choice=saved.value;
  } catch (_) { /* The website also works when storage is unavailable. */ }
  function gtag() { window.dataLayer.push(arguments); }
  function forgetCookies() {
    for (const cookie of document.cookie.split(';')) {
      const name=cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ['', '; domain=origenpasionycafe.com', '; domain=.origenpasionycafe.com']) document.cookie=name+'=; max-age=0; path=/'+domain;
    }
  }
  function start() {
    if (!production || started || choice !== 'accepted') return;
    started=true;
    window.dataLayer=window.dataLayer || [];
    window.gtag=gtag;
    window['ga-disable-'+id]=false;
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    let referrer='';
    try { if(document.referrer) referrer=new URL(document.referrer).origin+'/'; } catch (_) {}
    gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:180*86400,cookie_update:false,page_location:'https://origenpasionycafe.com'+window.location.pathname,page_referrer:referrer,page_title:document.title});
    gtag('event','page_view',{page_type:page,content_language:document.documentElement.lang==='en'?'en':'es'});
    const script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id='+id;
    document.head.appendChild(script);
  }
  function select(value) {
    const previouslyStarted=started;
    choice=value;
    try { localStorage.setItem(key,JSON.stringify({value,at:Date.now()})); } catch (_) {}
    panel.hidden=true;
    opener?.focus();
    if(value==='accepted') {
      // A reload cleanly restores measurement after a prior withdrawal.
      if(previouslyStarted && window['ga-disable-'+id]) window.location.reload();
      else start();
    } else {
      window['ga-disable-'+id]=true;
      forgetCookies();
      // Unload the Google tag so no later automatic events are sent.
      if(previouslyStarted) window.location.reload();
    }
  }
  panel.hidden=choice!==null;
  document.querySelectorAll('[data-privacy-choice]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.privacyChoice)));
  document.querySelectorAll('[data-privacy-settings]').forEach(button=>button.addEventListener('click',()=>{
    opener=button;panel.hidden=false;panel.querySelector('button')?.focus();
  }));
  function contact(anchor) {
    if(!production || choice!=='accepted' || !started || window['ga-disable-'+id]) return;
    let placement='direct_contact',service='general';
    if(anchor.id==='waBtn') { placement='reservation_form';service=services[document.getElementById('tipo')?.value]||'general'; }
    else if(anchor.id==='business-whatsapp') { placement='business_form';service=services[document.getElementById('business-service')?.value]||'general'; }
    else if(anchor.id==='waFloat') placement='header_contact';
    gtag('event','whatsapp_click',{page_type:page,contact_placement:placement,service_interest:service,content_language:document.documentElement.lang==='en'?'en':'es',transport_type:'beacon'});
  }
  document.addEventListener('click',event=>{
    const anchor=event.target.closest?.('a');
    if(!anchor) return;
    try { const url=new URL(anchor.href);if(url.hostname==='wa.me' && url.pathname==='/573012669975') contact(anchor); } catch (_) {}
  });
  document.addEventListener('submit',event=>{
    const anchor=event.target.id==='reservation-form'?document.getElementById('waBtn'):event.target.id==='business-form'?document.getElementById('business-whatsapp'):null;
    if(anchor) contact(anchor);
  },true);
  if(choice==='accepted') start();
})();
