// ============================================================
// /dacum_projects.js
// Multi-Project System for DACUM Live Pro.
//
// Naming note: the existing projects.js owns clearAll/switchTab/
// generateAIDacum — this module uses the name dacum_projects.js
// to avoid any collision.
//
// localStorage key : 'dacum_projects'
// Active project   : 'dacum_active_project'
// Max projects     : 50
// ============================================================

import { appState }           from './state.js';
import { showStatus }         from './renderer.js';
import { syncAllFromDOM }     from './duties.js';
import { renderAll }          from './workshop_snapshots.js';
import { resetHistoryToCurrentState } from './history.js';

const LS_PROJECTS = 'dacum_projects';
const LS_ACTIVE   = 'dacum_active_project';
const MAX_PROJECTS = 50;

let _searchQuery = '';

// ── Public API ────────────────────────────────────────────────

export function createProject(name) {
  const label    = (name || '').trim() || 'Untitled DACUM Project';
  const projects = _loadProjects();
  const id       = `project_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const project = {
    id,
    name:    label,
    created: Date.now(),
    state:   _captureState(),
  };

  projects.push(project);
  if (projects.length > MAX_PROJECTS) projects.splice(0, 1);

  _saveProjects(projects);
  _setActive(id);
  renderProjectsSidebar();
  showStatus(`✅ Project "${label}" created`, 'success');
  return id;
}

export function loadProject(id) {
  const projects = _loadProjects();
  const project  = projects.find(p => p.id === id);
  if (!project) { showStatus('❌ Project not found', 'error'); return; }

  // Auto-save current project before switching
  saveCurrentProject();

  _applyState(project.state);
  renderAll();
  resetHistoryToCurrentState();
  _setActive(id);
  renderProjectsSidebar();
  showStatus(`📂 Loaded: "${project.name}"`, 'success');
}

export function saveCurrentProject() {
  const id = _getActive();
  if (!id) return;
  const projects = _loadProjects();
  const idx      = projects.findIndex(p => p.id === id);
  if (idx === -1) return;
  projects[idx].state     = _captureState();
  projects[idx].lastSaved = Date.now();   // ← timestamp used by crash recovery
  _saveProjects(projects);
}

export function renameProject(id, newName) {
  const label    = (newName || '').trim();
  if (!label) return;
  const projects = _loadProjects();
  const project  = projects.find(p => p.id === id);
  if (!project) return;
  project.name = label;
  _saveProjects(projects);
  renderProjectsSidebar();
  showStatus(`✏️ Renamed to "${label}"`, 'success');
}

export function deleteProject(id) {
  let projects = _loadProjects();
  const project = projects.find(p => p.id === id);
  if (!project) return;
  projects = projects.filter(p => p.id !== id);
  _saveProjects(projects);

  // If deleted project was active, switch to the next available one
  if (_getActive() === id) {
    if (projects.length > 0) {
      loadProject(projects[projects.length - 1].id);
    } else {
      _setActive(null);
    }
  }
  renderProjectsSidebar();
  showStatus(`🗑️ Project deleted`, 'success');
}

export function getProjects() {
  return _loadProjects();
}

export function getActiveProjectId() {
  return _getActive();
}

// ── Sidebar ───────────────────────────────────────────────────

/** Inject sidebar HTML into the page (call once from app.js). */
export function initProjectsSidebar() {
  if (document.getElementById('dacumProjectsSidebar')) return;

  // Sidebar element
  const aside = document.createElement('aside');
  aside.id = 'dacumProjectsSidebar';
  aside.className = 'dps-sidebar dps-expanded';
  aside.innerHTML = `
    <div class="dps-header">
      <span class="dps-title">📁 Projects</span>
      <button class="dps-new-btn" id="dpsNewProject" title="New project">＋ New</button>
    </div>
    <div class="dps-search-wrap">
      <input class="dps-search" id="dpsSearch" type="text"
             placeholder="Search projects…" autocomplete="off">
    </div>
    <div class="dps-list" id="dpsProjectList"></div>
    <button class="dps-toggle" id="dpsToggle" title="Collapse sidebar">◀</button>
  `;

  // Inject CSS
  _injectCSS();

  // Wrap main content so sidebar pushes it
  const app = document.querySelector('.container') || document.body;
  const wrapper = document.createElement('div');
  wrapper.id = 'dacumAppWrapper';
  app.parentNode.insertBefore(wrapper, app);
  wrapper.appendChild(aside);
  wrapper.appendChild(app);

  // Wire events
  document.getElementById('dpsNewProject').addEventListener('click', () => {
    const name = prompt('Project name:', `DACUM Project ${_loadProjects().length + 1}`);
    if (name !== null) createProject(name);
  });

  document.getElementById('dpsSearch').addEventListener('input', function () {
    _searchQuery = this.value.trim().toLowerCase();
    renderProjectsSidebar();
  });

  document.getElementById('dpsToggle').addEventListener('click', _toggleSidebar);

  _positionToggle();
  renderProjectsSidebar();
}

/** Re-render the project list cards. */
export function renderProjectsSidebar() {
  const list = document.getElementById('dpsProjectList');
  if (!list) return;

  const activeId = _getActive();
  let projects   = _loadProjects().slice().reverse(); // newest first

  // Search filter — prefix-first sort
  if (_searchQuery) {
    projects = projects.filter(p => p.name.toLowerCase().includes(_searchQuery));
    projects.sort((a, b) => {
      const aStart = a.name.toLowerCase().startsWith(_searchQuery) ? 0 : 1;
      const bStart = b.name.toLowerCase().startsWith(_searchQuery) ? 0 : 1;
      return aStart - bStart;
    });
  }

  if (projects.length === 0) {
    list.innerHTML = `<p class="dps-empty">${_searchQuery ? 'No matching projects.' : 'No projects yet.<br>Click <strong>＋ New</strong> to start.'}</p>`;
    return;
  }

  list.innerHTML = projects.map(p => {
    const isActive  = p.id === activeId;
    const dutyCount = (p.state?.dutiesData || []).length;
    const taskCount = (p.state?.dutiesData || []).reduce((s, d) => s + (d.tasks?.length || 0), 0);
    const date      = new Date(p.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <div class="dps-card${isActive ? ' dps-active' : ''}" data-project-id="${p.id}">
        <div class="dps-card-body" data-action="load-project" data-project-id="${p.id}">
          <div class="dps-card-name">${_esc(p.name)}</div>
          <div class="dps-card-meta">${date}</div>
          <div class="dps-card-stats">
            <span>📋 ${dutyCount} ${dutyCount === 1 ? 'Duty' : 'Duties'}</span>
            <span>✅ ${taskCount} ${taskCount === 1 ? 'Task' : 'Tasks'}</span>
          </div>
        </div>
        <div class="dps-card-actions">
          <button class="dps-icon-btn dps-rename" data-action="rename-project" data-project-id="${p.id}" title="Rename">✏️</button>
          <button class="dps-icon-btn dps-delete" data-action="delete-project" data-project-id="${p.id}" title="Delete">✕</button>
        </div>
      </div>`;
  }).join('');

  // Delegated click handler (re-attach each render using event delegation on stable parent)
  list.onclick = function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id     = btn.getAttribute('data-project-id');

    if (action === 'load-project') {
      loadProject(id);
    } else if (action === 'rename-project') {
      const proj = _loadProjects().find(p => p.id === id);
      const newName = prompt('New project name:', proj?.name || '');
      if (newName !== null) renameProject(id, newName);
    } else if (action === 'delete-project') {
      const proj = _loadProjects().find(p => p.id === id);
      const confirmed = confirm(
        `Are you sure you want to delete "${proj?.name || 'this project'}"?\n\nThis action cannot be undone.`
      );
      if (confirmed) deleteProject(id);
    }
  };
}

// ── State capture / apply (mirrors workshop_snapshots logic) ──

function _captureState() {
  syncAllFromDOM();

  const chartInfo = {
    dacumDate:       _val('dacumDate'),
    venue:           _val('venue'),
    producedFor:     _val('producedFor'),
    producedBy:      _val('producedBy'),
    occupationTitle: _val('occupationTitle'),
    jobTitle:        _val('jobTitle'),
    sector:          _val('sector'),
    context:         _val('context'),
    facilitators:    _val('facilitators'),
    observers:       _val('observers'),
    panelMembers:    _val('panelMembers'),
  };

  const additionalInfo = {
    headings: {
      knowledge:  _text('knowledgeHeading'),
      skills:     _text('skillsHeading'),
      behaviors:  _text('behaviorsHeading'),
      tools:      _text('toolsHeading'),
      trends:     _text('trendsHeading'),
      acronyms:   _text('acronymsHeading'),
      careerPath: _text('careerPathHeading'),
    },
    content: {
      knowledge:  _val('knowledgeInput'),
      skills:     _val('skillsInput'),
      behaviors:  _val('behaviorsInput'),
      tools:      _val('toolsInput'),
      trends:     _val('trendsInput'),
      acronyms:   _val('acronymsInput'),
      careerPath: _val('careerPathInput'),
    },
    customSections: _captureCustomSections(),
  };

  return JSON.parse(JSON.stringify({
    dutiesData:               appState.dutiesData              || [],
    dutyCount:                appState.dutyCount,
    taskCounts:               appState.taskCounts              || {},
    producedForImage:         appState.producedForImage,
    producedByImage:          appState.producedByImage,
    customSectionCounter:     appState.customSectionCounter,
    skillsLevelData:          appState.skillsLevelData,
    verificationRatings:      appState.verificationRatings     || {},
    taskMetadata:             appState.taskMetadata            || {},
    collectionMode:           appState.collectionMode,
    workflowMode:             appState.workflowMode,
    workshopParticipants:     appState.workshopParticipants,
    priorityFormula:          appState.priorityFormula,
    workshopCounts:           appState.workshopCounts          || {},
    workshopResults:          appState.workshopResults         || {},
    tvExportMode:             appState.tvExportMode,
    trainingLoadMethod:       appState.trainingLoadMethod,
    clusteringData:           appState.clusteringData,
    learningOutcomesData:     appState.learningOutcomesData,
    moduleMappingData:        appState.moduleMappingData,
    verificationDecisionMade: appState.verificationDecisionMade,
    clusteringAllowed:        appState.clusteringAllowed,
    _chartInfo:               chartInfo,
    _additionalInfo:          additionalInfo,
  }));
}

function _applyState(s) {
  if (!s) return;
  appState.dutiesData               = s.dutiesData               || [];
  appState.dutyCount                = s.dutyCount                || 0;
  appState.taskCounts               = s.taskCounts               || {};
  appState.producedForImage         = s.producedForImage         || null;
  appState.producedByImage          = s.producedByImage          || null;
  appState.customSectionCounter     = s.customSectionCounter     || 0;
  appState.skillsLevelData          = s.skillsLevelData;
  appState.verificationRatings      = s.verificationRatings      || {};
  appState.taskMetadata             = s.taskMetadata             || {};
  appState.collectionMode           = s.collectionMode           || 'workshop';
  appState.workflowMode             = s.workflowMode             || 'standard';
  appState.workshopParticipants     = s.workshopParticipants     || 10;
  appState.priorityFormula          = s.priorityFormula          || 'if';
  appState.workshopCounts           = s.workshopCounts           || {};
  appState.workshopResults          = s.workshopResults          || {};
  appState.tvExportMode             = s.tvExportMode             || 'appendix';
  appState.trainingLoadMethod       = s.trainingLoadMethod       || 'advanced';
  appState.clusteringData           = s.clusteringData           || { clusters: [], availableTasks: [], clusterCounter: 0 };
  appState.learningOutcomesData     = s.learningOutcomesData     || { outcomes: [], outcomeCounter: 0 };
  appState.moduleMappingData        = s.moduleMappingData        || { modules: [], moduleCounter: 0 };
  appState.verificationDecisionMade = s.verificationDecisionMade || false;
  appState.clusteringAllowed        = s.clusteringAllowed        || false;
  appState._chartInfo               = s._chartInfo               || {};
  appState._additionalInfo          = s._additionalInfo          || {};
}

// ── localStorage ──────────────────────────────────────────────

function _loadProjects() {
  try { return JSON.parse(localStorage.getItem(LS_PROJECTS) || '[]'); }
  catch { return []; }
}

function _saveProjects(list) {
  try { localStorage.setItem(LS_PROJECTS, JSON.stringify(list)); }
  catch {
    showStatus('⚠️ Storage full — oldest project removed.', 'error');
    list.splice(0, 1);
    try { localStorage.setItem(LS_PROJECTS, JSON.stringify(list)); } catch {}
  }
}

function _getActive()      { return localStorage.getItem(LS_ACTIVE) || null; }
function _setActive(id)    { id ? localStorage.setItem(LS_ACTIVE, id) : localStorage.removeItem(LS_ACTIVE); }

// ── Sidebar toggle ────────────────────────────────────────────

function _toggleSidebar() {
  const sb      = document.getElementById('dacumProjectsSidebar');
  const wrapper = document.getElementById('dacumAppWrapper');
  const btn     = document.getElementById('dpsToggle');
  if (!sb) return;
  const collapsed = sb.classList.toggle('dps-collapsed');
  if (wrapper) wrapper.classList.toggle('dps-is-collapsed', collapsed);
  if (btn) btn.textContent = collapsed ? '▶' : '◀';
  _positionToggle();
}

function _positionToggle() {
  const sb  = document.getElementById('dacumProjectsSidebar');
  const btn = document.getElementById('dpsToggle');
  if (!sb || !btn) return;
  const collapsed = sb.classList.contains('dps-collapsed');
  btn.style.left = (collapsed ? 48 : 260) + 'px';
}

// ── DOM capture helpers ───────────────────────────────────────

function _captureCustomSections() {
  const sections = [];
  document.querySelectorAll('#customSectionsContainer .section-container').forEach(div => {
    const heading  = div.querySelector('h3');
    const textarea = div.querySelector('textarea');
    if (heading && textarea) sections.push({ heading: heading.textContent, content: textarea.value });
  });
  return sections;
}

function _val(id)  { const el = document.getElementById(id); return el ? el.value : ''; }
function _text(id) { const el = document.getElementById(id); return el ? el.textContent : ''; }

function _esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── CSS injection ─────────────────────────────────────────────

function _injectCSS() {
  if (document.getElementById('dps-styles')) return;
  const style = document.createElement('style');
  style.id = 'dps-styles';
  style.textContent = `
/* ── Layout root ── */
#dacumAppWrapper {
  display: block;
  width: 100%;
}

/* Main container shifts right to make room for fixed sidebar */
#dacumAppWrapper > .container {
  margin-left: 260px;
  transition: margin-left 0.25s ease;
  min-width: 0;
  overflow-x: hidden;
}
#dacumAppWrapper.dps-is-collapsed > .container {
  margin-left: 48px;
}

/* Tabs wrap instead of overflow */
.tabs {
  flex-wrap: wrap !important;
  overflow-x: visible !important;
}

/* ── Sidebar — fully fixed, full height below toolbar ── */
.dps-sidebar {
  position: fixed;
  top: 56px;
  left: 0;
  width: 260px;
  height: calc(100vh - 56px);
  overflow-y: auto;
  overflow-x: hidden;
  background: #1e1e2e;
  color: #cdd6f4;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  z-index: 300;
  box-shadow: 2px 0 16px rgba(0,0,0,0.3);
  scrollbar-width: thin;
  scrollbar-color: #45475a transparent;
}
.dps-collapsed { width: 48px !important; }

/* ── Header ── */
.dps-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px 10px;
  border-bottom: 1px solid #313244;
  gap: 8px;
  min-height: 52px;
  flex-shrink: 0;
}
.dps-title {
  font-size: 0.92em;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  color: #cba6f7;
  letter-spacing: 0.03em;
}
.dps-collapsed .dps-title,
.dps-collapsed .dps-search-wrap,
.dps-collapsed .dps-list,
.dps-collapsed .dps-new-btn { display: none; }

/* ── New button ── */
.dps-new-btn {
  background: #cba6f7;
  color: #1e1e2e;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.8em;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
}
.dps-new-btn:hover { background: #b4a1e8; }

/* ── Search ── */
.dps-search-wrap { padding: 8px 10px 4px; flex-shrink: 0; }
.dps-search {
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #313244;
  background: #181825;
  color: #cdd6f4;
  font-size: 0.83em;
  outline: none;
  box-sizing: border-box;
}
.dps-search:focus { border-color: #cba6f7; }

/* ── List ── */
.dps-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px 8px 16px;
  scrollbar-width: thin;
  scrollbar-color: #45475a transparent;
}
.dps-empty {
  color: #6c7086;
  font-size: 0.82em;
  text-align: center;
  padding: 20px 8px;
  line-height: 1.6;
}

/* ── Cards ── */
.dps-card {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  border-radius: 8px;
  border: 1px solid #313244;
  margin-bottom: 7px;
  background: #181825;
  transition: background 0.15s, border-color 0.15s;
  cursor: pointer;
}
.dps-card:hover         { background: #26263a; border-color: #45475a; }
.dps-card.dps-active    { background: #2a273f; border-color: #cba6f7; }
.dps-card-body          { flex: 1; padding: 9px 10px; min-width: 0; }
.dps-card-name {
  font-size: 0.88em;
  font-weight: 600;
  color: #cdd6f4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dps-active .dps-card-name { color: #cba6f7; }
.dps-card-meta  { font-size: 0.74em; color: #6c7086; margin-top: 2px; }
.dps-card-stats {
  display: flex;
  gap: 8px;
  margin-top: 5px;
  font-size: 0.74em;
  color: #a6adc8;
}

/* ── Card action buttons ── */
.dps-card-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 6px 6px 0;
  opacity: 0;
  transition: opacity 0.15s;
}
.dps-card:hover .dps-card-actions { opacity: 1; }
.dps-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 4px;
  font-size: 0.8em;
  transition: background 0.12s;
}
.dps-rename:hover { background: #313244; }
.dps-delete:hover { background: #3e2a2a; color: #f38ba8; }

/* ── Toggle button — fixed, always on the right edge of the sidebar ── */
#dpsToggle {
  position: fixed;
  top: 50vh;
  transform: translateY(-50%);
  left: 260px;
  background: #45475a;
  color: #cdd6f4;
  border: none;
  border-radius: 0 6px 6px 0;
  width: 16px;
  height: 48px;
  padding: 0;
  font-size: 0.65em;
  cursor: pointer;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, left 0.25s ease;
}
#dpsToggle:hover { background: #cba6f7; color: #1e1e2e; }
`;
  document.head.appendChild(style);
}
