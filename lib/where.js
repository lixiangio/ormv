'use strict'

const Op = require('./getOperator');
const getAction = require('./getAction');
const replace = require('./replace');

/**
 * Where逻辑递归器
 */
function Recursive(where) {

   const and = []

   for (let field in where) {

      let options = where[field]

      // 选项为对象类型
      if (String(options) === '[object Object]') {

         let symbols = Object.getOwnPropertySymbols(options);

         // 包含运算符
         if (symbols.length) {

            for (let symbol of symbols) {

               let operator = getAction[symbol]

               if (operator) {

                  let value = options[symbol];

                  if (String(value) === '[object Object]') {
                     value = JSON.stringify(value)
                  }

                  and.push(`${field} ${operator(value)}`);

               } else {

                  throw new Error(`${field}字段${symbol}操作符不存在`);

               }

            }

         }

         // 不含运算符，视为普通对象，直接进行序列化
         else {

            options = replace(JSON.stringify(options))

            and.push(`${field} = '${options}'`);

         }

      }

      // 选项为值类型
      else {

         and.push(`${field} = '${replace(options)}'`);

      }

   }

   const or = []
   const whereOr = where[Op.or]
   if (Array.isArray(whereOr)) {

      for (let item of whereOr) {

         // 递归子集
         if (item.constructor === Object) {
            or.push(Recursive(item))
         }

      }

   }

   where = []

   if (and.length) {
      where.push(`(${and.join(' AND ')})`)
   }

   if (or.length) {
      where.push(or.join(' OR '))
   }

   if (where.length) {
      where = where.join(' OR ')
   } else {
      return ''
   }

   return where

}

/**
 * Sql Where子句生成器
 */
function Generate(where) {

   if (String(where) === '[object Object]') {

      where = Recursive(where)

      if (where === '') {
         return where
      } else {
         return ' WHERE ' + where
      }

   } else {

      return ''

   }

}

module.exports = Generate