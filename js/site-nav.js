/* ═══════════════════════════════════════════════════════════════════════════
   site-nav.js — Composant nav + mobile menu partagé entre toutes les pages
   ═══════════════════════════════════════════════════════════════════════════
   Usage (root) :    <script src="js/site-nav.js"></script>
   Usage (subpage) : <script src="../js/site-nav.js"></script>
   Placer immédiatement après #page-loader, là où la nav doit apparaître.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── Détection du chemin de base ──────────────────────────────────────────
     Root (index.html, info-com.html) → base = ''
     Sous-pages (projets/, interets/)  → base = '../'                        */
  var filename = window.location.pathname.split('/').pop();
  var parts    = window.location.pathname.replace(/^\//, '').split('/').filter(Boolean);
  var base     = parts.length > 1 ? '../' : '';
  var isIndex  = filename === '' || filename === 'index.html';

  /* Préfixe des ancres de section (#projects, #tech, #interests)
     '' sur index.html → '#projects'
     'index.html' sur info-com.html → 'index.html#projects'
     '../index.html' sur sous-pages → '../index.html#projects'               */
  var sectionBase = isIndex ? '' : (base + 'index.html');
  var logoHref    = isIndex ? '#' : (base + 'index.html');
  var logoSrc     = base + 'Brand/logo/6-removebg.png';
  var infocomHref = base + 'info-com.html';

  /* ── Injection CSS nav ────────────────────────────────────────────────────
     Injecté en fin de <head> → prend le dessus sur les styles inline.
     Le header est TRANSPARENT en haut de page, solide dès qu'on scrolle.    */
  var style = document.createElement('style');
  style.id  = 'site-nav-styles';
  style.textContent = `
    /* ─── NAV principale (scoped à #siteNav pour ne pas affecter mobile-menu-links) ─── */
    #siteNav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 500;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid transparent;
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      transition:
        background     0.45s cubic-bezier(0.4,0,0.2,1),
        border-color   0.45s cubic-bezier(0.4,0,0.2,1),
        backdrop-filter 0.45s cubic-bezier(0.4,0,0.2,1),
        transform      0.35s cubic-bezier(0.4,0,0.2,1),
        opacity        0.25s ease,
        visibility     0.25s ease;
    }
    #siteNav.nav-scrolled {
      border-bottom-color: rgba(255,255,255,0.06);
      background: rgba(17,17,17,0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    #siteNav.nav-hidden  { transform: translateY(-100%); }
    #siteNav.nav-menu-open { opacity: 0; visibility: hidden; }

    .nav-logo {
      font-size: 1.1rem; font-weight: 600;
      color: #eee; letter-spacing: -0.04em;
      text-decoration: none; display: flex; align-items: center; gap: 8px;
    }

    .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
    .nav-links a {
      color: rgba(255,255,255,0.65); text-decoration: none;
      font-size: 0.9rem; letter-spacing: -0.01em;
      transition: color 0.2s ease;
    }
    .nav-links a:hover { color: #eee; }

    .nav-cta {
      background: var(--brand-9, #c9a84c); color: #000 !important;
      font-weight: 600 !important; padding: 10px 20px; border-radius: 100px;
      transition: background 0.2s ease, transform 0.15s ease !important;
      text-shadow: none !important;
    }
    .nav-cta:hover { background: var(--brand-10, #dbb96a) !important; transform: translateY(-1px); }

    /* ─── Top gradient overlay — lisibilité sur les fonds clairs ─── */
    #navTopGradient {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 180px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%);
      z-index: 498;
      pointer-events: none;
      transition: opacity 0.45s cubic-bezier(0.4,0,0.2,1);
    }
    #navTopGradient.gradient-hidden { opacity: 0; }

    /* ─── Text-shadow sur le texte nav transparent ─── */
    #siteNav:not(.nav-scrolled) .nav-links a,
    #siteNav:not(.nav-scrolled) .nav-logo {
      text-shadow: 0 1px 10px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.45);
    }

    .nav-dropdown { position: relative; }
    .nav-dropdown::after {
      content: ''; position: absolute;
      top: 100%; left: -20px; right: -20px; height: 16px;
    }
    .nav-dropdown-trigger { display: flex; align-items: center; gap: 5px; }
    .nav-dropdown-trigger svg { transition: transform 0.25s ease; opacity: 0.6; }
    .nav-dropdown:hover .nav-dropdown-trigger svg,
    .nav-dropdown.open   .nav-dropdown-trigger svg { transform: rotate(180deg); opacity: 1; }

    .nav-dropdown-menu {
      position: absolute; top: calc(100% + 14px); left: 50%;
      transform: translateX(-50%) translateY(-6px);
      background: rgba(20,20,20,0.96);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-radius: 12px; padding: 6px; min-width: 200px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      z-index: 200;
    }
    .nav-dropdown:hover .nav-dropdown-menu,
    .nav-dropdown.open   .nav-dropdown-menu {
      opacity: 1; pointer-events: all;
      transform: translateX(-50%) translateY(0);
    }
    .nav-dropdown-menu a {
      display: flex; align-items: center; gap: 8px;
      padding: 9px 14px; border-radius: 8px; font-size: 0.88rem;
      color: rgba(255,255,255,0.7) !important;
      text-decoration: none;
      transition: background 0.15s ease, color 0.15s ease !important;
    }
    .nav-dropdown-menu a:hover { background: rgba(255,255,255,0.06); color: #eee !important; }
    .menu-dot {
      width: 4px; height: 4px; border-radius: 50%;
      background: var(--brand-9, #c9a84c); flex-shrink: 0;
    }

    /* ─── Burger ─── */
    .nav-burger {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 4px;
    }
    .nav-burger span {
      display: block; width: 22px; height: 2px; background: #eee;
      border-radius: 2px; transition: transform 0.25s ease, opacity 0.25s ease;
    }
    @media (max-width: 768px) {
      .nav-links  { display: none; }
      .nav-burger { display: flex; }
    }

    /* ─── Reset : annule le "nav { position:fixed }" des pages inline ─── */
    nav.mobile-menu-links {
      position: static;
      top: auto; left: auto; right: auto;
      z-index: auto;
      background: none;
      backdrop-filter: none; -webkit-backdrop-filter: none;
      border-bottom: none;
      padding: 0;
      transform: none;
      opacity: 1;
      visibility: visible;
      transition: none;
    }

    /* ─── Mobile menu ─── */
    .mobile-menu {
      position: fixed; inset: 0; z-index: 9998;
      background: rgba(8,8,8,0.97);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      display: flex; flex-direction: column;
      justify-content: center; align-items: flex-start;
      padding: 48px 32px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .mobile-menu.open { opacity: 1; pointer-events: all; }

    .mobile-menu-links { display: flex; flex-direction: column; gap: 0; width: 100%; }
    .mobile-menu-item > a,
    .mobile-menu-item-trigger {
      display: flex; align-items: center; justify-content: space-between;
      font-size: 1.6rem; font-weight: 700;
      color: #eee; text-decoration: none;
      letter-spacing: -0.04em;
      padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
      background: none; border-left: none; border-right: none; border-top: none;
      width: 100%; text-align: left; cursor: pointer;
      font-family: inherit;
      transition: color 0.2s ease;
    }
    .mobile-menu-item > a:hover,
    .mobile-menu-item-trigger:hover { color: var(--brand-9, #c9a84c); }

    .mobile-submenu {
      display: none; padding: 8px 0 8px 16px;
      flex-direction: column; gap: 0;
    }
    .mobile-menu-item.open .mobile-submenu { display: flex; }
    .mobile-submenu a {
      display: flex; align-items: center; gap: 8px;
      font-size: 1rem; font-weight: 500;
      color: rgba(255,255,255,0.55); text-decoration: none;
      padding: 10px 0; letter-spacing: -0.02em;
      transition: color 0.2s ease; border: none;
    }
    .mobile-submenu a:hover { color: var(--brand-9, #c9a84c); }

    .mobile-menu-bottom { margin-top: 40px; align-self: center; }
    .mobile-menu-bottom a {
      display: inline-flex;
      background: var(--brand-9, #c9a84c); color: #000;
      font-weight: 700; font-family: inherit;
      padding: 14px 32px; border-radius: 100px;
      text-decoration: none; font-size: 1rem; letter-spacing: -0.02em;
    }
  `;
  document.head.appendChild(style);

  /* ── Injection HTML nav + mobile menu ─────────────────────────────────── */
  var svg12 = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var svg16 = '<svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var navHTML = `
    <div id="navTopGradient"></div>
    <nav id="siteNav">
      <a href="${logoHref}" class="nav-logo">
        <img src="${logoSrc}" alt="BOURGEOIS Hugo" style="height:34px;width:auto;display:block;">
      </a>
      <ul class="nav-links">
        <li><a href="${logoHref}">Accueil</a></li>
        <li class="nav-dropdown">
          <a href="${sectionBase}#projects" class="nav-dropdown-trigger">
            Projets ${svg12}
          </a>
          <div class="nav-dropdown-menu">
            <a href="${base}projets/restaurant-authentique.html"><span class="menu-dot"></span>Restaurant L'Authentique</a>
            <a href="${base}projets/trouve-ta-ref.html"><span class="menu-dot"></span>Trouve Ta Ref</a>
            <a href="${base}projets/media-buying.html"><span class="menu-dot"></span>Media Buying</a>
          </div>
        </li>
        <li><a href="${sectionBase}#tech">Compétences</a></li>
        <li class="nav-dropdown">
          <a href="${sectionBase}#interests" class="nav-dropdown-trigger">
            Intérêts ${svg12}
          </a>
          <div class="nav-dropdown-menu">
            <a href="${base}interets/armee.html"><span class="menu-dot"></span>Armée</a>
            <a href="${base}interets/musculation.html"><span class="menu-dot"></span>Musculation</a>
            <a href="${base}interets/boxe.html"><span class="menu-dot"></span>Boxe</a>
          </div>
        </li>
        <li><a href="${infocomHref}">Info Com</a></li>
        <li><a href="mailto:hugo.bourg.pro@gmail.com" class="nav-cta">Me contacter</a></li>
      </ul>
      <button class="nav-burger" id="navBurger" aria-label="Ouvrir le menu">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
      <nav class="mobile-menu-links">
        <div class="mobile-menu-item">
          <a href="${logoHref}">Accueil</a>
        </div>
        <div class="mobile-menu-item">
          <button class="mobile-menu-item-trigger">Projets ${svg16}</button>
          <div class="mobile-submenu">
            <a href="${base}projets/restaurant-authentique.html"><span class="menu-dot"></span>Restaurant L'Authentique</a>
            <a href="${base}projets/trouve-ta-ref.html"><span class="menu-dot"></span>Trouve Ta Ref</a>
            <a href="${base}projets/media-buying.html"><span class="menu-dot"></span>Media Buying</a>
          </div>
        </div>
        <div class="mobile-menu-item">
          <a href="${sectionBase}#tech">Compétences</a>
        </div>
        <div class="mobile-menu-item">
          <button class="mobile-menu-item-trigger">Intérêts ${svg16}</button>
          <div class="mobile-submenu">
            <a href="${base}interets/armee.html"><span class="menu-dot"></span>Armée</a>
            <a href="${base}interets/musculation.html"><span class="menu-dot"></span>Musculation</a>
            <a href="${base}interets/boxe.html"><span class="menu-dot"></span>Boxe</a>
          </div>
        </div>
        <div class="mobile-menu-item">
          <a href="${infocomHref}">Info Com</a>
        </div>
      </nav>
      <div class="mobile-menu-bottom">
        <a href="mailto:hugo.bourg.pro@gmail.com">Me contacter</a>
      </div>
    </div>`;

  /* Capture currentScript AVANT tout code asynchrone */
  var thisScript = document.currentScript;
  thisScript.insertAdjacentHTML('afterend', navHTML);

  /* ── Comportement 1 : transparent en haut / solide au scroll ───────────── */
  (function () {
    var nav      = document.getElementById('siteNav');
    var gradient = document.getElementById('navTopGradient');
    if (!nav) return;
    var lastY    = 0;
    var ticking  = false;
    var SOLID_AT = 10;   /* px → devient solide dès 10px de scroll */
    var HIDE_AT  = 80;   /* px → seuil avant de cacher au scroll bas */

    function update() {
      var y = window.scrollY;
      if (y < SOLID_AT) {
        nav.classList.remove('nav-scrolled');
        if (gradient) gradient.classList.remove('gradient-hidden');
      } else {
        nav.classList.add('nav-scrolled');
        if (gradient) gradient.classList.add('gradient-hidden');
      }
      if (y < HIDE_AT) {
        nav.classList.remove('nav-hidden');
      } else if (y > lastY) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
      lastY   = y;
      ticking = false;
    }

    update(); /* état initial */
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  })();

  /* ── Comportement 2 : burger / menu mobile ─────────────────────────────── */
  (function () {
    var burger = document.getElementById('navBurger');
    var menu   = document.getElementById('mobileMenu');
    var nav    = document.getElementById('siteNav');
    if (!burger || !menu) return;
    var isOpen = false;

    function toggleMenu(state) {
      isOpen = (typeof state !== 'undefined') ? state : !isOpen;
      menu.classList.toggle('open', isOpen);
      menu.setAttribute('aria-hidden', String(!isOpen));
      if (nav) nav.classList.toggle('nav-menu-open', isOpen);
      var spans = burger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    }

    burger.addEventListener('click', function () { toggleMenu(); });

    menu.querySelectorAll('.mobile-menu-item-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item    = trigger.closest('.mobile-menu-item');
        var wasOpen = item.classList.contains('open');
        menu.querySelectorAll('.mobile-menu-item').forEach(function (i) { i.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });

    menu.addEventListener('click', function (e) { if (e.target === menu) toggleMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) toggleMenu(false);
    });
  })();

})();
