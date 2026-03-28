/* ============================================================
   dacum-mobile.js  v5 — smart sidebar button
   Button ID: #topSidebarToggleBtn (already in toolbar HTML)

   Smart states:
     No projects → label "➕ New Project" → open sidebar + new-project modal
     Projects exist → label "☰ Projects"  → toggle sidebar
   ============================================================ */
(function () {
  'use strict';

  /* ── Double-init guard ─────────────────────────────────── */
  if (window.__SIDEBAR_INIT__) return;
  window.__SIDEBAR_INIT__ = true;

  var BREAKPOINT = 1100;

  /* ══════════════════════════════════════════════════════════
     1. STATE DETECTION
     Checks window.projects (set by dacum_projects.js if available)
     then falls back to localStorage.
  ══════════════════════════════════════════════════════════ */
  function hasProjects() {
    // Primary: use in-memory list if already exposed
    if (Array.isArray(window.projects) && window.projects.length > 0) return true;
    // Fallback: localStorage
    try {
      var list = JSON.parse(localStorage.getItem('dacum_projects') || '[]');
      return Array.isArray(list) && list.length > 0;
    } catch (_) { return false; }
  }

  /* ══════════════════════════════════════════════════════════
     2. SIDEBAR OPEN / CLOSE
  ══════════════════════════════════════════════════════════ */
  function _backdrop() {
    var el = document.getElementById('dpsMobileBackdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dpsMobileBackdrop';
      document.body.appendChild(el);
    }
    return el;
  }

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
    sb.classList.contains('sidebar-hidden') ? openSidebar() : closeSidebar();
  }

  function openNewProjectModal() {
    var newBtn = document.getElementById('dpsNewProject');
    if (newBtn) newBtn.click();
  }

  /* ══════════════════════════════════════════════════════════
     3. LABEL UPDATE
     Called after create / delete / load and on resize.
  ══════════════════════════════════════════════════════════ */
  function updateSmartButton() {
    var btn = document.getElementById('topSidebarToggleBtn');
    if (!btn) return;

    var has = hasProjects();
    var lbl = btn.querySelector('.dtb-sidebar-label');

    if (lbl) {
      lbl.textContent = has ? 'Projects' : '＋ New Project';
    } else {
      // Button has no .dtb-sidebar-label child — update full text
      // Preserve the SVG icon if present
      var svg = btn.querySelector('svg');
      if (svg) {
        // Replace text node only
        var nodes = Array.from(btn.childNodes);
        nodes.forEach(function (n) {
          if (n.nodeType === Node.TEXT_NODE) n.textContent = '';
        });
        // Set after SVG
        if (!btn.querySelector('.dtb-sidebar-label')) {
          var span = document.createElement('span');
          span.className = 'dtb-sidebar-label';
          btn.appendChild(span);
        }
        btn.querySelector('.dtb-sidebar-label').textContent =
          has ? ' Projects' : ' ＋ New Project';
      } else {
        btn.textContent = has ? '☰ Projects' : '➕ New Project';
      }
    }

    btn.title = has
      ? 'Toggle projects sidebar'
      : 'Create your first project';
  }

  // Expose so dacum_projects.js can call it after create/delete/load
  window.updateSmartSidebarButton = updateSmartButton;

  /* ══════════════════════════════════════════════════════════
     4. CLICK HANDLER (replaces any previous listener)
     Uses a cloned node to strip old listeners cleanly.
  ══════════════════════════════════════════════════════════ */
  function _attachClickHandler() {
    var btn = document.getElementById('topSidebarToggleBtn');
    if (!btn) return;

    // Remove old handlers by replacing with a clean clone
    var fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);

    fresh.addEventListener('click', function (e) {
      e.stopPropagation();

      if (!hasProjects()) {
        // State A: no projects
        openSidebar();
        setTimeout(openNewProjectModal, 160);
      } else {
        // State B: projects exist
        toggleSidebar();
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. SUPPORTING LISTENERS
  ══════════════════════════════════════════════════════════ */
  function _wireSupport() {
    /* Backdrop */
    _backdrop().addEventListener('click', closeSidebar);

    /* Project card click on narrow → close overlay */
    document.addEventListener('click', function (e) {
      if (window.innerWidth > BREAKPOINT) return;
      if (e.target.closest('.dps-card-body')) setTimeout(closeSidebar, 80);
    });

    /* Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    /* Resize */
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
        updateSmartButton();
      }, 120);
    });

    /* 4. AUTO UPDATE after create / delete / load
       — storage event (cross-tab) */
    window.addEventListener('storage', function (e) {
      if (e.key === 'dacum_projects') updateSmartButton();
    });

    /* — MutationObserver on project list (same-tab changes) */
    var list = document.getElementById('dpsProjectList');
    if (list) {
      new MutationObserver(updateSmartButton).observe(list, { childList: true });
    }
  }

  /* ══════════════════════════════════════════════════════════
     WIRE — called once sidebar exists in DOM
  ══════════════════════════════════════════════════════════ */
  var _wired = false;
  function _wire() {
    if (_wired) return;
    _wired = true;

    _attachClickHandler();
    _wireSupport();

    /* Initial state: sidebar visible, label correct */
    var sb = document.getElementById('dacumProjectsSidebar');
    if (sb) sb.classList.remove('sidebar-hidden');
    updateSmartButton();
  }

  /* ── Bootstrap ─────────────────────────────────────────── */
  function _boot() {
    // Run label update immediately (button exists before sidebar)
    updateSmartButton();

    if (document.getElementById('dacumProjectsSidebar')) {
      _wire();
      return;
    }
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
