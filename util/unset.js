const get = require("./get");

module.exports = function unset(obj, key) {
    let keys = key.split(".");
    let result = keys.length > 1 ? get(obj, keys.slice(0, keys.length - 1).join(".")) : obj;
    delete result?.[keys[keys.length - 1]];
    if (Array.isArray(result)) result.splice(keys[keys.length - 1], 1)
    return obj;
};