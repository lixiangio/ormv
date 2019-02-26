'use strict'

const Op = require('./operator');
const replace = require('./replace');

const { replaceKey } = replace;

const { $and, $or } = Op

const op = Symbol.for('op');

/**
 * select函数链
 */
module.exports = class {
   constructor(model, data) {

      this.model = model;
      this.logger = model.logger;
      this.client = model.client;
      this.data = data;

      this.queue = [];

   }
   where(options) {

      options = $and(options);

      let where = ''
      if (String(options) === '[object Object]') {
         let values = options[op];
         if (Array.isArray(values)) {
            values.shift();
            if (values.length) {
               where = ' WHERE ' + values.join('')
            }
         } else {
            where = ''
         }
      } else {
         where = ''
      }

      this.queue.push({
         grade: 20,
         value: where
      })

      return this

   }
   and(options) {

      let value = $and(options);
      this.queue.push({
         grade: 21,
         value
      })

      return this

   }
   or(options) {

      options = $or(options);

      let where = ''
      if (String(options) === '[object Object]') {
         let values = options[op];
         if (Array.isArray(values)) {
            values.shift();
            if (values.length) {
               where = ' OR ' + values.join('')
            }
         } else {
            where = ''
         }
      } else {
         where = ''
      }

      this.queue.push({
         grade: 21,
         value: where
      })

      return this

   }
   async send() {

      let { where } = options;

      let set = [];

      if (String(data) === '[object Object]') {

         for (let field in data) {

            let attribute = this.fields[field];

            if (attribute) {

               let { type, validate } = attribute;

               let value = data[field];

               if (String(value) === '[object Object]') {

                  let callback = value[op]

                  // 操作符对象
                  if (callback) {

                     value = value.value

                     if (type(value)) {

                        value = validate(value)

                        value = callback(field, value);

                        set.push(`${replaceKey(field)} = ${value}`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

                  // 普通JSON对象，直接序列化为字符串
                  else {

                     if (type(value)) {

                        value = validate(value)

                        set.push(`${replaceKey(field)} = '${value}'`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

               }

               // 非对象类型
               else if (type(value)) {

                  validate(value);

                  value = replaceValue(value);

                  set.push(`${replaceKey(field)} = '${value}'`);

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            } else {

               throw new Error(`${this.name}模型中找不到${field}字段`);

            }

         }

         set = set.join(", ")

      } else {

         throw new Error(`data参数值必须为Object类型`);

      }

      where = whereAction(where).value

      let sql = `UPDATE "${this.name}" SET ${set}${where}`;

      this.logger(sql);

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
}