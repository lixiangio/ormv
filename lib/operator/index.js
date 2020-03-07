'use strict';

const filter = require('../filter.js');
const compare = require('./compare.js');
const jsonb = require('./jsonb.js');

const { sqlKey } = filter;

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
   ...compare,
   ...jsonb,
}