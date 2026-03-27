// ============================================================
// tv-refactor.js
// Task Verification Tab — Refactored UX Additions
//
// Rules:
//   • NEVER modifies appState calculation logic.
//   • NEVER removes or renames existing event handlers.
//   • ONLY adds UI state management on top of existing code.
//   • Safe to load after app.js (DOMContentLoaded).
// ============================================================

(function () {
  'use strict';

  // ── 1. Instructions toggle ──────────────────────────────────

  function _wireInstructionsToggle() {
    const btn    = document.getElementById('btnToggleTVInstructions');
    const detail = document.getElementById('tvInstructionsDetail');
    if (!btn || !detail) return;

    btn.addEventListener('click', function () {
      const open = detail.style.display !== 'none';
      detail.style.display = open ? 'none' : 'block';
      btn.textContent = open ? 'Show details ▾' : 'Hide details ▴';
    });
  }

  // ── 2. Mode Indicator update ────────────────────────────────

  /**
   * Call this after any data change to reflect the current
   * data source in the dashboard header badge.
   * Modes: 'live' | 'manual' | 'mixed'
   */
  window.tvUpdateModeIndicator = function (mode) {
    const el = document.getElementById('tvModeIndicator');
    if (!el) return;

    const map = {
      live:   { cls: 'tv-mode-indicator--live',   text: '🟢 Live Data' },
      manual: { cls: 'tv-mode-indicator--manual', text: '🟡 Manual Entry' },
      mixed:  { cls: 'tv-mode-indicator--mixed',  text: '🔵 Mixed Mode' },
    };

    const cfg = map[mode] || map.manual;
    el.className = 'tv-mode-indicator ' + cfg.cls;
    el.textContent = cfg.text;
  };

  // Update indicator whenever mode radios change
  function _watchModeRadios() {
    document.querySelectorAll('input[name="collectionMode"]').forEach(radio => {
      radio.addEventListener('change', function () {
        const isWorkshop = this.value === 'workshop';
        const hasSession = !!document.getElementById('lwSessionId')?.textContent?.trim();
        window.tvUpdateModeIndicator(
          isWorkshop && hasSession ? 'live' : 'manual'
        );
      });
    });
  }

  // ── 3. Reflect selected toggle-pill visually via CSS ────────
  // :has() works in modern browsers; this is a JS fallback
  // for Firefox < 121 and older Safari.

  function _pollyfillTogglePills() {
    const supports = CSS.supports('selector(:has(input:checked))');
    if (supports) return; // native :has() — no polyfill needed

    function _refreshPills(groupName) {
      document.querySelectorAll(
        `.tv-toggle-row input[name="${groupName}"]`
      ).forEach(radio => {
        const pill = radio.closest('.tv-toggle-pill');
        if (!pill) return;
        if (radio.checked) {
          pill.style.background   = '#667eea';
          pill.style.borderColor  = '#667eea';
          pill.style.color        = '#fff';
        } else {
          pill.style.background   = '';
          pill.style.borderColor  = '';
          pill.style.color        = '';
        }
      });
    }

    ['collectionMode', 'workflowMode', 'priorityFormula'].forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
        radio.addEventListener('change', () => _refreshPills(name));
      });
      _refreshPills(name); // initial state
    });
  }

  // ── 4. Accordion hint counter ───────────────────────────────

  /**
   * Keep the "X duties · Y tasks" hint above the accordion
   * updated after Refresh.  Uses MutationObserver so it fires
   * whenever the accordion container is rebuilt by tasks.js.
   */
  function _watchAccordionHint() {
    const hint      = document.getElementById('tvAccordionHint');
    const container = document.getElementById('verificationAccordionContainer');
    if (!hint || !container) return;

    function _update() {
      const duties = container.querySelectorAll('.duty-accordion').length;
      const tasks  = container.querySelectorAll('.task-item, .verification-table tbody tr').length;
      if (duties === 0) {
        hint.textContent = 'No duties loaded — click Refresh Tasks';
        hint.style.color = '#ef4444';
      } else {
        hint.textContent = `${duties} ${duties === 1 ? 'duty' : 'duties'} · ${tasks} tasks`;
        hint.style.color = '';
      }
    }

    new MutationObserver(_update).observe(container, { childList: true, subtree: false });
    _update();
  }

  // ── 5. Sync existing "Refresh" button from old location ─────
  // The old index.html had btnLoadDutiesForVerification outside
  // the accordion section; the new layout keeps the same ID
  // inside the control panel — already handled by events.js.

  // ── 6. Live session state → mode indicator ──────────────────

  function _watchSessionState() {
    // Observe lwSessionId text changes (set by workshop.js)
    const sessionEl = document.getElementById('lwSessionId');
    if (!sessionEl) return;

    new MutationObserver(function () {
      const hasSession = !!sessionEl.textContent.trim();
      const isWorkshop = document.getElementById('mode-workshop')?.checked;
      window.tvUpdateModeIndicator(
        isWorkshop && hasSession ? 'live' : 'manual'
      );
    }).observe(sessionEl, { characterData: true, childList: true });
  }

  // ── Bootstrap ────────────────────────────────────────────────

  function _init() {
    _wireInstructionsToggle();
    _watchModeRadios();
    _pollyfillTogglePills();
    _watchAccordionHint();
    _watchSessionState();
    // Set initial indicator
    window.tvUpdateModeIndicator('manual');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})();
