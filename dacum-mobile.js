/* ============================================================
   dacum-mobile.js  v2 — sidebar / hamburger wiring
   Covers all widths ≤1100px (hamburger zone).
   Uses transform-based overlay — no margin-left shift.
   ============================================================ */
(function () {
  'use strict';

  /* ── Double-init guard ─────────────────────────────────── */
  if (window.__SIDEBAR_INIT__) return;
  window.__SIDEBAR_INIT__ = true;

  /* ── Breakpoint: hamburger is active below this width ──── */
  var BREAKPOINT = 1100;

  /* ── Backdrop (created once, lazily) ───────────────────── */
  function _backdrop() {
    var el = document.getElementById('dpsMobileBackdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dpsMobileBackdrop';
      document.body.appendChild(el);
    }
    return el;
  }

  /* ── State helpers ─────────────────────────────────────── */
  function isNarrow() { return window.innerWidth <= BREAKPOINT; }

  function openSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    sb.classList.add('dps-mobile-open');
    _backdrop().classList.add('dps-backdrop-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (sb) sb.classList.remove('dps-mobile-open');
    _backdrop().classList.remove('dps-backdrop-visible');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    if (sb.classList.contains('dps-mobile-open')) { closeSidebar(); }
    else { openSidebar(); }
  }

  /* ── Wire all handlers (idempotent once) ───────────────── */
  function _wire() {
    /* Hamburger click — always uses overlay toggle in hamburger zone */
    var hamburger = document.getElementById('dpsHamburger');
    if (hamburger) {
      hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isNarrow()) {
          toggleSidebar();
        } else {
          /* Wide desktop: fall back to native dpsToggle */
          var dt = document.getElementById('dpsToggle');
          if (dt) dt.click();
        }
      });
    }

    /* Backdrop click closes sidebar */
    _backdrop().addEventListener('click', closeSidebar);

    /* Project card click on narrow view → close after switch */
    document.addEventListener('click', function (e) {
      if (!isNarrow()) return;
      if (e.target.closest('.dps-card-body')) {
        setTimeout(closeSidebar, 80);
      }
    });

    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    /* Resize: close overlay only when expanding TO desktop width */
    var _rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(_rt);
      _rt = setTimeout(function () {
        if (!isNarrow()) {
          closeSidebar();          /* clean up overlay state */
          _syncHamburgerVisibility();
        } else {
          _syncHamburgerVisibility();
        }
      }, 120);
    });
  }

  /* ── Hamburger / dpsToggle visibility sync ─────────────── */
  function _syncHamburgerVisibility() {
    var hamburger = document.getElementById('dpsHamburger');
    var toggle    = document.getElementById('dpsToggle');
    var narrow    = isNarrow();

    if (hamburger) hamburger.style.display = narrow ? 'inline-flex' : 'none';
    if (toggle)    toggle.style.display    = narrow ? 'none'         : '';
  }

  /* ── Bootstrap: wait for sidebar to exist ──────────────── */
  function _boot() {
    _syncHamburgerVisibility();

    /* Sidebar is injected dynamically by dacum_projects.js.
       Poll briefly then wire once it appears. */
    if (document.getElementById('dacumProjectsSidebar')) {
      _wire();
      return;
    }
    var _attempts = 0;
    var _poll = setInterval(function () {
      _attempts++;
      if (document.getElementById('dacumProjectsSidebar') || _attempts > 60) {
        clearInterval(_poll);
        _wire();
      }
    }, 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }

})();
