'use strict'

const fieldsPretreatment = require('./fields');
const replace = require('./replace');
const Queue = require('./queue');
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

      fieldsPretreatment.call(this, fields);

   }
   /**
    * 查询sql函数链
    */
   select(...fields) {

      let queue = new Queue(this);

      queue.select(...fields);

      return queue

   }
   leftJoin(module) {

      let queue = new Queue(this);

      queue.leftJoin(module);

      return queue

   }
   innerJoin(module) {

      let queue = new Queue(this);

      queue.innerJoin(module);

      return queue

   }
   where(...options) {

      let queue = new Queue(this);

      queue.where(...options);

      return queue

   }
   group(...options) {

      let queue = new Queue(this);

      queue.group(...options);

      return queue

   }
   order(options) {

      let queue = new Queue(this);

      queue.order(options);

      return queue

   }
   limit(count) {

      let queue = new Queue(this);

      queue.limit(count);

      return queue

   }
   offset(count) {

      let queue = new Queue(this);

      queue.offset(count);

      return queue

   }
   /**
    * 插入新数据
    * @param {*} data
    */
   async insert(data) {

      let fields = [];
      let values = [];

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
   async find() {

      let queue = new Queue(this);

      return await queue.find();

   }
   async findOne() {

      let queue = new Queue(this);

      return await queue.findOne();

   }
   async findPk() {

      let queue = new Queue(this);

      return await queue.findPk();

   }
   async count() {

      let queue = new Queue(this);

      return await queue.count();

   }
   /**
    * 
    * @param {Object} options 查询选项
    * @param {Object} data 更新数据
    */
   async update(data) {

      let queue = new Queue(this);

      return await queue.update(data);

   }
   /**
    * 
    * @param {Object} options 查询选项
    */
   async delete() {

      let queue = new Queue(this);

      return await queue.delete();

   }
   async sync(mode) {

      if (!mode) {
         return await this.default()
      } else if (mode === 'increment') {
         return await this.increment()
      } else if (mode === 'rebuild') {
         return await this.rebuild()
      }

   }
}

module.exports = Model