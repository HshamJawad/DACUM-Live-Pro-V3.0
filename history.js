// ============================================================
// /history.js
// Undo / Redo — Word-like command pattern for Duties & Tasks.
// Supports: structural ops (add/remove duty/task) and
//           word-level text changes (like Microsoft Word).
// ============================================================

const MAX_HISTORY = 200;

const _state = {
  undoStack:  [],
  redoStack:  [],
  active:     false,  // true while undo/redo executes → blocks re-recording
  recording:  true,   // false during bulk ops (AI gen, load, clear)
};

// ── Public API ────────────────────────────────────────────────

/**
 * Push a command onto the undo stack.
 * Silently ignored when active (undo/redo in progress) or !recording.
 */
export function pushCommand(command) {
  if (_state.active || !_state.recording) return;
  _state.undoStack.push(command);
  if (_state.undoStack.length > MAX_HISTORY) _state.undoStack.shift();
  _state.redoStack = [];   // new action clears redo
  _updateButtons();
}

/** Execute undo — moves top command to redoStack. */
export function undo() {
  if (_state.undoStack.length === 0) return;
  const cmd = _state.undoStack.pop();
  _state.active = true;
  try { cmd.undo(); } finally { _state.active = false; }
  _state.redoStack.push(cmd);
  _updateButtons();
}

/** Execute redo — moves top command back to undoStack. */
export function redo() {
  if (_state.redoStack.length === 0) return;
  const cmd = _state.redoStack.pop();
  _state.active = true;
  try { cmd.redo(); } finally { _state.active = false; }
  _state.undoStack.push(cmd);
  _updateButtons();
}

/** Is an undo/redo operation currently executing? */
export function isActive() { return _state.active; }

/** Pause recording (call before bulk DOM ops: AI gen, load, clearAll). */
export function pauseRecording() { _state.recording = false; }

/** Resume recording. */
export function resumeRecording() { _state.recording = true; }

/** Clear both stacks (call after bulk ops so stale commands don't linger). */
export function clearHistory() {
  _state.undoStack = [];
  _state.redoStack = [];
  _updateButtons();
}

// ── Command Factory ───────────────────────────────────────────

/**
 * Word-level text change command.
 * @param {HTMLInputElement} inputEl  The input element being edited.
 * @param {string} beforeValue        Value before the word was typed.
 * @param {string} afterValue         Value after the word was typed.
 */
export function makeTextCommand(inputEl, beforeValue, afterValue) {
  // Build a short label from the last word typed
  const lastWord = afterValue.trimEnd().split(/\s+/).pop() || '…';
  return {
    label: `Type "${lastWord}"`,
    undo() {
      if (!inputEl || !document.contains(inputEl)) return;
      inputEl.value = beforeValue;
      inputEl.focus();
      inputEl.setSelectionRange(beforeValue.length, beforeValue.length);
    },
    redo() {
      if (!inputEl || !document.contains(inputEl)) return;
      inputEl.value = afterValue;
      inputEl.focus();
      inputEl.setSelectionRange(afterValue.length, afterValue.length);
    },
  };
}

// ── Private ───────────────────────────────────────────────────

function _updateButtons() {
  const undoBtn = document.getElementById('btnUndo');
  const redoBtn = document.getElementById('btnRedo');

  if (undoBtn) {
    undoBtn.disabled = _state.undoStack.length === 0;
    undoBtn.title = _state.undoStack.length > 0
      ? `Undo: ${_state.undoStack[_state.undoStack.length - 1].label}  (Ctrl+Z)`
      : 'Nothing to undo  (Ctrl+Z)';
  }
  if (redoBtn) {
    redoBtn.disabled = _state.redoStack.length === 0;
    redoBtn.title = _state.redoStack.length > 0
      ? `Redo: ${_state.redoStack[_state.redoStack.length - 1].label}  (Ctrl+Y)`
      : 'Nothing to redo  (Ctrl+Y)';
  }
}
