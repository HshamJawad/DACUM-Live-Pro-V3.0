/* ============================================================
   dacum-fixes.js  v3.1
   FIX 1: AI card guard (old badge stays hidden)
   FIX 3: PWA Install prompt
   FIX 5: Version tag
   NOTE:  Hamburger/resize logic is fully owned by dacum-mobile.js
          to avoid double-init conflicts.
   ============================================================ */
(function () {
  'use strict';

  /* ── FIX 5: Version tag ─────────────────────────────────── */
  console.log('%c[DACUM] Running version 3.1', 'color:#667eea;font-weight:700;');

  /* ── FIX 1: AI card guard ───────────────────────────────── */
  window.__USE_NEW_AI_CARD__ = true;

  function _hideOldBadge() {
    var badge = document.getElementById('usageBadge');
    if (badge) badge.style.display = 'none';
  }

  /* ── FIX 3: PWA Install prompt ──────────────────────────── */
  var _deferredPrompt = null;

  function _injectInstallButton() {
    if (document.getElementById('dacumInstallBtn')) return;

    var btn = document.createElement('button');
    btn.id        = 'dacumInstallBtn';
    btn.title     = 'Install DACUM Live Pro as an app';
    btn.className = '';           /* styled via dacum-fixes.css */
    btn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="2.5"' +
      ' stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 3v13M6 11l6 6 6-6"/>' +
      '<path d="M5 21h14"/></svg> Install App';

    var right = document.querySelector('.dtb-right');
    if (right) {
      right.insertBefore(btn, right.firstChild);
    } else {
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
    /* Button may not exist yet if DOM is still loading — defer slightly */
    setTimeout(function () {
      _injectInstallButton();
      _showInstallButton();
    }, 0);
    console.log('[PWA] Install prompt captured.');
  });

  window.addEventListener('appinstalled', function () {
    _deferredPrompt = null;
    var btn = document.getElementById('dacumInstallBtn');
    if (btn) btn.classList.remove('dacum-install-visible');
    console.log('[PWA] App installed.');
  });

  /* ── Bootstrap ─────────────────────────────────────────── */
  function _init() {
    _hideOldBadge();
    /* Sidebar/hamburger handled entirely by dacum-mobile.js */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})();
