/* Los enlaces de contacto funcionan también sin JavaScript. */
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-list');
function closeMenu(returnFocus = false) {
  menu?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Abrir menú');
  if (returnFocus) toggle?.focus();
}
if (toggle && menu) {
  toggle.hidden = false;
  menu.classList.add('is-enhanced');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
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
  window.matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());
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
    coffee ? 'Hola, quiero pedir café con Origen, Pasión y Café.' : 'Hola, quiero reservar con Origen, Pasión y Café.',
    'Servicio: ' + value('tipo'),
    coffee && value('producto') ? 'Café: ' + value('producto') : '',
    coffee ? 'Presentación: bolsa de 250 g' : '',
    !coffee && value('fecha') ? 'Fecha tentativa: ' + value('fecha') : '',
    value('cantidad') ? (coffee ? 'Cantidad de bolsas: ' : 'Personas: ') + value('cantidad') : '',
    value('comentario') ? 'Comentario: ' + value('comentario') : '',
    '¿Me confirmas disponibilidad y valor total? Gracias.'
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
  if (quantityLabel) quantityLabel.textContent = coffee ? 'Cantidad de bolsas (opcional)' : 'Número de personas (opcional)';
  if (quantity) quantity.placeholder = coffee ? 'Ej. 2 bolsas' : 'Ej. 4 personas';
  if (selectionStatus) selectionStatus.textContent = 'Tu selección: ' + (coffee && product?.value ? product.value : tipo?.value || '');
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
