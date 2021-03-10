const util = require("../util/util.js");

module.exports = (db, key, options) => {
    let obj;

    let raw = db.prepare(`SELECT * FROM ${options.table} WHERE ${options.id}=?`).get(key.includes(".") ? key.split(".")[0] : key);
    if (raw && key.includes(".")) {
        if(util.typeof(JSON.parse(raw[options.value])) !== "Object") throw new TypeError("Value of key in 'set' method with a target must be an object.");
        obj = JSON.parse(raw[options.value]);
        util.unset({[key.split(".")[0]]: obj}, key)[key.split(".")[0]];
    };

    if (!raw) return false;
    else {
        if(key.includes(".")) db.prepare(`UPDATE ${options.table} SET value=? WHERE ${options.id}=?`).run(JSON.stringify(obj), key.split(".")[0]);
        else db.prepare(`DELETE FROM main WHERE ${options.id}=?`).run(key);
        db.prepare("VACUUM").run();
        return true;
    };
};