// Storage key for saved apps
const STORAGE_KEY = 'savedApps';
// Delay for content script injection
const CONTENT_SCRIPT_INJECTION_DELAY = 100;

// DOM Elements
const appsList = document.getElementById('appsList');

// Load saved apps on popup open
document.addEventListener('DOMContentLoaded', () => {
    loadSavedApps();
});

// Function to load and display saved apps
function loadSavedApps() {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
        const apps = result[STORAGE_KEY] || [];
        
        if (apps.length === 0) {
            appsList.innerHTML = '<div class="no-app-message">No web app loaded</div>';
            return;
        }
        
        appsList.innerHTML = '';
        
        apps.forEach((url) => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            
            const appUrl = document.createElement('div');
            appUrl.className = 'app-url';
            appUrl.textContent = url;
            appUrl.title = url;
            appUrl.addEventListener('click', () => openApp(url));
            
            appItem.appendChild(appUrl);
            appsList.appendChild(appItem);
        });
    });
}

// Function to open an app in overlay
function openApp(url) {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            // Send message to content script to open overlay
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'openAppInOverlay',
                url: url
            }, (response) => {
                if (chrome.runtime.lastError) {
                    // If content script not ready, reload the page first
                    console.log('Content script not ready, injecting...');
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['content.js']
                    }, () => {
                        chrome.scripting.insertCSS({
                            target: { tabId: tabs[0].id },
                            files: ['overlay.css']
                        }, () => {
                            // Try again after injection
                            setTimeout(() => {
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    action: 'openAppInOverlay',
                                    url: url
                                });
                            }, CONTENT_SCRIPT_INJECTION_DELAY);
                        });
                    });
                }
            });
            // Close popup
            window.close();
        }
    });
}
