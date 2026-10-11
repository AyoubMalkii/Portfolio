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
const lightboxLink = document.getElementById("lightbox-link");

function openPhoto(src, alt, verifyUrl) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = alt;
  lightboxLink.hidden = !verifyUrl;
  if (verifyUrl) lightboxLink.href = verifyUrl;
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

// Certificates: rendered from certificates.json, filterable by category.
function renderCert(cert) {
  const card = el("article", "cert");
  card.dataset.category = cert.category;
  const label = `${cert.title}, ${cert.issuer}`;

  const button = el("button", "cert-thumb");
  button.type = "button";
  button.setAttribute("aria-label", `View certificate: ${label}`);
  const img = el("img");
  img.src = cert.thumb;
  img.alt = `Certificate: ${label}`;
  img.loading = "lazy";
  img.decoding = "async";
  button.append(img);
  button.addEventListener("click", () => openPhoto(cert.image, label, cert.verify));
  card.append(button);

  const body = el("div", "cert-body");
  body.append(el("h3", null, cert.title));
  body.append(el("p", "cert-meta", [cert.issuer, cert.date].filter(Boolean).join(" · ")));
  if (cert.note) body.append(el("p", "cert-note", cert.note));
  if (cert.verify) {
    const link = el("a", "link", "Verify →");
    link.href = cert.verify;
    link.target = "_blank";
    link.rel = "noopener";
    body.append(link);
  }
  card.append(body);
  return card;
}

const certList = document.getElementById("cert-list");
const chips = document.querySelectorAll(".cert-filters .chip");

chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("active", c === chip));
    const filter = chip.dataset.filter;
    certList.querySelectorAll(".cert").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  })
);

fetch("certificates.json")
  .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  .then((certs) => certList.replaceChildren(...certs.map(renderCert)))
  .catch(() => {
    certList.replaceChildren(el("p", "event-place", "Certificates could not be loaded."));
  });
