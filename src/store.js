import { readable, writable } from "svelte/store";

const DEV = true;

export const isDev = readable(DEV);
export const isCapturing = writable(DEV ? true : false);
export const startCapturing = ()=>{isCapturing.set(true)}
export const stopCapturing = ()=>{isCapturing.set(false)}
export const isHidden = writable(false);
export const hide = ()=>{isHidden.set(true)}
export const show = ()=>{isHidden.set(false)}

export const groups = writable([
    {name: "Front", x1: 0, y1: 0, x2: 0, y2: 0, prefix: "", suffix: ""},
    {name: "Back", x1: 0, y1: 0, x2: 0, y2: 0, prefix: "", suffix: ""}
]);

export const tags = writable("some, tags");

export const csv = writable("");
export const csvExists = writable(false);
export const setCsv = ()=>{
    csv.set("Placeholder")
    // if (fileexists) csvExists.set(true);
}