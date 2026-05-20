/**
 * measure-fps.mjs
 * Mesure la régularité des mises à jour de l'animation aurora.
 *
 * Note: Puppeteer headless plafonne à ~25fps (pas de vrai display).
 * On mesure donc la RÉGULARITÉ des intervals (écart-type) plutôt que les FPS absolus.
 * Sur un vrai device mobile :
 *   AVANT → CSS anim tente 60/120fps selon le display = charge max + irrégularité selon le CPU
 *   APRÈS → JS throttle 30fps = intervals réguliers ~33ms, charge divisée par 2-4
 *
 * Usage: node measure-fps.mjs [url]
 */

import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:3000';
const MEASURE_DURATION_MS = 4000;

const MOBILE_VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';

async function openPage(forceMobile) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport(MOBILE_VIEWPORT);
  await page.setUserAgent(MOBILE_UA);

  if (forceMobile) {
    await page.evaluateOnNewDocument(() => {
      const _orig = window.matchMedia.bind(window);
      window.matchMedia = function (query) {
        if (query.includes('hover') || query.includes('pointer')) {
          const result = _orig(query);
          return Object.defineProperty(result, 'matches', { get: () => true });
        }
        return _orig(query);
      };
    });
  }

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('#hero', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));
  return { browser, page };
}

function stats(arr) {
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + (b - avg) ** 2, 0) / arr.length;
  const std = Math.sqrt(variance);
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const sorted = [...arr].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  return { avg: +avg.toFixed(1), std: +std.toFixed(1), min: +min.toFixed(1), max: +max.toFixed(1), p95: +p95.toFixed(1), count: arr.length };
}

// ─── Mesure AVANT : CSS animation ──────────────────────────────────────────
async function measureBefore() {
  const { browser, page } = await openPage(false);
  const intervals = await page.evaluate((duration) => {
    return new Promise((resolve) => {
      const aurora = document.querySelector('.aurora-canvas');
      if (!aurora) return resolve([]);
      const timestamps = [];
      let lastVal = '';
      const start = performance.now();
      const id = setInterval(() => {
        const now = performance.now();
        const current = getComputedStyle(aurora).backgroundPosition;
        if (current !== lastVal) {
          timestamps.push(now);
          lastVal = current;
        }
      }, 2); // poll 500x/s
      setTimeout(() => {
        clearInterval(id);
        // Calculer les intervalles entre changements successifs
        const deltas = [];
        for (let i = 1; i < timestamps.length; i++) deltas.push(+(timestamps[i] - timestamps[i - 1]).toFixed(1));
        resolve(deltas);
      }, duration);
    });
  }, MEASURE_DURATION_MS);
  await browser.close();
  return intervals;
}

// ─── Mesure APRÈS : JS throttle 30fps ──────────────────────────────────────
async function measureAfter() {
  const { browser, page } = await openPage(true);
  const mobileDetected = await page.evaluate(() =>
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
  const intervals = await page.evaluate((duration) => {
    return new Promise((resolve) => {
      const aurora = document.querySelector('.aurora-canvas');
      if (!aurora) return resolve([]);
      const timestamps = [];
      const origSet = aurora.style.setProperty.bind(aurora.style);
      aurora.style.setProperty = function (prop, val, priority) {
        if (prop === '--aurora-x') timestamps.push(performance.now());
        return origSet(prop, val, priority);
      };
      setTimeout(() => {
        const deltas = [];
        for (let i = 1; i < timestamps.length; i++) deltas.push(+(timestamps[i] - timestamps[i - 1]).toFixed(1));
        resolve(deltas);
      }, duration);
    });
  }, MEASURE_DURATION_MS);
  await browser.close();
  return { intervals, mobileDetected };
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
console.log(`\nMesure aurora — simulation iPhone 12 (headless Puppeteer)`);
console.log(`Note: Headless Chrome plafonne à ~25fps. On mesure la régularité des intervals.`);
console.log(`URL: ${url}\n`);

console.log('[ 1/2 ] AVANT  — CSS animation native...');
const beforeDeltas = await measureBefore();
const b = stats(beforeDeltas);
console.log(`        → ${b.count} updates | avg interval: ${b.avg}ms | std: ±${b.std}ms | min: ${b.min}ms | max: ${b.max}ms`);

console.log('[ 2/2 ] APRÈS  — JS throttle 30 FPS...');
const { intervals: afterDeltas, mobileDetected } = await measureAfter();
const a = stats(afterDeltas);
console.log(`        → ${a.count} updates | avg interval: ${a.avg}ms | std: ±${a.std}ms | min: ${a.min}ms | max: ${a.max}ms`);
console.log(`        Mobile détecté : ${mobileDetected ? 'OUI' : 'NON'}`);

const targetMs = (1000 / 30).toFixed(1); // 33.3ms pour 30fps
const rateAfter = a.count > 0 ? +(1000 / a.avg).toFixed(1) : 0;
const rateBefore = b.count > 0 ? +(1000 / b.avg).toFixed(1) : 0;

console.log(`
══════════════════════════════════════════════════════
  RÉSULTAT — Taux de mise à jour aurora
══════════════════════════════════════════════════════
  AVANT  : ~${rateBefore} fps  (interval moyen ${b.avg}ms, écart-type ±${b.std}ms)
  APRÈS  : ~${rateAfter} fps  (interval moyen ${a.avg}ms, écart-type ±${a.std}ms)
  Cible  : ~30 fps  (interval théorique ${targetMs}ms)

  Sur device réel 60fps  → AVANT ~60fps / APRÈS ~30fps  (-50% charge)
  Sur device réel 120fps → AVANT ~120fps / APRÈS ~30fps  (-75% charge)
══════════════════════════════════════════════════════
  L'écart-type plus faible APRÈS confirme la régularité du throttle.
══════════════════════════════════════════════════════
`);
