module.exports = (db, name, options) => {
    db.prepare(`DROP TABLE ${options.database ? `${options.database}.` : ""}${name}`).run();
    return true;
};