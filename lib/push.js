const util = require("../util/util.js");
const get = require("./get")
module.exports = (db, key, value, options) => {
    let obj;
    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE ${options.id}=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        let arr = util.get(JSON.parse(raw[options.value]), key.split(".").slice(1).join("."));
        if (Array.isArray(arr) === false && arr !== undefined) throw new TypeError("Target for 'push' method must be an array.");
        obj = JSON.parse(raw[options.value]);
        let newArr = util.get(obj, key.split(".").slice(1).join("."));
        if (newArr) newArr.push(value)
        else {
            obj = util.set(obj, key.split(".").slice(1).join("."), []);
            newArr = util.get(obj, key.split(".").slice(1).join("."));
            newArr.push(value)
        }
    } else if (!raw && key.includes(".")) {
        obj = util.set({}, key, [])[key.split(".")[0]];
        let newArr = util.get(obj, key.split(".").slice(1).join("."));
        newArr.push(value)
    } else if (raw && key.includes(".") === false) {
        obj = JSON.parse(raw[options.value]);
        if (Array.isArray(obj) === false) throw new TypeError("Target for 'push' method must be an array.");
        obj.push(value);
    };

    if (!raw) db.prepare(`INSERT INTO ${options.table} (${options.id}, ${options.value}) VALUES(?, ?)`).run(key.includes(".") ? key.split(".")[0] : key, key.includes(".") ? JSON.stringify(obj) : JSON.stringify([value]));
    else {
        db.prepare(`UPDATE ${options.table} SET ${options.value}=? WHERE ${options.id}=?`).run(JSON.stringify(obj), key.includes(".") ? key.split(".")[0] : key);
    };

    return get(db, key, options);
};