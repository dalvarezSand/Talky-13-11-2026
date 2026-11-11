"use strict";

const catalog = [
  { id: "pro-git", title: "Pro Git", category: "Desarrollo", description: "Consulta cómo trabajar con ramas, commits y repositorios Git.", url: "https://git-scm.com/book/es/v2" },
  { id: "javascript", title: "Guía de JavaScript", category: "Desarrollo", description: "Repasa la sintaxis y los conceptos del lenguaje con ejemplos.", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide" },
  { id: "codex", title: "Primeros pasos con Codex", category: "Desarrollo", description: "Abre un proyecto y revisa los cambios que propone el agente.", url: "https://learn.chatgpt.com/docs/quickstart" },
  { id: "chatgpt", title: "Casos de uso de ChatGPT", category: "Comercial", description: "Explora ejemplos para preparar reuniones, investigar y redactar materiales.", url: "https://learn.chatgpt.com/use-cases" },
  { id: "cowork", title: "Primeros pasos con Claude Cowork", category: "Comercial", description: "Consulta cómo encargar una tarea con archivos y seguir su progreso.", url: "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork" },
  { id: "claude-code", title: "Introducción a Claude Code", category: "Trabajo con IA", description: "Conoce las formas de usar el agente sobre una base de código.", url: "https://code.claude.com/docs/en/overview" }
];

const storageKey = "sand-recursos-codex-v1";
const filters = document.querySelector(".filters");
const query = document.querySelector("#query");
const category = document.querySelector("#category");
const favoriteButton = document.querySelector("#favorites");
const favoriteCount = document.querySelector("#favorite-count");
const resultCount = document.querySelector("#result-count");
const storageMessage = document.querySelector("#storage-message");
const empty = document.querySelector("#empty");
const emptyTitle = document.querySelector("#empty-title");
const emptyText = document.querySelector("#empty-text");
const reset = document.querySelector("#reset");
const resources = document.querySelector("#resources");
const template = document.querySelector("#resource-template");
const favorites = loadFavorites();
let onlyFavorites = false;

for (const name of [...new Set(catalog.map(resource => resource.category))].sort((a, b) => a.localeCompare(b, "es"))) {
  category.add(new Option(name, name));
}

function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return new Set(Array.isArray(stored) ? stored : []);
  } catch {
    return new Set();
  }
}

function normalize(text) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es");
}

function render() {
  const terms = normalize(query.value).trim().split(/\s+/u).filter(Boolean);
  const visible = catalog.filter(resource => {
    const text = normalize([resource.title, resource.description, resource.category].join(" "));
    return (!category.value || resource.category === category.value)
      && (!onlyFavorites || favorites.has(resource.id))
      && terms.every(term => text.includes(term));
  });

  const savedCount = catalog.filter(resource => favorites.has(resource.id)).length;
  favoriteCount.textContent = savedCount;
  favoriteButton.setAttribute("aria-pressed", String(onlyFavorites));
  resultCount.textContent = visible.length === 1 ? "1 recurso" : visible.length + " recursos";
  resources.replaceChildren(...visible.map(createResource));
  empty.hidden = visible.length !== 0;
  if (onlyFavorites && savedCount === 0) {
    emptyTitle.textContent = "Todavía no hay favoritos";
    emptyText.textContent = "Marca la estrella de un recurso para guardarlo aquí.";
  } else {
    emptyTitle.textContent = "No hay resultados";
    emptyText.textContent = "Cambia la búsqueda o la categoría para ver otros recursos.";
  }
}

function createResource(resource) {
  const item = template.content.firstElementChild.cloneNode(true);
  const star = item.querySelector(".star");
  const selected = favorites.has(resource.id);
  item.querySelector(".category").textContent = resource.category;
  item.querySelector("h3").textContent = resource.title;
  item.querySelector("p").textContent = resource.description;
  const link = item.querySelector("a");
  link.href = resource.url;
  link.setAttribute("aria-label", "Consultar recurso: " + resource.title);
  star.setAttribute("aria-label", "Favorito: " + resource.title);
  star.setAttribute("aria-pressed", String(selected));
  star.firstElementChild.textContent = selected ? "★" : "☆";
  star.addEventListener("click", () => {
    if (favorites.has(resource.id)) favorites.delete(resource.id);
    else favorites.add(resource.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...favorites]));
    } catch {
      storageMessage.hidden = false;
    }
    render();
    const sameStar = [...resources.querySelectorAll(".star")].find(
      button => button.getAttribute("aria-label") === star.getAttribute("aria-label")
    );
    (sameStar || resources.querySelector(".star") || favoriteButton).focus();
  });
  return item;
}

filters.addEventListener("submit", event => event.preventDefault());
query.addEventListener("input", render);
category.addEventListener("change", render);
favoriteButton.addEventListener("click", () => {
  onlyFavorites = !onlyFavorites;
  render();
});
reset.addEventListener("click", () => {
  query.value = "";
  category.value = "";
  onlyFavorites = false;
  render();
  query.focus();
});
render();
