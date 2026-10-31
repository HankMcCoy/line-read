# Line Drill

Learn your lines one cue at a time. Paste a script, pick your character, and Line Drill shows each cue, reads the other parts aloud if you like, and hides your line until you've had a go. It tracks which lines you know.

Everything runs in the browser. Scripts and progress are stored on the device (localStorage) and never uploaded. There is no server code.

## Files

- `public/index.html` – the whole app (HTML, CSS and JS in one file)
- `public/sw.js` – service worker so the app opens offline after the first visit
- `public/manifest.webmanifest`, `public/icons/` – home-screen install
- `public/_headers` – cache and security headers
- `wrangler.jsonc` – Cloudflare config (a static-assets Worker)

## Run locally

```sh
npx wrangler dev
```

Then open http://localhost:8787.

## Deploy to Cloudflare

```sh
npx wrangler login     # first time only; opens a browser to sign in
npx wrangler deploy
```

The first deploy prints the live URL, `https://line-drill.<your-subdomain>.workers.dev`.
To use your own domain, add it under the Worker's **Settings → Domains & Routes** in the Cloudflare dashboard.

## Releasing an update

Edit the files in `public/`, bump `VERSION` in `public/sw.js` so installed copies pick up the change, and run `npx wrangler deploy` again.
