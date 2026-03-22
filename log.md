# log.md — Journal des modifications

---

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
