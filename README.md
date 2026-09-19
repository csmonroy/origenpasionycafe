# Origen, Pasión y Café

Landing estática en HTML, CSS y JavaScript. No requiere dependencias ni compilación.

## Comprobaciones

```sh
node --check script.js
node --test tests/site.test.cjs
```

Además de estas pruebas, revisar en navegador que los botones de las tarjetas se vean completos, que no exista desplazamiento horizontal y que el menú móvil abra, cierre y responda a Escape. Probar los siete tipos de consulta sin enviar mensajes reales.

## Publicación

Publicar `index.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml` y la carpeta `img/` en el hosting actual. El dominio canónico configurado es `https://origenpasionycafe.com/`. Los cambios locales no actualizan por sí solos la web pública.

El hosting es Cloudflare Pages, conectado a la rama `main` de este repositorio. Un push a `main` activa el despliegue. Al cambiar CSS o JavaScript, actualizar también el parámetro `v` de sus referencias en `index.html` para renovar la caché de los visitantes existentes.

## Contenido comercial

- Cata: desde $80.000 COP, 60–90 minutos, 1–6 personas.
- Curso de métodos: desde $160.000 COP, 2–3 horas, 1–4 personas.
- Experiencia personalizada: desde $220.000 COP, 2–4 horas, 1–4 personas.
- Bolsas de 250 g: Blend Casa y Origen Frutal, $25.000 COP; Origen Exótico, $40.000 COP.
- Confirmar con el negocio molienda, envíos, lugar exacto y redes oficiales antes de incorporarlos. Los enlaces ficticios a redes fueron retirados.
- Las imágenes del catálogo son ilustraciones gráficas de los perfiles, no fotografías de empaques reales. Sustituirlas por fotografías propias cuando estén disponibles.
- Actualizar conjuntamente tarjetas, opciones del formulario, preguntas frecuentes y metadatos si cambian los precios o condiciones.

## SEO después de publicar

1. Verificar en Google Search Console la propiedad del dominio, enviar `/sitemap.xml` y solicitar la inspección de la página principal.
2. Verificar que el hosting entrega HTML, imágenes, robots y sitemap con estado 200; redirigir HTTP y el dominio alternativo a la URL canónica desde el hosting.
3. Completar el Perfil de Empresa de Google con datos reales de atención, ubicación o área de servicio y fotografías propias, si corresponde al negocio.
4. Medir consultas, impresiones y clics para “catas de café en Bogotá”, “curso de métodos de café” y variaciones relevantes. No existe garantía de una primera posición.
5. Medir Core Web Vitals y rendimiento móvil en la versión publicada; añadir contenido útil basado en preguntas de clientes, sin repetir palabras clave artificialmente.

El marcado actual describe la organización y el sitio. No declara reseñas, puntuaciones, dirección física ni horarios sin confirmar. Las preguntas frecuentes son contenido útil visible; no se promete un resultado enriquecido de Google.

Fuentes oficiales: [Guía de SEO de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) y [datos estructurados de organizaciones](https://developers.google.com/search/docs/appearance/structured-data/organization).
