# Origen, Pasión y Café

Sitio estático en HTML, CSS y JavaScript. No requiere dependencias para servirlo. Incluye inicio y página independiente de empresas y eventos, en español e inglés.

## Páginas e idiomas

- `/`: café fresco tostado a demanda, tienda, catas y cursos.
- `/empresas/`: barra para eventos corporativos y asambleas de copropietarios, café verde, pedidos por volumen y tostión de microlotes con Kaleido M10S.
- `/en/` y `/en/business/`: versiones completas en inglés, incluidos formularios y mensajes de consulta.

Editar el contenido español en `index.html` y `empresas/index.html`. Mantener sus traducciones en `content/en.json` y ejecutar `node scripts/build-site.cjs` antes de publicar. El generador actualiza metadatos, datos estructurados, versiones inglesas y sitemap; falla si falta traducir texto visible. Los archivos generados de `en/` se guardan en Git. El hosting sigue sirviendo archivos estáticos sin compilación adicional. No editar directamente las páginas inglesas generadas.

Los títulos y descripciones SEO se mantienen en `scripts/build-site.cjs`; las etiquetas dinámicas de los formularios, en `script.js`. El selector ES/EN mantiene la página equivalente. No se fuerza el idioma según navegador o ubicación. El PDF original continúa en español y así se identifica en los enlaces de la versión inglesa.

## Comprobaciones

```sh
node scripts/build-site.cjs
node --check script.js
node --test tests/site.test.cjs
```

Además de estas pruebas, revisar en navegador que los botones de las tarjetas se vean completos, que no exista desplazamiento horizontal y que el menú móvil abra, cierre y responda a Escape. Probar los siete tipos de consulta sin enviar mensajes reales.

## Publicación

El catálogo se publica como `catalogo.pdf` en la raíz del sitio y se enlaza desde experiencias, café para casa y el pie de página. Su dirección pública es `https://origenpasionycafe.com/catalogo.pdf`. Para actualizarlo, reemplazar ese archivo por el nuevo PDF conservando el nombre y publicar el cambio en `main`. Editar el archivo original de Marketing no actualiza automáticamente la copia de la web. Comprobar que las condiciones del catálogo y la página coincidan antes de una nueva publicación.

Publicar `index.html`, `empresas/`, `en/`, `404.html`, `_headers`, `catalogo.pdf`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml` y `img/` en el hosting actual. El dominio canónico configurado es `https://origenpasionycafe.com/`. Los cambios locales no actualizan por sí solos la web pública.

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
