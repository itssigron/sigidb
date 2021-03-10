const Database = require("better-sqlite3");
const util = require("./util/util");
const fs = require("fs");
const db = new Database(":memory:");


let exportsObject = (db, opts) => {
    db.prepare(`CREATE TABLE IF NOT EXISTS ${opts ? opts.table || "main" : "main"} (id TEXT, value TEXT)`).run();

    function runMethod(name, ...params) {
        const file = require(`./lib/${name}.js`);
        params = [db].concat(params);
        let options = params[params.length - 1] || params[params.length - 2];
        if (util.typeof(options) !== "Object") options = {};
        if (!options.table) options.table = "main";
        db.prepare(`CREATE TABLE IF NOT EXISTS ${options.table} (id TEXT, value TEXT)`).run();
        return file(...params.slice(0, params.length - 2).concat(options));
    };
    let obj = {
        Database(path, options) {
            return exportsObject(new Database(path, options), opts);
        },
        set: function (key, value, options = {}) {
            if (key === undefined) throw new TypeError("A key must be provided.");
            if (!value === undefined) throw new TypeError("A value must be provided.");

            return runMethod("set", key, value, options, opts)
        },
        get: function (key, options = {}) {
            if (!key) throw new TypeError("A key must be provided.");

            return runMethod("get", key, options, opts)
        },
        fetch: function (key, options = {}) {
            if (!key) throw new TypeError("A key must be provided.");

            return runMethod("get", key, options, opts)
        },
        has: function (key, options = {}) {
            if (!key) throw new TypeError("A key must be provided.");

            return runMethod("has", key, options, opts)
        },
        add: function (key, value, options = {}) {
            if (key === undefined) throw new TypeError("A key must be provided.");
            if (!value === undefined) throw new TypeError("A value must be provided.");
            if (typeof value !== "number") throw new TypeError("Value's type must be a number.");

            return runMethod("add", key, value, options, opts)
        },
        subtract: function (key, value, options = {}) {
            if (key === undefined) throw new TypeError("A key must be provided.");
            if (!value === undefined) throw new TypeError("A value must be provided.");
            if (typeof value !== "number") throw new TypeError("Value's type must be a number.");

            return runMethod("subtract", key, value, options, opts)
        },
        push: function (key, value, options = {}) {
            if (key === undefined) throw new TypeError("A key must be provided.");
            if (!value === undefined) throw new TypeError("A value must be provided.");

            return runMethod("push", key, value, options, opts)
        },
        delete: function (key, options = {}) {
            if (key === undefined) throw new TypeError("A key must be provided.");

            return runMethod("delete", key, options, opts)
        },
        deleteAll: function (options = {}) {
            return runMethod("deleteAll", options, opts)
        },
        type: function (key, options = {}) {
            if (!key) throw new TypeError("A key must be provided.");

            return runMethod("type", key, options, opts)
        },
        all: function (filter, options = {}) {
            return runMethod("all", filter, options, opts);
        },
        table: table,
        deleteTable: function (name, options = {}) {
            if (name === undefined) throw new TypeError("Table name must be provided.");

            return runMethod("deleteTable", name, options, opts)
        },
        attach: function (name, path, options = {}) {
            throw new Error("This method isnt fully completed and have some issues.");
            if (!name) throw new TypeError(`Name parameter must be provided.`);
            if (!path) throw new TypeError(`Path parameter must be provided.`);

            return runMethod("attach", name, path, options, opts);
        },
        detach: function (name, options = {}) {
            throw new Error("This method isnt fully completed and have some issues.");

            if (!name) throw new TypeError(`Name parameter must be provided.`);

            return runMethod("detach", name, options, opts);
        },
        tables: function (dbname, options = {}) {
            return runMethod("tables", dbname, options, opts)
        },
        databases: function (options = {}) {
            throw new Error("This method isnt fully completed and have some issues.");

            return runMethod("databases", options, opts)
        },
        backups: {
            create: async function (name, options) {
                try {
                    if (!fs.existsSync("./backups")) fs.mkdirSync("./backups");
                    await db.backup(`./backups/${name}`, options);
                    return `./backups/${name}`;
                } catch (e) {
                    throw e;
                }
            },
            load: function (name) {
                if (!fs.existsSync("./backups")) throw new Error("Backups folder does not exists.");
                if (!fs.existsSync(`./backups/${name}`)) throw new Error("Backup file does not exists.");

                db.close();
                fs.unlinkSync("./db.sqlite");
                fs.copyFile(`./backups/${name}`, `./db.sqlite`, (err) => {
                    if (err) throw err;
                });
                db = new Database("db.sqlite");
            },
            delete: function (name) {
                if (!fs.existsSync("./backups")) throw new Error("Backups folder does not exists.");
                if (!fs.existsSync(`./backups/${name}`)) throw new Error("Backup file does not exists.");

                fs.unlinkSync(`./backups/${name}`);
            },
        },
        originalDB: db
    }
    return obj;
};

function table(name) {
    if (util.typeof(name) !== "String") throw new TypeError(`Name parameter must be a String, received ${util.typeof(name)}`);
    db.prepare(`CREATE TABLE IF NOT EXISTS ${name} (id TEXT, value TEXT)`).run();

    let opts = {
        table: name
    };

    return exportsObject(db, opts);
};

module.exports = exportsObject(db)