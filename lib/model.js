'use strict'

const typea = require('typea');
const validator = require('validator');
const action = require('./action');
const Type = require('./type');

/**
 * 字段值多条件验证器
 * @param {Object} validate 验证表达式
 */
function validatorGroup(validate) {

   return function (data) {

      for (let name in validate) {
         if (validator[name](data) === false) {
            throw new Error(`${name}('${data}')验证失败`)
         }
      }

      return true

   }

}

module.exports = class {
   /**
    * 
    * @param {Object} options 
    */
   constructor(options) {

      const { client, name, attributes } = options;

      this.client = client;
      this.name = name;
      this.attributes = attributes;
      this.logger = client.logger;

      /**
       * attributes预处理
       */
      for (let name in attributes) {

         let { type, primaryKey, validate } = attributes[name];

         if (typeof type === 'function') {

            if (Type[type.name]) {

               if ([Type.JSONB, Type.JSON].includes(type)) {
                  attributes[name].validate = typea.schema(validate)
               } else {
                  attributes[name].validate = validatorGroup(validate)
               }

            } else {

               throw new Error(`${name}字段类型${type.name}不存在`);

            }

            if (primaryKey) {
               this.primaryKey = name;
            }

         } else {

            throw new Error(`${name}字段类必须为函数类型`)

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
   /**
    * 
    * @param {Object} options 
    */
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
      } else if (order) {
         let list = []
         for (let name in order) {
            list.push(name + ' ' + order[name])
         }
         order = ' ORDER BY ' + list
         group = ''
      } else {
         group = ''
         order = ''
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
   /**
    * 
    * @param {Object} options 
    */
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
    * @param {Object} options 
    */
   async findByPk(id, options = {}) {

      let { where } = options

      if (where === undefined) {
         where = {}
         options.where = where
      }

      if (this.primaryKey) {
         where[this.primaryKey] = id
      } else {
         where.id = id
      }

      options.limit = 1;

      const result = await this.findAll(options)

      if (result) {
         return result[0]
      }

   }
   /**
    * 
    * @param {Object} options 
    * @param {*} data 更新数据
    */
   async update(options, data) {

      let { where } = options;

      let set = 'SET '
      if (data) {

         for (let field in data) {

            let item = this.attributes[field];

            if (item) {

               let { type, validate } = item

               let value = data[field]

               if (type(value)) {

                  let symbols = Object.getOwnPropertySymbols(value)

                  if (typeof value === 'object') {

                     // 对象中包含symbol操作符
                     if (symbols.length) {
                        for (let symbol of symbols) {
                           let options = value[symbol]
                           value = action[symbol](field, options, validate)
                           set += `${field} = ${value}`;
                        }
                     }

                     // 普通JSON对象
                     else {

                        const { error, data } = validate(value);

                        if (error) {
                           throw new Error(error)
                        }

                        value = JSON.stringify(data);
                        set += `${field} = '${value}'`;

                     }

                  } else {

                     let result = validate(String(value));

                     console.log(result)

                     set += `${field} = '${value}'`;

                  }

               } else {

                  throw new Error(`${field}字段值必须为${type.name}类型`);

               }

            } else {

               throw new Error(`${this.name}模型中找不到${field}字段`);

            }

         }

      } else {

         throw new Error(`data参数不能为空`);

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
   /**
    * 
    * @param {Object} options 
    */
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