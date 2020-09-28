import { readable, writable } from "svelte/store";

const DEV = true;

export const isDev = readable(DEV);
export const isCapturing = writable(false);
export const startCapturing = ()=>{isCapturing.set(true)}
export const stopCapturing = ()=>{
    isCapturing.set(false);
    resetSelections();
}

export const hasMenuHidden = writable(false);
export const hideMenu = ()=>{hasMenuHidden.set(true)}
export const showMenu = ()=>{hasMenuHidden.set(false)}

export const isScreenshotting = writable(false);
export const screenshotStart = ()=>{isScreenshotting.set(true);}
export const screenshotDone = ()=>{isScreenshotting.set(false);}

export const groups = writable([]);
export const shots = writable([]);

export const createSelection = (isGroup, x1, x2, y1, y2)=>{
    const option = (isGroup) ? groups : shots;
    // option.update(w=>[...w,[x1, x2, y1, y2, "", "", ""]])
    option.update(w=>[...w,{
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y1,
        name: "",
        prefix: "",
        suffix: "",
        children: [],
        parent: undefined
    }])
}
export const updateLastSelection = (isGroup, x2, y2)=>{
    const option = (isGroup) ? groups : shots;
    option.update(w=>{
        const l = w.length-1;
        w[l].x2 = x2;
        w[l].y2 = y2;
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
export const resetSelections = ()=>{
    groups.set([]);
    shots.set([]);
}
export const assignSelections = ()=>{
    let _groups;
    let _shots;
    groups.subscribe(c => _groups = c)(); // () to unsub right afterwards
    shots.subscribe(c => _shots = c)(); // ^^^

    _groups.forEach((group) => {
    _shots.forEach((shot) => {
        if (shot.x1 >= group.x1 && shot.x2 <= group.x2 && shot.y1 >= group.y1 && shot.y2 <= group.y2) {
            group.children.push(shot);
            shot.parent = group;
        }
    })
    })

    return [_groups,_shots];
}
export const modifySelection = (isGroup,i,mergeObj)=>{
    const option = (isGroup) ? groups : shots;
    option.update(w=>{
        if (mergeObj.name) w[i].name = mergeObj.name;
        if (mergeObj.prefix) w[i].prefix = mergeObj.prefix;
        if (mergeObj.suffix) w[i].suffix = mergeObj.suffix;
        return w;
    })
}

export const tags = writable("some, tags");

export const csv = writable("");
export const csvExists = writable(false);
export const setCsv = ()=>{
    csv.set("Placeholder")
    // if (fileexists) csvExists.set(true);
}