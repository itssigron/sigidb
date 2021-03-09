module.exports = function typeOf(item) {
    if (item === undefined) return "undefined"
    else if (item === null) return "null"

    return item.constructor ? item.constructor.name : typeof item
};