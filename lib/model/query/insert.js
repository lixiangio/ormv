'use strict';

const ignore = [undefined, null, ''];

class Insert {
   constructor(model) {

      const { name, schemaName, client, aliasIndex, insertFields } = model;

      this.model = model;
      this.client = client;
      this.logger = client.logger;
      this.aliasIndex = aliasIndex;
      this.insertFields = insertFields;

      this.sql = [`INSERT INTO `, `"${schemaName}"."${name}"`, ` (`, , `) VALUES (`, , `) RETURNING *`];

   }
   /**
    * 插入新数据
    * @param {Object} data
    */
   insert(data) {

      if (typeof data !== 'object') {
         throw new TypeError('data参数必须为对象类型');
      }

      const keys = [];
      const values = [];

      const { insertFields } = this;

      for (const name in insertFields) {

         const { sqlKey, sqlValue, allowNull } = insertFields[name];

         keys.push(sqlKey);

         let value = data[name];

         // 空值
         if (ignore.includes(value)) {

            if (allowNull === false) {

               throw new TypeError(`${sqlKey}字段值不允许为空`);

            } else {

               values.push('DEFAULT'); // 空值用DEFAULT填充

            }

         } else {

            // 函数运算符，使用内置序列化验证器
            if (typeof value === 'function') {

               value = value(name);

            } else {

               const result = sqlValue(value);

               if (result.error) {
                  throw new TypeError(result.error);
               }

               value = result.value;

            }

            values.push(value);

         }

      }

      this.sql[3] = keys.join(',');

      this.sql[5] = values.join(',');

      return this;

   }
   promise() {

      const sql = this.sql.join('');

      this.logger(sql);

      return this.client.query(sql).then(data => {
         return data.rows[0];
      })

   }
   /**
    * Promise对象then()方法
    * @param {Function} resolve 
    * @param {Function} reject 
    */
   then(resolve, reject) {

      return this.promise().then(resolve, reject);

   }
   catch(reject) {

      return this.promise().catch(reject);

   }
}

module.exports = Insert;
