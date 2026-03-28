/* ============================================================
   dacum-mobile.js  v4 — minimal stable sidebar toggle
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
  function openSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    sb.classList.remove('sidebar-hidden');
    if (window.innerWidth <= BREAKPOINT) {
      _backdrop().classList.add('dps-backdrop-visible');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    sb.classList.add('sidebar-hidden');
    _backdrop().classList.remove('dps-backdrop-visible');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    if (sb.classList.contains('sidebar-hidden')) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }

  /* ── Update button label ────────────────────────────────── */
  function _updateBtnLabel() {
    var btn = document.getElementById('topSidebarToggleBtn');
    if (!btn) return;
    var lbl = btn.querySelector('.dtb-sidebar-label');
    try {
      var projects = JSON.parse(localStorage.getItem('dacum_projects') || '[]');
      if (lbl) lbl.textContent = projects.length > 0 ? 'Projects' : '＋ New';
    } catch (_) { /* ignore */ }
  }

  /* ── Wire ───────────────────────────────────────────────── */
  var _wired = false;
  function _wire() {
    if (_wired) return;
    _wired = true;

    /* Main toggle button */
    var btn = document.getElementById('topSidebarToggleBtn');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var sb = document.getElementById('dacumProjectsSidebar');
        if (!sb) return;

        var hasProjects = false;
        try {
          hasProjects = JSON.parse(localStorage.getItem('dacum_projects') || '[]').length > 0;
        } catch (_) {}

        if (!hasProjects) {
          /* No projects: open sidebar and trigger ＋ New */
          openSidebar();
          setTimeout(function () {
            var newBtn = document.getElementById('dpsNewProject');
            if (newBtn) newBtn.click();
          }, 160);
        } else {
          toggleSidebar();
        }
      });
    }

    /* Backdrop closes sidebar */
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

    /* Resize — close overlay only when going wide */
    var _rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(_rt);
      _rt = setTimeout(function () {
        if (window.innerWidth > BREAKPOINT) {
          /* Wide: remove overlay state, keep sidebar visible */
          _backdrop().classList.remove('dps-backdrop-visible');
          document.body.style.overflow = '';
          var sb = document.getElementById('dacumProjectsSidebar');
          if (sb) sb.classList.remove('sidebar-hidden');
        }
        _updateBtnLabel();
      }, 120);
    });

    /* Sync label when projects change */
    window.addEventListener('storage', function (e) {
      if (e.key === 'dacum_projects') _updateBtnLabel();
    });
    var list = document.getElementById('dpsProjectList');
    if (list) new MutationObserver(_updateBtnLabel).observe(list, { childList: true });

    /* Initial state: sidebar visible */
    var sb = document.getElementById('dacumProjectsSidebar');
    if (sb) sb.classList.remove('sidebar-hidden');

    _updateBtnLabel();
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
