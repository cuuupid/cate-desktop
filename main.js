const electron = require('electron')
const { app, BrowserWindow, Tray } = require('electron')
const shortcut = require('electron-localshortcut');

var hideTab = false
let tray = null
var open = false

var launch = () => {
    open = true
    let win = new BrowserWindow({
        width: 800, height: 600, icon: __dirname + '/icon.ico',        
        webPreferences: {
            plugins: true,
            nodeIntegration: false
        },
        frame: false,
    })
    let s = electron.screen.getPrimaryDisplay().workAreaSize
    let _s = win.getSize()
    win.on('closed', () => { win = null; open = false })
    shortcut.register(win, 'Ctrl+Backspace',
        () => { if(win.webContents.canGoBack()) win.webContents.goBack() });
    shortcut.register(win, 'Ctrl+Q', () => { open = false; win.close() });
    shortcut.register(win, 'Ctrl+M', () => { win.minimize() })
    shortcut.register(win, 'Ctrl+Shift+F', 
        () => { win.setFullScreen(!win.isFullScreen()); win.center() })
    shortcut.register(win, 'Ctrl+Y', () => { win.center() })
    shortcut.register(win, 'Ctrl+Shift+I', () => { win.webContents.toggleDevTools() })
    win.loadURL('http://cate.doc.ic.ac.uk/')
    win.webContents.on('dom-ready', (e, d) => {
        // win.webContents.insertCSS
    })
}

app.on('ready', () => {
    tray = new Tray(__dirname + '/icon.ico')
    tray.on('click', () => { if (!open) launch() })
    tray.on('right-click', () => { 
        app.quit()
        tray.destroy()
    })
    launch()
})