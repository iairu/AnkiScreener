const { remote } = require("electron");
const Screenshot = require("screenshot-desktop");
const Clipper = require("image-clipper");
import { guaranteeNewLine, readTextFile, writeImgBase64File, writeTextFile } from "./fsman";
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

function cropSaveScreenshot(imgElm, shot, filePathBase, fileNameBase, pathDelimiter) {
    let fileName = fileNameBase + "_" + Date.now() + "_" + Math.floor(Math.random()*10000) + ".png";
    let filePath = filePathBase + pathDelimiter + fileName;
    
    // element to b64 png
    let dataURL = Clipper(imgElm)
    .quality(80)
    .crop(shot.x1, shot.y1, shot.x2 - shot.x1, shot.y2 - shot.y1)
    .toDataURL((dataURL)=>{
        notify(dataURL,true);
        return dataURL;
    });

    // b64 png to file
    writeImgBase64File(filePath,dataURL);

    return fileName;
}



// EXPORT (setSavePath, createCardEntry, exportSelections)

export function pathArray(path) {
    let tree = path.split("\\");
    if (tree.length === 1) { // splitting didn't work because non-windows routes
        tree = path.split("/");
    }
    return tree;
}

export function shortPathFileName(path) {
    let tree = pathArray(path);
    return tree[tree.length - 1].split(".anki.csv")[0];
}

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

function createCSV(groups,screenshotElm,csvPathNoName,csvNameNoExt,pathDelimiter,columnDelimiter,rowDelimiter) {
    // figure out how many rows there should be
    let maxShots = 0;
    groups.forEach(group => {
        maxShots = (group.children.length > maxShots) ? group.children.length : maxShots; 
    })
    
    // each shot defines a row, each group defines a column
    let csv = "";
    for(let row = 0; row < maxShots; row++) {
        for(let column = 0; column < groups.length; column++) {
            // add the shot into the column number g for row number i if it exists
            if (groups[column].children.length - 1 >= row) {
                csv += createCardEntry(
                    groups[column].prefix, 
                    cropSaveScreenshot(
                        screenshotElm,
                        groups[column].children[row],
                        csvPathNoName,
                        csvNameNoExt,
                        pathDelimiter
                    ), 
                    groups[column].suffix
                );
                // prefix, suffix come from group entry, shot transform info is read from groups[column].children[row]
            }

            // end column if more follow else end row
            if (column < groups.length - 1) 
                csv += columnDelimiter;
            else
                csv += rowDelimiter;
        }
    }

    return csv;
}

function createCSVQA(questions,answers,affixes,screenshotElm,csvPathNoName,csvNameNoExt,pathDelimiter,columnDelimiter,rowDelimiter) {
    // each question defines a row & column, each answer defines a second column
    let csv = "";
    for(let row = 0; row < questions.length; row++) {
        // add question column
        csv += createCardEntry(
            affixes.question.prefix, 
            cropSaveScreenshot(
                screenshotElm,
                questions[row],
                csvPathNoName,
                csvNameNoExt,
                pathDelimiter
            ), 
            affixes.question.suffix
        );

        if (answers.length > row) {
            // end prev. column 
            csv += columnDelimiter;
            // add answer column
            csv += createCardEntry(
                affixes.answer.prefix, 
                cropSaveScreenshot(
                    screenshotElm,
                    answers[row],
                    csvPathNoName,
                    csvNameNoExt,
                    pathDelimiter
                ), 
                affixes.answer.suffix
            );
        }

        // end row
        csv += rowDelimiter;
    }

    return csv;
}

export async function exportSelections() {
    const columnDelimiter = ";"; // settings
    const rowDelimiter = "\r\n"; // settings
    const pathDelimiter = "/"; // settings

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

    // get different parts of the save path for later processing
    let csvNameNoExt = shortPathFileName(csvPath);
    let csvPathNoName = pathArray(csvPath);
    csvPathNoName.pop();
    csvPathNoName = csvPathNoName.join(pathDelimiter);
    
    // obtain and prepare existing/empty CSV data from saved file
    let existingCSV = guaranteeNewLine(readTextFile(csvPath),rowDelimiter.split(""));

    // get the screenshot element for further processing
    let screenshotElm = getScreenshotElm();
    if (screenshotElm === undefined) {
        notify("Screenshot got stuck in the pipe. Maybe try again?");
        return;
    }

    // todo: generate CSV depending on whether QA (questions&answers) mode is active
    let appendCSV = createCSV(groups, screenshotElm, csvPathNoName, csvNameNoExt, pathDelimiter, columnDelimiter, rowDelimiter);
    // let appendCSV = createCSVQA(shots, groups, getQAaffixes(), screenshotElm, csvPathNoName, csvNameNoExt, pathDelimiter, columnDelimiter, rowDelimiter);

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