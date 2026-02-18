# Web App Reader

A browser extension that allows you to contain and access web apps via URL, similar to Spark's URL-based web apps. Save your favorite web apps and open them quickly from the extension popup.

## Features

- 📱 Open web apps by entering their URL
- 💾 Save frequently used web apps for quick access
- 🎨 Beautiful, modern user interface
- 🔒 Secure storage using browser's sync storage
- 🗑️ Easy management of saved apps (delete individual or clear all)
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

1. **Opening a Web App:**
   - Click the Web App Reader icon in your browser toolbar
   - Enter the URL of the web app you want to open (e.g., `https://app.example.com`)
   - Click "Open App" or press Enter
   - The app will open in a new tab and be saved to your list

2. **Accessing Saved Apps:**
   - Click the Web App Reader icon
   - Your saved apps will appear in the "Saved Apps" section
   - Click on any saved app URL to open it in a new tab

3. **Managing Saved Apps:**
   - To delete a specific app, click the "Delete" button next to it
   - To clear all saved apps, click "Clear All Saved Apps" at the bottom

## File Structure

```
Web-App-reader/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js            # Extension popup logic
├── popup.css           # Extension popup styling
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
