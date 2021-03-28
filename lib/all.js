module.exports = (db, filter, options) => {
    let raws = db.prepare(`SELECT * FROM ${options.table}`).all().map(raw => Object({[options.id]: raw[options.id], [options.value]: JSON.parse(raw[options.value])}));
    if(typeof filter !== "function" && filter != undefined) throw new TypeError("filter parameter must be a function.");
    return filter ? raws.filter(filter) : raws;
};