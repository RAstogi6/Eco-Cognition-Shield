// Background script for Eco-Cognition Shield

const TARGET_DOMAINS = [
    'youtube.com',
    'tiktok.com',
    'instagram.com',
    'facebook.com',
    'netflix.com'
];

let activeTabId = null;
let activeDomain = null;
let startTime = null;

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        dailyStats: {},
        totalCO2: 0,
        forestHealth: 100
    });
});

// Track tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    await updateTime();
    activeTabId = activeInfo.tabId;
    const tab = await chrome.tabs.get(activeTabId);
    checkDomain(tab.url);
});

// Track URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === activeTabId && changeInfo.url) {
        updateTime().then(() => {
            checkDomain(changeInfo.url);
        });
    }
});

function checkDomain(url) {
    if (!url) return;
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        const isTarget = TARGET_DOMAINS.some(d => domain.includes(d));

        if (isTarget) {
            activeDomain = domain;
            startTime = Date.now();
            console.log(`Tracking started for: ${activeDomain}`);
        } else {
            activeDomain = null;
            startTime = null;
        }
    } catch (e) {
        console.error(e);
    }
}

async function updateTime() {
    if (activeDomain && startTime) {
        const duration = (Date.now() - startTime) / 1000; // seconds
        const data = await chrome.storage.local.get(['dailyStats', 'totalCO2']);
        const stats = data.dailyStats || {};

        // Update stats
        stats[activeDomain] = (stats[activeDomain] || 0) + duration;

        // Calculate CO2 (approx 1g per minute of video streaming)
        // This is a simplified model.
        const co2Increase = (duration / 60) * 1.5;
        const newTotalCO2 = (data.totalCO2 || 0) + co2Increase;

        await chrome.storage.local.set({
            dailyStats: stats,
            totalCO2: newTotalCO2
        });

        // Reset start time to avoid double counting
        startTime = Date.now();

        console.log(`Updated stats for ${activeDomain}: +${duration}s`);
    }
}

// Periodic update every 5 seconds to keep UI fresh
setInterval(updateTime, 5000);
