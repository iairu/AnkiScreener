const fs = require("fs");

export const helloWorld = ()=>{
    fs.writeFileSync("./helloWorld.txt","Hello World!");
}

export const readTextFile = (path)=>{
    // Read file contents, return as a string
    // If the file doesn't exist return empty string
    let contents;
    try {
        contents = fs.readFileSync(path).toString();
    } catch (err) {
        if (err.code === 'ENOENT') { // No such file or directory
            contents = "";
        } else {
            throw err;
        }
    }
    return contents;
}

export const writeTextFile = (path,contents)=>{
    // Write file contents, no checks
    try {
        fs.writeFileSync(path,contents);
    } catch (err) {
        throw err;
    }
}

export const guaranteeNewLine = (text,delimiters=["\r","\n"])=>{ // delimiters should be an array of chars
    // guarantees new line at the end of a non-empty string
    let chars = text.split("");
    const last = chars.length - 1;

    // only last two specified delimiters are handled (if they exist)
    const r = (delimiters.length > 1) ? delimiters[delimiters.length - 2] : "";
    const n = (delimiters.length > 0) ? delimiters[delimiters.length - 1] : "";
    
    // empty text
    if (text.length === 0) return text; 

    // check last two positions
    if (chars[last] !== n) {
        if (chars[last - 1] !== r) {
            // there is not \r\n
            chars.push(r);
            chars.push(n);
        } else {
            // there is \r but not \n
            chars.push(n);
        }
    } else if (chars[last - 1] !== r) {
        // there is \n but not \r before it
        chars.pop();
        chars.push(r);
        chars.push(n);
    }

    return chars.join("");
}