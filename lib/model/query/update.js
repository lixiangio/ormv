'use strict';

const dayjs = require('dayjs');
const Base = require('./base.js');

const op = Symbol.for('op');
const ignore = [undefined, null, ''];

class Update extends Base {
   constructor(model) {

      super();

      const { client, fields, aliasIndex } = model;

      this.client = client;
      this.logger = client.logger;
      this.fields = fields;
      this.aliasIndex = aliasIndex;
      this.model = model;
      
      this.sql = {
         update: {
            key: 'UPDATE',
            value: `"${model.name}"`
         },
         set: undefined,
         where: undefined,
         return: undefined,
      }

   }
   update(data) {

      const set = [];

      if (data instanceof Object) {

         const { fields } = this;

         delete data.createdAt;
         delete data.updatedAt;

         for (const field in data) {

            const attribute = fields[field];

            if (attribute) {

               let value = data[field];

               if (ignore.includes(value)) {
                  set.push(`"${field}" = DEFAULT`);
                  continue;
               }

               const { type, validate, sqlValue } = attribute;

               const operator = value[op];

               // 操作符对象
               if (operator) {

                  value = value.value;

                  if (validate) {
                     value = validate(value);
                  }

                  const sql = operator(field, value);

                  set.push(`"${field}" = ${sql}`);

               }

               // 非操作符类型
               else if (type(value)) {

                  // 对象类型
                  if (value instanceof Object) {

                     if (validate) {
                        value = validate(value);
                     }

                     const stringValue = sqlValue(value);

                     set.push(`"${field}" = ${stringValue}`);

                  }

                  // 非对象类型
                  else {

                     if (validate) validate(value);

                     const stringValue = sqlValue(value);

                     set.push(`"${field}" = ${stringValue}`);

                  }

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            } else {

               throw new Error(`${field}字段不存在`);
               
            }

         }

      } else {

         throw new Error(`data参数值必须为Object类型`);

      }

      const date = dayjs().format();

      set.push(`"updatedAt" = '${date}'`);

      this.sql.set = {
         key: 'SET',
         value: set.join(", ")
      };

      return this;

   }
   /**
    * 返回update后的结果
    */
   return() {

      this.sql.return = {
         key: 'RETURNING',
         value: '*'
      };

      this._result = function (data) {
         return data.rows[0];
      }

      return this;

   }
   /**
    * 返回结果代理函数
    * @param {*} data 
    */
   _result(data) {

      const { rowCount } = data;

      return { rowCount };

   }
   promise() {

      const { sql } = this;

      if (this.logic.length) {
         sql.where = {
            key: 'WHERE',
            value: this.logic.join('')
         };
      }


      let sqlString = '';

      for (const name in sql) {
         const options = sql[name];
         if (options) {
            const { key, value } = options;
            sqlString += `${key} ${value} `;
         }
      }

      this.logger(sqlString);

      return this.client.query(sqlString).then(this._result);

   }
}

module.exports = Update;