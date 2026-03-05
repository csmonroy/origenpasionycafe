/* AOS init */
AOS.init({
  once: true,
  offset: 80,
  duration: 700,
  easing: 'ease-out-cubic'
});

/* Mobile nav */
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-list');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

/* WhatsApp builder */
const WHATS_NUMBER = '573012669975';

function isMobileDevice() {
  // Heurística simple + soporte para tablets/phones
  return (
    /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );
}

function buildMessageDetailed() {
  const tipo = document.getElementById('tipo')?.value || '';
  const fecha = document.getElementById('fecha')?.value || '';
  const cantidad = document.getElementById('cantidad')?.value || '';
  const comentario = document.getElementById('comentario')?.value || '';

  const lines = [
    'Hola, quiero reservar con Origen, Pasión y Café.',
    tipo ? `Servicio: ${tipo}` : '',
    fecha ? `Fecha tentativa: ${fecha}` : '',
    cantidad ? `Personas / cantidad: ${cantidad}` : '',
    comentario ? `Comentario: ${comentario}` : '',
    '',
    'Gracias'
  ].filter(Boolean);

  return lines.join('\n');
}

function buildMessageGeneric() {
  return [
    'Hola, quiero reservar con Origen, Pasión y Café.',
    '¿Me ayudas con disponibilidad y opciones?',
    '',
    'Gracias'
  ].join('\n');
}

function makeWhatsUrl(message) {
  const msg = encodeURIComponent(message);
  const waMeUrl = `https://wa.me/${WHATS_NUMBER}?text=${msg}`;
  const deepLink = `whatsapp://send?phone=${WHATS_NUMBER}&text=${msg}`;
  return isMobileDevice() ? deepLink : waMeUrl;
}

function setWhatsLinks() {
  const waBtn = document.getElementById('waBtn');
  const waFloat = document.getElementById('waFloat');

  // Botón del formulario -> detallado
  if (waBtn) waBtn.href = makeWhatsUrl(buildMessageDetailed());

  // Flotante -> genérico (no se “contamina” con presets)
  if (waFloat) waFloat.href = makeWhatsUrl(buildMessageGeneric());
}

// En móvil, forzamos intento de abrir la app (y si falla, cae a wa.me)
function attachWhatsAppFallback(anchorId, getMessageFn) {
  const a = document.getElementById(anchorId);
  if (!a) return;

  a.addEventListener('click', (e) => {
    if (!isMobileDevice()) return;

    e.preventDefault();
    const msg = encodeURIComponent(getMessageFn());
    const deepLink = `whatsapp://send?phone=${WHATS_NUMBER}&text=${msg}`;
    const waMeUrl = `https://wa.me/${WHATS_NUMBER}?text=${msg}`;

    window.location.href = deepLink;
    setTimeout(() => { window.location.href = waMeUrl; }, 600);
  });
}

['tipo','fecha','cantidad','comentario'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', setWhatsLinks);
});

document.querySelectorAll('[data-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = btn.getAttribute('data-preset');
    const map = {
      'cata': 'Cata de café de especialidad',
      'curso_metodos': 'Curso de métodos (V60 / prensa / aeropress)',
      'personalizada': 'Experiencia personalizada',
      'eventos': 'Barra de café para eventos',
      'blend_casa': 'Comprar café para casa',
      'origen_frutal': 'Comprar café para casa',
      'espresso_intenso': 'Comprar café para casa'
    };
    const tipo = document.getElementById('tipo');
    if (tipo && map[preset]) tipo.value = map[preset];
    setWhatsLinks();
  });
});

setWhatsLinks();

attachWhatsAppFallback('waBtn', buildMessageDetailed);
attachWhatsAppFallback('waFloat', buildMessageGeneric);