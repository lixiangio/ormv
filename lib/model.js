'use strict'

const dayjs = require('dayjs');
const fieldsPretreatment = require('./fields');
const replace = require('./replace');
const Chain = require('./chain');
const Sync = require('./sync');

const { replaceKey } = replace;

class Model extends Sync {
   /**
    * 
    * @param {Object} options 
    */
   constructor(options) {

      super();

      let { client, fields, name } = options;

      this.client = client;
      this.logger = client.logger;

      this.fields = fields;

      let fieldsKeys = Object.keys(fields).map(field => `"${field}"`);

      this.fieldsKeys = fieldsKeys;

      this.name = name.trim();

      fieldsPretreatment.call(this);

   }
   /**
    * 创建函数链实例
    */
   chain() {

      return new Chain(this);

   }
   /**
    * 查询sql函数链
    */
   select(...fields) {

      let chain = new Chain(this);

      chain.select(...fields);

      return chain;

   }
   leftJoin(module) {

      let chain = new Chain(this);

      chain.leftJoin(module);

      return chain

   }
   innerJoin(module) {

      let chain = new Chain(this);

      chain.innerJoin(module);

      return chain

   }
   where(...options) {

      let chain = new Chain(this);

      chain.where(...options);

      return chain

   }
   group(...options) {

      let chain = new Chain(this);

      chain.group(...options);

      return chain

   }
   order(options) {

      let chain = new Chain(this);

      chain.order(options);

      return chain

   }
   limit(count) {

      let chain = new Chain(this);

      chain.limit(count);

      return chain

   }
   offset(count) {

      let chain = new Chain(this);

      chain.offset(count);

      return chain

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

         for (let field in this.fields) {

            let { allowNull, type, validate, } = this.fields[field];
            let value = data[field];

            if (value === undefined) {

               if (allowNull === false) {
                  throw new TypeError(`${field}字段不允许为空`);
               }

            } else {

               if (type(value)) {

                  fields.push(replaceKey(field));

                  value = validate(value);

                  values.push(value);

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

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
   async find() {

      let chain = new Chain(this);

      return await chain.find();

   }
   async findOne() {

      let chain = new Chain(this);

      return await chain.findOne();

   }
   async findPk() {

      let chain = new Chain(this);

      return await chain.findPk();

   }
   async count() {

      let chain = new Chain(this);

      return await chain.count();

   }
   /**
    * 
    * @param {Object} options 查询选项
    * @param {Object} data 更新数据
    */
   async update(data) {

      let chain = new Chain(this);

      return await chain.update(data);

   }
   /**
    * 
    * @param {Object} options 查询选项
    */
   async delete() {

      let chain = new Chain(this);

      return await chain.delete();

   }
}

module.exports = Model