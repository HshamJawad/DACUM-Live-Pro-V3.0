// ============================================================
// /events.js
// All addEventListener calls and delegated event handling.
// ============================================================

import { appState }             from './state.js';
import { addDuty, addTask, removeDuty, removeTask, clearDuty,
         syncDutyTitle, syncTaskText }                       from './duties.js';
import { updateCollectionMode, updateWorkflowMode, updateParticipantCount,
  updatePriorityFormula, updateTVExportMode, updateTrainingLoadMethod,
  loadDutiesForVerification, updateRating, updatePerformsTask, updateComments,
  updateWorkshopCount, validateAndComputeTask, validateAndComputeWorkshopResults,
  toggleDashboard, refreshDashboard, toggleDutyLevelSummary, exportDashboard,
  attachAccordionListeners }    from './tasks.js';
import { bypassToClusteringTab, resetVerificationDecision, initializeClusteringFromTasks,
  updateCreateClusterButton, createCluster, renameCluster, deleteCluster,
  removeTaskFromCluster, addTaskToClusterFromDropdown, updateClusterRange,
  updateClusterCriteria, updateClusterCriteriaFromNumbered,
  handleCriteriaKeydown, initCriteriaNumber, proceedToClusteringFromVerification,
  updateCreateLOButton, createLearningOutcome, toggleEditLO, deleteLearningOutcome,
  reassignPCToLO, unassignPCFromLO,
  updateCreateModuleButton, createModule, renameModule, deleteModule,
  removeLoFromModule, addLoToModuleFromDropdown,
  openModuleBuilderFromMapping, exportModuleMappingJSON }  from './modules.js';
import { showStatus, toggleInfoBox, escapeHtml,
  toggleSkillsLevelSection, addSkillsCategory, removeSkillsCategory,
  updateSkillsCategoryName, addSkillsCompetency, removeSkillsCompetency,
  updateSkillsCompetencyText, handleSkillsLevelChange, resetSkillsLevel,
  toggleEditHeading, clearSection, formatList,
  addCustomSection, removeCustomSection }                  from './renderer.js';
import { exportToPDF, exportToWord,
  exportTaskVerificationPDF, exportTaskVerificationWord }  from './exports.js';
import { clearAll, clearCurrentTab, generateAIDacum }      from './projects.js';
import { handleImageUpload, removeImage }                  from './storage.js';
import { saveToJSON, loadFromJSON }                        from './snapshots.js';
import { lwFinalizeAndCreateSession, lwCopyLink, lwShowQRCode,
  lwCloseQRModal, lwDownloadQRPNG, lwFetchResults,
  lwExportJSON, lwExportCSV, lwExportSnapshot,
  lwCloseVoting, lwExportVerifiedPDF, lwExportVerifiedDOCX }  from './workshop.js';
import { pushHistoryState, undo, redo,
         resetHistoryToCurrentState }                      from './history.js';

// ── Delegation helper ─────────────────────────────────────────

function delegate(container, selector, eventType, handler) {
  if (!container) return;
  container.addEventListener(eventType, function (e) {
    const target = e.target.closest(selector);
    if (target && container.contains(target)) handler(e, target);
  });
}

// ── Setup all events ──────────────────────────────────────────

export function setupEvents() {

  // ── Static buttons ─────────────────────────────────────────

  // Add Duty — push history BEFORE mutation
  _on('btnAddDuty', 'click', () => { pushHistoryState(); addDuty(); });

  _on('btnSaveJSON',  'click', () => saveToJSON());
  _on('btnClearAll',  'click', () => {
    clearAll();
    // clearAll is synchronous (confirm → DOM ops); reset history afterwards
    resetHistoryToCurrentState();
  });
  _on('aiGenerateBtn', 'click', () => {
    generateAIDacum().then(() => resetHistoryToCurrentState())
                     .catch(() => resetHistoryToCurrentState());
  });
  _on('btnExportPDF',  'click', () => exportToPDF());
  _on('btnExportWord', 'click', () => exportToWord());

  // Undo / Redo buttons
  _on('btnUndo', 'click', () => undo());
  _on('btnRedo', 'click', () => redo());

  // Keyboard shortcuts (only active on the Duties & Tasks tab)
  document.addEventListener('keydown', function (e) {
    const dutiesTab = document.getElementById('duties-tab');
    if (!dutiesTab || !dutiesTab.classList.contains('active')) return;
    if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault(); undo();
    }
    if (e.ctrlKey && (e.key.toLowerCase() === 'y' ||
        (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      e.preventDefault(); redo();
    }
  });

  // Task Verification controls
  _onRadioGroup('collectionMode',     () => updateCollectionMode());
  _onRadioGroup('workflowMode',       () => updateWorkflowMode());
  _onRadioGroup('priorityFormula',    () => updatePriorityFormula());
  _onRadioGroup('tvExportMode',       () => updateTVExportMode());
  _onRadioGroup('trainingLoadMethod', () => updateTrainingLoadMethod());
  _on('workshopParticipants',          'change', () => updateParticipantCount());
  _on('btnLoadDutiesForVerification',  'click',  () => loadDutiesForVerification());
  _on('btnValidateAll',                'click',  () => validateAndComputeWorkshopResults());
  _on('btnToggleDashboard',            'click',  () => toggleDashboard());
  _on('btnRefreshDashboard',           'click',  () => refreshDashboard());
  _on('btnToggleDutyLevelSummary',     'click',  () => toggleDutyLevelSummary());
  _on('btnExportDashboard',            'click',  () => exportDashboard());
  _on('btnExportTVPDF',                'click',  () => exportTaskVerificationPDF());
  _on('btnExportTVWord',               'click',  () => exportTaskVerificationWord());

  // Clustering
  _on('btnBypassToClustering',      'click', () => bypassToClusteringTab());
  _on('btnResetDecision',           'click', () => resetVerificationDecision());
  _on('btnProceedToClustering',     'click', () => proceedToClusteringFromVerification());
  _on('btnCreateCluster',           'click', () => createCluster());

  // Learning Outcomes
  _on('btnCreateLO',     'click', () => createLearningOutcome());

  // Module Mapping
  _on('btnCreateModule',        'click', () => createModule());
  _on('btnOpenModuleBuilder',   'click', () => openModuleBuilderFromMapping());
  _on('btnExportModuleMapping', 'click', () => exportModuleMappingJSON());

  // Skills Level
  _on('btnToggleSkillsLevel', 'click', () => toggleSkillsLevelSection());
  _on('btnAddSkillsCategory', 'click', () => addSkillsCategory());
  _on('btnResetSkillsLevel',  'click', () => resetSkillsLevel());

  // Additional Info
  _on('btnAddCustomSection', 'click', () => addCustomSection());
  _on('btnToggleInfoBox',    'click', () => toggleInfoBox());

  // Image upload
  _on('producedForImageInput',  'change', (e) => handleImageUpload(e, 'producedFor'));
  _on('producedByImageInput',   'change', (e) => handleImageUpload(e, 'producedBy'));
  _on('removeProducedForImage', 'click',  () => removeImage('producedFor'));
  _on('removeProducedByImage',  'click',  () => removeImage('producedBy'));

  // JSON Save / Load
  _on('loadFileInput', 'change', (e) => {
    loadFromJSON(e);
    // loadFromJSON is async (FileReader); reset history once file is processed
    setTimeout(resetHistoryToCurrentState, 600);
  });

  // Per-tab clear buttons
  document.querySelectorAll('[data-action="clear-tab"]').forEach(btn => {
    btn.addEventListener('click', function () {
      clearCurrentTab(this.getAttribute('data-tab-id'));
      resetHistoryToCurrentState();
    });
  });

  // Live Workshop
  _on('btnLWFinalize',          'click', () => lwFinalizeAndCreateSession());
  _on('btnLWCopyLink',          'click', () => lwCopyLink());
  _on('btnLWShowQR',            'click', () => lwShowQRCode());
  _on('btnLWFetchResults',      'click', () => lwFetchResults());
  _on('btnLWExportJSON',        'click', () => lwExportJSON());
  _on('btnLWExportCSV',         'click', () => lwExportCSV());
  _on('btnLWExportSnapshot',    'click', () => lwExportSnapshot());
  _on('btnLWCloseVoting',       'click', () => lwCloseVoting());
  _on('btnLWExportVerifiedPDF', 'click', () => lwExportVerifiedPDF());
  _on('btnLWExportVerifiedDOCX','click', () => lwExportVerifiedDOCX());
  _on('btnLWCloseQR',           'click', () => lwCloseQRModal());
  _on('btnLWDownloadQR',        'click', () => lwDownloadQRPNG());

  // ── Delegated events ────────────────────────────────────────

  // ── Duties container ────────────────────────────────────────
  const dutiesCont = document.getElementById('dutiesContainer');
  if (dutiesCont) {

    // Structural clicks — push history BEFORE mutation
    dutiesCont.addEventListener('click', function (e) {
      const target = e.target;

      if (target.matches('[data-action="add-task"]')) {
        pushHistoryState();
        addTask(target.getAttribute('data-duty-id'));

      } else if (target.matches('[data-action="remove-duty"]')) {
        pushHistoryState();
        removeDuty(target.getAttribute('data-duty-id'));

      } else if (target.matches('[data-action="remove-task"]')) {
        pushHistoryState();
        removeTask(target.getAttribute('data-task-div-id'));

      } else if (target.matches('[data-action="clear-duty"]')) {
        // clearDuty has its own confirm() — push history before it runs
        pushHistoryState();
        clearDuty(target.getAttribute('data-duty-id'));
      }
    });

    // ── Word-level text undo (Notion / Word burst model) ──────
    //
    // A "burst" = all keystrokes within a 120 ms window.
    // On the FIRST keystroke of a burst we push the pre-burst state
    // so Undo can jump back to exactly where typing started.
    // After 120 ms of silence the burst resets, letting the next
    // keystroke open a new undo checkpoint.

    let _burstPushed  = false;  // have we already saved the pre-burst state?
    let _burstTimer   = null;

    dutiesCont.addEventListener('focusin', function (e) {
      // Entering an input resets the burst flag so the very first
      // keystroke in this field always creates a new undo checkpoint.
      if (e.target.matches('input[data-duty-id], input[data-task-id]')) {
        clearTimeout(_burstTimer);
        _burstPushed = false;
      }
    });

    dutiesCont.addEventListener('input', function (e) {
      const target = e.target;

      // Only track duty/task text inputs
      if (target.matches('input[data-duty-id]')) {
        syncDutyTitle(target.getAttribute('data-duty-id'), target.value);
      } else if (target.matches('input[data-task-id]')) {
        syncTaskText(target.getAttribute('data-task-id'), target.value);
      } else {
        return;
      }

      // Push the pre-burst snapshot on the very first keystroke of a burst
      if (!_burstPushed) {
        pushHistoryState();
        _burstPushed = true;
      }

      // Reset burst window: 120 ms of silence → next keystroke is a new burst
      clearTimeout(_burstTimer);
      _burstTimer = setTimeout(() => { _burstPushed = false; }, 120);
    });

    dutiesCont.addEventListener('focusout', function (e) {
      // Commit immediately on blur so the state is always current
      // before any subsequent structural action (e.g. clicking Add Task)
      if (e.target.matches('input[data-duty-id], input[data-task-id]')) {
        clearTimeout(_burstTimer);
        _burstPushed = false;
      }
    });
  }

  // ── Verification accordion ──────────────────────────────────
  const verCont = document.getElementById('verificationAccordionContainer');
  if (verCont) {
    verCont.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action  = target.getAttribute('data-action');
      const taskKey = target.getAttribute('data-task-key');
      const dim     = target.getAttribute('data-dimension');
      if (action === 'update-rating')         updateRating(taskKey, dim, target.value);
      else if (action === 'update-performs-task') updatePerformsTask(taskKey, target.value);
      else if (action === 'update-comments')   updateComments(taskKey, target.value);
      else if (action === 'update-workshop-count') {
        updateWorkshopCount(taskKey, dim, target.getAttribute('data-value'), parseInt(target.value));
      } else if (action === 'validate-compute-task') validateAndComputeTask(taskKey);
    });
    verCont.addEventListener('change', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action  = target.getAttribute('data-action');
      const taskKey = target.getAttribute('data-task-key');
      const dim     = target.getAttribute('data-dimension');
      if (action === 'update-rating')             updateRating(taskKey, dim, target.value);
      else if (action === 'update-performs-task') updatePerformsTask(taskKey, target.value);
      else if (action === 'update-comments')       updateComments(taskKey, target.value);
    });
  }

  // ── Clusters container ──────────────────────────────────────
  const clustersCont = document.getElementById('clustersContainer');
  if (clustersCont) {
    clustersCont.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (action === 'rename-cluster')             renameCluster(target.getAttribute('data-cluster-id'));
      else if (action === 'delete-cluster')        deleteCluster(target.getAttribute('data-cluster-id'));
      else if (action === 'remove-task-from-cluster') {
        removeTaskFromCluster(target.getAttribute('data-cluster-id'), parseInt(target.getAttribute('data-task-index')));
      }
    });
    clustersCont.addEventListener('change', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      if (target.getAttribute('data-action') === 'update-cluster-range') {
        updateClusterRange(target.getAttribute('data-cluster-id'), target.value);
      }
    });
    clustersCont.addEventListener('blur', function (e) {
      const target = e.target.closest('[data-action-blur]');
      if (!target) return;
      if (target.getAttribute('data-action-blur') === 'update-cluster-criteria-numbered') {
        updateClusterCriteriaFromNumbered(target.getAttribute('data-cluster-id'), target.value);
      }
    }, true);
    clustersCont.addEventListener('focus', function (e) {
      const target = e.target.closest('[data-action-focus]');
      if (!target) return;
      if (target.getAttribute('data-action-focus') === 'init-criteria-number') {
        initCriteriaNumber(e, target.getAttribute('data-cluster-id'));
      }
    }, true);
    clustersCont.addEventListener('keydown', function (e) {
      const target = e.target.closest('[data-action-keydown]');
      if (!target) return;
      if (target.getAttribute('data-action-keydown') === 'handle-criteria-keydown') {
        handleCriteriaKeydown(e, target.getAttribute('data-cluster-id'));
      }
    });
  }

  // ── Available tasks list ────────────────────────────────────
  const availableTasksList = document.getElementById('availableTasksList');
  if (availableTasksList) {
    availableTasksList.addEventListener('change', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      if (target.getAttribute('data-action') === 'update-cluster-button') {
        updateCreateClusterButton();
      } else if (target.getAttribute('data-action') === 'add-task-to-cluster-dropdown') {
        addTaskToClusterFromDropdown(parseInt(target.getAttribute('data-task-index')), target.value);
        target.value = '';
      }
    });
  }

  // ── PC Source List (LO) ─────────────────────────────────────
  const pcSourceList = document.getElementById('pcSourceList');
  if (pcSourceList) {
    pcSourceList.addEventListener('change', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      if (target.getAttribute('data-action') === 'update-lo-button') {
        updateCreateLOButton();
      } else if (target.getAttribute('data-action') === 'reassign-pc-to-lo') {
        reassignPCToLO(
          target.getAttribute('data-pc-id'),
          parseInt(target.getAttribute('data-cluster')),
          parseInt(target.getAttribute('data-criterion')),
          target.value
        );
        target.value = '';
      }
    });
  }

  // ── LO blocks container ─────────────────────────────────────
  const loBlocksCont = document.getElementById('loBlocksContainer');
  if (loBlocksCont) {
    loBlocksCont.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (action === 'toggle-edit-lo')             toggleEditLO(target.getAttribute('data-lo-id'));
      else if (action === 'delete-lo')             deleteLearningOutcome(target.getAttribute('data-lo-id'));
      else if (action === 'unassign-pc-from-lo')   unassignPCFromLO(target.getAttribute('data-lo-id'), target.getAttribute('data-pc-id'));
    });
  }

  // ── Module LO list ──────────────────────────────────────────
  const moduleLoList = document.getElementById('moduleLoList');
  if (moduleLoList) {
    moduleLoList.addEventListener('change', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      if (target.getAttribute('data-action') === 'update-module-button') {
        updateCreateModuleButton();
      } else if (target.getAttribute('data-action') === 'add-lo-to-module-dropdown') {
        addLoToModuleFromDropdown(target.getAttribute('data-lo-id'), target.value);
        target.value = '';
      }
    });
  }

  // ── Modules container ───────────────────────────────────────
  const modulesCont = document.getElementById('modulesContainer');
  if (modulesCont) {
    modulesCont.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (action === 'rename-module')              renameModule(target.getAttribute('data-module-id'));
      else if (action === 'delete-module')         deleteModule(target.getAttribute('data-module-id'));
      else if (action === 'remove-lo-from-module') removeLoFromModule(target.getAttribute('data-module-id'), target.getAttribute('data-lo-id'));
    });
  }

  // ── Custom sections container ───────────────────────────────
  const customSectCont = document.getElementById('customSectionsContainer');
  if (customSectCont) {
    customSectCont.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (action === 'toggle-edit-heading') {
        toggleEditHeading(target.getAttribute('data-heading-id'));
      } else if (action === 'clear-section') {
        clearSection(
          target.getAttribute('data-input-id'),
          target.getAttribute('data-heading-id'),
          target.getAttribute('data-default-heading')
        );
      } else if (action === 'remove-custom-section') {
        removeCustomSection(target.getAttribute('data-section-id'));
      }
    });
  }

  // ── Skills Level container ──────────────────────────────────
  const skillsCont = document.getElementById('skillsLevelContainer');
  if (skillsCont) {
    skillsCont.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (action === 'remove-skills-category') {
        removeSkillsCategory(parseInt(target.getAttribute('data-cat-index')));
      } else if (action === 'add-skills-competency') {
        addSkillsCompetency(parseInt(target.getAttribute('data-cat-index')));
      } else if (action === 'remove-skills-competency') {
        removeSkillsCompetency(
          parseInt(target.getAttribute('data-cat-index')),
          parseInt(target.getAttribute('data-comp-index'))
        );
      }
    });
    skillsCont.addEventListener('change', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (action === 'update-skills-category-name') {
        updateSkillsCategoryName(parseInt(target.getAttribute('data-cat-index')), target.value);
      } else if (action === 'update-skills-competency-text') {
        updateSkillsCompetencyText(
          parseInt(target.getAttribute('data-cat-index')),
          parseInt(target.getAttribute('data-comp-index')),
          target.value
        );
      } else if (action === 'handle-skills-level-change') {
        handleSkillsLevelChange(
          parseInt(target.getAttribute('data-cat-index')),
          parseInt(target.getAttribute('data-comp-index')),
          target.getAttribute('data-level'),
          target.checked
        );
      }
    });
  }

  // Additional Info static buttons
  _onStaticInfoButtons();
}

// ── Private helpers ───────────────────────────────────────────

function _on(id, event, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
}

function _onRadioGroup(name, handler) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => r.addEventListener('change', handler));
}

function _onStaticInfoButtons() {
  document.querySelectorAll('[data-action="toggle-edit-heading"]').forEach(btn => {
    btn.addEventListener('click', function () {
      toggleEditHeading(this.getAttribute('data-heading-id'));
    });
  });
  document.querySelectorAll('[data-action="clear-section"]').forEach(btn => {
    btn.addEventListener('click', function () {
      clearSection(
        this.getAttribute('data-input-id'),
        this.getAttribute('data-heading-id'),
        this.getAttribute('data-default-heading')
      );
    });
  });
  document.querySelectorAll('[data-action="format-list"]').forEach(btn => {
    btn.addEventListener('click', function () {
      formatList(this.getAttribute('data-input-id'), this.getAttribute('data-format-type'));
    });
  });
}
