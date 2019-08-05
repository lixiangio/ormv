'use strict';

const pretreatment = require('./pretreatment.js');
const Insert = require('./chain/insert.js');
const Find = require('./chain/find.js');
const Update = require('./chain/update.js');
const Delete = require('./chain/delete.js');
const Sync = require('./sync.js');
const Op = require('./operator/');

const { $merge, $in } = Op;
const { toString } = Object.prototype;

class Model extends Sync {
   /**
    * @param {Object} options 
    */
   constructor(options) {

      super();

      const { name, client, fields } = options;

      this.name = name.trim();
      this.client = client;
      this.fields = fields;
      this.fieldsKeys = Object.keys(fields).map(field => `"${field}"`);

      pretreatment(this);

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
    * @param  {Object} condition 
    */
   find(condition) {

      const chain = new Find(this);

      if (condition) {
         chain.where(condition);
      }

      chain._result = function (data) {
         return data.rows;
      }

      return chain;

   }
   /**
    * 查询单条
    * @param  {Object} condition
    */
   findOne(condition) {

      const chain = new Find(this);

      if (condition) {
         chain.where(condition);
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

      const { primaryKey } = this;

      if (primaryKey) {
         chain.where({ [primaryKey]: id });
      } else {
         throw new Error(`模型中未定义主键`);
      }

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

      return chain.count();

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
         
         if (toString.call(value) === '[object Object]') {
            data[name] = $merge(value);
         }

      }

      chain.update(data);

      return chain;

   }
   /**
    * 更新数据
    * @param {Number} id 主键id值
    * @param {Object} data 更新数据
    */
   updatePK(id, data) {

      const chain = new Update(this);

      chain.update(data);

      const { primaryKey } = this;

      if (primaryKey) {
         chain.where({ [primaryKey]: id });
      } else {
         throw new Error(`模型中未定义主键`);
      }

      return chain;

   }
   /**
    * 删除数据
    * @param  {[Number]} ids 主键id队列
    */
   delete(condition) {

      const chain = new Delete(this);

      if (condition) {
         chain.where(condition);
      }

      return chain;

   }
   /**
    * 删除指定主键的数据
    * @param  {[Number]} ids 主键id队列
    */
   deletePk(...ids) {

      const chain = new Delete(this);

      const { primaryKey } = this;

      const { length } = ids;

      if (length === 1) {
         chain.where({ [primaryKey]: ids[0] });
      } else if (length > 1) {
         chain.where({ [primaryKey]: $in(...ids) });
      }

      return chain;

   }
}

module.exports = Model;