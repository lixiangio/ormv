'use strict';

const valueReg = /'/g;

module.exports = {
   /**
    * @param {*} origin 
    */
   jsonString(origin) {

      return String(origin).replace(valueReg, "''");

   },
   /**
    * 递归json，将所有string类型中的单引号批量转义为双单引号
    * *****待开发*****
    * @param {*} origin 
    */
   jsonRecursiveString(origin) {

      return origin;

   },
}