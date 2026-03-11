// ============================================================
// /history.js
// Undo / Redo stub.  Reserved for a future Command-Pattern
// implementation (DACUM Live Pro V3.0+).
// ============================================================

/**
 * Push a snapshot to the undo stack.
 * Currently a no-op; will be wired up in V3.0.
 * @param {string} _label  Human-readable description of the action.
 * @param {object} _snapshot  Serialisable state snapshot.
 */
export function pushHistory(_label, _snapshot) {
  // TODO: implement undo stack
}

/** Undo the last action. No-op until implemented. */
export function undo() {
  // TODO
}

/** Redo the last undone action. No-op until implemented. */
export function redo() {
  // TODO
}
