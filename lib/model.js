'use strict'

const dayjs = require('dayjs');
const fieldsPretreatment = require('./fields');
const replace = require('./replace');
const Find = require('./chain/find');
const Update = require('./chain/update');
const Delete = require('./chain/delete');
const Sync = require('./sync');
const Op = require('./operator');

const { replaceKey } = replace;
const ignore = [undefined, null, ''];
const { $count } = Op;

class Model extends Sync {
   /**
    * @param {Object} options 
    */
   constructor(options) {

      super();

      let { name, client, fields } = options;

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

      let fields = [];
      let values = [];

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

      let chain = new Find(this);

      chain.callback = function (data) {
         return data.rows;
      }

      return chain.select(...fields);

   }
   find(...parameters) {

      let chain = new Find(this);

      if (parameters.length) {
         chain.where(...parameters);
      }

      chain.callback = function (data) {
         return data.rows;
      }

      return chain;

   }
   findOne(...parameters) {

      let chain = new Find(this);

      if (parameters.length) {
         chain.where(...parameters);
      }

      chain.limit(1);

      chain.callback = function (data) {
         return data.rows[0];
      }

      return chain;

   }
   findPk(id) {

      let chain = new Find(this);

      let where = {};

      let { primaryKey } = this

      if (primaryKey) {
         where[primaryKey] = id
      } else {
         where.id = id
      }

      chain.where(where);

      chain.limit(1);

      chain.callback = function (data) {
         return data.rows[0];
      }

      return chain;

   }
   count() {

      const chain = new Find(this);

      chain.select($count('*'));

      chain.callback = function (data) {
         return data.rows[0].count;
      }

      return chain;

   }
   /**
    * 
    * @param {Object} options 查询选项
    * @param {Object} data 更新数据
    */
   update(data) {

      const chain = new Update(this);

      chain.update(data);

      return chain;

   }
   /**
    * 
    * @param {Object} options 查询选项
    */
   delete(...parameters) {

      const chain = new Delete(this);

      if (parameters.length) {
         chain.where(...parameters);
      }

      return chain;

   }
}

module.exports = Model