// Background script for Eco-Cognition Shield

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        dailyStats: {},
        totalCO2: 0,
        forestHealth: 100
    });
});

// Global-average CO₂ estimates based on data center, network, and device energy intensity.
// Values vary by region. (Grams per Hour)
const VIDEO_CARBON_RATES = {
    '360p': 70,
    '480p': 90,
    '720p': 120,
    '1080p': 160,
    '1440p': 260,
    '2160p': 580
};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'UPDATE_CARBON') {
        const { domain, duration, quality } = request.payload;
        if (domain && duration > 0) {
            updateStats(domain, duration, quality);
        }
    }
});

async function updateStats(domain, duration, quality = '480p') {
    const data = await chrome.storage.local.get(['dailyStats', 'totalCO2']);
    const stats = data.dailyStats || {};

    // Update stats
    stats[domain] = (stats[domain] || 0) + duration;

    // Calculate CO2
    // Use the rate for the specific quality, fallback to 480p if unknown
    const ratePerHour = VIDEO_CARBON_RATES[quality] || VIDEO_CARBON_RATES['480p'];

    // Convert duration (seconds) to hours, then multiply by rate
    const co2Increase = (duration / 3600) * ratePerHour;

    const newTotalCO2 = (data.totalCO2 || 0) + co2Increase;

    await chrome.storage.local.set({
        dailyStats: stats,
        totalCO2: newTotalCO2
    });

    console.log(`Updated stats for ${domain} [${quality}]: +${duration.toFixed(2)}s, +${co2Increase.toFixed(4)}g CO2`);
}
