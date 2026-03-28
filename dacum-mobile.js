/* ============================================================
   dacum-mobile.js  v3 — smart top-bar sidebar control
   ============================================================
   Single responsibility: own the #dpsHamburger button.

   Button states:
     A) No projects → label "＋ New Project" → open sidebar + new-project prompt
     B) Projects exist → hamburger icon ☰   → toggle sidebar overlay

   Wide desktop (>1100px): sidebar uses existing push-layout toggle
   Narrow (≤1100px):       sidebar uses transform overlay
   ============================================================ */
(function () {
  'use strict';

  /* ── Double-init guard ─────────────────────────────────── */
  if (window.__SIDEBAR_INIT__) return;
  window.__SIDEBAR_INIT__ = true;

  var BREAKPOINT = 1100;

  /* ── Backdrop (created lazily) ──────────────────────────── */
  function _backdrop() {
    var el = document.getElementById('dpsMobileBackdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dpsMobileBackdrop';
      document.body.appendChild(el);
    }
    return el;
  }

  /* ── Sidebar open / close (overlay mode) ───────────────── */
  function openSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (sb) sb.classList.add('dps-mobile-open');
    _backdrop().classList.add('dps-backdrop-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (sb) sb.classList.remove('dps-mobile-open');
    _backdrop().classList.remove('dps-backdrop-visible');
    document.body.style.overflow = '';
  }

  function toggleSidebarOverlay() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    sb.classList.contains('dps-mobile-open') ? closeSidebar() : openSidebar();
  }

  /* ── Desktop push-layout toggle (reuses dacum_projects logic) */
  function toggleSidebarDesktop() {
    var toggle = document.getElementById('dpsToggle');
    if (toggle) {
      toggle.click();   // dacum_projects.js owns the push-collapse logic
    } else {
      /* Fallback: manually toggle dps-collapsed on wide screens */
      var sb      = document.getElementById('dacumProjectsSidebar');
      var wrapper = document.getElementById('dacumAppWrapper');
      if (!sb) return;
      var collapsed = sb.classList.toggle('dps-collapsed');
      if (wrapper) wrapper.classList.toggle('dps-is-collapsed', collapsed);
    }
  }

  /* ── Project count ──────────────────────────────────────── */
  function _hasProjects() {
    try {
      var list = JSON.parse(localStorage.getItem('dacum_projects') || '[]');
      return Array.isArray(list) && list.length > 0;
    } catch (_) { return false; }
  }

  /* ── Update smart button appearance ────────────────────── */
  var ICON_HAMBURGER =
    '<svg viewBox="0 0 18 18" width="16" height="16" fill="none" aria-hidden="true">' +
    '<rect x="2" y="3.6" width="14" height="1.8" rx="0.9" fill="currentColor"/>' +
    '<rect x="2" y="8.1" width="14" height="1.8" rx="0.9" fill="currentColor"/>' +
    '<rect x="2" y="12.6" width="14" height="1.8" rx="0.9" fill="currentColor"/>' +
    '</svg>';

  function _updateSmartButton() {
    var btn = document.getElementById('dpsHamburger');
    if (!btn) return;
    if (_hasProjects()) {
      btn.innerHTML = ICON_HAMBURGER;
      btn.title     = 'Projects sidebar';
      btn.setAttribute('aria-label', 'Toggle projects sidebar');
      btn.classList.remove('dps-btn-newproject');
    } else {
      btn.innerHTML = '＋ New Project';
      btn.title     = 'Create your first project';
      btn.setAttribute('aria-label', 'Create new project');
      btn.classList.add('dps-btn-newproject');
    }
  }

  /* ── Smart button click handler ─────────────────────────── */
  function _onSmartClick(e) {
    e.stopPropagation();

    if (!_hasProjects()) {
      /* State A: no projects — open sidebar then trigger new-project */
      if (window.innerWidth <= BREAKPOINT) openSidebar();
      else {
        var sb = document.getElementById('dacumProjectsSidebar');
        if (sb) sb.classList.remove('dps-collapsed');
        var wrapper = document.getElementById('dacumAppWrapper');
        if (wrapper) wrapper.classList.remove('dps-is-collapsed');
      }
      /* Click the existing ＋New button inside the sidebar */
      setTimeout(function () {
        var newBtn = document.getElementById('dpsNewProject');
        if (newBtn) newBtn.click();
      }, 160);
      return;
    }

    /* State B: projects exist — toggle */
    if (window.innerWidth <= BREAKPOINT) {
      toggleSidebarOverlay();
    } else {
      toggleSidebarDesktop();
    }
  }

  /* ── Wire all events (called once sidebar exists) ───────── */
  var _wired = false;
  function _wire() {
    if (_wired) return;
    _wired = true;

    /* Smart button */
    var btn = document.getElementById('dpsHamburger');
    if (btn) btn.addEventListener('click', _onSmartClick);

    /* Backdrop */
    _backdrop().addEventListener('click', closeSidebar);

    /* Project card click on narrow → close overlay after switch */
    document.addEventListener('click', function (e) {
      if (window.innerWidth > BREAKPOINT) return;
      if (e.target.closest('.dps-card-body')) {
        setTimeout(closeSidebar, 80);
      }
    });

    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    /* Resize: close overlay when going wide, sync button */
    var _rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(_rt);
      _rt = setTimeout(function () {
        if (window.innerWidth > BREAKPOINT) closeSidebar();
        _updateSmartButton();
      }, 120);
    });

    /* Watch localStorage for project changes (e.g. create / delete)
       to keep button label in sync without modifying dacum_projects.js */
    window.addEventListener('storage', function (e) {
      if (e.key === 'dacum_projects') _updateSmartButton();
    });

    /* MutationObserver on project list — catches same-tab changes */
    var list = document.getElementById('dpsProjectList');
    if (list) {
      new MutationObserver(_updateSmartButton)
        .observe(list, { childList: true });
    }

    _updateSmartButton();
  }

  /* ── Bootstrap ─────────────────────────────────────────── */
  function _boot() {
    _updateSmartButton();   /* set initial label before sidebar exists */

    if (document.getElementById('dacumProjectsSidebar')) {
      _wire();
      return;
    }
    /* Poll for sidebar injection by dacum_projects.js */
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
