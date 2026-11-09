# Origen, Pasión y Café

Sitio estático en HTML, CSS y JavaScript, publicado en Cloudflare Pages desde la rama main de GitHub. No requiere dependencias para servirlo.

## Dos páginas comerciales, dos idiomas

- Personas: `/` y `/en/`. Café para casa, catas y cursos, nuestra esencia, consulta y preguntas frecuentes.
- Empresas y eventos: `/empresas/` y `/en/business/`. Barra para eventos, café verde, volumen, tostión y cotización.
- Privacidad: `/privacidad/` y `/en/privacy/`, fuera del sitemap y con noindex. El catálogo PDF conserva su dirección.

Cada menú comercial salta a secciones de su misma página. El botón destacado cambia de público. La definición compartida está en `scripts/build-site.cjs`; los enlaces del pie siguen los mismos destinos. El selector ES/EN conserva la sección visitada.

Editar `index.html` y `empresas/index.html`; mantener las traducciones en `content/en.json` y ejecutar `node scripts/build-site.cjs`. El generador produce las versiones inglesas, metadatos, datos estructurados y sitemap. No editar directamente los HTML de `en/`.

Las experiencias se comparan en tres tarjetas con fotos, condiciones, precio y detalles desplegables nativos. Todo el texto existe en el HTML sin depender de JavaScript. El formulario de personas recibe la selección de café o experiencia. El de empresas recibe el servicio; fecha, lugar, asistentes y duración solo se muestran y se incluyen en la consulta cuando se elige eventos. Ningún formulario envía mensajes automáticamente.

Las imágenes editoriales de cata, métodos, espresso, eventos y origen tienen variantes WebP de 480 y 960 px y carga diferida. Procedencia y prompts: `content/editorial-images.json`. Son ilustraciones y no acreditan instalaciones reales. La tostadora blanca conserva el registro `docs/kaleido-blanca-ia.md`.

## Unificación y direcciones anteriores

Las páginas de experiencias y eventos se integraron en sus respectivos públicos. `_redirects` aplica 301 en español e inglés, incluyendo rutas sin barra y con index.html:

- `/experiencias-de-cafe/` → `/#experiencias`
- `/en/coffee-experiences/` → `/en/#experiencias`
- `/cafe-para-eventos/` → `/empresas/#barra`
- `/en/event-coffee/` → `/en/business/#barra`

Conservar estas redirecciones. No recrear las antiguas páginas con contenido duplicado. El sitemap contiene las cuatro URL comerciales vigentes; los servicios y productos apuntan a sus nuevas anclas. Los fragmentos antiguos llevan a la sección de experiencias o eventos, donde se encuentran las opciones integradas. Google puede tardar en procesar el cambio y presentar variaciones temporales. Consultar los informes de Search Console y Bing después de la publicación; no confundir una redirección comprobada con una indexación o posición garantizada.

## Verificación y publicación

La revisión de estructura y rendimiento está en [docs/revision-2026-11-02.md](docs/revision-2026-11-02.md). La configuración y los estados más recientes de Google, Analytics y Bing están en [docs/revision-google-analytics-2026-11-03.md](docs/revision-google-analytics-2026-11-03.md). WhatsApp se integra en el encabezado; el menú móvil evita desplazamientos al inicializar y mantiene una alternativa sin JavaScript.

Ejecutar `node scripts/build-site.cjs` y `node --test tests/*.test.cjs`. Las pruebas cubren precios, presets, mensajes bilingües, privacidad, enlaces, anclas, imágenes, sitemap y destinos de redirección. Revisar también menús, detalles desplegables y formularios en móvil y escritorio. Los cambios se publican al enviar main al repositorio conectado a Cloudflare Pages. Comprobar las respuestas 301 reales en producción: un servidor estático genérico puede ignorar `_redirects`.

## Medición de contactos y privacidad

Google Analytics 4: cuenta `414507569`, propiedad `562075213`, flujo web `16258680038`, ID público `G-PF2M4L02YS`. `analytics.js` solo carga la etiqueta en el dominio de producción y después de aceptar la medición. La elección dura 180 días y se puede cambiar desde el pie. Las vistas previas locales no envían datos. Mantener desactivada la **medición mejorada** en el flujo: los enlaces de WhatsApp pueden contener textos privados. No activar capturas automáticas de formularios o enlaces.

El contacto del encabezado usa `contact_placement: header_contact`; los datos históricos anteriores a la limpieza conservan `floating_button`. El evento `whatsapp_click` registra `page_type`, `contact_placement`, `service_interest` y `content_language`, con categorías controladas. Nunca contiene texto libre del formulario ni la URL completa de WhatsApp. Los clics son intención de contacto, no conversaciones, reservas o ventas confirmadas. Se configura como evento clave sin importe monetario y una vez por sesión. No se envían eventos de compra. Para evaluar ventas reales, contrastar con las consultas recibidas y pedidos confirmados por el negocio.

Aviso y controles en español e inglés; políticas en `/privacidad/` y `/en/privacy/` (noindex, fuera del sitemap comercial). La medición elimina parámetros y fragmentos de la URL; solo conserva el origen del referente. Publicidad y Google Signals desactivados. Al retirar permiso se desactiva la etiqueta, se eliminan sus cookies accesibles y se recarga la página. El rechazo no impide consultar el sitio ni enviar consultas.

Bing: dominio verificado mediante el CNAME `4867a5249b293ffe0ac2c5f9228f054b` hacia `verify.bing.com`, con DNS only en Cloudflare. Conservar ese registro; la etiqueta `msvalidate.01` también permanece en la portada. Sitemap actualizado con las cuatro URL comerciales. Crawler Hints está activado en Cloudflare. Los últimos estados de Google y Bing están en `docs/revision-google-analytics-2026-11-03.md`; las solicitudes de indexación no equivalen a indexación completada.

Se confirmó en el informe en tiempo real de GA4 una visita y un `whatsapp_click` de prueba, sin enviar mensajes. Las cuatro dimensiones personalizadas están creadas. No interpretar esta comprobación como un cliente real. Desde el 3 de noviembre, Search Console está vinculado al flujo web y sus informes están disponibles en Analytics. La personalización publicitaria también está desactivada en todas las regiones de la propiedad, con autorización del propietario.

Perfil de Empresa de Google creado como servicio en Bogotá, sin dirección pública, con teléfono, WhatsApp, web, servicios y descripción. Atención solo con reserva; la descripción informa consultas de lunes a domingo de 8 a. m. a 9 p. m. No se publica un horario de acceso libre. Google exige verificación mediante vídeo real del negocio por parte de su responsable; el perfil aún no es visible para clientes. Fotografías y testimonios reales siguen pendientes por decisión del negocio.


## Datos comerciales vigentes

Blend de Casa: $25.000 COP; Bourbon Rosado y Bourbon Sidra: $40.000 COP cada uno. Bolsas de 250 g. Cata: desde $80.000 COP por persona, 2 horas, 4–6 personas. Curso de métodos: desde $160.000 COP, 2–3 horas, 1–4 personas. Experiencia personalizada: desde $220.000 COP, 2–4 horas, 1–4 personas. Confirmar disponibilidad, valor total y logística por WhatsApp. No inventar inventario, reseñas, orígenes de lotes o fechas de tostión.

Barra para eventos: capuchino, americano y filtrado como opciones habituales; otras bebidas se pueden agregar a la propuesta. Reservar con al menos 5 días de anticipación, sujeto a disponibilidad. Tostión de microlotes: mínimo 1 kg. Condiciones confirmadas por el propietario el 9 de noviembre de 2026. Las preguntas frecuentes de ambos públicos usan un acordeón nativo de apertura exclusiva; los tres puntos de preparación de la barra permanecen visibles y el botón de cotización cierra la explicación.

## Mantenimiento y procedencia

`tests/structure.test.cjs` comprueba que todas las páginas de contenido se alcancen desde el inicio, que los destinos y recursos existan, que no queden imágenes sin referencia y que las traducciones correspondan a textos actuales. La página 404 es una excepción deliberada: la sirve el alojamiento cuando una URL no existe.

La limpieza del 2 de noviembre de 2026 retiró estilos de páginas eliminadas, traducciones antiguas e imágenes sustituidas. Las versiones anteriores siguen recuperables en Git. Se mantienen las redirecciones 301, los controles de privacidad y las notas de procedencia: [portada](docs/fotografia-portada.md), [catálogo](docs/imagenes-catalogo.md), [Kaleido blanca](docs/kaleido-blanca-ia.md) e [imágenes editoriales](content/editorial-images.json).
