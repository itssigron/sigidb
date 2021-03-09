const util = require("../util/util.js");

module.exports = (db, key, options) => {
    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE id=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        if (Array.isArray(JSON.parse(raw.value))) return util.get({ [key.split(".")[0]]: JSON.parse(raw.value) }, key)
        else {
            return util.get({ [key.split(".")[0]]: JSON.parse(raw.value) }, key);
        }
    }
    return raw ? JSON.parse(raw.value) : raw;

};