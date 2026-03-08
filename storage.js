// storage.js
// localStorage helpers, usage limiting, and session save/load.
import { state } from './state.js';
import { showStatus, renderSkillsLevel, addDuty, addTask,
         loadDutiesForVerification, initializeClusteringFromTasks,
         renderPCSourceList, renderLearningOutcomes,
         renderModuleLoList, renderModules, escapeHtml } from './renderer.js';

// ============ USAGE LIMITING SYSTEM ============
const DAILY_LIMIT = 10; // Maximum generations per user per day
const STORAGE_KEY = 'dacum_ai_usage';

function getUsageData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return { count: 0, date: new Date().toDateString() };
    }
    return JSON.parse(stored);
}

function checkUsageLimit() {
    const usage = getUsageData();
    const today = new Date().toDateString();

    // Reset counter if it's a new day
    if (usage.date !== today) {
        const newUsage = { count: 0, date: today };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
        return { allowed: true, remaining: DAILY_LIMIT };
    }

    // Check if limit reached
    const remaining = DAILY_LIMIT - usage.count;
    return {
        allowed: remaining > 0,
        remaining: remaining,
        count: usage.count
    };
}

function incrementUsage() {
    const usage = getUsageData();
    const today = new Date().toDateString();

    if (usage.date !== today) {
        // New day, reset counter
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 1, date: today }));
    } else {
        // Increment counter
        usage.count++;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
    }

    updateUsageBadge();
}

function updateUsageBadge() {
    const status = checkUsageLimit();
    const badge = document.getElementById('usageBadge');
    const btn = document.getElementById('aiGenerateBtn');

    if (status.remaining <= 0) {
        badge.innerHTML = `❌ Daily limit reached (${DAILY_LIMIT}/${DAILY_LIMIT}) - Try again tomorrow`;
        badge.className = 'usage-badge limit';
        badge.style.display = 'inline-block';
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    } else if (status.remaining <= 3) {
        badge.innerHTML = `⚠️ ${status.remaining} generations remaining today`;
        badge.className = 'usage-badge warning';
        badge.style.display = 'inline-block';
    } else {
        badge.innerHTML = `✅ ${status.remaining}/${DAILY_LIMIT} generations remaining today`;
        badge.className = 'usage-badge';
        badge.style.display = 'inline-block';
    }
}

// ============ LOADING MODAL FUNCTIONS ============
function saveToJSON() {
    try {
        const data = {
            version: '1.0',
            savedDate: new Date().toISOString(),
            chartInfo: {
                dacumDate: document.getElementById('dacumDate').value,
                venue: document.getElementById('venue').value,
                producedFor: document.getElementById('producedFor').value,
                producedBy: document.getElementById('producedBy').value,
                occupationTitle: document.getElementById('occupationTitle').value,
                jobTitle: document.getElementById('jobTitle').value,
                sector: document.getElementById('sector').value,
                context: document.getElementById('context').value,
                producedForImage: state.producedForImage,
                producedByImage: state.producedByImage,
                facilitators: (document.getElementById('facilitators')?.value || '').split('\n').map(s => s.trim()).filter(s => s),
                observers: (document.getElementById('observers')?.value || '').split('\n').map(s => s.trim()).filter(s => s),
                panelMembers: (document.getElementById('panelMembers')?.value || '').split('\n').map(s => s.trim()).filter(s => s)
            },
            duties: [],
            additionalInfo: {
                headings: {
                    knowledge: document.getElementById('knowledgeHeading').textContent,
                    skills: document.getElementById('skillsHeading').textContent,
                    behaviors: document.getElementById('behaviorsHeading').textContent,
                    tools: document.getElementById('toolsHeading').textContent,
                    trends: document.getElementById('trendsHeading').textContent,
                    acronyms: document.getElementById('acronymsHeading').textContent,
                    careerPath: document.getElementById('careerPathHeading').textContent
                },
                knowledge: document.getElementById('knowledgeInput').value,
                skills: document.getElementById('skillsInput').value,
                behaviors: document.getElementById('behaviorsInput').value,
                tools: document.getElementById('toolsInput').value,
                trends: document.getElementById('trendsInput').value,
                acronyms: document.getElementById('acronymsInput').value,
                careerPath: document.getElementById('careerPathInput').value
            },
            customSections: []
        };

        // Collect duties and tasks
        const dutyInputs = document.querySelectorAll('[data-duty-id]');
        dutyInputs.forEach(dutyInput => {
            const dutyText = dutyInput.value.trim();
            const dutyId = dutyInput.getAttribute('data-duty-id');
            const taskInputs = document.querySelectorAll(`[data-task-id^="${dutyId}_"]`);
            const tasks = [];
            
            taskInputs.forEach(taskInput => {
                const taskText = taskInput.value.trim();
                if (taskText) {
                    tasks.push(taskText);
                }
            });
            
            data.duties.push({
                duty: dutyText,
                tasks: tasks
            });
        });

        // Collect custom sections
        const customSectionsContainer = document.getElementById('customSectionsContainer');
        const customSectionDivs = customSectionsContainer.querySelectorAll('.section-container');
        customSectionDivs.forEach(sectionDiv => {
            const headingElement = sectionDiv.querySelector('h3');
            const textareaElement = sectionDiv.querySelector('textarea');
            if (headingElement && textareaElement) {
                data.customSections.push({
                    heading: headingElement.textContent,
                    content: textareaElement.value
                });
            }
        });

        // Collect verification ratings (includes workflow mode and workshop data)
        data.verification = {
            collectionMode: state.collectionMode,
            workflowMode: state.workflowMode,
            ratings: state.verificationRatings,
            taskMetadata: state.taskMetadata,
            // Workshop-specific data
            workshopParticipants: state.workshopParticipants,
            priorityFormula: state.priorityFormula,
            trainingLoadMethod: state.trainingLoadMethod,
            workshopCounts: state.workshopCounts,
            workshopResults: state.workshopResults
        };
        
        // Collect competency clusters
        if (typeof state.clusteringData !== 'undefined' && state.clusteringData) {
            data.competencyClusters = {
                clusters: state.clusteringData.clusters || [],
                availableTasks: state.clusteringData.availableTasks || [],
                clusterCounter: state.clusteringData.clusterCounter || 0
            };
        }
        
        // Collect learning outcomes
        if (typeof state.learningOutcomesData !== 'undefined' && state.learningOutcomesData) {
            data.learningOutcomes = {
                outcomes: state.learningOutcomesData.outcomes || [],
                outcomeCounter: state.learningOutcomesData.outcomeCounter || 0
            };
        }
        
        // Collect module mapping
        if (typeof state.moduleMappingData !== 'undefined' && state.moduleMappingData) {
            data.moduleMapping = {
                modules: state.moduleMappingData.modules || [],
                moduleCounter: state.moduleMappingData.moduleCounter || 0
            };
        }

        // Collect Skills Level Matrix data
        if (typeof state.skillsLevelDataAdditional !== 'undefined' && state.skillsLevelDataAdditional) {
            data.skillsLevelMatrix = state.skillsLevelDataAdditional;
        }

        // Create JSON file and download
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const filename = data.chartInfo.occupationTitle || 'DACUM_Chart';
        link.download = `${filename.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showStatus('Data saved successfully! ✓', 'success');
    } catch (error) {
        console.error('Error saving data:', error);
        showStatus('Error saving data: ' + error.message, 'error');
    }
}

// Load from JSON
function loadFromJSON(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // Load chart info
                if (data.chartInfo) {
                    document.getElementById('dacumDate').value = data.chartInfo.dacumDate || '';
                    document.getElementById('venue').value = data.chartInfo.venue || '';
                    document.getElementById('producedFor').value = data.chartInfo.producedFor || '';
                    document.getElementById('producedBy').value = data.chartInfo.producedBy || '';
                    document.getElementById('occupationTitle').value = data.chartInfo.occupationTitle || '';
                    document.getElementById('jobTitle').value = data.chartInfo.jobTitle || '';
                    document.getElementById('sector').value = data.chartInfo.sector || '';
                    document.getElementById('context').value = data.chartInfo.context || '';
                    
                    // Load workshop roles
                    if (data.chartInfo.facilitators && Array.isArray(data.chartInfo.facilitators)) {
                        document.getElementById('facilitators').value = data.chartInfo.facilitators.join('\n');
                    } else {
                        document.getElementById('facilitators').value = '';
                    }
                    
                    if (data.chartInfo.observers && Array.isArray(data.chartInfo.observers)) {
                        document.getElementById('observers').value = data.chartInfo.observers.join('\n');
                    } else {
                        document.getElementById('observers').value = '';
                    }
                    
                    if (data.chartInfo.panelMembers && Array.isArray(data.chartInfo.panelMembers)) {
                        document.getElementById('panelMembers').value = data.chartInfo.panelMembers.join('\n');
                    } else {
                        document.getElementById('panelMembers').value = '';
                    }
                    
                    // Restore images
                    if (data.chartInfo.producedForImage) {
                        state.producedForImage = data.chartInfo.producedForImage;
                        document.getElementById('producedForImagePreview').innerHTML = `<img src="${state.producedForImage}" alt="Produced For logo">`;
                        document.getElementById('producedForImagePreview').classList.add('has-image');
                        document.getElementById('removeProducedForImage').style.display = 'inline-block';
                    }
                    
                    if (data.chartInfo.producedByImage) {
                        state.producedByImage = data.chartInfo.producedByImage;
                        document.getElementById('producedByImagePreview').innerHTML = `<img src="${state.producedByImage}" alt="Produced By logo">`;
                        document.getElementById('producedByImagePreview').classList.add('has-image');
                        document.getElementById('removeProducedByImage').style.display = 'inline-block';
                    }
                }

                // Clear existing duties
                document.getElementById('dutiesContainer').innerHTML = '';
                state.dutyCount = 0;
                state.taskCounts = {};

                // Load duties and tasks
                if (data.duties && Array.isArray(data.duties)) {
                    data.duties.forEach(dutyData => {
                        addDuty();
                        const currentDutyId = `duty_${state.dutyCount}`;
                        const dutyInput = document.querySelector(`[data-duty-id="${currentDutyId}"]`);
                        if (dutyInput) {
                            dutyInput.value = dutyData.duty || '';
                        }

                        // Add tasks
                        if (dutyData.tasks && Array.isArray(dutyData.tasks)) {
                            dutyData.tasks.forEach((taskData, taskIndex) => {
                                addTask(currentDutyId);
                                const taskInputs = document.querySelectorAll(`[data-task-id^="${currentDutyId}_"]`);
                                const lastTaskInput = taskInputs[taskInputs.length - 1];
                                if (lastTaskInput) {
                                    // Handle both Schema A (string) and Schema B (object with voting metrics)
                                    let taskText = '';
                                    if (typeof taskData === 'string') {
                                        // Schema A: pre-vote format (string)
                                        taskText = taskData;
                                    } else if (typeof taskData === 'object' && taskData !== null) {
                                        // Schema B: post-vote format (object with metrics)
                                        taskText = taskData.task || taskData.text || taskData.title || '';
                                        
                                        // Preserve voting metrics if present
                                        if (taskData.meanImportance !== undefined) {
                                            const taskId = lastTaskInput.getAttribute('data-task-id');
                                            if (!window.importedVotingResults) {
                                                window.importedVotingResults = {};
                                            }
                                            window.importedVotingResults[taskId] = {
                                                meanImportance: taskData.meanImportance,
                                                meanFrequency: taskData.meanFrequency,
                                                meanDifficulty: taskData.meanDifficulty,
                                                priorityIndex: taskData.priorityIndex,
                                                rank: taskData.rank
                                            };
                                        }
                                    }
                                    lastTaskInput.value = taskText;
                                }
                            });
                        }
                    });
                }

                // Load additional info
                if (data.additionalInfo) {
                    // Load custom headings
                    if (data.additionalInfo.headings) {
                        document.getElementById('knowledgeHeading').textContent = data.additionalInfo.headings.knowledge || 'Knowledge Requirements';
                        document.getElementById('skillsHeading').textContent = data.additionalInfo.headings.skills || 'Skills Requirements';
                        document.getElementById('behaviorsHeading').textContent = data.additionalInfo.headings.behaviors || 'Worker Behaviors/Traits';
                        document.getElementById('toolsHeading').textContent = data.additionalInfo.headings.tools || 'Tools, Equipment, Supplies and Materials';
                        document.getElementById('trendsHeading').textContent = data.additionalInfo.headings.trends || 'Future Trends and Concerns';
                        document.getElementById('acronymsHeading').textContent = data.additionalInfo.headings.acronyms || 'Acronyms';
                        document.getElementById('careerPathHeading').textContent = data.additionalInfo.headings.careerPath || 'Career Path';
                    }

                    // Load text areas
                    document.getElementById('knowledgeInput').value = data.additionalInfo.knowledge || '';
                    document.getElementById('skillsInput').value = data.additionalInfo.skills || '';
                    document.getElementById('behaviorsInput').value = data.additionalInfo.behaviors || '';
                    document.getElementById('toolsInput').value = data.additionalInfo.tools || '';
                    document.getElementById('trendsInput').value = data.additionalInfo.trends || '';
                    document.getElementById('acronymsInput').value = data.additionalInfo.acronyms || '';
                    document.getElementById('careerPathInput').value = data.additionalInfo.careerPath || '';
                }

                // Clear and load custom sections
                document.getElementById('customSectionsContainer').innerHTML = '';
                state.customSectionCounter = 0;
                
                if (data.customSections && Array.isArray(data.customSections)) {
                    data.customSections.forEach(section => {
                        addCustomSection();
                        const lastSection = document.getElementById('customSectionsContainer').lastElementChild;
                        if (lastSection) {
                            const headingElement = lastSection.querySelector('h3');
                            const textareaElement = lastSection.querySelector('textarea');
                            if (headingElement) headingElement.textContent = section.heading;
                            if (textareaElement) textareaElement.value = section.content;
                        }
                    });
                }

                // Load verification data (with backward compatibility for v3.1)
                if (data.verification) {
                    state.collectionMode = data.verification.collectionMode || 'workshop';
                    // Backward compatible: if state.workflowMode not present, default to 'standard'
                    state.workflowMode = data.verification.workflowMode || 'standard';
                    state.verificationRatings = data.verification.ratings || {};
                    state.taskMetadata = data.verification.taskMetadata || {};
                    
                    // Update UI to reflect loaded collection mode
                    if (state.collectionMode === 'workshop') {
                        document.getElementById('mode-workshop').checked = true;
                    } else if (state.collectionMode === 'survey') {
                        document.getElementById('mode-survey').checked = true;
                    }
                    
                    // Update UI to reflect loaded workflow mode
                    if (state.workflowMode === 'standard') {
                        document.getElementById('workflow-standard').checked = true;
                        document.getElementById('workflow-extended').checked = false;
                    } else if (state.workflowMode === 'extended') {
                        document.getElementById('workflow-standard').checked = false;
                        document.getElementById('workflow-extended').checked = true;
                    }
                    
                    // Apply workflow mode class to container
                    const verificationContainer = document.getElementById('verificationAccordionContainer');
                    if (verificationContainer) {
                        if (state.workflowMode === 'extended') {
                            verificationContainer.classList.add('workflow-extended');
                        } else {
                            verificationContainer.classList.remove('workflow-extended');
                        }
                    }
                    
                    console.log('Loaded verification data:', {
                        collectionMode: state.collectionMode,
                        workflowMode: state.workflowMode,
                        ratingsCount: Object.keys(state.verificationRatings).length
                    });
                    
                    // Load workshop-specific data (backward compatible)
                    if (data.verification.workshopParticipants) {
                        state.workshopParticipants = data.verification.workshopParticipants;
                        document.getElementById('workshopParticipants').value = state.workshopParticipants;
                    }
                    
                    if (data.verification.priorityFormula) {
                        state.priorityFormula = data.verification.priorityFormula;
                        if (state.priorityFormula === 'if') {
                            document.getElementById('formula-if').checked = true;
                        } else {
                            document.getElementById('formula-ifd').checked = true;
                        }
                    }
                    
                    if (data.verification.trainingLoadMethod) {
                        state.trainingLoadMethod = data.verification.trainingLoadMethod;
                        const radioAdvanced = document.querySelector('input[name="trainingLoadMethod"][value="advanced"]');
                        const radioSimple = document.querySelector('input[name="trainingLoadMethod"][value="simple"]');
                        if (state.trainingLoadMethod === 'advanced' && radioAdvanced) {
                            radioAdvanced.checked = true;
                        } else if (state.trainingLoadMethod === 'simple' && radioSimple) {
                            radioSimple.checked = true;
                        }
                        // Update label
                        const label = document.getElementById('trainingLoadMethodLabel');
                        if (label) {
                            label.innerHTML = `Current Method: <strong style="color: #667eea;">${state.trainingLoadMethod === 'advanced' ? 'Advanced' : 'Simple'}</strong>`;
                        }
                    }
                    
                    if (data.verification.workshopCounts) {
                        state.workshopCounts = data.verification.workshopCounts;
                    }
                    
                    if (data.verification.workshopResults) {
                        state.workshopResults = data.verification.workshopResults;
                    }
                    
                    // Backward compatibility: If state.taskMetadata is empty, rebuild it from DOM
                    if (Object.keys(state.taskMetadata).length === 0 && Object.keys(state.verificationRatings).length > 0) {
                        Object.keys(state.verificationRatings).forEach(taskKey => {
                            const taskParts = taskKey.split('_task_');
                            const dutyId = taskParts[0];
                            const dutyInput = document.querySelector(`[data-duty-id="${dutyId}"]`);
                            const taskInput = document.querySelector(`[data-task-id="${taskKey}"]`);
                            
                            if (dutyInput && taskInput) {
                                state.taskMetadata[taskKey] = {
                                    dutyId: dutyId,
                                    dutyTitle: dutyInput.value.trim(),
                                    taskTitle: taskInput.value.trim()
                                };
                            }
                        });
                    }
                    
                    // Show/hide workshop-specific UI elements based on loaded mode
                    const workshopSection = document.getElementById('workshopParticipantsSection');
                    const dashboardSection = document.getElementById('resultsDashboard');
                    const priorityFormulaSection = document.getElementById('priorityFormulaSection');
                    
                    if (state.collectionMode === 'workshop') {
                        if (workshopSection) workshopSection.style.display = 'block';
                        if (dashboardSection) dashboardSection.style.display = 'block';
                        if (priorityFormulaSection && state.workflowMode === 'standard') {
                            priorityFormulaSection.style.display = 'block';
                        }
                        // Refresh dashboard after loading
                        setTimeout(() => refreshDashboard(), 500);
                    }
                    
                    console.log('Workshop data loaded:', {
                        participants: state.workshopParticipants,
                        formula: state.priorityFormula,
                        countsKeys: Object.keys(state.workshopCounts).length,
                        resultsKeys: Object.keys(state.workshopResults).length
                    });
                }
                
                // Load competency clusters
                if (data.competencyClusters && typeof state.clusteringData !== 'undefined') {
                    state.clusteringData.clusters = data.competencyClusters.clusters || [];
                    state.clusteringData.availableTasks = data.competencyClusters.availableTasks || [];
                    state.clusteringData.clusterCounter = data.competencyClusters.clusterCounter || 0;
                } else if (typeof state.clusteringData !== 'undefined') {
                    state.clusteringData.clusters = [];
                    state.clusteringData.availableTasks = [];
                    state.clusteringData.clusterCounter = 0;
                }
                
                // Load learning outcomes
                if (data.learningOutcomes && typeof state.learningOutcomesData !== 'undefined') {
                    state.learningOutcomesData.outcomes = data.learningOutcomes.outcomes || [];
                    state.learningOutcomesData.outcomeCounter = data.learningOutcomes.outcomeCounter || 0;
                } else if (typeof state.learningOutcomesData !== 'undefined') {
                    state.learningOutcomesData.outcomes = [];
                    state.learningOutcomesData.outcomeCounter = 0;
                }
                // Re-render LO UI
                if (typeof renderLearningOutcomes === 'function') {
                    renderLearningOutcomes();
                }
                if (typeof renderPCSourceList === 'function') {
                    renderPCSourceList();
                }
                
                // Load module mapping
                if (data.moduleMapping && typeof state.moduleMappingData !== 'undefined') {
                    state.moduleMappingData.modules = data.moduleMapping.modules || [];
                    state.moduleMappingData.moduleCounter = data.moduleMapping.moduleCounter || 0;
                } else if (typeof state.moduleMappingData !== 'undefined') {
                    state.moduleMappingData.modules = [];
                    state.moduleMappingData.moduleCounter = 0;
                }
                // Re-render Module UI
                if (typeof renderModules === 'function') {
                    renderModules();
                }
                if (typeof renderModuleLoList === 'function') {
                    renderModuleLoList();
                }

                // Load Skills Level Matrix
                if (data.skillsLevelMatrix && typeof state.skillsLevelDataAdditional !== 'undefined') {
                    state.skillsLevelDataAdditional = data.skillsLevelMatrix;
                    renderSkillsLevel();
                }
                
                // Reset decision safety
                state.verificationDecisionMade = false;
                state.clusteringAllowed = false;
                document.getElementById('btnLWFinalize').disabled = false;
                document.getElementById('btnBypassToClustering').disabled = false;
                document.getElementById('btnResetDecision').style.display = 'none';

                // Switch to Chart Info tab
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.querySelector('[data-tab="info-tab"]').classList.add('active');
                document.getElementById('info-tab').classList.add('active');

                showStatus('Data loaded successfully! ✓', 'success');
                
                // Reset file input
                event.target.value = '';
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                showStatus('Error: Invalid JSON file', 'error');
            }
        };
        reader.readAsText(file);
    } catch (error) {
        console.error('Error loading file:', error);
        showStatus('Error loading file: ' + error.message, 'error');
    }
}


export {
    getUsageData, checkUsageLimit, incrementUsage, updateUsageBadge,
    saveToJSON, loadFromJSON
};
