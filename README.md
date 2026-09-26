# One Magical Year

Static, mobile-first first-birthday invitation. The project root is the deployment root, with client media in `public/` and editable event copy in `birthday-content.js`.

## Local preview

Run from this folder:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000`.

## Edit the invitation

Change names, birthday and birth details, venue, map link, WhatsApp RSVP number and messages, chapter captions, and asset paths in `birthday-content.js`. Leave the WhatsApp number blank until the family supplies it. Keep media in `public/` or update the paths in that file.

The cover video plays on load and begins fading into the hero after 5.5 seconds. Background music starts after the visitor's first tap while the cover is visible. Keep the HTML and media files together when previewing or deploying.

## Deploy

Deploy this project root to Vercel as a static site with the **Other** framework preset and no build command. `vercel.json` uses the root `index.html` and the `public/` media files.
