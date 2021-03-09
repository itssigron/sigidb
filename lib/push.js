const util = require("../util/util.js");

module.exports = (db, key, value, options) => {
    let obj;

    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE id=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        let arr = util.get(JSON.parse(raw.value), key);
        if (Array.isArray(arr) === false && arr !== undefined) throw new TypeError("Target for 'push' method must be an array.");
        obj = JSON.parse(raw.value);
        let newArr = util.get(obj, key);
        if (newArr) newArr.push(value)
        else {
            obj = util.set({}, key, []);
            newArr = util.get(obj, key);
            newArr.push(value)
        }
    } else if (!raw && key.includes(".")) {
        obj = util.set({}, key, []);
        let newArr = util.get(obj, key);
        newArr.push(value)
    } else if (raw && key.includes(".") === false) {
        obj = JSON.parse(raw.value);
        obj.push(value);
    };

    if (!raw) db.prepare(`INSERT INTO ${options.table} (id, value) VALUES(?, ?)`).run(key.includes(".") ? key.split(".")[0] : key, key.includes(".") ? JSON.stringify(obj) : JSON.stringify([value]));
    else {
        db.prepare(`UPDATE ${options.table} SET value=? WHERE id=?`).run(JSON.stringify(obj), key.includes(".") ? key.split(".")[0] : key);
    };

    return key.includes(".") ? obj : value;
};