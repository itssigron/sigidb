const util = require("../util/util.js");

module.exports = (db, key, value, options) => {
    if (typeof options.target === "string") {
        key += `.${options.target.replace(/^\./, "")}`;
    };

    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE ${options.id}=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        if (util.typeof(JSON.parse(raw[options.value])) !== "Object") throw new TypeError("Value of key in 'set' method with a target must be an object.");
        value = util.set({ [key.split(".")[0]]: JSON.parse(raw[options.value]) }, key, value)[key.split(".")[0]];
    } else if (!raw && key.includes(".")) {
        value = util.set({}, key, value)[key.split(".")[0]];
    };

    if (!raw) db.prepare(`INSERT INTO ${options.table} (${options.id}, ${options.value}) VALUES(?, ?)`).run(key.includes(".") ? key.split(".")[0] : key, JSON.stringify(value));
    else {
        db.prepare(`UPDATE ${options.table} SET ${options.value}=? WHERE ${options.id}=?`).run(JSON.stringify(value), key.includes(".") ? key.split(".")[0] : key);
    };

    return value;
};