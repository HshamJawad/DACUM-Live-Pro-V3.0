// ============================================================
// /app.js
// Application entry point — wires everything together on DOMContentLoaded.
// ============================================================

import { appState }          from './state.js';
import { renderSkillsLevel } from './renderer.js';
import { updateUsageBadge }  from './storage.js';
import { setupTabs }         from './tabs.js';
import { setupEvents }       from './events.js';
import { switchTab }         from './projects.js';
import { addDuty, addTask }  from './duties.js';
import { updateCollectionMode, updateWorkflowMode, updateDutyLevelSummary } from './tasks.js';
import { lwCheckAndShowSection } from './workshop.js';
import { setBaseline }       from './history.js';
import { renderSnapshotPanel } from './workshop_snapshots.js';

// Expose switchTab globally (called from HTML onclick and live workshop guards)
window.switchTab = switchTab;
window.updateDutyLevelSummary = updateDutyLevelSummary;

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Skills Level Matrix
  renderSkillsLevel();

  // Initialize usage badge
  updateUsageBadge();

  // Wire tabs
  setupTabs();

  // Wire all event listeners
  setupEvents();

  // Add initial duty + task if duties container is empty
  const dutiesContainer = document.getElementById('dutiesContainer');
  if (dutiesContainer && dutiesContainer.children.length === 0) {
    addDuty();
    addTask(`duty_${appState.dutyCount}`);
  }

  // Anchor the history baseline
  setBaseline();

  // Render saved snapshots panel
  renderSnapshotPanel();

  // Initialize Task Verification controls
  updateCollectionMode();
  updateWorkflowMode();

  // Check Live Workshop section visibility
  const urlParams = new URLSearchParams(window.location.search);
  const sessionParam = urlParams.get('lwsession');
  if (sessionParam) {
    // Participant mode – redirect
    const currentPath = window.location.pathname;
    const directory   = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    const participantFileUrl = window.location.origin + directory + 'DACUM_LiveWorkshop_Participant.html';
    window.location.href = `${participantFileUrl}?lwsession=${sessionParam}`;
  } else {
    setTimeout(lwCheckAndShowSection, 100);
  }
});
