const { remote } = require("electron");

export function exitApp() {
    remote.app.quit();
}