// renderer.js
// All DOM rendering, UI update functions, export functions.
// No external API calls — those live in api.js.
import { state } from './state.js';
// --- UNDO/REDO INTEGRATION ---
import { pushHistory } from './history.js';
// --- END UNDO/REDO INTEGRATION ---

function toggleSkillsLevelSection() {
    const header = document.querySelector('.skills-level-header');
    const content = document.getElementById('skillsLevelContent');
    
    header.classList.toggle('active');
    content.classList.toggle('active');
}

// Add new category
function addSkillsCategory() {
    pushHistory(state); // --- UNDO/REDO INTEGRATION ---
    const newId = state.skillsLevelDataAdditional.length + 1;
    const newCategory = {
        id: newId,
        category: '',
        competencies: [
            { id: `${newId}.1`, text: '', levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
        ]
    };
    state.skillsLevelDataAdditional.push(newCategory);
    renderSkillsLevel();
}

// Remove category
function removeSkillsCategory(categoryIndex) {
    if (state.skillsLevelDataAdditional.length <= 1) {
        alert('At least one category is required.');
        return;
    }
    if (confirm('Are you sure you want to remove this category?')) {
        pushHistory(state); // --- UNDO/REDO INTEGRATION ---
        state.skillsLevelDataAdditional.splice(categoryIndex, 1);
        renderSkillsLevel();
    }
}

// Update category name
function updateSkillsCategoryName(categoryIndex, name) {
    state.skillsLevelDataAdditional[categoryIndex].category = name;
}

// Add competency to category
function addSkillsCompetency(categoryIndex) {
    pushHistory(state); // --- UNDO/REDO INTEGRATION ---
    const category = state.skillsLevelDataAdditional[categoryIndex];
    const categoryId = category.id;
    const newCompetencyNumber = category.competencies.length + 1;
    const newCompetency = {
        id: `${categoryId}.${newCompetencyNumber}`,
        text: '',
        levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false }
    };
    category.competencies.push(newCompetency);
    renderSkillsLevel();
}

// Remove competency
function removeSkillsCompetency(categoryIndex, competencyIndex) {
    const category = state.skillsLevelDataAdditional[categoryIndex];
    if (category.competencies.length <= 1) {
        alert('At least one competency is required per category.');
        return;
    }
    pushHistory(state); // --- UNDO/REDO INTEGRATION ---
    category.competencies.splice(competencyIndex, 1);
    // Re-number the remaining competencies
    category.competencies.forEach((comp, index) => {
        comp.id = `${category.id}.${index + 1}`;
    });
    renderSkillsLevel();
}

// Update competency text
function updateSkillsCompetencyText(categoryIndex, competencyIndex, text) {
    state.skillsLevelDataAdditional[categoryIndex].competencies[competencyIndex].text = text;
}

// Handle level checkbox change
function handleSkillsLevelChange(categoryIndex, competencyIndex, level, isChecked) {
    state.skillsLevelDataAdditional[categoryIndex].competencies[competencyIndex].levels[level] = isChecked;
}

// Reset Skills Level to default
function resetSkillsLevel() {
    if (confirm('Are you sure you want to reset all Skills Level data?')) {
        pushHistory(state); // --- UNDO/REDO INTEGRATION ---
        state.skillsLevelDataAdditional = [
            {
                id: 1,
                category: "Communication",
                competencies: [
                    { id: "1.1", text: "Verbally communicate with others", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "1.2", text: "Communicate with others in writing", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            },
            {
                id: 2,
                category: "Teamwork",
                competencies: [
                    { id: "2.1", text: "Work within a team", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "2.2", text: "Solve disputes and negotiate with others", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "2.3", text: "Defend rights at work", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "2.4", text: "Time and resource management", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "2.5", text: "Make decisions", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            },
            {
                id: 3,
                category: "Self-marketing",
                competencies: [
                    { id: "3.1", text: "CV writing", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "3.2", text: "Job interviews", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "3.3", text: "Presentation skills", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            },
            {
                id: 4,
                category: "Problem Solving",
                competencies: [
                    { id: "4.1", text: "Identify and analyse work problems", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "4.2", text: "Solve problems at a work site", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "4.3", text: "Evaluate results and make decisions", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            },
            {
                id: 5,
                category: "Entrepreneurship",
                competencies: [
                    { id: "5.1", text: "Critical thinking", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "5.2", text: "Find/create small business idea project", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "5.3", text: "Prepare simple feasibility studies for their projects", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "5.4", text: "Prepare business plan of project to present to loans institutions", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "5.5", text: "Managing, improving and developing their project", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            },
            {
                id: 6,
                category: "Computer/ICT skills",
                competencies: [
                    { id: "6.1", text: "Use a computer", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "6.2", text: "Use internet", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            },
            {
                id: 7,
                category: "Foreign Languages",
                competencies: [
                    { id: "7.1", text: "Basic communication skills", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "7.2", text: "Use English technical terms related to construction", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            },
            {
                id: 8,
                category: "Mathematical Skills",
                competencies: [
                    { id: "8.1", text: "Perform basic measurement operations", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "8.2", text: "Perform mathematical operations", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            },
            {
                id: 9,
                category: "",
                competencies: [
                    { id: "9.1", text: "", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } },
                    { id: "9.2", text: "", levels: { craftsman: false, skilled: false, semiSkilled: false, foundation: false } }
                ]
            }
        ];
        renderSkillsLevel();
    }
}

// Render Skills Level Matrix
function renderSkillsLevel() {
    const container = document.getElementById('skillsLevelContainer');
    let html = '';

    state.skillsLevelDataAdditional.forEach((category, categoryIndex) => {
        html += `
            <div class="skills-level-category">
                <div class="skills-level-category-header">
                    <h4>Category ${category.id}</h4>
                    <button class="btn-remove-category" onclick="removeSkillsCategory(${categoryIndex})">Remove Category</button>
                </div>
                
                <input 
                    type="text" 
                    class="skills-level-category-name" 
                    placeholder="e.g., Communication, Problem Solving, etc."
                    value="${category.category}"
                    onchange="updateSkillsCategoryName(${categoryIndex}, this.value)"
                />
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h5 style="margin: 0;">Competencies</h5>
                    <button class="btn-add-competency" onclick="addSkillsCompetency(${categoryIndex})">+ Add Competency</button>
                </div>
                
                <div>
        `;

        category.competencies.forEach((competency, competencyIndex) => {
            html += `
                <div class="skills-competency-row">
                    <div class="skills-competency-input-row">
                        <div class="skills-competency-id">${competency.id}:</div>
                        <input 
                            type="text" 
                            class="skills-competency-text" 
                            placeholder="Enter competency description (e.g., 'Verbally communicate with others')"
                            value="${competency.text}"
                            onchange="updateSkillsCompetencyText(${categoryIndex}, ${competencyIndex}, this.value)"
                        />
                        <button class="btn-remove-competency" onclick="removeSkillsCompetency(${categoryIndex}, ${competencyIndex})">×</button>
                    </div>
                    
                    <div class="skills-level-checkboxes">
                        <label class="skills-level-checkbox-label">
                            <input 
                                type="checkbox" 
                                ${competency.levels.craftsman ? 'checked' : ''}
                                onchange="handleSkillsLevelChange(${categoryIndex}, ${competencyIndex}, 'craftsman', this.checked)"
                            />
                            <span>Craftsman/Supervisor</span>
                        </label>
                        <label class="skills-level-checkbox-label">
                            <input 
                                type="checkbox" 
                                ${competency.levels.skilled ? 'checked' : ''}
                                onchange="handleSkillsLevelChange(${categoryIndex}, ${competencyIndex}, 'skilled', this.checked)"
                            />
                            <span>Skilled</span>
                        </label>
                        <label class="skills-level-checkbox-label">
                            <input 
                                type="checkbox" 
                                ${competency.levels.semiSkilled ? 'checked' : ''}
                                onchange="handleSkillsLevelChange(${categoryIndex}, ${competencyIndex}, 'semiSkilled', this.checked)"
                            />
                            <span>Semi-skilled</span>
                        </label>
                        <label class="skills-level-checkbox-label">
                            <input 
                                type="checkbox" 
                                ${competency.levels.foundation ? 'checked' : ''}
                                onchange="handleSkillsLevelChange(${categoryIndex}, ${competencyIndex}, 'foundation', this.checked)"
                            />
                            <span>Foundation skills</span>
                        </label>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Initialize Skills Level on page load
document.addEventListener('DOMContentLoaded', function() {
    renderSkillsLevel();
});

function showLoadingModal() {
    const modal = document.getElementById('loadingModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update the AI usage badge displayed in the UI (e.g. token/call counter).
// Reads state.usageCount (if present) and reflects it in #usageBadge.
function updateUsageBadge() {
    const badge = document.getElementById('usageBadge');
    if (!badge) return;
    const count = (state && state.usageCount) ? state.usageCount : 0;
    badge.textContent = count;
}

// Initialize usage badge on page load
window.addEventListener('DOMContentLoaded', function() {
    updateUsageBadge();
});

// Toggle info box visibility
function toggleInfoBox() {
    const infoBoxContent = document.getElementById('infoBoxContent');
    const toggleButton = document.querySelector('.btn-toggle-info');
    
    if (infoBoxContent.style.display === 'none') {
        infoBoxContent.style.display = 'block';
        toggleButton.textContent = 'Hide';
    } else {
        infoBoxContent.style.display = 'none';
        toggleButton.textContent = 'Show';
    }
}
// Expose globally so inline HTML onclick="toggleInfoBox()" handlers work
window.toggleInfoBox = toggleInfoBox;

// Handle image upload
function handleImageUpload(event, imageType) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
        showStatus('Please upload a valid image file (JPG, JPEG, PNG, or BMP)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Store image data
        if (imageType === 'producedFor') {
            state.producedForImage = imageData;
        } else if (imageType === 'producedBy') {
            state.producedByImage = imageData;
        }

        // Display image preview
        const previewDiv = document.getElementById(`${imageType}ImagePreview`);
        previewDiv.innerHTML = `<img src="${imageData}" alt="${imageType} logo">`;
        previewDiv.classList.add('has-image');

        // Show remove button
        document.getElementById(`remove${imageType.charAt(0).toUpperCase() + imageType.slice(1)}Image`).style.display = 'inline-block';

        showStatus('Image uploaded successfully! ✓', 'success');
    };
    reader.readAsDataURL(file);
}

// Remove uploaded image
function removeImage(imageType) {
    if (confirm('Are you sure you want to remove this logo?')) {
        // Clear image data
        if (imageType === 'producedFor') {
            state.producedForImage = null;
        } else if (imageType === 'producedBy') {
            state.producedByImage = null;
        }

        // Clear preview
        const previewDiv = document.getElementById(`${imageType}ImagePreview`);
        previewDiv.innerHTML = '<span style="color: #999; font-size: 0.9em;">No image</span>';
        previewDiv.classList.remove('has-image');

        // Hide remove button
        document.getElementById(`remove${imageType.charAt(0).toUpperCase() + imageType.slice(1)}Image`).style.display = 'none';

        // Clear file input
        document.getElementById(`${imageType}ImageInput`).value = '';

        showStatus('Image removed! ✓', 'success');
    }
}

// Add custom section
function addCustomSection() {
    state.customSectionCounter++;
    const sectionId = `customSection${state.customSectionCounter}`;
    const headingId = `${sectionId}Heading`;
    const inputId = `${sectionId}Input`;
    
    const container = document.getElementById('customSectionsContainer');
    
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section-container';
    sectionDiv.id = sectionId;
    sectionDiv.innerHTML = `
        <div class="section-header-editable">
            <h3 id="${headingId}" contenteditable="false">Custom Section ${state.customSectionCounter}</h3>
            <div style="display: flex; gap: 10px;">
                <button class="btn-rename" onclick="toggleEditHeading('${headingId}')">✏️ Rename</button>
                <button class="btn-clear-section" onclick="clearSection('${inputId}', '${headingId}', 'Custom Section ${state.customSectionCounter}')">🗑️ Clear</button>
                <button class="btn-remove-section" onclick="removeCustomSection('${sectionId}')" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 8px 16px; font-size: 0.95em; border: none; border-radius: 8px; cursor: pointer;">
                    ❌ Remove
                </button>
            </div>
        </div>
        <textarea id="${inputId}" placeholder="Enter information for this custom section on separate lines"></textarea>
    `;
    
    container.appendChild(sectionDiv);
    showStatus('Custom section added! ✓', 'success');
}

// Remove custom section
function removeCustomSection(sectionId) {
    if (confirm('Are you sure you want to remove this section? This cannot be undone!')) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.remove();
            showStatus('Section removed! ✓', 'success');
        }
    }
}

// Tab functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        // If duties tab is clicked and no duties exist, add one duty with one task
        if (tabId === 'duties-tab') {
            const dutiesContainer = document.getElementById('dutiesContainer');
            if (dutiesContainer.children.length === 0) {
                addDuty();
                const currentDutyId = `duty_${state.dutyCount}`;
                addTask(currentDutyId);
            }
        }
        
        // Initialize clustering when tab is activated
        if (tabId === 'clustering-tab') {
            if (typeof state.clusteringData !== 'undefined' && typeof initializeClusteringFromTasks === 'function') {
                if (state.clusteringData.availableTasks.length === 0 && state.clusteringData.clusters.length === 0) {
                    initializeClusteringFromTasks();
                }
            }
        }
        
        // Render Learning Outcomes when tab is activated
        if (tabId === 'learning-outcomes-tab') {
            if (typeof renderPCSourceList === 'function') {
                renderPCSourceList();
            }
            if (typeof renderLearningOutcomes === 'function') {
                renderLearningOutcomes();
            }
        }
        
        // Render Module Mapping when tab is activated
        if (tabId === 'module-mapping-tab') {
            if (typeof renderModuleLoList === 'function') {
                renderModuleLoList();
            }
            if (typeof renderModules === 'function') {
                renderModules();
            }
        }
    });
});

// Initialize: Add one duty with one task on page load
window.addEventListener('DOMContentLoaded', function() {
    addDuty();
    const currentDutyId = `duty_${state.dutyCount}`;
    addTask(currentDutyId);
});

// Duty management
// state.dutyCount initialized in state.js


function addDuty() {
    pushHistory(state); // --- UNDO/REDO INTEGRATION ---
    state.dutyCount++;
    const dutyDiv = document.createElement('div');
    dutyDiv.className = 'duty-row';
    dutyDiv.id = `duty_${state.dutyCount}`;
    dutyDiv.innerHTML = `
        <div class="duty-header">
            <h4>Duty ${state.dutyCount}</h4>
            <div style="display: flex; gap: 10px;">
                <button class="btn-clear-section" onclick="clearDuty('duty_${state.dutyCount}')">🗑️ Clear</button>
                <button class="btn-remove" onclick="removeDuty('duty_${state.dutyCount}')">🗑️ Remove Duty</button>
            </div>
        </div>
        <input type="text" placeholder="Enter duty description" data-duty-id="duty_${state.dutyCount}">
        <div class="task-list" id="tasks_duty_${state.dutyCount}"></div>
        <button class="btn-add" onclick="addTask('duty_${state.dutyCount}')">➕ Add Task</button>
    `;
    document.getElementById('dutiesContainer').appendChild(dutyDiv);
}

function removeDuty(dutyId) {
    pushHistory(state); // --- UNDO/REDO INTEGRATION ---
    document.getElementById(dutyId).remove();
}

// state.taskCounts initialized in state.js

function addTask(dutyId) {
    pushHistory(state); // --- UNDO/REDO INTEGRATION ---
    if (!state.taskCounts[dutyId]) state.taskCounts[dutyId] = 0;
    state.taskCounts[dutyId]++;
    
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.id = `task_${dutyId}_${state.taskCounts[dutyId]}`;
    taskDiv.innerHTML = `
        <span class="task-label">Task ${state.taskCounts[dutyId]}:</span>
        <input type="text" style="flex: 1;" placeholder="Enter task description" data-task-id="${dutyId}_${state.taskCounts[dutyId]}">
        <button class="btn-remove" onclick="removeTask('task_${dutyId}_${state.taskCounts[dutyId]}')">🗑️</button>
    `;
    document.getElementById(`tasks_${dutyId}`).appendChild(taskDiv);
}

function removeTask(taskId) {
    pushHistory(state); // --- UNDO/REDO INTEGRATION ---
    document.getElementById(taskId).remove();
}

// Toggle heading edit mode
function toggleEditHeading(headingId) {
    const heading = document.getElementById(headingId);
    const isEditable = heading.getAttribute('contenteditable') === 'true';
    
    if (isEditable) {
        // Save and exit edit mode
        heading.setAttribute('contenteditable', 'false');
        heading.style.cursor = '';
        showStatus('Heading updated! ✓', 'success');
    } else {
        // Enter edit mode
        heading.setAttribute('contenteditable', 'true');
        heading.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(heading);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

// Clear section in Additional Info tab
function clearSection(inputId, headingId, defaultHeading) {
    if (confirm('Are you sure you want to clear this section?')) {
        document.getElementById(inputId).value = '';
        document.getElementById(headingId).textContent = defaultHeading;
        document.getElementById(headingId).setAttribute('contenteditable', 'false');
        showStatus('Section cleared! ✓', 'success');
    }
}

// Format list with numbering or bullets
function formatList(inputId, formatType) {
    const textarea = document.getElementById(inputId);
    const text = textarea.value.trim();
    
    if (!text) {
        showStatus('Nothing to format! Add some content first.', 'error');
        return;
    }
    
    // Split by lines and filter out empty lines
    let lines = text.split('\n').filter(line => line.trim());
    
    // Remove existing bullets or numbers from lines
    lines = lines.map(line => {
        // Remove leading bullets (•, -, *, ○, ●, etc.)
        line = line.replace(/^[\s]*[•\-\*○●]\s*/, '');
        // Remove leading numbers (1., 1), (1, etc.)
        line = line.replace(/^[\s]*\d+[\.\)]\s*/, '');
        return line.trim();
    });
    
    // Apply new formatting
    let formatted = [];
    if (formatType === 'number') {
        lines.forEach((line, index) => {
            formatted.push(`${index + 1}. ${line}`);
        });
    } else if (formatType === 'bullet') {
        lines.forEach(line => {
            formatted.push(`• ${line}`);
        });
    }
    
    // Update textarea
    textarea.value = formatted.join('\n');
    
    showStatus(`✓ Formatted with ${formatType === 'number' ? 'numbering' : 'bullets'}!`, 'success');
}

// Clear specific duty section
function clearDuty(dutyId) {
    if (confirm('Are you sure you want to clear this duty and all its tasks?')) {
        pushHistory(state); // --- UNDO/REDO INTEGRATION ---
        // Clear duty input
        const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
        if (dutyInput) {
            dutyInput.value = '';
        }
        
        // Clear all tasks
        const taskInputs = document.querySelectorAll(`[data-task-id^="${dutyId}_"]`);
        taskInputs.forEach(taskInput => {
            taskInput.value = '';
        });
        
        showStatus('Duty cleared! ✓', 'success');
    }
}


// ============ TASK VERIFICATION & TRAINING PRIORITY FUNCTIONS ============

// Store for verification ratings
// Structure: { 
//   dutyId_taskId: { 
//     importance: 0-3, 
//     frequency: 0-3, 
//     difficulty: 0-3,
//     performsTask: boolean (Extended mode),
//     criticality: 0-3 (Extended mode),
//     comments: string (optional)
//   } 
// }
// state.verificationRatings initialized in state.js
// state.taskMetadata initialized in state.js
// state.collectionMode initialized in state.js
// state.workflowMode initialized in state.js
// state.verificationDecisionMade initialized in state.js
// state.clusteringAllowed initialized in state.js

// ============ WORKSHOP AGGREGATED COUNTS VARIABLES ============
// Workshop-specific data
// state.workshopParticipants initialized in state.js
// state.priorityFormula initialized in state.js

// Task Verification export mode ('appendix' or 'standalone')
// state.tvExportMode initialized in state.js
// state.trainingLoadMethod initialized in state.js

// Workshop counts structure
// Structure: {
//   dutyId_taskId: {
//     importanceCounts: {0: X, 1: Y, 2: Z, 3: W},
//     frequencyCounts: {0: X, 1: Y, 2: Z, 3: W},
//     difficultyCounts: {0: X, 1: Y, 2: Z, 3: W},
//     criticalityCounts: {0: X, 1: Y, 2: Z, 3: W} (Extended only)
//   }
// }
// state.workshopCounts initialized in state.js

// Computed workshop results (weighted means and priority index)
// Structure: {
//   dutyId_taskId: {
//     meanImportance: float,
//     meanFrequency: float,
//     meanDifficulty: float,
//     meanCriticality: float (Extended only),
//     priorityIndex: float,
//     valid: boolean (sum validation passed)
//   }
// }
// state.workshopResults initialized in state.js

// Update collection mode
function updateCollectionMode() {
    const workshopRadio = document.getElementById('mode-workshop');
    const surveyRadio = document.getElementById('mode-survey');
    
    if (workshopRadio.checked) {
        state.collectionMode = 'workshop';
    } else if (surveyRadio.checked) {
        state.collectionMode = 'survey';
    }
    
    // Show/hide workshop-specific fields
    const workshopSection = document.getElementById('workshopParticipantsSection');
    const dashboardSection = document.getElementById('resultsDashboard');
    
    if (state.collectionMode === 'workshop') {
        workshopSection.style.display = 'block';
        dashboardSection.style.display = 'block';
    } else {
        workshopSection.style.display = 'none';
        dashboardSection.style.display = 'none';
    }
    
    // Re-render verification UI to switch between count inputs and radio buttons
    loadDutiesForVerification();
    
    console.log('Collection mode updated to:', state.collectionMode);
    showStatus(`Data collection mode: ${state.collectionMode === 'workshop' ? 'Workshop (Facilitated)' : 'Individual / Survey'}`, 'success');
}

// Update workflow mode
function updateWorkflowMode() {
    const standardRadio = document.getElementById('workflow-standard');
    const extendedRadio = document.getElementById('workflow-extended');
    
    if (standardRadio.checked) {
        state.workflowMode = 'standard';
    } else if (extendedRadio.checked) {
        state.workflowMode = 'extended';
    }
    
    console.log('Workflow mode updated to:', state.workflowMode);
    
    // Update UI to show/hide extended columns
    const container = document.getElementById('verificationAccordionContainer');
    if (state.workflowMode === 'extended') {
        container.classList.add('workflow-extended');
    } else {
        container.classList.remove('workflow-extended');
    }
    
    // Re-render the verification UI to show/hide extended fields
    // This preserves existing data
    loadDutiesForVerification();
    
    // Show/hide priority formula selector (Standard mode only)
    const priorityFormulaSection = document.getElementById('priorityFormulaSection');
    if (state.workflowMode === 'standard' && state.collectionMode === 'workshop') {
        priorityFormulaSection.style.display = 'block';
    } else {
        priorityFormulaSection.style.display = 'none';
    }
    
    showStatus(`Workflow mode: ${state.workflowMode === 'standard' ? 'Standard (DACUM)' : 'Extended (DACUM)'}`, 'success');
}

// Update workshop participant count
function updateParticipantCount() {
    const input = document.getElementById('workshopParticipants');
    state.workshopParticipants = parseInt(input.value) || 10;
    console.log('Workshop participants updated to:', state.workshopParticipants);
    
    // Re-validate all tasks
    validateAndComputeWorkshopResults();
    showStatus(`Participants set to ${state.workshopParticipants}. Re-validating all tasks...`, 'success');
}

// Update priority formula
function updatePriorityFormula() {
    const ifRadio = document.getElementById('formula-if');
    const ifdRadio = document.getElementById('formula-ifd');
    
    if (ifRadio.checked) {
        state.priorityFormula = 'if';
    } else if (ifdRadio.checked) {
        state.priorityFormula = 'ifd';
    }
    
    console.log('Priority formula updated to:', state.priorityFormula);
    
    // Recalculate priority indices
    validateAndComputeWorkshopResults();
    refreshDashboard();
    
    showStatus(`Priority formula: ${state.priorityFormula === 'if' ? 'I × F' : 'I × F × D'}`, 'success');
}

// Update Task Verification export mode
function updateTVExportMode() {
    const appendixRadio = document.getElementById('tvExportAppendix');
    const standaloneRadio = document.getElementById('tvExportStandalone');
    
    if (appendixRadio && appendixRadio.checked) {
        state.tvExportMode = 'appendix';
    } else if (standaloneRadio && standaloneRadio.checked) {
        state.tvExportMode = 'standalone';
    }
    
    console.log('Task Verification export mode:', state.tvExportMode);
    showStatus(`Export mode: ${state.tvExportMode === 'appendix' ? 'Include as Appendix' : 'Standalone Report'}`, 'success');
}

// Load duties and tasks from existing DACUM structure and create verification UI
function loadDutiesForVerification() {
    const container = document.getElementById('verificationAccordionContainer');
    
    // Get all duties from the duties container
    const dutyInputs = document.querySelectorAll('[data-duty-id]');
    
    if (dutyInputs.length === 0) {
        container.innerHTML = `
            <div class="no-duties-message">
                <h3>⚠️ No Duties Found</h3>
                <p>Please go to the "Duties & Tasks" tab and create duties with tasks first.</p>
                <p style="margin-top: 10px;">Once you've added duties and tasks, click the "Refresh Duties & Tasks" button above.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = ''; // Clear existing content
    
    let totalDuties = 0;
    let totalTasks = 0;
    
    // Iterate through each duty
    dutyInputs.forEach((dutyInput) => {
        const dutyId = dutyInput.getAttribute('data-duty-id');
        const dutyText = dutyInput.value.trim();
        
        if (!dutyText) return; // Skip empty duties
        
        totalDuties++;
        
        // Get all tasks for this duty
        const taskInputs = document.querySelectorAll(`[data-task-id^="${dutyId}_"]`);
        const tasks = [];
        
        taskInputs.forEach((taskInput) => {
            const taskText = taskInput.value.trim();
            if (taskText) {
                const taskId = taskInput.getAttribute('data-task-id');
                
                // Store metadata for this task
                state.taskMetadata[taskId] = {
                    dutyId: dutyId,
                    dutyTitle: dutyText,
                    taskTitle: taskText
                };
                
                tasks.push({ 
                    id: taskId, 
                    text: taskText,
                    dutyId: dutyId,
                    dutyTitle: dutyText
                });
                totalTasks++;
            }
        });
        
        if (tasks.length === 0) return; // Skip duties with no tasks
        
        // Create accordion for this duty
        const accordionHtml = createDutyAccordion(dutyId, dutyText, tasks);
        container.insertAdjacentHTML('beforeend', accordionHtml);
    });
    
    // Attach event listeners to accordion headers
    attachAccordionListeners();
    
    showStatus(`✓ Loaded ${totalDuties} duties with ${totalTasks} tasks for verification`, 'success');
}

// Create accordion HTML for a duty with its tasks
// Create accordion HTML for a duty with its tasks
// Supports both Standard and Extended workflow modes
function createDutyAccordion(dutyId, dutyText, tasks) {
    const isExtended = state.workflowMode === 'extended';
    
    const tasksTableRows = tasks.map((task, index) => {
        const taskKey = task.id;
        const ratings = state.verificationRatings[taskKey] || { 
            importance: null, 
            frequency: null, 
            difficulty: null,
            performsTask: false,
            criticality: null,
            comments: ''
        };
        
        // Calculate completion status (Standard mode)
        const isComplete = ratings.importance !== null && 
                           ratings.frequency !== null && 
                           ratings.difficulty !== null;
        const completionHtml = `
            <span class="completion-indicator ${isComplete ? 'complete' : 'incomplete'}">
                ${isComplete ? '✓ Complete' : '○ Incomplete'}
            </span>
        `;
        
        // Calculate Task Score (Standard mode)
        const taskScore = isComplete ? 
            (ratings.importance + ratings.frequency + ratings.difficulty) : 
            '-';
        
        // Calculate Weighted Score and Priority (Extended mode)
        let weightedScore = '-';
        let priorityLevel = 'low';
        if (isExtended && ratings.importance !== null && ratings.frequency !== null && 
            ratings.difficulty !== null && ratings.criticality !== null) {
            weightedScore = (ratings.importance * ratings.frequency) + 
                            ratings.difficulty + ratings.criticality;
            
            // Determine priority level
            if (weightedScore >= 10) {
                priorityLevel = 'high';
            } else if (weightedScore >= 6) {
                priorityLevel = 'medium';
            } else {
                priorityLevel = 'low';
            }
        }
        
        const priorityHtml = `
            <span class="priority-badge ${priorityLevel}">
                ${priorityLevel.toUpperCase()}
            </span>
        `;
        
        // Build row HTML - Support both Workshop (counts) and Survey (radio) modes
        const isWorkshop = state.collectionMode === 'workshop';
        
        // For Workshop mode in Standard workflow, show weighted means
        let workshopMeans = '';
        if (isWorkshop && !isExtended && state.workshopResults[taskKey] && state.workshopResults[taskKey].valid) {
            const res = state.workshopResults[taskKey];
            workshopMeans = `
                <td style="width: 8%; text-align: center;">
                    <span class="weighted-mean" id="mean_imp_${taskKey}">${res.meanImportance.toFixed(2)}</span>
                </td>
                <td style="width: 8%; text-align: center;">
                    <span class="weighted-mean" id="mean_freq_${taskKey}">${res.meanFrequency.toFixed(2)}</span>
                </td>
                <td style="width: 8%; text-align: center;">
                    <span class="weighted-mean" id="mean_diff_${taskKey}">${res.meanDifficulty.toFixed(2)}</span>
                </td>
                <td style="width: 8%; text-align: center;">
                    <span class="priority-index" id="priority_${taskKey}">${res.priorityIndex.toFixed(2)}</span>
                </td>
            `;
        } else if (isWorkshop && !isExtended) {
            workshopMeans = `
                <td style="width: 8%; text-align: center;">
                    <span class="weighted-mean" id="mean_imp_${taskKey}">-</span>
                </td>
                <td style="width: 8%; text-align: center;">
                    <span class="weighted-mean" id="mean_freq_${taskKey}">-</span>
                </td>
                <td style="width: 8%; text-align: center;">
                    <span class="weighted-mean" id="mean_diff_${taskKey}">-</span>
                </td>
                <td style="width: 8%; text-align: center;">
                    <span class="priority-index" id="priority_${taskKey}">-</span>
                </td>
            `;
        }
        
        return `
            <tr data-task-key="${taskKey}">
                <td style="width: ${isExtended ? '25%' : (isWorkshop ? '28%' : '40%')};">
                    <div class="task-text">${index + 1}. ${escapeHtml(task.text)}</div>
                </td>
                <td style="width: ${isExtended ? '12%' : '15%'};">
                    ${isWorkshop ? createCountInputs(taskKey, 'importance') : createRatingScale(taskKey, 'importance', ratings.importance)}
                </td>
                <td style="width: ${isExtended ? '12%' : '15%'};">
                    ${isWorkshop ? createCountInputs(taskKey, 'frequency') : createRatingScale(taskKey, 'frequency', ratings.frequency)}
                </td>
                <td style="width: ${isExtended ? '12%' : '15%'};">
                    ${isWorkshop ? createCountInputs(taskKey, 'difficulty') : createRatingScale(taskKey, 'difficulty', ratings.difficulty)}
                </td>
                ${!isExtended && !isWorkshop ? `
                    <td style="width: 8%; text-align: center;">
                        <span class="score-display" id="score_${taskKey}">${taskScore}</span>
                    </td>
                    <td style="width: 12%; text-align: center;">
                        <span id="completion_${taskKey}">${completionHtml}</span>
                    </td>
                ` : ''}
                ${!isExtended && isWorkshop ? workshopMeans : ''}
                ${isExtended ? `
                    <td class="extended-only" style="width: 10%; text-align: center;">
                        <div class="performs-task-toggle">
                            <input type="checkbox" 
                                   id="performs_${taskKey}"
                                   ${ratings.performsTask ? 'checked' : ''}
                                   onchange="updatePerformsTask('${taskKey}', this.checked)">
                            <label for="performs_${taskKey}">Yes</label>
                        </div>
                    </td>
                    <td class="extended-only" style="width: 12%;">
                        ${isWorkshop ? createCountInputs(taskKey, 'criticality') : createRatingScale(taskKey, 'criticality', ratings.criticality)}
                    </td>
                    <td class="extended-only" style="width: 8%; text-align: center;">
                        <span class="score-display" id="weighted_${taskKey}">${weightedScore}</span>
                    </td>
                    <td class="extended-only" style="width: 10%; text-align: center;">
                        <span id="priority_${taskKey}">${priorityHtml}</span>
                    </td>
                    <td class="extended-only" style="width: 15%;">
                        <textarea class="task-comments" 
                                  id="comments_${taskKey}"
                                  placeholder="Optional comments..."
                                  onchange="updateComments('${taskKey}', this.value)">${escapeHtml(ratings.comments || '')}</textarea>
                    </td>
                ` : ''}
            </tr>
        `;
    }).join('');
    
    // Build table header based on mode and collection mode
    const isWorkshop = state.collectionMode === 'workshop';
    const tableHeader = !isExtended && !isWorkshop ? `
        <tr>
            <th>Task</th>
            <th>Importance<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th>Frequency<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th>Learning Difficulty<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th>Task Score</th>
            <th>Completion</th>
        </tr>
    ` : !isExtended && isWorkshop ? `
        <tr>
            <th>Task</th>
            <th>Importance Counts<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th>Frequency Counts<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th>Difficulty Counts<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th>Mean<br>Importance</th>
            <th>Mean<br>Frequency</th>
            <th>Mean<br>Difficulty</th>
            <th>Priority<br>Index</th>
        </tr>
    ` : `
        <tr>
            <th>Task</th>
            <th>${isWorkshop ? 'Importance Counts' : 'Importance'}<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th>${isWorkshop ? 'Frequency Counts' : 'Frequency'}<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th>${isWorkshop ? 'Difficulty Counts' : 'Difficulty'}<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th class="extended-only">Performs?</th>
            <th class="extended-only">${isWorkshop ? 'Criticality Counts' : 'Criticality'}<br><span style="font-weight: 400; font-size: 0.85em;">(0-3)</span></th>
            <th class="extended-only">Weighted Score</th>
            <th class="extended-only">Priority</th>
            <th class="extended-only">Comments</th>
        </tr>
    `;
    
    return `
        <div class="duty-accordion">
            <div class="duty-accordion-header" data-duty="${dutyId}">
                <div class="duty-title">${escapeHtml(dutyText)}</div>
                <div class="duty-toggle">▼</div>
            </div>
            <div class="duty-accordion-content">
                <div style="overflow-x: auto; width: 100%;">
                    <table class="verification-table">
                        <thead>
                            ${tableHeader}
                        </thead>
                        <tbody>
                            ${tasksTableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Create rating scale HTML for a specific dimension
function createRatingScale(taskKey, dimension, currentValue) {
    const scales = [0, 1, 2, 3];
    
    return `
        <div class="rating-scale">
            ${scales.map(value => {
                const isChecked = currentValue === value ? 'checked' : '';
                const inputId = `${taskKey}_${dimension}_${value}`;
                return `
                    <div class="rating-option">
                        <input type="radio" 
                               id="${inputId}"
                               name="${taskKey}_${dimension}" 
                               value="${value}" 
                               ${isChecked}
                               onchange="updateRating('${taskKey}', '${dimension}', ${value})">
                        <label for="${inputId}">${value}</label>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ============ WORKSHOP COUNT INPUTS FUNCTION ============
// Create count inputs for Workshop mode (aggregated counts)
// Used instead of radio buttons when state.collectionMode = 'workshop'
function createCountInputs(taskKey, dimension) {
    const scales = [0, 1, 2, 3];
    
    // Get existing counts if any
    const counts = state.workshopCounts[taskKey] || {};
    const dimensionCounts = counts[`${dimension}Counts`] || {0: 0, 1: 0, 2: 0, 3: 0};
    
    return `
        <div class="count-input-grid">
            ${scales.map(value => {
                const inputId = `${taskKey}_${dimension}_count_${value}`;
                const currentCount = dimensionCounts[value] || 0;
                return `
                    <div class="count-input-item">
                        <label for="${inputId}">${value}</label>
                        <input type="number" 
                               id="${inputId}"
                               min="0" 
                               max="${state.workshopParticipants}"
                               value="${currentCount}"
                               onchange="updateWorkshopCount('${taskKey}', '${dimension}', ${value}, this.value)"
                               oninput="this.value = Math.max(0, Math.min(${state.workshopParticipants}, parseInt(this.value) || 0))">
                    </div>
                `;
            }).join('')}
        </div>
        <div class="validation-warning" id="warning_${taskKey}_${dimension}">
            <!-- Validation message will be inserted here dynamically -->
        </div>
    `;
}

// Update rating when user selects a radio button
// Update rating when user selects a radio button
// Includes live computation updates for scores and completion
function updateRating(taskKey, dimension, value) {
    // Initialize task ratings if not exists
    if (!state.verificationRatings[taskKey]) {
        // Get duty information from state.taskMetadata
        let dutyId, dutyTitle, taskTitle;
        if (state.taskMetadata[taskKey]) {
            dutyId = state.taskMetadata[taskKey].dutyId;
            dutyTitle = state.taskMetadata[taskKey].dutyTitle;
            taskTitle = state.taskMetadata[taskKey].taskTitle;
        }
        
        state.verificationRatings[taskKey] = {
            dutyId: dutyId,
            dutyTitle: dutyTitle,
            taskTitle: taskTitle,
            importance: null,
            frequency: null,
            difficulty: null,
            performsTask: false,
            criticality: null,
            comments: ''
        };
    }
    
    // Update the specific dimension
    state.verificationRatings[taskKey][dimension] = parseInt(value);
    
    console.log('Rating updated:', taskKey, dimension, value);
    console.log('Current ratings:', state.verificationRatings);
    
    // Live update computed values
    updateComputedValues(taskKey);
    
    // NOTE: Future enhancement - Calculate average and priority across multiple raters
    // TODO: Add logic to compute:
    // - Average importance across all raters
    // - Average frequency across all raters
    // - Average difficulty across all raters
    // - Training priority score aggregation
    // - Sort tasks by priority
}

// Update "Performs Task" checkbox (Extended mode only)
function updatePerformsTask(taskKey, value) {
    if (!state.verificationRatings[taskKey]) {
        // Get duty information from state.taskMetadata
        let dutyId, dutyTitle, taskTitle;
        if (state.taskMetadata[taskKey]) {
            dutyId = state.taskMetadata[taskKey].dutyId;
            dutyTitle = state.taskMetadata[taskKey].dutyTitle;
            taskTitle = state.taskMetadata[taskKey].taskTitle;
        }
        
        state.verificationRatings[taskKey] = {
            dutyId: dutyId,
            dutyTitle: dutyTitle,
            taskTitle: taskTitle,
            importance: null,
            frequency: null,
            difficulty: null,
            performsTask: false,
            criticality: null,
            comments: ''
        };
    }
    
    state.verificationRatings[taskKey].performsTask = value;
    console.log('Performs task updated:', taskKey, value);
}

// Update comments (Extended mode only)
function updateComments(taskKey, value) {
    if (!state.verificationRatings[taskKey]) {
        // Get duty information from state.taskMetadata
        let dutyId, dutyTitle, taskTitle;
        if (state.taskMetadata[taskKey]) {
            dutyId = state.taskMetadata[taskKey].dutyId;
            dutyTitle = state.taskMetadata[taskKey].dutyTitle;
            taskTitle = state.taskMetadata[taskKey].taskTitle;
        }
        
        state.verificationRatings[taskKey] = {
            dutyId: dutyId,
            dutyTitle: dutyTitle,
            taskTitle: taskTitle,
            importance: null,
            frequency: null,
            difficulty: null,
            performsTask: false,
            criticality: null,
            comments: ''
        };
    }
    
    state.verificationRatings[taskKey].comments = value;
    console.log('Comments updated:', taskKey, value);
}

// Live computation of scores, completion, and priority
function updateComputedValues(taskKey) {
    const ratings = state.verificationRatings[taskKey];
    if (!ratings) return;
    
    const isExtended = state.workflowMode === 'extended';
    
    if (!isExtended) {
        // Standard Mode: Update Task Score and Completion
        const scoreElement = document.getElementById(`score_${taskKey}`);
        const completionElement = document.getElementById(`completion_${taskKey}`);
        
        if (scoreElement && completionElement) {
            const isComplete = ratings.importance !== null && 
                               ratings.frequency !== null && 
                               ratings.difficulty !== null;
            
            // Update score
            const taskScore = isComplete ? 
                (ratings.importance + ratings.frequency + ratings.difficulty) : 
                '-';
            scoreElement.textContent = taskScore;
            
            // Update completion
            const completionHtml = `
                <span class="completion-indicator ${isComplete ? 'complete' : 'incomplete'}">
                    ${isComplete ? '✓ Complete' : '○ Incomplete'}
                </span>
            `;
            completionElement.innerHTML = completionHtml;
        }
    } else {
        // Extended Mode: Update Weighted Score and Priority Level
        const weightedElement = document.getElementById(`weighted_${taskKey}`);
        const priorityElement = document.getElementById(`priority_${taskKey}`);
        
        if (weightedElement && priorityElement) {
            if (ratings.importance !== null && ratings.frequency !== null && 
                ratings.difficulty !== null && ratings.criticality !== null) {
                
                // Calculate weighted score
                const weightedScore = (ratings.importance * ratings.frequency) + 
                                      ratings.difficulty + ratings.criticality;
                weightedElement.textContent = weightedScore;
                
                // Determine priority level
                let priorityLevel = 'low';
                if (weightedScore >= 10) {
                    priorityLevel = 'high';
                } else if (weightedScore >= 6) {
                    priorityLevel = 'medium';
                }
                
                // Update priority
                const priorityHtml = `
                    <span class="priority-badge ${priorityLevel}">
                        ${priorityLevel.toUpperCase()}
                    </span>
                `;
                priorityElement.innerHTML = priorityHtml;
            } else {
                weightedElement.textContent = '-';
                priorityElement.innerHTML = `
                    <span class="priority-badge low">
                        LOW
                    </span>
                `;
            }
        }
    }
}

// ============ WORKSHOP AGGREGATED COUNTS FUNCTIONS ============

// Update workshop count for a specific value
function updateWorkshopCount(taskKey, dimension, value, count) {
    // Initialize state.workshopCounts structure if needed
    if (!state.workshopCounts[taskKey]) {
        // Get duty information from state.taskMetadata (preferred) or DOM (fallback)
        let dutyId, dutyTitle, taskTitle;
        
        if (state.taskMetadata[taskKey]) {
            dutyId = state.taskMetadata[taskKey].dutyId;
            dutyTitle = state.taskMetadata[taskKey].dutyTitle;
            taskTitle = state.taskMetadata[taskKey].taskTitle;
        } else {
            // Fallback to DOM lookup
            const taskParts = taskKey.split('_task_');
            dutyId = taskParts[0];
            const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
            dutyTitle = dutyInput ? dutyInput.value.trim() : '';
            const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
            taskTitle = taskInput ? taskInput.value.trim() : '';
        }
        
        state.workshopCounts[taskKey] = {
            dutyId: dutyId,
            dutyTitle: dutyTitle,
            taskTitle: taskTitle,
            importanceCounts: {0: 0, 1: 0, 2: 0, 3: 0},
            frequencyCounts: {0: 0, 1: 0, 2: 0, 3: 0},
            difficultyCounts: {0: 0, 1: 0, 2: 0, 3: 0},
            criticalityCounts: {0: 0, 1: 0, 2: 0, 3: 0}
        };
    }
    
    // Update the count
    const dimensionKey = `${dimension}Counts`;
    state.workshopCounts[taskKey][dimensionKey][value] = parseInt(count) || 0;
    
    console.log('Workshop count updated:', taskKey, dimension, value, count);
    
    // Validate and compute for this task
    validateAndComputeTask(taskKey);
}

// Validate a single task's counts and compute weighted means
// ============ VALIDATION AND COMPUTATION (DACUM Methodology) ============
// Validate counts and compute weighted means for a task
//
// VALIDATION LOGIC (Corrected for DACUM best practices):
//   ❌ ERROR (blocking): sum > totalParticipants
//      - More responses than participants (impossible/error)
//      - Do NOT calculate, mark as invalid
//
//   ⚠️ WARNING (non-blocking): sum < totalParticipants  
//      - Partial responses (some participants didn't respond)
//      - This is ALLOWED in DACUM methodology
//      - STILL calculate using available responses
//
//   ✅ OK: sum === totalParticipants
//      - All participants responded
//      - Calculate normally
//
//   ✅ OK: sum === 0
//      - No responses yet
//      - Don't calculate (display "N/A")
function validateAndComputeTask(taskKey) {
    if (!state.workshopCounts[taskKey]) return;
    
    const counts = state.workshopCounts[taskKey];
    const isExtended = state.workflowMode === 'extended';
    
    // Calculate sum for each dimension
    const importanceSum = Object.values(counts.importanceCounts).reduce((a, b) => a + b, 0);
    const frequencySum = Object.values(counts.frequencyCounts).reduce((a, b) => a + b, 0);
    const difficultySum = Object.values(counts.difficultyCounts).reduce((a, b) => a + b, 0);
    
    // Validate each dimension:
    // - Error if sum > participants (blocking)
    // - Warning if sum < participants (non-blocking)
    // - OK if sum === participants or sum === 0
    const importanceError = importanceSum > state.workshopParticipants;
    const frequencyError = frequencySum > state.workshopParticipants;
    const difficultyError = difficultySum > state.workshopParticipants;
    
    const importanceWarning = importanceSum < state.workshopParticipants && importanceSum > 0;
    const frequencyWarning = frequencySum < state.workshopParticipants && frequencySum > 0;
    const difficultyWarning = difficultySum < state.workshopParticipants && difficultySum > 0;
    
    let criticalityError = false;
    let criticalityWarning = false;
    let criticalitySum = 0;
    
    if (isExtended) {
        criticalitySum = Object.values(counts.criticalityCounts).reduce((a, b) => a + b, 0);
        criticalityError = criticalitySum > state.workshopParticipants;
        criticalityWarning = criticalitySum < state.workshopParticipants && criticalitySum > 0;
    }
    
    // Show validation messages (error takes precedence over warning)
    showValidationMessage(taskKey, 'importance', importanceError, importanceWarning, importanceSum);
    showValidationMessage(taskKey, 'frequency', frequencyError, frequencyWarning, frequencySum);
    showValidationMessage(taskKey, 'difficulty', difficultyError, difficultyWarning, difficultySum);
    if (isExtended) {
        showValidationMessage(taskKey, 'criticality', criticalityError, criticalityWarning, criticalitySum);
    }
    
    // Check if any dimension has errors (sum > participants)
    const hasErrors = importanceError || frequencyError || difficultyError || 
                     (isExtended ? criticalityError : false);
    
    // Calculate weighted means if no errors (warnings are OK!)
    // Also require at least one response per dimension
    const canCalculate = !hasErrors && 
                       importanceSum > 0 && 
                       frequencySum > 0 && 
                       difficultySum > 0 &&
                       (isExtended ? criticalitySum > 0 : true);
    
    if (canCalculate) {
        // Calculate weighted means using ACTUAL response counts
        // Returns null if no responses
        const meanImportance = calculateWeightedMean(counts.importanceCounts);
        const meanFrequency = calculateWeightedMean(counts.frequencyCounts);
        const meanDifficulty = calculateWeightedMean(counts.difficultyCounts);
        const meanCriticality = isExtended ? calculateWeightedMean(counts.criticalityCounts) : null;
        
        // Only proceed if we got valid means (not null)
        if (meanImportance !== null && meanFrequency !== null && meanDifficulty !== null &&
            (isExtended ? meanCriticality !== null : true)) {
            
            // Calculate Priority Index based on selected formula
            let priorityIndex = 0;
            if (state.priorityFormula === 'if') {
                // Importance × Frequency
                priorityIndex = meanImportance * meanFrequency;
            } else {
                // Importance × Frequency × Difficulty
                priorityIndex = meanImportance * meanFrequency * meanDifficulty;
            }
            
            // Use stored duty and task titles from state.workshopCounts (with fallback to DOM)
            let dutyTitle = counts.dutyTitle;
            let taskTitle = counts.taskTitle;
            
            // Fallback to DOM lookup if not stored (backward compatibility)
            if (!dutyTitle || !taskTitle) {
                const taskParts = taskKey.split('_task_');
                const dutyId = taskParts[0];
                
                if (!dutyTitle) {
                    const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                    dutyTitle = dutyInput ? dutyInput.value.trim() : '';
                }
                
                if (!taskTitle) {
                    const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
                    taskTitle = taskInput ? taskInput.value.trim() : '';
                }
            }
            
            // Store results with duty and task titles
            state.workshopResults[taskKey] = {
                dutyTitle: dutyTitle,
                taskTitle: taskTitle,
                meanImportance: meanImportance,
                meanFrequency: meanFrequency,
                meanDifficulty: meanDifficulty,
                meanCriticality: meanCriticality || 0,
                priorityIndex: priorityIndex,
                valid: true,
                // Store response counts for transparency
                responseCount: {
                    importance: importanceSum,
                    frequency: frequencySum,
                    difficulty: difficultySum,
                    criticality: criticalitySum
                }
            };
            
            console.log('Task computed (partial responses OK):', taskKey, state.workshopResults[taskKey]);
            
            // Update display if in Standard mode
            if (state.workflowMode === 'standard') {
                updateWorkshopTaskDisplay(taskKey);
            }
            
            // Refresh dashboard
            refreshDashboard();
        } else {
            // Null means returned - no responses
            if (state.workshopResults[taskKey]) {
                state.workshopResults[taskKey].valid = false;
            }
        }
    } else {
        // Errors present or no responses - mark as invalid
        if (state.workshopResults[taskKey]) {
            state.workshopResults[taskKey].valid = false;
        }
    }
}

// Calculate weighted mean from counts
// Formula: Σ(count × value) ÷ total participants
// ============ WEIGHTED MEAN CALCULATION (DACUM Methodology) ============
// Calculate weighted mean from counts using ACTUAL responses, not total participants
// This follows DACUM Handbook methodology for partial responses
//
// Formula: Weighted Mean = Σ(value × count) ÷ totalResponses
// 
// Where:
//   - value = scale value (0, 1, 2, or 3)
//   - count = number of participants who selected this value
//   - totalResponses = sum of all counts for this dimension
//
// Example:
//   Counts: {0: 2, 1: 3, 2: 4, 3: 1}
//   totalResponses = 2+3+4+1 = 10
//   Weighted Mean = (0×2 + 1×3 + 2×4 + 3×1) ÷ 10
//                 = (0 + 3 + 8 + 3) ÷ 10
//                 = 14 ÷ 10 = 1.40
//
// CRITICAL: We use totalResponses (actual count sum), NOT totalParticipants
// This allows for partial responses where not all participants respond to every scale
function calculateWeightedMean(counts) {
    // Calculate weighted sum
    let weightedSum = 0;
    let totalResponses = 0;
    
    for (let value = 0; value <= 3; value++) {
        const count = counts[value] || 0;
        weightedSum += count * value;
        totalResponses += count;
    }
    
    // Return weighted mean, or null if no responses
    // Division by zero protection: if no responses, return null (not 0)
    return totalResponses > 0 ? (weightedSum / totalResponses) : null;
}

// Show/hide validation warning for a dimension
// Show validation message (error or warning)
// Error: sum > participants (blocking - red, severe)
// Warning: sum < participants (non-blocking - yellow, informational)
// OK: no message
function showValidationMessage(taskKey, dimension, isError, isWarning, currentSum) {
    const warningEl = document.getElementById(`warning_${taskKey}_${dimension}`);
    if (!warningEl) return;
    
    if (isError) {
        // Error: Too many responses (blocking)
        warningEl.innerHTML = `<p>❌ ERROR: Total responses (${currentSum}) exceeds ${state.workshopParticipants} participants. Cannot calculate.</p>`;
        warningEl.classList.add('show');
        warningEl.classList.add('error');
        warningEl.classList.remove('warning');
    } else if (isWarning) {
        // Warning: Partial responses (non-blocking)
        warningEl.innerHTML = `<p>⚠️ WARNING: Only ${currentSum} of ${state.workshopParticipants} participants responded. Calculation will use available responses.</p>`;
        warningEl.classList.add('show');
        warningEl.classList.add('warning');
        warningEl.classList.remove('error');
    } else {
        // OK: Hide message
        warningEl.classList.remove('show');
        warningEl.classList.remove('error');
        warningEl.classList.remove('warning');
    }
}

// Update workshop task display with weighted means
// Update workshop task display with weighted means
// Shows computed values or "N/A" if no valid data
function updateWorkshopTaskDisplay(taskKey) {
    const result = state.workshopResults[taskKey];
    
    // Get display elements
    const meanImpEl = document.getElementById(`mean_imp_${taskKey}`);
    const meanFreqEl = document.getElementById(`mean_freq_${taskKey}`);
    const meanDiffEl = document.getElementById(`mean_diff_${taskKey}`);
    const priorityEl = document.getElementById(`priority_${taskKey}`);
    
    if (result && result.valid) {
        // Valid results - display computed values
        if (meanImpEl) meanImpEl.textContent = result.meanImportance !== null ? result.meanImportance.toFixed(2) : 'N/A';
        if (meanFreqEl) meanFreqEl.textContent = result.meanFrequency !== null ? result.meanFrequency.toFixed(2) : 'N/A';
        if (meanDiffEl) meanDiffEl.textContent = result.meanDifficulty !== null ? result.meanDifficulty.toFixed(2) : 'N/A';
        if (priorityEl) priorityEl.textContent = result.priorityIndex !== null ? result.priorityIndex.toFixed(2) : 'N/A';
    } else {
        // No valid results - display N/A or dash
        if (meanImpEl) meanImpEl.textContent = '-';
        if (meanFreqEl) meanFreqEl.textContent = '-';
        if (meanDiffEl) meanDiffEl.textContent = '-';
        if (priorityEl) priorityEl.textContent = '-';
    }
}

// Validate and compute all workshop results
function validateAndComputeWorkshopResults() {
    if (state.collectionMode !== 'workshop') return;
    
    // Process all tasks that have counts
    Object.keys(state.workshopCounts).forEach(taskKey => {
        validateAndComputeTask(taskKey);
    });
    
    console.log('All workshop results validated and computed');
}

// ============ DASHBOARD FUNCTIONS ============

// Toggle dashboard visibility
function toggleDashboard() {
    const header = document.querySelector('.results-dashboard-header');
    const content = document.getElementById('dashboardContent');
    
    header.classList.toggle('active');
    content.classList.toggle('active');
}

// Refresh the dashboard with latest results
function refreshDashboard() {
    if (state.collectionMode !== 'workshop') return;
    
    // Get all valid results
    const validResults = [];
    
    Object.keys(state.workshopResults).forEach(taskKey => {
        const result = state.workshopResults[taskKey];
        if (result && result.valid) {
            // Use stored duty and task titles (with backward compatibility)
            let dutyText = result.dutyTitle;
            let taskText = result.taskTitle;
            
            // Backward compatibility: if not stored, look up from DOM
            if (!dutyText || !taskText) {
                const taskParts = taskKey.split('_task_');
                const dutyId = taskParts[0];
                
                if (!dutyText) {
                    const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                    dutyText = dutyInput ? dutyInput.value.trim() : 'Unassigned Duty';
                }
                
                if (!taskText) {
                    const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
                    taskText = taskInput ? taskInput.value.trim() : 'Unassigned Task';
                }
            }
            
            validResults.push({
                taskKey: taskKey,
                duty: dutyText,
                task: taskText,
                meanImportance: result.meanImportance,
                meanFrequency: result.meanFrequency,
                meanDifficulty: result.meanDifficulty,
                priorityIndex: result.priorityIndex
            });
        }
    });
    
    // Sort by priority index (descending)
    validResults.sort((a, b) => b.priorityIndex - a.priorityIndex);
    
    // Update summary statistics
    updateDashboardSummary(validResults);
    
    // Update table
    updateDashboardTable(validResults);
    
    // Update duty-level summary
    updateDutyLevelSummary();
}

// Update dashboard summary cards
function updateDashboardSummary(results) {
    const summaryContainer = document.getElementById('dashboardSummary');
    if (!summaryContainer) return;
    
    const totalTasks = results.length;
    const avgPriority = totalTasks > 0 ? 
        (results.reduce((sum, r) => sum + r.priorityIndex, 0) / totalTasks) : 0;
    const highPriorityCount = results.filter(r => {
        // High priority threshold (top 30%)
        const threshold = results[Math.floor(results.length * 0.3)]?.priorityIndex || 0;
        return r.priorityIndex >= threshold;
    }).length;
    
    summaryContainer.innerHTML = `
        <div class="summary-card">
            <h4>Total Tasks</h4>
            <p>${totalTasks}</p>
        </div>
        <div class="summary-card">
            <h4>Average Priority</h4>
            <p>${avgPriority.toFixed(2)}</p>
        </div>
        <div class="summary-card">
            <h4>High Priority</h4>
            <p>${highPriorityCount} tasks</p>
        </div>
        <div class="summary-card">
            <h4>Formula Used</h4>
            <p>${state.priorityFormula === 'if' ? 'I × F' : 'I × F × D'}</p>
        </div>
    `;
}

// Update dashboard table with results
function updateDashboardTable(results) {
    const tableBody = document.getElementById('dashboardTableBody');
    if (!tableBody) return;
    
    if (results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    No valid task data available. Complete workshop counts to see results.
                </td>
            </tr>
        `;
        return;
    }
    
    // Determine top 30% threshold
    const topThreshold = results[Math.floor(results.length * 0.3)]?.priorityIndex || 0;
    
    const rows = results.map((r, index) => {
        const rank = index + 1;
        const isTop = r.priorityIndex >= topThreshold && rank <= Math.ceil(results.length * 0.3);
        const rowClass = isTop ? 'high-priority' : '';
        const rankBadge = isTop ? 'top' : '';
        
        return `
            <tr class="${rowClass}">
                <td><span class="rank-badge ${rankBadge}">#${rank}</span></td>
                <td>${escapeHtml(r.duty)}</td>
                <td>${escapeHtml(r.task)}</td>
                <td><span class="mean-value">${r.meanImportance.toFixed(2)}</span></td>
                <td><span class="mean-value">${r.meanFrequency.toFixed(2)}</span></td>
                <td><span class="mean-value">${r.meanDifficulty.toFixed(2)}</span></td>
                <td><span class="priority-index">${r.priorityIndex.toFixed(2)}</span></td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = rows;
}

// Toggle duty-level summary section
function toggleDutyLevelSummary() {
    const content = document.getElementById('dutyLevelContent');
    const toggle = document.getElementById('dutyLevelToggle');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
    }
}

// Update training load method
function updateTrainingLoadMethod() {
    const advanced = document.querySelector('input[name="trainingLoadMethod"][value="advanced"]');
    state.trainingLoadMethod = advanced.checked ? 'advanced' : 'simple';
    
    // Update label
    const label = document.getElementById('trainingLoadMethodLabel');
    if (label) {
        label.innerHTML = `Current Method: <strong style="color: #667eea;">${state.trainingLoadMethod === 'advanced' ? 'Advanced' : 'Simple'}</strong>`;
    }
    
    // Recalculate duty-level summary
    updateDutyLevelSummary();
}

// Calculate and update duty-level summary
function updateDutyLevelSummary() {
    if (state.collectionMode !== 'workshop') return;
    
    const tableBody = document.getElementById('dutyLevelTableBody');
    if (!tableBody) return;
    
    // Aggregate tasks by duty
    const dutyMap = {};
    
    Object.keys(state.workshopResults).forEach(taskKey => {
        const result = state.workshopResults[taskKey];
        if (result && result.valid) {
            // Get duty information
            let dutyId = result.dutyId || taskKey.split('_task_')[0];
            let dutyTitle = result.dutyTitle;
            
            // Backward compatibility
            if (!dutyTitle) {
                const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                dutyTitle = dutyInput ? dutyInput.value.trim() : 'Unassigned Duty';
            }
            
            // Initialize duty entry if not exists
            if (!dutyMap[dutyId]) {
                dutyMap[dutyId] = {
                    dutyTitle: dutyTitle,
                    totalTasks: 0,
                    validTasks: 0,
                    importanceSum: 0,
                    frequencySum: 0,
                    difficultySum: 0,
                    prioritySum: 0,
                    highPriorityCount: 0,
                    tasks: []
                };
            }
            
            // Aggregate data
            dutyMap[dutyId].totalTasks++;
            dutyMap[dutyId].validTasks++;
            dutyMap[dutyId].importanceSum += result.meanImportance;
            dutyMap[dutyId].frequencySum += result.meanFrequency;
            dutyMap[dutyId].difficultySum += result.meanDifficulty;
            dutyMap[dutyId].prioritySum += result.priorityIndex;
            
            // Store task for training load calculation
            dutyMap[dutyId].tasks.push({
                priorityIndex: result.priorityIndex,
                meanDifficulty: result.meanDifficulty
            });
        }
    });
    
    // Calculate averages and training load for each duty
    const dutyResults = [];
    Object.keys(dutyMap).forEach(dutyId => {
        const duty = dutyMap[dutyId];
        const validCount = duty.validTasks;
        
        if (validCount > 0) {
            const avgImportance = duty.importanceSum / validCount;
            const avgFrequency = duty.frequencySum / validCount;
            const avgDifficulty = duty.difficultySum / validCount;
            const avgPriority = duty.prioritySum / validCount;
            
            // Calculate training load based on selected method
            let trainingLoad = 0;
            if (state.trainingLoadMethod === 'advanced') {
                // Advanced: Σ (Priority Index × Mean Difficulty)
                trainingLoad = duty.tasks.reduce((sum, task) => {
                    return sum + (task.priorityIndex * task.meanDifficulty);
                }, 0);
            } else {
                // Simple: Average Priority × Tasks Count
                trainingLoad = avgPriority * validCount;
            }
            
            // Count high priority tasks (top 30% based on priority index)
            const sortedTasks = duty.tasks.sort((a, b) => b.priorityIndex - a.priorityIndex);
            const threshold = sortedTasks[Math.floor(sortedTasks.length * 0.3)]?.priorityIndex || 0;
            const highPriorityCount = sortedTasks.filter(t => t.priorityIndex >= threshold).length;
            
            dutyResults.push({
                dutyTitle: duty.dutyTitle,
                totalTasks: duty.totalTasks,
                validTasks: validCount,
                avgImportance: avgImportance,
                avgFrequency: avgFrequency,
                avgDifficulty: avgDifficulty,
                avgPriority: avgPriority,
                highPriorityCount: highPriorityCount,
                trainingLoad: trainingLoad
            });
        }
    });
    
    // Sort based on selected option
    const sortBy = document.getElementById('dutySortSelector')?.value || 'priority';
    if (sortBy === 'trainingLoad') {
        dutyResults.sort((a, b) => b.trainingLoad - a.trainingLoad);
    } else {
        dutyResults.sort((a, b) => b.avgPriority - a.avgPriority);
    }
    
    // Generate table rows
    if (dutyResults.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #999;">
                    No valid duty data available. Complete workshop counts to see results.
                </td>
            </tr>
        `;
        return;
    }
    
    const rows = dutyResults.map((duty, index) => {
        return `
            <tr>
                <td><strong>${escapeHtml(duty.dutyTitle)}</strong></td>
                <td style="text-align: center;">${duty.totalTasks}</td>
                <td style="text-align: center;">${duty.validTasks}</td>
                <td style="text-align: center;"><span class="mean-value">${duty.avgImportance.toFixed(2)}</span></td>
                <td style="text-align: center;"><span class="mean-value">${duty.avgFrequency.toFixed(2)}</span></td>
                <td style="text-align: center;"><span class="mean-value">${duty.avgDifficulty.toFixed(2)}</span></td>
                <td style="text-align: center;"><span class="priority-index">${duty.avgPriority.toFixed(2)}</span></td>
                <td style="text-align: center;">${duty.highPriorityCount}</td>
                <td style="text-align: center;"><strong style="color: #667eea;">${duty.trainingLoad.toFixed(2)}</strong></td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = rows;
}

// Export dashboard as CSV
function exportDashboard() {
    if (state.collectionMode !== 'workshop') {
        showStatus('Dashboard export only available in Workshop mode', 'error');
        return;
    }
    
    // Get all valid results
    const validResults = [];
    
    Object.keys(state.workshopResults).forEach(taskKey => {
        const result = state.workshopResults[taskKey];
        if (result && result.valid) {
            // Use stored duty and task titles (with backward compatibility)
            let dutyText = result.dutyTitle;
            let taskText = result.taskTitle;
            
            // Backward compatibility: if not stored, look up from DOM
            if (!dutyText || !taskText) {
                const taskParts = taskKey.split('_task_');
                const dutyId = taskParts[0];
                
                if (!dutyText) {
                    const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                    dutyText = dutyInput ? dutyInput.value.trim() : 'Unassigned Duty';
                }
                
                if (!taskText) {
                    const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
                    taskText = taskInput ? taskInput.value.trim() : 'Unassigned Task';
                }
            }
            
            validResults.push({
                duty: dutyText,
                task: taskText,
                meanImportance: result.meanImportance,
                meanFrequency: result.meanFrequency,
                meanDifficulty: result.meanDifficulty,
                priorityIndex: result.priorityIndex
            });
        }
    });
    
    // Sort by priority index (descending)
    validResults.sort((a, b) => b.priorityIndex - a.priorityIndex);
    
    // Build CSV
    let csv = 'Rank,Duty,Task,Mean Importance,Mean Frequency,Mean Difficulty,Priority Index\n';
    
    validResults.forEach((r, index) => {
        const rank = index + 1;
        csv += `${rank},"${r.duty.replace(/"/g, '""')}","${r.task.replace(/"/g, '""')}",${r.meanImportance.toFixed(2)},${r.meanFrequency.toFixed(2)},${r.meanDifficulty.toFixed(2)},${r.priorityIndex.toFixed(2)}\n`;
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const occupationTitle = document.getElementById('occupationTitle').value || 'DACUM';
    const filename = `${occupationTitle.replace(/[^a-z0-9]/gi, '_')}_Workshop_Results_${new Date().toISOString().split('T')[0]}.csv`;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showStatus('Dashboard exported as CSV successfully! ✓', 'success');
}

// Attach click listeners to accordion headers
function attachAccordionListeners() {
    const headers = document.querySelectorAll('.duty-accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.duty-accordion-header').forEach(h => {
                h.classList.remove('active');
            });
            document.querySelectorAll('.duty-accordion-content').forEach(c => {
                c.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
                this.classList.add('active');
                const content = this.nextElementSibling;
                content.classList.add('active');
            }
        });
    });
}

// Helper function to escape HTML (prevent XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize verification tab when switching to it
// This will be called automatically when tab is opened
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

// ============ END TASK VERIFICATION FUNCTIONS ============


function clearAll() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        // Clear Chart Info
        document.getElementById('dacumDate').value = '';
        document.getElementById('producedFor').value = '';
        document.getElementById('producedBy').value = '';
        document.getElementById('occupationTitle').value = '';
        document.getElementById('jobTitle').value = '';
        document.getElementById('sector').value = '';
        document.getElementById('context').value = '';
        document.getElementById('venue').value = '';
        document.getElementById('facilitators').value = '';
        document.getElementById('observers').value = '';
        document.getElementById('panelMembers').value = '';
        
        // Clear images
        state.producedForImage = null;
        state.producedByImage = null;
        document.getElementById('producedForImagePreview').innerHTML = '<span style="color: #999; font-size: 0.9em;">No image</span>';
        document.getElementById('producedForImagePreview').classList.remove('has-image');
        document.getElementById('producedByImagePreview').innerHTML = '<span style="color: #999; font-size: 0.9em;">No image</span>';
        document.getElementById('producedByImagePreview').classList.remove('has-image');
        document.getElementById('removeProducedForImage').style.display = 'none';
        document.getElementById('removeProducedByImage').style.display = 'none';
        document.getElementById('producedForImageInput').value = '';
        document.getElementById('producedByImageInput').value = '';
        
        // Clear all duties
        document.getElementById('dutiesContainer').innerHTML = '';
        state.dutyCount = 0;
        state.taskCounts = {};
        
        // Add initial duty and task
        addDuty();
        const currentDutyId = `duty_${state.dutyCount}`;
        addTask(currentDutyId);
        
        // Reset Additional Info headings
        document.getElementById('knowledgeHeading').textContent = 'Knowledge Requirements';
        document.getElementById('skillsHeading').textContent = 'Skills Requirements';
        document.getElementById('behaviorsHeading').textContent = 'Worker Behaviors/Traits';
        document.getElementById('toolsHeading').textContent = 'Tools, Equipment, Supplies and Materials';
        document.getElementById('trendsHeading').textContent = 'Future Trends and Concerns';
        document.getElementById('acronymsHeading').textContent = 'Acronyms';
        document.getElementById('careerPathHeading').textContent = 'Career Path';
        
        // Clear Additional Info textareas
        document.getElementById('knowledgeInput').value = '';
        document.getElementById('skillsInput').value = '';
        document.getElementById('behaviorsInput').value = '';
        document.getElementById('toolsInput').value = '';
        document.getElementById('trendsInput').value = '';
        document.getElementById('acronymsInput').value = '';
        document.getElementById('careerPathInput').value = '';
        
        // Clear all custom sections
        document.getElementById('customSectionsContainer').innerHTML = '';
        state.customSectionCounter = 0;
        
        // ============ CLEAR TASK VERIFICATION DATA (Bug Fix A) ============
        // Clear verification ratings
        state.verificationRatings = {};
        
        // Reset collection mode to default "workshop"
        state.collectionMode = 'workshop';
        document.getElementById('mode-workshop').checked = true;
        document.getElementById('mode-survey').checked = false;
        
        // Reset workflow mode to default "standard"
        state.workflowMode = 'standard';
        document.getElementById('workflow-standard').checked = true;
        document.getElementById('workflow-extended').checked = false;
        
        // Clear verification UI container
        const verificationContainer = document.getElementById('verificationAccordionContainer');
        if (verificationContainer) {
            verificationContainer.innerHTML = '';
            verificationContainer.classList.remove('workflow-extended');
        }
        
        // Clear workshop-specific data
        state.workshopParticipants = 10;
        state.workshopCounts = {};
        state.workshopResults = {};
        state.priorityFormula = 'if';
        document.getElementById('workshopParticipants').value = 10;
        document.getElementById('formula-if').checked = true;
        document.getElementById('formula-ifd').checked = false;
        
        // Clear dashboard
        const dashboardTableBody = document.getElementById('dashboardTableBody');
        if (dashboardTableBody) dashboardTableBody.innerHTML = '';
        const dashboardSummary = document.getElementById('dashboardSummary');
        if (dashboardSummary) dashboardSummary.innerHTML = '';
        
        console.log('Task Verification data cleared (including workshop data)');
        // ============ END VERIFICATION DATA CLEARING ============
        
        // ============ RESET DECISION SAFETY ============
        state.verificationDecisionMade = false;
        state.clusteringAllowed = false;
        document.getElementById('btnLWFinalize').disabled = false;
        document.getElementById('btnBypassToClustering').disabled = false;
        document.getElementById('btnResetDecision').style.display = 'none';
        
        // ============ CLEAR CLUSTERING DATA ============
        if (typeof state.clusteringData !== 'undefined') {
            state.clusteringData.clusters = [];
            state.clusteringData.availableTasks = [];
            state.clusteringData.clusterCounter = 0;
        }
        
        // ============ CLEAR LEARNING OUTCOMES DATA ============
        if (typeof state.learningOutcomesData !== 'undefined') {
            state.learningOutcomesData.outcomes = [];
            state.learningOutcomesData.outcomeCounter = 0;
            // Re-render to show empty state
            if (typeof renderLearningOutcomes === 'function') {
                renderLearningOutcomes();
            }
            if (typeof renderPCSourceList === 'function') {
                renderPCSourceList();
            }
        }
        
        // ============ CLEAR MODULE MAPPING DATA ============
        if (typeof state.moduleMappingData !== 'undefined') {
            state.moduleMappingData.modules = [];
            state.moduleMappingData.moduleCounter = 0;
            // Re-render to show empty state
            if (typeof renderModules === 'function') {
                renderModules();
            }
            if (typeof renderModuleLoList === 'function') {
                renderModuleLoList();
            }
        }
        
        // Switch to Chart Info tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector('[data-tab="info-tab"]').classList.add('active');
        document.getElementById('info-tab').classList.add('active');
        
        showStatus('All data cleared! ✓', 'success');
    }
}


function clearCurrentTab(tabId) {
    if (!confirm('Are you sure you want to clear this tab? This cannot be undone!')) {
        return;
    }
    
    if (tabId === 'info-tab') {
        document.getElementById('dacumDate').value = '';
        document.getElementById('venue').value = '';
        document.getElementById('producedFor').value = '';
        document.getElementById('producedBy').value = '';
        document.getElementById('occupationTitle').value = '';
        document.getElementById('jobTitle').value = '';
        document.getElementById('sector').value = '';
        document.getElementById('context').value = '';
        document.getElementById('facilitators').value = '';
        document.getElementById('observers').value = '';
        document.getElementById('panelMembers').value = '';
        state.producedForImage = null;
        state.producedByImage = null;
        document.getElementById('producedForImagePreview').innerHTML = '<span style="color: #999; font-size: 0.9em;">No image</span>';
        document.getElementById('producedForImagePreview').classList.remove('has-image');
        document.getElementById('producedByImagePreview').innerHTML = '<span style="color: #999; font-size: 0.9em;">No image</span>';
        document.getElementById('producedByImagePreview').classList.remove('has-image');
        document.getElementById('removeProducedForImage').style.display = 'none';
        document.getElementById('removeProducedByImage').style.display = 'none';
        document.getElementById('producedForImageInput').value = '';
        document.getElementById('producedByImageInput').value = '';
        showStatus('Chart Info cleared!', 'success');
    } else if (tabId === 'duties-tab') {
        document.getElementById('dutiesContainer').innerHTML = '';
        state.dutyCount = 0;
        state.taskCounts = {};
        addDuty();
        const currentDutyId = `duty_${state.dutyCount}`;
        addTask(currentDutyId);
        showStatus('Duties & Tasks cleared!', 'success');
    } else if (tabId === 'additional-info-tab') {
        document.getElementById('knowledgeInput').value = '';
        document.getElementById('skillsInput').value = '';
        document.getElementById('behaviorsInput').value = '';
        document.getElementById('toolsInput').value = '';
        document.getElementById('trendsInput').value = '';
        document.getElementById('acronymsInput').value = '';
        document.getElementById('careerPathInput').value = '';
        document.getElementById('customSectionsContainer').innerHTML = '';
        state.customSectionCounter = 0;
        // Reset Skills Level Matrix
        resetSkillsLevel();
        showStatus('Additional Info cleared!', 'success');
    } else if (tabId === 'verification-tab') {
        state.verificationRatings = {};
        state.workshopCounts = {};
        state.workshopResults = {};
        const verificationContainer = document.getElementById('verificationAccordionContainer');
        if (verificationContainer) verificationContainer.innerHTML = '';
        const dashboardTableBody = document.getElementById('dashboardTableBody');
        if (dashboardTableBody) dashboardTableBody.innerHTML = '';
        const dashboardSummary = document.getElementById('dashboardSummary');
        if (dashboardSummary) dashboardSummary.innerHTML = '';
        // Reset decision safety
        state.verificationDecisionMade = false;
        state.clusteringAllowed = false;
        document.getElementById('btnLWFinalize').disabled = false;
        document.getElementById('btnBypassToClustering').disabled = false;
        document.getElementById('btnResetDecision').style.display = 'none';
        showStatus('Task Verification cleared!', 'success');
    } else if (tabId === 'clustering-tab') {
        if (typeof state.clusteringData !== 'undefined') {
            state.clusteringData.clusters = [];
            state.clusteringData.availableTasks = [];
            state.clusteringData.clusterCounter = 0;
            if (typeof renderAvailableTasks === 'function') renderAvailableTasks();
            if (typeof renderClusters === 'function') renderClusters();
        }
        showStatus('Competency Clusters cleared!', 'success');
    } else if (tabId === 'learning-outcomes-tab') {
        if (typeof state.learningOutcomesData !== 'undefined') {
            state.learningOutcomesData.outcomes = [];
            state.learningOutcomesData.outcomeCounter = 0;
            if (typeof renderLearningOutcomes === 'function') renderLearningOutcomes();
            if (typeof renderPCSourceList === 'function') renderPCSourceList();
        }
        showStatus('Learning Outcomes cleared!', 'success');
    } else if (tabId === 'module-mapping-tab') {
        if (typeof state.moduleMappingData !== 'undefined') {
            state.moduleMappingData.modules = [];
            state.moduleMappingData.moduleCounter = 0;
            if (typeof renderModules === 'function') renderModules();
            if (typeof renderModuleLoList === 'function') renderModuleLoList();
        }
        showStatus('Module Mapping cleared!', 'success');
    }
}

// Save to JSON

// ============ STANDALONE TASK VERIFICATION WORD EXPORT ============
async function exportTaskVerificationWord() {
    try {
        // Check if we have Task Verification data
        if (state.collectionMode !== 'workshop' || !state.workshopResults || Object.keys(state.workshopResults).length === 0) {
            alert('No Task Verification data available. Please complete workshop counts in the Task Verification tab first.');
            return;
        }
        
        const validResults = Object.keys(state.workshopResults).filter(key => 
            state.workshopResults[key] && state.workshopResults[key].valid
        );
        
        if (validResults.length === 0) {
            alert('No valid Task Verification results. Please ensure all required fields are completed.');
            return;
        }
        
        if (typeof window.docx === 'undefined') {
            showStatus('Error: Word export library not loaded. Please refresh the page.', 'error');
            return;
        }

        const { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ShadingType, Packer } = window.docx;

        showStatus('Generating Task Verification Word document...', 'success');

        const children = [];
        
        const occupationTitleInput = document.getElementById('occupationTitle');
        const occupationTitle = occupationTitleInput ? occupationTitleInput.value : 'Unknown Occupation';
        
        // Title
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: 'Task Verification & Training Priority Analysis',
                    bold: true,
                    size: 32,
                }),
            ],
            spacing: { after: 300 },
            bidirectional: false, // Force LTR
        }));
        
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `Occupation: ${occupationTitle}`,
                    bold: true,
                    size: 28,
                }),
            ],
            spacing: { after: 200 },
            bidirectional: false, // Force LTR
        }));
        
        const today = new Date().toLocaleDateString();
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `Date of Analysis: ${today}`,
                    size: 24,
                }),
            ],
            spacing: { after: 200 },
            bidirectional: false, // Force LTR
        }));
        
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `This Task Verification is based on the DACUM Chart for ${occupationTitle}.`,
                    italics: true,
                    size: 20,
                }),
            ],
            spacing: { after: 400 },
            bidirectional: false, // Force LTR
        }));
        
        // Methodology Summary
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: 'Methodology Summary',
                    bold: true,
                    size: 28,
                }),
            ],
            spacing: { after: 200 },
            bidirectional: false, // Force LTR
        }));
        
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `Data Collection Mode: ${state.collectionMode === 'workshop' ? 'Workshop (Facilitated)' : 'Individual/Survey'}`,
                    size: 22,
                }),
            ],
            spacing: { after: 100 },
            bidirectional: false, // Force LTR
        }));
        
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `Number of Participants: ${state.workshopParticipants}`,
                    size: 22,
                }),
            ],
            spacing: { after: 100 },
            bidirectional: false, // Force LTR
        }));
        
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `Workflow Mode: ${state.workflowMode === 'standard' ? 'Standard (DACUM)' : 'Extended (DACUM)'}`,
                    size: 22,
                }),
            ],
            spacing: { after: 100 },
            bidirectional: false, // Force LTR
        }));
        
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `Priority Formula: ${state.priorityFormula === 'if' ? 'Importance × Frequency' : 'Importance × Frequency × Difficulty'}`,
                    size: 22,
                }),
            ],
            spacing: { after: 400 },
            bidirectional: false, // Force LTR
        }));
        
        // Priority Rankings
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: 'Priority Rankings',
                    bold: true,
                    size: 28,
                }),
            ],
            spacing: { after: 200 },
            bidirectional: false, // Force LTR
        }));
        
        // Get and sort results
        const sortedResults = [];
        validResults.forEach(taskKey => {
            const result = state.workshopResults[taskKey];
            
            // Use stored duty and task titles (with backward compatibility)
            let dutyText = result.dutyTitle;
            let taskText = result.taskTitle;
            
            // Backward compatibility: if not stored, look up from DOM
            if (!dutyText || !taskText) {
                const taskParts = taskKey.split('_task_');
                const dutyId = taskParts[0];
                
                if (!dutyText) {
                    const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                    dutyText = dutyInput ? dutyInput.value.trim() : 'Unassigned';
                }
                
                if (!taskText) {
                    const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
                    taskText = taskInput ? taskInput.value.trim() : 'Unassigned';
                }
            }
            
            sortedResults.push({
                duty: dutyText,
                task: taskText,
                meanI: result.meanImportance,
                meanF: result.meanFrequency,
                meanD: result.meanDifficulty,
                priority: result.priorityIndex
            });
        });
        
        sortedResults.sort((a, b) => b.priority - a.priority);
        
        // Create table
        const tableRows = [];
        
        // Header row
        tableRows.push(new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Rank', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                    shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Duty', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                    shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Task', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                    shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Mean I', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                    shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Mean F', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                    shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Mean D', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                    shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Priority', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                    shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                }),
            ],
        }));
        
        // Data rows
        sortedResults.forEach((row, index) => {
            tableRows.push(new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `#${index + 1}` })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ text: row.duty, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ text: row.task, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.meanI !== null ? row.meanI.toFixed(2) : 'N/A' })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.meanF !== null ? row.meanF.toFixed(2) : 'N/A' })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.meanD !== null ? row.meanD.toFixed(2) : 'N/A' })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.priority !== null ? row.priority.toFixed(2) : 'N/A' })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                ],
            }));
        });
        
        children.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
        }));
        
        // Duty-Level Summary section
        children.push(new Paragraph({ spacing: { after: 400 } }));
        
        children.push(new Paragraph({
            children: [new TextRun({ text: 'Duty-Level Summary', bold: true, size: 28 })],
            spacing: { after: 200 },
            bidirectional: false,
        }));
        
        children.push(new Paragraph({
            children: [new TextRun({ text: `Training Load Method: ${state.trainingLoadMethod === 'advanced' ? 'Advanced (Σ Priority × Difficulty)' : 'Simple (Avg Priority × Tasks)'}`, size: 20, italics: true })],
            spacing: { after: 200 },
            bidirectional: false,
        }));
        
        // Aggregate duty-level data
        const dutyMap = {};
        Object.keys(state.workshopResults).forEach(taskKey => {
            const result = state.workshopResults[taskKey];
            if (result && result.valid) {
                let dutyId = result.dutyId || taskKey.split('_task_')[0];
                let dutyTitle = result.dutyTitle;
                
                if (!dutyTitle) {
                    const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                    dutyTitle = dutyInput ? dutyInput.value.trim() : 'Unassigned';
                }
                
                if (!dutyMap[dutyId]) {
                    dutyMap[dutyId] = { dutyTitle: dutyTitle, validTasks: 0, prioritySum: 0, tasks: [] };
                }
                
                dutyMap[dutyId].validTasks++;
                dutyMap[dutyId].prioritySum += result.priorityIndex;
                dutyMap[dutyId].tasks.push({ priorityIndex: result.priorityIndex, meanDifficulty: result.meanDifficulty });
            }
        });
        
        const dutyResults = [];
        Object.keys(dutyMap).forEach(dutyId => {
            const duty = dutyMap[dutyId];
            const avgPriority = duty.prioritySum / duty.validTasks;
            let trainingLoad = 0;
            if (state.trainingLoadMethod === 'advanced') {
                trainingLoad = duty.tasks.reduce((sum, t) => sum + (t.priorityIndex * t.meanDifficulty), 0);
            } else {
                trainingLoad = avgPriority * duty.validTasks;
            }
            dutyResults.push({ dutyTitle: duty.dutyTitle, validTasks: duty.validTasks, avgPriority: avgPriority, trainingLoad: trainingLoad });
        });
        
        dutyResults.sort((a, b) => b.avgPriority - a.avgPriority);
        
        // Duty table
        const dutyTableRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Duty Title', bold: true })], alignment: AlignmentType.LEFT, bidirectional: false })], shading: { fill: '667eea' } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tasks', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })], shading: { fill: '667eea' } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Avg Priority', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })], shading: { fill: '667eea' } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Training Load', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })], shading: { fill: '667eea' } }),
                ],
            })
        ];
        
        dutyResults.forEach(duty => {
            dutyTableRows.push(new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: duty.dutyTitle, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: duty.validTasks.toString() })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: duty.avgPriority.toFixed(2) })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: duty.trainingLoad.toFixed(2), bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                ],
            }));
        });
        
        children.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: dutyTableRows,
        }));
        
        // Notes section
        children.push(new Paragraph({ spacing: { after: 400 } }));
        
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: 'Notes & Methodology',
                    bold: true,
                    size: 24,
                }),
            ],
            spacing: { after: 200 },
            bidirectional: false, // Force LTR
        }));
        
        const notes = [
            'Weighted Mean = Σ(value × count) ÷ total responses',
            'Importance scale: 0=Not Important, 1=Somewhat, 2=Important, 3=Critical',
            'Frequency scale: 0=Rarely, 1=Sometimes, 2=Often, 3=Daily',
            'Difficulty scale: 0=Easy, 1=Moderate, 2=Challenging, 3=Very Difficult',
            `Priority Index = ${state.priorityFormula === 'if' ? 'Mean Importance × Mean Frequency' : 'Mean Importance × Mean Frequency × Mean Difficulty'}`,
            'Higher priority values indicate greater training importance',
            'Results follow DACUM (Developing A Curriculum) methodology'
        ];
        
        notes.forEach(note => {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `• ${note}`,
                        size: 20,
                    }),
                ],
                spacing: { after: 100 },
                bidirectional: false, // Force LTR
            }));
        });
        
        // Create document
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440,
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                children: children,
            }],
        });

        // Generate and download
        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${occupationTitle.replace(/[^a-z0-9]/gi, '_')}_Task_Verification.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showStatus('Task Verification Word document exported successfully! ✓', 'success');

    } catch (error) {
        console.error('Error generating Task Verification Word document:', error);
        showStatus('Error generating Task Verification Word document: ' + error.message, 'error');
    }
}

async function exportToWord() {
    // ============ CHECK FOR VERIFIED LIVE WORKSHOP RESULTS ============
    const hasVerifiedResults = typeof state.lwFinalizedData !== 'undefined' && state.lwFinalizedData && 
                                typeof state.lwAggregatedResults !== 'undefined' && state.lwAggregatedResults;
    
    // ============ VERIFIED LIVE WORKSHOP STANDALONE EXPORT ============
    if (hasVerifiedResults && state.tvExportMode === 'standalone') {
        await lwExportVerifiedDOCX();
        return;
    }
    
    // ============ REGULAR TASK VERIFICATION STANDALONE EXPORT ============
    if (!hasVerifiedResults && state.tvExportMode === 'standalone') {
        await exportTaskVerificationWord();
        return;
    }
    
    // ============ NORMAL DACUM EXPORT (with optional appendix) ============
    try {
        if (typeof window.docx === 'undefined') {
            showStatus('Error: Word export library not loaded. Please refresh the page.', 'error');
            return;
        }

        const { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, Packer, PageBreak, convertInchesToTwip, ShadingType, TextDirection, ImageRun } = window.docx;

        // Get all input values
        const dacumDateValue = document.getElementById('dacumDate').value;
        let dacumDate = '';
        if (dacumDateValue) {
            const dateObj = new Date(dacumDateValue + 'T00:00:00');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const year = dateObj.getFullYear();
            dacumDate = `${month}/${day}/${year}`;
        }
        const producedFor = document.getElementById('producedFor').value;
        const producedBy = document.getElementById('producedBy').value;
        const occupationTitle = document.getElementById('occupationTitle').value;
        const jobTitle = document.getElementById('jobTitle').value;

        if (!occupationTitle || !jobTitle) {
            showStatus('Please fill in at least the Occupation Title and Job Title', 'error');
            return;
        }

        showStatus('Generating Word document...', 'success');

        const children = [];

        // ============ TITLE PAGE ============
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `Occupation Title: ${occupationTitle}`,
                    bold: true,
                    size: 28, // 14pt
                }),
            ],
            spacing: { after: 200 },
            bidirectional: false,
        }));

        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: `Job Title: ${jobTitle}`,
                    bold: true,
                    size: 28, // 14pt
                }),
            ],
            spacing: { after: 200 },
            bidirectional: false,
        }));

        // Add DACUM Date if exists
        if (dacumDate) {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `DACUM Date: ${dacumDate}`,
                        bold: true,
                        size: 24, // 12pt
                    }),
                ],
                spacing: { after: 200 },
                bidirectional: false,
            }));
        }
        
        // Add Venue if exists
        const venueValue = document.getElementById('venue')?.value;
        if (venueValue) {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `Venue: ${venueValue}`,
                        bold: true,
                        size: 24, // 12pt
                    }),
                ],
                spacing: { after: 200 },
                bidirectional: false,
            }));
        }

        // Add Produced For if exists
        if (producedFor) {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `Produced For: ${producedFor}`,
                        bold: true,
                        size: 24, // 12pt
                    }),
                ],
                spacing: { after: 200 },
                bidirectional: false,
            }));
            
            // Add Produced For logo if exists
            if (state.producedForImage) {
                try {
                    const base64Data = state.producedForImage.split(',')[1];
                    
                    children.push(new Paragraph({
                        children: [
                            new ImageRun({
                                data: Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)),
                                transformation: {
                                    width: 94, // 2.5cm = 94 points approximately
                                    height: 94,
                                },
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                    }));
                } catch (imgError) {
                    console.error('Error adding Produced For image:', imgError);
                }
            }
        }

        // Add Produced By if exists
        if (producedBy) {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `Produced By: ${producedBy}`,
                        bold: true,
                        size: 24, // 12pt
                    }),
                ],
                spacing: { after: 200 },
                bidirectional: false,
            }));
            
            // Add Produced By logo if exists
            if (state.producedByImage) {
                try {
                    const base64Data = state.producedByImage.split(',')[1];
                    
                    children.push(new Paragraph({
                        children: [
                            new ImageRun({
                                data: Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)),
                                transformation: {
                                    width: 94, // 2.5cm = 94 points approximately
                                    height: 94,
                                },
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }));
                } catch (imgError) {
                    console.error('Error adding Produced By image:', imgError);
                }
            }
        } else {
            // Add extra spacing if no Produced By section
            children.push(new Paragraph({ spacing: { after: 200 } }));
        }

        // Workshop Roles Section
        const facilitatorsText = document.getElementById('facilitators')?.value.trim();
        const observersText = document.getElementById('observers')?.value.trim();
        const panelMembersText = document.getElementById('panelMembers')?.value.trim();
        
        if (facilitatorsText) {
            const facilitatorNames = facilitatorsText.split('\n').map(s => s.trim()).filter(s => s);
            if (facilitatorNames.length > 0) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Facilitators',
                            bold: true,
                            size: 24, // 12pt
                        }),
                    ],
                    spacing: { before: 200, after: 100 },
                    bidirectional: false,
                }));
                
                const facilitatorRows = facilitatorNames.map(name => 
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: name,
                                                size: 22, // 11pt
                                            }),
                                        ],
                                        bidirectional: false,
                                    }),
                                ],
                            }),
                        ],
                    })
                );
                
                children.push(new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: facilitatorRows,
                }));
            }
        }
        
        if (observersText) {
            const observerNames = observersText.split('\n').map(s => s.trim()).filter(s => s);
            if (observerNames.length > 0) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Observers',
                            bold: true,
                            size: 24, // 12pt
                        }),
                    ],
                    spacing: { before: 200, after: 100 },
                    bidirectional: false,
                }));
                
                const observerRows = observerNames.map(name => 
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: name,
                                                size: 22, // 11pt
                                            }),
                                        ],
                                        bidirectional: false,
                                    }),
                                ],
                            }),
                        ],
                    })
                );
                
                children.push(new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: observerRows,
                }));
            }
        }
        
        if (panelMembersText) {
            const panelMemberNames = panelMembersText.split('\n').map(s => s.trim()).filter(s => s);
            if (panelMemberNames.length > 0) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Panel Members',
                            bold: true,
                            size: 24, // 12pt
                        }),
                    ],
                    spacing: { before: 200, after: 100 },
                    bidirectional: false,
                }));
                
                const panelMemberRows = panelMemberNames.map(name => 
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: name,
                                                size: 22, // 11pt
                                            }),
                                        ],
                                        bidirectional: false,
                                    }),
                                ],
                            }),
                        ],
                    })
                );
                
                children.push(new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: panelMemberRows,
                }));
            }
        }

        // ============ DUTIES AND TASKS (NEW PAGE) ============
        children.push(new Paragraph({
            children: [
                new PageBreak(),
                new TextRun({
                    text: 'Duties and Tasks',
                    bold: true,
                    size: 28, // 14pt
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            bidirectional: false,
        }));

        // Collect duties and tasks
        const dutyInputs = document.querySelectorAll('[data-duty-id]');
        const duties = [];
        
        dutyInputs.forEach(dutyInput => {
            const dutyText = dutyInput.value.trim();
            if (dutyText) {
                const dutyId = dutyInput.getAttribute('data-duty-id');
                const taskInputs = document.querySelectorAll(`[data-task-id^="${dutyId}_"]`);
                const tasks = [];
                
                taskInputs.forEach(taskInput => {
                    const taskText = taskInput.value.trim();
                    if (taskText) {
                        tasks.push(taskText);
                    }
                });
                
                duties.push({
                    duty: dutyText,
                    tasks: tasks
                });
            }
        });

        // Create a table for each duty
        duties.forEach((dutyData, dutyIndex) => {
            const dutyLetter = String.fromCharCode(65 + dutyIndex); // A, B, C...
            const dutyLabel = `DUTY ${dutyLetter}: ${dutyData.duty}`;
            
            // Calculate number of rows needed (header + task rows)
            const tasksPerRow = 4;
            const numTaskRows = Math.ceil(dutyData.tasks.length / tasksPerRow);
            const tableRows = [];
            
            // Header row (duty description spans all 4 columns)
            tableRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: dutyLabel,
                                            bold: true,
                                            size: 24, // 12pt
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                            ],
                            columnSpan: 4,
                            shading: {
                                fill: "E8E8E8", // Light gray
                                type: ShadingType.SOLID,
                            },
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                    ],
                })
            );
            
            // Task rows (4 tasks per row)
            for (let row = 0; row < numTaskRows; row++) {
                const rowCells = [];
                
                for (let col = 0; col < tasksPerRow; col++) {
                    const taskIndex = row * tasksPerRow + col;
                    
                    if (taskIndex < dutyData.tasks.length) {
                        const taskLabel = `Task ${dutyLetter}${taskIndex + 1}`;
                        const taskText = `${taskLabel}: ${dutyData.tasks[taskIndex]}`;
                        
                        rowCells.push(
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: taskText,
                                                size: 24, // 12pt
                                            }),
                                        ],
                                        bidirectional: false,
                                    }),
                                ],
                                width: {
                                    size: 25,
                                    type: WidthType.PERCENTAGE,
                                },
                            })
                        );
                    } else {
                        // Empty cell
                        rowCells.push(
                            new TableCell({
                                children: [new Paragraph('')],
                                width: {
                                    size: 25,
                                    type: WidthType.PERCENTAGE,
                                },
                            })
                        );
                    }
                }
                
                tableRows.push(new TableRow({ children: rowCells }));
            }
            
            // Create the table with 16cm width
            children.push(
                new Table({
                    width: {
                        size: 9071, // 16cm in twips (16 * 567.05 ≈ 9071)
                        type: WidthType.DXA,
                    },
                    layout: "fixed", // Fixed table layout for consistent width
                    rows: tableRows,
                })
            );
            
            // Add spacing after table
            children.push(new Paragraph({ spacing: { after: 200 } }));
        });

        // ============ ADDITIONAL INFORMATION (NEW PAGE) ============
        children.push(new Paragraph({
            children: [
                new PageBreak(),
                new TextRun({
                    text: 'Additional Information',
                    bold: true,
                    size: 24, // 12pt
                }),
            ],
            spacing: { after: 300 },
            bidirectional: false,
        }));

        // Create 2-column tables for additional info
        const additionalInfoSections = [
            {
                heading1: document.getElementById('knowledgeHeading').textContent,
                content1: document.getElementById('knowledgeInput').value.trim(),
                heading2: document.getElementById('behaviorsHeading').textContent,
                content2: document.getElementById('behaviorsInput').value.trim(),
            },
            {
                heading1: document.getElementById('skillsHeading').textContent,
                content1: document.getElementById('skillsInput').value.trim(),
                heading2: '', // Empty for single column
                content2: '',
            },
            {
                heading1: document.getElementById('toolsHeading').textContent,
                content1: document.getElementById('toolsInput').value.trim(),
                heading2: document.getElementById('trendsHeading').textContent,
                content2: document.getElementById('trendsInput').value.trim(),
            },
            {
                heading1: document.getElementById('acronymsHeading').textContent,
                content1: document.getElementById('acronymsInput').value.trim(),
                heading2: document.getElementById('careerPathHeading').textContent,
                content2: document.getElementById('careerPathInput').value.trim(),
            },
        ];

        additionalInfoSections.forEach((section, index) => {
            // Special handling for Acronyms (index 3, content1) - separate table with heading in first cell
            if (index === 3 && section.content1) {
                const row = new TableRow({
                    children: [
                        // First cell: Heading only with gray background
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: section.heading1,
                                            bold: true,
                                            size: 24, // 12pt
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                            ],
                            shading: {
                                fill: "E8E8E8", // Light gray background
                                type: ShadingType.SOLID,
                            },
                            width: {
                                size: 30,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                        // Second cell: Content only
                        new TableCell({
                            children: section.content1.split('\n').filter(line => line.trim()).map(line => 
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: line.trim().replace(/^[•\-*]\s*/, '• '),
                                            size: 24, // 12pt
                                        }),
                                    ],
                                    bidirectional: false,
                                })
                            ),
                            width: {
                                size: 70,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                    ],
                });
                
                children.push(
                    new Table({
                        width: {
                            size: 9071, // 16cm in twips
                            type: WidthType.DXA,
                        },
                        layout: "fixed",
                        rows: [row],
                    })
                );
                
                children.push(new Paragraph({ spacing: { after: 200 } }));
            }
            // Regular format for all other sections (heading + content together)
            else if (section.content1 || section.content2) {
                const row = new TableRow({
                    children: [
                        // Left column
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: section.heading1,
                                            bold: true,
                                            size: 24, // 12pt
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                                ...section.content1.split('\n').filter(line => line.trim()).map(line => 
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: line.trim().replace(/^[•\-*]\s*/, '• '),
                                                size: 24, // 12pt
                                            }),
                                        ],
                                        bidirectional: false,
                                    })
                                ),
                            ],
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                        // Right column
                        new TableCell({
                            children: section.content2 ? [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: section.heading2,
                                            bold: true,
                                            size: 24, // 12pt
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                                ...section.content2.split('\n').filter(line => line.trim()).map(line => 
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: line.trim().replace(/^[•\-*]\s*/, '• '),
                                                size: 24, // 12pt
                                            }),
                                        ],
                                        bidirectional: false,
                                    })
                                ),
                            ] : [new Paragraph('')],
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                    ],
                });
                
                children.push(
                    new Table({
                        width: {
                            size: 9071, // 16cm in twips
                            type: WidthType.DXA,
                        },
                        layout: "fixed",
                        rows: [row],
                    })
                );
                
                children.push(new Paragraph({ spacing: { after: 200 } }));
            }
        });

        // Add custom sections
        const customSectionsContainer = document.getElementById('customSectionsContainer');
        const customSectionDivs = customSectionsContainer.querySelectorAll('.section-container');
        
        customSectionDivs.forEach(sectionDiv => {
            const headingElement = sectionDiv.querySelector('h3');
            const textareaElement = sectionDiv.querySelector('textarea');
            
            if (headingElement && textareaElement && textareaElement.value.trim()) {
                const row = new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: headingElement.textContent,
                                            bold: true,
                                            size: 24, // 12pt
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                                ...textareaElement.value.split('\n').filter(line => line.trim()).map(line => 
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: line.trim().replace(/^[•\-*]\s*/, '• '),
                                                size: 24, // 12pt
                                            }),
                                        ],
                                        bidirectional: false,
                                    })
                                ),
                            ],
                            columnSpan: 2,
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                    ],
                });
                
                children.push(
                    new Table({
                        width: {
                            size: 9071, // 16cm in twips
                            type: WidthType.DXA,
                        },
                        layout: "fixed", // Fixed table layout for consistent width
                        rows: [row],
                    })
                );
                
                children.push(new Paragraph({ spacing: { after: 200 } }));
            }
        });

        // ============ SKILLS LEVEL MATRIX EXPORT ============
        // Check if there's any meaningful data in Skills Level Matrix
        const hasSkillsLevelData = state.skillsLevelDataAdditional && state.skillsLevelDataAdditional.some(category => 
            category.category.trim() !== '' || category.competencies.some(comp => comp.text.trim() !== '')
        );

        if (hasSkillsLevelData) {
            // Add Skills Level Matrix heading
            children.push(new Paragraph({ spacing: { after: 200 } }));
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: 'Employability Competencies by Occupational Level',
                        bold: true,
                        size: 24, // 12pt
                    }),
                ],
                spacing: { after: 200 },
                bidirectional: false,
            }));

            // Create Skills Level Matrix table
            state.skillsLevelDataAdditional.forEach(category => {
                // Skip empty categories
                if (category.category.trim() === '' && category.competencies.every(c => c.text.trim() === '')) {
                    return;
                }

                // Category header row
                const headerRow = new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: category.category || `Category ${category.id}`,
                                            bold: true,
                                            size: 24,
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                            ],
                            columnSpan: 5,
                            shading: {
                                fill: "E8E8E8",
                                type: ShadingType.SOLID,
                            },
                        }),
                    ],
                });

                // Column headers row
                const columnHeaderRow = new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'Competency',
                                            bold: true,
                                            size: 22,
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                            ],
                            width: { size: 40, type: WidthType.PERCENTAGE },
                            shading: {
                                fill: "F5F5F5",
                                type: ShadingType.SOLID,
                            },
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'Craftsman/\nSupervisor',
                                            bold: true,
                                            size: 20,
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                            ],
                            width: { size: 15, type: WidthType.PERCENTAGE },
                            shading: {
                                fill: "F5F5F5",
                                type: ShadingType.SOLID,
                            },
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'Skilled',
                                            bold: true,
                                            size: 20,
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                            ],
                            width: { size: 15, type: WidthType.PERCENTAGE },
                            shading: {
                                fill: "F5F5F5",
                                type: ShadingType.SOLID,
                            },
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'Semi-skilled',
                                            bold: true,
                                            size: 20,
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                            ],
                            width: { size: 15, type: WidthType.PERCENTAGE },
                            shading: {
                                fill: "F5F5F5",
                                type: ShadingType.SOLID,
                            },
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'Foundation\nskills',
                                            bold: true,
                                            size: 20,
                                        }),
                                    ],
                                    bidirectional: false,
                                }),
                            ],
                            width: { size: 15, type: WidthType.PERCENTAGE },
                            shading: {
                                fill: "F5F5F5",
                                type: ShadingType.SOLID,
                            },
                        }),
                    ],
                });

                // Competency rows
                const competencyRows = category.competencies
                    .filter(comp => comp.text.trim() !== '')
                    .map(competency => {
                        return new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: `${competency.id}. ${competency.text}`,
                                                    size: 22,
                                                }),
                                            ],
                                            bidirectional: false,
                                        }),
                                    ],
                                    width: { size: 40, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: competency.levels.craftsman ? '✓' : '',
                                                    size: 22,
                                                }),
                                            ],
                                            alignment: AlignmentType.CENTER,
                                            bidirectional: false,
                                        }),
                                    ],
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: competency.levels.skilled ? '✓' : '',
                                                    size: 22,
                                                }),
                                            ],
                                            alignment: AlignmentType.CENTER,
                                            bidirectional: false,
                                        }),
                                    ],
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: competency.levels.semiSkilled ? '✓' : '',
                                                    size: 22,
                                                }),
                                            ],
                                            alignment: AlignmentType.CENTER,
                                            bidirectional: false,
                                        }),
                                    ],
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: competency.levels.foundation ? '✓' : '',
                                                    size: 22,
                                                }),
                                            ],
                                            alignment: AlignmentType.CENTER,
                                            bidirectional: false,
                                        }),
                                    ],
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                }),
                            ],
                        });
                    });

                // Add table for this category
                children.push(
                    new Table({
                        width: {
                            size: 9071, // 16cm in twips
                            type: WidthType.DXA,
                        },
                        layout: "fixed",
                        rows: [headerRow, columnHeaderRow, ...competencyRows],
                    })
                );
                
                children.push(new Paragraph({ spacing: { after: 200 } }));
            });
        }

        // ============ TASK VERIFICATION APPENDIX (if mode = 'appendix') ============
        if (state.tvExportMode === 'appendix' && state.collectionMode === 'workshop') {
            const validResults = Object.keys(state.workshopResults).filter(key => 
                state.workshopResults[key] && state.workshopResults[key].valid
            );
            
            if (validResults.length > 0) {
                // Page break before appendix
                children.push(new Paragraph({
                    children: [new PageBreak()],
                }));
                
                // Appendix title
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Task Verification & Training Priority Analysis (Appendix)',
                            bold: true,
                            size: 32, // 16pt
                        }),
                    ],
                    spacing: { after: 300 },
                    bidirectional: false, // Force LTR for Task Verification section
                }));
                
                // Methodology Summary heading
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Methodology Summary',
                            bold: true,
                            size: 28, // 14pt
                        }),
                    ],
                    spacing: { after: 200 },
                    bidirectional: false, // Force LTR
                }));
                
                // Methodology details
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: `Data Collection Mode: ${state.collectionMode === 'workshop' ? 'Workshop (Facilitated)' : 'Individual/Survey'}`,
                            size: 22,
                        }),
                    ],
                    spacing: { after: 100 },
                    bidirectional: false, // Force LTR
                }));
                
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: `Number of Participants: ${state.workshopParticipants}`,
                            size: 22,
                        }),
                    ],
                    spacing: { after: 100 },
                    bidirectional: false, // Force LTR
                }));
                
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: `Workflow Mode: ${state.workflowMode === 'standard' ? 'Standard (DACUM)' : 'Extended (DACUM)'}`,
                            size: 22,
                        }),
                    ],
                    spacing: { after: 100 },
                    bidirectional: false, // Force LTR
                }));
                
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: `Priority Formula: ${state.priorityFormula === 'if' ? 'Importance × Frequency' : 'Importance × Frequency × Difficulty'}`,
                            size: 22,
                        }),
                    ],
                    spacing: { after: 300 },
                    bidirectional: false, // Force LTR
                }));
                
                // Priority Rankings heading
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Priority Rankings',
                            bold: true,
                            size: 28,
                        }),
                    ],
                    spacing: { after: 200 },
                    bidirectional: false, // Force LTR
                }));
                
                // Get and sort results
                const sortedResults = [];
                validResults.forEach(taskKey => {
                    const result = state.workshopResults[taskKey];
                    
                    // Use stored duty and task titles (with backward compatibility)
                    let dutyText = result.dutyTitle;
                    let taskText = result.taskTitle;
                    
                    // Backward compatibility: if not stored, look up from DOM
                    if (!dutyText || !taskText) {
                        const taskParts = taskKey.split('_task_');
                        const dutyId = taskParts[0];
                        
                        if (!dutyText) {
                            const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                            dutyText = dutyInput ? dutyInput.value.trim() : 'Unassigned';
                        }
                        
                        if (!taskText) {
                            const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
                            taskText = taskInput ? taskInput.value.trim() : 'Unassigned';
                        }
                    }
                    
                    sortedResults.push({
                        duty: dutyText,
                        task: taskText,
                        meanI: result.meanImportance,
                        meanF: result.meanFrequency,
                        meanD: result.meanDifficulty,
                        priority: result.priorityIndex
                    });
                });
                
                sortedResults.sort((a, b) => b.priority - a.priority);
                
                // Create table
                const tableRows = [];
                
                // Header row
                tableRows.push(new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'Rank', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                            shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'Duty', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                            shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'Task', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                            shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'Mean I', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                            shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'Mean F', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                            shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'Mean D', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                            shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'Priority', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })],
                            shading: { fill: '667eea', type: ShadingType.SOLID, color: 'ffffff' },
                        }),
                    ],
                }));
                
                // Data rows
                sortedResults.forEach((row, index) => {
                    tableRows.push(new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `#${index + 1}` })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ text: row.duty, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ text: row.task, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.meanI !== null ? row.meanI.toFixed(2) : 'N/A' })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.meanF !== null ? row.meanF.toFixed(2) : 'N/A' })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.meanD !== null ? row.meanD.toFixed(2) : 'N/A' })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.priority !== null ? row.priority.toFixed(2) : 'N/A' })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                        ],
                    }));
                });
                
                children.push(new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: tableRows,
                }));
                
                // Duty-Level Summary section
                children.push(new Paragraph({ spacing: { after: 400 } }));
                
                children.push(new Paragraph({
                    children: [new TextRun({ text: 'Duty-Level Summary', bold: true, size: 28 })],
                    spacing: { after: 200 },
                    bidirectional: false,
                }));
                
                children.push(new Paragraph({
                    children: [new TextRun({ text: `Training Load Method: ${state.trainingLoadMethod === 'advanced' ? 'Advanced (Σ Priority × Difficulty)' : 'Simple (Avg Priority × Tasks)'}`, size: 20, italics: true })],
                    spacing: { after: 200 },
                    bidirectional: false,
                }));
                
                // Aggregate duty-level data
                const appendixDutyMap = {};
                Object.keys(state.workshopResults).forEach(taskKey => {
                    const result = state.workshopResults[taskKey];
                    if (result && result.valid) {
                        let dutyId = result.dutyId || taskKey.split('_task_')[0];
                        let dutyTitle = result.dutyTitle;
                        
                        if (!dutyTitle) {
                            const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                            dutyTitle = dutyInput ? dutyInput.value.trim() : 'Unassigned';
                        }
                        
                        if (!appendixDutyMap[dutyId]) {
                            appendixDutyMap[dutyId] = { dutyTitle: dutyTitle, validTasks: 0, prioritySum: 0, tasks: [] };
                        }
                        
                        appendixDutyMap[dutyId].validTasks++;
                        appendixDutyMap[dutyId].prioritySum += result.priorityIndex;
                        appendixDutyMap[dutyId].tasks.push({ priorityIndex: result.priorityIndex, meanDifficulty: result.meanDifficulty });
                    }
                });
                
                const appendixDutyResults = [];
                Object.keys(appendixDutyMap).forEach(dutyId => {
                    const duty = appendixDutyMap[dutyId];
                    const avgPriority = duty.prioritySum / duty.validTasks;
                    let trainingLoad = 0;
                    if (state.trainingLoadMethod === 'advanced') {
                        trainingLoad = duty.tasks.reduce((sum, t) => sum + (t.priorityIndex * t.meanDifficulty), 0);
                    } else {
                        trainingLoad = avgPriority * duty.validTasks;
                    }
                    appendixDutyResults.push({ dutyTitle: duty.dutyTitle, validTasks: duty.validTasks, avgPriority: avgPriority, trainingLoad: trainingLoad });
                });
                
                appendixDutyResults.sort((a, b) => b.avgPriority - a.avgPriority);
                
                // Duty table
                const dutyTableRows = [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Duty Title', bold: true })], alignment: AlignmentType.LEFT, bidirectional: false })], shading: { fill: '667eea' } }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tasks', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })], shading: { fill: '667eea' } }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Avg Priority', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })], shading: { fill: '667eea' } }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Training Load', bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })], shading: { fill: '667eea' } }),
                        ],
                    })
                ];
                
                appendixDutyResults.forEach(duty => {
                    dutyTableRows.push(new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: duty.dutyTitle, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: duty.validTasks.toString() })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: duty.avgPriority.toFixed(2) })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: duty.trainingLoad.toFixed(2), bold: true })], alignment: AlignmentType.CENTER, bidirectional: false })] }),
                        ],
                    }));
                });
                
                children.push(new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: dutyTableRows,
                }));
                
                // Notes section
                children.push(new Paragraph({ spacing: { after: 300 } }));
                
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Notes',
                            bold: true,
                            size: 24,
                        }),
                    ],
                    spacing: { after: 200 },
                    bidirectional: false, // Force LTR
                }));
                
                const notes = [
                    'Weighted Mean = Σ(value × count) ÷ total responses',
                    'Priority Index calculated using selected formula',
                    'Higher priority values indicate greater training importance',
                    'Results based on DACUM methodology'
                ];
                
                notes.forEach(note => {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `• ${note}`,
                                size: 20,
                            }),
                        ],
                        spacing: { after: 100 },
                        bidirectional: false, // Force LTR
                    }));
                });
            }
        }

        // ============ VERIFIED LIVE WORKSHOP RESULTS APPENDIX ============
        if (state.tvExportMode === 'appendix' && hasVerifiedResults) {
            // Page break before verified results appendix
            children.push(new Paragraph({ children: [new PageBreak()] }));
            
            // Appendix title
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: 'DACUM Live Pro - Verified (Post-Vote) Results (Appendix)',
                        bold: true,
                        size: 32,
                    }),
                ],
                spacing: { after: 300 },
                bidirectional: false,
            }));
            
            // Metadata
            children.push(new Paragraph({
                children: [new TextRun({ text: `Occupation: ${state.lwFinalizedData.occupation}`, size: 22 })],
                spacing: { after: 100 },
                bidirectional: false,
            }));
            children.push(new Paragraph({
                children: [new TextRun({ text: `Job Title: ${state.lwFinalizedData.jobTitle}`, size: 22 })],
                spacing: { after: 100 },
                bidirectional: false,
            }));
            children.push(new Paragraph({
                children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString()}`, size: 22 })],
                spacing: { after: 100 },
                bidirectional: false,
            }));
            const vFormula = state.lwFinalizedData.priorityFormula || 'if';
            const vFormulaText = vFormula === 'ifd' ? 'Importance × Frequency × Difficulty' : 'Importance × Frequency';
            children.push(new Paragraph({
                children: [new TextRun({ text: `Priority Formula: ${vFormulaText}`, size: 22 })],
                spacing: { after: 100 },
                bidirectional: false,
            }));
            children.push(new Paragraph({
                children: [new TextRun({ text: `Total Participants: ${state.lwAggregatedResults.totalVotes}`, size: 22 })],
                spacing: { after: 300 },
                bidirectional: false,
            }));
            
            // Collect all verified tasks with metrics
            const verifiedTasks = [];
            Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
                const duty = state.lwFinalizedData.duties[dutyId];
                duty.tasks.forEach(task => {
                    if (task.priorityIndex !== undefined) {
                        verifiedTasks.push({
                            dutyTitle: duty.title,
                            taskText: task.text,
                            meanImportance: task.meanImportance,
                            meanFrequency: task.meanFrequency,
                            meanDifficulty: task.meanDifficulty,
                            priorityIndex: task.priorityIndex,
                            rank: task.rank
                        });
                    }
                });
            });
            
            verifiedTasks.sort((a, b) => a.rank - b.rank);
            
            // Create table
            const verifiedTableRows = [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ text: 'Rank', bold: true, bidirectional: false })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ text: 'Duty', bold: true, bidirectional: false })], width: { size: 22, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ text: 'Task', bold: true, bidirectional: false })], width: { size: 35, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ text: 'I', bold: true, bidirectional: false })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ text: 'F', bold: true, bidirectional: false })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ text: 'D', bold: true, bidirectional: false })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ text: 'PI', bold: true, bidirectional: false })], width: { size: 11, type: WidthType.PERCENTAGE } })
                    ]
                })
            ];
            
            verifiedTasks.forEach(task => {
                verifiedTableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: String(task.rank), bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ text: task.dutyTitle, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ text: task.taskText, bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ text: task.meanImportance.toFixed(2), bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ text: task.meanFrequency.toFixed(2), bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ text: task.meanDifficulty.toFixed(2), bidirectional: false })] }),
                            new TableCell({ children: [new Paragraph({ text: task.priorityIndex.toFixed(2), bidirectional: false })] })
                        ]
                    })
                );
            });
            
            children.push(new Table({
                rows: verifiedTableRows,
                width: { size: 100, type: WidthType.PERCENTAGE }
            }));
        }

        // ============ COMPETENCY CLUSTERS SECTION ============
        if (state.clusteringData.clusters && state.clusteringData.clusters.length > 0) {
            children.push(new Paragraph({ children: [new PageBreak()], bidirectional: false }));
            
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: 'Competency Clusters',
                        bold: true,
                        size: 32, // 16pt
                    }),
                ],
                spacing: { before: 400, after: 400 },
                alignment: AlignmentType.CENTER,
                bidirectional: false,
            }));
            
            state.clusteringData.clusters.forEach((cluster, clusterIndex) => {
                const clusterNumber = clusterIndex + 1;
                
                // Cluster header
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: `Competency ${clusterNumber}: ${cluster.name}`,
                            bold: true,
                            size: 28, // 14pt
                        }),
                    ],
                    spacing: { before: 300, after: 200 },
                    bidirectional: false,
                }));
                
                // Range section
                if (cluster.range && cluster.range.trim()) {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Range:',
                                bold: true,
                                size: 24, // 12pt
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                        bidirectional: false,
                    }));
                    
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: cluster.range,
                                size: 22, // 11pt
                            }),
                        ],
                        spacing: { after: 200 },
                        indent: { left: 720 },
                        bidirectional: false,
                    }));
                }
                
                // Related Tasks section
                if (cluster.tasks && cluster.tasks.length > 0) {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Related Tasks:',
                                bold: true,
                                size: 24, // 12pt
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                        bidirectional: false,
                    }));
                    
                    cluster.tasks.forEach(task => {
                        const taskCode = getTaskCode(task.id);
                        children.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: `- ${taskCode}: ${task.text}`,
                                    size: 22, // 11pt
                                }),
                            ],
                            spacing: { after: 100 },
                            indent: { left: 720 },
                            bidirectional: false,
                        }));
                    });
                }
                
                // Performance Criteria section
                if (cluster.performanceCriteria && cluster.performanceCriteria.length > 0) {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Performance Criteria:',
                                bold: true,
                                size: 24, // 12pt
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                        bidirectional: false,
                    }));
                    
                    cluster.performanceCriteria.forEach((criterion, idx) => {
                        children.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${clusterNumber}-${idx + 1} ${criterion}`,
                                    size: 22, // 11pt
                                }),
                            ],
                            spacing: { after: 100 },
                            indent: { left: 720 },
                            bidirectional: false,
                        }));
                    });
                }
            });
        }

        // ============ LEARNING OUTCOMES SECTION ============
        if (state.learningOutcomesData.outcomes && state.learningOutcomesData.outcomes.length > 0) {
            children.push(new Paragraph({ children: [new PageBreak()], bidirectional: false }));
            
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: 'Learning Outcomes',
                        bold: true,
                        size: 32, // 16pt
                    }),
                ],
                spacing: { before: 400, after: 400 },
                alignment: AlignmentType.CENTER,
                bidirectional: false,
            }));
            
            // Group LOs by cluster
            const losByCluster = {};
            state.learningOutcomesData.outcomes.forEach(lo => {
                lo.linkedCriteria.forEach(pc => {
                    if (!losByCluster[pc.clusterNumber]) {
                        losByCluster[pc.clusterNumber] = [];
                    }
                    if (!losByCluster[pc.clusterNumber].includes(lo)) {
                        losByCluster[pc.clusterNumber].push(lo);
                    }
                });
            });
            
            // Sort cluster numbers
            const clusterNumbers = Object.keys(losByCluster).sort((a, b) => parseInt(a) - parseInt(b));
            
            clusterNumbers.forEach(clusterNum => {
                const clusterIndex = parseInt(clusterNum) - 1;
                const cluster = state.clusteringData.clusters[clusterIndex];
                const los = losByCluster[clusterNum];
                
                // Cluster header
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: cluster.name,
                            bold: true,
                            size: 28, // 14pt
                        }),
                    ],
                    spacing: { before: 300, after: 200 },
                    bidirectional: false,
                }));
                
                // Learning Outcomes for this cluster
                los.forEach(lo => {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `${lo.number}:`,
                                bold: true,
                                size: 24, // 12pt
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                        bidirectional: false,
                    }));
                    
                    if (lo.statement && lo.statement.trim()) {
                        children.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: lo.statement,
                                    size: 22, // 11pt
                                }),
                            ],
                            spacing: { after: 100 },
                            indent: { left: 720 },
                            bidirectional: false,
                        }));
                    }
                    
                    // Mapped Performance Criteria
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Mapped Performance Criteria:',
                                italic: true,
                                size: 20, // 10pt
                            }),
                        ],
                        spacing: { before: 100, after: 50 },
                        indent: { left: 720 },
                        bidirectional: false,
                    }));
                    
                    lo.linkedCriteria.forEach(pc => {
                        children.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: `- ${pc.id}: ${pc.text}`,
                                    size: 18, // 9pt
                                }),
                            ],
                            spacing: { after: 50 },
                            indent: { left: 1440 },
                            bidirectional: false,
                        }));
                    });
                });
            });
        }

        // ============ MODULE MAPPING SECTION ============
        if (state.moduleMappingData.modules && state.moduleMappingData.modules.length > 0) {
            children.push(new Paragraph({ children: [new PageBreak()], bidirectional: false }));
            
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: 'Module Mapping',
                        bold: true,
                        size: 32, // 16pt
                    }),
                ],
                spacing: { before: 400, after: 400 },
                alignment: AlignmentType.CENTER,
                bidirectional: false,
            }));
            
            state.moduleMappingData.modules.forEach(module => {
                // Module title
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: module.title,
                            bold: true,
                            size: 28, // 14pt
                        }),
                    ],
                    spacing: { before: 300, after: 200 },
                    bidirectional: false,
                }));
                
                // Learning Outcomes header
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Learning Outcomes:',
                            bold: true,
                            size: 24, // 12pt
                        }),
                    ],
                    spacing: { before: 200, after: 100 },
                    bidirectional: false,
                }));
                
                // Learning Outcomes in this module
                module.learningOutcomes.forEach(lo => {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `${lo.number}:`,
                                bold: true,
                                size: 22, // 11pt
                            }),
                        ],
                        spacing: { before: 150, after: 50 },
                        indent: { left: 720 },
                        bidirectional: false,
                    }));
                    
                    if (lo.statement && lo.statement.trim()) {
                        children.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: lo.statement,
                                    size: 20, // 10pt
                                }),
                            ],
                            spacing: { after: 50 },
                            indent: { left: 1440 },
                            bidirectional: false,
                        }));
                    }
                    
                    // Referenced Performance Criteria
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Referenced PC:',
                                italic: true,
                                size: 18, // 9pt
                            }),
                        ],
                        spacing: { before: 50, after: 30 },
                        indent: { left: 1440 },
                        bidirectional: false,
                    }));
                    
                    lo.linkedCriteria.forEach(pc => {
                        children.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: `- ${pc.id}: ${pc.text}`,
                                    size: 16, // 8pt
                                }),
                            ],
                            spacing: { after: 30 },
                            indent: { left: 2160 },
                            bidirectional: false,
                        }));
                    });
                });
            });
        }

        // Create document
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440,
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                children: children,
            }],
        });

        // Generate and download
        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${occupationTitle.replace(/[^a-z0-9]/gi, '_')}_${jobTitle.replace(/[^a-z0-9]/gi, '_')}_DACUM_Chart.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showStatus('Word document exported successfully! ✓', 'success');

    } catch (error) {
        console.error('Error generating Word document:', error);
        showStatus('Error generating Word document: ' + error.message, 'error');
    }
}


function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}

// PDF Export (original functionality preserved)
document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.querySelector('.btn-export');
    
    exportButton.addEventListener('click', exportToPDF);
});


function exportTaskVerificationPDF() {
    try {
        // Check if we have Task Verification data
        if (state.collectionMode !== 'workshop' || !state.workshopResults || Object.keys(state.workshopResults).length === 0) {
            alert('No Task Verification data available. Please complete workshop counts in the Task Verification tab first.');
            return;
        }
        
        const validResults = Object.keys(state.workshopResults).filter(key => 
            state.workshopResults[key] && state.workshopResults[key].valid
        );
        
        if (validResults.length === 0) {
            alert('No valid Task Verification results. Please ensure all required fields are completed.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPos = margin + 10;
        
        // Get occupation title
        const occupationTitleInput = document.getElementById('occupationTitle');
        const occupationTitle = occupationTitleInput ? occupationTitleInput.value : 'Unknown Occupation';
        
        // Title Page
        pdf.setFontSize(18);
        pdf.setFont(undefined, 'bold');
        pdf.text('Task Verification & Training Priority Analysis', pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;
        
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text(`Occupation: ${occupationTitle}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        const today = new Date().toLocaleDateString();
        pdf.text(`Date of Analysis: ${today}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'italic');
        pdf.text(`This Task Verification is based on the DACUM Chart for ${occupationTitle}.`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;
        
        // Methodology Summary
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Methodology Summary', margin, yPos);
        yPos += 8;
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Data Collection Mode: ${state.collectionMode === 'workshop' ? 'Workshop (Facilitated)' : 'Individual/Survey'}`, margin, yPos);
        yPos += 6;
        pdf.text(`Number of Participants: ${state.workshopParticipants}`, margin, yPos);
        yPos += 6;
        pdf.text(`Workflow Mode: ${state.workflowMode === 'standard' ? 'Standard (DACUM)' : 'Extended (DACUM)'}`, margin, yPos);
        yPos += 6;
        pdf.text(`Priority Formula: ${state.priorityFormula === 'if' ? 'Importance × Frequency' : 'Importance × Frequency × Difficulty'}`, margin, yPos);
        yPos += 12;
        
        // Priority Rankings Table
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Priority Rankings', margin, yPos);
        yPos += 8;
        
        // Get and sort results
        const sortedResults = [];
        validResults.forEach(taskKey => {
            const result = state.workshopResults[taskKey];
            
            // Use stored duty and task titles (with backward compatibility)
            let dutyText = result.dutyTitle;
            let taskText = result.taskTitle;
            
            // Backward compatibility: if not stored, look up from DOM
            if (!dutyText || !taskText) {
                const taskParts = taskKey.split('_task_');
                const dutyId = taskParts[0];
                
                if (!dutyText) {
                    const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                    dutyText = dutyInput ? dutyInput.value.trim() : 'Unassigned';
                }
                
                if (!taskText) {
                    const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
                    taskText = taskInput ? taskInput.value.trim() : 'Unassigned';
                }
            }
            
            sortedResults.push({
                duty: dutyText,
                task: taskText,
                meanI: result.meanImportance,
                meanF: result.meanFrequency,
                meanD: result.meanDifficulty,
                priority: result.priorityIndex
            });
        });
        
        sortedResults.sort((a, b) => b.priority - a.priority);
        
        // Table headers
        const colWidths = [15, 50, 75, 25, 25, 25, 25];
        const headers = ['Rank', 'Duty', 'Task', 'Mean I', 'Mean F', 'Mean D', 'Priority'];
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        let xPos = margin;
        headers.forEach((header, i) => {
            pdf.text(header, xPos, yPos);
            xPos += colWidths[i];
        });
        yPos += 6;
        
        // Table rows
        pdf.setFont(undefined, 'normal');
        sortedResults.forEach((row, index) => {
            if (yPos > pageHeight - 20) {
                pdf.addPage();
                yPos = margin + 10;
            }
            
            xPos = margin;
            pdf.text(`#${index + 1}`, xPos, yPos);
            xPos += colWidths[0];
            
            const dutyTrunc = row.duty.length > 20 ? row.duty.substring(0, 17) + '...' : row.duty;
            pdf.text(dutyTrunc, xPos, yPos);
            xPos += colWidths[1];
            
            const taskTrunc = row.task.length > 40 ? row.task.substring(0, 37) + '...' : row.task;
            pdf.text(taskTrunc, xPos, yPos);
            xPos += colWidths[2];
            
            pdf.text(row.meanI !== null ? row.meanI.toFixed(2) : 'N/A', xPos, yPos);
            xPos += colWidths[3];
            pdf.text(row.meanF !== null ? row.meanF.toFixed(2) : 'N/A', xPos, yPos);
            xPos += colWidths[4];
            pdf.text(row.meanD !== null ? row.meanD.toFixed(2) : 'N/A', xPos, yPos);
            xPos += colWidths[5];
            pdf.text(row.priority !== null ? row.priority.toFixed(2) : 'N/A', xPos, yPos);
            
            yPos += 5;
        });
        
        yPos += 10;
        
        // Duty-Level Summary Section
        if (yPos > pageHeight - 30) {
            pdf.addPage();
            yPos = margin + 10;
        }
        
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Duty-Level Summary', margin, yPos);
        yPos += 5;
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'italic');
        pdf.text(`Training Load Method: ${state.trainingLoadMethod === 'advanced' ? 'Advanced (Σ Priority × Difficulty)' : 'Simple (Avg Priority × Tasks)'}`, margin, yPos);
        yPos += 8;
        
        // Aggregate duty-level data
        const dutyMap = {};
        Object.keys(state.workshopResults).forEach(taskKey => {
            const result = state.workshopResults[taskKey];
            if (result && result.valid) {
                let dutyId = result.dutyId || taskKey.split('_task_')[0];
                let dutyTitle = result.dutyTitle;
                
                if (!dutyTitle) {
                    const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                    dutyTitle = dutyInput ? dutyInput.value.trim() : 'Unassigned';
                }
                
                if (!dutyMap[dutyId]) {
                    dutyMap[dutyId] = {
                        dutyTitle: dutyTitle,
                        validTasks: 0,
                        prioritySum: 0,
                        difficultySum: 0,
                        tasks: []
                    };
                }
                
                dutyMap[dutyId].validTasks++;
                dutyMap[dutyId].prioritySum += result.priorityIndex;
                dutyMap[dutyId].difficultySum += result.meanDifficulty;
                dutyMap[dutyId].tasks.push({
                    priorityIndex: result.priorityIndex,
                    meanDifficulty: result.meanDifficulty
                });
            }
        });
        
        const dutyResults = [];
        Object.keys(dutyMap).forEach(dutyId => {
            const duty = dutyMap[dutyId];
            const avgPriority = duty.prioritySum / duty.validTasks;
            
            let trainingLoad = 0;
            if (state.trainingLoadMethod === 'advanced') {
                trainingLoad = duty.tasks.reduce((sum, t) => sum + (t.priorityIndex * t.meanDifficulty), 0);
            } else {
                trainingLoad = avgPriority * duty.validTasks;
            }
            
            dutyResults.push({
                dutyTitle: duty.dutyTitle,
                validTasks: duty.validTasks,
                avgPriority: avgPriority,
                trainingLoad: trainingLoad
            });
        });
        
        dutyResults.sort((a, b) => b.avgPriority - a.avgPriority);
        
        // Duty table headers
        const dutyColWidths = [80, 30, 40, 45];
        const dutyHeaders = ['Duty Title', 'Tasks', 'Avg Priority', 'Training Load'];
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');
        let dutyXPos = margin;
        dutyHeaders.forEach((header, i) => {
            pdf.text(header, dutyXPos, yPos);
            dutyXPos += dutyColWidths[i];
        });
        yPos += 6;
        
        // Duty table rows
        pdf.setFont(undefined, 'normal');
        dutyResults.forEach((duty) => {
            if (yPos > pageHeight - 20) {
                pdf.addPage();
                yPos = margin + 10;
            }
            
            dutyXPos = margin;
            const dutyTitleTrunc = duty.dutyTitle.length > 35 ? duty.dutyTitle.substring(0, 32) + '...' : duty.dutyTitle;
            pdf.text(dutyTitleTrunc, dutyXPos, yPos);
            dutyXPos += dutyColWidths[0];
            
            pdf.text(duty.validTasks.toString(), dutyXPos, yPos);
            dutyXPos += dutyColWidths[1];
            
            pdf.text(duty.avgPriority.toFixed(2), dutyXPos, yPos);
            dutyXPos += dutyColWidths[2];
            
            pdf.text(duty.trainingLoad.toFixed(2), dutyXPos, yPos);
            
            yPos += 5;
        });
        
        yPos += 10;
        
        // Notes section
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Notes & Methodology', margin, yPos);
        yPos += 7;
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        const notes = [
            'Weighted Mean = Σ(value × count) ÷ total responses',
            'Importance scale: 0=Not Important, 1=Somewhat, 2=Important, 3=Critical',
            'Frequency scale: 0=Rarely, 1=Sometimes, 2=Often, 3=Daily',
            'Difficulty scale: 0=Easy, 1=Moderate, 2=Challenging, 3=Very Difficult',
            `Priority Index = ${state.priorityFormula === 'if' ? 'Mean Importance × Mean Frequency' : 'Mean Importance × Mean Frequency × Mean Difficulty'}`,
            'Higher priority values indicate greater training importance',
            'Results follow DACUM (Developing A Curriculum) methodology'
        ];
        
        notes.forEach(note => {
            if (yPos > pageHeight - 15) {
                pdf.addPage();
                yPos = margin + 10;
            }
            pdf.text(`• ${note}`, margin, yPos);
            yPos += 5;
        });
        
        // Save PDF
        pdf.save(`${occupationTitle.replace(/[^a-z0-9]/gi, '_')}_Task_Verification.pdf`);
        showStatus('Task Verification PDF exported successfully! ✓', 'success');
        
    } catch (error) {
        console.error('Error generating Task Verification PDF:', error);
        showStatus('Error generating Task Verification PDF: ' + error.message, 'error');
    }
}

function exportToPDF() {
    // ============ CHECK FOR VERIFIED LIVE WORKSHOP RESULTS ============
    const hasVerifiedResults = typeof state.lwFinalizedData !== 'undefined' && state.lwFinalizedData && 
                                typeof state.lwAggregatedResults !== 'undefined' && state.lwAggregatedResults;
    
    // ============ VERIFIED LIVE WORKSHOP STANDALONE EXPORT ============
    if (hasVerifiedResults && state.tvExportMode === 'standalone') {
        lwExportVerifiedPDF();
        return;
    }
    
    // ============ REGULAR TASK VERIFICATION STANDALONE EXPORT ============
    if (!hasVerifiedResults && state.tvExportMode === 'standalone') {
        exportTaskVerificationPDF();
        return;
    }
    
    // ============ NORMAL DACUM EXPORT (with optional appendix) ============
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        // Get input values
        const dacumDateInput = document.getElementById('dacumDate');
        let dacumDateFormatted = '';
        if (dacumDateInput.value) {
            const dateObj = new Date(dacumDateInput.value + 'T00:00:00');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const year = dateObj.getFullYear();
            dacumDateFormatted = `${month}-${day}-${year}`;
        }
        const producedForInput = document.getElementById('producedFor');
        const producedByInput = document.getElementById('producedBy');
        const occupationTitleInput = document.getElementById('occupationTitle');
        const jobTitleInput = document.getElementById('jobTitle');
        const toolsInput = document.getElementById('toolsInput');
        const trendsInput = document.getElementById('trendsInput');
        const acronymsInput = document.getElementById('acronymsInput');
        
        // Validation
        if (!occupationTitleInput.value || !jobTitleInput.value) {
            alert('Please fill in at least the Occupation Title and Job Title');
            return;
        }
        
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPos = margin + 10;
        
        // ============ TITLE PAGE ============
        pdf.setFontSize(18); // 18pt for main title
        pdf.setFont(undefined, 'bold');
        pdf.text(`DACUM Research Chart for ${occupationTitleInput.value}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;
        
        // Two column layout for title page
        const leftColX = margin + 10;
        const rightColX = pageWidth / 2 + 10;
        let leftY = yPos;
        let rightY = yPos;
        
        // Left column - Produced For/By
        if (producedForInput.value) {
            pdf.setFontSize(16); // 16pt for labels
            pdf.setFont(undefined, 'bold');
            pdf.text('Produced for', leftColX, leftY);
            leftY += 7;
            
            // Add logo if exists
            if (state.producedForImage) {
                try {
                    const imgWidth = 30;
                    const imgHeight = 20;
                    pdf.addImage(state.producedForImage, 'JPEG', leftColX, leftY, imgWidth, imgHeight);
                    leftY += imgHeight + 5;
                } catch (e) {
                    console.error('Error adding Produced For image:', e);
                }
            }
            
            pdf.setFont(undefined, 'normal');
            pdf.setFontSize(14); // 14pt for content
            pdf.text(producedForInput.value, leftColX, leftY);
            leftY += 15;
        }
        
        if (producedByInput.value) {
            pdf.setFontSize(16); // 16pt for labels
            pdf.setFont(undefined, 'bold');
            pdf.text('Produced by', leftColX, leftY);
            leftY += 7;
            
            // Add logo if exists
            if (state.producedByImage) {
                try {
                    const imgWidth = 30;
                    const imgHeight = 20;
                    pdf.addImage(state.producedByImage, 'JPEG', leftColX, leftY, imgWidth, imgHeight);
                    leftY += imgHeight + 5;
                } catch (e) {
                    console.error('Error adding Produced By image:', e);
                }
            }
            
            pdf.setFont(undefined, 'normal');
            pdf.setFontSize(14); // 14pt for content
            pdf.text(producedByInput.value, leftColX, leftY);
            leftY += 10;
        }
        
        if (dacumDateFormatted) {
            pdf.setFontSize(14); // 14pt for date
            pdf.setFont(undefined, 'bold');
            pdf.text(dacumDateFormatted, leftColX, leftY);
            leftY += 7;
        }
        
        // Add venue if exists
        const venueInput = document.getElementById('venue');
        if (venueInput && venueInput.value) {
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Venue: ', leftColX, leftY);
            pdf.setFont(undefined, 'normal');
            pdf.text(venueInput.value, leftColX + 20, leftY);
        }
        
        // Right column - Job info
        pdf.setFontSize(16); // 16pt for labels
        pdf.setFont(undefined, 'bold');
        pdf.text('Occupation:', rightColX, rightY);
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(14); // 14pt for content
        pdf.text(jobTitleInput.value, rightColX + 30, rightY);
        rightY += 7;
        
        pdf.setFontSize(16); // 16pt for labels
        pdf.setFont(undefined, 'bold');
        pdf.text('Job:', rightColX, rightY);
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(14); // 14pt for content
        pdf.text(occupationTitleInput.value, rightColX + 15, rightY);
        
        // Workshop Roles Section
        const facilitatorsInput = document.getElementById('facilitators');
        const observersInput = document.getElementById('observers');
        const panelMembersInput = document.getElementById('panelMembers');
        
        let workshopY = Math.max(leftY, rightY) + 15;
        const tableWidth = pageWidth - (2 * margin) - 20;
        const tableX = margin + 10;
        
        if (facilitatorsInput && facilitatorsInput.value.trim()) {
            const facilitatorNames = facilitatorsInput.value.split('\n').map(s => s.trim()).filter(s => s);
            if (facilitatorNames.length > 0) {
                if (workshopY + 20 > pageHeight - margin) {
                    pdf.addPage('a4', 'portrait');
                    workshopY = margin + 10;
                }
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text('Facilitators', tableX, workshopY);
                workshopY += 5;
                pdf.setFont(undefined, 'normal');
                pdf.setFontSize(12);
                
                facilitatorNames.forEach(name => {
                    if (workshopY + 7 > pageHeight - margin) {
                        pdf.addPage('a4', 'portrait');
                        workshopY = margin + 10;
                    }
                    pdf.rect(tableX, workshopY, tableWidth, 6, 'S');
                    pdf.text(name, tableX + 2, workshopY + 4);
                    workshopY += 6;
                });
                workshopY += 4;
            }
        }
        
        if (observersInput && observersInput.value.trim()) {
            const observerNames = observersInput.value.split('\n').map(s => s.trim()).filter(s => s);
            if (observerNames.length > 0) {
                if (workshopY + 20 > pageHeight - margin) {
                    pdf.addPage('a4', 'portrait');
                    workshopY = margin + 10;
                }
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text('Observers', tableX, workshopY);
                workshopY += 5;
                pdf.setFont(undefined, 'normal');
                pdf.setFontSize(12);
                
                observerNames.forEach(name => {
                    if (workshopY + 7 > pageHeight - margin) {
                        pdf.addPage('a4', 'portrait');
                        workshopY = margin + 10;
                    }
                    pdf.rect(tableX, workshopY, tableWidth, 6, 'S');
                    pdf.text(name, tableX + 2, workshopY + 4);
                    workshopY += 6;
                });
                workshopY += 4;
            }
        }
        
        if (panelMembersInput && panelMembersInput.value.trim()) {
            const panelMemberNames = panelMembersInput.value.split('\n').map(s => s.trim()).filter(s => s);
            if (panelMemberNames.length > 0) {
                if (workshopY + 20 > pageHeight - margin) {
                    pdf.addPage('a4', 'portrait');
                    workshopY = margin + 10;
                }
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text('Panel Members', tableX, workshopY);
                workshopY += 5;
                pdf.setFont(undefined, 'normal');
                pdf.setFontSize(12);
                
                panelMemberNames.forEach(name => {
                    if (workshopY + 7 > pageHeight - margin) {
                        pdf.addPage('a4', 'portrait');
                        workshopY = margin + 10;
                    }
                    pdf.rect(tableX, workshopY, tableWidth, 6, 'S');
                    pdf.text(name, tableX + 2, workshopY + 4);
                    workshopY += 6;
                });
            }
        }
        
        // ============ DACUM CHART GRID ============
        pdf.addPage('a4', 'landscape');
        yPos = margin + 5;
        
        // Collect duties and tasks
        const dutyInputs = document.querySelectorAll('[data-duty-id]');
        const duties = [];
        
        dutyInputs.forEach(dutyInput => {
            const dutyText = dutyInput.value.trim();
            if (dutyText) {
                const dutyId = dutyInput.getAttribute('data-duty-id');
                const taskInputs = document.querySelectorAll(`[data-task-id^="${dutyId}_"]`);
                const tasks = [];
                
                taskInputs.forEach(taskInput => {
                    const taskText = taskInput.value.trim();
                    if (taskText) {
                        tasks.push(taskText);
                    }
                });
                
                duties.push({
                    duty: dutyText,
                    tasks: tasks
                });
            }
        });
        
        if (duties.length === 0) {
            showStatus('Please add at least one duty with tasks', 'error');
            return;
        }
        
        // DUTIES AND TASKS header
        pdf.setFillColor(200, 200, 200);
        pdf.rect(margin, yPos, pageWidth - (margin * 2), 8, 'FD');
        pdf.setFontSize(14); // 14pt for heading
        pdf.setFont(undefined, 'bold');
        pdf.text('DUTIES AND TASKS', pageWidth / 2, yPos + 5.5, { align: 'center' });
        yPos += 8;
        
        // Calculate columns (max 4 duties per row)
        const maxCols = 4;
        const chartWidth = pageWidth - (margin * 2);
        const colWidth = chartWidth / maxCols;
        
        let dutyIndex = 0;
        
        while (dutyIndex < duties.length) {
            const dutiesThisRow = Math.min(maxCols, duties.length - dutyIndex);
            
            // Draw duty headers
            let maxHeaderHeight = 10;
            pdf.setFillColor(220, 220, 220);
            
            for (let col = 0; col < dutiesThisRow; col++) {
                const duty = duties[dutyIndex + col];
                const x = margin + (col * colWidth);
                const letter = String.fromCharCode(65 + dutyIndex + col);
                
                pdf.rect(x, yPos, colWidth, 10, 'S');
                pdf.setFontSize(14); // 14pt for duty headers
                pdf.setFont(undefined, 'bold');
                
                const headerText = `DUTY ${letter}: ${duty.duty}`;
                const lines = pdf.splitTextToSize(headerText, colWidth - 3);
                const textHeight = lines.length * 4.5 + 3; // Adjusted for larger font
                maxHeaderHeight = Math.max(maxHeaderHeight, textHeight);
            }
            
            // Redraw with correct height
            for (let col = 0; col < dutiesThisRow; col++) {
                const duty = duties[dutyIndex + col];
                const x = margin + (col * colWidth);
                const letter = String.fromCharCode(65 + dutyIndex + col);
                
                pdf.setFillColor(220, 220, 220);
                pdf.rect(x, yPos, colWidth, maxHeaderHeight, 'FD');
                
                pdf.setFontSize(14); // 14pt for duty headers
                const headerText = `DUTY ${letter}: ${duty.duty}`;
                const lines = pdf.splitTextToSize(headerText, colWidth - 3);
                pdf.text(lines, x + 1.5, yPos + 4.5);
            }
            
            yPos += maxHeaderHeight;
            
            // Draw tasks
            const maxTasks = Math.max(...duties.slice(dutyIndex, dutyIndex + dutiesThisRow).map(d => d.tasks.length));
            
            for (let taskRow = 0; taskRow < maxTasks; taskRow++) {
                let rowHeight = 15;
                
                // Calculate row height
                for (let col = 0; col < dutiesThisRow; col++) {
                    const duty = duties[dutyIndex + col];
                    if (duty.tasks[taskRow]) {
                        pdf.setFontSize(12); // 12pt for task text
                        const letter = String.fromCharCode(65 + dutyIndex + col);
                        const taskText = `Task ${letter}${taskRow + 1}:\n${duty.tasks[taskRow]}`;
                        const lines = pdf.splitTextToSize(taskText, colWidth - 3);
                        const textHeight = lines.length * 4 + 3; // Adjusted for larger font
                        rowHeight = Math.max(rowHeight, textHeight);
                    }
                }
                
                // Check page break
                if (yPos + rowHeight > pageHeight - margin - 5) {
                    pdf.addPage('a4', 'landscape');
                    yPos = margin + 5;
                    
                    // Repeat header
                    pdf.setFillColor(200, 200, 200);
                    pdf.rect(margin, yPos, pageWidth - (margin * 2), 8, 'FD');
                    pdf.setFontSize(14); // 14pt for heading
                    pdf.setFont(undefined, 'bold');
                    pdf.text('DUTIES AND TASKS (continued)', pageWidth / 2, yPos + 5.5, { align: 'center' });
                    yPos += 8;
                }
                
                // Draw task cells
                pdf.setFont(undefined, 'normal');
                pdf.setFontSize(12); // 12pt for task text
                
                for (let col = 0; col < dutiesThisRow; col++) {
                    const duty = duties[dutyIndex + col];
                    const x = margin + (col * colWidth);
                    
                    pdf.rect(x, yPos, colWidth, rowHeight, 'S');
                    
                    if (duty.tasks[taskRow]) {
                        const letter = String.fromCharCode(65 + dutyIndex + col);
                        const taskText = `Task ${letter}${taskRow + 1}:\n${duty.tasks[taskRow]}`;
                        const lines = pdf.splitTextToSize(taskText, colWidth - 3);
                        pdf.text(lines, x + 1.5, yPos + 3);
                    }
                }
                
                yPos += rowHeight;
            }
            
            dutyIndex += dutiesThisRow;
            
            if (dutyIndex < duties.length) {
                pdf.addPage('a4', 'landscape');
                yPos = margin + 5;
                
                pdf.setFillColor(200, 200, 200);
                pdf.rect(margin, yPos, pageWidth - (margin * 2), 8, 'FD');
                pdf.setFontSize(14); // 14pt for heading
                pdf.setFont(undefined, 'bold');
                pdf.text('DUTIES AND TASKS (continued)', pageWidth / 2, yPos + 5.5, { align: 'center' });
                yPos += 8;
            }
        }
        
        // ============ KNOWLEDGE, SKILLS, BEHAVIORS ============
        const knowledgeText = document.getElementById('knowledgeInput').value.trim();
        const skillsText = document.getElementById('skillsInput').value.trim();
        const behaviorsText = document.getElementById('behaviorsInput').value.trim();
        
        if (knowledgeText || skillsText || behaviorsText) {
            pdf.addPage('a4', 'landscape');
            yPos = margin + 5;
            
            pdf.setFontSize(14); // 14pt for main heading
            pdf.setFont(undefined, 'bold');
            pdf.text('General Knowledge and Skills', pageWidth / 2, yPos, { align: 'center' });
            yPos += 8;
            
            const thirdWidth = (pageWidth - (margin * 2)) / 3;
            let col1Y = yPos;
            let col2Y = yPos;
            let col3Y = yPos;
            
            if (knowledgeText) {
                const heading = document.getElementById('knowledgeHeading').textContent;
                pdf.setFontSize(14); // 14pt for section heading
                pdf.setFont(undefined, 'bold');
                pdf.text(heading, margin, col1Y);
                col1Y += 6;
                
                pdf.setFontSize(12); // 12pt for content
                pdf.setFont(undefined, 'normal');
                const items = knowledgeText.split('\n').filter(line => line.trim());
                items.forEach(item => {
                    const clean = item.trim().replace(/^[•\-*]\s*/, '');
                    pdf.text(clean, margin, col1Y);
                    col1Y += 4.5;
                });
            }
            
            if (skillsText) {
                const heading = document.getElementById('skillsHeading').textContent;
                pdf.setFontSize(14); // 14pt for section heading
                pdf.setFont(undefined, 'bold');
                pdf.text(heading, margin + thirdWidth, col2Y);
                col2Y += 6;
                
                pdf.setFontSize(12); // 12pt for content
                pdf.setFont(undefined, 'normal');
                const items = skillsText.split('\n').filter(line => line.trim());
                items.forEach(item => {
                    const clean = item.trim().replace(/^[•\-*]\s*/, '');
                    pdf.text(clean, margin + thirdWidth, col2Y);
                    col2Y += 4.5;
                });
            }
            
            if (behaviorsText) {
                const heading = document.getElementById('behaviorsHeading').textContent;
                pdf.setFontSize(14); // 14pt for section heading
                pdf.setFont(undefined, 'bold');
                pdf.text(heading, margin + (thirdWidth * 2), col3Y);
                col3Y += 6;
                
                pdf.setFontSize(12); // 12pt for content
                pdf.setFont(undefined, 'normal');
                const items = behaviorsText.split('\n').filter(line => line.trim());
                items.forEach(item => {
                    const clean = item.trim().replace(/^[•\-*]\s*/, '');
                    pdf.text(clean, margin + (thirdWidth * 2), col3Y);
                    col3Y += 4.5;
                });
            }
        }
        
        // ============ TOOLS AND TRENDS ============
        const tools = toolsInput.value.trim() ? toolsInput.value.split('\n').filter(line => line.trim()) : [];
        const trends = trendsInput.value.trim() ? trendsInput.value.split('\n').filter(line => line.trim()) : [];
        
        if (tools.length > 0 || trends.length > 0) {
            pdf.addPage('a4', 'landscape');
            yPos = margin + 5;
            
            const halfWidth = (pageWidth - (margin * 2) - 5) / 2;
            let leftY = yPos;
            let rightY = yPos;
            
            if (tools.length > 0) {
                const heading = document.getElementById('toolsHeading').textContent;
                pdf.setFontSize(14); // 14pt for section heading
                pdf.setFont(undefined, 'bold');
                pdf.text(heading, margin, leftY);
                leftY += 6;
                
                pdf.setFontSize(12); // 12pt for content
                pdf.setFont(undefined, 'normal');
                tools.forEach(tool => {
                    const clean = tool.trim().replace(/^[•\-*]\s*/, '');
                    pdf.text(clean, margin, leftY);
                    leftY += 4.5;
                });
            }
            
            if (trends.length > 0) {
                const heading = document.getElementById('trendsHeading').textContent;
                pdf.setFontSize(14); // 14pt for section heading
                pdf.setFont(undefined, 'bold');
                pdf.text(heading, margin + halfWidth + 5, rightY);
                rightY += 6;
                
                pdf.setFontSize(12); // 12pt for content
                pdf.setFont(undefined, 'normal');
                trends.forEach(trend => {
                    const clean = trend.trim().replace(/^[•\-*]\s*/, '');
                    pdf.text(clean, margin + halfWidth + 5, rightY);
                    rightY += 4.5;
                });
            }
        }
        
        // ============ ACRONYMS ============
        if (acronymsInput.value.trim()) {
            pdf.addPage('a4', 'landscape');
            yPos = margin + 5;
            
            const heading = document.getElementById('acronymsHeading').textContent;
            pdf.setFontSize(14); // 14pt for section heading
            pdf.setFont(undefined, 'bold');
            pdf.text(heading, margin, yPos);
            yPos += 6;
            
            pdf.setFontSize(12); // 12pt for content
            pdf.setFont(undefined, 'normal');
            const acronyms = acronymsInput.value.split('\n').filter(line => line.trim());
            acronyms.forEach(acronym => {
                const clean = acronym.trim().replace(/^[•\-*]\s*/, '');
                pdf.text(clean, margin, yPos);
                yPos += 4.5;
            });
        }
        
        // ============ CAREER PATH ============
        const careerPathInput = document.getElementById('careerPathInput');
        if (careerPathInput && careerPathInput.value.trim()) {
            pdf.addPage('a4', 'landscape');
            yPos = margin + 5;
            
            const heading = document.getElementById('careerPathHeading').textContent;
            pdf.setFontSize(14); // 14pt for section heading
            pdf.setFont(undefined, 'bold');
            pdf.text(heading, margin, yPos);
            yPos += 6;
            
            pdf.setFontSize(12); // 12pt for content
            pdf.setFont(undefined, 'normal');
            const careerPathItems = careerPathInput.value.split('\n').filter(line => line.trim());
            careerPathItems.forEach(item => {
                const clean = item.trim().replace(/^[•\-*]\s*/, '');
                pdf.text(clean, margin, yPos);
                yPos += 4.5;
            });
        }
        
        // ============ CUSTOM SECTIONS ============
        const customSectionsContainer = document.getElementById('customSectionsContainer');
        const customSectionDivs = customSectionsContainer.querySelectorAll('.section-container');
        customSectionDivs.forEach(sectionDiv => {
            const headingElement = sectionDiv.querySelector('h3');
            const textareaElement = sectionDiv.querySelector('textarea');
            
            if (headingElement && textareaElement && textareaElement.value.trim()) {
                pdf.addPage('a4', 'landscape');
                yPos = margin + 5;
                
                pdf.setFontSize(14); // 14pt for section heading
                pdf.setFont(undefined, 'bold');
                pdf.text(headingElement.textContent, margin, yPos);
                yPos += 6;
                
                pdf.setFontSize(12); // 12pt for content
                pdf.setFont(undefined, 'normal');
                const items = textareaElement.value.split('\n').filter(line => line.trim());
                items.forEach(item => {
                    const clean = item.trim().replace(/^[•\-*]\s*/, '');
                    pdf.text(clean, margin, yPos);
                    yPos += 4.5;
                });
            }
        });
        
        // ============ SKILLS LEVEL MATRIX (PDF EXPORT) ============
        const hasSkillsLevelData = state.skillsLevelDataAdditional && state.skillsLevelDataAdditional.some(category => 
            category.category.trim() !== '' || category.competencies.some(comp => comp.text.trim() !== '')
        );

        if (hasSkillsLevelData) {
            // Add new page for Skills Level Matrix
            pdf.addPage('a4', 'landscape');
            yPos = margin + 5;
            
            // Main heading
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Employability Competencies by Occupational Level', pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;

            // Process each category
            state.skillsLevelDataAdditional.forEach(category => {
                // Skip empty categories
                if (category.category.trim() === '' && category.competencies.every(c => c.text.trim() === '')) {
                    return;
                }

                // Check if we need a new page
                if (yPos > pageHeight - 40) {
                    pdf.addPage('a4', 'landscape');
                    yPos = margin + 5;
                }

                // Category header
                pdf.setFontSize(12);
                pdf.setFont(undefined, 'bold');
                pdf.setFillColor(232, 232, 232);
                pdf.rect(margin, yPos - 4, pageWidth - (margin * 2), 6, 'F');
                pdf.text(category.category || `Category ${category.id}`, margin + 2, yPos);
                yPos += 8;

                // Column headers
                pdf.setFontSize(10);
                const colWidth = (pageWidth - (margin * 2)) / 5;
                pdf.setFillColor(245, 245, 245);
                pdf.rect(margin, yPos - 4, pageWidth - (margin * 2), 6, 'F');
                pdf.text('Competency', margin + 2, yPos);
                pdf.text('Craftsman', margin + colWidth * 1 + 2, yPos);
                pdf.text('Skilled', margin + colWidth * 2 + 2, yPos);
                pdf.text('Semi-skilled', margin + colWidth * 3 + 2, yPos);
                pdf.text('Foundation', margin + colWidth * 4 + 2, yPos);
                yPos += 8;

                // Competency rows
                pdf.setFont(undefined, 'normal');
                category.competencies
                    .filter(comp => comp.text.trim() !== '')
                    .forEach(competency => {
                        // Check if we need a new page
                        if (yPos > pageHeight - 20) {
                            pdf.addPage('a4', 'landscape');
                            yPos = margin + 5;
                            
                            // Repeat column headers on new page
                            pdf.setFontSize(10);
                            pdf.setFont(undefined, 'bold');
                            pdf.setFillColor(245, 245, 245);
                            pdf.rect(margin, yPos - 4, pageWidth - (margin * 2), 6, 'F');
                            pdf.text('Competency', margin + 2, yPos);
                            pdf.text('Craftsman', margin + colWidth * 1 + 2, yPos);
                            pdf.text('Skilled', margin + colWidth * 2 + 2, yPos);
                            pdf.text('Semi-skilled', margin + colWidth * 3 + 2, yPos);
                            pdf.text('Foundation', margin + colWidth * 4 + 2, yPos);
                            yPos += 8;
                            pdf.setFont(undefined, 'normal');
                        }

                        // Competency text
                        const competencyText = `${competency.id}. ${competency.text}`;
                        const textLines = pdf.splitTextToSize(competencyText, colWidth - 4);
                        const lineHeight = 5;
                        const cellHeight = Math.max(lineHeight * textLines.length, 6);

                        // Draw cell borders
                        pdf.rect(margin, yPos - 4, colWidth, cellHeight);
                        pdf.rect(margin + colWidth, yPos - 4, colWidth, cellHeight);
                        pdf.rect(margin + colWidth * 2, yPos - 4, colWidth, cellHeight);
                        pdf.rect(margin + colWidth * 3, yPos - 4, colWidth, cellHeight);
                        pdf.rect(margin + colWidth * 4, yPos - 4, colWidth, cellHeight);

                        // Competency text
                        textLines.forEach((line, idx) => {
                            pdf.text(line, margin + 2, yPos + (idx * lineHeight));
                        });

                        // Checkmarks (centered in cells)
                        const checkY = yPos + (cellHeight / 2) - 2;
                        if (competency.levels.craftsman) {
                            pdf.text('✓', margin + colWidth * 1 + (colWidth / 2), checkY, { align: 'center' });
                        }
                        if (competency.levels.skilled) {
                            pdf.text('✓', margin + colWidth * 2 + (colWidth / 2), checkY, { align: 'center' });
                        }
                        if (competency.levels.semiSkilled) {
                            pdf.text('✓', margin + colWidth * 3 + (colWidth / 2), checkY, { align: 'center' });
                        }
                        if (competency.levels.foundation) {
                            pdf.text('✓', margin + colWidth * 4 + (colWidth / 2), checkY, { align: 'center' });
                        }

                        yPos += cellHeight + 2;
                    });

                yPos += 5; // Extra space after category
            });
        }
        
        // ============ TASK VERIFICATION APPENDIX (if mode = 'appendix') ============
        if (state.tvExportMode === 'appendix' && state.collectionMode === 'workshop') {
            // Check if we have valid results to include
            const validResults = Object.keys(state.workshopResults).filter(key => 
                state.workshopResults[key] && state.workshopResults[key].valid
            );
            
            if (validResults.length > 0) {
                // Start new page for appendix
                pdf.addPage();
                yPos = margin + 10;
                
                // Appendix title
                pdf.setFontSize(16);
                pdf.setFont(undefined, 'bold');
                pdf.text('Task Verification & Training Priority Analysis (Appendix)', pageWidth / 2, yPos, { align: 'center' });
                yPos += 12;
                
                // Methodology Summary
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text('Methodology Summary', margin, yPos);
                yPos += 8;
                
                pdf.setFontSize(11);
                pdf.setFont(undefined, 'normal');
                pdf.text(`Data Collection Mode: ${state.collectionMode === 'workshop' ? 'Workshop (Facilitated)' : 'Individual/Survey'}`, margin, yPos);
                yPos += 6;
                pdf.text(`Number of Participants: ${state.workshopParticipants}`, margin, yPos);
                yPos += 6;
                pdf.text(`Workflow Mode: ${state.workflowMode === 'standard' ? 'Standard (DACUM)' : 'Extended (DACUM)'}`, margin, yPos);
                yPos += 6;
                pdf.text(`Priority Formula: ${state.priorityFormula === 'if' ? 'Importance × Frequency' : 'Importance × Frequency × Difficulty'}`, margin, yPos);
                yPos += 12;
                
                // Priority Rankings Table
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text('Priority Rankings', margin, yPos);
                yPos += 8;
                
                // Get sorted results
                const sortedResults = [];
                validResults.forEach(taskKey => {
                    const result = state.workshopResults[taskKey];
                    
                    // Use stored duty and task titles (with backward compatibility)
                    let dutyText = result.dutyTitle;
                    let taskText = result.taskTitle;
                    
                    // Backward compatibility: if not stored, look up from DOM
                    if (!dutyText || !taskText) {
                        const taskParts = taskKey.split('_task_');
                        const dutyId = taskParts[0];
                        
                        if (!dutyText) {
                            const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                            dutyText = dutyInput ? dutyInput.value.trim() : 'Unassigned';
                        }
                        
                        if (!taskText) {
                            const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
                            taskText = taskInput ? taskInput.value.trim() : 'Unassigned';
                        }
                    }
                    
                    sortedResults.push({
                        duty: dutyText,
                        task: taskText,
                        meanI: result.meanImportance,
                        meanF: result.meanFrequency,
                        meanD: result.meanDifficulty,
                        priority: result.priorityIndex
                    });
                });
                
                // Sort by priority descending
                sortedResults.sort((a, b) => b.priority - a.priority);
                
                // Table headers
                const colWidths = [15, 50, 75, 25, 25, 25, 25];
                const headers = ['Rank', 'Duty', 'Task', 'Mean I', 'Mean F', 'Mean D', 'Priority'];
                
                pdf.setFontSize(10);
                pdf.setFont(undefined, 'bold');
                let xPos = margin;
                headers.forEach((header, i) => {
                    pdf.text(header, xPos, yPos);
                    xPos += colWidths[i];
                });
                yPos += 6;
                
                // Table rows
                pdf.setFont(undefined, 'normal');
                sortedResults.forEach((row, index) => {
                    if (yPos > pageHeight - 20) {
                        pdf.addPage();
                        yPos = margin + 10;
                    }
                    
                    xPos = margin;
                    pdf.text(`#${index + 1}`, xPos, yPos);
                    xPos += colWidths[0];
                    
                    // Truncate long text
                    const dutyTrunc = row.duty.length > 20 ? row.duty.substring(0, 17) + '...' : row.duty;
                    pdf.text(dutyTrunc, xPos, yPos);
                    xPos += colWidths[1];
                    
                    const taskTrunc = row.task.length > 40 ? row.task.substring(0, 37) + '...' : row.task;
                    pdf.text(taskTrunc, xPos, yPos);
                    xPos += colWidths[2];
                    
                    pdf.text(row.meanI !== null ? row.meanI.toFixed(2) : 'N/A', xPos, yPos);
                    xPos += colWidths[3];
                    pdf.text(row.meanF !== null ? row.meanF.toFixed(2) : 'N/A', xPos, yPos);
                    xPos += colWidths[4];
                    pdf.text(row.meanD !== null ? row.meanD.toFixed(2) : 'N/A', xPos, yPos);
                    xPos += colWidths[5];
                    pdf.text(row.priority !== null ? row.priority.toFixed(2) : 'N/A', xPos, yPos);
                    
                    yPos += 5;
                });
                
                yPos += 8;
                
                // Duty-Level Summary Section
                if (yPos > pageHeight - 30) {
                    pdf.addPage();
                    yPos = margin + 10;
                }
                
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text('Duty-Level Summary', margin, yPos);
                yPos += 5;
                
                pdf.setFontSize(9);
                pdf.setFont(undefined, 'italic');
                pdf.text(`Training Load Method: ${state.trainingLoadMethod === 'advanced' ? 'Advanced (Σ Priority × Difficulty)' : 'Simple (Avg Priority × Tasks)'}`, margin, yPos);
                yPos += 8;
                
                // Aggregate duty-level data
                const dutyMap = {};
                Object.keys(state.workshopResults).forEach(taskKey => {
                    const result = state.workshopResults[taskKey];
                    if (result && result.valid) {
                        let dutyId = result.dutyId || taskKey.split('_task_')[0];
                        let dutyTitle = result.dutyTitle;
                        
                        if (!dutyTitle) {
                            const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                            dutyTitle = dutyInput ? dutyInput.value.trim() : 'Unassigned';
                        }
                        
                        if (!dutyMap[dutyId]) {
                            dutyMap[dutyId] = {
                                dutyTitle: dutyTitle,
                                validTasks: 0,
                                prioritySum: 0,
                                difficultySum: 0,
                                tasks: []
                            };
                        }
                        
                        dutyMap[dutyId].validTasks++;
                        dutyMap[dutyId].prioritySum += result.priorityIndex;
                        dutyMap[dutyId].difficultySum += result.meanDifficulty;
                        dutyMap[dutyId].tasks.push({
                            priorityIndex: result.priorityIndex,
                            meanDifficulty: result.meanDifficulty
                        });
                    }
                });
                
                const dutyResults = [];
                Object.keys(dutyMap).forEach(dutyId => {
                    const duty = dutyMap[dutyId];
                    const avgPriority = duty.prioritySum / duty.validTasks;
                    
                    let trainingLoad = 0;
                    if (state.trainingLoadMethod === 'advanced') {
                        trainingLoad = duty.tasks.reduce((sum, t) => sum + (t.priorityIndex * t.meanDifficulty), 0);
                    } else {
                        trainingLoad = avgPriority * duty.validTasks;
                    }
                    
                    dutyResults.push({
                        dutyTitle: duty.dutyTitle,
                        validTasks: duty.validTasks,
                        avgPriority: avgPriority,
                        trainingLoad: trainingLoad
                    });
                });
                
                dutyResults.sort((a, b) => b.avgPriority - a.avgPriority);
                
                // Duty table headers
                const dutyColWidths = [80, 30, 40, 45];
                const dutyHeaders = ['Duty Title', 'Tasks', 'Avg Priority', 'Training Load'];
                
                pdf.setFontSize(9);
                pdf.setFont(undefined, 'bold');
                let dutyXPos = margin;
                dutyHeaders.forEach((header, i) => {
                    pdf.text(header, dutyXPos, yPos);
                    dutyXPos += dutyColWidths[i];
                });
                yPos += 6;
                
                // Duty table rows
                pdf.setFont(undefined, 'normal');
                dutyResults.forEach((duty) => {
                    if (yPos > pageHeight - 20) {
                        pdf.addPage();
                        yPos = margin + 10;
                    }
                    
                    dutyXPos = margin;
                    const dutyTitleTrunc = duty.dutyTitle.length > 35 ? duty.dutyTitle.substring(0, 32) + '...' : duty.dutyTitle;
                    pdf.text(dutyTitleTrunc, dutyXPos, yPos);
                    dutyXPos += dutyColWidths[0];
                    
                    pdf.text(duty.validTasks.toString(), dutyXPos, yPos);
                    dutyXPos += dutyColWidths[1];
                    
                    pdf.text(duty.avgPriority.toFixed(2), dutyXPos, yPos);
                    dutyXPos += dutyColWidths[2];
                    
                    pdf.text(duty.trainingLoad.toFixed(2), dutyXPos, yPos);
                    
                    yPos += 5;
                });
                
                yPos += 8;
                
                // Notes
                pdf.setFontSize(12);
                pdf.setFont(undefined, 'bold');
                pdf.text('Notes', margin, yPos);
                yPos += 6;
                
                pdf.setFontSize(10);
                pdf.setFont(undefined, 'normal');
                const notes = [
                    'Weighted Mean = Σ(value × count) ÷ total responses',
                    'Priority Index calculated using selected formula',
                    'Higher priority values indicate greater training importance',
                    'Results based on DACUM methodology'
                ];
                notes.forEach(note => {
                    if (yPos > pageHeight - 15) {
                        pdf.addPage();
                        yPos = margin + 10;
                    }
                    pdf.text(`• ${note}`, margin, yPos);
                    yPos += 5;
                });
            }
        }
        
        // ============ VERIFIED LIVE WORKSHOP RESULTS APPENDIX ============
        if (state.tvExportMode === 'appendix' && hasVerifiedResults) {
            // Start new page for verified results appendix
            pdf.addPage();
            yPos = margin + 10;
            
            // Appendix title
            pdf.setFontSize(16);
            pdf.setFont(undefined, 'bold');
            pdf.text('DACUM Live Pro - Verified (Post-Vote) Results (Appendix)', pageWidth / 2, yPos, { align: 'center' });
            yPos += 12;
            
            // Metadata
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Occupation: ${state.lwFinalizedData.occupation}`, margin, yPos);
            yPos += 6;
            pdf.text(`Job Title: ${state.lwFinalizedData.jobTitle}`, margin, yPos);
            yPos += 6;
            pdf.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
            yPos += 6;
            const vFormula = state.lwFinalizedData.priorityFormula || 'if';
            const vFormulaText = vFormula === 'ifd' ? 'Importance × Frequency × Difficulty' : 'Importance × Frequency';
            pdf.text(`Priority Formula: ${vFormulaText}`, margin, yPos);
            yPos += 6;
            pdf.text(`Total Participants: ${state.lwAggregatedResults.totalVotes}`, margin, yPos);
            yPos += 12;
            
            // Collect all verified tasks with metrics
            const verifiedTasks = [];
            Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
                const duty = state.lwFinalizedData.duties[dutyId];
                duty.tasks.forEach(task => {
                    if (task.priorityIndex !== undefined) {
                        verifiedTasks.push({
                            dutyTitle: duty.title,
                            taskText: task.text,
                            meanImportance: task.meanImportance,
                            meanFrequency: task.meanFrequency,
                            meanDifficulty: task.meanDifficulty,
                            priorityIndex: task.priorityIndex,
                            rank: task.rank
                        });
                    }
                });
            });
            
            verifiedTasks.sort((a, b) => a.rank - b.rank);
            
            // Table header
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            pdf.text('Rank', margin, yPos);
            pdf.text('Duty', margin + 15, yPos);
            pdf.text('Task', margin + 60, yPos);
            pdf.text('I', margin + 140, yPos);
            pdf.text('F', margin + 150, yPos);
            pdf.text('D', margin + 160, yPos);
            pdf.text('PI', margin + 170, yPos);
            yPos += 5;
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 3;
            
            // Table rows
            pdf.setFont(undefined, 'normal');
            pdf.setFontSize(8);
            
            verifiedTasks.forEach(task => {
                // Check if need new page
                if (yPos + 8 > pageHeight - margin) {
                    pdf.addPage();
                    yPos = margin;
                }
                
                pdf.text(String(task.rank), margin, yPos);
                const dutyLines = pdf.splitTextToSize(task.dutyTitle, 40);
                pdf.text(dutyLines[0] || '', margin + 15, yPos);
                const taskLines = pdf.splitTextToSize(task.taskText, 75);
                pdf.text(taskLines[0] || '', margin + 60, yPos);
                pdf.text(task.meanImportance.toFixed(2), margin + 140, yPos);
                pdf.text(task.meanFrequency.toFixed(2), margin + 150, yPos);
                pdf.text(task.meanDifficulty.toFixed(2), margin + 160, yPos);
                pdf.text(task.priorityIndex.toFixed(2), margin + 170, yPos);
                yPos += 6;
            });
        }
        
        // ============ COMPETENCY CLUSTERS SECTION ============
        if (state.clusteringData.clusters && state.clusteringData.clusters.length > 0) {
            pdf.addPage();
            yPos = margin + 5;
            
            pdf.setFontSize(16);
            pdf.setFont(undefined, 'bold');
            pdf.text('Competency Clusters', pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;
            
            state.clusteringData.clusters.forEach((cluster, clusterIndex) => {
                const clusterNumber = clusterIndex + 1;
                
                // Check if need new page
                if (yPos + 20 > pageHeight - margin) {
                    pdf.addPage();
                    yPos = margin + 5;
                }
                
                // Cluster header
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text(`Competency ${clusterNumber}: ${cluster.name}`, margin, yPos);
                yPos += 7;
                
                // Range section
                if (cluster.range && cluster.range.trim()) {
                    pdf.setFontSize(12);
                    pdf.setFont(undefined, 'bold');
                    pdf.text('Range:', margin, yPos);
                    yPos += 5;
                    
                    pdf.setFontSize(10);
                    pdf.setFont(undefined, 'normal');
                    const rangeLines = pdf.splitTextToSize(cluster.range, pageWidth - 2 * margin - 5);
                    rangeLines.forEach(line => {
                        if (yPos + 5 > pageHeight - margin) {
                            pdf.addPage();
                            yPos = margin + 5;
                        }
                        pdf.text(line, margin + 5, yPos);
                        yPos += 5;
                    });
                    yPos += 3;
                }
                
                // Related Tasks section
                if (cluster.tasks && cluster.tasks.length > 0) {
                    if (yPos + 10 > pageHeight - margin) {
                        pdf.addPage();
                        yPos = margin + 5;
                    }
                    
                    pdf.setFontSize(12);
                    pdf.setFont(undefined, 'bold');
                    pdf.text('Related Tasks:', margin, yPos);
                    yPos += 5;
                    
                    pdf.setFontSize(10);
                    pdf.setFont(undefined, 'normal');
                    
                    cluster.tasks.forEach(task => {
                        if (yPos + 6 > pageHeight - margin) {
                            pdf.addPage();
                            yPos = margin + 5;
                        }
                        
                        const taskCode = getTaskCode(task.id);
                        const taskText = `- ${taskCode}: ${task.text}`;
                        const lines = pdf.splitTextToSize(taskText, pageWidth - 2 * margin - 5);
                        
                        lines.forEach(line => {
                            if (yPos + 5 > pageHeight - margin) {
                                pdf.addPage();
                                yPos = margin + 5;
                            }
                            pdf.text(line, margin + 5, yPos);
                            yPos += 5;
                        });
                    });
                    yPos += 3;
                }
                
                // Performance Criteria section
                if (cluster.performanceCriteria && cluster.performanceCriteria.length > 0) {
                    if (yPos + 10 > pageHeight - margin) {
                        pdf.addPage();
                        yPos = margin + 5;
                    }
                    
                    pdf.setFontSize(12);
                    pdf.setFont(undefined, 'bold');
                    pdf.text('Performance Criteria:', margin, yPos);
                    yPos += 5;
                    
                    pdf.setFontSize(10);
                    pdf.setFont(undefined, 'normal');
                    
                    cluster.performanceCriteria.forEach((criterion, idx) => {
                        if (yPos + 6 > pageHeight - margin) {
                            pdf.addPage();
                            yPos = margin + 5;
                        }
                        
                        const criterionText = `${clusterNumber}-${idx + 1} ${criterion}`;
                        const lines = pdf.splitTextToSize(criterionText, pageWidth - 2 * margin - 5);
                        
                        lines.forEach(line => {
                            if (yPos + 5 > pageHeight - margin) {
                                pdf.addPage();
                                yPos = margin + 5;
                            }
                            pdf.text(line, margin + 5, yPos);
                            yPos += 5;
                        });
                    });
                }
                
                yPos += 8;
            });
        }
        
        // ============ LEARNING OUTCOMES SECTION ============
        if (state.learningOutcomesData.outcomes && state.learningOutcomesData.outcomes.length > 0) {
            pdf.addPage();
            yPos = margin + 5;
            
            pdf.setFontSize(16);
            pdf.setFont(undefined, 'bold');
            pdf.text('Learning Outcomes', pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;
            
            // Group LOs by cluster
            const losByCluster = {};
            state.learningOutcomesData.outcomes.forEach(lo => {
                lo.linkedCriteria.forEach(pc => {
                    if (!losByCluster[pc.clusterNumber]) {
                        losByCluster[pc.clusterNumber] = [];
                    }
                    if (!losByCluster[pc.clusterNumber].includes(lo)) {
                        losByCluster[pc.clusterNumber].push(lo);
                    }
                });
            });
            
            // Sort cluster numbers
            const clusterNumbers = Object.keys(losByCluster).sort((a, b) => parseInt(a) - parseInt(b));
            
            clusterNumbers.forEach(clusterNum => {
                const clusterIndex = parseInt(clusterNum) - 1;
                const cluster = state.clusteringData.clusters[clusterIndex];
                const los = losByCluster[clusterNum];
                
                if (yPos + 20 > pageHeight - margin) {
                    pdf.addPage();
                    yPos = margin + 5;
                }
                
                // Cluster header
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text(`${cluster.name}`, margin, yPos);
                yPos += 7;
                
                // Learning Outcomes for this cluster
                los.forEach(lo => {
                    if (yPos + 15 > pageHeight - margin) {
                        pdf.addPage();
                        yPos = margin + 5;
                    }
                    
                    pdf.setFontSize(12);
                    pdf.setFont(undefined, 'bold');
                    pdf.text(`${lo.number}:`, margin + 5, yPos);
                    yPos += 5;
                    
                    if (lo.statement && lo.statement.trim()) {
                        pdf.setFontSize(10);
                        pdf.setFont(undefined, 'normal');
                        const statementLines = pdf.splitTextToSize(lo.statement, pageWidth - 2 * margin - 10);
                        statementLines.forEach(line => {
                            if (yPos + 5 > pageHeight - margin) {
                                pdf.addPage();
                                yPos = margin + 5;
                            }
                            pdf.text(line, margin + 10, yPos);
                            yPos += 5;
                        });
                    }
                    
                    yPos += 2;
                    
                    // Mapped Performance Criteria
                    pdf.setFontSize(10);
                    pdf.setFont(undefined, 'italic');
                    pdf.text('Mapped Performance Criteria:', margin + 10, yPos);
                    yPos += 5;
                    
                    pdf.setFont(undefined, 'normal');
                    pdf.setFontSize(9);
                    lo.linkedCriteria.forEach(pc => {
                        if (yPos + 5 > pageHeight - margin) {
                            pdf.addPage();
                            yPos = margin + 5;
                        }
                        const pcText = `- ${pc.id}: ${pc.text}`;
                        const pcLines = pdf.splitTextToSize(pcText, pageWidth - 2 * margin - 15);
                        pcLines.forEach(line => {
                            if (yPos + 5 > pageHeight - margin) {
                                pdf.addPage();
                                yPos = margin + 5;
                            }
                            pdf.text(line, margin + 15, yPos);
                            yPos += 5;
                        });
                    });
                    
                    yPos += 5;
                });
                
                yPos += 3;
            });
        }
        
        // ============ MODULE MAPPING SECTION ============
        if (state.moduleMappingData.modules && state.moduleMappingData.modules.length > 0) {
            pdf.addPage();
            yPos = margin + 5;
            
            pdf.setFontSize(16);
            pdf.setFont(undefined, 'bold');
            pdf.text('Module Mapping', pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;
            
            state.moduleMappingData.modules.forEach(module => {
                if (yPos + 20 > pageHeight - margin) {
                    pdf.addPage();
                    yPos = margin + 5;
                }
                
                // Module title
                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text(module.title, margin, yPos);
                yPos += 7;
                
                // Learning Outcomes in this module
                pdf.setFontSize(12);
                pdf.setFont(undefined, 'bold');
                pdf.text('Learning Outcomes:', margin + 5, yPos);
                yPos += 5;
                
                module.learningOutcomes.forEach(lo => {
                    if (yPos + 15 > pageHeight - margin) {
                        pdf.addPage();
                        yPos = margin + 5;
                    }
                    
                    pdf.setFontSize(11);
                    pdf.setFont(undefined, 'bold');
                    pdf.text(`${lo.number}:`, margin + 10, yPos);
                    yPos += 5;
                    
                    if (lo.statement && lo.statement.trim()) {
                        pdf.setFontSize(10);
                        pdf.setFont(undefined, 'normal');
                        const statementLines = pdf.splitTextToSize(lo.statement, pageWidth - 2 * margin - 15);
                        statementLines.forEach(line => {
                            if (yPos + 5 > pageHeight - margin) {
                                pdf.addPage();
                                yPos = margin + 5;
                            }
                            pdf.text(line, margin + 15, yPos);
                            yPos += 5;
                        });
                    }
                    
                    yPos += 2;
                    
                    // Referenced Performance Criteria
                    pdf.setFontSize(9);
                    pdf.setFont(undefined, 'italic');
                    pdf.text('Referenced PC:', margin + 15, yPos);
                    yPos += 4;
                    
                    pdf.setFont(undefined, 'normal');
                    pdf.setFontSize(8);
                    lo.linkedCriteria.forEach(pc => {
                        if (yPos + 4 > pageHeight - margin) {
                            pdf.addPage();
                            yPos = margin + 5;
                        }
                        const pcText = `- ${pc.id}: ${pc.text}`;
                        const pcLines = pdf.splitTextToSize(pcText, pageWidth - 2 * margin - 20);
                        pcLines.forEach(line => {
                            if (yPos + 4 > pageHeight - margin) {
                                pdf.addPage();
                                yPos = margin + 5;
                            }
                            pdf.text(line, margin + 20, yPos);
                            yPos += 4;
                        });
                    });
                    
                    yPos += 3;
                });
                
                yPos += 5;
            });
        }
        
        pdf.save(`${occupationTitleInput.value}_${jobTitleInput.value}_DACUM_Chart.pdf`);
        showStatus('PDF exported successfully! ✓', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showStatus('Error generating PDF: ' + error.message, 'error');
    }
}


        // Check if docx library loaded successfully
        window.addEventListener('load', function() {
            setTimeout(function() {
                if (typeof window.docx === 'undefined') {
                    console.error('Warning: docx library failed to load');
                } else {
                    console.log('docx library loaded successfully');
                }
            }, 1000);
        });


function lwCheckAndShowSection() {
// state.collectionMode initialized in state.js
    const lwSection = document.getElementById('liveWorkshopSection');
    
    if (state.collectionMode === 'workshop') {
        lwSection.style.display = 'block';
    } else {
        lwSection.style.display = 'none';
    }
}

// updateCollectionMode override moved to app.js

// ===== LIVE WORKSHOP - PHASE 1: FINALIZATION =====

function lwExtractDutiesAndTasks() {
    const duties = {};
    
    // Get all duty containers from v3.9
    const dutyContainers = document.querySelectorAll('.duty-row');
    
    dutyContainers.forEach((dutyContainer, index) => {
        const dutyId = dutyContainer.id;
        const dutyInput = dutyContainer.querySelector(`input[data-duty-id="${dutyId}"]`);
        const dutyTitle = dutyInput ? dutyInput.value.trim() : '';
        
        if (!dutyTitle) return; // Skip empty duties
        
        const tasks = [];
        const taskInputs = dutyContainer.querySelectorAll(`input[data-task-id^="${dutyId}_"]`);
        
        taskInputs.forEach((taskInput, taskIndex) => {
            const taskText = taskInput.value.trim();
            if (taskText) {
                tasks.push({
                    id: taskInput.getAttribute('data-task-id'),
                    text: taskText
                });
            }
        });
        
        if (tasks.length > 0) {
            duties[dutyId] = {
                title: dutyTitle,
                tasks: tasks
            };
        }
    });
    
    return duties;
}


function lwGenerateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function lwCopyLink() {
    const linkElement = document.getElementById('lwParticipantLink');
    const fullUrl = linkElement.getAttribute('data-full-url');
    const feedback = document.getElementById('lwCopyFeedback');
    
    navigator.clipboard.writeText(fullUrl).then(() => {
        feedback.style.display = 'inline';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
        showStatus('✅ Participant link copied to clipboard!', 'success');
    }).catch(err => {
        showStatus('Failed to copy link', 'error');
    });
}


// ===== LIVE WORKSHOP - QR CODE FUNCTIONS (FINAL + QUIET ZONE) =====
// state.lwQRInstance initialized in state.js

function lwShowQRCode() {
    const linkElement = document.getElementById('lwParticipantLink');
    if (!linkElement) {
        showStatus('Participant link element not found', 'error');
        return;
    }

    const fullUrl = linkElement.getAttribute('data-full-url');
    if (!fullUrl) {
        showStatus('No participant link available', 'error');
        return;
    }

    if (typeof QRCode === 'undefined') {
        showStatus('QR Code library not loaded', 'error');
        return;
    }

    const modal = document.getElementById('lwQRModal');
    if (modal) modal.style.display = 'block';

    const container = document.getElementById('qrCodeContainer');
    if (!container) {
        showStatus('QR container not found', 'error');
        return;
    }

    // Clear previous QR
    container.innerHTML = '';
    state.lwQRInstance = null;

    // Generate QR
    state.lwQRInstance = new QRCode(container, {
        text: fullUrl,
        width: 340,
        height: 340,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    // Explicit quiet zone (critical)
    container.style.padding = '20px';
    container.style.background = '#ffffff';
}

function lwCloseQRModal() {
    const modal = document.getElementById('lwQRModal');
    if (modal) modal.style.display = 'none';
}

function lwDownloadQRPNG() {
    const container = document.getElementById('qrCodeContainer');
    if (!container) return;

    const qrImg = container.querySelector('img');
    const qrCanvas = container.querySelector('canvas');

    let sourceCanvas;

    if (qrCanvas) {
        sourceCanvas = qrCanvas;
    } else if (qrImg) {
        sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = qrImg.naturalWidth;
        sourceCanvas.height = qrImg.naturalHeight;
        sourceCanvas.getContext('2d').drawImage(qrImg, 0, 0);
    } else {
        alert('QR code not found');
        return;
    }

    const border = 24;
    const exportSize = sourceCanvas.width + border * 2;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;

    const ctx = exportCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportSize, exportSize);
    ctx.drawImage(sourceCanvas, border, border);

    const link = document.createElement('a');
    link.href = exportCanvas.toDataURL('image/png');
    link.download = 'dacum-liveworkshop-qr.png';
    link.click();
}


function lwApplyVotingResultsToDataModel() {
    if (!state.lwFinalizedData || !state.lwAggregatedResults) return;
    
    const { taskResults } = state.lwAggregatedResults;
    const formula = state.lwFinalizedData.priorityFormula || 'if';
    
    // Recalculate priority index for all tasks using the stored formula
    const allTasksWithResults = [];
    Object.keys(taskResults).forEach(taskId => {
        const voteData = taskResults[taskId];
        let priorityIndex;
        
        if (formula === 'ifd') {
            // IFD: Importance × Frequency × Difficulty
            priorityIndex = voteData.avgImportance * voteData.avgFrequency * voteData.avgDifficulty;
        } else {
            // IF: Importance × Frequency (default)
            priorityIndex = voteData.avgImportance * voteData.avgFrequency;
        }
        
        allTasksWithResults.push({
            taskId: taskId,
            ...voteData,
            priorityIndex: priorityIndex
        });
    });
    
    // Sort all tasks globally by recalculated priority to assign ranks
    allTasksWithResults.sort((a, b) => b.priorityIndex - a.priorityIndex);
    
    // Assign global ranks
    const taskRanks = {};
    allTasksWithResults.forEach((task, index) => {
        taskRanks[task.taskId] = index + 1;
    });
    
    // Update each duty: add voting metrics with recalculated priority and reorder tasks
    Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
        const duty = state.lwFinalizedData.duties[dutyId];
        
        // Add voting metrics to each task
        duty.tasks.forEach(task => {
            const voteData = taskResults[task.id];
            if (voteData) {
                let priorityIndex;
                if (formula === 'ifd') {
                    priorityIndex = voteData.avgImportance * voteData.avgFrequency * voteData.avgDifficulty;
                } else {
                    priorityIndex = voteData.avgImportance * voteData.avgFrequency;
                }
                
                task.meanImportance = voteData.avgImportance;
                task.meanFrequency = voteData.avgFrequency;
                task.meanDifficulty = voteData.avgDifficulty;
                task.priorityIndex = priorityIndex;
                task.rank = taskRanks[task.id];
            }
        });
        
        // Sort tasks by recalculated priority index (descending)
        duty.tasks.sort((a, b) => (b.priorityIndex || 0) - (a.priorityIndex || 0));
    });
    
    // Update DOM to reflect new task order
    lwUpdateDOMWithReorderedTasks();
}


function lwUpdateDOMWithReorderedTasks() {
    Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
        const duty = state.lwFinalizedData.duties[dutyId];
        const dutyContainer = document.getElementById(dutyId);
        
        if (!dutyContainer) return;
        
        // Find the task list container within this duty
        const taskListContainer = dutyContainer.querySelector('.task-list');
        if (!taskListContainer) return;
        
        // Clear existing tasks
        taskListContainer.innerHTML = '';
        
        // Re-add tasks in new order
        duty.tasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item';
            taskDiv.innerHTML = `
                <input type="text" 
                       data-task-id="${task.id}" 
                       value="${task.text.replace(/"/g, '&quot;')}" 
                       placeholder="Enter task description" 
                       disabled>
            `;
            taskListContainer.appendChild(taskDiv);
        });
    });
}

async function lwFetchResults() {
    if (!state.lwSessionId) {
        showStatus('No active session', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${state.LW_API_BASE}/get-results/${state.lwSessionId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            state.lwAggregatedResults = result.data;
            
            // Apply voting results to the underlying data model
            lwApplyVotingResultsToDataModel();
            
            lwDisplayResults();
            showStatus('✅ Results refreshed and tasks reordered by priority', 'success');
            
            // Show export buttons
            document.getElementById('lwExportButtons').style.display = 'block';
        } else {
            throw new Error(result.error || 'Failed to fetch results');
        }
        
    } catch (error) {
        console.error('Error fetching results:', error);
        showStatus(`Error fetching results: ${error.message}`, 'error');
    }
}

function lwDisplayResults() {
    const container = document.getElementById('lwResultsContainer');
    
    if (!state.lwAggregatedResults) {
        container.innerHTML = '<p style="color: #999; font-style: italic; text-align: center; padding: 30px;">No votes received yet.</p>';
        return;
    }
    
    const { totalVotes } = state.lwAggregatedResults;
    
    if (totalVotes === 0) {
        container.innerHTML = '<p style="color: #999; font-style: italic; text-align: center; padding: 30px;">No votes received yet. Share the participant link to start collecting votes.</p>';
        return;
    }
    
    // Collect all tasks with recalculated metrics from state.lwFinalizedData
    const allTasks = [];
    Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
        const duty = state.lwFinalizedData.duties[dutyId];
        duty.tasks.forEach(task => {
            if (task.priorityIndex !== undefined) {
                allTasks.push({
                    dutyTitle: duty.title,
                    taskText: task.text,
                    avgImportance: task.meanImportance,
                    avgFrequency: task.meanFrequency,
                    avgDifficulty: task.meanDifficulty,
                    priorityIndex: task.priorityIndex,
                    rank: task.rank
                });
            }
        });
    });
    
    // Sort by rank (already sorted in data model, but ensure consistency)
    allTasks.sort((a, b) => a.rank - b.rank);
    
    const formula = state.lwFinalizedData.priorityFormula || 'if';
    const formulaText = formula === 'ifd' 
        ? 'Average Importance × Average Frequency × Average Difficulty'
        : 'Average Importance × Average Frequency';
    
    let html = `
        <div style="background: white; padding: 25px; border-radius: 12px; border: 2px solid #667eea;">
            <h3 style="color: #667eea; margin: 0 0 20px 0; text-align: center;">📊 Voting Results Summary</h3>
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 12px;">
                    <div style="font-size: 0.9em; opacity: 0.9; margin-bottom: 5px;">Total Participants</div>
                    <div style="font-size: 2.5em; font-weight: 700;">${totalVotes}</div>
                </div>
            </div>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                            <th style="padding: 12px; text-align: left; font-weight: 600; color: #667eea;">Rank</th>
                            <th style="padding: 12px; text-align: left; font-weight: 600; color: #667eea;">Duty</th>
                            <th style="padding: 12px; text-align: left; font-weight: 600; color: #667eea;">Task</th>
                            <th style="padding: 12px; text-align: center; font-weight: 600; color: #667eea;">Avg<br>Importance</th>
                            <th style="padding: 12px; text-align: center; font-weight: 600; color: #667eea;">Avg<br>Frequency</th>
                            <th style="padding: 12px; text-align: center; font-weight: 600; color: #667eea;">Avg<br>Difficulty</th>
                            <th style="padding: 12px; text-align: center; font-weight: 600; color: #667eea;">Priority<br>Index</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    allTasks.forEach((task, index) => {
        const rankColor = index < 3 ? '#10b981' : '#64748b';
        const rankBg = index < 3 ? '#d1fae5' : '#f1f5f9';
        
        html += `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px;">
                    <span style="background: ${rankBg}; color: ${rankColor}; padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.95em;">
                        #${task.rank}
                    </span>
                </td>
                <td style="padding: 12px; color: #334155; font-weight: 500;">${lwEscapeHtml(task.dutyTitle)}</td>
                <td style="padding: 12px; color: #475569;">${lwEscapeHtml(task.taskText)}</td>
                <td style="padding: 12px; text-align: center; font-weight: 600; color: #667eea;">${task.avgImportance.toFixed(2)}</td>
                <td style="padding: 12px; text-align: center; font-weight: 600; color: #667eea;">${task.avgFrequency.toFixed(2)}</td>
                <td style="padding: 12px; text-align: center; font-weight: 600; color: #667eea;">${task.avgDifficulty.toFixed(2)}</td>
                <td style="padding: 12px; text-align: center; font-weight: 700; font-size: 1.1em; color: #10b981;">${task.priorityIndex.toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #334155; font-size: 0.9em; line-height: 1.6;">
                    <strong>Priority Index</strong> = ${formulaText}<br>
                    <strong>Higher values</strong> indicate greater training priority and importance for the occupation.
                </p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}


function lwEscapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== LIVE WORKSHOP - EXPORT FUNCTIONS =====

// Export JSON with voting data

function lwExportJSON() {
    if (!state.lwFinalizedData || !state.lwAggregatedResults) {
        showStatus('No results available to export', 'error');
        return;
    }
    
    // Export in v3.9-compatible format with tasks reordered and voting metrics embedded
    const exportData = {
        version: '1.0',
        savedDate: new Date().toISOString(),
        liveWorkshopSession: {
            sessionId: state.lwSessionId,
            totalParticipants: state.lwAggregatedResults.totalVotes,
            exportDate: new Date().toISOString()
        },
        chartInfo: {
            dacumDate: document.getElementById('dacumDate')?.value || '',
            producedFor: document.getElementById('producedFor')?.value || '',
            producedBy: document.getElementById('producedBy')?.value || '',
            occupationTitle: state.lwFinalizedData.occupation,
            jobTitle: state.lwFinalizedData.jobTitle,
            sector: document.getElementById('sector')?.value || '',
            context: document.getElementById('context')?.value || '',
            producedForImage: null,
            producedByImage: null
        },
        duties: [],
        additionalInfo: {
            headings: {
                knowledge: document.getElementById('knowledgeHeading')?.textContent || 'Knowledge & Subject Matter',
                skills: document.getElementById('skillsHeading')?.textContent || 'Skills',
                behaviors: document.getElementById('behaviorsHeading')?.textContent || 'Behaviors & Attitudes',
                tools: document.getElementById('toolsHeading')?.textContent || 'Tools & Equipment',
                trends: document.getElementById('trendsHeading')?.textContent || 'Future Trends & Technology',
                acronyms: document.getElementById('acronymsHeading')?.textContent || 'Acronyms',
                careerPath: document.getElementById('careerPathHeading')?.textContent || 'Career Path'
            },
            knowledge: document.getElementById('knowledgeInput')?.value || '',
            skills: document.getElementById('skillsInput')?.value || '',
            behaviors: document.getElementById('behaviorsInput')?.value || '',
            tools: document.getElementById('toolsInput')?.value || '',
            trends: document.getElementById('trendsInput')?.value || '',
            acronyms: document.getElementById('acronymsInput')?.value || '',
            careerPath: document.getElementById('careerPathInput')?.value || ''
        },
        customSections: [],
        verification: {
            collectionMode: 'workshop',
            workflowMode: 'standard',
            ratings: {},
            taskMetadata: {},
            workshopParticipants: state.lwAggregatedResults.totalVotes,
            priorityFormula: state.lwFinalizedData.priorityFormula || 'if',
            trainingLoadMethod: 'advanced',
            workshopCounts: {},
            workshopResults: {}
        }
    };
    
    // Convert duties object to array format with tasks as strings (in priority order)
    Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
        const duty = state.lwFinalizedData.duties[dutyId];
        
        // Tasks are already sorted by priority in state.lwFinalizedData after lwApplyVotingResultsToDataModel
        // Export tasks as simple strings for compatibility
        const taskStrings = duty.tasks.map(task => task.text);
        
        exportData.duties.push({
            duty: duty.title,
            tasks: taskStrings
        });
        
        // Store voting metrics in verification.workshopResults
        duty.tasks.forEach(task => {
            if (task.meanImportance !== undefined) {
                exportData.verification.workshopResults[task.id] = {
                    valid: true,
                    dutyId: dutyId,
                    dutyTitle: duty.title,
                    taskText: task.text,
                    meanImportance: task.meanImportance,
                    meanFrequency: task.meanFrequency,
                    meanDifficulty: task.meanDifficulty,
                    priorityIndex: task.priorityIndex,
                    rank: task.rank,
                    totalResponses: state.lwAggregatedResults.totalVotes
                };
            }
        });
    });
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.lwFinalizedData.occupation}_${state.lwFinalizedData.jobTitle}_LiveWorkshop_Results.json`.replace(/[^a-z0-9_]/gi, '_');
    a.click();
    URL.revokeObjectURL(url);
    
    showStatus('✅ JSON file exported with tasks in priority order!', 'success');
}

// Export CSV with tasks and scores
// Escape a value for safe inclusion in a CSV cell.
// Doubles any embedded double-quotes; caller wraps the value in quotes.
function lwEscapeCSV(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/"/g, '""');
}

function lwExportCSV() {
    if (!state.lwAggregatedResults) {
        showStatus('No results available to export', 'error');
        return;
    }
    
    const { taskResults } = state.lwAggregatedResults;
    
    // Sort by priority index
    const sortedTasks = Object.keys(taskResults)
        .map(taskKey => taskResults[taskKey])
        .sort((a, b) => b.priorityIndex - a.priorityIndex);
    
    // CSV Header
    let csv = 'Rank,Duty,Task,Avg Importance,Avg Frequency,Avg Difficulty,Priority Index\n';
    
    // CSV Rows
    sortedTasks.forEach((task, index) => {
        csv += `${index + 1},"${lwEscapeCSV(task.dutyTitle)}","${lwEscapeCSV(task.taskText)}",${task.avgImportance.toFixed(2)},${task.avgFrequency.toFixed(2)},${task.avgDifficulty.toFixed(2)},${task.priorityIndex.toFixed(2)}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.lwFinalizedData.occupation}_${state.lwFinalizedData.jobTitle}_LiveWorkshop_Results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showStatus('✅ CSV file exported successfully!', 'success');
}

// Download snapshot (pre-voting backup)
function lwExportSnapshot() {
    if (!state.lwFinalizedData) {
        showStatus('No snapshot available to export', 'error');
        return;
    }
    
    // Export in v3.9-compatible format (pre-voting snapshot without results)
    const snapshotData = {
        version: '1.0',
        savedDate: new Date().toISOString(),
        liveWorkshopSession: {
            sessionId: state.lwSessionId,
            type: 'PRE-VOTING SNAPSHOT',
            snapshotDate: new Date().toISOString()
        },
        chartInfo: {
            dacumDate: document.getElementById('dacumDate')?.value || '',
            producedFor: document.getElementById('producedFor')?.value || '',
            producedBy: document.getElementById('producedBy')?.value || '',
            occupationTitle: state.lwFinalizedData.occupation,
            jobTitle: state.lwFinalizedData.jobTitle,
            sector: document.getElementById('sector')?.value || '',
            context: document.getElementById('context')?.value || '',
            producedForImage: null,
            producedByImage: null
        },
        duties: [],
        additionalInfo: {
            headings: {
                knowledge: document.getElementById('knowledgeHeading')?.textContent || 'Knowledge & Subject Matter',
                skills: document.getElementById('skillsHeading')?.textContent || 'Skills',
                behaviors: document.getElementById('behaviorsHeading')?.textContent || 'Behaviors & Attitudes',
                tools: document.getElementById('toolsHeading')?.textContent || 'Tools & Equipment',
                trends: document.getElementById('trendsHeading')?.textContent || 'Future Trends & Technology',
                acronyms: document.getElementById('acronymsHeading')?.textContent || 'Acronyms',
                careerPath: document.getElementById('careerPathHeading')?.textContent || 'Career Path'
            },
            knowledge: document.getElementById('knowledgeInput')?.value || '',
            skills: document.getElementById('skillsInput')?.value || '',
            behaviors: document.getElementById('behaviorsInput')?.value || '',
            tools: document.getElementById('toolsInput')?.value || '',
            trends: document.getElementById('trendsInput')?.value || '',
            acronyms: document.getElementById('acronymsInput')?.value || '',
            careerPath: document.getElementById('careerPathInput')?.value || ''
        },
        customSections: []
    };

    // Add Skills Level Matrix to snapshot
    if (typeof state.skillsLevelDataAdditional !== 'undefined' && state.skillsLevelDataAdditional) {
        snapshotData.skillsLevelMatrix = state.skillsLevelDataAdditional;
    }
    
    // Convert duties object to array format for v3.9
    Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
        const duty = state.lwFinalizedData.duties[dutyId];
        const tasks = duty.tasks.map(task => task.text);
        
        snapshotData.duties.push({
            duty: duty.title,
            tasks: tasks
        });
    });
    
    const json = JSON.stringify(snapshotData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.lwFinalizedData.occupation}_${state.lwFinalizedData.jobTitle}_PreVoting_Snapshot.json`.replace(/[^a-z0-9_]/gi, '_');
    a.click();
    URL.revokeObjectURL(url);
    
    showStatus('✅ Snapshot downloaded successfully! (v3.9 compatible format)', 'success');
}

function lwCloseVoting() {
    if (!state.lwSessionId) {
        showStatus('No active session found', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to close this voting session? Participants will no longer be able to submit or change votes.')) {
        return;
    }
    
    localStorage.setItem('dacumVotingClosed_' + state.lwSessionId, 'true');
    
    showStatus('✅ Voting session closed successfully. Participants can no longer submit votes.', 'success');
}


// ===== LIVE WORKSHOP - VERIFIED RESULTS PDF EXPORT =====
async function lwExportVerifiedPDF() {
    if (!state.lwFinalizedData || !state.lwAggregatedResults) {
        showStatus('No verified results available. Please refresh voting results first.', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPos = margin;
    
    // Helper to add new page if needed
    const checkPageBreak = (requiredSpace) => {
        if (yPos + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    };
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DACUM Live Pro', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.setFontSize(14);
    doc.text('Verified (Post-Vote) Results', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // Metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Occupation: ${state.lwFinalizedData.occupation}`, margin, yPos);
    yPos += 6;
    doc.text(`Job Title: ${state.lwFinalizedData.jobTitle}`, margin, yPos);
    yPos += 6;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 6;
    const formula = state.lwFinalizedData.priorityFormula || 'if';
    const formulaText = formula === 'ifd' ? 'IF × D' : 'I × F';
    doc.text(`Priority Formula: ${formulaText}`, margin, yPos);
    yPos += 6;
    doc.text(`Total Participants: ${state.lwAggregatedResults.totalVotes}`, margin, yPos);
    yPos += 10;
    
    // Collect all tasks with metrics
    const allTasks = [];
    Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
        const duty = state.lwFinalizedData.duties[dutyId];
        duty.tasks.forEach(task => {
            if (task.priorityIndex !== undefined) {
                allTasks.push({
                    dutyTitle: duty.title,
                    taskText: task.text,
                    meanImportance: task.meanImportance,
                    meanFrequency: task.meanFrequency,
                    meanDifficulty: task.meanDifficulty,
                    priorityIndex: task.priorityIndex,
                    rank: task.rank
                });
            }
        });
    });
    
    allTasks.sort((a, b) => a.rank - b.rank);
    
    // Table header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Rank', margin, yPos);
    doc.text('Duty', margin + 15, yPos);
    doc.text('Task', margin + 60, yPos);
    doc.text('I', margin + 140, yPos);
    doc.text('F', margin + 150, yPos);
    doc.text('D', margin + 160, yPos);
    doc.text('PI', margin + 170, yPos);
    yPos += 5;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;
    
    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    allTasks.forEach(task => {
        checkPageBreak(8);
        
        doc.text(String(task.rank), margin, yPos);
        const dutyLines = doc.splitTextToSize(task.dutyTitle, 40);
        doc.text(dutyLines[0] || '', margin + 15, yPos);
        const taskLines = doc.splitTextToSize(task.taskText, 75);
        doc.text(taskLines[0] || '', margin + 60, yPos);
        doc.text(task.meanImportance.toFixed(2), margin + 140, yPos);
        doc.text(task.meanFrequency.toFixed(2), margin + 150, yPos);
        doc.text(task.meanDifficulty.toFixed(2), margin + 160, yPos);
        doc.text(task.priorityIndex.toFixed(2), margin + 170, yPos);
        yPos += 6;
    });
    
    doc.save(`${state.lwFinalizedData.occupation}_${state.lwFinalizedData.jobTitle}_Verified_Results.pdf`.replace(/[^a-z0-9_]/gi, '_'));
    showStatus('✅ PDF exported successfully!', 'success');
}

// ===== LIVE WORKSHOP - VERIFIED RESULTS DOCX EXPORT =====
async function lwExportVerifiedDOCX() {
    if (!state.lwFinalizedData || !state.lwAggregatedResults) {
        showStatus('No verified results available. Please refresh voting results first.', 'error');
        return;
    }
    
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, BorderStyle } = docx;
    
    // Collect all tasks with metrics
    const allTasks = [];
    Object.keys(state.lwFinalizedData.duties).forEach(dutyId => {
        const duty = state.lwFinalizedData.duties[dutyId];
        duty.tasks.forEach(task => {
            if (task.priorityIndex !== undefined) {
                allTasks.push({
                    dutyTitle: duty.title,
                    taskText: task.text,
                    meanImportance: task.meanImportance,
                    meanFrequency: task.meanFrequency,
                    meanDifficulty: task.meanDifficulty,
                    priorityIndex: task.priorityIndex,
                    rank: task.rank
                });
            }
        });
    });
    
    allTasks.sort((a, b) => a.rank - b.rank);
    
    const formula = state.lwFinalizedData.priorityFormula || 'if';
    const formulaText = formula === 'ifd' ? 'I × F × D' : 'I × F';
    
    // Create table rows
    const tableRows = [
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ text: 'Rank', bold: true })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [new Paragraph({ text: 'Duty', bold: true })], width: { size: 22, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [new Paragraph({ text: 'Task', bold: true })], width: { size: 35, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [new Paragraph({ text: 'I', bold: true })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [new Paragraph({ text: 'F', bold: true })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [new Paragraph({ text: 'D', bold: true })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [new Paragraph({ text: 'PI', bold: true })], width: { size: 11, type: WidthType.PERCENTAGE } })
            ]
        })
    ];
    
    allTasks.forEach(task => {
        tableRows.push(
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph(String(task.rank))] }),
                    new TableCell({ children: [new Paragraph(task.dutyTitle)] }),
                    new TableCell({ children: [new Paragraph(task.taskText)] }),
                    new TableCell({ children: [new Paragraph(task.meanImportance.toFixed(2))] }),
                    new TableCell({ children: [new Paragraph(task.meanFrequency.toFixed(2))] }),
                    new TableCell({ children: [new Paragraph(task.meanDifficulty.toFixed(2))] }),
                    new TableCell({ children: [new Paragraph(task.priorityIndex.toFixed(2))] })
                ]
            })
        );
    });
    
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    text: 'DACUM Live Pro',
                    heading: 'Heading1',
                    alignment: AlignmentType.CENTER
                }),
                new Paragraph({
                    text: 'Verified (Post-Vote) Results',
                    heading: 'Heading2',
                    alignment: AlignmentType.CENTER
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: `Occupation: ${state.lwFinalizedData.occupation}` }),
                new Paragraph({ text: `Job Title: ${state.lwFinalizedData.jobTitle}` }),
                new Paragraph({ text: `Date: ${new Date().toLocaleDateString()}` }),
                new Paragraph({ text: `Priority Formula: ${formulaText}` }),
                new Paragraph({ text: `Total Participants: ${state.lwAggregatedResults.totalVotes}` }),
                new Paragraph({ text: '' }),
                new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } })
            ]
        }]
    });
    
    Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.lwFinalizedData.occupation}_${state.lwFinalizedData.jobTitle}_Verified_Results.docx`.replace(/[^a-z0-9_]/gi, '_');
        a.click();
        URL.revokeObjectURL(url);
        showStatus('✅ DOCX exported successfully!', 'success');
    });
}


// ===== LIVE WORKSHOP - PARTICIPANT MODE DETECTION =====
// Check if URL has lwsession parameter (participant mode)
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
        setTimeout(lwCheckAndShowSection, 100);
    }
});

// ===== END LIVE WORKSHOP MODULE =====

// ===== COMPETENCY CLUSTERING MODULE =====

// state.clusteringData initialized in state.js

function getTaskCode(taskId) {
    // Extract duty number and task number from ID like "duty_2_3"
    const parts = taskId.split('_');
    if (parts.length >= 3) {
        const dutyNum = parseInt(parts[1]);
        const taskNum = parts[2];
        const dutyLetter = String.fromCharCode(64 + dutyNum); // 1->A, 2->B, etc.
        return `Task ${dutyLetter}${taskNum}`;
    }
    return '';
}

function bypassToClusteringTab() {
    state.verificationDecisionMade = true;
    state.clusteringAllowed = true;
    document.getElementById('btnLWFinalize').disabled = true;
    document.getElementById('btnBypassToClustering').disabled = true;
    document.getElementById('btnResetDecision').style.display = 'inline-block';
    initializeClusteringFromTasks();
    switchTab('clustering-tab');
}

function resetVerificationDecision() {
    state.verificationDecisionMade = false;
    state.clusteringAllowed = false;
    document.getElementById('btnLWFinalize').disabled = false;
    document.getElementById('btnBypassToClustering').disabled = false;
    document.getElementById('btnResetDecision').style.display = 'none';
}

function initializeClusteringFromTasks() {
    state.clusteringData.availableTasks = [];
    state.clusteringData.clusters = [];
    state.clusteringData.clusterCounter = 0;
    
    // Check if we have voting results
    if (state.lwAggregatedResults && state.lwAggregatedResults.taskResults) {
        // Use voted and ranked tasks
        const taskResults = state.lwAggregatedResults.taskResults;
        const allTasks = [];
        
        Object.keys(taskResults).forEach(taskId => {
            const voteData = taskResults[taskId];
            allTasks.push({
                id: taskId,
                text: voteData.taskText,
                dutyTitle: voteData.dutyTitle,
                priorityIndex: voteData.priorityIndex || 0
            });
        });
        
        // Sort by priority index (highest first)
        allTasks.sort((a, b) => b.priorityIndex - a.priorityIndex);
        state.clusteringData.availableTasks = allTasks;
    } else {
        // Use final task list without scores
        const duties = lwExtractDutiesAndTasks();
        const allTasks = [];
        
        Object.keys(duties).forEach(dutyId => {
            const duty = duties[dutyId];
            duty.tasks.forEach(task => {
                allTasks.push({
                    id: task.id,
                    text: task.text,
                    dutyTitle: duty.title,
                    priorityIndex: null
                });
            });
        });
        
        state.clusteringData.availableTasks = allTasks;
    }
    
    renderAvailableTasks();
    renderClusters();
}

function renderAvailableTasks() {
    const container = document.getElementById('availableTasksList');
    
    if (state.clusteringData.availableTasks.length === 0) {
        container.innerHTML = '<div class="no-tasks-message">All tasks have been assigned to clusters.</div>';
        document.getElementById('btnCreateCluster').disabled = true;
        return;
    }
    
    let html = '';
    state.clusteringData.availableTasks.forEach((task, index) => {
        const taskCode = getTaskCode(task.id);
        
        // Build cluster dropdown options
        let clusterOptions = '<option value="">Select Cluster</option>';
        state.clusteringData.clusters.forEach(cluster => {
            clusterOptions += `<option value="${cluster.id}">${cluster.name}</option>`;
        });
        
        html += `
            <div class="task-checkbox-item">
                <input type="checkbox" id="task_${index}" onchange="updateCreateClusterButton()">
                <label for="task_${index}" class="task-checkbox-label">
                    <strong>${taskCode}:</strong> ${task.text}
                </label>
                ${task.priorityIndex !== null ? `<span class="task-priority-badge">PI: ${task.priorityIndex.toFixed(2)}</span>` : ''}
                ${state.clusteringData.clusters.length > 0 ? `
                <div class="task-dropdown-container">
                    <span class="task-dropdown-label">Add to:</span>
                    <select class="task-reassign-dropdown" onchange="addTaskToClusterFromDropdown(${index}, this.value); this.value='';">
                        ${clusterOptions}
                    </select>
                </div>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateCreateClusterButton();
}

function updateCreateClusterButton() {
    const checkboxes = document.querySelectorAll('#availableTasksList input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    document.getElementById('btnCreateCluster').disabled = !anyChecked;
}

function createCluster() {
    const checkboxes = document.querySelectorAll('#availableTasksList input[type="checkbox"]');
    const selectedIndices = [];
    
    checkboxes.forEach((cb, index) => {
        if (cb.checked) {
            selectedIndices.push(index);
        }
    });
    
    if (selectedIndices.length === 0) return;
    
    // Create new cluster
    state.clusteringData.clusterCounter++;
    const newCluster = {
        id: `cluster_${state.clusteringData.clusterCounter}`,
        name: `Cluster ${state.clusteringData.clusterCounter}`,
        tasks: [],
        range: '',
        performanceCriteria: []
    };
    
    // Move selected tasks to cluster (in reverse order to maintain indices)
    selectedIndices.sort((a, b) => b - a);
    selectedIndices.forEach(index => {
        newCluster.tasks.push(state.clusteringData.availableTasks[index]);
        state.clusteringData.availableTasks.splice(index, 1);
    });
    
    state.clusteringData.clusters.push(newCluster);
    
    renderAvailableTasks();
    renderClusters();
}

function renderClusters() {
    const container = document.getElementById('clustersContainer');
    
    if (state.clusteringData.clusters.length === 0) {
        container.innerHTML = '<div class="no-clusters-message">No clusters created yet.</div>';
        return;
    }
    
    let html = '';
    state.clusteringData.clusters.forEach((cluster, clusterIndex) => {
        const clusterNumber = clusterIndex + 1;
        
        // Build display value with numbers
        let displayValue = '';
        if (cluster.performanceCriteria && cluster.performanceCriteria.length > 0) {
            displayValue = cluster.performanceCriteria
                .map((criterion, idx) => `${clusterNumber}-${idx + 1} ${criterion}`)
                .join('\n');
        }
        
        html += `
            <div class="cluster-item">
                <div class="cluster-header">
                    <div class="cluster-title">${cluster.name}</div>
                    <div class="cluster-actions">
                        <button class="btn-rename-cluster" onclick="renameCluster('${cluster.id}')">
                            ✏️ Rename
                        </button>
                        <button class="btn-delete-cluster" onclick="deleteCluster('${cluster.id}')">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
                
                <div class="cluster-section">
                    <h4>📋 Related Tasks (from Occupational Profile)</h4>
                    <div class="related-tasks-list">
                        ${cluster.tasks.map((task, taskIndex) => {
                            const taskCode = getTaskCode(task.id);
                            return `
                                <div class="related-task-item" style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="flex: 1;">
                                        <strong>${taskCode}:</strong> ${task.text}
                                    </div>
                                    <button class="btn-remove-task" onclick="removeTaskFromCluster('${cluster.id}', ${taskIndex})" style="margin-left: 10px;">
                                        ✕
                                    </button>
                                </div>
                            `;
                        }).join('') || '<div style="color: #999; font-style: italic;">No tasks assigned</div>'}
                    </div>
                </div>
                
                <div class="cluster-section">
                    <h4>🎯 Range</h4>
                    <div class="cluster-helper-text">Define the range of situations, contexts, or conditions for this competency.</div>
                    <textarea id="range_${cluster.id}" onchange="updateClusterRange('${cluster.id}', this.value)">${cluster.range || ''}</textarea>
                </div>
                
                <div class="cluster-section">
                    <h4>✅ Performance Criteria</h4>
                    <div class="cluster-helper-text">Press Enter to add new criterion. Numbers are auto-generated.</div>
                    <textarea id="criteria_${cluster.id}" 
                              data-cluster-number="${clusterNumber}"
                              onfocus="initCriteriaNumber(event, '${cluster.id}')"
                              onkeydown="handleCriteriaKeydown(event, '${cluster.id}')"
                              onblur="updateClusterCriteriaFromNumbered('${cluster.id}', this.value)"
                              placeholder="Click to start first criterion..."
                              style="min-height: 120px;">${displayValue}</textarea>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renameCluster(clusterId) {
    const cluster = state.clusteringData.clusters.find(c => c.id === clusterId);
    if (!cluster) return;
    
    const newName = prompt('Enter new cluster name:', cluster.name);
    if (newName && newName.trim()) {
        cluster.name = newName.trim();
        renderClusters();
    }
}

function deleteCluster(clusterId) {
    const clusterIndex = state.clusteringData.clusters.findIndex(c => c.id === clusterId);
    if (clusterIndex === -1) return;
    
    const cluster = state.clusteringData.clusters[clusterIndex];
    
    // Return all tasks to available
    state.clusteringData.availableTasks.push(...cluster.tasks);
    
    // Re-sort if we have priority indices
    if (state.clusteringData.availableTasks.length > 0 && state.clusteringData.availableTasks[0].priorityIndex !== null) {
        state.clusteringData.availableTasks.sort((a, b) => b.priorityIndex - a.priorityIndex);
    }
    
    // Remove cluster
    state.clusteringData.clusters.splice(clusterIndex, 1);
    
    renderAvailableTasks();
    renderClusters();
}

function removeTaskFromCluster(clusterId, taskIndex) {
    const cluster = state.clusteringData.clusters.find(c => c.id === clusterId);
    if (!cluster) return;
    
    const task = cluster.tasks[taskIndex];
    cluster.tasks.splice(taskIndex, 1);
    
    // Return task to available
    state.clusteringData.availableTasks.push(task);
    
    // Re-sort if we have priority indices
    if (state.clusteringData.availableTasks.length > 0 && state.clusteringData.availableTasks[0].priorityIndex !== null) {
        state.clusteringData.availableTasks.sort((a, b) => b.priorityIndex - a.priorityIndex);
    }
    
    renderAvailableTasks();
    renderClusters();
}

function addTaskToClusterFromDropdown(taskIndex, clusterId) {
    if (!clusterId) return;
    
    const cluster = state.clusteringData.clusters.find(c => c.id === clusterId);
    if (!cluster) return;
    
    const task = state.clusteringData.availableTasks[taskIndex];
    if (!task) return;
    
    // Add task to cluster
    cluster.tasks.push(task);
    
    // Remove from available tasks
    state.clusteringData.availableTasks.splice(taskIndex, 1);
    
    renderAvailableTasks();
    renderClusters();
}

function updateClusterRange(clusterId, value) {
    const cluster = state.clusteringData.clusters.find(c => c.id === clusterId);
    if (cluster) {
        cluster.range = value;
    }
}

function updateClusterCriteria(clusterId, value) {
    const cluster = state.clusteringData.clusters.find(c => c.id === clusterId);
    if (cluster) {
        cluster.performanceCriteria = value.split('\n').map(line => line.trim()).filter(line => line);
        renderClusters();
    }
}

function updateClusterCriteriaFromNumbered(clusterId, value) {
    const cluster = state.clusteringData.clusters.find(c => c.id === clusterId);
    if (!cluster) return;
    
    // Strip numbers (e.g., "1-1 text" -> "text")
    const lines = value.split('\n');
    const stripped = lines.map(line => {
        const match = line.match(/^\d+-\d+\s+(.*)$/);
        return match ? match[1].trim() : line.trim();
    }).filter(line => line);
    
    cluster.performanceCriteria = stripped;
}

function handleCriteriaKeydown(event, clusterId) {
    if (event.key === 'Enter') {
        const textarea = event.target;
        const clusterNumber = textarea.getAttribute('data-cluster-number');
        const cursorPos = textarea.selectionStart;
        const value = textarea.value;
        
        // Count existing criteria
        const lines = value.substring(0, cursorPos).split('\n');
        const nextNumber = lines.length + 1;
        
        // Prevent default and insert numbered line
        event.preventDefault();
        
        const before = value.substring(0, cursorPos);
        const after = value.substring(cursorPos);
        const newText = before + '\n' + clusterNumber + '-' + nextNumber + ' ' + after;
        
        textarea.value = newText;
        
        // Move cursor after the new number
        const newCursorPos = cursorPos + 1 + clusterNumber.length + 1 + String(nextNumber).length + 1;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
}

function initCriteriaNumber(event, clusterId) {
    const textarea = event.target;
    const clusterNumber = textarea.getAttribute('data-cluster-number');
    
    // If empty, add first number
    if (!textarea.value.trim()) {
        textarea.value = clusterNumber + '-1 ';
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
}

// Auto-initialize clustering when switching to clustering tab
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

function proceedToClusteringFromVerification() {
    if (state.clusteringAllowed !== true) {
        alert('Please choose one option above (Live Voting or Without Verification) first.');
        return;
    }
    initializeClusteringFromTasks();
    switchTab('clustering-tab');
}

function switchTab(tabId) {
    // Validate clustering tab access
    if (tabId === 'clustering-tab' && !state.clusteringAllowed) {
        alert('Please choose an option in Task Verification tab:\n\n1. Finalize & Create Live Voting Session\n   OR\n2. Proceed to Competency Clustering Without Verification\n\nYou must select one option before proceeding.');
        return;
    }
    
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    const selectedContent = document.getElementById(tabId);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
        
        // Trigger render functions for specific tabs
        if (tabId === 'learning-outcomes-tab') {
            if (typeof renderPCSourceList === 'function') {
                renderPCSourceList();
            }
            if (typeof renderLearningOutcomes === 'function') {
                renderLearningOutcomes();
            }
        }
        
        if (tabId === 'module-mapping-tab') {
            if (typeof renderModuleLoList === 'function') {
                renderModuleLoList();
            }
            if (typeof renderModules === 'function') {
                renderModules();
            }
        }
    }
}

// ===== END COMPETENCY CLUSTERING MODULE =====

// ===== LEARNING OUTCOMES MODULE =====
// Phase 3: Learning Outcomes from Performance Criteria
// Future: Phase 4 will add CBT/Module generation


// state.learningOutcomesData initialized in state.js

function renderPCSourceList() {
    const container = document.getElementById('pcSourceList');
    
    if (!container) return;
    
    // Check if state.clusteringData exists and has clusters
    if (typeof state.clusteringData === 'undefined' || !state.clusteringData.clusters || state.clusteringData.clusters.length === 0) {
        container.innerHTML = '<div class="no-tasks-message">No Performance Criteria available. Please create Competency Clusters with Performance Criteria first.</div>';
        return;
    }
    
    // Get all used PC IDs
    const usedPCIds = new Set();
    if (state.learningOutcomesData && state.learningOutcomesData.outcomes) {
        state.learningOutcomesData.outcomes.forEach(lo => {
            if (lo.linkedCriteria) {
                lo.linkedCriteria.forEach(pc => usedPCIds.add(pc.id));
            }
        });
    }
    
    let html = '';
    let hasAnyCriteria = false;
    
    state.clusteringData.clusters.forEach((cluster, clusterIndex) => {
        const clusterNumber = clusterIndex + 1;
        
        // Check if cluster has performance criteria
        if (!cluster.performanceCriteria || !Array.isArray(cluster.performanceCriteria) || cluster.performanceCriteria.length === 0) {
            return; // Skip clusters without criteria
        }
        
        hasAnyCriteria = true;
        
        html += `<div class="pc-cluster-group">`;
        html += `<h4>${cluster.name}</h4>`;
        
        cluster.performanceCriteria.forEach((criterion, criterionIndex) => {
            if (!criterion || !criterion.trim()) return; // Skip empty criteria
            
            const pcId = `C${clusterNumber}-PC${criterionIndex + 1}`;
            const isUsed = usedPCIds.has(pcId);
            
            // Build LO dropdown options for used PCs
            let loOptions = '<option value="">Assign to LO</option>';
            if (state.learningOutcomesData && state.learningOutcomesData.outcomes) {
                state.learningOutcomesData.outcomes.forEach(lo => {
                    loOptions += `<option value="${lo.id}">${lo.number}</option>`;
                });
            }
            
            html += `
                <div class="pc-checkbox-item ${isUsed ? 'used' : ''}" id="pc_${pcId}">
                    <input type="checkbox" 
                           id="cb_${pcId}" 
                           data-pc-id="${pcId}"
                           data-cluster="${clusterNumber}"
                           data-criterion="${criterionIndex}"
                           ${isUsed ? 'disabled' : ''}
                           onchange="updateCreateLOButton()">
                    <label for="cb_${pcId}" class="pc-label">
                        <span class="pc-number">${pcId}:</span> ${criterion}
                    </label>
                    ${isUsed ? '<span class="pc-used-badge">Used</span>' : ''}
                    ${state.learningOutcomesData && state.learningOutcomesData.outcomes && state.learningOutcomesData.outcomes.length > 0 ? `
                    <div class="task-dropdown-container" style="margin-left: 10px;">
                        <select class="task-reassign-dropdown" onchange="reassignPCToLO('${pcId}', ${clusterNumber}, ${criterionIndex}, this.value); this.value='';">
                            ${loOptions}
                        </select>
                    </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    if (!hasAnyCriteria || !html) {
        container.innerHTML = '<div class="no-tasks-message">No Performance Criteria available. Please add Performance Criteria to your Competency Clusters first.</div>';
    } else {
        container.innerHTML = html;
    }
    
    updateCreateLOButton();
}

function updateCreateLOButton() {
    const checkboxes = document.querySelectorAll('#pcSourceList input[type="checkbox"]:not([disabled])');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    document.getElementById('btnCreateLO').disabled = !anyChecked;
}

function createLearningOutcome() {
    const checkboxes = document.querySelectorAll('#pcSourceList input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) return;
    
    // Collect selected criteria
    const linkedCriteria = [];
    checkboxes.forEach(cb => {
        const pcId = cb.getAttribute('data-pc-id');
        const clusterNum = parseInt(cb.getAttribute('data-cluster'));
        const criterionIdx = parseInt(cb.getAttribute('data-criterion'));
        
        const cluster = state.clusteringData.clusters[clusterNum - 1];
        const criterionText = cluster.performanceCriteria[criterionIdx];
        
        linkedCriteria.push({
            id: pcId,
            text: criterionText,
            clusterNumber: clusterNum
        });
    });
    
    // Create new Learning Outcome
    state.learningOutcomesData.outcomeCounter++;
    const newLO = {
        id: `lo_${state.learningOutcomesData.outcomeCounter}`,
        number: `LO-${state.learningOutcomesData.outcomeCounter}`,
        statement: '',
        linkedCriteria: linkedCriteria
    };
    
    state.learningOutcomesData.outcomes.push(newLO);
    
    // Refresh displays
    renderPCSourceList();
    renderLearningOutcomes();
}

function renderLearningOutcomes() {
    const container = document.getElementById('loBlocksContainer');
    
    if (state.learningOutcomesData.outcomes.length === 0) {
        container.innerHTML = '<div class="no-clusters-message">No Learning Outcomes created yet.</div>';
        return;
    }
    
    let html = '';
    state.learningOutcomesData.outcomes.forEach(lo => {
        const isEditing = lo.editing || false;
        
        html += `
            <div class="lo-block" id="${lo.id}">
                <div class="lo-block-header">
                    <div class="lo-number">${lo.number}</div>
                    <div class="lo-actions">
                        <button class="btn-edit-lo" onclick="toggleEditLO('${lo.id}')">
                            ${isEditing ? '💾 Save' : '✏️ Edit'}
                        </button>
                        <button class="btn-delete-lo" onclick="deleteLearningOutcome('${lo.id}')">
                            ❌ Delete
                        </button>
                    </div>
                </div>
                
                <div class="lo-statement" id="statement_${lo.id}">
                    ${isEditing ? 
                        `<textarea id="textarea_${lo.id}" onblur="saveLOStatement('${lo.id}')">${lo.statement}</textarea>` :
                        `${lo.statement || '<em style="color: #999;">Click Edit to write the Learning Outcome statement...</em>'}`
                    }
                </div>
                
                <div class="lo-linked-criteria">
                    <h5>📎 Mapped Performance Criteria:</h5>
                    ${lo.linkedCriteria.map(pc => 
                        `<div class="lo-linked-item">
                            <div style="flex: 1;">
                                <strong>${pc.id}:</strong> ${pc.text}
                            </div>
                            <button class="btn-remove-task" onclick="unassignPCFromLO('${lo.id}', '${pc.id}')" style="margin-left: 10px;">
                                ✕
                            </button>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function toggleEditLO(loId) {
    const lo = state.learningOutcomesData.outcomes.find(o => o.id === loId);
    if (!lo) return;
    
    if (lo.editing) {
        // Save mode
        saveLOStatement(loId);
        lo.editing = false;
    } else {
        // Edit mode
        lo.editing = true;
    }
    
    renderLearningOutcomes();
    
    // Focus textarea if entering edit mode
    if (lo.editing) {
        setTimeout(() => {
            const textarea = document.getElementById(`textarea_${loId}`);
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            }
        }, 50);
    }
}

function saveLOStatement(loId) {
    const textarea = document.getElementById(`textarea_${loId}`);
    if (!textarea) return;
    
    const lo = state.learningOutcomesData.outcomes.find(o => o.id === loId);
    if (lo) {
        lo.statement = textarea.value.trim();
    }
}

function deleteLearningOutcome(loId) {
    if (!confirm('Are you sure you want to delete this Learning Outcome? The linked Performance Criteria will become available again.')) {
        return;
    }
    
    const index = state.learningOutcomesData.outcomes.findIndex(o => o.id === loId);
    if (index !== -1) {
        state.learningOutcomesData.outcomes.splice(index, 1);
    }
    
    renderPCSourceList();
    renderLearningOutcomes();
}

function reassignPCToLO(pcId, clusterNumber, criterionIndex, targetLoId) {
    if (!targetLoId) return;
    
    const targetLO = state.learningOutcomesData.outcomes.find(o => o.id === targetLoId);
    if (!targetLO) return;
    
    // Check if PC is already in target LO
    const alreadyInTarget = targetLO.linkedCriteria.some(pc => pc.id === pcId);
    if (alreadyInTarget) {
        // Already assigned to this LO, just refresh the display
        renderPCSourceList();
        renderLearningOutcomes();
        return;
    }
    
    // Remove PC from all current LOs
    state.learningOutcomesData.outcomes.forEach(lo => {
        const index = lo.linkedCriteria.findIndex(pc => pc.id === pcId);
        if (index !== -1) {
            lo.linkedCriteria.splice(index, 1);
        }
    });
    
    // Add PC to target LO
    const cluster = state.clusteringData.clusters[clusterNumber - 1];
    const criterionText = cluster.performanceCriteria[criterionIndex];
    
    targetLO.linkedCriteria.push({
        id: pcId,
        text: criterionText,
        clusterNumber: clusterNumber
    });
    
    renderPCSourceList();
    renderLearningOutcomes();
}

function unassignPCFromLO(loId, pcId) {
    const lo = state.learningOutcomesData.outcomes.find(o => o.id === loId);
    if (!lo) return;
    
    // Find and remove the PC from this LO's linked criteria
    const pcIndex = lo.linkedCriteria.findIndex(pc => pc.id === pcId);
    if (pcIndex !== -1) {
        lo.linkedCriteria.splice(pcIndex, 1);
    }
    
    // Re-render both the source list and the LO blocks
    renderPCSourceList();
    renderLearningOutcomes();
}

// Auto-initialize when switching to Learning Outcomes tab
document.addEventListener('DOMContentLoaded', function() {
    const loTab = document.querySelector('[data-tab="learning-outcomes-tab"]');
    if (loTab) {
        loTab.addEventListener('click', function() {
            renderPCSourceList();
            renderLearningOutcomes();
        });
    }
});

// ===== END LEARNING OUTCOMES MODULE =====

// ===== MODULE MAPPING MODULE =====
// Phase 4: CBT Module Mapping from Learning Outcomes


// state.moduleMappingData initialized in state.js

function renderModuleLoList() {
    const container = document.getElementById('moduleLoList');
    
    if (!state.learningOutcomesData.outcomes || state.learningOutcomesData.outcomes.length === 0) {
        container.innerHTML = '<div class="no-tasks-message">No Learning Outcomes available. Please create Learning Outcomes first.</div>';
        document.getElementById('btnCreateModule').disabled = true;
        return;
    }
    
    // Get LOs that are not assigned to any module
    const assignedLoIds = new Set();
    state.moduleMappingData.modules.forEach(module => {
        module.learningOutcomes.forEach(lo => {
            assignedLoIds.add(lo.id);
        });
    });
    
    const availableLos = state.learningOutcomesData.outcomes.filter(lo => !assignedLoIds.has(lo.id));
    
    if (availableLos.length === 0) {
        container.innerHTML = '<div class="no-tasks-message">All Learning Outcomes have been assigned to modules.</div>';
        document.getElementById('btnCreateModule').disabled = true;
        return;
    }
    
    let html = '';
    availableLos.forEach(lo => {
        const criteriaText = lo.linkedCriteria.map(pc => pc.id).join(', ');
        
        // Build module dropdown options
        let moduleOptions = '<option value="">Select Module</option>';
        state.moduleMappingData.modules.forEach(module => {
            moduleOptions += `<option value="${module.id}">${module.title}</option>`;
        });
        
        html += `
            <div class="module-lo-item">
                <input type="checkbox" id="mlo_${lo.id}" onchange="updateCreateModuleButton()">
                <div class="module-lo-content">
                    <div class="module-lo-number">${lo.number}</div>
                    <div class="module-lo-statement">${lo.statement || '<em>No statement provided</em>'}</div>
                    <div class="module-lo-criteria">Mapped PC: ${criteriaText}</div>
                </div>
                ${state.moduleMappingData.modules.length > 0 ? `
                <div class="task-dropdown-container">
                    <span class="task-dropdown-label">Add to:</span>
                    <select class="task-reassign-dropdown" onchange="addLoToModuleFromDropdown('${lo.id}', this.value); this.value='';">
                        ${moduleOptions}
                    </select>
                </div>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateCreateModuleButton();
}

function updateCreateModuleButton() {
    const checkboxes = document.querySelectorAll('#moduleLoList input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    document.getElementById('btnCreateModule').disabled = !anyChecked;
}

function createModule() {
    const checkboxes = document.querySelectorAll('#moduleLoList input[type="checkbox"]');
    const selectedLoIds = [];
    
    checkboxes.forEach(cb => {
        if (cb.checked) {
            const loId = cb.id.replace('mlo_', '');
            selectedLoIds.push(loId);
        }
    });
    
    if (selectedLoIds.length === 0) return;
    
    state.moduleMappingData.moduleCounter++;
    const newModule = {
        id: `module_${state.moduleMappingData.moduleCounter}`,
        title: `Module ${state.moduleMappingData.moduleCounter}`,
        learningOutcomes: []
    };
    
    selectedLoIds.forEach(loId => {
        const lo = state.learningOutcomesData.outcomes.find(o => o.id === loId);
        if (lo) {
            newModule.learningOutcomes.push(lo);
        }
    });
    
    state.moduleMappingData.modules.push(newModule);
    
    renderModuleLoList();
    renderModules();
}

function renderModules() {
    const container = document.getElementById('modulesContainer');
    
    if (state.moduleMappingData.modules.length === 0) {
        container.innerHTML = '<div class="no-clusters-message">No modules created yet.</div>';
        return;
    }
    
    let html = '';
    state.moduleMappingData.modules.forEach(module => {
        html += `
            <div class="module-item">
                <div class="module-header">
                    <div class="module-title">${module.title}</div>
                    <div class="module-actions">
                        <button class="btn-rename-module" onclick="renameModule('${module.id}')">
                            ✏️ Rename
                        </button>
                        <button class="btn-delete-module" onclick="deleteModule('${module.id}')">
                            🗑️ Delete Module
                        </button>
                    </div>
                </div>
                <div class="module-los-list">
                    ${module.learningOutcomes.map((lo, index) => {
                        // Build full criteria text with IDs and descriptions
                        const criteriaText = lo.linkedCriteria.map(pc => `${pc.id}: ${pc.text}`).join(' • ');
                        return `
                            <div class="module-lo-assigned">
                                <div class="module-lo-assigned-content">
                                    <div class="module-lo-assigned-number">${lo.number}</div>
                                    <div class="module-lo-assigned-statement">${lo.statement || '<em>No statement</em>'}</div>
                                    <div class="module-lo-assigned-criteria">Mapped PC: ${criteriaText}</div>
                                </div>
                                <button class="btn-remove-lo" onclick="removeLoFromModule('${module.id}', '${lo.id}')">
                                    ✕ Remove
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renameModule(moduleId) {
    const module = state.moduleMappingData.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const newTitle = prompt('Enter new module title:', module.title);
    if (newTitle && newTitle.trim()) {
        module.title = newTitle.trim();
        renderModules();
    }
}

function deleteModule(moduleId) {
    const index = state.moduleMappingData.modules.findIndex(m => m.id === moduleId);
    if (index === -1) return;
    
    if (!confirm('Delete this module? All Learning Outcomes will return to the available list.')) return;
    
    state.moduleMappingData.modules.splice(index, 1);
    
    renderModuleLoList();
    renderModules();
}

function removeLoFromModule(moduleId, loId) {
    const module = state.moduleMappingData.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const loIndex = module.learningOutcomes.findIndex(lo => lo.id === loId);
    if (loIndex === -1) return;
    
    module.learningOutcomes.splice(loIndex, 1);
    
    renderModuleLoList();
    renderModules();
}

function addLoToModuleFromDropdown(loId, moduleId) {
    if (!moduleId) return;
    
    const module = state.moduleMappingData.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const lo = state.learningOutcomesData.outcomes.find(o => o.id === loId);
    if (!lo) return;
    
    // Add LO to module
    module.learningOutcomes.push(lo);
    
    renderModuleLoList();
    renderModules();
}

function openModuleBuilderFromMapping() {
    // Get occupation title for the export
    const occupationTitle = document.getElementById('occupationTitle') ? 
        document.getElementById('occupationTitle').value : '';
    const jobTitle = document.getElementById('jobTitle') ? 
        document.getElementById('jobTitle').value : '';
    const occupation = occupationTitle || jobTitle || 'Unknown Occupation';
    
    // Build export object from current module mapping data
    const exportObject = {
        source: "DACUM Live Pro v1.0",
        exportDate: new Date().toISOString(),
        occupation: occupation,
        modules: state.moduleMappingData.modules.map(module => ({
            moduleId: module.id,
            moduleTitle: module.title,
            learningOutcomes: module.learningOutcomes.map(lo => ({
                number: lo.number,
                statement: lo.statement,
                performanceCriteria: lo.linkedCriteria.map(pc => ({
                    id: pc.id,
                    text: pc.text
                }))
            }))
        }))
    };
    
    // Save to localStorage
    try {
        localStorage.setItem("dacum_modules_export", JSON.stringify(exportObject));
        // Open Module Builder in new tab
        window.open("Module_Builder.html", "_blank");
        showStatus('Module data exported! Opening Module Builder...', 'success');
    } catch (error) {
        console.error('Error exporting to Module Builder:', error);
        showStatus('Error exporting data: ' + error.message, 'error');
    }
}

function exportModuleMappingJSON() {
    // Validate that modules exist
    if (!state.moduleMappingData.modules || state.moduleMappingData.modules.length === 0) {
        showStatus('No modules to export. Please create modules first.', 'error');
        return;
    }
    
    // Get occupation title for metadata
    const occupationTitle = document.getElementById('occupationTitle') ? 
        document.getElementById('occupationTitle').value : '';
    const jobTitle = document.getElementById('jobTitle') ? 
        document.getElementById('jobTitle').value : '';
    const occupation = occupationTitle || jobTitle || 'Unknown Occupation';
    
    // Build clean, structured export object
    const exportData = {
        metadata: {
            toolName: "DACUM Live Pro",
            toolVersion: "1.0",
            exportDate: new Date().toISOString(),
            exportType: "Module Mapping",
            occupation: occupation
        },
        modules: state.moduleMappingData.modules.map(module => ({
            moduleId: module.id,
            moduleTitle: module.title,
            learningOutcomes: module.learningOutcomes.map(lo => ({
                number: lo.number,
                statement: lo.statement,
                performanceCriteria: lo.linkedCriteria.map(pc => ({
                    id: pc.id,
                    description: pc.text
                })),
                sourceTaskIds: lo.linkedCriteria.map(pc => pc.taskId).filter(Boolean)
            }))
        })),
        summary: {
            totalModules: state.moduleMappingData.modules.length,
            totalLearningOutcomes: state.moduleMappingData.modules.reduce((sum, m) => sum + m.learningOutcomes.length, 0),
            totalPerformanceCriteria: state.moduleMappingData.modules.reduce((sum, m) => 
                sum + m.learningOutcomes.reduce((loSum, lo) => loSum + lo.linkedCriteria.length, 0), 0)
        }
    };
    
    // Generate filename with current date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `module-mapping-export_${dateStr}.json`;
    
    // Create and download JSON file (offline compatible)
    try {
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
        
        showStatus(`Module Mapping exported successfully: ${filename}`, 'success');
    } catch (error) {
        console.error('Error exporting module mapping:', error);
        showStatus('Error exporting module mapping: ' + error.message, 'error');
    }
}

// Auto-initialize module mapping when switching to module mapping tab
document.addEventListener('DOMContentLoaded', function() {
    const moduleTab = document.querySelector('[data-tab="module-mapping-tab"]');
    if (moduleTab) {
        moduleTab.addEventListener('click', function() {
            renderModuleLoList();
            renderModules();
        });
    }
});



export {
    // Skills Level
    toggleSkillsLevelSection, addSkillsCategory, removeSkillsCategory,
    updateSkillsCategoryName, addSkillsCompetency, removeSkillsCompetency,
    updateSkillsCompetencyText, handleSkillsLevelChange, resetSkillsLevel, renderSkillsLevel,
    // UI utilities
    showLoadingModal, hideLoadingModal, toggleInfoBox, showStatus,
    updateUsageBadge,
    handleImageUpload, removeImage, addCustomSection, removeCustomSection,
    // Duties / tasks
    addDuty, removeDuty, addTask, removeTask, toggleEditHeading, clearSection,
    formatList, clearDuty,
    // Verification & workshop
    updateCollectionMode, updateWorkflowMode, updateParticipantCount,
    updatePriorityFormula, updateTVExportMode, loadDutiesForVerification,
    createDutyAccordion, createRatingScale, createCountInputs,
    updateRating, updatePerformsTask, updateComments, updateComputedValues,
    updateWorkshopCount, validateAndComputeTask, calculateWeightedMean,
    showValidationMessage, updateWorkshopTaskDisplay, validateAndComputeWorkshopResults,
    toggleDashboard, refreshDashboard, updateDashboardSummary, updateDashboardTable,
    toggleDutyLevelSummary, updateTrainingLoadMethod, updateDutyLevelSummary,
    exportDashboard, attachAccordionListeners, escapeHtml,
    // General
    clearAll, clearCurrentTab,
    // Exports
    exportTaskVerificationWord, exportToWord,
    exportTaskVerificationPDF, exportToPDF,
    // Live Workshop
    lwCheckAndShowSection, lwExtractDutiesAndTasks, lwGenerateId, lwCopyLink,
    lwShowQRCode, lwCloseQRModal, lwDownloadQRPNG,
    lwApplyVotingResultsToDataModel, lwUpdateDOMWithReorderedTasks,
    lwDisplayResults, lwEscapeHtml, lwExportJSON, lwExportCSV,
    lwExportSnapshot, lwCloseVoting, lwEscapeCSV,
    // Clustering
    getTaskCode, bypassToClusteringTab, resetVerificationDecision,
    initializeClusteringFromTasks, renderAvailableTasks, updateCreateClusterButton,
    createCluster, renderClusters, renameCluster, deleteCluster,
    removeTaskFromCluster, addTaskToClusterFromDropdown,
    updateClusterRange, updateClusterCriteria, updateClusterCriteriaFromNumbered,
    handleCriteriaKeydown, initCriteriaNumber, proceedToClusteringFromVerification,
    switchTab,
    // Learning Outcomes
    renderPCSourceList, updateCreateLOButton, createLearningOutcome,
    renderLearningOutcomes, toggleEditLO, saveLOStatement,
    deleteLearningOutcome, reassignPCToLO, unassignPCFromLO,
    // Module Mapping
    renderModuleLoList, updateCreateModuleButton, createModule, renderModules,
    renameModule, deleteModule, removeLoFromModule, addLoToModuleFromDropdown,
    openModuleBuilderFromMapping, exportModuleMappingJSON
};
