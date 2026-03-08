// ============================================================
// design-system.js — UI Component Helpers
// ============================================================
// Provides factory functions used by renderer.js and a
// showStatus() utility used by events.js.
// No framework dependencies — plain DOM only.
// ============================================================

/**
 * Show a temporary status message in #status.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
export function showStatus(message, type = 'success') {
    let el = document.getElementById('status');
    if (!el) {
        el = document.createElement('div');
        el.id = 'status';
        el.className = 'status';
        document.body.appendChild(el);
    }
    el.textContent = message;
    el.className = 'status status-' + type;
    el.style.display = 'block';
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => { el.style.display = 'none'; }, 3000);
}

/**
 * Create a styled button element.
 * @param {{ type: string, label: string, onClick: Function }} opts
 */
export function createButton({ type = '', label = '', onClick } = {}) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = type ? 'btn-' + type : 'btn';
    btn.textContent = label;
    if (onClick) btn.addEventListener('click', onClick);
    return btn;
}

/**
 * Create a duty/task header label element.
 * @param {{ type: string, index: number }} opts
 */
export function createHeader({ type = 'duty', index = 1 } = {}) {
    const el = document.createElement('div');
    el.className = 'cv-' + type + '-index';
    el.textContent = (type === 'duty' ? 'Duty ' : 'Task ') + index;
    return el;
}

/**
 * Create a circular delete button.
 * @param {{ type: string, title: string, onClick: Function }} opts
 */
export function createDeleteCircle({ type = '', title = 'Remove', onClick } = {}) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cv-delete-' + type;
    btn.title = title;
    btn.innerHTML = '✕';
    if (onClick) btn.addEventListener('click', onClick);
    return btn;
}

/**
 * Create a contenteditable div for inline editing.
 * @param {{ className, text, placeholder, onFocus, onInput, onBlur }} opts
 */
export function createEditable({ className = '', text = '', placeholder = '', onFocus, onInput, onBlur } = {}) {
    const el = document.createElement('div');
    el.className = className;
    el.contentEditable = 'true';
    el.textContent = text;
    el.setAttribute('data-placeholder', placeholder);
    if (!text) el.classList.add('empty');
    if (onFocus) el.addEventListener('focus', onFocus);
    if (onInput) el.addEventListener('input', () => {
        el.classList.toggle('empty', !el.textContent.trim());
        onInput();
    });
    if (onBlur) el.addEventListener('blur', onBlur);
    return el;
}

/**
 * Create a card element (used in card view).
 * @param {{ type, topLeft, topRight, content }} opts
 */
export function createCard({ type = 'task', topLeft, topRight, content } = {}) {
    const card = document.createElement('div');
    card.className = 'cv-' + type + '-card';

    const top = document.createElement('div');
    top.className = 'cv-' + type + '-card-top';
    if (topLeft)  top.appendChild(topLeft);
    if (topRight) top.appendChild(topRight);
    card.appendChild(top);
    if (content) card.appendChild(content);
    return card;
}
