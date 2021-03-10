module.exports = function set(obj = {}, paths = [], value) {
    const inputObj = obj === null ? {} : obj;
   if(typeof paths === "string") paths = paths.split(".");
    if (paths.length === 0) {
        return inputObj;
    }

    if (paths.length === 1) {
        const path = paths[0];
        inputObj[path] = value;
        return { ...inputObj, [path]: value };
    }

    const [path, ...rest] = paths;
    const currentNode = inputObj[path];

    const childNode = set(currentNode, rest, value);

inputObj[path] = childNode;
    return inputObj
};


/*
module.exports = function set(obj, path, value) {
    if (Object(obj) !== obj) return obj;
    if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []; 
    path.slice(0, -1).reduce((a, c, i) =>
        Object(a[c]) === a[c]
            ? a[c]
            : a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1]
                ? []
                : {},
        obj)[path[path.length - 1]] = value;
    return obj;
};
*/
/*
module.exports = function set(obj, path, value) {
    if (Object(obj) !== obj) return obj;
    if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
    if (value === undefined) path.slice(0, -1).reduce((a, c, i) =>
        Object(a[c]) === a[c]
            ? a[c]
            : a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1]
                ? []
                : {},
        obj)
    else path.slice(0, -1).reduce((a, c, i) =>
        Object(a[c]) === a[c]
            ? a[c]
            : a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1]
                ? []
                : {},
        obj)[path[path.length - 1]] = value;
    return obj;
};*/