const util = require("../util/util.js");

module.exports = (db, key, options) => {
    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE ${options.id}=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        return util.typeof(util.get(JSON.parse(raw[options.value]), key));
    };
    return util.typeof(raw ? JSON.parse(raw[options.value]) : raw);
};