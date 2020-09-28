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
        if (err.code === 'ENOENT') {
            contents = "";
        } else {
            throw err;
        }
    }
    return contents;
}