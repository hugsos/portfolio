# log.md — Journal des modifications

---

[MODIF] 2026-05-25 — js/site-nav.js
Menu mobile : centrage des éléments (items, sous-menus, bouton). align-items:center sur .mobile-menu et nav.mobile-menu-links, justify-content:center + gap:8px sur les items (chevron inline avec le texte), border-bottom déplacé du >a vers .mobile-menu-item pour des séparateurs pleine largeur propres.

---

[BUGFIX] 2026-05-25 — js/site-nav.js
Correction des incohérences visuelles du menu mobile entre les pages. Cause racine : la règle `nav { align-items: center; justify-content: space-between; }` présente dans les styles inline de chaque page s'appliquait aussi à `<nav class="mobile-menu-links">`, centrant les items et empêchant le `width: 100%` de fonctionner (items de la largeur du texte seulement, chevrons collés). Fix : ajout de `align-items: stretch; justify-content: flex-start; display: flex; flex-direction: column; width: 100%; gap: 0;` dans le bloc reset `nav.mobile-menu-links` de site-nav.js (spécificité 0,1,1 > 0,0,1 du `nav {}`). Menu désormais identique sur les 8 pages du site.

---

[AJOUT] 2026-05-25 — mentions-legales.html, confidentialite.html (CRÉÉS)
Pages légales obligatoires : Mentions légales (LCEN 2004) et Politique de confidentialité (RGPD UE 2016/679). Contenu rédigé selon les textes législatifs applicables : éditeur, directeur de publication, hébergeur Vercel, propriété intellectuelle, cookies, droits RGPD (Art. 15-21), CNIL, transferts hors UE. Design thème sombre cohérent avec le reste du site (fond #111, accent #c9a84c), loading screen gold, nav + footer partagés via site-nav.js / site-footer.js.

---

[MODIF] 2026-05-25 — js/site-footer.js
Ajout d'une rangée légale au bas du footer (sous un séparateur fin) avec deux liens : "Mentions légales" → mentions-legales.html et "Politique de confidentialité" → confidentialite.html. Gestion du chemin relatif base via la variable existante. CSS injecté : .footer-legal, .footer-legal-sep.

---

[AJOUT] 2026-05-25 — js/site-nav.js, js/site-footer.js (CRÉÉS)
Centralisation nav + footer : composants JS partagés injectés via <script> sur toutes les pages. site-nav.js injecte CSS + HTML de la nav (transparente en haut de page, solide au scroll), le mobile burger, les dropdowns Projets/Intérêts, et le lien standalone "Info Com". site-footer.js injecte la section #cta (vagues simplex-noise, boutons dorés) + <footer>. Un seul fichier à modifier pour mettre à jour header/footer sur tout le site.

---

[AJOUT] 2026-05-25 — js/apply-components.mjs (CRÉÉ)
Script de migration Node.js ESM : supprime les <nav>, .mobile-menu, #cta, <footer>, IIFE burger et script nav-scroll inline de chaque page ; injecte les balises <script> site-nav.js et site-footer.js. Traite 8 pages (index, info-com, 3 projets, 3 intérêts). Parsing équilibré (removeBalancedBlock) pour éviter les faux </div> imbriqués.

---

[MODIF] 2026-05-25 — toutes les pages (8 fichiers HTML)
Migration nav/footer centralisés : remplacement des blocs nav/footer inline par <script src="[../]js/site-nav.js"> et <script src="[../]js/site-footer.js">. info-com.html : ajout au menu + remplacement du simple footer par le footer standard CTA+footer.

---

[MODIF] 2026-05-25 — js/site-nav.js
Fix lisibilité nav transparente sur fonds clairs (info-com cherry blossom) : ajout d'un overlay gradient fixe (#navTopGradient, z-index 498, rgba(0,0,0,0.55)→transparent sur 180px) + text-shadow sur les liens nav en état transparent. Le gradient disparaît quand la nav passe en état "scrolled".

---

[MODIF] 2026-05-25 — js/site-footer.js
3 fixes : (1) flex-direction:row explicite sur .footer-inner pour overrider la règle column de info-com.html. (2) background:#111 sur footer pour éviter la transparence sur les pages à fond vidéo (info-com). (3) Injection @property + CSS btn-primary/btn-secondary pour les pages sans ces déclarations.

---

[MODIF] 2026-05-25 — js/fix-nav-placement.mjs (CRÉÉ) + 7 pages HTML
Correction bug migration : le script apply-components.mjs plaçait <script site-nav.js> à l'intérieur du div #page-loader (premier </div> trouvé = loader-grain, pas la fermeture du loader). Un élément position:fixed à l'intérieur d'un parent fixe avec transition opacity crée un stacking context qui casse left:0/right:0 → nav avait width:0/height:0. Fix : déplacement du script tag juste après le </div> fermant du #page-loader sur 7 pages (info-com + projets/* + interets/*).

---

[MODIF] 2026-05-25 — info-com.html
Fix exit dernière carte : `.cards-scroll-body` height 800vh → 950vh. La carte 4 (index 3) démarre à 700vh, sa phase EXIT se termine à 900vh — le scroll max à 800vh ne permettait pas d'atteindre ce point. +150vh de scroll body (900vh exit + 50vh buffer) corrige le problème.

---

[MODIF] 2026-05-25 — info-com.html
Refonte architecture scroll cards : abandon de `position:sticky` (overflow:clip sur ancêtre casse sticky sur certains browsers ; sections adjacentes forcent exit/entry simultanés peu importe la hauteur). Nouvelle architecture : 4 `.card-slot` en `position:fixed` dans `#cardsStage`, script JS `rawProgress(cardIndex)` avec phases explicites ENTER(80vh) / DWELL(80vh) / EXIT(40vh) basé sur scrollY absolu. `.cards-scroll-body` (800→950vh) fournit la hauteur de défilement. Entrée selon `data-dir`, sortie toujours vers le haut. `.card-section`, `.card-spacer`, `.card-pin-wrap` supprimés.

---

[MODIF] 2026-05-25 — info-com.html
Fix dwell + centrage des cartes : (1) Centrage du contenu : `text-align: center` sur `.glass-card` + `.card-divider { margin: 0 auto }`. (2) Spacers entre sections : 3 `<div class="card-spacer">` (120vh desktop, 100vh mobile) ajoutés entre chaque `.card-section`. Sans spacer, la carte N sort et la carte N+1 entre SIMULTANÉMENT car sections adjacentes (sectionN.end - viewH = section(N+1).start - viewH). Avec spacer > viewH (100vh), la carte N est complètement sortie avant que la N+1 entre. (3) `.card-section` height ajusté à 200vh (100vh entry + 100vh dwell). Hysteresis backward scroll conservée.

---

[MODIF] 2026-05-25 — info-com.html
3 corrections JS/CSS : (1) Alignement mobile : `text-align: left` ajouté sur `.glass-card` dans la media query 768px — les titres, labels et descriptions étaient alignés à droite sur certains mobiles par héritage. (2) Dwell hysteresis : le scroll-driven slide-in ajoute un double-lerp (`s.locked` + `s.display`). Une fois `smooth ≥ 0.98`, `locked = true` ; le déverrouillage n'intervient que quand `raw < 0.40` (≈ 60vh de scroll en arrière depuis la position de lock). `s.display` lerpe vers la cible (1.0 si locked, `s.smooth` sinon) → sortie progressive sans saut visuel. (3) Tilt persistance : la stop-condition du rAF tilt remplace le reset dur `rotateX(0deg)` par l'application de `currX/Y` convergés — curseur immobile = tilt persiste, `mouseleave` → targX/Y = 0 → retour à plat naturellement.

---

[MODIF] 2026-05-25 — info-com.html
Responsive mobile complet. (1) Scroll horizontal supprimé : `html { overflow-x: hidden }` — `overflow: clip` sur `.card-section` ne bloquait pas le scrollWidth des éléments sticky. (2) Hero : logo réduit (`clamp(64px,16vw,96px)` + `max-width: calc(100vw - 40px)`), padding réduit, sous-titre lettre-spacing allégé. (3) Cards : `.card-pin-wrap` passe en `align-items: flex-start` + `padding-top: 68px` (espace nav) — label visible à 97px du haut sur 390px ET 375px (SE). Espacements internes réduits (font desc 0.79rem, card-item padding 11px, card-divider margin 16px). Section height 145vh. (4) Media query `max-width: 430px` pour très petits écrans. (5) JS : `hAmp: isMobile ? 105 : 110` pour slides horizontaux. Validé : scrollWidth = clientWidth = 390px (et 375px), label à 97px, cardBottom max 642px/844px viewport.

---

[MODIF] 2026-05-25 — info-com.html
Fix séparation inter-cartes : `visibility:hidden` tant que `smoothProgress < 0.01` → supprime le rendu du backdrop-filter à opacité quasi-nulle. Float slow hero : logo (7s), titre (9s), sous-titre (5.5s) via JS après fadeSlideUp (durées différentes = désync organique). Fix bug : float CSS était écrasé par fadeSlideUp (priorité dernier listé) — déplacé en JS via style.animation post-fade.

---

[MODIF] 2026-05-25 — info-com.html
Directions des cartes modifiées : carte 1 (Savoirs) bas→haut (bottom), carte 2 (Savoir-faire) haut→bas (top), carte 3 (Savoir-être) droite→gauche (right), carte 4 (Cap vers l'avenir) gauche→droite (left). Support `data-dir="top"` ajouté dans le JS scroll-driven (translateY(-100vh) → 0).

---

[MODIF] 2026-05-25 — info-com.html
4 corrections : (1) Tilt 3D — rotateY négé (bord droit vers viewer quand curseur à droite) + multiplicateur 8→14 pour ~7° max. (2) Hero fadeSlideUp ralenti 1s→1.6s, delays étagés : logo 0s, titre 0.3s, sous-titre 0.7s, indicateur 1.1s. (3) Carte 5 data-dir="top"→"bottom" (entrée depuis le bas comme les autres). (4) Slide-in piloté par le scroll via rAF + lerp(0.11) : rawProgress calculé depuis getBoundingClientRect(), remplace l'IntersectionObserver. Remonter fait reculer les cartes. Tilt activé (_tiltEnabled) uniquement quand smoothProgress ≥ 0.98.

---

[AJOUT] 2026-05-25 — info-com.html (création)
Nouvelle page synthèse BUT 1 Info-Com Publicité. Vidéo Brand/infocom-bg.mp4 en fond fixe plein écran avec overlay sombre + flou de bords (radial-gradient mask sur backdrop-filter). Effet de profondeur de champ léger aux bords. Hero avec logo Infocom flottant (animation float 5s), grand titre italic Bricolage Grotesque, sous-titre rose #E84E8A. 4 cartes glassmorphism (rgba(0,0,0,0.45) + backdrop-filter:blur(20px)) en position:sticky — chaque section fait 160vh, la carte se fixe au centre du viewport pendant 60vh de scroll (dwell time). Slides d'entrée depuis les bords de l'écran (110vw / 100vh) via @keyframes, durée 1.3s. Tilt 3D (max 4°) vers la position du curseur (rotateX/rotateY correct) + reflet lumineux radial, actif uniquement après la fin du slide. Loading screen #page-loader avec accent rose, déclenché au canplay de la vidéo hero. Nav identique au reste du portfolio (hide-on-scroll, liens projets/intérêts/contact).

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
