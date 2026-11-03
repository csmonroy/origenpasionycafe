# Origen, Pasión y Café

Sitio estático en HTML, CSS y JavaScript. No requiere dependencias para servirlo. Incluye cuatro páginas, cada una en español e inglés: inicio, empresas, café para eventos y experiencias de café.

## Páginas e idiomas

- `/`: café fresco de tostión reciente, tienda, catas y cursos.
- `/empresas/`: barra para eventos corporativos y asambleas de copropietarios, café verde, pedidos por volumen y tostión de microlotes con Kaleido M10S.
- `/cafe-para-eventos/`: barra de café en Bogotá, ocasiones, planificación y solicitud de propuesta.
- `/experiencias-de-cafe/`: cata, curso de métodos y experiencia personalizada, condiciones y consulta.
- `/en/`, `/en/business/`, `/en/event-coffee/` y `/en/coffee-experiences/`: versiones completas en inglés.

El botón dorado «Para empresas y eventos» separa el acceso empresarial del menú de consumidores. Empresas tiene identidad y navegación propias, con un acceso de regreso a «Para personas». La portada empresarial ocupa como mínimo el alto disponible de la pantalla en escritorio, descontando el encabezado. En móvil las secciones conservan altura natural para evitar recortes. La tostadora blanca aparece en una escena generada con IA integrada sobre el fondo oscuro. Por solicitud del negocio, el pie visible muestra únicamente «Kaleido M10S»; la procedencia y los prompts se conservan en docs/kaleido-blanca-ia.md. Al revisar el encabezado, comprobar ambos idiomas, el menú desplegable y los destinos de los enlaces con el encabezado fijo.

Editar el contenido español en `index.html`, `empresas/index.html`, `cafe-para-eventos/index.html` y `experiencias-de-cafe/index.html`. Mantener sus traducciones en `content/en.json` y ejecutar `node scripts/build-site.cjs` antes de publicar. El generador actualiza metadatos, datos estructurados, versiones inglesas y sitemap; falla si falta traducir texto visible. Los archivos generados de `en/` se guardan en Git. El hosting sigue sirviendo archivos estáticos sin compilación adicional. No editar directamente las páginas inglesas generadas.

Los títulos y descripciones SEO se mantienen en `scripts/build-site.cjs`; las etiquetas dinámicas de los formularios, en `script.js`. El selector ES/EN mantiene la página equivalente. No se fuerza el idioma según navegador o ubicación. El PDF original continúa en español y así se identifica en los enlaces de la versión inglesa.

## Medición de contactos y privacidad

Google Analytics 4: cuenta `414507569`, propiedad `562075213`, flujo web `16258680038`, ID público `G-PF2M4L02YS`. `analytics.js` solo carga la etiqueta en el dominio de producción y después de aceptar la medición. La elección dura 180 días y se puede cambiar desde el pie. Las vistas previas locales no envían datos. Mantener desactivada la **medición mejorada** en el flujo: los enlaces de WhatsApp pueden contener textos privados. No activar capturas automáticas de formularios o enlaces.

El evento `whatsapp_click` registra `page_type`, `contact_placement`, `service_interest` y `content_language`, con categorías controladas. Nunca contiene texto libre del formulario ni la URL completa de WhatsApp. Los clics son intención de contacto, no conversaciones, reservas o ventas confirmadas. Se configura como evento clave sin importe monetario y una vez por sesión. No se envían eventos de compra. Para evaluar ventas reales, contrastar con las consultas recibidas y pedidos confirmados por el negocio.

Aviso y controles en español e inglés; políticas en `/privacidad/` y `/en/privacy/` (noindex, fuera del sitemap comercial). La medición elimina parámetros y fragmentos de la URL; solo conserva el origen del referente. Publicidad y Google Signals desactivados. Al retirar permiso se desactiva la etiqueta, se eliminan sus cookies accesibles y se recarga la página. El rechazo no impide consultar el sitio ni enviar consultas.

Bing: dominio verificado mediante el CNAME `4867a5249b293ffe0ac2c5f9228f054b` hacia `verify.bing.com`, con DNS only en Cloudflare. Conservar ese registro; la etiqueta `msvalidate.01` también permanece en la portada. Sitemap enviado, inicialmente en procesamiento. Search Console: solicitudes individuales de indexación aceptadas para `/cafe-para-eventos/` y `/experiencias-de-cafe/`; no equivalen a indexación completada.

Se confirmó en el informe en tiempo real de GA4 una visita y un `whatsapp_click` de prueba, sin enviar mensajes. Las cuatro dimensiones personalizadas están creadas. No interpretar esta comprobación como un cliente real.

Perfil de Empresa de Google creado como servicio en Bogotá, sin dirección pública, con teléfono, WhatsApp, web, servicios y descripción. Atención solo con reserva; la descripción informa consultas de lunes a domingo de 8 a. m. a 9 p. m. No se publica un horario de acceso libre. Google exige verificación mediante vídeo real del negocio por parte de su responsable; el perfil aún no es visible para clientes. Fotografías y testimonios reales siguen pendientes por decisión del negocio.

## Comprobaciones

Ejecutar también `node --test tests/analytics.test.cjs`: consentimiento, rechazo, caducidad, entornos locales, exclusión de textos privados y retirada del permiso.

Las páginas dedicadas a eventos y experiencias comparten tipografía, paleta y navegación con el sitio. Cada una tiene su propio título, descripción, canonical, enlaces de idioma, datos de servicios y ruta de navegación. El sitemap contiene ocho páginas. Los formularios preparan una consulta y no envían mensajes automáticamente. Las pruebas incluyen sus destinos, traducciones y condiciones comerciales; la revisión visual contempla escritorio de 1280 px y móvil de 390 px.

La página de experiencias tiene una introducción breve sobre fondo claro y accesos a las tres experiencias. No repite la foto ni la portada a pantalla completa del inicio. Las tarjetas muestran precio, duración y grupo antes de la explicación, y el menú ofrece un regreso explícito al inicio. Mantener altura natural y contenido completo en móvil; no imponer un alto fijo ni ocultar el desbordamiento vertical para hacer caber una sección.

Search Console: propiedad de dominio `origenpasionycafe.com` verificada mediante un registro DNS TXT en Cloudflare el 2 de noviembre de 2026. Conservar ese registro para mantener la verificación. El sitemap público es `https://origenpasionycafe.com/sitemap.xml`. La verificación y el envío del sitemap no equivalen a indexación ni garantizan posiciones.

```sh
node scripts/build-site.cjs
node --check script.js
node --test tests/site.test.cjs
```

Además de estas pruebas, revisar en navegador que los botones de las tarjetas se vean completos, que no exista desplazamiento horizontal y que el menú móvil abra, cierre y responda a Escape. Probar los siete tipos de consulta sin enviar mensajes reales.

## Publicación

El catálogo se publica como `catalogo.pdf` en la raíz del sitio y se enlaza desde experiencias, café para casa y el pie de página. Su dirección pública es `https://origenpasionycafe.com/catalogo.pdf`. Para actualizarlo, reemplazar ese archivo por el nuevo PDF conservando el nombre y publicar el cambio en `main`. Editar el archivo original de Marketing no actualiza automáticamente la copia de la web. Comprobar que las condiciones del catálogo y la página coincidan antes de una nueva publicación.

Publicar `index.html`, `empresas/`, `cafe-para-eventos/`, `experiencias-de-cafe/`, `en/`, `privacidad/`, `404.html`, `_headers`, `catalogo.pdf`, `styles.css`, `script.js`, `analytics.js`, `robots.txt`, `sitemap.xml` y `img/` en el hosting actual. El dominio canónico configurado es `https://origenpasionycafe.com/`. Los cambios locales no actualizan por sí solos la web pública.

El hosting es Cloudflare Pages, conectado a la rama `main` de este repositorio. Un push a `main` activa el despliegue. Al cambiar CSS o JavaScript, actualizar también el parámetro `v` de sus referencias en `index.html` para renovar la caché de los visitantes existentes.

## Contenido comercial

- Cata: desde $80.000 COP, 2 horas, 4–6 personas.
- Curso de métodos: desde $160.000 COP, 2–3 horas, 1–4 personas.
- Experiencia personalizada: desde $220.000 COP, 2–4 horas, 1–4 personas.
- Bolsas de 250 g: Blend de Casa, $25.000 COP; Bourbon Rosado y Bourbon Sidra, $40.000 COP cada uno.
- Confirmar con el negocio molienda, envíos y lugar exacto antes de incorporarlos.
- Redes oficiales: [Instagram](https://www.instagram.com/origenpasionycafe/), [Facebook](https://www.facebook.com/OrigenPasionyCafeCo/) y [TikTok](https://www.tiktok.com/@origenpasionycafe). Incluidas en el pie de página y en `sameAs` de la organización.
- Las imágenes del catálogo son ilustraciones de bolsas generadas con IA, no fotografías de empaques reales. Sustituirlas por fotografías propias cuando estén disponibles. El registro de prompts y archivos está en `docs/imagenes-catalogo.md`.
- Actualizar conjuntamente tarjetas, opciones del formulario, preguntas frecuentes y metadatos si cambian los precios o condiciones.
- La tostión a demanda y los cuatro servicios para organizaciones fueron confirmados por el negocio el 2 de noviembre de 2026. No publicar capacidades de la Kaleido, pedidos mínimos, precios empresariales o plazos sin confirmarlos. Los formularios preparan consultas de WhatsApp; no envían datos automáticamente ni confirman contratos.
- El mensaje para consumidores se centra en café de tostión reciente y sus aromas y matices. Evitar decir que cada pedido requiere programar una tostión; consultar disponibilidad sin prometer inventario o entrega inmediata. Los textos y metadatos se mantienen coherentes en español e inglés.
- La jerarquía visual usa títulos de sección grandes, explicaciones de 16–18 px y detalles de 14 px. El índice de servicios empresariales presenta cuatro accesos grandes. Comprobar las cuatro páginas en móvil y escritorio al cambiar textos o tipografías.

## SEO después de publicar

1. Verificar en Google Search Console la propiedad del dominio, enviar `/sitemap.xml` y solicitar la inspección de la página principal.
2. Verificar que el hosting entrega HTML, imágenes, robots y sitemap con estado 200; redirigir HTTP y el dominio alternativo a la URL canónica desde el hosting.
3. Completar el Perfil de Empresa de Google con datos reales de atención, ubicación o área de servicio y fotografías propias, si corresponde al negocio.
4. Medir consultas, impresiones y clics para “catas de café en Bogotá”, “curso de métodos de café” y variaciones relevantes. No existe garantía de una primera posición.
5. Medir Core Web Vitals y rendimiento móvil en la versión publicada; añadir contenido útil basado en preguntas de clientes, sin repetir palabras clave artificialmente.

El marcado describe la organización, el sitio, cada página, los productos de 250 g y los servicios empresariales. Cada versión tiene canonical propio y referencias recíprocas `hreflang` (es, en y x-default). No declara reseñas, puntuaciones, dirección física, inventario ni horarios sin confirmar. Las preguntas frecuentes son contenido útil visible; no se promete un resultado enriquecido de Google.

## Revisión del 2 de noviembre de 2026

Se verifican enlaces internos, imágenes locales, secciones de destino, precios en COP, mensajes de compra y cotización en ambos idiomas y consistencia de metadatos. La revisión en navegador incluye anchos de 320, 390, 768, 1280 y 1920 px, menú móvil y selección de café. Las nuevas imágenes del catálogo se sirven en WebP y las que quedan fuera de portada cargan de forma diferida. `404.html` evita mostrar la portada como si fuera una URL válida inexistente.

El sitio ofrece contenido legible sin JavaScript y permite rastreo en `robots.txt`. Esto facilita el descubrimiento; no garantiza indexación, posiciones ni citas de IA. Queda pendiente comprobar impresiones e indexación desde las cuentas de Google Search Console y Bing Webmaster Tools, enviar allí el sitemap y medir Core Web Vitals con datos reales. No se ha realizado una auditoría de esas cuentas ni una medición de campo de rendimiento.

Las condiciones de la cata se unificaron con el catálogo por confirmación del negocio: 2 horas, 4–6 personas y precio desde $80.000 COP. El PDF se conserva intacto. Las ilustraciones del catálogo no acreditan instalaciones o equipos reales.

Fuentes oficiales: [Guía de SEO de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) y [datos estructurados de organizaciones](https://developers.google.com/search/docs/appearance/structured-data/organization).

Referencias para esta revisión: [Google: funciones de IA](https://developers.google.com/search/docs/appearance/ai-features), [sitios multilingües](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) y [directrices de Bing y Copilot](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a).

La página empresarial agrupa el título y el índice en una introducción delimitada. Los servicios de eventos, café verde y volumen tienen paneles con fondo, borde y márgenes internos; los detalles de tostión y las preguntas frecuentes también conservan agrupación visual. Mantener la portada a alto de pantalla en escritorio y la altura natural en móvil.

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
