/* Interfaz del portal: pinta tarjetas, filtros y estados vacíos a partir de RECURSOS_DEMO. */
(function () {
  "use strict";

  var L = window.PortalLogica;
  var RECURSOS = window.RECURSOS_DEMO || [];
  var almacen = L.obtenerAlmacenamiento(window);

  var estado = {
    texto: "",
    categoria: "todas",
    soloFavoritos: false,
    favoritos: new Set(L.leerFavoritos(almacen))
  };

  var el = {
    buscador: document.getElementById("buscador"),
    categorias: document.getElementById("filtros-categoria"),
    botonFavoritos: document.getElementById("filtro-favoritos"),
    contadorFavoritos: document.getElementById("contador-favoritos"),
    resumen: document.getElementById("resumen"),
    limpiar: document.getElementById("limpiar"),
    rejilla: document.getElementById("rejilla"),
    vacio: document.getElementById("vacio"),
    avisoAlmacen: document.getElementById("aviso-almacen")
  };

  var SVG_ESTRELLA =
    '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">' +
    '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" ' +
    'stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  function crear(etiqueta, clase, texto) {
    var n = document.createElement(etiqueta);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function hayFiltros() {
    return estado.texto.trim() !== "" || estado.categoria !== "todas" || estado.soloFavoritos;
  }

  function persistir() {
    var ok = L.guardarFavoritos(almacen, estado.favoritos);
    el.avisoAlmacen.hidden = ok;
  }

  function alternarFavorito(id) {
    if (estado.favoritos.has(id)) estado.favoritos.delete(id);
    else estado.favoritos.add(id);
    persistir();
    pintar(id);
  }

  function pintarCategorias() {
    el.categorias.textContent = "";
    var lista = [{ nombre: "todas", etiqueta: "Todas", total: RECURSOS.length }].concat(
      L.categorias(RECURSOS).map(function (c) { return { nombre: c.nombre, etiqueta: c.nombre, total: c.total }; })
    );
    lista.forEach(function (c) {
      var b = crear("button", "chip");
      b.type = "button";
      b.setAttribute("aria-pressed", String(estado.categoria === c.nombre));
      b.dataset.categoria = c.nombre;
      b.appendChild(document.createTextNode(c.etiqueta + " "));
      b.appendChild(crear("span", "chip-n", "(" + c.total + ")"));
      b.addEventListener("click", function () {
        estado.categoria = c.nombre;
        pintar();
      });
      var li = crear("li");
      li.appendChild(b);
      el.categorias.appendChild(li);
    });
  }

  function crearTarjeta(r) {
    var esFav = estado.favoritos.has(r.id);
    var li = crear("li", "tarjeta");
    li.dataset.id = r.id;

    var cab = crear("div", "tarjeta-cab");
    cab.appendChild(crear("span", "pildora", r.categoria));
    var fav = crear("button", "fav");
    fav.type = "button";
    fav.setAttribute("aria-pressed", String(esFav));
    fav.setAttribute("aria-label", (esFav ? "Quitar de favoritos: " : "Añadir a favoritos: ") + r.titulo);
    fav.title = esFav ? "Quitar de favoritos" : "Añadir a favoritos";
    fav.innerHTML = SVG_ESTRELLA;
    fav.addEventListener("click", function () { alternarFavorito(r.id); });
    cab.appendChild(fav);
    li.appendChild(cab);

    li.appendChild(crear("h3", "tarjeta-titulo", r.titulo));
    li.appendChild(crear("p", "tarjeta-desc", r.descripcion));

    var pie = crear("div", "tarjeta-pie");
    var meta = crear("p", "meta", r.origen + " · documentación pública" + (r.demo ? " · dato de demostración" : ""));
    pie.appendChild(meta);
    var a = crear("a", "enlace", "Abrir recurso");
    a.href = r.enlace;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", "Abrir recurso: " + r.titulo + " (se abre en una pestaña nueva)");
    pie.appendChild(a);
    li.appendChild(pie);
    return li;
  }

  function pintarVacio(sinFavoritos) {
    el.vacio.textContent = "";
    var h = crear("h3", "vacio-titulo", sinFavoritos ? "Todavía no tienes favoritos" : "No hay recursos que coincidan");
    var p = crear("p", "vacio-texto", sinFavoritos
      ? "Marca la estrella de una tarjeta para guardarla aquí. Los favoritos se guardan solo en este navegador."
      : "Prueba con otras palabras o quita algún filtro.");
    var b = crear("button", "boton", sinFavoritos ? "Ver todos los recursos" : "Limpiar filtros");
    b.type = "button";
    b.addEventListener("click", limpiarFiltros);
    el.vacio.appendChild(h);
    el.vacio.appendChild(p);
    el.vacio.appendChild(b);
  }

  /** Repinta todo. Si se pasa un id, devuelve el foco a su botón de favorito. */
  function pintar(idFoco) {
    var resultado = L.filtrar(RECURSOS, estado);

    pintarCategorias();
    el.botonFavoritos.setAttribute("aria-pressed", String(estado.soloFavoritos));
    el.contadorFavoritos.textContent = "(" + estado.favoritos.size + ")";

    el.rejilla.textContent = "";
    resultado.forEach(function (r) { el.rejilla.appendChild(crearTarjeta(r)); });

    var vacio = resultado.length === 0;
    el.vacio.hidden = !vacio;
    el.rejilla.hidden = vacio;
    if (vacio) pintarVacio(estado.soloFavoritos && estado.favoritos.size === 0);

    el.resumen.textContent = vacio
      ? "Ningún recurso coincide con los filtros"
      : "Mostrando " + resultado.length + " de " + RECURSOS.length + " recursos";
    el.limpiar.hidden = !hayFiltros();

    if (idFoco) {
      var btn = el.rejilla.querySelector('[data-id="' + idFoco + '"] .fav');
      if (btn) btn.focus();
    }
  }

  function limpiarFiltros() {
    estado.texto = "";
    estado.categoria = "todas";
    estado.soloFavoritos = false;
    el.buscador.value = "";
    pintar();
    el.buscador.focus();
  }

  el.buscador.addEventListener("input", function () {
    estado.texto = el.buscador.value;
    pintar();
  });
  el.botonFavoritos.addEventListener("click", function () {
    estado.soloFavoritos = !estado.soloFavoritos;
    pintar();
  });
  el.limpiar.addEventListener("click", limpiarFiltros);

  // Si se cambian favoritos en otra pestaña, esta se actualiza.
  window.addEventListener("storage", function (e) {
    if (e.key === L.CLAVE_FAVORITOS) {
      estado.favoritos = new Set(L.leerFavoritos(almacen));
      pintar();
    }
  });

  el.avisoAlmacen.hidden = almacen !== null;
  pintar();
})();
