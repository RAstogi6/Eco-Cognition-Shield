// Content script for Eco-Cognition Shield

// Create and inject the overlay
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'eco-cognition-overlay';
    overlay.innerHTML = `
    <div class="eco-meter">
      <div class="eco-icon">🌱</div>
      <div class="eco-text">
        <span class="eco-label">Carbon Footprint</span>
        <span class="eco-value">0g</span>
      </div>
    </div>
  `;
    document.body.appendChild(overlay);

    // Load initial settings
    chrome.storage.local.get(['overlayEnabled', 'position', 'opacity'], (settings) => {
        applyOverlaySettings(settings);
    });

    return overlay;
}

function applyOverlaySettings(settings) {
    const overlay = document.getElementById('eco-cognition-overlay');
    if (!overlay) return;

    // Defaults
    const enabled = settings.overlayEnabled !== false; // Default true
    const pos = settings.position || 'bottom-right';
    const opacity = settings.opacity !== undefined ? settings.opacity : 0.9;

    // Visibility
    overlay.style.display = enabled ? 'block' : 'none';

    // Position
    overlay.classList.remove(
        'eco-pos-top-left', 'eco-pos-top-right',
        'eco-pos-bottom-left', 'eco-pos-bottom-right'
    );
    overlay.classList.add(`eco-pos-${pos}`);

    // Opacity
    overlay.style.opacity = opacity;
}

// Update the overlay with current stats
function updateOverlay(co2) {
    const overlay = document.getElementById('eco-cognition-overlay');
    if (!overlay) return;

    const valueEl = overlay.querySelector('.eco-value');
    valueEl.textContent = `${co2.toFixed(1)}g`;

    // Visual feedback based on CO2
    if (co2 > 50) {
        overlay.classList.add('warning');
    }
    if (co2 > 100) {
        overlay.classList.add('critical');
        showIntervention();
    }
}

function showIntervention() {
    if (document.getElementById('eco-intervention-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'eco-intervention-modal';
    modal.innerHTML = `
    <div class="eco-modal-content">
      <h2>⚠️ Digital Forest Alert</h2>
      <p>Your carbon footprint from this session is high. Your digital forest is wilting.</p>
      <button id="eco-close-btn">I'll take a break</button>
      <button id="eco-ignore-btn">Ignore (Forest suffers)</button>
    </div>
  `;
    document.body.appendChild(modal);

    document.getElementById('eco-close-btn').addEventListener('click', () => {
        modal.remove();
        // In a real app, this might redirect to the dashboard or close the tab
    });

    document.getElementById('eco-ignore-btn').addEventListener('click', () => {
        modal.remove();
    });
}

// Initial setup
const isDashboard = window.location.hostname === 'localhost';

if (!isDashboard) {
    createOverlay();
}

// Function to broadcast data to the web app
function broadcastData(data) {
    if (isDashboard) {
        window.postMessage({
            type: 'ECO_UPDATE',
            payload: data
        }, '*');
    }
}

// Listen for storage changes to update UI and broadcast
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        // Read full fresh state to ensure consistency
        chrome.storage.local.get(['totalCO2', 'dailyStats', 'overlayEnabled', 'position', 'opacity'], (result) => {
            if (!isDashboard && changes.totalCO2) {
                updateOverlay(changes.totalCO2.newValue);
            }

            // Check for settings changes
            if (changes.overlayEnabled || changes.position || changes.opacity) {
                applyOverlaySettings(result);
            }

            broadcastData(result);
        });
    }
});

// Initial load
chrome.storage.local.get(['totalCO2', 'dailyStats'], (result) => {
    if (result.totalCO2 && !isDashboard) {
        updateOverlay(result.totalCO2);
    }
    broadcastData(result);
});

// --- TRACKING LOGIC ---

let pendingDuration = 0;
let currentQuality = '480p'; // Default
const REPORT_INTERVAL = 5000; // Report every 5 seconds
const CHECK_INTERVAL = 1000;  // Check every 1 second

function isVideoPlaying() {
    const videos = document.querySelectorAll('video');
    for (const video of videos) {
        if (!video.paused && !video.ended && video.readyState > 2) {
            return video; // Return the playing video element
        }
    }
    return null;
}

function getVideoQuality(video) {
    if (!video) return '480p';
    const h = video.videoHeight;

    if (h <= 360) return '360p';
    if (h <= 480) return '480p';
    if (h <= 720) return '720p';
    if (h <= 1080) return '1080p';
    if (h <= 1440) return '1440p';
    return '2160p';
}

let lastVideoTime = 0;

function isVideoActivelyPlaying(video, lastTime) {
    return (
        video &&
        !video.paused &&
        !video.ended &&
        video.readyState >= 2 &&
        video.playbackRate > 0 &&
        video.currentTime > lastTime
    );
}

function trackUsage() {
    // Check for active playback regardless of tab visibility
    const video = isVideoPlaying();
    if (video) {
        if (isVideoActivelyPlaying(video, lastVideoTime)) {
            pendingDuration += (CHECK_INTERVAL / 1000);
            // Update quality based on the active video
            currentQuality = getVideoQuality(video);
        }
        // Always update lastTime to current - ensures we catch progress on next tick
        lastVideoTime = video.currentTime;
    }
}

function reportUsage() {
    if (pendingDuration <= 0 || !currentQuality) return;

    try {
        if (
            typeof chrome === "undefined" ||
            !chrome.runtime ||
            !chrome.runtime.sendMessage
        ) {
            return;
        }

        const domain = window.location.hostname.replace('www.', '');

        chrome.runtime.sendMessage({
            type: "UPDATE_CARBON",
            payload: {
                domain: domain,
                duration: pendingDuration,
                quality: currentQuality
            }
        });

        // Reset ONLY after successful send
        pendingDuration = 0;

    } catch (e) {
        // MV3: Extension context invalidated
        // Ignore and retry next tick
        return;
    }
}


// Start tracking loops if not on dashboard
if (!isDashboard) {
    setInterval(trackUsage, CHECK_INTERVAL);
    setInterval(reportUsage, REPORT_INTERVAL);

    // Also report on visibility change or unload to capture trailing data
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            reportUsage();
        }
    });

    window.addEventListener('beforeunload', reportUsage);
}
