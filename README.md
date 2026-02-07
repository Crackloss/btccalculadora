# Bitcoin Calculadora - Build System

Sistema de plantillas para generar las páginas estáticas de [bitcoincalculadora.com](https://bitcoincalculadora.com).

## Estructura

```
src/
  _includes/          ← Componentes compartidos (editar aquí = cambia en TODAS las páginas)
    head.html         ← Meta tags, GA, CSS imports
    header.html       ← Logo BTC + título del sitio
    nav.html          ← Menú de navegación
    affiliates.html   ← Sección hardware wallets (Trezor, Ledger, BitBox, Blockstream)
    price-info.html   ← Barra de precio en tiempo real
    footer.html       ← Footer para herramientas
    footer-blog.html  ← Footer para blog
  _pages/             ← Páginas individuales (solo contenido único + metadatos)
    index.html        ← Calculadora Sueldo (home)
    calculadora-dca.html
    conversor.html
    blog/
      index.html
      que-es-dca-bitcoin.html
      ahorrar-en-bitcoin-espana.html
      cuanto-invertir-en-bitcoin.html
  css/styles.css      ← Estilos globales
  js/main.js          ← JavaScript compartido (precio BTC, formateo, etc.)
  CNAME, robots.txt, sitemap.xml

docs/                 ← Output generado (NO editar manualmente)
build.py              ← Script de build (Python 3, sin dependencias)
```

## Uso

### Build completo
```bash
python3 build.py
```
Genera todas las páginas en `docs/`. Esto es lo que GitHub Pages sirve.

### Añadir una nueva herramienta

1. Crea un archivo en `src/_pages/`, por ejemplo `calculadora-impuestos.html`
2. Añade el frontmatter + contenido (usa cualquier página existente como referencia)
3. Usa `{{>affiliates}}`, `{{>price-info}}`, `{{>footer}}` donde los necesites
4. Ejecuta `python3 build.py`
5. Actualiza `src/sitemap.xml` y el menú en `src/_includes/nav.html`
6. Commit y push

### Ejemplo de página nueva mínima
```html
---
layout: tool
title: Mi Nueva Herramienta | Bitcoin Calculadora
description: Descripción SEO de la herramienta.
canonical: /mi-herramienta/
subtitle: Mi Herramienta
extra_scripts: |
  <script>
    // Tu JavaScript específico aquí
    initPriceUpdates();
  </script>
---

    <div class="hero-text">
      <h2>Mi <span class="accent">Nueva Herramienta</span></h2>
      <p>Descripción breve.</p>
    </div>

    <!-- Tu contenido aquí -->

{{>affiliates}}
{{>price-info}}
{{>footer}}
```

### Cambiar algo global

- **Añadir/quitar enlace de afiliado**: Edita `src/_includes/affiliates.html`
- **Cambiar el menú**: Edita `src/_includes/nav.html`
- **Cambiar Google Analytics**: Edita `src/_includes/head.html`
- **Cambiar el footer**: Edita `src/_includes/footer.html`

Después de cualquier cambio, ejecuta `python3 build.py` y haz commit.

## Despliegue en GitHub Pages

GitHub Pages sirve desde la carpeta `docs/`.
Configura en Settings → Pages → Source: `Deploy from a branch` → `main` → `/docs`.

Alternativamente, puedes copiar el contenido de `docs/` a la raíz del repo si prefieres servir desde root.

## Layouts disponibles

| Layout | Uso | Incluye automáticamente |
|--------|-----|------------------------|
| `tool` | Calculadoras/herramientas | head + header + nav + contenido + main.js |
| `blog` | Índice del blog | head + header + nav + contenido + footer-blog |
| `blog-article` | Artículos de blog | head + header + nav + contenido + affiliates + footer-blog |

## Variables de plantilla

| Variable | Descripción |
|----------|-------------|
| `{{title}}` | Título de la página (SEO) |
| `{{description}}` | Meta description |
| `{{canonical}}` | Ruta canónica (ej: `/conversor/`) |
| `{{subtitle}}` | Subtítulo bajo "Bitcoin Calculadora" |
| `{{active_sueldo}}` | `true` para destacar "Sueldo" en nav |
| `{{active_dca}}` | `true` para destacar "DCA" en nav |
| `{{active_conversor}}` | `true` para destacar "Conversor" en nav |
| `{{active_blog}}` | `true` para destacar "Blog" en nav |
| `{{extra_styles}}` | CSS inline adicional (para estilos específicos de página) |
| `{{extra_scripts}}` | JS adicional al final del body |
| `{{schema}}` | Schema.org JSON-LD |
| `{{>nombre}}` | Incluir componente de `_includes/nombre.html` |
| `{{show_back_link}}` | `true` para mostrar "← Volver al blog" en footer-blog |
