# Web App Reader

A browser extension that allows you to view and access your saved web apps. Simply click the extension icon to see and open your saved web apps.

![Extension Preview](extension-preview.png)

## Features

- 📱 View and access saved web apps
- 🎨 Beautiful, modern user interface
- 🔒 Secure storage using browser's sync storage
- ⚡ Quick access from browser toolbar

## Installation

### Chrome/Edge/Brave

1. Download or clone this repository to your local machine
2. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
3. Enable "Developer mode" (toggle in the top right corner)
4. Click "Load unpacked"
5. Select the directory containing this extension
6. The Web App Reader icon should now appear in your browser toolbar

### Firefox

1. Download or clone this repository to your local machine
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the extension directory and select the `manifest.json` file
5. The extension will be loaded temporarily (note: temporary extensions are removed when Firefox is closed)

For permanent installation in Firefox, the extension needs to be signed by Mozilla.

## Usage

1. **Viewing Saved Apps:**
   - Click the Web App Reader icon in your browser toolbar
   - Your saved apps will appear in the list
   - Click on any saved app URL to open it in a new tab
   - If no apps are saved, you'll see a "No web app loaded" message

## File Structure

```
Web-App-reader/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js            # Extension popup logic
├── popup.css           # Extension popup styling
├── options.html        # Options page (not currently used)
├── options.js          # Options page logic (not currently used)
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Technical Details

- **Manifest Version:** 3 (latest Chrome extension standard)
- **Permissions:** 
  - `storage` - To save your web app URLs
  - `tabs` - To open web apps in new tabs
- **Storage:** Uses Chrome's sync storage (limited to 10 most recent apps)
- **Compatibility:** Works with Chrome, Edge, Brave, and other Chromium-based browsers

## Privacy

This extension:
- Only stores web app URLs you explicitly add
- Does not collect any personal data
- Does not track your browsing activity
- Stores data locally using your browser's sync storage
- Does not send any data to external servers

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
