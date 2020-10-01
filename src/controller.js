const { remote } = require("electron");
const screenshot = require("screenshot-desktop");
import { readTextFile } from "./fsman";
import { assignSelections, screenshotDone, screenshotStart, startCapturing, stopCapturing, getCsvPath, setCsvPath } from "./store";



// APP MANAGEMENT (restartApp, exitApp, devTools)

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



// GLOBAL KEYBINDS (register, unregister)

export function registerGlobalKeybinds() {
    remote.globalShortcut.register("Tab", startCapturing);
    remote.globalShortcut.register("ESC", stopCapturing);
}

export function unregisterGlobalKeybinds() {
    remote.globalShortcut.unregisterAll();
}



// EXPORT (saveDialog, exportSelections, captureScreenshot)

export async function setSavePath() {
    let win = remote.getCurrentWindow();
    remote.dialog.showSaveDialog(win,{})
    .then(result=>{return result.filePath;})
    .then(path=>{
        if (path !== "") {
            setCsvPath(path);
        }
        win.focus(); // focus lost on main window workaround
    });
}

function _alert(text) { // focus lost on main window workaround
    let win = remote.getCurrentWindow();
    alert(text);
    win.focus();
}

export async function exportSelections() {
    const { groups } = assignSelections();
    // let csv = readTextFile(await setSavePathDialog());
    let csv = "";
    let maxShots = 0;

    let csvPath = getCsvPath();
    if (csvPath === "") {
        _alert("No save path provided.");
        return;
    }
    
    // figure out how many rows there should be
    groups.forEach(group => {
        maxShots = (group.children.length > maxShots) ? group.children.length : maxShots; 
    })

    const columnDelimiter = ";";
    const rowDelimiter = "\r\n";
    // each shot defines a row, each group defines a column
    for(let row = 0; row < maxShots; row++) {
        for(let column = 0; column < groups.length; column++) {
            // add the shot into the column number g for row number i if it exists
            if (groups[column].children.length - 1 >= row)
                csv += groups[column].children[row].x1;

            // end column if more follow else end row
            if (column < groups.length - 1) 
                csv += columnDelimiter;
            else
                csv += rowDelimiter;
        }
    }

    _alert(csv);

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