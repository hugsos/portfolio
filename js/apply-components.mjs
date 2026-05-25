/**
 * apply-components.mjs — Migration vers composants nav/footer partagés
 * Usage : node js/apply-components.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PAGES = [
  { file: 'index.html',                          base: '' },
  { file: 'info-com.html',                       base: '' },
  { file: 'projets/restaurant-authentique.html', base: '../' },
  { file: 'projets/trouve-ta-ref.html',          base: '../' },
  { file: 'projets/media-buying.html',           base: '../' },
  { file: 'interets/armee.html',                 base: '../' },
  { file: 'interets/musculation.html',           base: '../' },
  { file: 'interets/boxe.html',                  base: '../' },
];

/* ── Utilitaires ────────────────────────────────────────────────────────── */

/**
 * Supprime le premier bloc délimité [startPattern … closeTag].
 * Gère les imbrications du même tag en comptant ouvertures/fermetures.
 *
 * @param {string} html          - contenu complet du fichier
 * @param {string} startPattern  - chaîne EXACTE pour trouver le début (ex. '<nav>')
 * @param {string} openTag       - tag ouvrant pour le comptage (ex. '<nav')
 * @param {string} closeTag      - tag fermant (ex. '</nav>')
 */
function removeBalancedBlock(html, startPattern, openTag, closeTag) {
  const startIdx = html.indexOf(startPattern);
  if (startIdx === -1) return html;

  let depth = 0;
  let i = startIdx;

  while (i < html.length) {
    if (html.startsWith(closeTag, i)) {
      depth--;
      if (depth <= 0) {
        const end = i + closeTag.length;
        /* Consomme la newline qui suit si présente */
        const extra = html[end] === '\n' ? 1 : 0;
        return html.slice(0, startIdx) + html.slice(end + extra);
      }
      i += closeTag.length;
    } else if (html.startsWith(openTag, i)) {
      depth++;
      i += openTag.length;
    } else {
      i++;
    }
  }
  /* Pas trouvé — on ne touche rien */
  return html;
}

/** Supprime les lignes contenant l'une des aiguilles. */
function removeMatchingLines(html, ...needles) {
  return html.split('\n').filter(l => !needles.some(n => l.includes(n))).join('\n');
}

/**
 * Supprime le premier <script> (non-module, non-type) qui contient TOUS
 * les marqueurs listés et dont la taille est inférieure à maxLen.
 */
function removeScriptContaining(html, markers, maxLen = 2000) {
  let from = 0;
  while (true) {
    const tagIdx = html.indexOf('<script>', from);
    if (tagIdx === -1) break;
    const endIdx = html.indexOf('</script>', tagIdx);
    if (endIdx === -1) break;
    const content = html.slice(tagIdx, endIdx + 9);
    if (content.length < maxLen && markers.every(m => content.includes(m))) {
      const extra = html[endIdx + 9] === '\n' ? 1 : 0;
      return html.slice(0, tagIdx) + html.slice(endIdx + 9 + extra);
    }
    from = endIdx + 9;
  }
  return html;
}

/**
 * Supprime le premier <script type="module"> qui contient l'un des marqueurs.
 */
function removeModuleScriptContaining(html, ...markers) {
  let from = 0;
  while (true) {
    const tagIdx = html.indexOf('<script type="module">', from);
    if (tagIdx === -1) break;
    const endIdx = html.indexOf('</script>', tagIdx);
    if (endIdx === -1) break;
    const content = html.slice(tagIdx, endIdx + 9);
    if (markers.some(m => content.includes(m))) {
      const extra = html[endIdx + 9] === '\n' ? 1 : 0;
      return html.slice(0, tagIdx) + html.slice(endIdx + 9 + extra);
    }
    from = endIdx + 9;
  }
  return html;
}

/**
 * Supprime l'IIFE burger depuis son commentaire marqueur jusqu'à `    })();`.
 */
function removeBurgerIIFE(html) {
  const markers = [
    '/* ─── Mobile Burger Menu ─── */',
    '/* Mobile Burger Menu */',
    '/* ─── MOBILE MENU ─── */',
    '/* Burger menu mobile */',
  ];
  for (const m of markers) {
    const mIdx = html.indexOf(m);
    if (mIdx === -1) continue;
    /* Remonte au début de la ligne */
    const lineStart = html.lastIndexOf('\n', mIdx - 1);
    const blockStart = lineStart === -1 ? 0 : lineStart;
    /* Trouve le prochain `})();` */
    const closeIdx = html.indexOf('})();', mIdx);
    if (closeIdx === -1) continue;
    const eol = html.indexOf('\n', closeIdx);
    const end = eol === -1 ? html.length : eol + 1;
    html = html.slice(0, blockStart) + html.slice(end);
    return html;
  }

  /* Fallback : <script> standalone contenant navBurger + toggleMenu */
  return removeScriptContaining(html, ['navBurger', 'toggleMenu', 'mobileMenu'], 5000);
}

/** Supprime le commentaire + <script> de scroll-hide nav. */
function removeNavScrollScript(html) {
  /* Cherche le commentaire HTML */
  const cmtMarkers = [
    '<!-- ── NAV : cache au scroll bas',
    '<!-- ── NAV — cache au scroll bas',
    '<!-- ─── NAV — cache',
  ];
  for (const cmt of cmtMarkers) {
    const cIdx = html.indexOf(cmt);
    if (cIdx === -1) continue;
    const scriptStart = html.indexOf('<script', cIdx);
    if (scriptStart === -1) continue;
    const scriptEnd   = html.indexOf('</script>', scriptStart) + 9;
    const extra       = html[scriptEnd] === '\n' ? 1 : 0;
    html = html.slice(0, cIdx) + html.slice(scriptEnd + extra);
    return html;
  }
  /* Fallback : <script> autonome contenant nav-hidden + lastY */
  return removeScriptContaining(html, ['nav-hidden', 'lastY', 'THRESHOLD']);
}

/* ── Traitement de chaque page ──────────────────────────────────────────── */

for (const { file, base } of PAGES) {
  const path = resolve(ROOT, file);
  let html;
  try { html = readFileSync(path, 'utf8'); }
  catch { console.warn(`⚠  Introuvable : ${file}`); continue; }

  console.log(`\n🔧  ${file}`);
  const before = html.length;

  const navTag    = `<script src="${base}js/site-nav.js"></script>`;
  const footerTag = `<script src="${base}js/site-footer.js"></script>`;

  /* ── 1. Supprimer le <nav> principal (pas le mobile-menu-links) ──────── */
  if (html.includes(navTag)) {
    console.log('   ↩  script nav déjà en place — skip suppression <nav>');
  } else {
    /* On cherche <nav> ou <nav\n> mais PAS <nav class="mobile-menu-links"> */
    /* Les navs principales commencent soit par "<nav>" soit par "<nav\n" */
    for (const startPat of ['<nav>\n', '<nav> ', '<nav>']) {
      if (html.includes(startPat)) {
        html = removeBalancedBlock(html, startPat, '<nav', '</nav>');
        console.log('   ✓  Supprimé <nav>');
        break;
      }
    }
    /* Nettoyage commentaires adjacents */
    html = removeMatchingLines(html,
      '<!-- ═══ NAV (same as index.html) ═══ -->',
      '<!-- ── NAV ── -->',
      '<!-- Burger button (mobile only) -->',
    );
  }

  /* ── 2. Supprimer .mobile-menu overlay ───────────────────────────────── */
  /* On utilise l'attribut complet pour être précis */
  if (html.includes('<div class="mobile-menu" id="mobileMenu"')) {
    html = removeBalancedBlock(
      html,
      '<div class="mobile-menu" id="mobileMenu"',
      '<div',
      '</div>',
    );
    console.log('   ✓  Supprimé .mobile-menu overlay');
  } else {
    console.log('   ↩  .mobile-menu déjà absent');
  }
  html = removeMatchingLines(html, '<!-- MOBILE MENU OVERLAY -->', '<!-- ── MOBILE MENU ── -->');

  /* ── 3. Injecter script nav ───────────────────────────────────────────── */
  if (!html.includes(navTag)) {
    const loaderEnd = html.indexOf('</div>', html.indexOf('id="page-loader"'));
    if (loaderEnd !== -1) {
      const ins = loaderEnd + 6; /* après </div> */
      html = `${html.slice(0, ins)}\n\n  ${navTag}${html.slice(ins)}`;
    } else {
      /* Fallback : avant la première section/main après body */
      html = html.replace(/(\n  (?:<section|<main))/, `\n\n  ${navTag}$1`);
    }
    console.log(`   ✓  Injecté ${navTag}`);
  } else {
    console.log('   ↩  Script nav déjà présent');
  }

  /* ── 4. Supprimer <section id="cta"> ────────────────────────────────── */
  if (html.includes('<section id="cta">')) {
    html = removeBalancedBlock(html, '<section id="cta">', '<section', '</section>');
    console.log('   ✓  Supprimé section#cta');
  } else {
    console.log('   ↩  section#cta déjà absente');
  }
  html = removeMatchingLines(html, '<!-- CTA -->', '<!-- [REMOVED: CTA', '<!-- CTA + FOOTER injectés');

  /* ── 5. Supprimer le <script type="module"> des waves CTA ───────────── */
  const prevLen5 = html.length;
  html = removeModuleScriptContaining(html, 'ctaWaves', 'createNoise2D', 'NOOP', 'DISABLED_placeholder');
  if (html.length < prevLen5) console.log('   ✓  Supprimé waves module script');
  else console.log('   ↩  Pas de waves module script trouvé');

  /* ── 6. Supprimer <footer> ───────────────────────────────────────────── */
  if (html.includes('<footer>')) {
    html = removeBalancedBlock(html, '<footer>', '<footer', '</footer>');
    console.log('   ✓  Supprimé <footer>');
  } else {
    console.log('   ↩  <footer> déjà absent');
  }
  html = removeMatchingLines(html, '<!-- FOOTER -->', '<!-- ── FOOTER ──');

  /* ── 7. Supprimer IIFE burger ────────────────────────────────────────── */
  const prevLen7 = html.length;
  html = removeBurgerIIFE(html);
  if (html.length < prevLen7) console.log('   ✓  Supprimé IIFE burger');
  else console.log('   ↩  IIFE burger déjà absent');

  /* ── 8. Supprimer script nav scroll-hide ─────────────────────────────── */
  const prevLen8 = html.length;
  html = removeNavScrollScript(html);
  if (html.length < prevLen8) console.log('   ✓  Supprimé nav scroll script');
  else console.log('   ↩  Nav scroll script déjà absent');

  /* ── 9. Injecter script footer avant </body> ─────────────────────────── */
  if (!html.includes(footerTag)) {
    html = html.replace('</body>', `  ${footerTag}\n</body>`);
    console.log(`   ✓  Injecté ${footerTag}`);
  } else {
    console.log('   ↩  Script footer déjà présent');
  }

  /* ── 10. Nettoyage lignes vides ──────────────────────────────────────── */
  html = html.replace(/\n{4,}/g, '\n\n\n');

  writeFileSync(path, html, 'utf8');
  const after = html.length;
  console.log(`   💾  Sauvegardé  (${before} → ${after} chars, −${before - after})`);
}

console.log('\n✅  Migration terminée.\n');
