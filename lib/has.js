const util = require("../util/util.js");

module.exports = (db, key, options) => {
    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE ${options.id}=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        if (Array.isArray(JSON.parse(raw[options.value]))) {
            const result = util.get({ [key.split(".")[0]]: JSON.parse(raw[options.value]) }, key);
            return result === undefined ? false : true;
        } else {
            const result = util.get({ [key.split(".")[0]]: JSON.parse(raw[options.value]) }, key);
            return result === undefined ? false : true;
        }
    }
    return raw ? true : false

};