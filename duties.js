// ============================================================
// src/features/duties.js
// Duty / Task creation, removal, and DOM management.
// ============================================================

import { appState } from './state.js';
import { showStatus } from './renderer.js';

// ── Duty Management ───────────────────────────────────────────

export function addDuty() {
  appState.dutyCount++;
  const dutyId = `duty_${appState.dutyCount}`;
  const dutyDiv = document.createElement('div');
  dutyDiv.className = 'duty-row';
  dutyDiv.id = dutyId;
  dutyDiv.innerHTML = `
    <div class="duty-header">
      <h4>Duty ${appState.dutyCount}</h4>
      <div style="display:flex;gap:10px;">
        <button class="btn-clear-section" data-action="clear-duty" data-duty-id="${dutyId}">🗑️ Clear</button>
        <button class="btn-remove" data-action="remove-duty" data-duty-id="${dutyId}">🗑️ Remove Duty</button>
      </div>
    </div>
    <input type="text" placeholder="Enter duty description" data-duty-id="${dutyId}">
    <div class="task-list" id="tasks_${dutyId}"></div>
    <button class="btn-add" data-action="add-task" data-duty-id="${dutyId}">➕ Add Task</button>
  `;
  document.getElementById('dutiesContainer').appendChild(dutyDiv);
}

export function removeDuty(dutyId) {
  const el = document.getElementById(dutyId);
  if (el) el.remove();
}

// ── Task Management ───────────────────────────────────────────

export function addTask(dutyId) {
  if (!appState.taskCounts[dutyId]) appState.taskCounts[dutyId] = 0;
  appState.taskCounts[dutyId]++;
  const taskNum = appState.taskCounts[dutyId];
  const taskDivId = `task_${dutyId}_${taskNum}`;
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task-item';
  taskDiv.id = taskDivId;
  taskDiv.innerHTML = `
    <span class="task-label">Task ${taskNum}:</span>
    <input type="text" style="flex:1;" placeholder="Enter task description" data-task-id="${dutyId}_${taskNum}">
    <button class="btn-remove" data-action="remove-task" data-task-div-id="${taskDivId}">🗑️</button>
  `;
  document.getElementById(`tasks_${dutyId}`).appendChild(taskDiv);
}

export function removeTask(taskDivId) {
  const el = document.getElementById(taskDivId);
  if (el) el.remove();
}

// ── Utility ───────────────────────────────────────────────────

/**
 * Convert a raw task ID like "duty_2_3" to a display code "Task B3".
 */
export function getTaskCode(taskId) {
  const parts = taskId.split('_');
  if (parts.length >= 3) {
    const dutyNum = parseInt(parts[1]);
    const taskNum = parts[2];
    const dutyLetter = String.fromCharCode(64 + dutyNum); // 1→A, 2→B …
    return `Task ${dutyLetter}${taskNum}`;
  }
  return '';
}

/**
 * Extract all duties and tasks from the current DOM state.
 * Returns { dutyId: { title, tasks: [{id, text}] } }
 */
export function extractDutiesAndTasks() {
  const duties = {};
  document.querySelectorAll('.duty-row').forEach(dutyContainer => {
    const dutyId = dutyContainer.id;
    const dutyInput = dutyContainer.querySelector(`input[data-duty-id="${dutyId}"]`);
    const dutyTitle = dutyInput ? dutyInput.value.trim() : '';
    if (!dutyTitle) return;

    const tasks = [];
    dutyContainer.querySelectorAll(`input[data-task-id^="${dutyId}_"]`).forEach(taskInput => {
      const taskText = taskInput.value.trim();
      if (taskText) {
        tasks.push({ id: taskInput.getAttribute('data-task-id'), text: taskText });
      }
    });

    if (tasks.length > 0) {
      duties[dutyId] = { title: dutyTitle, tasks };
    }
  });
  return duties;
}

// ── Clear Duty ────────────────────────────────────────────────

export function clearDuty(dutyId) {
  if (confirm('Are you sure you want to clear this duty and all its tasks?')) {
    const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
    if (dutyInput) dutyInput.value = '';
    document.querySelectorAll(`[data-task-id^="${dutyId}_"]`).forEach(ti => { ti.value = ''; });
    showStatus('Duty cleared! ✓', 'success');
  }
}
