# Portal de recursos de Sand · versión Claude Code

Portal interno de recursos para el equipo técnico y comercial de Sand. Esta carpeta contiene la versión generada con **Claude Code** (rama `claude-code`). La versión de Codex vive aparte, en su propia rama y carpeta, y no se mezcla con esta.

Los recursos que se muestran son **datos de demostración**: enlazan a documentación pública oficial de Anthropic y OpenAI. No hay recursos internos de Sand.

## Cómo ejecutarlo en Windows

No hace falta instalar nada: ni Node, ni Python, ni cuenta, ni servidor.

**Opción A (la más sencilla).** Doble clic en `iniciar.bat`, o en `index.html`. Se abre en el navegador predeterminado.

**Opción B (servidor local, si se prefiere).** Con Python instalado, desde esta carpeta:

```powershell
py -m http.server 8080
```

y abrir <http://localhost:8080>. Para pararlo, `Ctrl+C`.

Requisitos: Windows y un navegador actual (Edge, Chrome o Firefox).

## Comprobaciones básicas

1. **Pruebas automáticas.** Abrir `pruebas.html`. Debe decir «Todas las pruebas pasan (26 de 26)». Comprueban la búsqueda, los filtros, los favoritos, el almacenamiento y la validez de los datos.
2. **Revisión manual** (2 minutos) en `index.html`:
   - Aparecen 15 tarjetas y el aviso «Datos de demostración».
   - Escribir `codex` en el buscador deja 4 tarjetas; no importan mayúsculas ni acentos.
   - Pulsar una categoría filtra; «Limpiar filtros» lo deja todo como al principio.
   - Marcar una estrella y recargar la página: el favorito sigue marcado. «Solo favoritos» muestra únicamente los marcados.
   - Buscar `zzzz` muestra el estado vacío «No hay recursos que coincidan». Con «Solo favoritos» y ninguno marcado sale «Todavía no tienes favoritos».
   - Reducir la ventana o abrirlo en el móvil: pasa de 3 columnas a 2 y a 1, sin barra de desplazamiento horizontal.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Página del portal |
| `css/estilos.css` | Estilos con la identidad visual de Sand |
| `js/datos.js` | 15 recursos de demostración (se sustituye por los reales manteniendo los campos) |
| `js/logica.js` | Búsqueda, filtros y favoritos, sin tocar el DOM |
| `js/app.js` | Interfaz: tarjetas, filtros y estados vacíos |
| `pruebas.html` | Pruebas de la lógica y de los datos, en el navegador |
| `assets/logo-sand-positivo.png` | Logo oficial de Sand, sin modificar |
| `iniciar.bat` | Abre el portal con doble clic |

## Qué se ha hecho

- **Tecnología:** HTML, CSS y JavaScript sin dependencias ni compilación. Los datos van en un archivo `.js` para que funcione al abrirlo directamente, sin servidor.
- **Tarjetas** con título, descripción, categoría (píldora), origen y enlace que abre en una pestaña nueva.
- **Búsqueda** sobre título, descripción, categoría y origen, sin distinguir mayúsculas ni acentos; varias palabras deben coincidir todas.
- **Filtros** por categoría con recuento y filtro «Solo favoritos». Se combinan con la búsqueda.
- **Favoritos** guardados en `localStorage` del navegador. Si el navegador no permite guardar (modo privado o bloqueado), el portal lo avisa y sigue funcionando mientras la página está abierta. Si se cambian en otra pestaña, esta se actualiza.
- **Estados vacíos** distintos para «sin resultados» y «sin favoritos», cada uno con su botón de salida.
- **Diseño adaptable** de 1, 2 o 3 columnas, con foco visible, etiquetas accesibles y zonas táctiles de al menos 44 px.
- **Marca Sand** (kit de marca 1.8): fondo hueso, Cambria en títulos y Calibri en el texto, raya naranja corta bajo el título, logo positivo arriba a la derecha, píldoras arena con texto navy, tarjetas sin relleno con borde fino y raya vertical arena, esquinas rectas, sin sombras ni degradados, y pie con el contacto de Sand.

## Límites

- Los favoritos son por navegador y por equipo: no se comparten entre personas.
- Los 15 recursos son ejemplos. Para publicar el portal con recursos reales hay que sustituir `js/datos.js` y decidir dónde se aloja.
- No incluye autenticación, backend ni servicios de pago, por diseño.
- Revisión visual hecha en el navegador integrado de la aplicación y en Edge sin interfaz. Conviene abrirlo en el navegador habitual antes de enseñarlo.

## Registro de generación

Generado con Claude Code (aplicación de escritorio de Claude, sesión de 11/11/2026) con el modelo **Claude Sonnet 5.5**, a partir del prompt común de la práctica. Intervención humana durante el desarrollo del portal: ninguna. Las decisiones previas (tecnología, estructura de ramas y carpetas, sin publicación ni push) se aprobaron antes de empezar.
