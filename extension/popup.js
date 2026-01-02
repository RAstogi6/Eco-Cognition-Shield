document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    initDropdown();

    // Update every second while popup is open
    setInterval(updateStats, 1000);
});

function initDropdown() {
    const toggle = document.getElementById('settings-toggle');
    const dropdown = document.getElementById('settings-dropdown');

    const positionSelect = document.getElementById('quick-position');
    const opacityRange = document.getElementById('quick-opacity');
    const opacityVal = document.getElementById('quick-opacity-val');
    const quickToggle = document.getElementById('quick-toggle');

    const btnSave = document.getElementById('settings-save');
    const btnCancel = document.getElementById('settings-cancel');

    let savedSettings = {};

    // Helper to revert settings
    function revertSettings() {
        if (savedSettings.position) chrome.storage.local.set({ position: savedSettings.position });
        if (savedSettings.opacity !== undefined) chrome.storage.local.set({ opacity: savedSettings.opacity });
        if (savedSettings.overlayEnabled !== undefined) chrome.storage.local.set({ overlayEnabled: savedSettings.overlayEnabled });
    }

    // Helper to close dropdown
    function closeDropdown(shouldRevert = true) {
        if (shouldRevert) {
            revertSettings();
        }
        dropdown.classList.remove('show');
    }

    // Toggle Open
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();

        if (dropdown.classList.contains('show')) {
            closeDropdown(true); // Close = Revert by default
        } else {
            // Opening: Capture current state
            chrome.storage.local.get(['position', 'opacity', 'overlayEnabled'], (data) => {
                savedSettings = data; // Save snapshot

                // Populate UI
                quickToggle.checked = data.overlayEnabled !== false; // Default true
                if (data.position) positionSelect.value = data.position;
                if (data.opacity !== undefined) {
                    opacityRange.value = data.opacity;
                    opacityVal.textContent = `${Math.round(data.opacity * 100)}%`;
                }

                dropdown.classList.add('show');
            });
        }
    });

    // Close on click outside (Revert)
    document.addEventListener('click', (e) => {
        if (dropdown.classList.contains('show') && !dropdown.contains(e.target) && e.target !== toggle) {
            closeDropdown(true);
        }
    });

    // Save (Commit)
    btnSave.addEventListener('click', () => {
        // Current storage is ALREADY updated by the 'live preview' inputs, so we just close without reverting.
        closeDropdown(false);
    });

    // Cancel (Revert)
    btnCancel.addEventListener('click', () => {
        closeDropdown(true);
    });

    // Input Changes (Live Preview)
    positionSelect.addEventListener('change', (e) => {
        chrome.storage.local.set({ position: e.target.value });
    });

    opacityRange.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        opacityVal.textContent = `${Math.round(val * 100)}%`;
        chrome.storage.local.set({ opacity: val });
    });

    quickToggle.addEventListener('change', (e) => {
        chrome.storage.local.set({ overlayEnabled: e.target.checked });
    });
}

function updateStats() {
    chrome.storage.local.get(['dailyStats', 'totalCO2'], (data) => {
        const totalCO2 = data.totalCO2 || 0;
        document.getElementById('total-co2').textContent = `${totalCO2.toFixed(1)}g`;

        const list = document.getElementById('sites-list');
        list.innerHTML = '';

        const stats = data.dailyStats || {};
        Object.entries(stats).forEach(([domain, seconds]) => {
            const div = document.createElement('div');
            div.className = 'site-item';

            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);

            div.innerHTML = `
        <span>${domain}</span>
        <span>${mins}m ${secs}s</span>
      `;
            list.appendChild(div);
        });

        if (Object.keys(stats).length === 0) {
            list.innerHTML = '<div style="text-align:center; color:#999; padding:8px;">No activity yet</div>';
        }
    });
}
