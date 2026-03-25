# log.md — Journal des modifications

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
