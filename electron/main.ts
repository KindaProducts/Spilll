import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { enable } from '@electron/remote/main';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  enable(mainWindow.webContents);

  // Load the index.html from a url if in development
  // or the local file if in production.
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open the DevTools in development.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle preset generation
ipcMain.handle('generate-preset', async (event, imageData) => {
  try {
    // TODO: Implement AI model integration
    // This is where we'll call the Python AI model
    return {
      success: true,
      preset: {
        name: 'Generated Preset',
        settings: {
          exposure: 0.5,
          contrast: 0.3,
          // Add more preset settings
        },
      },
    };
  } catch (error) {
    console.error('Preset generation error:', error);
    return {
      success: false,
      error: 'Failed to generate preset',
    };
  }
});

// Handle preset export
ipcMain.handle('export-preset', async (event, preset) => {
  try {
    // TODO: Implement preset XML export
    // Convert preset to Lightroom XML format
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <x:xmpmeta xmlns:x="adobe:ns:meta/">
      <!-- Add preset XML structure -->
    </x:xmpmeta>`;
    
    return {
      success: true,
      xml,
    };
  } catch (error) {
    console.error('Preset export error:', error);
    return {
      success: false,
      error: 'Failed to export preset',
    };
  }
}); 