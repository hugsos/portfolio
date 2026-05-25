/**
 * fix-nav-placement.mjs
 * Moves <script src="...site-nav.js"> from inside #page-loader to after it.
 * The migration script used the first </div> inside the loader (loader-grain)
 * instead of the balanced closing tag of the loader itself.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PAGES = [
  { file: 'info-com.html',                       navTag: 'js/site-nav.js' },
  { file: 'projets/restaurant-authentique.html', navTag: '../js/site-nav.js' },
  { file: 'projets/trouve-ta-ref.html',          navTag: '../js/site-nav.js' },
  { file: 'projets/media-buying.html',           navTag: '../js/site-nav.js' },
  { file: 'interets/armee.html',                 navTag: '../js/site-nav.js' },
  { file: 'interets/musculation.html',           navTag: '../js/site-nav.js' },
  { file: 'interets/boxe.html',                  navTag: '../js/site-nav.js' },
];

/**
 * Finds the index of the balanced closing tag of the element that starts at startIdx.
 * e.g. for <div id="page-loader" ...>, counts <div opens and </div> closes.
 */
function findBalancedClose(html, startIdx) {
  let depth = 0;
  let i = startIdx;
  while (i < html.length) {
    if (html.startsWith('</div>', i)) {
      depth--;
      if (depth <= 0) return i; // found the matching close
      i += 6;
    } else if (html.startsWith('<div', i)) {
      depth++;
      i += 4;
    } else {
      i++;
    }
  }
  return -1;
}

for (const { file, navTag } of PAGES) {
  const path = resolve(ROOT, file);
  let html;
  try { html = readFileSync(path, 'utf8'); }
  catch { console.warn(`⚠  Introuvable : ${file}`); continue; }

  const scriptTag = `<script src="${navTag}"></script>`;

  // Find the script tag inside the loader
  const loaderOpenIdx = html.indexOf('id="page-loader"');
  if (loaderOpenIdx === -1) { console.log(`⚠  ${file}: no #page-loader found`); continue; }

  // Find start of the <div that contains id="page-loader"
  const loaderDivStart = html.lastIndexOf('<div', loaderOpenIdx);

  const scriptIdx = html.indexOf(scriptTag, loaderDivStart);
  if (scriptIdx === -1) { console.log(`↩  ${file}: script not found inside loader — skipping`); continue; }

  // Find the balanced close of the page-loader div
  const loaderCloseIdx = findBalancedClose(html, loaderDivStart);
  if (loaderCloseIdx === -1) { console.warn(`⚠  ${file}: could not find balanced </div> for loader`); continue; }

  // Check the script IS inside the loader
  if (scriptIdx > loaderCloseIdx) {
    console.log(`↩  ${file}: script is already outside loader — skipping`);
    continue;
  }

  // 1. Remove the script (+ surrounding blank lines) from inside the loader
  //    The script is on its own line, remove the whole line including \n
  const lineStart = html.lastIndexOf('\n', scriptIdx - 1) + 1;
  const lineEnd   = html.indexOf('\n', scriptIdx + scriptTag.length);
  const scriptLine = html.slice(lineStart, lineEnd + 1);
  html = html.slice(0, lineStart) + html.slice(lineEnd + 1);

  // Recalculate loaderCloseIdx after removal
  const loaderCloseIdx2 = findBalancedClose(html, html.lastIndexOf('<div', html.indexOf('id="page-loader"')));

  // 2. Insert script right after the loader's closing </div>
  const insertAt = loaderCloseIdx2 + 6; // after </div>
  html = html.slice(0, insertAt) + '\n\n  ' + scriptTag + html.slice(insertAt);

  writeFileSync(path, html, 'utf8');
  console.log(`✅  ${file}: moved script outside #page-loader`);
}

console.log('\nDone.\n');
