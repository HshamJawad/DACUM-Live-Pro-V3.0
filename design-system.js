// design-system.js
// Compatibility shim — re-exports utilities from renderer.js so that
// any future import of design-system.js does not break the module graph.
export { showStatus } from './renderer.js';
