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

/* WhatsApp */
const WHATS_NUMBER = '573012669975';

function isMobileDevice() {
  // Most reliable on modern Chromium
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
    return navigator.userAgentData.mobile;
  }
  // Fallback
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
}

function buildMessage() {
  const tipo = document.getElementById('tipo')?.value || '';
  const fecha = document.getElementById('fecha')?.value || '';
  const cantidad = document.getElementById('cantidad')?.value || '';
  const comentario = document.getElementById('comentario')?.value || '';

  const lines = [
    'Hola 👋, quiero reservar con Origen, Pasión y Café.',
    tipo ? `☕ Servicio: ${tipo}` : '',
    fecha ? `📅 Fecha tentativa: ${fecha}` : '',
    cantidad ? `👥 Personas / cantidad: ${cantidad}` : '',
    comentario ? `📝 Comentario: ${comentario}` : '',
    '',
    'Gracias 🙌'
  ].filter(Boolean);

  return lines.join('\n');
}

function getWhatsAppUrl(encodedMsg) {
  // Mobile: opens WhatsApp app directly.
  // Desktop: opens WhatsApp Web.
  return isMobileDevice()
    ? `https://wa.me/${WHATS_NUMBER}?text=${encodedMsg}`
    : `https://web.whatsapp.com/send?phone=${WHATS_NUMBER}&text=${encodedMsg}`;
}

function setWhatsLinks() {
  const msg = encodeURIComponent(buildMessage());
  const url = getWhatsAppUrl(msg);

  const waBtn = document.getElementById('waBtn');
  const waFloat = document.getElementById('waFloat');
  if (waBtn) waBtn.href = url;
  if (waFloat) waFloat.href = url;
}

function openWhatsAppNow() {
  const msg = encodeURIComponent(buildMessage());
  const url = getWhatsAppUrl(msg);
  window.open(url, '_blank', 'noopener,noreferrer');
}

function applyPreset(presetKey) {
  const map = {
    cata: 'Cata de café de especialidad',
    curso_metodos: 'Curso de métodos (V60 / prensa / aeropress)',
    personalizada: 'Experiencia personalizada',
    eventos: 'Barra de café para eventos',
    blend_casa: 'Comprar café para casa',
    origen_frutal: 'Comprar café para casa',
    espresso_intenso: 'Comprar café para casa'
  };

  const tipo = document.getElementById('tipo');
  if (tipo && map[presetKey]) tipo.value = map[presetKey];
}

// Update WhatsApp link as the user types
['tipo', 'fecha', 'cantidad', 'comentario'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', setWhatsLinks);
});

// Buttons that set a preset (and on mobile, can jump straight to WhatsApp)
document.querySelectorAll('[data-preset]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const preset = btn.getAttribute('data-preset');
    if (preset) applyPreset(preset);
    setWhatsLinks();

    // On mobile, open WhatsApp directly after selecting the preset
    if (isMobileDevice()) {
      e.preventDefault();
      openWhatsAppNow();
    }
  });
});

// “Reservar por WhatsApp” style CTAs that currently point to #reservar
// Desktop: keep the smooth scroll to the form.
// Mobile: open WhatsApp immediately.
document.querySelectorAll('a[href="#reservar"]').forEach(a => {
  a.addEventListener('click', (e) => {
    if (!isMobileDevice()) return;

    // If this CTA also has a preset, apply it before opening
    const preset = a.getAttribute('data-preset');
    if (preset) applyPreset(preset);

    setWhatsLinks();
    e.preventDefault();
    openWhatsAppNow();
  });
});

setWhatsLinks();
