// projects.js
// Manage multiple named projects, persisted in localStorage.

const STORAGE_KEY = 'dacum_lp_projects';

/**
 * Generate a simple unique ID.
 * @returns {string}
 */
function generateId() {
    return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Deep-clone an object safely via JSON round-trip.
 * @param {object} obj
 * @returns {object}
 */
function cloneObject(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch {
        return { ...obj };
    }
}

/**
 * Load the projects index from localStorage.
 * Returns an empty object on any parse error.
 * @returns {Object.<string, { id: string, name: string, createdAt: number, state: object }>}
 */
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        return JSON.parse(raw) || {};
    } catch {
        return {};
    }
}

/**
 * Persist the projects index to localStorage.
 * Silently swallows quota / serialisation errors.
 * @param {object} projects
 */
function saveToStorage(projects) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
        // Storage unavailable or quota exceeded — fail silently.
    }
}

/**
 * Create a new project with an initial state.
 * @param {string} name - Human-readable project name.
 * @param {object} initialState - The application state to store with this project.
 * @returns {{ id: string, name: string, createdAt: number, state: object }} The new project record.
 */
function createProject(name, initialState) {
    const projects = loadFromStorage();
    const id = generateId();
    const project = {
        id,
        name: String(name).trim() || `Project ${Object.keys(projects).length + 1}`,
        createdAt: Date.now(),
        state: cloneObject(initialState),
    };
    projects[id] = project;
    saveToStorage(projects);
    return cloneObject(project);
}

/**
 * Load a project by ID.
 * @param {string} projectId
 * @returns {{ id: string, name: string, createdAt: number, state: object }|null}
 *   A deep copy of the project record, or null if not found.
 */
function loadProject(projectId) {
    const projects = loadFromStorage();
    const project = projects[projectId];
    if (!project) return null;
    return cloneObject(project);
}

/**
 * Overwrite the saved state of an existing project.
 * @param {string} projectId
 * @param {object} state - The current application state to persist.
 * @returns {boolean} True if the project was found and updated, false otherwise.
 */
function saveProject(projectId, state) {
    const projects = loadFromStorage();
    if (!projects[projectId]) return false;
    projects[projectId].state = cloneObject(state);
    saveToStorage(projects);
    return true;
}

/**
 * Delete a project by ID.
 * @param {string} projectId
 * @returns {boolean} True if the project existed and was deleted, false otherwise.
 */
function deleteProject(projectId) {
    const projects = loadFromStorage();
    if (!projects[projectId]) return false;
    delete projects[projectId];
    saveToStorage(projects);
    return true;
}

/**
 * Return all projects as an array, sorted by creation date (newest first).
 * State payloads are omitted to keep the listing lightweight.
 * @returns {Array<{ id: string, name: string, createdAt: number }>}
 */
function getProjects() {
    const projects = loadFromStorage();
    return Object.values(projects)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(({ id, name, createdAt }) => ({ id, name, createdAt }));
}

export { createProject, loadProject, saveProject, deleteProject, getProjects };
