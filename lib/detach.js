module.exports = (db, name, options) => {
    db.prepare(`DETACH DATABASE '${name}'`).run();
    return true;
};  