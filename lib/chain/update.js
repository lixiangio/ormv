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
      this.queue = {};

      this.id = 0; // 为多个逻辑条件使用递增id，防止重复属性被覆盖

   }
   update(data) {

      const set = [];

      if (data instanceof Object) {

         const { fields } = this.model;

         for (const field in data) {

            const attribute = fields[field];

            if (attribute) {

               const { type, validate } = attribute;

               let value = data[field];

               if (ignore.includes(value)) {
                  set.push(`"${field}" = DEFAULT`);
                  continue;
               }

               if (value instanceof Object) {

                  const callback = value[op];

                  // 操作符对象
                  if (callback) {

                     value = value.value;

                     if (type(value)) {

                        value = validate(value);

                        value = callback(field, value);

                        set.push(`"${field}" = ${value}`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

                  // 普通JSON对象，直接序列化为字符串
                  else {

                     if (type(value)) {

                        value = validate(value);

                        set.push(`"${field}" = ${value}`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

               }

               // 非对象类型
               else if (type(value)) {

                  value = validate(value);

                  set.push(`"${field}" = ${value}`);

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

      this.set = set.join(", ");

      return this;

   }
   promise(resolve, reject) {

      const query = this._merge();

      const sql = `UPDATE "${this.model.name}" SET ${this.set}${query} RETURNING *`;

      this.logger(sql);

      return this.client.query(sql).then(data => {
         return resolve(data.rows[0]);
      }, reject);

   }
}

module.exports = Update;