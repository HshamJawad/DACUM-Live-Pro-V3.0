/* ============================================================
   dacum-mobile.js  (non-module, loaded after DOM content)
   Wires the mobile hamburger button to the projects sidebar.
   Uses a backdrop overlay so page content never shifts.
   ============================================================ */
(function () {
  'use strict';

  function isMobile() {
    return window.innerWidth <= 768;
  }

  // ── Inject backdrop element ──────────────────────────────
  function _getBackdrop() {
    var el = document.getElementById('dpsMobileBackdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dpsMobileBackdrop';
      document.body.appendChild(el);
    }
    return el;
  }

  // ── Open / close helpers ─────────────────────────────────
  function openSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (sb) sb.classList.add('dps-mobile-open');
    _getBackdrop().classList.add('dps-backdrop-visible');
    document.body.style.overflow = 'hidden';   // prevent scroll-through
  }

  function closeSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (sb) sb.classList.remove('dps-mobile-open');
    _getBackdrop().classList.remove('dps-backdrop-visible');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    var sb = document.getElementById('dacumProjectsSidebar');
    if (!sb) return;
    if (sb.classList.contains('dps-mobile-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // ── Wire hamburger ───────────────────────────────────────
  function _wire() {
    var hamburger = document.getElementById('dpsHamburger');
    if (hamburger) {
      hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isMobile()) toggleSidebar();
        else {
          // On desktop, delegate to the real sidebar toggle button
          var desktopToggle = document.getElementById('dpsToggle');
          if (desktopToggle) desktopToggle.click();
        }
      });
    }

    // ── Backdrop click closes sidebar ──────────────────────
    _getBackdrop().addEventListener('click', closeSidebar);

    // ── Close sidebar on any project card click (mobile) ───
    document.addEventListener('click', function (e) {
      if (!isMobile()) return;
      var card = e.target.closest('.dps-card-body');
      if (card) {
        // Small delay so the project switch can process first
        setTimeout(closeSidebar, 80);
      }
    });

    // ── Close on Escape ────────────────────────────────────
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    // ── On resize: close mobile overlay if going to desktop
    window.addEventListener('resize', function () {
      if (!isMobile()) {
        closeSidebar();   // clean up overlay state
      }
    });
  }

  // ── Run after DOM ready ──────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _wire);
  } else {
    // DOMContentLoaded already fired but sidebar may not exist yet
    // (initProjectsSidebar() is called inside DOMContentLoaded in app.js).
    // Use a short poll to wait for it.
    var _attempts = 0;
    var _poll = setInterval(function () {
      _attempts++;
      if (document.getElementById('dacumProjectsSidebar') || _attempts > 40) {
        clearInterval(_poll);
        _wire();
      }
    }, 100);
  }

})();
