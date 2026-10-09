# Ayoub Malki — Portfolio

Personal portfolio site: a static HTML/CSS page, hosted on Cloudflare Workers.

- `public/`: everything that gets published (the only folder Cloudflare serves)
- `public/index.html`: the page
- `public/style.css`, `public/main.js`: styles, the mobile menu, and the Events section
- `public/events.json`: the list of events shown in "Events & Activities"
- `public/assets/`: CV, favicon and event photos (`assets/events/`)
- `public/_headers`: security headers applied by Cloudflare
- `wrangler.jsonc`: Cloudflare Workers config (serves `public/`, uses `404.html` for missing pages)

No build step: Cloudflare deploys `public/` as static assets. Every push to `main` redeploys the site.

To preview locally: `python -m http.server 8000 -d public`, then open http://localhost:8000.

## Adding event photos

1. Upload the photos to `public/assets/events/`. Use lowercase names without spaces, for example `iprotect-1.jpg`, and keep each photo under about 500 KB.
2. In `public/events.json`, find the event and fill in its `photos` list:

   ```json
   "photos": [
     { "src": "assets/events/iprotect-1.jpg", "alt": "Short description of the photo" },
     { "src": "assets/events/iprotect-2.jpg", "alt": "Another photo" }
   ]
   ```

   Separate entries with a comma. The last entry has no comma after it.
3. Commit. The site updates in about a minute.

To add a new event, copy one `{ ... }` block in `events.json`, change its fields, and keep a comma between blocks. Events appear in the order they're listed.
