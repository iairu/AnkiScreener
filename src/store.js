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

export const screenshotElm = writable({});
export const setScreenshotElm = (elm)=>{screenshotElm.set(elm)};
export const getScreenshotElm = ()=>{
    let elm = "";
    screenshotElm.subscribe(e => {elm = e})(); // unsub right after
    return elm;
};

export const notifications = writable([]);
export const notify = (text, isImgSrc=false, ms=2000)=>{ // settings for default ms
    notifications.update(n => {
        const ntf = {
            text: text,
            isImgSrc: isImgSrc,
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

export const isQAmode = writable(false);
export const turnQAon = ()=>{isQAmode.set(true)}
export const turnQAoff = ()=>{isQAmode.set(false)}
export const getQAmode = ()=>{
    let mode;
    isQAmode.subscribe(qa => mode = qa)(); // () to unsub right afterwards
    return mode;
}

export const QAaffixes = writable({
    question: {
        prefix: "",
        suffix: ""
    },
    answer: {
        prefix: "",
        suffix: ""
    }
});
export const setQAaffixes = (setter)=>{
    QAaffixes.update((qa)=>{
        if (setter.question.prefix) qa.question.prefix = setter.question.prefix;
        if (setter.question.suffix) qa.question.suffix = setter.question.suffix;
        if (setter.answer.prefix) qa.answer.prefix = setter.answer.prefix;
        if (setter.answer.suffix) qa.answer.suffix = setter.answer.suffix;
        return qa;
    })
}
export const getQAaffixes = ()=>{
    let affixes;
    QAaffixes.subscribe(qa => affixes = qa)(); // () to unsub right afterwards
    return affixes;
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
export const assignSelections = (skipAssignments=false)=>{
    let _groups;
    let _shots;
    groups.subscribe(c => _groups = c)(); // () to unsub right afterwards
    shots.subscribe(c => _shots = c)(); // ^^^

    if (!skipAssignments) {
        _groups.forEach((group) => {
        _shots.forEach((shot) => {
            if (shot.x1 >= group.x1 && shot.x2 <= group.x2 && 
                shot.y1 >= group.y1 && shot.y2 <= group.y2) {
                group.children.push(shot);
                shot.parent = group;
            }
        })
        }) // todo: there may be a problem with groups not being in order
    }

    return {groups: _groups, shots: _shots};
}
export const modifySelection = (isGroup,i,mergeObj)=>{
    const option = (isGroup) ? groups : shots;
    option.update(w=>{
        if (mergeObj.name !== undefined) w[i].name = mergeObj.name;
        if (mergeObj.prefix !== undefined) w[i].prefix = mergeObj.prefix;
        if (mergeObj.suffix !== undefined) w[i].suffix = mergeObj.suffix;
        if (mergeObj.b64jpg !== undefined) w[i].b64jpg = mergeObj.b64jpg;
        return w;
    })
}
