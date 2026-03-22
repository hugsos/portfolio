# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed in the project `node_modules/`. Chrome cache is at `C:/Users/hbour/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Header and Footer
- Across pages the header and the footer should be the same, colors, links, texts and more 

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Performance
L'objectif est d'allier esthétisme et performance — ne jamais sacrifier l'aspect visuel, mais optimiser le chargement.

### Images
- **Toujours convertir les PNG/JPEG lourds en WebP** via le script sharp (`node_modules/sharp`) — qualité 80–85%, gain typique 80–95%
- Ajouter `loading="lazy" decoding="async"` sur toutes les images below-the-fold (garder les images hero sans lazy)
- Remplacer les `@import` Google Fonts par `<link rel="preconnect">` + `<link href="...">` — évite le blocage du parsing CSS

### Vidéos galerie bento (pages intérêts)
- Ne jamais assigner `src` directement à la création de l'élément vidéo
- Utiliser le pattern `data-src` + IntersectionObserver : n'assigner `vid.src` que quand la vidéo entre dans le viewport
- Mettre `vid.preload = 'none'` — `preload="metadata"` télécharge quand même le fichier entier si le moov atom n'est pas en faststart
- Ajouter un spinner de chargement (`.bento-spinner`) visible via `.vid-loading` sur le bento-item, retiré au `canplay`
- Vidéos du dock modal : même traitement `preload='none'` + `data-src`

### Vidéos hero (pages intérêts)
- Toujours ajouter un `poster` correspondant à la vidéo (`poster="../Content/[Page]/[image].jpg"`)
- Conserver `preload="auto"` sur la hero vidéo uniquement — elle doit charger en priorité
- Ajouter un fallback autoplay mobile : écouter le premier `touchstart` pour tenter `video.play()`

### Loading screen universel
- Chaque page a un loading screen (`#page-loader`) — overlay `#0e0d0c`, nom "BOURGEOIS Hugo", barre de progression couleur `--accent`
- Condition de déclenchement du fade-out par type de page :
  - Pages avec vidéo hero → `heroVid.addEventListener('canplay', finish)`
  - Pages avec animation WebP frame → `window.addEventListener('frame0ready', finish)` (dispatcher après le 1er frame rendu)
  - Pages simples → `window.addEventListener('load', finish)`
- Durée minimum : 400ms — timeout fallback : 6s
- Couleurs accent par section : musculation `#e05c2a`, armée `#5a9e6f`, boxe `#4895cf`, autres `#c9a84c`

### Animations GPU (mobile)
- Three.js : stocker le `requestAnimationFrame` id dans une variable, annuler avec `cancelAnimationFrame` via IntersectionObserver quand le canvas sort du viewport
- Aurora CSS : ajouter une classe `.aurora-paused { animation-play-state: paused !important; }` appliquée via IntersectionObserver (le `::after` pseudo-élément nécessite la classe CSS, pas le JS inline)

---

## Changelog (log.md)
- **Toujours mettre à jour `log.md`** à la racine du projet après chaque modification
- Format : une entrée par tâche avec `[AJOUT]`, `[MODIF]` ou `[SUPPRIMÉ]`, la date, les fichiers touchés, et une ligne de contexte
- Exemple :
  ```
  [MODIF] 2026-03-22 — interets/musculation.html
  Lazy loading vidéos galerie bento via data-src + IntersectionObserver (suppression du preload eager)
  ```

---

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
