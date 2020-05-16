'use strict';

/**
 * 表字段级安全过滤器
 */

const keyReg = /"/g;
const valueReg = /'/g;

module.exports = {
  /**
   * 键名双引号过滤，将key中的双引号替换为空，防止截断注入
   * @param {string, number} origin 
   */
  safetyKey(origin) {

    const safetyKey = origin.replace(keyReg, "");
    const fieldKey = safetyKey.split('.').join('"."');

    return `"${fieldKey}"`;

  },
  /**
   * 将字符串中的单引号替换为双单引号，防止截断注入
   * 在sql中两个连续的单引号会被视为普通的单引号字符，而非sql语法保留字
   * @param {*} origin 
   */
  safetyValue(origin) {

    const safetyValue = String(origin).replace(valueReg, "''");

    return `'${safetyValue}'`;

  },
  /**
   * json转sql字符串
   * @param {object} origin 
   */
  safetyJson(origin) {

    const safetyJson = JSON.stringify(origin).replace(valueReg, "''");

    return `'${safetyJson}'`;

  },
}
