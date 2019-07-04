'use strict';

const typea = require('typea');
const filter = require('./filter.js');
const Type = require('./type.js');

const { sqlValue } = filter;
const { TIMESTAMP } = Type;

const OBJECT = {
   'json': true,
   'jsonb': true,
   'object': true,
   'array': true,
}

/**
 * model实例预处理
 * @param {object} model  model实例
 */
function pretreatment(model) {

   const { fields } = model;
   const insertFields = {};

   for (const field in fields) {

      const attribute = fields[field];

      const { type, primaryKey, defaultValue, validate } = attribute;

      if (typeof type === 'function') {

         const { name } = type;

         if (Type[name]) {

            // 对象类型，使用typea.js验证器
            if (OBJECT[name]) {

               if (validate) {

                  const schema = typea.schema(validate);

                  attribute.validate = function (value) {

                     const { error, data } = schema(value);

                     if (error) {
                        throw new TypeError(`${field}.${error}`);
                     }

                     return data;

                  }

               }

               attribute.sqlValue = function (data) {

                  return sqlValue(JSON.stringify(data));

               };

            }

            // 非json类型
            else {

               attribute.sqlValue = sqlValue;

            }

         } else {

            throw new Error(`${field}字段类型${name}不存在`);

         }

         if (primaryKey) {

            model.primaryKey = field;

         } else {

            insertFields[field] = attribute;

         }

      } else {

         throw new Error(`${field}字段的type值必须为函数类型`);

      }

      // 预先将defaultValue值为对象或数组类型序列化为字符串
      if (defaultValue) {

         if (typeof defaultValue === 'object') {

            attribute.defaultValue = JSON.stringify(defaultValue);

         }

      }

   }

   fields.createdAt = {
      type: TIMESTAMP,
      sqlValue
   };

   fields.updatedAt = {
      type: TIMESTAMP,
      sqlValue
   };

   model.insertFields = insertFields;

}

module.exports = pretreatment;