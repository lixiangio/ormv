'use strict';

const keyReg = /"/g;
const valueReg = /'/g;

module.exports = {
   /**
    * 键名双引号过滤，将key中的双引号替换为空，防止截断注入
    * @param {string, number} origin 
    */
   sqlKey(origin) {

      const safetyKey = origin.replace(keyReg, "");
      const fieldKey = safetyKey.split('.').join('"."');

      return `"${fieldKey}"`;

   },
   /**
    * 字符窜值单引号替换为双单引号，防止截断注入
    * 在sql中两个连续的单引号会被视为普通的单引号字符，而非sql语法保留字
    * @param {*} origin 
    */
   sqlString(origin) {

      const safetyValue = String(origin).replace(valueReg, "''");

      return `'${safetyValue}'`;

   },
   /**
    * json转sql字符串
    * @param {object} origin 
    */
   sqlJson(origin) {

      const safetyValue = JSON.stringify(origin).replace(valueReg, "''");

      return `'${safetyValue}'`;

   },
}