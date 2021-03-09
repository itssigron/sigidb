const fs = require("fs");
const utils = fs.readdirSync(__dirname).filter(a => a !== "util.js");
const obj = {};
utils.forEach(util => {
    util = util.split(".");
    util.pop();
    util = util.join(".");
    obj[util] = require(`./${util}`);
});

module.exports = obj;