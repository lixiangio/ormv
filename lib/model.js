'use strict'

const fieldsPretreatment = require('./fields');
const Options = require('./options');
const replace = require('./replace');
const Select = require('./select');
const Delete = require('./delete');
const Update = require('./update');

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
    * 查询sql函数链
    */
   select(...fields) {

      return new Select(this, fields);

   }
   /**
    * 插入新数据
    * @param {*} data
    */
   insert(data) {

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
    * 
    * @param {Object} options 查询选项
    * @param {Object} data 更新数据
    */
   update(data) {

      return new Update(this, data);

   }
   /**
    * 
    * @param {Object} options 查询选项
    */
   async delete(options = {}) {

      return new Delete(this);

   }
}