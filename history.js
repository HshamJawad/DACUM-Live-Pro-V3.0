// ============================================================
// history.js — Command-Pattern Undo/Redo Engine
// ============================================================
// Architecture: each user action is a Command object with
//   execute(), undo(), redo() methods.
// Stacks live on StateManager so they survive any re-import.
// This module NEVER imports Renderer — callers handle re-render.
// ============================================================

import { AppState, StateManager } from './state.js';

const MAX_HISTORY = 200;

// ── Stack helpers ─────────────────────────────────────────────

/** Push a fully-executed command onto the undo stack. */
export function pushCommand(cmd) {
    StateManager.undoStack.push(cmd);
    if (StateManager.undoStack.length > MAX_HISTORY) {
        StateManager.undoStack.shift();
    }
    StateManager.redoStack = [];   // new action invalidates redo history
    updateHistoryButtons();
}

/** Undo the most recent command (no-op if stack is empty). */
export function undo() {
    if (StateManager.undoStack.length === 0) return;
    const cmd = StateManager.undoStack.pop();
    cmd.undo();
    StateManager.redoStack.push(cmd);
    updateHistoryButtons();
    // Caller (EventBinder / window.undo) is responsible for re-rendering.
}

/** Redo the most recently undone command (no-op if stack is empty). */
export function redo() {
    if (StateManager.redoStack.length === 0) return;
    const cmd = StateManager.redoStack.pop();
    (cmd.redo || cmd.execute).call(cmd);
    StateManager.undoStack.push(cmd);
    updateHistoryButtons();
    // Caller is responsible for re-rendering.
}

/** Enable / disable the toolbar Undo and Redo buttons. */
export function updateHistoryButtons() {
    const undoBtn = document.getElementById('undoBtn') || document.getElementById('floatUndoBtn');
    const redoBtn = document.getElementById('redoBtn') || document.getElementById('floatRedoBtn');
    if (undoBtn) undoBtn.disabled = StateManager.undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = StateManager.redoStack.length === 0;
}

/** Wipe both stacks (e.g. after loading a project). */
export function clearHistory() {
    StateManager.undoStack = [];
    StateManager.redoStack = [];
    updateHistoryButtons();
}

// ── Command factories ─────────────────────────────────────────
// Each factory returns a command object { execute, undo, redo }.
// execute() is already called by the action function BEFORE
// pushCommand(), so factories only need to know what happened.

/**
 * Add a duty object that has already been created.
 * @param {{ id:string, title:string, tasks:Array }} dutyObj
 */
export function makeAddDutyCmd(dutyObj) {
    return {
        execute() {
            AppState.duties.push(dutyObj);
        },
        undo() {
            AppState.duties = AppState.duties.filter(d => d.id !== dutyObj.id);
        },
        redo() {
            AppState.duties.push(dutyObj);
        }
    };
}

/**
 * Delete a duty by id.
 * Captures the duty reference and its position on first execute()
 * so undo() can restore it exactly.
 * @param {string} dutyId
 */
export function makeDeleteDutyCmd(dutyId) {
    let _savedDuty  = null;
    let _savedIndex = -1;

    return {
        execute() {
            _savedIndex = AppState.duties.findIndex(d => d.id === dutyId);
            if (_savedIndex === -1) return;
            _savedDuty = AppState.duties[_savedIndex];
            AppState.duties.splice(_savedIndex, 1);
        },
        undo() {
            if (_savedIndex === -1 || !_savedDuty) return;
            AppState.duties.splice(_savedIndex, 0, _savedDuty);
        },
        redo() {
            const idx = AppState.duties.findIndex(d => d.id === dutyId);
            if (idx !== -1) AppState.duties.splice(idx, 1);
        }
    };
}

/**
 * Add a task object to a duty.
 * @param {string} dutyId
 * @param {{ id:string, text:string }} taskObj
 */
export function makeAddTaskCmd(dutyId, taskObj) {
    return {
        execute() {
            const duty = AppState.duties.find(d => d.id === dutyId);
            if (duty) duty.tasks.push(taskObj);
        },
        undo() {
            const duty = AppState.duties.find(d => d.id === dutyId);
            if (duty) duty.tasks = duty.tasks.filter(t => t.id !== taskObj.id);
        },
        redo() {
            const duty = AppState.duties.find(d => d.id === dutyId);
            if (duty) duty.tasks.push(taskObj);
        }
    };
}

/**
 * Delete a task by id.
 * Captures its parent duty, task reference and index on first execute().
 * @param {string} taskId
 */
export function makeDeleteTaskCmd(taskId) {
    let _savedTask  = null;
    let _savedDuty  = null;
    let _savedIndex = -1;

    return {
        execute() {
            for (const duty of AppState.duties) {
                const idx = duty.tasks.findIndex(t => t.id === taskId);
                if (idx !== -1) {
                    _savedDuty  = duty;
                    _savedIndex = idx;
                    _savedTask  = duty.tasks[idx];
                    duty.tasks.splice(idx, 1);
                    break;
                }
            }
        },
        undo() {
            if (!_savedDuty || _savedIndex === -1) return;
            _savedDuty.tasks.splice(_savedIndex, 0, _savedTask);
        },
        redo() {
            if (!_savedDuty) return;
            const idx = _savedDuty.tasks.findIndex(t => t.id === taskId);
            if (idx !== -1) _savedDuty.tasks.splice(idx, 1);
        }
    };
}

/**
 * Edit a duty title (committed on input blur).
 * @param {string} dutyId
 * @param {string} oldVal  — value before the edit
 * @param {string} newVal  — value after the edit
 */
export function makeEditDutyCmd(dutyId, oldVal, newVal) {
    return {
        execute() {
            const duty = AppState.duties.find(d => d.id === dutyId);
            if (duty) duty.title = newVal;
        },
        undo() {
            const duty = AppState.duties.find(d => d.id === dutyId);
            if (duty) duty.title = oldVal;
        },
        redo() {
            const duty = AppState.duties.find(d => d.id === dutyId);
            if (duty) duty.title = newVal;
        }
    };
}

/**
 * Edit a task description (committed on input blur).
 * @param {string} dutyId
 * @param {string} taskId
 * @param {string} oldVal
 * @param {string} newVal
 */
export function makeEditTaskCmd(dutyId, taskId, oldVal, newVal) {
    const _findTask = () => {
        const duty = AppState.duties.find(d => d.id === dutyId);
        return duty ? duty.tasks.find(t => t.id === taskId) : null;
    };
    return {
        execute() { const t = _findTask(); if (t) t.text = newVal; },
        undo()    { const t = _findTask(); if (t) t.text = oldVal; },
        redo()    { const t = _findTask(); if (t) t.text = newVal; }
    };
}

/**
 * Clear all duties (used by clearAll()).
 * Captures the full duty/count/taskCounts state for undo.
 * @param {Array}  duties
 * @param {number} dutyCount
 * @param {object} taskCounts
 */
export function makeClearAllCmd(duties, dutyCount, taskCounts) {
    // Deep-clone the state snapshots at command-creation time
    const _savedDuties     = JSON.parse(JSON.stringify(duties));
    const _savedDutyCount  = dutyCount;
    const _savedTaskCounts = JSON.parse(JSON.stringify(taskCounts));

    return {
        execute() {
            AppState.duties     = [];
            AppState.dutyCount  = 0;
            AppState.taskCounts = {};
        },
        undo() {
            AppState.duties     = JSON.parse(JSON.stringify(_savedDuties));
            AppState.dutyCount  = _savedDutyCount;
            AppState.taskCounts = JSON.parse(JSON.stringify(_savedTaskCounts));
        },
        redo() {
            AppState.duties     = [];
            AppState.dutyCount  = 0;
            AppState.taskCounts = {};
        }
    };
}

// ── Backward-compat shim ──────────────────────────────────────
// The old snapshot-based pushHistory(state) is kept as a no-op
// so any legacy call sites don't throw a ReferenceError.
export function pushHistory() { /* replaced by pushCommand — intentionally empty */ }
