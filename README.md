# Ayoub Malki — Portfolio

Personal portfolio site: a static HTML/CSS page, hosted on Cloudflare Workers.

- `public/`: everything that gets published (the only folder Cloudflare serves)
- `public/index.html`: the page
- `public/style.css`, `public/main.js`: styles and the mobile menu
- `public/assets/`: CV and favicon
- `public/_headers`: security headers applied by Cloudflare Pages

- `wrangler.jsonc`: Cloudflare Workers config (serves `public/`, uses `404.html` for missing pages)

No build step: Cloudflare deploys `public/` as static assets. Every push to `main` redeploys the site.

To preview locally: `python -m http.server 8000 -d public`, then open http://localhost:8000.
