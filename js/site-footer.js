/* ═══════════════════════════════════════════════════════════════════════════
   site-footer.js — Section CTA + footer partagés entre toutes les pages
   ═══════════════════════════════════════════════════════════════════════════
   Usage (root) :    <script src="js/site-footer.js"></script>
   Usage (subpage) : <script src="../js/site-footer.js"></script>
   Placer juste avant </body> — le HTML est injecté AVANT ce script tag.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── Détection du chemin de base ──────────────────────────────────────────
     Root (index.html, info-com.html) → base = ''
     Sous-pages (projets/, interets/)  → base = '../'                        */
  var filename    = window.location.pathname.split('/').pop();
  var parts       = window.location.pathname.replace(/^\//, '').split('/').filter(Boolean);
  var base        = parts.length > 1 ? '../' : '';
  var isIndex     = filename === '' || filename === 'index.html';
  var sectionBase = isIndex ? '' : (base + 'index.html');
  var cvHref      = base + 'Brand/CV BOURGEOIS Hugo.pdf';

  /* ── Injection CSS CTA + footer ───────────────────────────────────────────
     Injecté une seule fois (id guard). Remplace les déclarations inline.    */
  if (!document.getElementById('site-footer-styles')) {
    var style = document.createElement('style');
    style.id  = 'site-footer-styles';
    style.textContent = `
      /* ── @property pour les boutons dégradés ── */
      @property --pos-x        { syntax: '<percentage>'; initial-value: 11.14%;   inherits: false; }
      @property --pos-y        { syntax: '<percentage>'; initial-value: 140%;     inherits: false; }
      @property --spread-x     { syntax: '<percentage>'; initial-value: 150%;     inherits: false; }
      @property --spread-y     { syntax: '<percentage>'; initial-value: 180.06%;  inherits: false; }
      @property --color-1      { syntax: '<color>';      initial-value: #0a0700;  inherits: false; }
      @property --color-2      { syntax: '<color>';      initial-value: #1a1000;  inherits: false; }
      @property --color-3      { syntax: '<color>';      initial-value: #3d2700;  inherits: false; }
      @property --color-4      { syntax: '<color>';      initial-value: #7a5200;  inherits: false; }
      @property --color-5      { syntax: '<color>';      initial-value: #c9a84c;  inherits: false; }
      @property --border-angle { syntax: '<angle>';      initial-value: 20deg;    inherits: true;  }
      @property --border-color-1 { syntax: '<color>';   initial-value: hsla(42,75%,60%,0.2);  inherits: true; }
      @property --border-color-2 { syntax: '<color>';   initial-value: hsla(42,75%,40%,0.75); inherits: true; }
      @property --stop-1       { syntax: '<percentage>'; initial-value: 37.35%;   inherits: false; }
      @property --stop-2       { syntax: '<percentage>'; initial-value: 61.36%;   inherits: false; }
      @property --stop-3       { syntax: '<percentage>'; initial-value: 78.42%;   inherits: false; }
      @property --stop-4       { syntax: '<percentage>'; initial-value: 89.52%;   inherits: false; }
      @property --stop-5       { syntax: '<percentage>'; initial-value: 100%;     inherits: false; }

      /* ── CTA section ── */
      #cta {
        background: #111;
        border-top: 1px solid rgba(255,255,255,0.04);
        text-align: center;
        position: relative;
        overflow: hidden;
        padding: clamp(64px, 8vw, 120px) 24px;
      }
      .cta-waves { position: absolute; inset: 0; pointer-events: none; }
      .cta-waves svg { display: block; width: 100%; height: 100%; }
      #cta .cta-inner {
        display: block; text-align: center;
        max-width: 640px; margin: 0 auto;
        position: relative; z-index: 1;
      }
      .cta-h2 {
        font-size: clamp(2.2rem, 4vw, 3.6rem);
        font-weight: 600; color: #eee;
        letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 20px;
      }
      .cta-desc { font-size: 1rem; color: #7b7b7b; line-height: 1.7; margin-bottom: 40px; }

      .container { max-width: 1328px; margin: 0 auto; padding: 0 24px; }
      .cta-tag  {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 0.78rem; font-weight: 500;
        color: #7b7b7b; letter-spacing: 0.04em; text-transform: uppercase;
      }
      .cta-tag-dot {
        width: 6px; height: 6px;
        background: var(--brand-9, #c9a84c); border-radius: 50%;
      }

      /* ── Boutons dégradés (doré, partagé CTA) ── */
      .btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: inherit; font-size: 0.9rem; font-weight: 600;
        color: #fff; text-decoration: none;
        padding: 13px 26px; border-radius: 100px; border: none; cursor: pointer;
        position: relative; overflow: hidden;
        background: radial-gradient(
          ellipse var(--spread-x) var(--spread-y) at var(--pos-x) var(--pos-y),
          var(--color-5) var(--stop-1),
          var(--color-4) var(--stop-2),
          var(--color-3) var(--stop-3),
          var(--color-2) var(--stop-4),
          var(--color-1) var(--stop-5)
        );
        transition:
          --pos-x 0.4s, --pos-y 0.4s,
          --spread-x 0.4s, --spread-y 0.4s,
          --color-1 0.4s, --color-2 0.4s, --color-3 0.4s, --color-4 0.4s, --color-5 0.4s,
          --stop-1 0.4s, --stop-2 0.4s, --stop-3 0.4s, --stop-4 0.4s, --stop-5 0.4s,
          --border-angle 0.4s, --border-color-1 0.4s, --border-color-2 0.4s,
          transform 0.15s cubic-bezier(0.25,0.46,0.45,0.94);
      }
      .btn-primary::before {
        content: ''; position: absolute; inset: 0;
        border-radius: inherit; padding: 1px;
        background: linear-gradient(var(--border-angle), var(--border-color-1), var(--border-color-2));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude; pointer-events: none;
      }
      .btn-primary:hover {
        --pos-x: 0%; --pos-y: 91.51%; --spread-x: 120.24%; --spread-y: 103.18%;
        --color-1: #dbb96a; --color-2: #c9a84c; --color-3: #8b6400;
        --color-4: #2a1800; --color-5: #000;
        --stop-1: 0%; --stop-2: 30%; --stop-3: 55%; --stop-4: 80%; --stop-5: 100%;
        --border-angle: 160deg;
        --border-color-1: hsla(42,75%,90%,0.25); --border-color-2: hsla(42,50%,90%,0.65);
        transform: translateY(-2px);
      }
      .btn-primary:active  { transform: translateY(0); }
      .btn-primary:focus-visible { outline: 2px solid var(--brand-9, #c9a84c); outline-offset: 3px; }

      .btn-secondary {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: inherit; font-size: 0.9rem; font-weight: 600;
        color: #fff; text-decoration: none;
        padding: 13px 26px; border-radius: 100px; cursor: pointer;
        position: relative; overflow: hidden; border: none;
        background: radial-gradient(
          ellipse var(--spread-x) var(--spread-y) at var(--pos-x) var(--pos-y),
          var(--color-1) var(--stop-1),
          var(--color-2) var(--stop-2),
          var(--color-3) var(--stop-3),
          var(--color-4) var(--stop-4),
          var(--color-5) var(--stop-5)
        );
        transition:
          --pos-x 0.4s, --pos-y 0.4s,
          --spread-x 0.4s, --spread-y 0.4s,
          --color-1 0.4s, --color-2 0.4s, --color-3 0.4s, --color-4 0.4s, --color-5 0.4s,
          --stop-1 0.4s, --stop-2 0.4s, --stop-3 0.4s, --stop-4 0.4s, --stop-5 0.4s,
          --border-angle 0.4s, --border-color-1 0.4s, --border-color-2 0.4s,
          transform 0.15s cubic-bezier(0.25,0.46,0.45,0.94);
      }
      .btn-secondary::before {
        content: ''; position: absolute; inset: 0;
        border-radius: inherit; padding: 1px;
        background: linear-gradient(var(--border-angle), var(--border-color-1), var(--border-color-2));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude; pointer-events: none;
      }
      .btn-secondary:hover {
        --pos-x: 0%; --pos-y: 95.51%; --spread-x: 110.24%; --spread-y: 110.2%;
        --color-1: #1a1400; --color-2: #3d2a00; --color-3: #7a5200;
        --color-4: #c9a84c; --color-5: #dbb96a;
        --stop-1: 0%; --stop-2: 25%; --stop-3: 50%; --stop-4: 78%; --stop-5: 100%;
        --border-angle: 210deg;
        --border-color-1: hsla(42,75%,90%,0.2); --border-color-2: hsla(42,50%,90%,0.7);
        transform: translateY(-2px);
      }
      .btn-secondary:active  { transform: translateY(0); }

      /* ── Footer ── */
      footer {
        background: #111;
        padding: 40px 24px;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .footer-inner {
        max-width: 1280px; margin: 0 auto;
        display: flex; flex-direction: row; align-items: center;
        justify-content: space-between; gap: 24px; flex-wrap: wrap;
      }
      .footer-copy { font-size: 0.8rem; color: #606060; white-space: nowrap; }
      .footer-links { display: flex; gap: 28px; list-style: none; flex-wrap: wrap; }
      .footer-links a {
        font-size: 0.8rem; color: #606060; white-space: nowrap;
        text-decoration: none; transition: color 0.2s ease;
      }
      .footer-links a:hover { color: #b4b4b4; }

      .footer-legal {
        max-width: 1280px; margin: 0 auto;
        display: flex; align-items: center; justify-content: center;
        gap: 24px; padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.04);
        margin-top: 24px;
        flex-wrap: wrap;
      }
      .footer-legal a {
        font-size: 0.75rem; color: #484848; white-space: nowrap;
        text-decoration: none; transition: color 0.2s ease;
        letter-spacing: 0.01em;
      }
      .footer-legal a:hover { color: #7b7b7b; }
      .footer-legal-sep {
        width: 1px; height: 10px;
        background: rgba(255,255,255,0.1);
        flex-shrink: 0;
      }

      @media (max-width: 640px) {
        .footer-inner {
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }
        .footer-links {
          justify-content: center;
          gap: 12px 20px;
        }
        .footer-legal { gap: 16px; }
        .footer-legal-sep { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Injection HTML CTA + footer ───────────────────────────────────────── */
  var footerHTML = `
    <section id="cta">
      <div class="cta-waves" id="ctaWaves" aria-hidden="true"></div>
      <div class="container">
        <div class="cta-inner">
          <div class="cta-tag" style="margin-bottom:16px"><span class="cta-tag-dot"></span>Contact</div>
          <h2 class="cta-h2">À la recherche d'une alternance et ouvert aux projets freelance.</h2>
          <p class="cta-desc">Web, design, vidéo, publicité digitale.<br>Je m'adapte à tes besoins. Écris-moi et on en parle.</p>
          <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <a href="mailto:hugo.bourg.pro@gmail.com" class="btn-primary">
              Me contacter
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <a href="${cvHref}" download class="btn-secondary">
              Télécharger mon CV
            </a>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div class="footer-inner">
        <p class="footer-copy">© 2026 BOURGEOIS Hugo</p>
        <ul class="footer-links">
          <li><a href="${base}index.html">Accueil</a></li>
          <li><a href="${sectionBase}#projects">Projets</a></li>
          <li><a href="${sectionBase}#tech">Compétences</a></li>
          <li><a href="${sectionBase}#interests">Intérêts</a></li>
          <li><a href="${base}info-com.html">Info Com</a></li>
          <li><a href="mailto:hugo.bourg.pro@gmail.com">Contact</a></li>
        </ul>
      </div>
      <div class="footer-legal">
        <a href="${base}mentions-legales.html">Mentions légales</a>
        <span class="footer-legal-sep" aria-hidden="true"></span>
        <a href="${base}confidentialite.html">Politique de confidentialité</a>
      </div>
    </footer>`;

  var thisScript = document.currentScript;
  thisScript.insertAdjacentHTML('beforebegin', footerHTML);

  /* ── Animation waves (simplex noise) ────────────────────────────────────── */
  import('https://cdn.jsdelivr.net/npm/simplex-noise@4/dist/esm/simplex-noise.js')
    .then(function (m) {
      var createNoise2D = m.createNoise2D;
      (function () {
        var container = document.getElementById('ctaWaves');
        if (!container) return;

        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        container.appendChild(svg);

        var SC    = 'rgba(255,255,255,0.12)';
        var XG    = 10, YG = 10;
        var noise2D = createNoise2D();
        var bounding = null, lines = [], paths = [], raf = null;
        var mouse = { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false };

        function setSize() {
          bounding = container.getBoundingClientRect();
          svg.style.width  = bounding.width  + 'px';
          svg.style.height = bounding.height + 'px';
        }
        function setLines() {
          paths.forEach(function (p) { p.remove(); });
          paths = []; lines = [];
          if (!bounding) return;
          var w = bounding.width, h = bounding.height;
          var oW = w + 200, oH = h + 30;
          var tL = Math.ceil(oW / XG), tP = Math.ceil(oH / YG);
          var xS = (w - XG * tL) / 2, yS = (h - YG * tP) / 2;
          for (var i = 0; i < tL; i++) {
            var pts = [];
            for (var j = 0; j < tP; j++) {
              pts.push({ x: xS + XG * i, y: yS + YG * j, wave: { x: 0, y: 0 }, cursor: { x: 0, y: 0, vx: 0, vy: 0 } });
            }
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', SC);
            path.setAttribute('stroke-width', '1');
            svg.appendChild(path);
            paths.push(path);
            lines.push(pts);
          }
        }
        function moved(p, withCursor) {
          withCursor = withCursor !== false;
          return { x: p.x + p.wave.x + (withCursor ? p.cursor.x : 0), y: p.y + p.wave.y + (withCursor ? p.cursor.y : 0) };
        }
        function movePoints(time) {
          lines.forEach(function (pts) {
            pts.forEach(function (p) {
              var n  = noise2D((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002) * 8;
              p.wave.x = Math.cos(n) * 12; p.wave.y = Math.sin(n) * 6;
              var dx = p.x - mouse.sx, dy = p.y - mouse.sy, d = Math.hypot(dx, dy), l = Math.max(175, mouse.vs);
              if (d < l) {
                var s = 1 - d / l, f = Math.cos(d * 0.001) * s;
                p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
                p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
              }
              p.cursor.vx += (0 - p.cursor.x) * 0.01; p.cursor.vy += (0 - p.cursor.y) * 0.01;
              p.cursor.vx *= 0.95; p.cursor.vy *= 0.95;
              p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x + p.cursor.vx));
              p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y + p.cursor.vy));
            });
          });
        }
        function drawLines() {
          lines.forEach(function (pts, i) {
            if (pts.length < 2 || !paths[i]) return;
            var first = moved(pts[0], false);
            var d = 'M ' + first.x + ' ' + first.y;
            for (var j = 1; j < pts.length; j++) { var c = moved(pts[j]); d += ' L ' + c.x + ' ' + c.y; }
            paths[i].setAttribute('d', d);
          });
        }
        function tick(time) {
          mouse.sx += (mouse.x - mouse.sx) * 0.1; mouse.sy += (mouse.y - mouse.sy) * 0.1;
          var dx = mouse.x - mouse.lx, dy = mouse.y - mouse.ly;
          mouse.v = Math.hypot(dx, dy); mouse.vs += (mouse.v - mouse.vs) * 0.1;
          mouse.vs = Math.min(100, mouse.vs); mouse.lx = mouse.x; mouse.ly = mouse.y;
          mouse.a = Math.atan2(dy, dx);
          movePoints(time); drawLines();
          raf = requestAnimationFrame(tick);
        }
        function onMouseMove(e) {
          if (!bounding) return;
          mouse.x = e.pageX - bounding.left;
          mouse.y = e.pageY - bounding.top + window.scrollY;
          if (!mouse.set) { mouse.sx = mouse.x; mouse.sy = mouse.y; mouse.lx = mouse.x; mouse.ly = mouse.y; mouse.set = true; }
        }

        setSize(); setLines();
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', function () { setSize(); setLines(); });
        raf = requestAnimationFrame(tick);
      })();
    })
    .catch(function () { /* simplex-noise non disponible — waves désactivées */ });

})();
