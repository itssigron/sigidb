module.exports = (db, options) => {
    return db.pragma("database_list").map(a => Object({name: a.name, tables: db.prepare(`SELECT name FROM ${a.name}.sqlite_master WHERE type='table' AND name IS NOT NULL`).all().map(a => a.name)}));
};