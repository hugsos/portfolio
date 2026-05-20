# log.md — Journal des modifications

---

[MODIF] 2026-05-21 — index.html
Transition cloud hero→projets : ajout de Brand/nuagebas.png (flipé scaleY(-1)) positionné en absolu au bas du hero (z-index:1). Desktop : translateY(100%), cloud collé au bord inférieur sans overlap. Mobile ≤768px : translateY(96%), léger empiètement pour couvrir le trait de bordure vidéo. Fond hero #000. Suppression hero-video-fade et ::before gradient du .tl-wrapper. #hero overflow:visible.

---

[MODIF] 2026-05-20 — index.html, interets/armee.html, interets/boxe.html, interets/musculation.html, projets/media-buying.html, projets/restaurant-authentique.html, projets/trouve-ta-ref.html
Navbar intelligente : se fixe en haut (déjà `position:fixed`), se cache avec `transform:translateY(-100%)` après 80px de scroll vers le bas, réapparaît dès qu'on rescroll vers le haut. Script léger avec `requestAnimationFrame` + `{ passive: true }`. Transition `cubic-bezier(0.4,0,0.2,1)` ajoutée. Appliqué aux 7 pages.

---

[MODIF] 2026-05-20 — index.html, interets/armee.html, interets/boxe.html, interets/musculation.html, projets/media-buying.html, projets/restaurant-authentique.html, projets/trouve-ta-ref.html
Favicon remplacé (10-removebg.png → 6-removebg.png) et nav-logo converti de texte CSS "HB." en image <img> (Brand/logo/6-removebg.png, height:34px) sur l'ensemble des 7 pages du site.

---

[MODIF] 2026-05-20 — index.html (suite 2) — layout hero final
Tag "Étudiant BUT Info Com" déplacé en absolu en haut centré (top:88px) pour libérer le visage. Boutons remontés au-dessus du h1 (ordre : tag haut → boutons → BOURGEOIS Hugo → morphing text). Padding-bottom hero réduit à 48px. Espace morphing text supprimé (margin-top:0). Contenu encore descendu pour maximiser la visibilité du visage dans la vidéo.

[MODIF] 2026-05-20 — index.html (suite) — boutons + layout hero
Boutons btn-primary/btn-secondary : refonte liquid glass. Fond opaque remplacé par rgba semi-transparent + backdrop-filter blur(16px) saturate(1.4). Les @property --color-* utilisent des rgba au lieu de hex, glow doré animé conservé sur hover. Contenu hero basculé en bas (align-items:flex-end) pour dégager le visage visible dans la vidéo. Transition dégradé hero/projets corrigée vers #121212 (couleur réelle du bas de la vidéo). Fondu #121212 ajouté en ::before sur .tl-wrapper. Morphing text centré (width:100% + text-align:center sur les spans).

[MODIF] 2026-05-20 — index.html, Brand/hero_vid.webm (nouveau)
Refonte hero section : suppression de la photo profil (hero-photo-wrap + blur progressif) et de l'aurora CSS animée. Remplacement par une vidéo fond plein écran (Brand/hero_vid.mp4 convertie en WebM VP9, 2.6MB → 362KB, -86%). Layout hero recentré (flex colonne, text-align:center). Hero-tag transformé en pill glassmorphism (backdrop-filter blur) pour rester lisible sur fond vidéo clair ou foncé. Dégradé de transition bas-de-hero → section Projets (transparent → #111). Loader page branché sur heroVid.canplay au lieu de window.load. Suppression des JS aurora pause/throttle (plus d'aurora).

---

[MODIF] 2026-03-25 — projets/restaurant-authentique.html, Projets-content/Restaurant Authentique/frames/
Même refonte que TTR sur le hero-scroll-zone : 199 frames WebP extraites depuis video_scroll_restau.mp4 (ffmpeg 26fps, 750px, sharp 82%). 4 phases : kicker vertical IDENTITÉ/VISUELLE/WEB (stagger GSAP), stats Semi-Gastro/Jura/2024, marquee L'AUTHENTIQUE défilant, overlay final inchangé. GSAP + ScrollTrigger CDN. hero-headline-area inchangé.

---

[MODIF] 2026-03-25 — projets/trouve-ta-ref.html, Projets-content/Trouve ta Ref/frames/
Refonte hero-scroll-zone : remplacement des 120 frames WebP (supprimées) par de nouvelles frames extraites depuis scroll_ttr.mp4 (ffmpeg 12fps, 750px, sharp WebP 82%). Ajout de 3 phases d'animation texte sur la zone sticky : Phase 1 kicker vertical (DESIGN/DÉVELOPPEMENT/WORDPRESS) entrant via stagger GSAP ; Phase 2 stats d'audience (189k/123k/+300k) glissant depuis la gauche ; Phase 3 marquee TROUVETAREF.FR défilant avec le scroll. Intégration GSAP + ScrollTrigger CDN. hero-headline-area inchangé. Fond #0e0b02 conservé.

---

[MODIF] 2026-03-25 — projets/restaurant-authentique.html, projets/trouve-ta-ref.html
Fix scroll jump iOS Safari sur sections hero sticky. Cause : window.innerHeight recalculé à chaque event scroll — iOS change cette valeur quand la barre d'adresse se cache/montre, faisant sauter la taille de la box et la progression raw de l'animation en plein scroll. Fix CSS : height:100vh → height:100svh (small viewport = stable). Fix JS : mise en cache de cachedVW/cachedVH au niveau module, mis à jour uniquement sur resize (orientation change), jamais sur scroll. Aucun impact visuel sur desktop/mac.

---

[MODIF] 2026-03-23 — index.html
Perf mobile hero (critiques) : suppression background-attachment:fixed sur aurora::after (repaint à chaque pixel de scroll, ignoré par iOS de toute façon) ; heroBlurContainer réduit de 8 à 2 compositor layers GPU sur mobile (intensité ajustée pour conserver le même rendu visuel). Aucun impact esthétique visible.

[MODIF] 2026-03-23 — index.html
Aurora hero : throttle 30 FPS sur mobile. Sur device 120fps la CSS animation tentait ~120 repaints/s sur l'aurora (charge GPU max). Fix : media query `(hover:none) and (pointer:coarse)` coupe l'animation CSS et branche `background-position` sur `var(--aurora-x)` ; boucle JS RAF throttlée à 30fps met à jour la variable. Desktop inchangé. Réduction estimée : -75% de charge GPU sur écran 120fps mobile.

---

[MODIF] 2026-03-22 — interets/musculation.html, interets/boxe.html, interets/armee.html
Fix miniatures manquantes dans le dock modal vidéo + autoplay dock. Fix miniatures : ajout de `poster` sur chaque item vidéo dans `mediaItems` (musculation/boxe ont des `.jpg` correspondants) ; armée sans poster → `preload='metadata'` + `src` direct. Fix autoplay dock : assigne `v.src` depuis `v.dataset.src` avant `v.play()` pour musculation et boxe (le src n'était jamais initialisé). Ajout de `poster` sur chaque item vidéo dans `mediaItems` (musculation et boxe ont des `.jpg` correspondants). Pour armée (pas d'images poster disponibles) : `preload='metadata'` + `src` direct pour que le navigateur affiche le premier frame.

[MODIF] 2026-03-22 — Content/**/*.mp4, Projets-content/**/*.mp4
Compression vidéo via FFmpeg (libx264 CRF 28, preset slow, faststart). 143 MB → 31 MB (-78%). Aucune perte visible à l'œil. scroll_ttr.mp4 ajouté au .gitignore (non utilisé dans le projet).

[AJOUT] 2026-03-22 — index.html, projets/*.html, interets/*.html
Loading screen universel sur toutes les pages (overlay #0e0d0c, barre de progression, "BOURGEOIS Hugo"). Condition de déclenchement adaptée par type de page (canplay / frame0ready / load). Min 400ms, timeout 6s.

[AJOUT] 2026-03-22 — interets/musculation.html, armee.html, boxe.html
Poster sur les vidéos hero (image fixe branded pendant le buffering). Fix mobile : fallback autoplay sur premier touchstart.

[MODIF] 2026-03-22 — interets/musculation.html, armee.html, boxe.html
Vidéos galerie bento : passage au pattern data-src + IntersectionObserver. preload='none', src assigné uniquement à l'entrée dans le viewport. Suppression du bloc vid.play() immédiat qui déclenchait le téléchargement. Résultat : Musculation 200 MB → 12 MB (−94%).

[AJOUT] 2026-03-22 — interets/musculation.html, armee.html, boxe.html
Spinner de chargement (.bento-spinner) sur les vidéos bento. Apparaît à l'entrée dans le viewport, disparaît au canplay. Couleur via var(--accent) propre à chaque page.

[MODIF] 2026-03-22 — interets/musculation.html, armee.html, boxe.html
Dock modal vidéos thumbnails : preload='none' + data-src (même traitement que la galerie).

[AJOUT] 2026-03-22 — Projets-content/ (Restaurant Authentique, Trouve ta Ref, Media Buying)
Conversion PNG → WebP via sharp (qualité 82%). Gains : Site.png −96%, Galerie desktop.png −92%, page.png −97%. Total : ~30 MB de PNG supprimés.

[MODIF] 2026-03-22 — projets/restaurant-authentique.html, trouve-ta-ref.html, media-buying.html, interets/*.html, index.html
Remplacement @import Google Fonts par <link rel="preconnect"> + <link href="..."> sur toutes les pages.

[MODIF] 2026-03-22 — projets/restaurant-authentique.html, trouve-ta-ref.html
Références PNG → WebP dans les src des images. Ajout loading="lazy" decoding="async" sur les images below-the-fold.

[AJOUT] 2026-03-22 — index.html
IntersectionObserver sur Three.js (cancelAnimationFrame quand hors viewport) et sur l'aurora CSS (.aurora-paused via classList). Réduit le lag GPU sur mobile.

[MODIF] 2026-03-22 — Content/Musculation/Tirage vertical.jpg
Correction orientation poster vidéo hero musculation (rotation 180° annulée — fichier restauré à l'orientation d'origine).

[MODIF] 2026-03-22 — interets/musculation.html
Changement poster hero : fond.jpg → Tirage vertical.jpg.
