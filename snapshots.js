// snapshots.js
// Save and restore named snapshots of the current project state.

/** @type {Map<string, { id: string, name: string, timestamp: number, state: object }>} */
const snapshotStore = new Map();

/**
 * Generate a simple unique ID.
 * @returns {string}
 */
function generateId() {
    return `snap_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Deep-clone a state object safely.
 * @param {object} state
 * @returns {object}
 */
function cloneState(state) {
    try {
        return JSON.parse(JSON.stringify(state));
    } catch {
        return { ...state };
    }
}

/**
 * Create a named snapshot of the provided state.
 * @param {string} name - Human-readable label for the snapshot.
 * @param {object} state - The current application state to snapshot.
 * @returns {{ id: string, name: string, timestamp: number, state: object }} The created snapshot.
 */
function createSnapshot(name, state) {
    const id = generateId();
    const snapshot = {
        id,
        name: String(name).trim() || `Snapshot ${snapshotStore.size + 1}`,
        timestamp: Date.now(),
        state: cloneState(state),
    };
    snapshotStore.set(id, snapshot);
    return snapshot;
}

/**
 * Restore a previously saved snapshot by ID.
 * Returns a deep copy of the stored state so callers cannot mutate the archive.
 * @param {string} snapshotId
 * @returns {object|null} A copy of the saved state, or null if not found.
 */
function restoreSnapshot(snapshotId) {
    const snapshot = snapshotStore.get(snapshotId);
    if (!snapshot) return null;
    return cloneState(snapshot.state);
}

/**
 * Delete a snapshot by ID.
 * @param {string} snapshotId
 * @returns {boolean} True if the snapshot existed and was removed, false otherwise.
 */
function deleteSnapshot(snapshotId) {
    return snapshotStore.delete(snapshotId);
}

/**
 * Return all snapshots as an array, sorted by timestamp (newest first).
 * State copies are omitted from the listing to keep it lightweight.
 * @returns {Array<{ id: string, name: string, timestamp: number }>}
 */
function getSnapshots() {
    return Array.from(snapshotStore.values())
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(({ id, name, timestamp }) => ({ id, name, timestamp }));
}

export { createSnapshot, restoreSnapshot, deleteSnapshot, getSnapshots };
