const { remote } = require("electron");
const screenshot = require("screenshot-desktop");
import { readTextFile } from "./fsman";
import { assignSelections, screenshotDone, screenshotStart, startCapturing, stopCapturing } from "./store";

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

export async function captureScreenshot() {
    // base64 image/jpeg
    screenshotStart();
    return await screenshot().then(imgBuffer => {
        screenshotDone();
        return imgBuffer.toString("base64");
    });
}

export function unregisterGlobalKeybinds() {
    remote.globalShortcut.unregisterAll();
}