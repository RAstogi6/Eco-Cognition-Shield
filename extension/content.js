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
    return overlay;
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
        chrome.storage.local.get(['totalCO2', 'dailyStats'], (result) => {
            if (!isDashboard && changes.totalCO2) {
                updateOverlay(changes.totalCO2.newValue);
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
