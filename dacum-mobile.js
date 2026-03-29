/* ============================================================
   dacum-mobile.js  v7 — static button sidebar toggle
   Button #btnSidebarToggle is hardcoded in index.html.
   It can NEVER disappear. Zero dependency on JS injection.
   ============================================================ */
(function () {
  'use strict';

  if (window.__SIDEBAR_INIT__) return;
  window.__SIDEBAR_INIT__ = true;

  var BREAKPOINT = 900;   /* mobile overlay below this width */

  /* ── Backdrop ───────────────────────────────────────────── */
  function _backdrop() {
    var el = document.getElementById('dpsMobileBackdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dpsMobileBackdrop';
      /* Styled via dacum-responsive.css */
      document.body.appendChild(el);
    }
    return el;
  }

  /* ── Sidebar state helpers ──────────────────────────────── */
  function _isMobileLayout() {
    return window.innerWidth <= BREAKPOINT;
  }

  function openSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    if (_isMobileLayout()) {
      sb.classList.add('dps-mobile-open');
      _backdrop().classList.add('dps-backdrop-visible');
      document.body.style.overflow = 'hidden';
    } else {
      /* Desktop: un-hide */
      sb.classList.remove('dps-force-hidden');
      var w = document.getElementById('dacumAppWrapper');
      if (w) w.classList.remove('dps-force-hidden-wrapper');
    }
  }

  function closeSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    if (_isMobileLayout()) {
      sb.classList.remove('dps-mobile-open');
      _backdrop().classList.remove('dps-backdrop-visible');
      document.body.style.overflow = '';
    } else {
      /* Desktop: hide */
      sb.classList.add('dps-force-hidden');
      var w = document.getElementById('dacumAppWrapper');
      if (w) w.classList.add('dps-force-hidden-wrapper');
    }
  }

  function toggleSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    if (_isMobileLayout()) {
      sb.classList.contains('dps-mobile-open') ? closeSidebar() : openSidebar();
    } else {
      sb.classList.contains('dps-force-hidden') ? openSidebar() : closeSidebar();
    }
  }

  /* ── Wire ───────────────────────────────────────────────── */
  var _wired = false;
  function _wire() {
    if (_wired) return;
    _wired = true;

    /* ── Main button — always in DOM ─────────────────────── */
    var btn = document.getElementById('btnSidebarToggle');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleSidebar();
      });
    }

    /* ── Backdrop click ──────────────────────────────────── */
    _backdrop().addEventListener('click', closeSidebar);

    /* ── Project card click on mobile → close overlay ────── */
    document.addEventListener('click', function (e) {
      if (!_isMobileLayout()) return;
      if (e.target.closest('.dps-card-body')) setTimeout(closeSidebar, 80);
    });

    /* ── Escape ──────────────────────────────────────────── */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    /* ── Resize ──────────────────────────────────────────── */
var _rt = null;
window.addEventListener('resize', function () {
  clearTimeout(_rt);
  _rt = setTimeout(function () {

    var sb = document.getElementById('dacumProjectsSidebar');
    var w  = document.getElementById('dacumAppWrapper');

    if (_isMobileLayout()) {
      if (sb) sb.classList.remove('dps-mobile-open');
      _backdrop().classList.remove('dps-backdrop-visible');
      document.body.style.overflow = '';
    } else {
      if (sb) {
        sb.classList.remove('dps-mobile-open');
        sb.classList.remove('dps-force-hidden');
      }
      if (w) w.classList.remove('dps-force-hidden-wrapper');

      _backdrop().classList.remove('dps-backdrop-visible');
      document.body.style.overflow = '';
    }

  }, 120);
});

    /* ── Initial state: sidebar visible ─────────────────── */
var sb = document.getElementById('dacumProjectsSidebar');
var w  = document.getElementById('dacumAppWrapper');

if (sb) {
  if (_isMobileLayout()) {
    /* Mobile: start hidden */
    sb.classList.remove('dps-force-hidden');
    sb.classList.remove('dps-mobile-open'); // closed overlay
    _backdrop().classList.remove('dps-backdrop-visible');
    document.body.style.overflow = '';
  } else {
    /* Desktop: visible by default */
    sb.classList.remove('dps-force-hidden');
    sb.classList.remove('dps-mobile-open');
  }
}

if (w && !_isMobileLayout()) {
  w.classList.remove('dps-force-hidden-wrapper');
}

  /* ── Bootstrap: wait for sidebar injection by dacum_projects.js */
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
