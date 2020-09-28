const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const compression = require('compression');

const note = require('./api/note');

const _port = 80;
const _client_folder = '/client/dist/client';

const api = express();
api.use(compression());


// Serve API
api.get('/api/notes', note.list);
api.get('/api/note/:id', note.view);
api.post('/api/note/:id', note.update);
api.post('/api/note/new', note.new);

// Serve static files
api.get('*.*', express.static(__dirname + _client_folder, { maxAge: '10y' }));

// Serve client
api.all('*', (req, res) => {
  res.status(200).sendFile('/', { root: __dirname + _client_folder });
});

// Start up Express JS
api.listen(_port, () => {
  console.log('Listening on http://localhost:' + _port);
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 800,
  });
  mainWindow.loadURL(`http://localhost:${_port}/`);
  mainWindow.focus();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});