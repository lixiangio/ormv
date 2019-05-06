'use strict';

const fieldsPretreatment = require('./fields.js');
const Insert = require('./chain/insert.js');
const Find = require('./chain/find.js');
const Update = require('./chain/update.js');
const Delete = require('./chain/delete.js');
const Sync = require('./sync.js');
const Op = require('./operator/');

const { $merge, $in } = Op;

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

      const chain = new Insert(this);

      return chain.insert(data);

   }
   select(...fields) {

      const chain = new Find(this);

      chain._result = function (data) {
         return data.rows;
      }

      return chain.select(...fields);

   }
   /**
    * 查询多条
    * @param  {...any} parameter 
    */
   find(parameter) {

      const chain = new Find(this);

      if (parameter) {
         chain.where(parameter);
      }

      chain._result = function (data) {
         return data.rows;
      }

      return chain;

   }
   /**
    * 查询单条
    * @param  {Object} parameter
    */
   findOne(parameter) {

      const chain = new Find(this);

      if (parameter) {
         chain.where(parameter);
      }

      chain.limit(1);

      chain._result = function (data) {
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

      chain._result = function (data) {
         return data.rows[0];
      }

      return chain;

   }
   /**
    * 查询数据总量
    */
   count() {

      const chain = new Find(this);

      chain.count();

      chain._result = function (data) {
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