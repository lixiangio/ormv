'use strict'

const typea = require('typea');
const validator = require('validator');
const replace = require('./replace');
const Type = require('./type');


/**
   * attributes预处理
   */
module.exports = function (attributes) {

   let model = this

   for (let field in attributes) {

      let { type, validate, primaryKey } = attributes[field];

      if (typeof type === 'function') {

         let { name } = type
         if (Type[name]) {

            if (validate) {

               // json类型使用typea.js验证器
               if (['JSONB', 'JSON'].includes(name)) {

                  const schema = typea.schema(validate);
                  attributes[field].validate = function (value) {
                     const { error, data } = schema.strict(value)
                     if (error) {
                        throw new TypeError(`${field}.${error}`)
                     }
                     return replace(JSON.stringify(data));
                  }

               }

               // 非json类型使用validator.js验证器
               else {

                  attributes[field].validate = function (validate) {
                     return function (value) {
                        for (let name in validate) {
                           if (validator[name](value) === false) {
                              throw new TypeError(`${name}('${value}')验证失败`)
                           }
                        }
                        return true
                     }
                  }

               }

            }

            // 为validate属性添加缺省函数，让数据结构保持一致
            else {

               attributes[field].validate = function (value) {
                  return value;
               }

            }

         } else {

            throw new Error(`${field}字段类型${name}不存在`);

         }

         if (primaryKey) {
            model.primaryKey = field;
         }

      } else {

         throw new Error(`${field}字段类必须为函数类型`)

      }

   }

}