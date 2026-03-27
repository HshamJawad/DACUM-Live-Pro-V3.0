/* ============================================================
   dacum-fixes.js  — v3.1 regression fixes (non-module)
   Load after app.js and dacum-mobile.js
   ============================================================ */
(function () {
  'use strict';

  // ── FIX 5: Version tag ─────────────────────────────────────
  console.log('%c[DACUM] Running version 3.1', 'color:#667eea;font-weight:700;');

  // ── FIX 1: AI card guard ───────────────────────────────────
  // Prevent any legacy code from re-showing the old badge.
  window.__USE_NEW_AI_CARD__ = true;

  function _hideOldBadge() {
    var badge = document.getElementById('usageBadge');
    if (badge) badge.style.display = 'none';
  }

  // ── FIX 3: PWA Install prompt ──────────────────────────────
  var _deferredPrompt = null;

  function _injectInstallButton() {
    if (document.getElementById('dacumInstallBtn')) return;

    var btn = document.createElement('button');
    btn.id        = 'dacumInstallBtn';
    btn.title     = 'Install DACUM Live Pro as an app';
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 3v13M6 11l6 6 6-6"/><path d="M5 21h14"/></svg> Install App';

    // Insert into toolbar right section
    var right = document.querySelector('.dtb-right');
    if (right) {
      right.insertBefore(btn, right.firstChild);
    } else {
      // fallback: append to toolbar
      var toolbar = document.getElementById('dacumTopToolbar');
      if (toolbar) toolbar.appendChild(btn);
    }

    btn.addEventListener('click', async function () {
      if (!_deferredPrompt) return;
      _deferredPrompt.prompt();
      var result = await _deferredPrompt.userChoice;
      console.log('[PWA] Install choice:', result.outcome);
      _deferredPrompt = null;
      btn.classList.remove('dacum-install-visible');
    });
  }

  function _showInstallButton() {
    var btn = document.getElementById('dacumInstallBtn');
    if (btn) btn.classList.add('dacum-install-visible');
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    _deferredPrompt = e;
    _injectInstallButton();
    _showInstallButton();
    console.log('[PWA] Install prompt ready.');
  });

  window.addEventListener('appinstalled', function () {
    _deferredPrompt = null;
    var btn = document.getElementById('dacumInstallBtn');
    if (btn) btn.classList.remove('dacum-install-visible');
    console.log('[PWA] App installed successfully.');
  });

  // ── FIX 4: Hamburger menu on resize ───────────────────────
  // Re-evaluate hamburger visibility whenever the window resizes.
  // This covers the case where the PWA desktop window is resized
  // across the 1100px breakpoint while the app is open.

  function _syncHamburger() {
    var hamburger = document.getElementById('dpsHamburger');
    var toggle    = document.getElementById('dpsToggle');
    if (!hamburger) return;

    var narrow = window.innerWidth <= 1100;
    hamburger.style.display = narrow ? 'inline-flex' : 'none';
    if (toggle) toggle.style.display = narrow ? 'none' : '';

    // If the sidebar is open as a mobile overlay but we resized to
    // desktop width, close it cleanly.
    if (!narrow) {
      var sb       = document.getElementById('dacumProjectsSidebar');
      var backdrop = document.getElementById('dpsMobileBackdrop');
      if (sb)       sb.classList.remove('dps-mobile-open');
      if (backdrop) backdrop.classList.remove('dps-backdrop-visible');
      document.body.style.overflow = '';
    }
  }

  // Throttled resize handler (runs at most every 120ms)
  var _resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(_syncHamburger, 120);
  });

  // ── Bootstrap (run once DOM is ready) ─────────────────────
  function _init() {
    _hideOldBadge();
    _syncHamburger();    // initial state on load
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})();
