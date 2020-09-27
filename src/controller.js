const { remote } = require("electron");
import { assignSelections, resetSelections, startCapturing, stopCapturing } from "./store";

export function restartApp() {
    remote.app.relaunch();
    exitApp();
}

export function exitApp() {
    unregisterGlobalKeybinds();
    remote.app.exit();
}

export function devTools() {
    remote.getCurrentWindow().webContents.openDevTools();
}

export function registerGlobalKeybinds() {
    remote.globalShortcut.register("Tab", startCapturing);
    remote.globalShortcut.register("ESC", stopCapturing);
}

export function completeCapture() {
    console.log(assignSelections());
    resetSelections();
}

export function unregisterGlobalKeybinds() {
    remote.globalShortcut.unregisterAll();
}