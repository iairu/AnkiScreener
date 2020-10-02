const { remote } = require("electron");
const screenshot = require("screenshot-desktop");
import { guaranteeNewLine, readTextFile } from "./fsman";
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

// SCREENSHOT (captureScreenshot, clipScreenshot)

export async function captureScreenshot() {
    // base64 image/jpeg
    screenshotStart();
    return await screenshot().then(imgBuffer => {
        screenshotDone();
        return imgBuffer.toString("base64");
    });
}

// todo: clipScreenshot() foreach shots -> image-clipper npm package -> shots[i].b64jpg = imgBuffer.toString("base64");

// EXPORT (saveDialog, exportSelections, captureScreenshot)

export async function setSavePath() {
    let win = remote.getCurrentWindow();
    remote.dialog.showSaveDialog(win,{
        filters: [{
            name: "Anki CSV",
            extensions: ["anki.csv"]
        }]
    })
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
    const columnDelimiter = ";";
    const rowDelimiter = "\r\n";

    const { groups, shots } = assignSelections();
    
    if (!shots.length) {
        _alert("You don't have any selections.\nDrag left mouse button to make some.");
        return;
    } else if (!groups.length) {
        _alert("You don't have any groups.\nDrag right mouse button around selections to make some.");
        return;
    }

    let csvPath = getCsvPath();
    if (csvPath === "") {
        _alert("No save path provided.");
        return;
    }

    let csv = guaranteeNewLine(readTextFile(csvPath),rowDelimiter.split(""));
    
    // figure out how many rows there should be
    let maxShots = 0;
    groups.forEach(group => {
        maxShots = (group.children.length > maxShots) ? group.children.length : maxShots; 
    })

    // each shot defines a row, each group defines a column
    let append = "";
    for(let row = 0; row < maxShots; row++) {
        for(let column = 0; column < groups.length; column++) {
            // add the shot into the column number g for row number i if it exists
            if (groups[column].children.length - 1 >= row)
                append += groups[column].children[row].x1; // todo: <img> syntax (children[row].b64jpg)

            // end column if more follow else end row
            if (column < groups.length - 1) 
                append += columnDelimiter;
            else
                append += rowDelimiter;
        }
    }

    // todo: add a tag column: append.split(rowDelimiter).forEach(row => row + ";" + tags)

    csv = csv + append;
    _alert(csv);

    stopCapturing();
}