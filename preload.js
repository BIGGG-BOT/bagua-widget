const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  moveWindow: (dx, dy) => ipcRenderer.send('move-window', dx, dy),
  resizeWindow: (w, h) => ipcRenderer.send('resize-window', w, h),
});
