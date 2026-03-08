// history.js
// Undo/redo functionality for state changes.

const MAX_HISTORY = 200;

let undoStack = [];
let redoStack = [];

/**
 * Deep-clone a state object safely.
 * @param {object} state
 * @returns {object}
 */
function cloneState(state) {
    try {
        return JSON.parse(JSON.stringify(state));
    } catch {
        return { ...state };
    }
}

/**
 * Push a snapshot of the current state onto the undo stack.
 * Clears the redo stack (new action invalidates future).
 * @param {object} state - The current application state.
 * @returns {object} The same state (unchanged).
 */
function pushHistory(state) {
    undoStack.push(cloneState(state));
    if (undoStack.length > MAX_HISTORY) {
        undoStack.shift();
    }
    redoStack = [];
    return state;
}

/**
 * Undo the last state change.
 * Pushes the current state to redoStack and returns the previous state.
 * @param {object} state - The current application state.
 * @returns {object} The restored previous state, or the current state if nothing to undo.
 */
function undo(state) {
    if (undoStack.length === 0) return state;
    redoStack.push(cloneState(state));
    return undoStack.pop();
}

/**
 * Redo the last undone state change.
 * Pushes the current state to undoStack and returns the next state.
 * @param {object} state - The current application state.
 * @returns {object} The restored next state, or the current state if nothing to redo.
 */
function redo(state) {
    if (redoStack.length === 0) return state;
    undoStack.push(cloneState(state));
    return redoStack.pop();
}

/**
 * Clear both undo and redo stacks entirely.
 */
function clearHistory() {
    undoStack = [];
    redoStack = [];
}

/**
 * Return the current stack sizes (useful for enabling/disabling UI buttons).
 * @returns {{ undoCount: number, redoCount: number }}
 */
function getHistoryStatus() {
    return {
        undoCount: undoStack.length,
        redoCount: redoStack.length,
    };
}

export { pushHistory, undo, redo, clearHistory, getHistoryStatus };
