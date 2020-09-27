import { readable, writable } from "svelte/store";

const DEV = true;

export const isDev = readable(DEV);
export const isCapturing = writable(false);
export const startCapturing = ()=>{isCapturing.set(true)}
export const stopCapturing = ()=>{isCapturing.set(false)}
export const isHidden = writable(false);
export const hide = ()=>{isHidden.set(true)}
export const show = ()=>{isHidden.set(false)}

export const groups = writable([]);
export const shots = writable([]);

export const createSelection = (isGroup, x1, x2, y1, y2)=>{
    const option = (isGroup) ? groups : shots;
    option.update(w=>[...w,[x1, x2, y1, y2, "", "", ""]])
}
export const updateLastSelection = (isGroup, x2, y2)=>{
    const option = (isGroup) ? groups : shots;
    option.update(w=>{
        const l = w.length-1;
        w[l][1] = x2;
        w[l][3] = y2;
        return w;
    })
}
export const removeLastSelection = (isGroup)=>{
    const option = (isGroup) ? groups : shots;
    option.update(w=>{
        w.pop();
        return w;
    })
}
export const resetSelections = (isGroup)=>{
    const option = (isGroup) ? groups : shots;
    option.set([]);
}

export const tags = writable("some, tags");

export const csv = writable("");
export const csvExists = writable(false);
export const setCsv = ()=>{
    csv.set("Placeholder")
    // if (fileexists) csvExists.set(true);
}