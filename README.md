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

La revisión más reciente, mediciones y estados observados en Google/Bing están en [docs/revision-2026-11-02.md](docs/revision-2026-11-02.md). WhatsApp se integra en el encabezado; el menú móvil evita desplazamientos al inicializar y mantiene una alternativa sin JavaScript.

Ejecutar `node scripts/build-site.cjs` y `node --test tests/site.test.cjs tests/analytics.test.cjs`. Las pruebas cubren precios, presets, mensajes bilingües, privacidad, enlaces, anclas, imágenes, sitemap y destinos de redirección. Revisar también menús, detalles desplegables y formularios en móvil y escritorio. Los cambios se publican al enviar main al repositorio conectado a Cloudflare Pages. Comprobar las respuestas 301 reales en producción: un servidor estático genérico puede ignorar `_redirects`.

## Medición de contactos y privacidad

Google Analytics 4: cuenta `414507569`, propiedad `562075213`, flujo web `16258680038`, ID público `G-PF2M4L02YS`. `analytics.js` solo carga la etiqueta en el dominio de producción y después de aceptar la medición. La elección dura 180 días y se puede cambiar desde el pie. Las vistas previas locales no envían datos. Mantener desactivada la **medición mejorada** en el flujo: los enlaces de WhatsApp pueden contener textos privados. No activar capturas automáticas de formularios o enlaces.

El evento `whatsapp_click` registra `page_type`, `contact_placement`, `service_interest` y `content_language`, con categorías controladas. Nunca contiene texto libre del formulario ni la URL completa de WhatsApp. Los clics son intención de contacto, no conversaciones, reservas o ventas confirmadas. Se configura como evento clave sin importe monetario y una vez por sesión. No se envían eventos de compra. Para evaluar ventas reales, contrastar con las consultas recibidas y pedidos confirmados por el negocio.

Aviso y controles en español e inglés; políticas en `/privacidad/` y `/en/privacy/` (noindex, fuera del sitemap comercial). La medición elimina parámetros y fragmentos de la URL; solo conserva el origen del referente. Publicidad y Google Signals desactivados. Al retirar permiso se desactiva la etiqueta, se eliminan sus cookies accesibles y se recarga la página. El rechazo no impide consultar el sitio ni enviar consultas.

Bing: dominio verificado mediante el CNAME `4867a5249b293ffe0ac2c5f9228f054b` hacia `verify.bing.com`, con DNS only en Cloudflare. Conservar ese registro; la etiqueta `msvalidate.01` también permanece en la portada. Sitemap enviado, inicialmente en procesamiento. Search Console: solicitudes individuales de indexación aceptadas para `/cafe-para-eventos/` y `/experiencias-de-cafe/`; no equivalen a indexación completada.

Se confirmó en el informe en tiempo real de GA4 una visita y un `whatsapp_click` de prueba, sin enviar mensajes. Las cuatro dimensiones personalizadas están creadas. No interpretar esta comprobación como un cliente real.

Perfil de Empresa de Google creado como servicio en Bogotá, sin dirección pública, con teléfono, WhatsApp, web, servicios y descripción. Atención solo con reserva; la descripción informa consultas de lunes a domingo de 8 a. m. a 9 p. m. No se publica un horario de acceso libre. Google exige verificación mediante vídeo real del negocio por parte de su responsable; el perfil aún no es visible para clientes. Fotografías y testimonios reales siguen pendientes por decisión del negocio.


## Datos comerciales vigentes

Blend de Casa: $25.000 COP; Bourbon Rosado y Bourbon Sidra: $40.000 COP cada uno. Bolsas de 250 g. Cata: desde $80.000 COP por persona, 2 horas, 4–6 personas. Curso de métodos: desde $160.000 COP, 2–3 horas, 1–4 personas. Experiencia personalizada: desde $220.000 COP, 2–4 horas, 1–4 personas. Confirmar disponibilidad, valor total y logística por WhatsApp. No inventar inventario, reseñas, orígenes de lotes o fechas de tostión.

## Registro histórico

Las notas siguientes describen mediciones y prioridades de una versión anterior; no son resultados de la versión unificada. La configuración actual de medición e indexación se describe arriba.

## Auditoría SEO y rendimiento — 2 de noviembre de 2026, 12:12 (Bogotá)

Medición inicial de la portada pública con PageSpeed Insights, móvil emulado y red 4G lenta: rendimiento 97, accesibilidad 97, buenas prácticas 100 y SEO técnico 100; LCP 1,7 s, bloqueo total 0 ms y CLS 0. [Informe inicial](https://pagespeed.web.dev/analysis/https-origenpasionycafe-com/bf6jo4yrba?form_factor=mobile). No hay datos de campo suficientes en ese informe. Estas notas son de laboratorio y no miden posición, indexación ni visibilidad en respuestas de IA.

Correcciones derivadas de la auditoría:

- Bolsas en WebP con variantes de 480, 800 y 1254 px; selección por ancho de pantalla. Las tres versiones de 800 px suman 73.474 bytes frente a 358.054 bytes de los JPG originales, una reducción del 79,5 %. Se conservan los originales.
- Logo web de 480 px y variantes pequeñas para las imágenes empresariales. Se conservan dimensiones explícitas, carga diferida fuera de portada y prioridad alta para la imagen principal.
- Contraste de los números de beneficios y tarjetas corregido, conservando la paleta.
- Títulos de experiencias explícitos y datos estructurados de los tres servicios con duración, grupos y precios de referencia reales; anclas propias para cada tarjeta. El marcado de productos mantiene 250 g y precios en COP. No se añaden valoraciones ni inventario no confirmado. Una lista de productos en una landing no equivale a una ficha individual elegible para resultados de producto.
- Cabeceras `X-Robots-Tag: noindex` para README, documentación, scripts, pruebas y traducciones de mantenimiento. No se bloquea su rastreo en robots.txt, para permitir que se lea noindex. El catálogo PDF sigue accesible e indexable.
- Regla en Cloudflare, fuera del repositorio: «Dominio canónico: www a origenpasionycafe.com». Redirige `https://www.origenpasionycafe.com/*` mediante 301 a `https://origenpasionycafe.com/${1}`, conservando parámetros. Comprobada con `/en/business/?seo=check`. HTTP ya redirigía a HTTPS.

Comprobaciones: cuatro rutas públicas con 200 y canonical correcto; robots y sitemap accesibles; una ruta inexistente devuelve 404 real; index.html y rutas sin barra final se normalizan mediante 308. Quince pruebas cubren enlaces, formularios, idiomas, precios, anclas, datos estructurados y archivos de imágenes. Revisadas las cuatro páginas a 390 y 1280 px sin desbordamiento horizontal.

Prioridades siguientes:

1. Conectar/verificar el sitio en Google Search Console y Bing Webmaster Tools y enviar el sitemap. La sesión de Google consultada mostró la bienvenida para añadir sitio; no se obtuvo información de consultas, cobertura o posiciones y no se creó una propiedad. No interpretar esto como prueba de que el dominio no está indexado o de que no existe una propiedad en otra cuenta.
2. Completar el Perfil de Empresa de Google, si el negocio reúne los requisitos, con datos reales de atención y ubicación/área de servicio, fotografías propias y reseñas auténticas.
3. Crear páginas específicas de catas, cursos y barra para eventos cuando se disponga de suficiente contenido propio: qué incluye, público, logística, ejemplos reales y preguntas de clientes. Evitar páginas casi idénticas creadas solo para palabras clave.
4. Ampliar las fichas de los cafés con origen, productor, proceso, perfil y fecha de tostión confirmados. No inventar esos datos para SEO.
5. Comparar clics, impresiones y consultas por servicio cuando haya datos; medir conversiones a consultas respetando las preferencias de privacidad. No hay analítica nueva ni rastreadores añadidos en esta revisión.

Referencias: [Google: fundamentos SEO](https://developers.google.com/search/docs/essentials), [visibilidad en funciones de IA](https://developers.google.com/search/docs/appearance/ai-features), [Bing y Copilot](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a). No hacen falta archivos especiales para IA ni se pueden garantizar primeras posiciones.
