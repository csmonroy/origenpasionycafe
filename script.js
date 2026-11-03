/* Los enlaces de contacto funcionan también sin JavaScript. */
const isEnglish = document.documentElement?.lang === 'en';
const text = (es, en) => isEnglish ? en : es;
const serviceNames = { 'Cata de café de especialidad': 'Specialty coffee tasting', 'Curso de métodos': 'Brewing methods class', 'Experiencia personalizada': 'Personalised experience', 'Barra de café para eventos': 'Coffee bar for events', 'Comprar café para casa': 'Coffee for home', 'Café en verde': 'Green coffee', 'Café tostado por volumen': 'Bulk roasted coffee', 'Tostión de microlotes': 'Microlot roasting' };
const serviceName = value => isEnglish ? serviceNames[value] || value : value;
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-list');
// El menú mantiene sus destinos; el estado indica la página o sección actual.
if (window.location?.href) {
  const languageLinks = [...document.querySelectorAll('.language-switch a')].map(link => ({ link, base: link.getAttribute('href').split('#')[0] }));
  function updateNavigationContext() {
    const current = new URL(window.location.href);
    document.querySelectorAll('.nav-list a').forEach(link => {
      const target = new URL(link.href, current);
      const section = document.getElementById(current.hash.slice(1))?.closest('section[id]');
      const matches = target.pathname === current.pathname && (target.hash ? target.hash === (current.hash || '#top') || target.hash === '#' + section?.id : !current.hash || current.hash === '#top');
      if (matches) link.setAttribute('aria-current', target.hash ? 'location' : 'page');
      else link.removeAttribute('aria-current');
    });
    languageLinks.forEach(({link,base}) => link.setAttribute('href', base + current.hash));
  }
  window.addEventListener('hashchange', updateNavigationContext);
  updateNavigationContext();
}
function closeMenu(returnFocus = false) {
  menu?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', text('Abrir menú', 'Open menu'));
  if (returnFocus) toggle?.focus();
}
if (toggle && menu) {
  toggle.hidden = false;
  menu.classList.add('is-enhanced');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? text('Cerrar menú', 'Close menu') : text('Abrir menú', 'Open menu'));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav')) closeMenu();
  });
  menu.addEventListener('focusout', event => {
    if (event.relatedTarget && !event.relatedTarget.closest('.nav')) closeMenu();
  });
  window.matchMedia('(min-width: 1051px)').addEventListener('change', () => closeMenu());
}
const WHATS_NUMBER = '573012669975';
const form = document.getElementById('reservation-form');
const tipo = document.getElementById('tipo');
const productField = document.getElementById('product-field');
const product = document.getElementById('producto');
const dateField = document.getElementById('date-field');
const quantityLabel = document.getElementById('quantity-label');
const quantity = document.getElementById('cantidad');
const waBtn = document.getElementById('waBtn');
const selectionStatus = document.getElementById('selection-status');
const presets = {
  cata: { service: 'Cata de café de especialidad' },
  curso_metodos: { service: 'Curso de métodos' },
  personalizada: { service: 'Experiencia personalizada' },
  eventos: { service: 'Barra de café para eventos' },
  blend_de_casa: { service: 'Comprar café para casa', product: 'Blend de Casa' },
  bourbon_rosado: { service: 'Comprar café para casa', product: 'Bourbon Rosado' },
  bourbon_sidra: { service: 'Comprar café para casa', product: 'Bourbon Sidra' }
};
function isCoffeeOrder() { return tipo?.value === 'Comprar café para casa'; }
function buildMessageDetailed() {
  const coffee = isCoffeeOrder();
  const value = id => document.getElementById(id)?.value.trim() || '';
  return [
    coffee ? text('Hola, quiero pedir café con Origen, Pasión y Café.', 'Hello, I’d like to order coffee from Origen, Pasión y Café.') : text('Hola, quiero reservar con Origen, Pasión y Café.', 'Hello, I’d like to book an experience with Origen, Pasión y Café.'),
    text('Servicio: ', 'Service: ') + serviceName(value('tipo')),
    coffee && value('producto') ? text('Café: ', 'Coffee: ') + value('producto') : '',
    coffee ? text('Presentación: bolsa de 250 g', 'Size: 250 g bag') : '',
    !coffee && value('fecha') ? text('Fecha tentativa: ', 'Tentative date: ') + value('fecha') : '',
    value('cantidad') ? (coffee ? text('Cantidad de bolsas: ', 'Number of bags: ') : text('Personas: ', 'People: ')) + value('cantidad') : '',
    value('comentario') ? text('Comentario: ', 'Comments: ') + value('comentario') : '',
    text('¿Me confirmas disponibilidad y valor total? Gracias.', 'Could you confirm availability and the total price? Thank you.')
  ].filter(Boolean).join('\n');
}
function makeWhatsUrl(message) {
  // WhatsApp resuelve el enlace HTTPS en la app o en su versión web.
  return 'https://wa.me/' + WHATS_NUMBER + '?text=' + encodeURIComponent(message);
}
function setWhatsLink() { if (waBtn) waBtn.href = makeWhatsUrl(buildMessageDetailed()); }
function updateForm() {
  const coffee = isCoffeeOrder();
  if (productField) productField.hidden = !coffee;
  if (dateField) dateField.hidden = coffee;
  if (quantityLabel) quantityLabel.textContent = coffee ? text('Cantidad de bolsas (opcional)', 'Number of bags (optional)') : text('Número de personas (opcional)', 'Number of people (optional)');
  if (quantity) quantity.placeholder = coffee ? text('Ej. 2 bolsas', 'E.g. 2 bags') : text('Ej. 4 personas', 'E.g. 4 people');
  if (selectionStatus) selectionStatus.textContent = text('Tu selección: ', 'Your selection: ') + (coffee && product?.value ? product.value : serviceName(tipo?.value || ''));
  setWhatsLink();
}
document.querySelectorAll('[data-preset]').forEach(button => {
  button.addEventListener('click', () => {
    const preset = presets[button.getAttribute('data-preset')];
    if (!preset || !tipo) return;
    if (isCoffeeOrder() !== (preset.service === 'Comprar café para casa') && quantity) quantity.value = '';
    tipo.value = preset.service;
    if (product) product.value = preset.product || '';
    updateForm();
  });
});
if (form) {
  tipo?.addEventListener('change', () => {
    if (quantity) quantity.value = '';
    if (product) product.value = '';
    updateForm();
  });
  form.addEventListener('input', setWhatsLink);
  product?.addEventListener('change', updateForm);
  form.addEventListener('submit', event => {
    event.preventDefault();
    window.location.assign(makeWhatsUrl(buildMessageDetailed()));
  });
  updateForm();
}

const businessForm = document.getElementById('business-form');
if (businessForm) {
  const businessLink = document.getElementById('business-whatsapp');
  const businessService = document.getElementById('business-service');
  function updateBusinessLink() {
    const value = id => document.getElementById(id)?.value.trim() || '';
    const isEvent = ['Barra de café para eventos', 'Coffee bar for events'].includes(value('business-service'));
    const eventFields = document.getElementById('event-fields');
    if (eventFields) eventFields.hidden = !isEvent;
    const message = [
      text('Hola, me gustaría una propuesta de café para mi organización.', 'Hello, I’d like a coffee proposal for my organisation.'),
      text('Servicio: ', 'Service: ') + serviceName(value('business-service')),
      value('business-organization') ? text('Organización: ', 'Organisation: ') + value('business-organization') : '',
      isEvent && value('event-date') ? text('Fecha y horario: ', 'Date and time: ') + value('event-date') : '',
      isEvent && value('event-place') ? text('Lugar del evento: ', 'Event location: ') + value('event-place') : '',
      isEvent && value('event-guests') ? text('Asistentes: ', 'Attendees: ') + value('event-guests') : '',
      isEvent && value('event-duration') ? text('Duración del servicio: ', 'Service duration: ') + value('event-duration') : '',
      value('business-details') ? text('Detalles: ', 'Details: ') + value('business-details') : '',
      text('¿Podemos revisar disponibilidad, alcance y valor? Gracias.', 'Could we discuss availability, scope and pricing? Thank you.')
    ].filter(Boolean).join('\n');
    businessLink.href = makeWhatsUrl(message);
  }
  businessForm.addEventListener('input', updateBusinessLink);
  businessForm.addEventListener('change', updateBusinessLink);
  document.querySelectorAll('[data-business-preset]').forEach(link => link.addEventListener('click', () => {
    businessService.value = serviceName(link.getAttribute('data-business-preset'));
    updateBusinessLink();
  }));
  businessForm.addEventListener('submit', event => { event.preventDefault(); updateBusinessLink(); window.location.assign(businessLink.href); });
  updateBusinessLink();
}
