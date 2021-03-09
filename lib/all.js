const util = require("../util/util.js");

module.exports = (db, filter, options) => {
    let raws = db.prepare(`SELECT * FROM ${options.table}`).all().map(raw => Object({[options.id || "id"]: raw.id, [options.value || "value"]: JSON.parse(raw.value)}));
    if(typeof filter !== "function" && typeof filter !== "undefined") throw new TypeError("filter parameter must be a function.");
    return filter ? raws.filter(filter) : raws;
};