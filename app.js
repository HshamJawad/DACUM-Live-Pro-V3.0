// app.js
// Application bootstrap. Imports all modules and exposes public functions
// to the global window object so that inline HTML onclick handlers work.
import { state } from './state.js';
import * as renderer from './renderer.js';
import * as storage from './storage.js';
import * as api from './api.js';
// events.js is imported for its DOMContentLoaded side-effects only
import './events.js';

// ─── Expose all functions to window for inline onclick="..." handlers ───────
Object.assign(window, renderer);
Object.assign(window, storage);
Object.assign(window, api);

// Expose state for any legacy inline references
window.state = state;

// ─── Override updateCollectionMode to include Live Workshop section toggle ───
// Must run AFTER Object.assign so window.updateCollectionMode is already set.
const _origUpdateCollectionMode = window.updateCollectionMode;
window.updateCollectionMode = function() {
    if (_origUpdateCollectionMode) {
        _origUpdateCollectionMode();
    }
    window.lwCheckAndShowSection();
};
