# Ayoub Malki — Portfolio

Personal portfolio site: a static HTML/CSS page, hosted on Cloudflare Pages.

- `index.html`: the page
- `style.css`, `main.js`: styles and the mobile menu
- `assets/`: CV and favicon
- `_headers`: security headers applied by Cloudflare Pages

No build step: Cloudflare Pages serves the repository root as is. Every push to `main` redeploys the site.

To preview locally: `python -m http.server 8000`, then open http://localhost:8000.
