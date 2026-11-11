/* Lógica pura del portal: sin acceso al DOM, para poder probarla en pruebas.html. */
(function (raiz) {
  "use strict";

  var CLAVE_FAVORITOS = "sand-portal-recursos:favoritos";

  /** Minúsculas y sin acentos, para buscar sin distinguirlos. */
  function normalizar(texto) {
    return String(texto == null ? "" : texto)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  }

  /** Categorías en orden de aparición, con el número de recursos de cada una. */
  function categorias(recursos) {
    var orden = [], cuenta = {};
    recursos.forEach(function (r) {
      if (!(r.categoria in cuenta)) { cuenta[r.categoria] = 0; orden.push(r.categoria); }
      cuenta[r.categoria] += 1;
    });
    return orden.map(function (nombre) { return { nombre: nombre, total: cuenta[nombre] }; });
  }

  /**
   * Filtra por texto, categoría y favoritos a la vez.
   * criterios: { texto: string, categoria: string ("" o "todas" = todas), soloFavoritos: bool, favoritos: Set|Array }
   */
  function filtrar(recursos, criterios) {
    var c = criterios || {};
    var palabras = normalizar(c.texto).split(/\s+/).filter(Boolean);
    var favs = c.favoritos instanceof Set ? c.favoritos : new Set(c.favoritos || []);
    var cat = c.categoria && c.categoria !== "todas" ? c.categoria : "";
    return recursos.filter(function (r) {
      if (cat && r.categoria !== cat) return false;
      if (c.soloFavoritos && !favs.has(r.id)) return false;
      if (!palabras.length) return true;
      var pajar = normalizar([r.titulo, r.descripcion, r.categoria, r.origen].join(" "));
      return palabras.every(function (p) { return pajar.indexOf(p) !== -1; });
    });
  }

  /** Devuelve localStorage si funciona, o null (modo privado, bloqueado o sin soporte). */
  function obtenerAlmacenamiento(ventana) {
    try {
      var s = (ventana || raiz).localStorage;
      var k = "__sand_prueba__";
      s.setItem(k, "1");
      s.removeItem(k);
      return s;
    } catch (e) {
      return null;
    }
  }

  /** Lee los favoritos guardados; ante cualquier problema devuelve una lista vacía. */
  function leerFavoritos(almacen) {
    if (!almacen) return [];
    try {
      var v = JSON.parse(almacen.getItem(CLAVE_FAVORITOS));
      return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string"; }) : [];
    } catch (e) {
      return [];
    }
  }

  /** Guarda los favoritos. Devuelve true si se pudo guardar. */
  function guardarFavoritos(almacen, favoritos) {
    if (!almacen) return false;
    try {
      almacen.setItem(CLAVE_FAVORITOS, JSON.stringify(Array.from(favoritos)));
      return true;
    } catch (e) {
      return false;
    }
  }

  var api = {
    CLAVE_FAVORITOS: CLAVE_FAVORITOS,
    normalizar: normalizar,
    categorias: categorias,
    filtrar: filtrar,
    obtenerAlmacenamiento: obtenerAlmacenamiento,
    leerFavoritos: leerFavoritos,
    guardarFavoritos: guardarFavoritos
  };
  raiz.PortalLogica = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
