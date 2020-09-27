const { remote } = require("electron");
import { startCapturing, stopCapturing } from "./store";

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
export function registerGlobalKeybinds() {
    remote.globalShortcut.register("Tab", startCapturing);
    remote.globalShortcut.register("ESC", stopCapturing);
}
export function unregisterGlobalKeybinds() {
    remote.globalShortcut.unregisterAll();
}