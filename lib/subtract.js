const util = require("../util/util.js");

module.exports = (db, key, value, options) => {
    let obj;

    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE ${options.id}=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        if(util.typeof(JSON.parse(raw[options.value])) !== "Object") throw new TypeError("Value of key in 'subtract' method with a target must be an object.");
        let oldVal = require("./get")(db,key,options);
        if(oldVal == undefined) oldVal = 0;
        if(typeof oldVal !== "number") throw new Error("Target must be a number for db.subtract")

        obj = util.set({[key.split(".")[0]]: JSON.parse(raw[options.value])}, key, oldVal - value)[key.split(".")[0]];
    } else if (!raw && key.includes(".")) {
        value = JSON.stringify(util.set({}, key, value)[key.split(".")[0]]);
        obj = JSON.parse(value);
    } else if(!key.includes(".")) {
        let oldVal = require("./get")(db,key,options);
        if(oldVal == undefined) oldVal = 0;
        if(typeof oldVal !== "number") throw new Error("Target must be a number for db.subtract")

        value = oldVal - value;
    };

    if (!raw) db.prepare(`INSERT INTO ${options.table} (${options.id}, ${options.value}) VALUES(?, ?)`).run(key.includes(".") ? key.split(".")[0] : key, value);
    else {
        db.prepare(`UPDATE ${options.table} SET ${options.value}=? WHERE ${options.id}=?`).run(key.includes(".") ? JSON.stringify(obj) : JSON.stringify(value), key.includes(".") ? key.split(".")[0] : key);
    };

    return key.includes(".") ? obj : value;
};