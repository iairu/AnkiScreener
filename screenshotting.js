const screenshot = require("screenshot-desktop")
const clipper = require("image-clipper")

screenshot().then(imgBuffer => {
}).catch(err => {
    console.log(err)
})