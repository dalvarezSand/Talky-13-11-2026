# Portal de recursos de Sand

Versión Codex. Catálogo de demostración con enlaces públicos. HTML, CSS y JavaScript sin compilación ni paquetes. Los favoritos se guardan en el navegador para esta dirección y puerto.

## Ejecutar en Windows

Abre `index.html` directamente en Chromium o usa el servidor local de abajo. La apertura directa se probó en Chromium.

1. Descomprime el ZIP, si corresponde.
2. Abre PowerShell en la carpeta que contiene `index.html`. Comprueba que `python --version` devuelve Python 3.
3. Ejecuta `python -m http.server 8765 --bind 127.0.0.1`.
4. Abre [http://127.0.0.1:8765/](http://127.0.0.1:8765/) en Edge o Chrome. Para cerrar el servidor, pulsa Ctrl+C en PowerShell.

Usa siempre la misma dirección y puerto para ver los mismos favoritos. Los enlaces a documentación pública requieren Internet.

## Comprobaciones

- La portada carga seis recursos. Escribe «guia» y selecciona «Desarrollo». Aparece «Guía de JavaScript». Al seleccionar «Comercial» aparece el estado sin resultados.
- Guarda «Pro Git», activa «Solo favoritos» y recarga. El filtro vuelve a su estado inicial y el favorito sigue guardado. Activa «Solo favoritos» y quítalo. Aparece el estado sin favoritos.
- Recorre los controles con Tab y activa los botones con Espacio. Comprueba el foco visible.
- Reduce el ancho a unos 390 px. Las tarjetas pasan a una columna y los controles siguen visibles.
- Abre un enlace para verificar su destino.
