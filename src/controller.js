const { remote } = require("electron");
const notifier = require("node-notifier");

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

export function notify(_title="Title", _message="A message") {
    notifier.notify({
        title: _title,
        message: _message
    })
}

export function NYI() {
    notify("Not Yet Implemented", "Oh well... :|");
}