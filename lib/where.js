'use strict'

const Op = require('./operator');
const OpMap = require('./operatorMap');
const replace = require('./replace');

/**
 * Where逻辑递归器
 */
function Recursive(where) {

   const and = []

   for (let field in where) {

      let item = where[field]
      if (String(item) === '[object Object]') {
         
         let symbols = Object.getOwnPropertySymbols(item);
         if (symbols.length) {

            for (let symbol of symbols) {

               let operator = OpMap[symbol]
               if (operator) {

                  let value = item[symbol]
                  if (String(value) === '[object Object]') {
                     value = JSON.stringify(value)
                  }
                  and.push(`${field} ${operator(value)}`)
                  
               } else {

                  throw new Error(`${field}字段${symbol}操作符不存在`);

               }

            }

         } else {

            and.push(`${field} = '${replace(JSON.stringify(item))}'`);

         }

      } else {

         and.push(`${field} = '${replace(item)}'`);

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
   }

   return where

}

/**
 * Sql Where子句生成器
 */
function Generate(where) {

   if (String(where) === '[object Object]') {

      where = Recursive(where)

      if (where) {
         where = ' WHERE ' + where
      }

      return where

   } else {

      return ''

   }

}

module.exports = Generate