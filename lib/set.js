const util = require("../util/util.js");

module.exports = (db, key, value, options) => {
    let obj;

    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE id=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        if(util.typeof(JSON.parse(raw.value)) !== "Object") throw new TypeError("Value of key in 'set' method with a target must be an object.");
        obj = util.set({[key.split(".")[0]]: JSON.parse(raw.value)}, key, value)[key.split(".")[0]];
    } else if (!raw && key.includes(".")) {
        value = JSON.stringify(util.set({}, key, value)[key.split(".")[0]]);
        obj = JSON.parse(value);
    };

    if (!raw) db.prepare(`INSERT INTO ${options.table} (id, value) VALUES(?, ?)`).run(key.includes(".") ? key.split(".")[0] : key, JSON.stringify(value));
    else {
        db.prepare(`UPDATE ${options.table} SET value=? WHERE id=?`).run(key.includes(".") ? JSON.stringify(obj) : JSON.stringify(value), key.includes(".") ? key.split(".")[0] : key);
    };

    return key.includes(".") ? obj : value;
};