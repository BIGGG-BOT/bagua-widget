const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 150,
    height: 150,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    hasShadow: false,
    thickFrame: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: require('path').join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  // Forward renderer console to main process stdout (for debugging)
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('[renderer]', message);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC: move window by (dx, dy)
ipcMain.on('move-window', (event, dx, dy) => {
  if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    mainWindow.setPosition(x + dx, y + dy);
  }
});

// IPC: resize window to fit scaled widget
ipcMain.on('resize-window', (event, w, h) => {
  if (mainWindow) {
    mainWindow.setSize(Math.round(w), Math.round(h));
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
