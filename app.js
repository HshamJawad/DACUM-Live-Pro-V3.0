// app.js
// Application bootstrap. Imports all modules and exposes public functions
// to the global window object so that inline HTML onclick handlers work.
import { state } from './state.js';
import * as renderer from './renderer.js';
import * as storage from './storage.js';
import * as api from './api.js';
import {
    EventBinder,
    addDuty, removeDuty, addTask, removeTask,
    clearDuty, clearAll, toggleCardView, cvAddDuty,
    handleImageUpload, removeImage,
    addCustomSection, removeCustomSection,
    toggleEditHeading, clearSection,
    saveToJSON, loadFromJSON,
    exportToWord, exportToPDF,
    toggleInfoBox,
    exportProjectFile, importProjectFile
} from './events.js';

// ─── Expose all renderer / storage / api functions to window ────────────────
Object.assign(window, renderer);
Object.assign(window, storage);
Object.assign(window, api);

// Expose state for any legacy inline references
window.state = state;

// ─── Override duty/task functions with command-pattern versions ──────────────
// renderer.js versions do direct DOM manipulation and don't push to the
// undo stack.  The events.js versions use the command pattern so undo/redo
// works correctly.  These assignments MUST come after Object.assign(window,
// renderer) so they win the race.
Object.assign(window, {
    addDuty, removeDuty, addTask, removeTask,
    clearDuty, clearAll, toggleCardView, cvAddDuty,
    handleImageUpload, removeImage,
    addCustomSection, removeCustomSection,
    toggleEditHeading, clearSection,
    saveToJSON, loadFromJSON,
    exportToWord, exportToPDF,
    toggleInfoBox,
    exportProjectFile, importProjectFile
});

// ─── Override updateCollectionMode to include Live Workshop section toggle ───
const _origUpdateCollectionMode = window.updateCollectionMode;
window.updateCollectionMode = function() {
    if (_origUpdateCollectionMode) _origUpdateCollectionMode();
    window.lwCheckAndShowSection();
};

// ─── Initialise event bindings (tabs, keyboard shortcuts, undo/redo) ─────────
document.addEventListener('DOMContentLoaded', () => {
    EventBinder.init();
});
