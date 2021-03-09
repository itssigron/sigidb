module.exports = (db, database, options) => {
    return db.prepare(`SELECT name FROM ${database ? `${database}.` : ""}sqlite_master WHERE type='table' AND name IS NOT NULL`).all().map(a => a.name);
};