'use strict'

const typea = require('typea');
const validator = require('validator');
const Type = require('./type');
const replace = require('./replace');

const { replaceValue } = replace;

/**
   * fields预处理
   */
module.exports = function (fields) {

   let model = this

   for (let field in fields) {

      let { type, validate, primaryKey } = fields[field];

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
                        // let options = validate[name];
                        if (validator[name](value) === false) {
                           throw new TypeError(`${name}('${value}')验证失败`)
                        }
                     }

                     return true

                  }

               }

            }

            // 为validate属性添加缺省函数
            else {

               fields[field].validate = function (value) {
                  return replaceValue(JSON.stringify(value));
               }

            }

         } else {

            throw new Error(`${field}字段类型${name}不存在`);

         }

         if (primaryKey) {
            model.primaryKey = field;
         }

      } else {

         throw new Error(`${field}字段类必须为函数类型`);

      }

   }

}