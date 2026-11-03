# Google, Analytics y buscadores — 3 de noviembre de 2026

Revisión posterior a la unificación en Personas y Empresas, con versiones en español e inglés. Los estados de indexación reflejan lo observado en esta fecha, no una garantía de posicionamiento.

## Configuración aplicada

- Se vinculó la propiedad de dominio de Search Console `origenpasionycafe.com` al flujo de Analytics `Sitio web Origen` (16258680038), en la propiedad 562075213. Confirmación visible: «Vinculación creada». Los informes Consultas y Tráfico de búsqueda orgánica de Google están disponibles en el menú de Informes; todavía no muestran datos de búsqueda.
- Se actualizó la descripción de `contact_placement` para identificar el encabezado, el formulario de personas, el formulario de empresas y los contactos directos. `floating_button` describe datos históricos; el código actual envía `header_contact`.
- Con autorización específica del propietario, se desactivó la personalización de anuncios en todas las regiones de la propiedad de Analytics. Confirmación visible: «Se pueden personalizar anuncios en 0 de 307 regiones». La etiqueta de la web ya excluía la personalización publicitaria. Se conserva la medición de visitas y contactos con consentimiento.
- Se solicitaron las dos URL inglesas en Search Console; ambas solicitudes fueron aceptadas en la cola de rastreo. No se reenviaron las dos páginas españolas ya indexadas.

## Search Console

| URL | Estado observado |
| --- | --- |
| `/` | En Google, indexada. Tres productos válidos; rastreo de productos del 3 de noviembre. |
| `/empresas/` | En Google, indexada. Último rastreo: 2 de noviembre, 21:52:52. Google selecciona la URL inspeccionada como canónica. |
| `/en/` | Descubierta, actualmente sin indexar. Solicitud de indexación aceptada. |
| `/en/business/` | Descubierta, actualmente sin indexar. Solicitud de indexación aceptada. |
| `/experiencias-de-cafe/` | Aún figura indexada con información del 2 de noviembre, 19:20:34, anterior a la redirección actual. |
| `/cafe-para-eventos/` | Aún figura indexada con información del 2 de noviembre, 19:18:34, anterior a la redirección actual. |

El sitemap se ha procesado correctamente y Google reconoce cuatro páginas descubiertas. Los informes generales de rendimiento e indexación continúan procesándose. No hay acciones manuales ni problemas de seguridad detectados. Core Web Vitals aún no dispone de suficientes datos reales de uso en móviles u ordenadores.

Los tres cafés siguen siendo productos válidos con avisos opcionales. En Fragmentos de productos faltan `aggregateRating`, `review` y `offers.availability`. No se inventaron reseñas ni disponibilidad; las políticas comerciales pendientes de confirmar no se rellenaron con datos supuestos.

Conservar los 301 de las páginas retiradas hacia las secciones actuales. No bloquearlas en robots ni usar la retirada temporal de Google para intentar completar esta migración. Google debe volver a rastrear las direcciones anteriores. Las visitas históricas a esas páginas y sus títulos también permanecerán en Analytics.

## Analytics

- Flujo único: dominio `https://origenpasionycafe.com`, ID de medición `G-PF2M4L02YS`. Recepción de tráfico confirmada durante las últimas 48 horas.
- Zona horaria: Colombia (GMT-05:00); moneda: peso colombiano. Objetivos: oportunidades de venta y tráfico web.
- `whatsapp_click` está marcado como evento clave y se cuenta una vez por sesión. Mide intención de contacto, no una conversación, reserva o venta confirmada. Los registros de pruebas anteriores no deben interpretarse como clientes.
- Dimensiones existentes verificadas: `page_type`, `content_language`, `service_interest` y `contact_placement`.
- Medición mejorada desactivada; ninguna etiqueta de sitio adicional conectada. Google signals y recogida de datos proporcionados por los usuarios no activados.
- La web solo inicia Analytics en producción y después de aceptar la medición. El código excluye texto libre, mensajes de WhatsApp, parámetros de URL y fragmentos. Las vistas previas no envían mediciones.

## Verificación de la web

- 30 pruebas automatizadas aprobadas: navegación, formularios, idiomas, metadatos, sitemap, redirecciones, precios y consentimiento.
- Las cuatro URL comerciales responden 200, tienen canonical propio y JSON-LD válido. Cada una incluye una sola carga de `analytics.js` y no incluye una carga directa adicional de gtag.
- El archivo `analytics.js` publicado coincide exactamente con el código revisado y probado. No fue necesario modificar la interfaz ni la implementación de medición.

## Cloudflare y Bing, comprobados en la sesión anterior del mismo día

Crawler Hints activado con aceptación expresa de términos por el propietario. Bing procesa correctamente el sitemap de cuatro URL, sin errores ni advertencias. Las dos páginas inglesas se enviaron; las españolas ya estaban enviadas y habían figurado indexadas. Las doce variantes de URL retiradas responden 301 hacia sus secciones equivalentes. La lista de envíos es histórica y conserva las direcciones anteriores.

## Seguimiento

Esperar el procesamiento de las dos versiones inglesas, las redirecciones y los informes. No repetir solicitudes para intentar acelerar la cola. La verificación por vídeo del Perfil de Empresa y las fotografías/testimonios reales conservan su pendiente anterior; no se volvieron a revisar ni se completaron en esta auditoría.

- [Google Search Console](https://search.google.com/search-console?resource_id=sc-domain%3Aorigenpasionycafe.com)
- [Google Analytics](https://analytics.google.com/analytics/web/#/a414507569p562075213/reports/intelligenthome)
- [Integración Search Console–Analytics](https://support.google.com/analytics/answer/10737381)
- [Procesamiento de cambios de URL en Google](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
