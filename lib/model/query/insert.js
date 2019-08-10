'use strict';

const dayjs = require('dayjs');

const ignore = [undefined, null, ''];

class Insert {
   constructor(model) {

      const { name, client, aliasIndex, insertFields } = model;

      this.client = client;
      this.logger = client.logger;
      this.aliasIndex = aliasIndex;
      this.insertFields = insertFields;

      this.sql = [`INSERT INTO "${name}" (`, , `) VALUES (`, , `) RETURNING *`];

   }
   /**
    * 插入新数据
    * @param {Object} data
    */
   async insert(data) {

      if (typeof data !== 'object') {
         throw new TypeError('data参数必须为对象类型');
      }

      const keys = [];
      const values = [];

      const { insertFields } = this;

      for (const field in insertFields) {

         const { type, allowNull, defaultValue, validate, sqlValue } = insertFields[field];

         let value = data[field];

         // 空值
         if (ignore.includes(value)) {

            if (defaultValue) {

               keys.push(`"${field}"`);

               values.push(`'${defaultValue}'`);

               continue;

            }

            if (allowNull === false) {

               throw new TypeError(`${field}字段值不允许为空`);

            } else {

               keys.push(`"${field}"`);

               values.push('DEFAULT');

               continue;

            }

         }

         // 非空
         if (type(value)) {

            keys.push(`"${field}"`);

            if (validate) {
               value = validate(value);
            }

            values.push(sqlValue(value));

         } else {

            throw new TypeError(`${field}字段值必须为${type.name}类型`);

         }

      }

      const date = dayjs().format();

      keys.push('"createdAt"', '"updatedAt"');

      values.push(`'${date}'`, `'${date}'`);

      this.sql[1] = keys.join(',');

      this.sql[3] = values.join(',');

      const sql = this.sql.join('');

      this.logger(sql);

      const { rows } = await this.client.query(sql);

      return rows[0];

   }
}

module.exports = Insert;