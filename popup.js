// Storage key for saved apps
const STORAGE_KEY = 'savedApps';

// DOM Elements
const urlInput = document.getElementById('urlInput');
const openBtn = document.getElementById('openBtn');
const clearBtn = document.getElementById('clearBtn');
const appsList = document.getElementById('appsList');

// Load saved apps on popup open
document.addEventListener('DOMContentLoaded', () => {
    loadSavedApps();
});

// Open app button click handler
openBtn.addEventListener('click', () => {
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
    
    // Open the app in a new tab
    openApp(url);
    
    // Clear input
    urlInput.value = '';
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
        openBtn.click();
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

// Function to open an app in a new tab
function openApp(url) {
    chrome.tabs.create({ url: url });
}
