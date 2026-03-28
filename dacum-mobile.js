/* ============================================================
   dacum-mobile.js  v6 — sidebar overlay for mobile/tablet
   The #topSidebarToggleBtn has been removed.
   Sidebar is controlled by:
     • The existing #dpsToggle inside the sidebar (desktop)
     • Backdrop click (overlay close on narrow screens)
     • Escape key
   ============================================================ */
(function () {
  'use strict';

  if (window.__SIDEBAR_INIT__) return;
  window.__SIDEBAR_INIT__ = true;

  var BREAKPOINT = 1100;

  /* ── Backdrop ───────────────────────────────────────────── */
  function _backdrop() {
    var el = document.getElementById('dpsMobileBackdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dpsMobileBackdrop';
      document.body.appendChild(el);
    }
    return el;
  }

  /* ── Open / close ───────────────────────────────────────── */
  function closeSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    sb.classList.add('sidebar-hidden');
    _backdrop().classList.remove('dps-backdrop-visible');
    document.body.style.overflow = '';
  }

  /* ── Wire listeners ─────────────────────────────────────── */
  var _wired = false;
  function _wire() {
    if (_wired) return;
    _wired = true;

    /* Backdrop click closes overlay */
    _backdrop().addEventListener('click', closeSidebar);

    /* Project card click on narrow → close */
    document.addEventListener('click', function (e) {
      if (window.innerWidth > BREAKPOINT) return;
      if (e.target.closest('.dps-card-body')) setTimeout(closeSidebar, 80);
    });

    /* Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    /* Resize: remove overlay state when going wide */
    var _rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(_rt);
      _rt = setTimeout(function () {
        if (window.innerWidth > BREAKPOINT) {
          _backdrop().classList.remove('dps-backdrop-visible');
          document.body.style.overflow = '';
          var sb = document.getElementById('dacumProjectsSidebar');
          if (sb) sb.classList.remove('sidebar-hidden');
        }
      }, 120);
    });

    /* Ensure sidebar visible on load */
    var sb = document.getElementById('dacumProjectsSidebar');
    if (sb) sb.classList.remove('sidebar-hidden');
  }

  /* ── Bootstrap ─────────────────────────────────────────── */
  function _boot() {
    if (document.getElementById('dacumProjectsSidebar')) { _wire(); return; }
    var _n = 0;
    var _p = setInterval(function () {
      _n++;
      if (document.getElementById('dacumProjectsSidebar') || _n > 60) {
        clearInterval(_p);
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
