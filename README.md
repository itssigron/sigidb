# <a name="title" style="color: white">sigidb</a>


> [Documentation](#Documentation)<br>
> [NPM Package](https://www.npmjs.com/package/sigidb-test)


 ## What is sigidb ?
 sigidb is a wrapper package for better-sqlite3, super easy to use, includes better-sqlite3 database instance.

# Features
1. Very fast, 70% faster than `quick.db`
2. Support objects ([Example](#Working-with-objects))
# sigidb troubleshooting installation

If you have trouble installing `sigidb` because of `better-sqlite3`, follow this checklist (officially created by `better-sqlite3` owner.):

1. Make sure you're using nodejs v10.20.1 or later

2. Make sure you have [`node-gyp`](https://github.com/nodejs/node-gyp#installation) globally installed (`npm i node-gyp -g`), including all of [its dependencies](https://github.com/nodejs/node-gyp#on-unix). On Windows you may need to [configure some things manually](https://github.com/nodejs/node-gyp#on-windows).

3. If you're using [Electron](https://github.com/electron/electron), try running [`electron-rebuild`](https://www.npmjs.com/package/electron-rebuild)

4. If you're using Windows, follow these steps. Do them **in this order**, and **don't skip steps**.

    1. Install the **latest version** of node 10, 12, or 14.
    2. Install **latest version** of Visual Studio Community and Desktop Development with C++ extension (if you already have VS Community then modify it, and add the Development with C++ extension).
    3. Install **latest version** of Python.
    4. Run the following commands:
    ```
    npm config set msvs_version 2019
    npm config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\MSBuild.exe"
    ```
    5. Run `npm install sigidb-test`

If none of these solved your problem, try browsing [previous issues](https://github.com/JoshuaWise/better-sqlite3/issues?q=is%3Aissue) or open a [new issue](https://github.com/JoshuaWise/better-sqlite3/issues/new).


# Documentation

- [db](#db)
- [db#originalDB](#dboriginalDB)
- [db#Database()](#dbDatabasename-options)
- [db#tables()](#dbtables)
- [db#table()](#dbtablename)
- [db#deleteTable()](#dbdeleteTablename)
- [db#set()](#dbsetkey-value-options)
- [db#get()](#dbgetkey-options)

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
Deletes provided table.
```js
console.log(db.all({table: "users"})) // [{id: "test1", value: 2}]
db.deleteTable("users");
console.log(db.all({table: "users"})) // SqliteError: no such table: users
```

### db#set(*key*, *value*, [*options*])
Store a value for a key in the database. <br>
Returns *value*
- `options.table`: table to store the key and value
```js
const db = require("sigidb-test");
db.set("test", 5) // set a new key named 'test' with the value 5.
console.log(db.get("test")) // 5

db.set("test", 4, {table: "test-table"}) //creates new table 'test-table' if not exists, and sets new key 'test' with value 4. 
console.log(db.get("test", {table: "test-table"})) // 4
```

### db#get(*key*, [*options*])
**Alias:** fetch<br>
Returns: *?value*

```js
console.log(db.get("test")) //5
console.log(db.get("unknown-key")) // undefined
```

### db#get(*key*, [*options*])
Returns: *Boolean*

```js
db.set("test", 3);
db.has("test") //true
db.has("unknown-key") // false
```
Also works with object.
```js
db.set("test1.test2.test3", 3);
db.has("test1") //true
db.has("test1.test2") //true
db.has("test1.test4") //false
```

### db#push(*key*, *value*, [*options*])
Pushes a value to an array in the database. <br>
Returns *main object* || *value*
- `options.table`: table to push the key to the array.
```js
const db = require("sigidb-test");
db.set("test", 5) // sets the value to a Number (pushes requires it to be an array).
db.push("test", "random value") // Error, target is not an array.
db.push("not-exists", "pistol") // returns ['pistol'], creates a new array in the key 'not-exists' because its not exists.
db.set("users", [1]); // set the 'users' key to have an array with index 0 as "1".
db.push("users", 2); // [1,2], pushes the value to the users array.
```

# Working with objects
sigidb works with objects.<br>
### What it means?
That you can set and get objects with string suport.
### Example:
```js
const db = require("sigidb-test");
db.set("users.123.guns", ["pistol"]);
db.get("users") // {"123": {guns: ["pistol"]}}
db.get("users.123") // {guns: ["pistol"]}
db.get("users.123.guns.0") // "pistol", db.get works with array indexes too, because 'users.123.guns' returns ["pistol"] (type array), so ".0" will return the value of the "0" index.
```
**Note:** it works on everything that requires the *key* parameter, like [`set`](#dbsetkey-value-options), [`get`](#dbgetkey-options), [`push`](#dbpushkey-value-options), etc.