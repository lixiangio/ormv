'use strict';

const dayjs = require('dayjs');
const Base = require('./base.js');

const op = Symbol.for('op');
const ignore = [undefined, null, ''];

class Update extends Base {
   constructor(model) {

      super();

      this.model = model;
      this.logger = model.logger;
      this.client = model.client;
      this.fields = model.fieldsKeys;
      this.sql = [`UPDATE "${model.name}" SET `];

   }
   update(data) {

      const set = [];

      if (data instanceof Object) {

         const { fields } = this.model;

         delete data.createdAt;
         delete data.updatedAt;

         for (const field in data) {

            const attribute = fields[field];

            if (attribute) {

               let item = data[field];

               if (ignore.includes(item)) {
                  set.push(`"${field}" = DEFAULT`);
                  continue;
               }

               const { type, validate, sqlValue } = attribute;

               if (type(item)) {

                  if (item instanceof Object) {

                     const operator = item[op];

                     // 节点为操作符对象
                     if (operator) {

                        let { value } = item;

                        if (validate) {
                           value = validate(value);
                        }

                        const sql = operator(field, value);

                        set.push(`"${field}" = ${sql}`);

                     }

                     // 节点为普通JSON对象，直接序列化为字符串
                     else {

                        if (validate) {
                           item = validate(item);
                        }

                        const stringValue = sqlValue(item);

                        set.push(`"${field}" = ${stringValue}`);

                     }

                  }

                  // 非对象类型
                  else {

                     if (validate) validate(item);

                     const stringValue = sqlValue(item);

                     set.push(`"${field}" = ${stringValue}`);

                  }

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            }

         }

      } else {

         throw new Error(`data参数值必须为Object类型`);

      }

      const date = dayjs().format();

      set.push(`"updatedAt" = '${date}'`);

      this.sql[1] = set.join(", ");

      return this;

   }
   /**
    * 返回update后的结果
    */
   return() {

      this.sql[36] = " RETURNING *";

      this._result = function (data) {
         return data.rows[0];
      }

      return this;

   }
   /**
    * 默认返回结果代理函数
    * @param {*} data 
    */
   _result(data) {

      const { rowCount } = data;
      
      return { rowCount };

   }
   promise(resolve, reject) {

      this.sql.splice(10, 0, ...this.logic);

      const sql = this.sql.join('');

      this.logger(sql);

      return this.client.query(sql).then(data => {
         return resolve(this._result(data));
      }, reject);

   }
}

module.exports = Update;