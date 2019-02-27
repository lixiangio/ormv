'use strict'

module.exports = class {
   async sync(mode) {

      if (!mode) {
         return await this.default()
      } else if (mode === 'increment') {
         return await this.increment()
      } else if (mode === 'rebuild') {
         return await this.rebuild()
      }

   }
   async default() {

      let fields = this._fields();

      let sql = `CREATE TABLE IF NOT EXISTS "${this.name}" (${fields});`

      this.logger(sql);

      let result = await this.client.query(sql);

      return result

   }
   async rebuild() {

      let fields = this._fields();

      let sql = `DROP TABLE IF EXISTS "${this.name}" CASCADE;CREATE TABLE IF NOT EXISTS "${this.name}" (${fields});`

      this.logger(sql);

      let result = await this.client.query(sql);

      return result

   }
   async increment() {

      let sql = `SELECT DISTINCT
      a.attname as name
  FROM pg_attribute a 
  JOIN pg_class pgc ON pgc.oid = a.attrelid
  LEFT JOIN pg_index i ON 
      (pgc.oid = i.indrelid AND i.indkey[0] = a.attnum)
  LEFT JOIN pg_description com on 
      (pgc.oid = com.objoid AND a.attnum = com.objsubid)
  LEFT JOIN pg_attrdef def ON 
      (a.attrelid = def.adrelid AND a.attnum = def.adnum)
  WHERE a.attnum > 0 AND pgc.oid = a.attrelid
  AND pg_table_is_visible(pgc.oid)
  AND NOT a.attisdropped
  AND pgc.relname = '${this.name}'
  ORDER BY a.attname;`

      this.logger(sql);

      let { rows } = await this.client.query(sql);

      if (rows.length) {

         let fields = [];
         for (let item of rows) {
            fields.push(item.name)
         }

         let sql = [];

         for (let name in this.fields) {
            if (fields.includes(name) === false) {
               let item = this.fields[name];
               let { defaultValue, type } = item
               let _default = ''
               if (defaultValue) {
                  if (typeof defaultValue === 'object') {
                     defaultValue = JSON.stringify(defaultValue)
                  }
                  _default = ` DEFAULT '${defaultValue}'`
               }
               sql.push(`ALTER TABLE "${this.name}" ADD COLUMN "${name}" ${type.alias || type.name}${_default}`)
            }
         }

         if (sql.length) {

            sql = sql.join('; ')

            this.logger(sql);

            return await this.client.query(sql);

         }

      } else {

         return await this.default();

      }

   }
   _fields() {

      let fields = []

      for (let name in this.fields) {
         let item = this.fields[name];
         if (item.primaryKey) {
            fields.push(`"${name}" SERIAL`);
            fields.push(`PRIMARY KEY ("${this.primaryKey}")`);
         } else {
            let { defaultValue, type } = item
            let _default = ''
            if (defaultValue) {
               if (typeof defaultValue === 'object') {
                  defaultValue = JSON.stringify(defaultValue)
               }
               _default = ` DEFAULT '${defaultValue}'`
            }
            fields.push(`"${name}" ${type.alias || type.name}${_default}`);
         }
      }

      if (!this.primaryKey) {
         fields.unshift(`PRIMARY KEY ("id")`);
         fields.unshift(`"id" SERIAL`);
      }

      return fields.join(', ');

   }
}