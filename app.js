// ============================================================
// app.js — Application Entry Point
// ============================================================
// Imports all modules, wires actions into renderer, exposes
// every function that index.html calls via onclick="" to window.
// ============================================================

import { AppState, StateManager } from './state.js';
import { Renderer, setRendererActions } from './renderer.js';
import { EventBinder,
         addDuty, removeDuty, addTask, removeTask, clearDuty, cvAddDuty,
         toggleCardView, _applyCardViewDOM,
         clearAll,
         handleImageUpload, removeImage,
         toggleInfoBox, toggleEditHeading, clearSection,
         addCustomSection, removeCustomSection,
         saveToJSON, loadFromJSON,
         exportToWord, exportToPDF,
         exportProjectFile, importProjectFile,
         getActiveTabId, restoreActiveTab } from './events.js';
import { undo, redo, updateHistoryButtons, clearHistory } from './history.js';
import { loadFromLocalStorage, saveToLocalStorage } from './storage.js';

// ── Wire renderer action callbacks ───────────────────────────
setRendererActions({ addDuty, removeDuty, addTask, removeTask, clearDuty });

// ── Expose all functions called by index.html onclick= ───────
Object.assign(window, {
    // Duties & tasks
    addDuty, removeDuty, addTask, removeTask, clearDuty, cvAddDuty,

    // View toggle
    toggleCardView,

    // Undo / Redo (buttons in toolbar use onclick="undo()" / onclick="redo()")
    undo:  () => { undo();  Renderer.renderAll(StateManager.state); updateHistoryButtons(); restoreActiveTab(); },
    redo:  () => { redo();  Renderer.renderAll(StateManager.state); updateHistoryButtons(); restoreActiveTab(); },

    // Toolbar / UI
    toggleInfoBox,
    toggleEditHeading,
    clearSection,
    addCustomSection,
    removeCustomSection,

    // Images
    handleImageUpload,
    removeImage,

    // Save / Load JSON
    saveToJSON,
    loadFromJSON,

    // Exports
    exportToPDF,
    exportToWord,

    // Project file engine
    exportProjectFile,
    importProjectFile,

    // Clear all
    clearAll,

    // Snapshot panel (stub — extend later if needed)
    toggleSnapshotPanel() {
        const panel = document.getElementById('snapshotPanel');
        if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    },
    promptSnapshot() {
        const name = prompt('Enter snapshot name:');
        if (name) {
            saveToLocalStorage();
            window.toggleSnapshotPanel && window.toggleSnapshotPanel();
        }
    },

    // Project manager (sidebar stubs — extend later)
    pmNewProject() {
        if (!confirm('Start a new project? Unsaved changes will be lost.')) return;
        clearAll();
    },
    pmToggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const icon    = document.getElementById('sidebarToggleIcon');
        const wrapper = document.getElementById('appWrapper');
        if (!sidebar) return;
        const isOpen = sidebar.classList.toggle('open');
        if (icon)    icon.textContent = isOpen ? '◀' : '▶';
        if (wrapper) wrapper.classList.toggle('sidebar-open', isOpen);
    }
});

// ── Sync DOM visibility for card / table view ─────────────────
function _syncViewDOM(isCardView) {
    _applyCardViewDOM(isCardView);
}

// ── Initialise ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Restore persisted duties from localStorage (if any)
    const restored = loadFromLocalStorage();
    if (!restored || AppState.duties.length === 0) {
        // Bootstrap with one blank duty + one blank task
        AppState.dutyCount = 1;
        const initDutyId = 'duty_1';
        AppState.taskCounts[initDutyId] = 1;
        AppState.duties.push({
            id:    initDutyId,
            title: '',
            tasks: [{ id: 'task_duty_1_1', text: '' }]
        });
    }

    // Apply saved view preference
    const savedView = localStorage.getItem('preferredView');
    if (savedView === 'card') {
        AppState.isCardView = true;
        _syncViewDOM(true);
    } else {
        _syncViewDOM(false);
    }

    updateHistoryButtons();
    Renderer.renderAll(StateManager.state);

    // Bind all event listeners
    EventBinder.init();

    // Re-render if a project was imported via fileEngine
    document.addEventListener('projectImported', () => {
        Renderer.renderAll(StateManager.state);
        restoreActiveTab();
    });
});
