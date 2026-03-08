// ============================================================
// fileEngine.js — Project Export / Import
// ============================================================
import { AppState, StateManager } from './state.js';
import { saveToLocalStorage } from './storage.js';
import { updateHistoryButtons } from './history.js';
import { showStatus } from './design-system.js';

/**
 * Export the current project as a .json file.
 * @param {string} [projectId] — optional, used in filename
 */
export function exportProject(projectId) {
    try {
        const data = {
            version:    '1.0',
            savedDate:  new Date().toISOString(),
            projectId:  projectId || 'default',
            duties:     JSON.parse(JSON.stringify(AppState.duties)),
            dutyCount:  AppState.dutyCount,
            taskCounts: AppState.taskCounts
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `DACUM_Project_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showStatus('Project exported! ✓', 'success');
    } catch (e) {
        console.error('exportProject error:', e);
        showStatus('Export failed: ' + e.message, 'error');
    }
}

/**
 * Import a project from a .json File object.
 * @param {File} file
 */
export function importProject(file) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data.duties)) {
                AppState.duties     = data.duties;
                AppState.dutyCount  = data.dutyCount  || 0;
                AppState.taskCounts = data.taskCounts || {};
            }
            StateManager.undoStack = [];
            StateManager.redoStack = [];
            saveToLocalStorage();
            updateHistoryButtons();
            // Trigger a re-render via a custom event that app.js can listen to
            document.dispatchEvent(new CustomEvent('projectImported'));
            showStatus('Project imported! ✓', 'success');
        } catch (err) {
            console.error('importProject parse error:', err);
            showStatus('Import failed: Invalid file', 'error');
        }
    };
    reader.readAsText(file);
}
