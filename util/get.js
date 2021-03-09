module.exports = function get(obj, str) {
    if (typeof str !== "string") return undefined;
    str = str.replace(/(\[(\d)\])/g, '.$2');
    let keys = str.split(".");
    if (keys.length === 0) return undefined;
    let key = keys[0];
    let value = obj[key];
    if (value === undefined) return undefined;
    if(value === null && keys.length > 1) return undefined;
    if(value === null && keys.length === 1) return null;
    if (!obj.hasOwnProperty(key)) return undefined;
    if (typeof value === "object" && Array.isArray(value) === false) {
        if (keys.length === 1) return value;
        return get(value, keys.slice(1).join("."));
    }
    if (keys.length === 1) {
        if (obj.hasOwnProperty(key)) return value;
    } else return get(value, keys.slice(1).join("."));
};