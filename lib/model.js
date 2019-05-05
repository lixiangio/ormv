'use strict';

const dayjs = require('dayjs');
const fieldsPretreatment = require('./fields.js');
const replace = require('./replace.js');
const Find = require('./chain/find.js');
const Update = require('./chain/update.js');
const Delete = require('./chain/delete.js');
const Sync = require('./sync.js');
const Op = require('./operator/');

const { replaceKey } = replace;
const ignore = [undefined, null, ''];
const { $count, $merge, $in } = Op;

class Model extends Sync {
   /**
    * @param {Object} options 
    */
   constructor(options) {

      super();

      const { name, client, fields } = options;

      this.name = name.trim();
      this.client = client;
      this.logger = client.logger;

      this.fields = fields;

      this.fieldsKeys = Object.keys(fields).map(field => `"${field}"`);

      fieldsPretreatment(this);

   }
   /**
    * 插入新数据
    * @param {*} data
    */
   async insert(data) {

      const fields = [];
      const values = [];

      if (typeof data === 'object') {

         // if (Array.isArray(data)) {
         // } else {
         // }

         let { insertFields } = this

         for (let field in insertFields) {

            let { allowNull, defaultValue, type, validate } = insertFields[field];

            let value = data[field];

            if (ignore.includes(value)) {

               if (defaultValue) {

                  fields.push(replaceKey(field));

                  values.push(`'${defaultValue}'`);

                  continue;

               }

               if (allowNull === false) {

                  throw new TypeError(`${field}字段值不能为空`);

               } else {

                  fields.push(replaceKey(field));

                  values.push('DEFAULT');

                  continue;

               }

            }

            if (type(value)) {

               fields.push(replaceKey(field));

               value = validate(value);

               values.push(value);

            } else {

               throw new TypeError(`${field}字段值必须为${type.name}类型`);

            }

         }

      } else {

         throw new TypeError('data参数必须为对象类型');

      }

      fields.push('"createdAt"', '"updatedAt"');

      let date = dayjs().format();

      values.push(`'${date}'`, `'${date}'`);

      let sql = `INSERT INTO "${this.name}" (${fields}) VALUES (${values}) RETURNING *`

      this.logger(sql);

      let { rows } = await this.client.query(sql);

      return rows[0];

   }
   select(...fields) {

      const chain = new Find(this);

      chain.callback = function (data) {
         return data.rows;
      }

      return chain.select(...fields);

   }
   /**
    * 查询多条
    * @param  {...any} parameters 
    */
   find(...parameters) {

      const chain = new Find(this);

      if (parameters.length) {
         chain.where(...parameters);
      }

      chain.callback = function (data) {
         return data.rows;
      }

      return chain;

   }
   /**
    * 查询单条
    * @param  {...any} parameters 
    */
   findOne(...parameters) {

      const chain = new Find(this);

      if (parameters.length) {
         chain.where(...parameters);
      }

      chain.limit(1);

      chain.callback = function (data) {
         return data.rows[0];
      }

      return chain;

   }
   /**
    * 查询主键
    * @param {*} id 
    */
   findPk(id) {

      const chain = new Find(this);

      const where = {};

      const { primaryKey } = this;

      if (primaryKey) {
         where[primaryKey] = id;
      } else {
         throw new Error(`模型中未定义主键`);
      }

      chain.where(where);

      chain.limit(1);

      chain.callback = function (data) {
         return data.rows[0];
      }

      return chain;

   }
   /**
    * 查询数据总量
    */
   count() {

      const chain = new Find(this);

      chain.select($count('*'));

      chain.callback = function (data) {
         return data.rows[0].count;
      }

      return chain;

   }
   /**
    * 更新数据
    * @param {Object} data 更新数据
    */
   update(data) {

      const chain = new Update(this);

      chain.update(data);

      return chain;

   }
   /**
    * 对所有json、jsonb类型使用||合并操作符，而不是直接覆盖
    */
   updateMerge(data) {

      const chain = new Update(this);

      for (const name in data) {
         const value = data[name];
         if (value instanceof Object) {
            data[name] = $merge(value);
         }
      }

      chain.update(data);

      return chain;

   }
   /**
    * 删除数据
    * @param  {[Number]} ids 主键id队列
    */
   delete(...ids) {

      const chain = new Delete(this);

      const { primaryKey } = this;

      if (ids.length) {
         chain.where({ [primaryKey]: $in(...ids) });
      }

      return chain;

   }
}

module.exports = Model;