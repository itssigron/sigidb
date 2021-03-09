module.exports = (db, name, path, options) => {
    db.prepare(`ATTACH DATABASE '${path}' AS '${name}'`).run();
    return true;
};