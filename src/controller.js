const { remote } = require("electron");
import { readTextFile } from "./fsman";
import { assignSelections, startCapturing, stopCapturing } from "./store";

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

export async function setSavePathDialog() {
    return remote.dialog.showSaveDialog(remote.getCurrentWindow(),{}).then(result=>{return result.filePath;});
}

export async function completeCapture() {
    console.log(assignSelections());
    // helloWorld();
    console.log(readTextFile(await setSavePathDialog()));
    stopCapturing();
}

export function unregisterGlobalKeybinds() {
    remote.globalShortcut.unregisterAll();
}