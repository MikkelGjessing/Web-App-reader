// Storage key for saved apps
const STORAGE_KEY = 'savedApps';

// DOM Elements
const optionsBtn = document.getElementById('optionsBtn');
const appsList = document.getElementById('appsList');

// Load saved apps on popup open
document.addEventListener('DOMContentLoaded', () => {
    loadSavedApps();
});

// Options button click handler
optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
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

// Function to open an app in a new tab
function openApp(url) {
    chrome.tabs.create({ url: url });
}
