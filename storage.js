// ============================================================
// src/system/storage.js
// Image upload, AI usage limiting, loading modal
// ============================================================

import { appState } from '../core/state.js';
import { showStatus } from '../ui/renderer.js';

// ── Constants ─────────────────────────────────────────────────
export const DAILY_LIMIT  = 10;
export const STORAGE_KEY  = 'dacum_ai_usage';

// ── Usage Limiting ────────────────────────────────────────────

export function getUsageData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { count: 0, date: new Date().toDateString() };
  return JSON.parse(stored);
}

export function checkUsageLimit() {
  const usage = getUsageData();
  const today = new Date().toDateString();
  if (usage.date !== today) {
    const newUsage = { count: 0, date: today };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
    return { allowed: true, remaining: DAILY_LIMIT };
  }
  const remaining = DAILY_LIMIT - usage.count;
  return { allowed: remaining > 0, remaining, count: usage.count };
}

export function incrementUsage() {
  const usage = getUsageData();
  const today = new Date().toDateString();
  if (usage.date !== today) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 1, date: today }));
  } else {
    usage.count++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  }
  updateUsageBadge();
}

export function updateUsageBadge() {
  const status = checkUsageLimit();
  const badge = document.getElementById('usageBadge');
  const btn   = document.getElementById('aiGenerateBtn');
  if (!badge || !btn) return;

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

// ── Loading Modal ─────────────────────────────────────────────

export function showLoadingModal() {
  const modal = document.getElementById('loadingModal');
  if (modal) modal.style.display = 'block';
}

export function hideLoadingModal() {
  const modal = document.getElementById('loadingModal');
  if (modal) modal.style.display = 'none';
}

// ── Image Upload ──────────────────────────────────────────────

export function handleImageUpload(event, imageType) {
  const file = event.target.files[0];
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
  if (!validTypes.includes(file.type)) {
    showStatus('Please upload a valid image file (JPG, JPEG, PNG, or BMP)', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;

    if (imageType === 'producedFor') appState.producedForImage = imageData;
    else if (imageType === 'producedBy') appState.producedByImage = imageData;

    const previewDiv = document.getElementById(`${imageType}ImagePreview`);
    previewDiv.innerHTML = `<img src="${imageData}" alt="${imageType} logo">`;
    previewDiv.classList.add('has-image');

    const cap = imageType.charAt(0).toUpperCase() + imageType.slice(1);
    document.getElementById(`remove${cap}Image`).style.display = 'inline-block';
    showStatus('Image uploaded successfully! ✓', 'success');
  };
  reader.readAsDataURL(file);
}

export function removeImage(imageType) {
  if (!confirm('Are you sure you want to remove this logo?')) return;

  if (imageType === 'producedFor') appState.producedForImage = null;
  else if (imageType === 'producedBy') appState.producedByImage = null;

  const previewDiv = document.getElementById(`${imageType}ImagePreview`);
  previewDiv.innerHTML = '<span style="color:#999;font-size:0.9em;">No image</span>';
  previewDiv.classList.remove('has-image');

  const cap = imageType.charAt(0).toUpperCase() + imageType.slice(1);
  document.getElementById(`remove${cap}Image`).style.display = 'none';
  document.getElementById(`${imageType}ImageInput`).value = '';
  showStatus('Image removed! ✓', 'success');
}
