import { readable, writable } from "svelte/store";

const DEV = true;

export const isDev = readable(DEV);
export const isCapturing = writable(false);
export const startCapturing = ()=>{isCapturing.set(true)}
export const stopCapturing = ()=>{
    isCapturing.set(false);
    resetSelections();
}
export const isHidden = writable(false);
export const hide = ()=>{isHidden.set(true)}
export const show = ()=>{isHidden.set(false)}

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

export const tags = writable("some, tags");

export const csv = writable("");
export const csvExists = writable(false);
export const setCsv = ()=>{
    csv.set("Placeholder")
    // if (fileexists) csvExists.set(true);
}