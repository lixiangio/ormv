'use strict';

const Base = require('./base.js');
const proxyPromise = require('../promise.js');

const directions = {
   'desc': true,
   'asc': true
};

class Find extends Base {
   constructor(model) {

      super();

      const { client, fields, fieldIndex } = model;

      this.client = client;
      this.logger = client.logger;
      this.fields = fields;
      this.fieldIndex = fieldIndex;

      const { find } = model.sql;

      this.sql = {
         ...find,
         "where": undefined,
         "group": undefined,
         "order": undefined,
         "offset": undefined,
         "limit": undefined,
      };

   }
   select(...select) {

      if (select.length) {

         const fields = [];
         const { fieldIndex } = this;

         for (const field of select) {

            if (typeof field === 'string') {

               const value = fieldIndex[field];

               if (value) {
                  fields.push(value);
               } else {
                  throw new Error(`${field}字段不存在`);
               }

            } else if (field.alias) {

               const { name, alias } = field;

               const value = fieldIndex[name];
               if (value) {
                  fields.push(`${value} AS "${alias}"`);
               } else {
                  throw new Error(`${name}字段不存在`);
               }

            }

         }

         this.sql.select = {
            key: 'SELECT',
            value: fields
         };

      }

      return this;

   }
   group(...fields) {

      const { fieldIndex } = this;
      
      fields = fields.map(name => {
         const value = fieldIndex[name];
         if (value) {
            return value;
         } else {
            throw new Error(`${name}字段不存在`);
         }
      });

      this.sql.group = {
         key: 'GROUP BY',
         value: fields
      };

      return this;

   }
   order(options) {

      const list = [];

      const { fieldIndex } = this;

      for (const field in options) {

         const direction = options[field];

         if (directions[direction] === true) {
            const value = fieldIndex[field];
            if (value) {
               list.push(`${value} ${direction}`);
            } else {
               throw new Error(`${field}字段不存在`);
            }
         }

      }

      this.sql.order = {
         key: 'ORDER BY',
         value: list.join(", ")
      };

      return this;

   }
   /**
    * 定义列起的始位置
    * @param {Number} value 
    */
   offset(value) {

      if (value) {
         this.sql.offset = {
            key: 'OFFSET',
            value: Number(value)
         };
      }

      return this;

   }
   /**
    * 限制返回结果数量
    * @param {Number} value 
    */
   limit(value) {

      if (value) {
         if (value) {
            this.sql.offset = {
               key: 'LIMIT',
               value: Number(value)
            };
         }
      }

      return this;

   }
   /**
    * 在已有find实例上创建新的查询
    */
   count() {

      const { select, from, join, on, where } = this.sql;

      const sqlCopy = { select, from, join, on, where };

      sqlCopy.select = {
         key: 'SELECT',
         value: `count('*')`
      };

      if (this.logic.length) {
         sqlCopy.where = {
            key: 'WHERE',
            value: this.logic.join('')
         }
      }

      let sqlString = '';

      for (const name in sqlCopy) {
         const options = sqlCopy[name];
         if (options) {
            const { key, value } = options;
            sqlString += `${key} ${value} `
         }
      }

      return new proxyPromise((resolve, reject) => {

         this.logger(sqlString);

         return this.client.query(sqlString).then(data => {

            return resolve(data.rows[0].count);

         }, reject);

      });

   }
   /**
    * promise代理方法
    */
   promise() {

      const sqlCopy = { ...this.sql };

      if (this.logic.length) {
         sqlCopy.where = {
            key: 'WHERE',
            value: this.logic.join('')
         }
      }

      let sqlString = '';

      for (const name in sqlCopy) {
         const options = sqlCopy[name];
         if (options) {
            const { key, value } = options;
            sqlString += `${key} ${value} `;
         }
      }

      this.logger(sqlString);

      return this.client.query(sqlString).then(this._result);

   }
}

module.exports = Find;