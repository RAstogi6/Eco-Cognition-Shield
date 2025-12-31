document.addEventListener('DOMContentLoaded', () => {
    updateStats();

    // Update every second while popup is open
    setInterval(updateStats, 1000);
});

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
