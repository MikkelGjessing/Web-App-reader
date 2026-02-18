// Storage key for saved apps
const STORAGE_KEY = 'savedApps';
// Delay for content script injection
const CONTENT_SCRIPT_INJECTION_DELAY = 100;

// DOM Elements
const urlInput = document.getElementById('urlInput');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const appsList = document.getElementById('appsList');

// Load saved apps on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSavedApps();
});

// Save app button click handler
saveBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    
    // Validate URL
    if (!isValidUrl(url)) {
        alert('Please enter a valid URL (must start with http:// or https://)');
        return;
    }
    
    // Save the app
    saveApp(url);
    
    // Clear input
    urlInput.value = '';
    
    // Show success message
    showSuccessMessage('App saved successfully!');
});

// Clear all apps button click handler
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved apps?')) {
        chrome.storage.sync.set({ [STORAGE_KEY]: [] }, () => {
            loadSavedApps();
        });
    }
});

// Enter key handler for URL input
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveBtn.click();
    }
});

// Function to validate URL
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

// Function to save an app
function saveApp(url) {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
        const apps = result[STORAGE_KEY] || [];
        
        // Check if URL already exists
        if (!apps.includes(url)) {
            apps.unshift(url); // Add to beginning
            
            // Keep only last 10 apps
            if (apps.length > 10) {
                apps.pop();
            }
            
            chrome.storage.sync.set({ [STORAGE_KEY]: apps }, () => {
                loadSavedApps();
            });
        } else {
            showSuccessMessage('App already exists in saved apps!');
        }
    });
}

// Function to load and display saved apps
function loadSavedApps() {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
        const apps = result[STORAGE_KEY] || [];
        
        if (apps.length === 0) {
            appsList.innerHTML = '<div class="empty-message">No saved apps yet</div>';
            return;
        }
        
        appsList.innerHTML = '';
        
        apps.forEach((url, index) => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            
            const appUrl = document.createElement('div');
            appUrl.className = 'app-url';
            appUrl.textContent = url;
            appUrl.title = url;
            appUrl.addEventListener('click', () => openApp(url));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteApp(index);
            });
            
            appItem.appendChild(appUrl);
            appItem.appendChild(deleteBtn);
            appsList.appendChild(appItem);
        });
    });
}

// Function to delete an app
function deleteApp(index) {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
        const apps = result[STORAGE_KEY] || [];
        apps.splice(index, 1);
        
        chrome.storage.sync.set({ [STORAGE_KEY]: apps }, () => {
            loadSavedApps();
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
                    // If content script not ready, inject it
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
        }
    });
}

// Function to show success message
function showSuccessMessage(message) {
    // Remove any existing success message
    const existingMsg = document.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = message;
    
    const inputSection = document.querySelector('.input-section');
    inputSection.insertBefore(successMsg, inputSection.firstChild);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}
