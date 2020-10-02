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

export const tags = writable("");
export const setTags = (_tags)=>{tags.set(_tags);}
export const getTags = ()=>{
    let _tags = "";
    tags.subscribe(t => {_tags = t})(); // unsub right after
    return _tags;
}

export const csvPath = writable("");
export const setCsvPath = (path)=>{csvPath.set(path);}
export const getCsvPath = ()=>{
    let path = "";
    csvPath.subscribe(p => {path = p})(); // unsub right after
    return path;
}

export const notifications = writable([]);
export const notify = (text, ms=2000)=>{ // settings for default ms
    notifications.update(n => {
        const ntf = {
            text: text,
            ms: ms,
            onFinish: ()=>{removeNotification(ntf)}
        }
        return [...n,ntf];
    })
}
export const removeNotification = (obj)=>{
    // can't easily rely on indexes
    notifications.update(n => n.filter(_n => _n !== obj))
}

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
        parent: undefined,
        b64jpg: ""
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
        if (shot.x1 >= group.x1 && shot.x2 <= group.x2 && 
            shot.y1 >= group.y1 && shot.y2 <= group.y2) {
            group.children.push(shot);
            shot.parent = group;
        }
    })
    }) // todo: there may be a problem with groups not being in order

    return {groups: _groups, shots: _shots};
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
