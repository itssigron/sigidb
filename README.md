# <a name="title" style="color: white">Title</a>


> [Documentation](#docs)<br>
> [NPM Package](https://www.npmjs.com/package/sigidb-test)


 ## What is sigidb ?
 sigidb is a wrapper package for better-sqlite3, super easy to use, includes better-sqlite3 database instance.


# <a name="docs" style="color: white">Documentation</a>

- [Datebase](#Database)
- [Database#originalDB](#Database.originalDB)

### Database
require database.
```js
const db = require("sigidb-test");
```

### Database.originalDB

returns better-sqlite3 database's instance.<br>
see also [better-sqlite3#Database](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md#class-database)
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