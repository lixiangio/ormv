'use strict'

const action = require('./action');
const typea = require('typea');

module.exports = class {
   constructor(options) {

      const { client, name, schema } = options;

      this.client = client;
      this.name = name;
      this.schema = schema;
      this.logger = client.logger;

      for (let name in schema) {

         let item = schema[name]
         console.log(item)

         if (typea[item.type]) {

            // let schema = typea.schema(schema)
            
         } else {
            throw new Error(`${item.type}字段定义的${item.type.name}类型不存在`)
         }

         if (item.primaryKey) {
            this.primaryKey = name;
         }

      }

   }
   /**
    * 
    * @param {*} data 要插入数据
    */
   async insert(data) {

      const keys = []
      const values = []

      if (typeof data === 'object') {
         for (let key in data) {
            keys.push(key)
            let value = data[key]
            if (typeof value === 'object') {
               value = `'${JSON.stringify(value)}'`
            }
            values.push(value)
         }
      } else {
         throw new Error('data参数必须为对象类型')
      }

      if (keys.includes('id') === false) {
         keys.unshift('id')
         values.unshift('DEFAULT')
      }

      let sql = `INSERT INTO ${this.name} (${keys}) VALUES (${values})`

      this.logger(sql)

      let result = await this.client.query(sql)

      return {
         rowCount: result.rowCount
      }

   }
   async findAll(options) {

      let { attributes, where, group, order, limit, offset } = options;

      if (Array.isArray(attributes)) {
         attributes = String(attributes)
      } else {
         attributes = '*'
      }

      if (where) {
         let part = []
         for (let name in where) {
            part.push(name + ' = ' + where[name])
         }
         if (part.length) {
            where = ' WHERE ' + part.join(' AND ')
         } else {
            where = ''
         }
      } else {
         where = ''
      }

      // group与order只能二选一，优先使用group
      // group字段覆盖attributes
      if (group) {
         attributes = group;
         group = ` GROUP BY ${group}`;
         order = ''
      }

      else if (order) {
         let list = []
         for (let name in order) {
            list.push(name + ' ' + order[name])
         }
         order = ' ORDER BY ' + list
         group = ''
      }

      if (limit) {
         limit = ` LIMIT ${limit}`
      } else {
         limit = ''
      }

      if (offset) {
         offset = ` OFFSET ${offset}`
      } else {
         offset = ''
      }

      let sql = `SELECT ${attributes} FROM ${this.name}${where}${group}${order}${limit}${offset}`

      this.logger(sql)

      const result = await this.client.query(sql);

      return result.rows;

   }
   async findOne(options) {

      options.limit = 1;

      const result = await this.findAll(options)

      if (result) {
         return result[0]
      }

   }
   /**
    * 按主键搜索
    * @param {Number} id 主键id  
    * @param {*} options 
    */
   async findByPk(id, options = {}) {

      options.where.id = id

      return this.findOne(options)

   }
   /**
    * 
    * @param {*} options 
    * @param {*} data 更新数据
    */
   async update(options, data) {

      let { where } = options;

      let set = 'SET '
      if (data) {
         for (let field in data) {
            let value = data[field]
            if (typeof value === 'object') {
               let symbols = Object.getOwnPropertySymbols(value)
               if (symbols.length) {
                  for (let symbol of symbols) {
                     let options = value[symbol]
                     value = action[symbol](field, options, this.schema)
                     set += `${field} = ${value}`;
                  }
               } else {
                  value = JSON.stringify(value);
                  set += `${field} = '${value}'`;
               }
            } else {
               set += `${field} = ${value}`;
            }
         }
      } else {
         return
      }

      if (where) {
         let part = []
         for (let name in where) {
            part.push(name + ' = ' + where[name])
         }
         if (part.length) {
            where = ' WHERE ' + part.join(' AND ')
         } else {
            where = ''
         }
      } else {
         where = ''
      }

      let sql = `UPDATE ${this.name} ${set}${where}`

      this.logger(sql)

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
   async destroy(options) {

      let { where } = options;

      if (where) {
         let part = []
         for (let name in where) {
            part.push(name + ' = ' + where[name])
         }
         if (part.length) {
            where = ' WHERE ' + part.join(' AND ')
         } else {
            where = ''
         }
      } else {
         where = ''
      }

      let sql = `DELETE FROM ${this.name}${where}`

      this.logger(sql)

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
}