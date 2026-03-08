// ============================================================
// storage.js — localStorage Persistence
// ============================================================
import { AppState } from './state.js';

const STORAGE_KEY = 'dacumLiveProState';

/** Save current AppState.duties + counters to localStorage. */
export function saveToLocalStorage() {
    try {
        const payload = {
            duties:     AppState.duties,
            dutyCount:  AppState.dutyCount,
            taskCounts: AppState.taskCounts
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn('saveToLocalStorage failed:', e);
    }
}

/** Restore AppState.duties + counters from localStorage. */
export function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const payload = JSON.parse(raw);
        if (Array.isArray(payload.duties)) {
            AppState.duties     = payload.duties;
            AppState.dutyCount  = payload.dutyCount  || 0;
            AppState.taskCounts = payload.taskCounts || {};
            return true;
        }
    } catch (e) {
        console.warn('loadFromLocalStorage failed:', e);
    }
    return false;
}
