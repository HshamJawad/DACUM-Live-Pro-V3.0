// api.js
// External API calls: Railway backend for DACUM AI generation and Live Workshop sessions.
import { state } from './state.js';
import { showStatus, showLoadingModal, hideLoadingModal, addDuty, addTask,
         lwApplyVotingResultsToDataModel, lwDisplayResults } from './renderer.js';
import { checkUsageLimit, incrementUsage } from './storage.js';

async function generateAIDacum() {
    console.log('🚀 AI Generation Started');
    
    // Check usage limit FIRST
    const usageStatus = checkUsageLimit();
    if (!usageStatus.allowed) {
        showStatus(`❌ Daily limit reached (${DAILY_LIMIT} generations). Try again tomorrow!`, 'error');
        return;
    }
    
    const occupationTitle = document.getElementById('occupationTitle').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const sector = document.getElementById('sector').value.trim();
    const context = document.getElementById('context').value.trim();

    console.log('Input values:', { occupationTitle, jobTitle, sector, context });

    if (!occupationTitle || !jobTitle) {
        console.log('❌ Validation failed - missing required fields');
        showStatus('Please enter both Occupation Title and Job Title before generating AI draft', 'error');
        return;
    }

    console.log('✅ Validation passed');

    // Check if there are existing duties with actual content
    const existingDuties = document.querySelectorAll('[data-duty-id]');
    let hasContent = false;
    
    existingDuties.forEach(dutyInput => {
        if (dutyInput.value.trim()) {
            hasContent = true;
        }
    });

    if (hasContent) {
        console.log(`Found ${existingDuties.length} existing duties with content`);
        if (!confirm('⚠️ AI GENERATION WILL REPLACE ALL EXISTING DUTIES AND TASKS\n\nClick OK to continue, or Cancel to keep your current work.')) {
            console.log('User cancelled - keeping existing duties');
            showStatus('AI generation cancelled. Your existing duties are preserved.', 'error');
            return;
        }
        console.log('✅ User confirmed - proceeding with AI generation');
    } else {
        console.log('No existing content found - proceeding without confirmation');
    }

    console.log('🎯 Starting AI API call...');
    showLoadingModal(); // Show loading popup
    
    // Small delay to ensure modal renders before async work begins
    await new Promise(resolve => setTimeout(resolve, 100));

const prompt = `You are an occupational analysis engine. Your task is to generate a DATA-INFORMED DACUM DRAFT that will be injected directly into a DACUM chart user interface.

INPUT:
Occupation Title: ${occupationTitle}
Job / Role: ${jobTitle}${sector ? `\nSector: ${sector}` : ''}${context ? `\nCountry / Context: ${context}` : ''}

TASK:
Generate a DACUM draft for the SPECIFIED JOB / ROLE (not the entire occupation).

STRUCTURE GUIDELINES (NOT FIXED LIMITS):
- Identify a reasonable number of DUTIES, usually between 6 and 12,
  sufficient to fully cover the JOB being analyzed.
- For each DUTY, generate a variable number of TASKS, usually between 6 and 20,
  based on the actual work required for that duty.
- Different duties may have different numbers of tasks.
- The total number of tasks for the JOB is usually between 75 and 125,
  but completeness and logical job coverage take priority over numeric targets.

PRIORITY RULE:
- Stop generating duties or tasks once the JOB scope is fully and logically covered,
  even if the upper guideline limits have not been reached.

RULES FOR DUTIES:
- Duties represent broad areas of responsibility within the JOB.
- Duties must be written as responsibility titles.
- Use verb-based responsibility phrasing
  (e.g., "Apply Safety, Health, Environment and Quality in the Workplace").
- Avoid overlap or duplication between duties.

RULES FOR TASKS:
- Each task must start with ONE clear occupational action verb.
- Use operational, observable verbs only
  (e.g., Install, Inspect, Maintain, Test, Repair, Calibrate, Diagnose, Configure).
- Follow the structure: Verb + Object + (Qualifier if needed).
- Use ONE verb only per task (no combined or compound verbs).
- Tasks must describe what the worker DOES, not outcomes, purposes, or intentions.
- Tasks must describe real, observable work activities.
- Do NOT include outcomes, results, or phrases such as "to ensure", "in order to".
- Do NOT use learning, academic, or cognitive verbs
  (e.g., understand, learn, know).
- Do NOT include competencies, skills, knowledge, tools, equipment, software,
  materials, or safety rules.
- Tasks must be specific, concrete, and actionable.
- Avoid organizational, administrative, or policy-oriented verbs
  (e.g., comply, adhere, manage, coordinate, supervise, report).
- Focus on hands-on job-specific work activities performed directly by the worker.

METHODOLOGICAL NOTE:
- Use labor-market and contextual signals for realism (data-informed),
  but prioritize expert occupational logic and job coherence
  over generic data patterns.

OUTPUT FORMAT (STRICT – NO EXTRA TEXT):
Return ONLY valid JSON using the following structure:

{
  "duties": [
    {
      "title": "Duty title here",
      "tasks": [
"Task 1",
"Task 2",
"Task 3",
"Task 4",
"Task 5"
      ]
    }
  ]
}

Generate the DACUM draft now in valid JSON format only.`;

    try {
        // Call YOUR backend server on Railway (not Anthropic API directly)
        const BACKEND_URL = 'https://dacum-ai-backend-production.up.railway.app';
        
        console.log(`🌐 Calling backend server: ${BACKEND_URL}`);
        
        const response = await fetch(`${BACKEND_URL}/api/generate-dacum`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend Error Response:', errorText);
            throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Backend Response:', data);
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            console.error('Invalid response structure:', data);
            throw new Error('Invalid response from backend - no content found');
        }

        let jsonText = data.content[0].text.trim();
        console.log('Raw AI text:', jsonText);
        
        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        let dacumData;
        try {
            dacumData = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Failed to parse:', jsonText);
            throw new Error('Failed to parse AI response as JSON');
        }

        if (!dacumData.duties || !Array.isArray(dacumData.duties)) {
            console.error('Invalid DACUM structure:', dacumData);
            throw new Error('Invalid DACUM structure - duties array not found');
        }

        if (dacumData.duties.length === 0) {
            throw new Error('No duties generated by AI');
        }

        // Clear existing duties
        document.getElementById('dutiesContainer').innerHTML = '';
        state.dutyCount = 0;
        state.taskCounts = {};

        // Populate with AI-generated data
        dacumData.duties.forEach((dutyData, index) => {
            addDuty();
            const currentDutyId = `duty_${state.dutyCount}`;
            const dutyInput = document.querySelector(`[data-duty-id="${currentDutyId}"]`);
            
            if (dutyInput && dutyData.title) {
                dutyInput.value = dutyData.title;
            }

            if (dutyData.tasks && Array.isArray(dutyData.tasks)) {
                dutyData.tasks.forEach(taskText => {
                    addTask(currentDutyId);
                    const taskInputs = document.querySelectorAll(`[data-task-id^="${currentDutyId}_"]`);
                    const lastTaskInput = taskInputs[taskInputs.length - 1];
                    if (lastTaskInput) {
                        lastTaskInput.value = taskText;
                    }
                });
            }
        });

        // Hide loading modal and increment usage counter
        hideLoadingModal();
        incrementUsage();
        
        // User is already in Duties & Tasks tab - no need to switch
        showStatus(`✓ AI draft generated successfully! ${dacumData.duties.length} duties with tasks created.`, 'success');

    } catch (error) {
        hideLoadingModal(); // Hide modal on error too
        console.error('Error generating AI DACUM:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        showStatus(`Error: ${error.message}. Check browser console for details.`, 'error');
    }
}


async function lwFinalizeAndCreateSession() {
    // Get occupation and job titles from v3.9 with robust fallback
    // Try multiple possible field IDs to ensure compatibility
    const occupationField = document.getElementById('occupationTitleInput') || document.getElementById('occupationTitle');
    const jobTitleField = document.getElementById('jobTitleInput') || document.getElementById('jobTitle');
    
    const occupation = occupationField?.value.trim() || '';
    const jobTitle = jobTitleField?.value.trim() || '';
    
    // Validation - only fail if both sources are empty
    if (!occupation || !jobTitle) {
        showStatus('Please enter Occupation Title and Job Title in the Basic Information tab', 'error');
        return;
    }
    
    // Get all duties and tasks from v3.9 DOM
    const duties = lwExtractDutiesAndTasks();
    
    if (Object.keys(duties).length === 0) {
        showStatus('Please add at least one duty with tasks in the Duties & Tasks tab', 'error');
        return;
    }
    
    // Validate each duty has title and tasks
    let valid = true;
    Object.keys(duties).forEach(dutyId => {
        const duty = duties[dutyId];
        if (!duty.title.trim()) {
            showStatus(`Duty "${dutyId}" needs a title`, 'error');
            valid = false;
        }
        if (duty.tasks.length === 0) {
            showStatus(`Duty "${duty.title}" needs at least one task`, 'error');
            valid = false;
        }
        duty.tasks.forEach(task => {
            if (!task.text.trim()) {
                showStatus(`Please fill in all task descriptions`, 'error');
                valid = false;
            }
        });
    });
    
    if (!valid) return;
    
    // Capture the selected priority formula
    const selectedFormula = document.querySelector('input[name="priorityFormula"]:checked')?.value || 'if';
    
    // Create finalized snapshot
    state.lwFinalizedData = {
        occupation: occupation,
        jobTitle: jobTitle,
        priorityFormula: selectedFormula,
        duties: JSON.parse(JSON.stringify(duties)) // Deep copy
    };
    
    // Lock the finalization
    state.lwIsFinalized = true;
    document.getElementById('btnLWFinalize').disabled = true;
    
    // Generate session ID
    state.lwSessionId = lwGenerateId();
    
    // Send to backend
    try {
        const response = await fetch(`${state.LW_API_BASE}/create-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: state.lwSessionId,
                data: state.lwFinalizedData
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showStatus('✅ Live Workshop session created successfully!', 'success');
            
            // Set decision safety
            state.verificationDecisionMade = true;
            state.clusteringAllowed = true;
            document.getElementById('btnBypassToClustering').disabled = true;
            document.getElementById('btnResetDecision').style.display = 'inline-block';
            
            // Show session info
            document.getElementById('lwStep1-finalize').style.display = 'none';
            document.getElementById('lwStep2-session').style.display = 'block';
            document.getElementById('lwSessionId').textContent = state.lwSessionId;
            
            // Generate participant link to separate participant file
            // Get directory path without filename
            const currentPath = window.location.pathname;
            const directory = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            const participantFileUrl = window.location.origin + directory + 'DACUM_LiveWorkshop_Participant.html';
            const participantUrl = `${participantFileUrl}?lwsession=${state.lwSessionId}`;
            
            // Display shortened version, store full URL
            const shortLink = `DACUM_LiveWorkshop_Participant.html?lwsession=${state.lwSessionId}`;
            const linkElement = document.getElementById('lwParticipantLink');
            linkElement.textContent = shortLink;
            linkElement.setAttribute('data-full-url', participantUrl);
            
        } else {
            throw new Error(result.error || 'Failed to create session');
        }
        
    } catch (error) {
        console.error('Error creating session:', error);
        showStatus(`Error creating session: ${error.message}`, 'error');
        
        // Rollback on error
        state.lwIsFinalized = false;
        state.lwSessionId = null;
        document.getElementById('btnLWFinalize').disabled = false;
    }
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

export { generateAIDacum, lwFinalizeAndCreateSession, lwFetchResults };
