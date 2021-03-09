module.exports = (db, options) => {
    let raws = db.prepare(`SELECT * FROM ${options.table}`).all();
    db.prepare(`DELETE FROM ${options.table}`).run();
    db.prepare("VACUUM").run();
    return raws.length
};