// Content script for web app overlay
let overlayContainer = null;
let isOverlayVisible = false;
let currentAppUrl = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openAppInOverlay') {
        openAppInOverlay(request.url);
        sendResponse({ success: true });
    } else if (request.action === 'closeOverlay') {
        closeOverlay();
        sendResponse({ success: true });
    }
    return true;
});

// Function to create and show overlay
function openAppInOverlay(url) {
    currentAppUrl = url;
    
    // If overlay already exists, just update the URL
    if (overlayContainer) {
        const iframe = overlayContainer.querySelector('.stepper-overlay-iframe');
        if (iframe) {
            iframe.src = url;
        }
        showOverlay();
        return;
    }
    
    // Create overlay container
    overlayContainer = document.createElement('div');
    overlayContainer.id = 'stepper-overlay-container';
    overlayContainer.className = 'stepper-overlay-container';
    
    // Create overlay header
    const header = document.createElement('div');
    header.className = 'stepper-overlay-header';
    
    const title = document.createElement('div');
    title.className = 'stepper-overlay-title';
    title.textContent = 'Web App';
    
    const controls = document.createElement('div');
    controls.className = 'stepper-overlay-controls';
    
    // Minimize button
    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'stepper-overlay-btn stepper-overlay-minimize';
    minimizeBtn.textContent = '−';
    minimizeBtn.title = 'Minimize';
    minimizeBtn.addEventListener('click', minimizeOverlay);
    
    // Maximize/Restore button
    const maximizeBtn = document.createElement('button');
    maximizeBtn.className = 'stepper-overlay-btn stepper-overlay-maximize';
    maximizeBtn.textContent = '□';
    maximizeBtn.title = 'Maximize';
    maximizeBtn.addEventListener('click', toggleMaximize);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'stepper-overlay-btn stepper-overlay-close';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close';
    closeBtn.addEventListener('click', closeOverlay);
    
    controls.appendChild(minimizeBtn);
    controls.appendChild(maximizeBtn);
    controls.appendChild(closeBtn);
    
    header.appendChild(title);
    header.appendChild(controls);
    
    // Create iframe for web app
    const iframe = document.createElement('iframe');
    iframe.className = 'stepper-overlay-iframe';
    iframe.src = url;
    iframe.allow = 'autoplay';
    iframe.sandbox = 'allow-scripts allow-forms allow-popups allow-modals allow-downloads allow-top-navigation-by-user-activation';
    
    // Assemble overlay
    overlayContainer.appendChild(header);
    overlayContainer.appendChild(iframe);
    
    // Add to page
    document.body.appendChild(overlayContainer);
    
    // Make draggable
    makeDraggable(overlayContainer, header);
    
    // Make resizable
    makeResizable(overlayContainer);
    
    showOverlay();
}

// Function to show overlay
function showOverlay() {
    if (overlayContainer) {
        overlayContainer.classList.remove('stepper-overlay-hidden');
        overlayContainer.classList.remove('stepper-overlay-minimized');
        isOverlayVisible = true;
    }
}

// Function to hide overlay
function closeOverlay() {
    if (overlayContainer) {
        overlayContainer.classList.add('stepper-overlay-hidden');
        isOverlayVisible = false;
    }
}

// Function to minimize overlay
function minimizeOverlay() {
    if (overlayContainer) {
        overlayContainer.classList.add('stepper-overlay-minimized');
    }
}

// Function to toggle maximize
function toggleMaximize() {
    if (overlayContainer) {
        overlayContainer.classList.toggle('stepper-overlay-maximized');
    }
}

// Function to make overlay draggable
function makeDraggable(overlay, handle) {
    let isDragging = false;
    let offsetX;
    let offsetY;
    
    handle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        // Don't drag if clicking on buttons
        if (e.target.classList.contains('stepper-overlay-btn')) {
            return;
        }
        
        // Don't drag if maximized
        if (overlay.classList.contains('stepper-overlay-maximized')) {
            return;
        }
        
        // Remove centering transform and get current position
        const rect = overlay.getBoundingClientRect();
        overlay.style.transform = 'none';
        overlay.style.left = rect.left + 'px';
        overlay.style.top = rect.top + 'px';
        
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        isDragging = true;
        handle.style.cursor = 'grabbing';
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            
            // Keep within viewport bounds
            const maxX = window.innerWidth - overlay.offsetWidth;
            const maxY = window.innerHeight - overlay.offsetHeight;
            
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            overlay.style.left = newX + 'px';
            overlay.style.top = newY + 'px';
        }
    }
    
    function dragEnd() {
        isDragging = false;
        handle.style.cursor = 'grab';
    }
}

// Function to make overlay resizable
function makeResizable(overlay) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'stepper-overlay-resize-handle';
    overlay.appendChild(resizeHandle);
    
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        if (overlay.classList.contains('stepper-overlay-maximized')) {
            return;
        }
        
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = overlay.offsetWidth;
        startHeight = overlay.offsetHeight;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const width = startWidth + (e.clientX - startX);
        const height = startHeight + (e.clientY - startY);
        
        // Set minimum and maximum sizes
        const minWidth = 400;
        const minHeight = 300;
        const maxWidth = window.innerWidth - overlay.offsetLeft;
        const maxHeight = window.innerHeight - overlay.offsetTop;
        
        overlay.style.width = Math.max(minWidth, Math.min(width, maxWidth)) + 'px';
        overlay.style.height = Math.max(minHeight, Math.min(height, maxHeight)) + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}
