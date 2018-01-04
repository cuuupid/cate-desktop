const electron = require('electron')
const { app, BrowserWindow, Tray } = require('electron')
const shortcut = require('electron-localshortcut');
const {username, password, year} = require('./config')
var hideTab = false
let tray = null
var open = false

var launch = () => {
    open = true
    let win = new BrowserWindow({
        width: 600, height: 760, icon: __dirname + '/icon.ico',        
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
    let url = `https://${username}:${password}@cate.doc.ic.ac.uk/personal.cgi?keyp=${year}:${username}`
    win.loadURL(url)
    app.on('login', function(e, wc, rq, auth, cb) {
        e.preventDefault();
        cb(username, password);
    })
    win.webContents.on('dom-ready', (e, d) => {
        win.webContents.insertCSS(`
        body { -webkit-app-region: drag; }
        iframe, font[color="blue"] { display: none; }
        input, button, img, a, select { -webkit-app-region: no-drag; }
        body > form > table > tbody > tr { display: none; }
        body > form > table > tbody > tr:nth-child(2) { display: unset; }
        body > form > table > tbody > tr:nth-child(2) > td { 
            display: block;
        }
        `)
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