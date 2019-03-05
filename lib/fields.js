'use strict'

const typea = require('typea');
const validator = require('validator');
const replace = require('./replace');
const Type = require('./type');

const { replaceValue } = replace;

const { TIMESTAMP } = Type;

/**
   * fields预处理
   */
module.exports = function (model) {

   let { fields } = model;

   let insertFields = {}

   for (let field in fields) {

      let item = fields[field];

      let { type, validate, primaryKey } = item;

      if (typeof type === 'function') {

         let { name } = type
         if (Type[name]) {

            if (validate) {

               // json类型使用typea.js验证器
               if (['JSONB', 'JSON'].includes(name)) {

                  const schema = typea.schema(validate);

                  fields[field].validate = function (value) {

                     const { error, data } = schema.strict(value);

                     if (error) {
                        throw new TypeError(`${field}.${error}`)
                     }

                     return replaceValue(JSON.stringify(data));

                  }

               }

               // 非json类型使用validator.js验证器
               else {

                  fields[field].validate = function (value) {

                     for (let name in validate) {
                        if (validator[name](String(value)) === false) {
                           throw new TypeError(`validator.${name}('${value}')验证失败`);
                        }
                     }

                     return replaceValue(value);

                  }

               }

            }

            // 为validate属性添加缺省函数
            else {

               fields[field].validate = function (value) {
                  if (typeof value === 'object') {
                     return replaceValue(JSON.stringify(value));
                  } else {
                     return replaceValue(value);
                  }
               }

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

         throw new Error(`${field}字段类必须为函数类型`);

      }

   }

   model.insertFields = insertFields;

   fields.createdAt = { type: TIMESTAMP }

   fields.updatedAt = { type: TIMESTAMP }

}