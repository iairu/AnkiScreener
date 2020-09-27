const { remote } = require("electron");

export function restartApp() {
    remote.app.relaunch();
    remote.app.exit();
}

export function exitApp() {
    remote.app.quit();
}

export function devTools() {
    remote.getCurrentWindow().webContents.openDevTools();
}