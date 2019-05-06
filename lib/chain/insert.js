'use strict';

const dayjs = require('dayjs');
const filter = require('../filter.js');

const { sqlKey } = filter;
const ignore = [undefined, null, ''];

class Insert {
   constructor(model) {

      this.name = model.name;
      this.logger = model.logger;
      this.client = model.client;

   }
   /**
    * 插入新数据
    * @param {*} data
    */
   async insert(data) {

      const fields = [];
      const values = [];

      if (typeof data === 'object') {

         const { insertFields } = this;

         for (const field in insertFields) {

            const { allowNull, defaultValue, type, validate, sqlValue } = insertFields[field];

            let value = data[field];

            if (ignore.includes(value)) {

               if (defaultValue) {

                  fields.push(sqlKey(field));

                  values.push(`'${defaultValue}'`);

                  continue;

               }

               if (allowNull === false) {

                  throw new TypeError(`${field}字段值不能为空`);

               } else {

                  fields.push(sqlKey(field));

                  values.push('DEFAULT');

                  continue;

               }

            }

            if (type(value)) {

               fields.push(sqlKey(field));

               if (validate) {
                  value = validate(value);
               }
               
               values.push(sqlValue(value));

            } else {

               throw new TypeError(`${field}字段值必须为${type.name}类型`);

            }

         }

      } else {

         throw new TypeError('data参数必须为对象类型');

      }

      fields.push('"createdAt"', '"updatedAt"');

      const date = dayjs().format();

      values.push(`'${date}'`, `'${date}'`);

      const sql = `INSERT INTO "${this.name}" (${fields}) VALUES (${values}) RETURNING *`

      this.logger(sql);

      const { rows } = await this.client.query(sql);

      return rows[0];

   }
}

module.exports = Insert;