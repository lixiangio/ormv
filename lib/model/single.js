'use strict';

const typea = require('typea');
const Type = require('../type.js');
const filter = require('../filter.js');
const Op = require('../operator/');
const Sync = require('./_sync.js');
const Insert = require('./query/insert.js');
const Find = require('./query/find.js');
const Update = require('./query/update.js');
const Delete = require('./query/delete.js');

const { timestamp } = Type;
const { sqlValue } = filter;
const { $merge, $in } = Op;
const { toString } = Object.prototype;

const OBJECT = {
   'json': true,
   'jsonb': true,
   'object': true,
   'array': true,
   'range': true,
}

/**
 * 模型类，实例通常会被重复调用，不允许变更其成员属性
 */
class Model extends Sync {
   /**
    * @param {Object} client 客户端实例
    * @param {Object} options 模型配置参数
    */
   constructor(client, options) {

      super();

      const { name, fields } = options;

      this.name = name;
      this.client = client;
      this.logger = client.logger;
      this.fields = fields;
      this.aliasIndex = {};
      this.insertFields = {};

      for (const field in fields) {

         let options = fields[field];

         if (typeof options === 'object') {

            const { type, primaryKey, default: Default } = options;

            if (typeof type !== 'function') {
               throw new Error(`${field}字段的type值必须为函数类型`);
            }

            if (primaryKey) {
               this.primaryKey = field;
            } else {
               this.insertFields[field] = options;
            }

            // 如果default值为对象或数组类型，预先将其序列化为字符串
            if (Default) {
               if (typeof Default === 'object') {
                  options.Default = JSON.stringify(Default);
               } else {
                  options.Default = Default;
               }
            }

         } else if (typeof options === 'function') {

            options = { type: options };

            fields[field] = options;

            this.insertFields[field] = options;

         } else {

            throw new Error(`${field}字段值必须为对象或函数类型`);

         }

         const typeName = options.type.name;

         if (Type[typeName]) {

            // 对象类型，使用typea.js验证器
            if (OBJECT[typeName]) {

               const { schema } = options;

               if (schema) {

                  const validator = typea(schema);

                  options.validate = function (value) {

                     const { error, data } = validator.strictVerify(value);

                     if (error) {
                        throw new TypeError(`${field}.${error}`);
                     }

                     return data;

                  }

               }

               options.sqlValue = function (data) {

                  return sqlValue(JSON.stringify(data));

               };

            }

            // 非json类型
            else {

               options.sqlValue = sqlValue;

            }

         } else {

            throw new Error(`“${field}”字段“${typeName}”类型不存在`);

         }

      }

      fields.createdAt = {
         type: timestamp,
         sqlValue
      };

      fields.updatedAt = {
         type: timestamp,
         sqlValue
      };

      for (const field in fields) {
         this.aliasIndex[field] = `"${field}"`;
      }

   }
   /**
    * sql对象实例
    */
   _sqlcb() {

      return {
         "select": {
            key: "SELECT",
            value: "*",
         },
         "from": {
            "key": "FROM",
            "value": `"${this.name}"`
         },
      }

   }
   /**
    * 插入新数据
    * @param {Object} data 
    */
   insert(data) {

      const chain = new Insert(this);

      return chain.insert(data);

   }
   /**
    * select查询，等同于find().select()
    * @param  {Array} fields 选择字段
    */
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
    * @param {Number} id 
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
   updatePk(id, data) {

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
