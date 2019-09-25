'use strict';

const filter = require('../filter.js');
const update = require('./update.js');
const compare = require('./compare.js');

const { sqlKey, sqlValue } = filter;

module.exports = {
   // 原生sql
   $sql(sql) {
      return function () {
         return sql;
      }
   },
   /**
    * 定义别名
    * @param {String} field 原名
    * @param {String} alias 别名
    */
   $as(field, alias) {
      return function () {
         alias = alias.replace(/"/g, "");
         return `${sqlKey(field)} AS "${alias}"`;
      }
   },
   $count() {
      return function () {
         return `count(*)`;
      }
   },
   // json转字符串
   $json(value) {
      return function () {
         return sqlValue(JSON.stringify(value))
      }
   },
   // $any(value) {
   //    return function () {
   //       return `ANY ${sqlValue(value)}`
   //    }
   // },
   // $all(value) {
   //    return function () {
   //       return `ALL ${sqlValue(value)}`
   //    }
   // },
   // $col(value) {
   //    return function () {
   //       return `COL ${sqlValue(value)}`
   //    }
   // },
   // $raw(value) {
   //    return function () {
   //       return `DEPRECATED ${sqlValue(value)}`
   //    }
   // },
   ...compare,
   ...update,
}