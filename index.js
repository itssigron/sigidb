const Database = require("better-sqlite3");
const util = require("./util/util");
const fs = require("fs");
const db = new Database("db.sqlite");


let exportsObject = (db, opts) => {
    db.prepare(`CREATE TABLE IF NOT EXISTS ${opts ? opts.table || "main" : "main"} (id TEXT, value TEXT)`).run();

    function runMethod(name, ...params) {
        const file = require(`./lib/${name}.js`);
        params = [db].concat(params);
        let options = params[params.length - 1] || params[params.length - 2];
        if (util.typeof(options) !== "Object") options = {};
        if (!options.table) options.table = "main";
        return file(...params.slice(0, params.length - 2).concat(options));
    };
    return {
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
            }
        },
        originalDB: db
    }
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