// events.js
// All DOM event listeners (DOMContentLoaded, tab clicks, button wiring).
import { state } from './state.js';
import { renderSkillsLevel, updateUsageBadge, addDuty, addTask,
         loadDutiesForVerification, initializeClusteringFromTasks,
         renderPCSourceList, renderLearningOutcomes,
         renderModuleLoList, renderModules, exportToPDF,
         updateCollectionMode, updateWorkflowMode } from './renderer.js';

document.addEventListener('DOMContentLoaded', function() {
    renderSkillsLevel();
});

window.addEventListener('DOMContentLoaded', function() {
    updateUsageBadge();
});

window.addEventListener('DOMContentLoaded', function() {
    addDuty();
    const currentDutyId = `duty_${state.dutyCount}`;
    addTask(currentDutyId);
});

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to verification tab
    const verificationTab = document.querySelector('[data-tab="verification-tab"]');
    if (verificationTab) {
        verificationTab.addEventListener('click', function() {
            // Auto-load duties when tab is opened for the first time
            const container = document.getElementById('verificationAccordionContainer');
            if (container && container.children.length === 0) {
                loadDutiesForVerification();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.querySelector('.btn-export');
    
    exportButton.addEventListener('click', exportToPDF);
});

window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('lwsession');
    
    if (sessionParam) {
        // Participant mode - redirect to separate participant file
        // Get directory path without filename
        const currentPath = window.location.pathname;
        const directory = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const participantFileUrl = window.location.origin + directory + 'DACUM_LiveWorkshop_Participant.html';
        const redirectUrl = `${participantFileUrl}?lwsession=${sessionParam}`;
        
        // Redirect to participant page
        window.location.href = redirectUrl;
    } else {
        // Facilitator mode - check and show Live Workshop section
        setTimeout(function() { window.lwCheckAndShowSection && window.lwCheckAndShowSection(); }, 100);
    }
});

// ===== END LIVE WORKSHOP MODULE =====

document.addEventListener('DOMContentLoaded', function() {
    const clusteringTab = document.querySelector('[data-tab="clustering-tab"]');
    if (clusteringTab) {
        clusteringTab.addEventListener('click', function() {
            if (state.clusteringData.availableTasks.length === 0 && state.clusteringData.clusters.length === 0) {
                initializeClusteringFromTasks();
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const loTab = document.querySelector('[data-tab="learning-outcomes-tab"]');
    if (loTab) {
        loTab.addEventListener('click', function() {
            renderPCSourceList();
            renderLearningOutcomes();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const moduleTab = document.querySelector('[data-tab="module-mapping-tab"]');
    if (moduleTab) {
        moduleTab.addEventListener('click', function() {
            renderModuleLoList();
            renderModules();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Add initial duty with one task if duties container is empty
    const dutiesContainer = document.getElementById('dutiesContainer');
    if (dutiesContainer && dutiesContainer.children.length === 0) {
        addDuty();
    }
    
    // Initialize Task Verification controls based on default mode selections
    updateCollectionMode();
    updateWorkflowMode();
});


