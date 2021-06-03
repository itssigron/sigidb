type DataType = 'undefined' | 'null' | 'Boolean' | 'Number' | 'String' | 'Object' | 'Array'
type AllData = { id:string, value:any }[]

class DataBaseInfo {
    name:string
    open:boolean
    inTransaction:boolean
    readonly:boolean
    memory:boolean
}

interface BetterSqlite3Options {
    readonly?:boolean
    fileMustExist?:boolean
    timeout?:number
    verbose?:boolean
    varargs?:boolean
    directOnly?:boolean
    deterministic?:boolean
    start?:Function
    step?:Function
    result?:Function
}
interface DBOptions extends BetterSqlite3Options {
    id?:string
    value?:string
    table?:string
}
interface TableOptions {
    table?:string
}

type DataBase = {
    Database(name:string,options?:DBOptions):DataBase
    set(key:string,value:any,options?:TableOptions):any
    get(key:string,options?:TableOptions):any
    fetch(key:string,options?:TableOptions):any
    has(key:string,options?:TableOptions):boolean
    add(key:string,value:number,options?:TableOptions):number
    subtract(key:string,value:number,options?:TableOptions):number
    push(key:string,value:any,options?:TableOptions):any
    delete(key:string,options?:TableOptions):boolean
    deleteAll(options?:TableOptions):number
    type(key:string,options?:TableOptions):DataType
    all(options?:TableOptions):AllData
    table(name:string):DataBase
    deleteTable(name:string):boolean
    tables():string[]
    originalDB:DataBaseInfo
}

function database(name:string,options?:DBOptions):DataBase

export = database
