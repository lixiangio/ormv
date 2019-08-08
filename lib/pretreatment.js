'use strict';

const typea = require('typea');
const Type = require('./type.js');
const filter = require('./filter.js');

const { timestamp } = Type;
const { sqlValue } = filter;

const OBJECT = {
   'json': true,
   'jsonb': true,
   'object': true,
   'array': true,
}

/**
 * model实例预处理
 */
function pretreatment() {

   const { name: modelName, fields, allAliasIndex, allPathIndex, insertFields } = this;

   for (const field in fields) {

      const options = fields[field];

      const { type, primaryKey, defaultValue, validate } = options;

      if (typeof type === 'function') {

         const { name } = type;

         if (Type[name]) {

            // 对象类型，使用typea.js验证器
            if (OBJECT[name]) {

               if (validate) {

                  const schema = typea.schema(validate);

                  options.validate = function (value) {

                     const { error, data } = schema(value);

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

            throw new Error(`${field}字段类型${name}不存在`);

         }

         if (primaryKey) {

            this.primaryKey = field;

         } else {

            insertFields[field] = options;

         }

         const tableField = `"${modelName}"."${field}"`;

         allAliasIndex[field] = tableField;
         allPathIndex[`${modelName}.${field}`] = tableField;

      } else {

         throw new Error(`${field}字段的type值必须为函数类型`);

      }

      // 预先将defaultValue值为对象或数组类型序列化为字符串
      if (defaultValue) {

         if (typeof defaultValue === 'object') {

            options.defaultValue = JSON.stringify(defaultValue);

         }

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

}

module.exports = pretreatment;