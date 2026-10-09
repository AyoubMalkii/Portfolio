const toggle = document.querySelector(".nav-toggle");
const links = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

// Events: rendered from events.json so photos can be added without editing HTML.
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

function openPhoto(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = alt;
  lightbox.showModal();
}

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target.classList.contains("lightbox-close")) lightbox.close();
});

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderEvent(event) {
  const card = el("article", "event");
  const photos = event.photos || [];

  if (photos.length) {
    const gallery = el("div", photos.length > 1 ? "event-photos multi" : "event-photos");
    photos.forEach((photo) => {
      const alt = photo.alt || event.title;
      const button = el("button", "photo");
      button.type = "button";
      button.setAttribute("aria-label", `View photo: ${alt}`);
      const img = el("img");
      img.src = photo.src;
      img.alt = alt;
      img.loading = "lazy";
      img.decoding = "async";
      button.append(img);
      button.addEventListener("click", () => openPhoto(photo.src, alt));
      gallery.append(button);
    });
    card.append(gallery);
  }

  const body = el("div", "event-body");
  body.append(el("p", "kicker", [event.date, event.role].filter(Boolean).join(" · ")));
  body.append(el("h3", null, event.title));
  if (event.place) body.append(el("p", "event-place", event.place));
  if (event.description) body.append(el("p", null, event.description));
  card.append(body);
  return card;
}

const eventsList = document.getElementById("events-list");
fetch("events.json")
  .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  .then((events) => eventsList.replaceChildren(...events.map(renderEvent)))
  .catch(() => {
    eventsList.replaceChildren(el("p", "event-place", "Events could not be loaded."));
  });
