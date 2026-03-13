// ============================================================
// /duties.js
// Duty / Task creation, removal, and DOM management.
//
// Architecture: ALL mutations go to appState.dutiesData FIRST,
// then renderDutiesFromState() rebuilds the DOM from state.
// History pushes are NOT done here — that is the caller's job
// (events.js), keeping concerns cleanly separated.
// ============================================================

import { appState }  from './state.js';
import { showStatus } from './renderer.js';

// ── DOM Renderer ──────────────────────────────────────────────

/**
 * Rebuild the entire dutiesContainer from appState.dutiesData.
 * Called after every state mutation and after every undo/redo.
 */
export function renderDutiesFromState() {
  const container = document.getElementById('dutiesContainer');
  if (!container) return;

  container.innerHTML = '';

  (appState.dutiesData || []).forEach(duty => {
    const dutyDiv = document.createElement('div');
    dutyDiv.className = 'duty-row';
    dutyDiv.id = duty.id;
    dutyDiv.innerHTML = `
      <div class="duty-header">
        <h4>Duty ${duty.num}</h4>
        <div style="display:flex;gap:10px;">
          <button class="btn-clear-section" data-action="clear-duty"   data-duty-id="${duty.id}">🗑️ Clear</button>
          <button class="btn-remove"         data-action="remove-duty"  data-duty-id="${duty.id}">🗑️ Remove Duty</button>
        </div>
      </div>
      <input type="text" placeholder="Enter duty description"
             data-duty-id="${duty.id}" value="${_esc(duty.title)}">
      <div class="task-list" id="tasks_${duty.id}"></div>
      <button class="btn-add" data-action="add-task" data-duty-id="${duty.id}">➕ Add Task</button>
    `;
    container.appendChild(dutyDiv);

    const taskList = document.getElementById(`tasks_${duty.id}`);
    duty.tasks.forEach(task => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task-item';
      taskDiv.id = task.divId;
      taskDiv.innerHTML = `
        <span class="task-label">Task ${task.num}:</span>
        <input type="text" style="flex:1;" placeholder="Enter task description"
               data-task-id="${task.inputId}" value="${_esc(task.text)}">
        <button class="btn-remove" data-action="remove-task" data-task-div-id="${task.divId}">🗑️</button>
      `;
      taskList.appendChild(taskDiv);
    });
  });
}

// ── State sync helpers (called from events.js input handler) ──

/**
 * Sync a duty title from a live DOM input value into appState.
 * Called on every `input` event — keeps state current without re-rendering.
 */
export function syncDutyTitle(dutyId, value) {
  const duty = (appState.dutiesData || []).find(d => d.id === dutyId);
  if (duty) duty.title = value;
}

/**
 * Sync a task text from a live DOM input value into appState.
 * taskInputId = the data-task-id attribute value (e.g. "duty_1_2").
 */
export function syncTaskText(taskInputId, value) {
  for (const duty of (appState.dutiesData || [])) {
    const task = duty.tasks.find(t => t.inputId === taskInputId);
    if (task) { task.text = value; return; }
  }
}

/**
 * Walk every visible duty/task input in the DOM and flush values
 * into appState.dutiesData.  Call this before any structural mutation
 * (removeDuty, removeTask, clearDuty) and before saveSnapshot,
 * so state is always the source of truth.
 */
export function syncAllFromDOM() {
  document.querySelectorAll('input[data-duty-id]').forEach(inp => {
    syncDutyTitle(inp.getAttribute('data-duty-id'), inp.value);
  });
  document.querySelectorAll('input[data-task-id]').forEach(inp => {
    syncTaskText(inp.getAttribute('data-task-id'), inp.value);
  });
}

// ── Structural mutations (pure state + re-render, NO history) ─

export function addDuty() {
  // When dutyCount is 0 the state is being reset (clearAll / loadJSON);
  // start dutiesData fresh so stale entries don't bleed through.
  if (appState.dutyCount === 0) appState.dutiesData = [];

  appState.dutyCount++;
  const dutyId = `duty_${appState.dutyCount}`;
  appState.dutiesData.push({
    id:    dutyId,
    num:   appState.dutyCount,
    title: '',
    tasks: [],
  });
  renderDutiesFromState();
}

export function removeDuty(dutyId) {
  syncAllFromDOM();
  appState.dutiesData = (appState.dutiesData || []).filter(d => d.id !== dutyId);
  renderDutiesFromState();
}

export function addTask(dutyId) {
  if (!appState.taskCounts[dutyId]) appState.taskCounts[dutyId] = 0;
  appState.taskCounts[dutyId]++;
  const n       = appState.taskCounts[dutyId];
  const divId   = `task_${dutyId}_${n}`;
  const inputId = `${dutyId}_${n}`;

  const duty = (appState.dutiesData || []).find(d => d.id === dutyId);
  if (duty) duty.tasks.push({ divId, inputId, num: n, text: '' });

  renderDutiesFromState();
}

export function removeTask(taskDivId) {
  syncAllFromDOM();
  for (const duty of (appState.dutiesData || [])) {
    const idx = duty.tasks.findIndex(t => t.divId === taskDivId);
    if (idx !== -1) { duty.tasks.splice(idx, 1); break; }
  }
  renderDutiesFromState();
}

export function clearDuty(dutyId) {
  if (!confirm('Are you sure you want to clear this duty and all its tasks?')) return;
  syncAllFromDOM();
  const duty = (appState.dutiesData || []).find(d => d.id === dutyId);
  if (duty) { duty.title = ''; duty.tasks = []; }
  appState.taskCounts[dutyId] = 0;
  renderDutiesFromState();
  showStatus('Duty cleared! ✓', 'success');
}

// ── Utility (unchanged public API) ───────────────────────────

/** Convert "duty_2_3" → "Task B3" */
export function getTaskCode(taskId) {
  const parts = taskId.split('_');
  if (parts.length >= 3) {
    const dutyLetter = String.fromCharCode(64 + parseInt(parts[1]));
    return `Task ${dutyLetter}${parts[2]}`;
  }
  return '';
}

/**
 * Extract all duties and tasks as a plain object.
 * Reads from appState.dutiesData (always in sync with DOM).
 * Returns { dutyId: { title, tasks: [{id, text}] } }
 */
export function extractDutiesAndTasks() {
  const result = {};
  for (const duty of (appState.dutiesData || [])) {
    const tasks = duty.tasks
      .filter(t => t.text.trim())
      .map(t => ({ id: t.inputId, text: t.text }));
    if (duty.title.trim() || tasks.length > 0) {
      result[duty.id] = { title: duty.title, tasks };
    }
  }
  return result;
}

// ── Private helpers ───────────────────────────────────────────

function _esc(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
