'use strict'

const fieldsPretreatment = require('./fields');
const Options = require('./options');
const replace = require('./replace');

const { replaceKey, replaceValue } = replace;

const whereAction = Options.where;

const op = Symbol.for('op');

module.exports = class {
   /**
    * 
    * @param {Object} options 
    */
   constructor(options) {

      let { client, fields, name } = options;

      this.client = client;
      this.logger = client.logger;

      this.fields = fields;

      let fieldsKeys = Object.keys(fields).map(field => `"${field}"`);

      this.fieldsKeys = fieldsKeys;

      this.name = name.trim();

      fieldsPretreatment.call(this, fields);

   }
   /**
    * 
    * @param {*} data
    */
   async create(data) {

      let fields = []
      let values = []

      if (typeof data === 'object') {

         for (let field in data) {

            let attribute = this.fields[field];

            if (attribute) {

               let { type, validate } = attribute;

               let value = data[field];

               if (type(value)) {

                  fields.push(replaceKey(field));

                  value = validate(value);

                  values.push(`'${value}'`);

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            } else {

               continue;

            }

         }

      } else {

         throw new TypeError('data参数必须为对象类型');

      }

      if (fields.includes('"id"') === false) {

         fields.unshift('"id"');
         values.unshift('DEFAULT');

      }

      let sql = `INSERT INTO "${this.name}" (${fields}) VALUES (${values})`

      this.logger(sql);

      let result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      }

   }
   /**
    * 查询多条
    * @param {Object} options 查询选项
    */
   async find(options = {}) {

      let { select } = options;

      let list = [];
      for (let name in options) {
         let action = Options[name]
         if (action) {
            let value = options[name]
            list.push(action(value, options))
         }
      }

      list.sort(function (a, b) {
         return a.grade - b.grade
      })

      let fields = [];
      if (select) {
         fields = list.shift().value
      } else {
         fields = this.fieldsKeys;
      }

      let child = ''
      for (let item of list) {
         child += item.value
      }

      let sql = `SELECT ${fields} FROM "${this.name}"${child}`

      this.logger(sql);

      const result = await this.client.query(sql);

      return result.rows;

   }
   /**
    * find的别名
    * @param {Object} options 查询选项
    */
   async findAll(options) {
      return this.find(options);
   }
   /**
    * 查询单条
    * @param {Object} options 查询选项
    */
   async findOne(options = {}) {

      options.limit = 1;

      const result = await this.find(options)

      if (result) {
         return result[0]
      }

   }
   /**
    * 按主键搜索
    * @param {Number} id 主键id  
    * @param {Object} options 查询选项
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

      const result = await this.find(options)

      if (result) {
         return result[0]
      }

   }
   /**
    * 查询数据总量
    * @param {Object} options 查询选项
    */
   async count(options) {

      options.select = [`count(*)`]
      const result = await this.find(options);

      if (result) {
         return result[0].count
      }

   }
   /**
    * 
    * @param {Object} options 查询选项
    * @param {Object} data 更新数据
    */
   async update(options = {}, data) {

      let { where } = options;

      let set = [];

      if (String(data) === '[object Object]') {

         for (let field in data) {

            let attribute = this.fields[field];

            if (attribute) {

               let { type, validate } = attribute;

               let value = data[field];

               if (String(value) === '[object Object]') {

                  let callback = value[op]

                  // 操作符对象
                  if (callback) {

                     value = value.value

                     if (type(value)) {

                        value = validate(value)

                        value = callback(field, value);

                        set.push(`${replaceKey(field)} = ${value}`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

                  // 普通JSON对象，直接序列化为字符串
                  else {

                     if (type(value)) {

                        value = validate(value)

                        set.push(`${replaceKey(field)} = '${value}'`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

               }

               // 非对象类型
               else if (type(value)) {

                  validate(value);

                  value = replaceValue(value);

                  set.push(`${replaceKey(field)} = '${value}'`);

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            } else {

               throw new Error(`${this.name}模型中找不到${field}字段`);

            }

         }

         set = set.join(", ")

      } else {

         throw new Error(`data参数值必须为Object类型`);

      }

      where = whereAction(where).value

      let sql = `UPDATE "${this.name}" SET ${set}${where}`;

      this.logger(sql);

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
   /**
    * 
    * @param {Object} options 查询选项
    */
   async destroy(options = {}) {

      let { where } = options;

      where = whereAction(where).value;

      let sql = `DELETE FROM "${this.name}"${where}`;

      this.logger(sql);

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
}