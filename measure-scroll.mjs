/**
 * measure-scroll.mjs
 * Mesure le jank de scroll sur la hero section (simulation mobile).
 * Simule un swipe touch vers le bas et enregistre les frame timings via
 * requestAnimationFrame. Un frame "janky" = delta > 33ms (< 30fps).
 *
 * Usage: node measure-scroll.mjs [url]
 */

import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:3000';
const SCROLL_DURATION_MS = 3000;

const MOBILE_VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';

async function measure(label, forceMobile = true) {
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

  const client = await page.createCDPSession();
  // CPU throttle x4 pour simuler mid-range mobile
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('#hero', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1200));

  // Démarrer la mesure RAF EN PARALLÈLE du scroll simulé
  const measurePromise = page.evaluate((duration) => {
    return new Promise((resolve) => {
      const deltas = [];
      let last = null;

      function tick(now) {
        if (last !== null) deltas.push(now - last);
        last = now;
        if (deltas.length < duration / 8) requestAnimationFrame(tick);
        else {
          const avg     = deltas.reduce((a,b)=>a+b,0) / deltas.length;
          const jank    = deltas.filter(d => d > 33);   // frames > 33ms = sous 30fps
          const longJ   = deltas.filter(d => d > 50);   // frames > 50ms = sous 20fps (vraiment mauvais)
          const sorted  = [...deltas].sort((a,b)=>a-b);
          const p95     = sorted[Math.floor(sorted.length * 0.95)];
          const p99     = sorted[Math.floor(sorted.length * 0.99)];
          resolve({
            total  : deltas.length,
            avg    : +avg.toFixed(1),
            p95    : +p95.toFixed(1),
            p99    : +p99.toFixed(1),
            jank   : jank.length,
            jankPct: +((jank.length / deltas.length) * 100).toFixed(1),
            longJ  : longJ.length,
            longJPct: +((longJ.length / deltas.length) * 100).toFixed(1),
          });
        }
      }
      requestAnimationFrame(tick);
    });
  }, SCROLL_DURATION_MS);

  // Simuler un scroll touch sur la hero section
  const hero = await page.$('#hero');
  const box = await hero.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height * 0.7;

  await page.touchscreen.touchStart(cx, cy);
  const steps = 30;
  for (let i = 1; i <= steps; i++) {
    await new Promise(r => setTimeout(r, SCROLL_DURATION_MS / steps));
    await page.touchscreen.touchMove(cx, cy - (i * (box.height * 0.6) / steps));
  }
  await page.touchscreen.touchEnd();

  const result = await measurePromise;
  await browser.close();

  console.log(`\n=== ${label} ===`);
  console.log(`  Frames mesurés : ${result.total}`);
  console.log(`  Avg frame time : ${result.avg}ms`);
  console.log(`  P95            : ${result.p95}ms`);
  console.log(`  P99            : ${result.p99}ms`);
  console.log(`  Frames janky (>33ms) : ${result.jank}  (${result.jankPct}%)`);
  console.log(`  Frames longs (>50ms) : ${result.longJ} (${result.longJPct}%)`);

  return result;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
console.log(`\nMesure jank de scroll — hero section (iPhone 12 sim, CPU x4)`);
console.log(`URL: ${url}\n`);

const label = process.argv[3] || 'mesure';
const result = await measure(label);

console.log(`\n──────────────────────────────────────────`);
console.log(`Score jank : ${result.jankPct}% des frames > 33ms`);
console.log(`Moins c'est bas, mieux c'est (cible : < 10%)`);
console.log(`──────────────────────────────────────────\n`);
