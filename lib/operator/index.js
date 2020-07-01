'use strict';

const safety = require('../safety.js');
const compare = require('./compare.js');
const jsonb = require('./jsonb.js');

const { safetyKey } = safety;

module.exports = {
  // 原生sql
  $sql(sql) {
    return () => sql;
  },
  /**
   * 定义别名
   * @param {String} field 原名
   * @param {String} alias 别名
   */
  $as(field, alias) {
    return () => `${safetyKey(field)} AS "${alias.replace(/"/g, "")}"`;
  },
  $count() {
    return () => `count(*)::integer`;
  },
  ...compare,
  ...jsonb,
}