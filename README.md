# <a name="title" style="color: white">sigidb</a>


> [Documentation](#docs)<br>
> [NPM Package](https://www.npmjs.com/package/sigidb-test)


 ## What is sigidb ?
 sigidb is a wrapper package for better-sqlite3, super easy to use, includes better-sqlite3 database instance.


# <a name="docs" style="color: white">Documentation</a>

- [db](#db)
- [db#originalDB](#db#originalDB)
- [db#Database()](#db#Databasename-options)
- [db#tables()](#db#tables)
- [db#table()](#db#tablename)
- [db#deleteTable()](#db#deleteTablename)

### db
Require database.
```js
const db = require("sigidb-test");
```

### db#originalDB

Returns better-sqlite3 database's object.<br>
See also [better-sqlite3#Database](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md#class-database)
```js
console.log(db.originalDB);
/*
Database {
  inTransaction: false,
  open: true,
  memory: false,
  readonly: false,
  name: 'db.sqlite'
}
*/
```

### db#Database(*name*, [*options*])
Returns a new sigidb database object using [better-sqlite3#Database](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md#class-database)

```js
const db = require("sigidb-test");
const db2 = db.Database("second-db.sqlite"); //create new sigidb database object on second-db.sqlite, if the file does not exists, better-sqlite3 will create it for you.
db2.set("test", 3); //set a new key in second-db.sqlite
console.log(db2.get("test")); //3
```

### db#tables()
Returns all tables in current database.

```js
const db = require("sigidb-test") //table is main because its the default table.
const users = db.table("users"); // sigidb database object with users as its default table (creates the table if not exists).
console.log(db.tables()); // ["main", "users"]
```

### db#table(*name*)
Returns sigidb database object with *name* table as the default table.<br>

```js
const db = require("sigidb-test") //table is main because its the default table.
const users = db.table("users"); // sigidb database object with users as its default table (creates the table if not exists).
console.log(db.tables()); // ["main", "users"]
db.set("test1", 1);
users.set("test1", 2);

console.log(db.all()) // [{id: "test1", value: 1}]
console.log(db.all({table: "users"})) // [{id: "test1", value: 2}]
console.log(users.all()) // [{id: "test1", value: 2}] (no need to provide a table because its the default table for 'users' object)
```

### db#deleteTable(*name*)
Delete provided table.
```js
console.log(db.all({table: "users"})) // [{id: "test1", value: 2}]
db.deleteTable("users");
console.log(db.all({table: "users"})) // SqliteError: no such table: users
```