'use strict';

const keyReg = /"/g;
const valueReg = /'/g;

module.exports = {
   /**
    * 键名双引号过滤，将key中的双引号替换为空，防止截断注入
    * @param {string,number} originKey 
    */
   sqlKey(originKey) {

      const safetyKey = originKey.replace(keyReg, "");
      const fieldKey = safetyKey.split('.').join('"."');

      return `"${fieldKey}"`;

   },
   /**
    * 键值单引号替换为双单引号，防止截断注入
    * 在sql中两个连续的单引号会被视为普通的单引号字符，而非sql语法保留字
    * @param {*} value 
    */
   sqlValue(value) {

      value = String(value).replace(valueReg, "''");

      return `'${value}'`;

   }
}