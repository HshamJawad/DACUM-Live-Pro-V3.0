// state.js
// Central application state. All modules import this object and mutate its properties.
// Do NOT use bare global variables — use state.xxx everywhere.

export const state = {
    // Image uploads
    producedForImage: null,
    producedByImage: null,

    // Custom sections counter
    customSectionCounter: 0,

    // Skills Level Matrix Data
    skillsLevelDataAdditional: [
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

// Toggle Skills Level section,

    // Duty / task counters (used by addDuty / addTask)
    dutyCount: 0,
    taskCounts: {},

    // Task Verification state
    verificationRatings: {},
    taskMetadata: {},
    collectionMode: 'workshop',
    workflowMode: 'standard',
    verificationDecisionMade: false,
    clusteringAllowed: false,

    // Workshop aggregated counts
    workshopParticipants: 10,
    priorityFormula: 'if',
    tvExportMode: 'appendix',
    trainingLoadMethod: 'advanced',
    workshopCounts: {},
    workshopResults: {},

    // Live Workshop state
    lwSessionId: null,
    lwIsFinalized: false,
    lwFinalizedData: null,
    lwAggregatedResults: null,
    LW_API_BASE: 'https://live-session-backend-production.up.railway.app/api',
    lwQRInstance: null,

    // Competency Clustering
    clusteringData: {
        availableTasks: [],
        clusters: [],
        clusterCounter: 0
    },

    // Learning Outcomes
    learningOutcomesData: {
        outcomes: [],
        outcomeCounter: 0
    },

    // Module Mapping
    moduleMappingData: {
        modules: [],
        moduleCounter: 0
    }
};
