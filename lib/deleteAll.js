const util = require("../util/util.js");

module.exports = (db, options) => {
    let raws = db.prepare(`SELECT * FROM ${options.table}`).all();
    raws.map(raw => db.prepare("DELETE FROM main WHERE id=?").run(raw.id));
    db.prepare("VACUUM").run();
    return raws.length
};