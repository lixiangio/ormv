'use strict';

const safety = require('../safety.js');
const compare = require('./compare.js');
const jsonb = require('./jsonb.js');

const { safetyKey } = safety;

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
      return `${safetyKey(field)} AS "${alias}"`;
    }
  },
  $count() {
    return function () {
      return `count(*)::integer`;
    }
  },
  ...compare,
  ...jsonb,
}