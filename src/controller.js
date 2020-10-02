const { remote } = require("electron");
const screenshot = require("screenshot-desktop");
import { guaranteeNewLine, readTextFile } from "./fsman";
import { assignSelections, screenshotDone, screenshotStart, startCapturing, stopCapturing, getCsvPath, setCsvPath, getTags, notify } from "./store";



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
    // remote.globalShortcut.register("Tab", startCapturing);
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
    remote.dialog.showSaveDialog({
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
    return (prefix ? prefix + "<br>" : "") + "<img src=\"" + imgPath + "\">" + (suffix ? "<br>" + suffix : "");
}

export async function exportSelections() {
    const columnDelimiter = ";"; // settings
    const rowDelimiter = "\r\n"; // settings

    const { groups, shots } = assignSelections();
    
    if (!shots.length) {
        notify("You don't have any selections.\nDrag left mouse button to make some.");
        return;
    } else if (!groups.length) {
        notify("You don't have any groups.\nDrag right mouse button around selections to make some.");
        return;
    }

    let csvPath = getCsvPath();
    if (csvPath === "") {
        notify("No save path provided.");
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
            if (groups[column].children.length - 1 >= row) {
                append += createCardEntry(groups[column].prefix, groups[column].children[row].b64jpg, groups[column].suffix);
                // prefix, suffix come from group entry
                // b64jpg comes from shot entry
            }

            // end column if more follow else end row
            if (column < groups.length - 1) 
                append += columnDelimiter;
            else
                append += rowDelimiter;
        }
    }

    // add tags to each row except last empty line
    let tags = getTags();
    if (tags !== "") {
        let arr = append.split(rowDelimiter).map(row => row + columnDelimiter + tags)
        arr.pop();
        arr.push("");
        append = arr.join(rowDelimiter);
    } 

    csv = csv + append;
    notify(csv);

    stopCapturing();
}