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

The cover waits for the visitor's first tap, then begins fading into the hero after 5.5 seconds. Background music starts after that tap. Keep the HTML and media files together when previewing or deploying.

## Deploy

Deploy this project root to Vercel as a static site with the **Other** framework preset and no build command. `vercel.json` explicitly uses the project root as the output because `public/` contains this invitation's media assets; the root `index.html` and media paths must be deployed together. If the site is already connected to Vercel, redeploy after uploading this config.
