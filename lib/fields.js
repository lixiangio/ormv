'use strict'

const typea = require('typea');
const validator = require('validator');
const filter = require('./filter.js');
const Type = require('./type.js');

const { sqlValue } = filter;
const { TIMESTAMP } = Type;

/**
   * model fields预处理
   */
module.exports = function (model) {

   const { fields } = model;
   const insertFields = {};

   for (const field in fields) {

      const item = fields[field];

      const { type, validate, primaryKey, defaultValue } = item;

      if (typeof type === 'function') {

         const { name } = type;

         if (Type[name]) {

            // json类型使用typea.js验证器
            if (['JSONB', 'JSON'].includes(name)) {

               if (validate) {

                  const schema = typea.schema(validate);

                  fields[field].validate = function (value) {

                     const { error, data } = schema(value);

                     if (error) {
                        throw new TypeError(`${field}.${error}`);
                     }

                     return data;

                  }

               }

               fields[field].sqlValue = function (data) {

                  return sqlValue(JSON.stringify(data));

               };

            }

            // 非json类型使用validator.js验证器
            else {

               fields[field].validate = function (value) {

                  for (const name in validate) {
                     if (validator[name](String(value)) === false) {
                        throw new TypeError(`validator.${name}('${value}')验证失败`);
                     }
                  }

                  return value;

               }

               fields[field].sqlValue = sqlValue;

            }

         } else {

            throw new Error(`${field}字段类型${name}不存在`);

         }

         if (primaryKey) {

            model.primaryKey = field;

         } else {

            insertFields[field] = item;

         }

      } else {

         throw new Error(`${field}字段的type值必须为函数类型`);

      }

      // 预先将defaultValue值为对象或数组类型序列化为字符串
      if (defaultValue) {

         if (typeof defaultValue === 'object') {
            item.defaultValue = JSON.stringify(defaultValue);
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