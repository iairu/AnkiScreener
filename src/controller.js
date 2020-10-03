const { remote } = require("electron");
const Screenshot = require("screenshot-desktop");
const Clipper = require("image-clipper");
import { guaranteeNewLine, readTextFile, writeTextFile } from "./fsman";
import { assignSelections, screenshotDone, screenshotStart, startCapturing, stopCapturing, getCsvPath, setCsvPath, getTags, notify, getScreenshotElm } from "./store";



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



// SCREENSHOT (captureScreenshot, cropScreenshot)

export async function captureScreenshot() {
    // base64 image/jpeg
    screenshotStart();
    return await Screenshot().then(imgBuffer => {
        screenshotDone();
        return imgBuffer.toString("base64");
    });
}

function cropScreenshot(imgElm, shot) {
    // element to base64 png
    return Clipper(imgElm)
    .crop(shot.x1, shot.y1, shot.x2 - shot.x1, shot.y2 - shot.y1)
    .toDataURL((dataUrl)=>{
        notify(dataUrl,true);
        return dataUrl;
    });
}



// EXPORT (setSavePath, createCardEntry, exportSelections)

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

function createCardEntry(prefix,imgPath,suffix) {
    // settings
    return "\"" + (prefix ? prefix + "<br>" : "") + "<img src=\'" + imgPath + "\'>" + (suffix ? "<br>" + suffix : "") + "\"";
}

export async function exportSelections() {
    const columnDelimiter = ";"; // settings
    const rowDelimiter = "\r\n"; // settings

    const { groups, shots } = assignSelections();
    
    // guarantee the user made groups and selections
    if (!shots.length) {
        notify("You don't have any selections.\nDrag left mouse button to make some.");
        return;
    } else if (!groups.length) {
        notify("You don't have any groups.\nDrag right mouse button around selections to make some.");
        return;
    }

    // guarantee that the user chose a save path
    let csvPath = getCsvPath();
    if (csvPath === "") {
        notify("No save path provided.");
        return;
    }

    // obtain and prepare existing/empty CSV data from saved file
    let existingCSV = guaranteeNewLine(readTextFile(csvPath),rowDelimiter.split(""));
    
    // figure out how many rows there should be
    let maxShots = 0;
    groups.forEach(group => {
        maxShots = (group.children.length > maxShots) ? group.children.length : maxShots; 
    })

    // get the screenshot element for further processing
    let screenshotElm = getScreenshotElm();
    if (screenshotElm === undefined) {
        notify("Screenshot got stuck in the pipe. Maybe try again?");
        return;
    }

    // each shot defines a row, each group defines a column
    let appendCSV = "";
    for(let row = 0; row < maxShots; row++) {
        for(let column = 0; column < groups.length; column++) {
            // add the shot into the column number g for row number i if it exists
            if (groups[column].children.length - 1 >= row) {
                appendCSV += createCardEntry(groups[column].prefix, cropScreenshot(screenshotElm,groups[column].children[row]), groups[column].suffix);
                // prefix, suffix come from group entry, shot transform info is read from groups[column].children[row]
            }

            // end column if more follow else end row
            if (column < groups.length - 1) 
                appendCSV += columnDelimiter;
            else
                appendCSV += rowDelimiter;
        }
    }

    // add tags to each row except last empty line
    let tags = getTags();
    if (tags !== "") {
        let a = appendCSV.split(rowDelimiter).map(row => row + columnDelimiter + "\"" + tags + "\"")
        a.pop();
        a.push("");
        appendCSV = a.join(rowDelimiter);
    } 

    notify((existingCSV.length ? "Appended to" : "Created") + " the CSV table");
    writeTextFile(csvPath,existingCSV + appendCSV);

    stopCapturing();
}