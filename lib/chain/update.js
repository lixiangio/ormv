'use strict'

const dayjs = require('dayjs');
const Base = require('./base');

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

      // 为多个逻辑条件指定id，防止重复属性被覆盖
      this.id = 0;

   }
   update(data) {

      const set = [];

      if (String(data) === '[object Object]') {

         let { fields } = this.model;

         for (let field in data) {

            let attribute = fields[field];

            if (attribute) {

               let { type, validate } = attribute;

               let value = data[field];

               if (ignore.includes(value)) {
                  set.push(`"${field}" = DEFAULT`);
                  continue
               }

               if (String(value) === '[object Object]') {

                  let callback = value[op]

                  // 操作符对象
                  if (callback) {

                     value = value.value

                     if (type(value)) {

                        value = validate(value)

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

      let date = dayjs().format();
      set.push(`"updatedAt" = '${date}'`);

      this.set = set.join(", ");

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

module.exports = Update