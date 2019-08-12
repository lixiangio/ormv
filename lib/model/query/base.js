'use strict';

const filter = require('../../filter.js');

const { sqlValue } = filter;

const op = Symbol.for('op');

/**
 * 逻辑选项转sql
 * @param {Array} parameter 每个子节点均为and集合，多个子节点之间为or集合
 */
function Logic(parameter) {

   parameter = parameter.filter(item => item);

   if (parameter.length === 0) return;

   const orArray = [];

   const { aliasIndex } = this;

   for (const andOptions of parameter) {

      const andArray = [];

      for (const name in andOptions) {

         const field = aliasIndex[name];

         if (field === undefined) {
            throw new Error(`${name}字段不存在`);
         }

         const value = andOptions[name];

         if (value instanceof Object) {

            const opValue = value[op];

            // 操作符
            if (opValue) {
               andArray.push(`${field} ${opValue}`);
            }

            // 对象
            else {
               andArray.push(`${field} = ${sqlValue(JSON.stringify(value))}`);
            }

         } else {
            andArray.push(`${field} = ${sqlValue(value)}`);
         }

      }

      const andSql = andArray.join(" AND ");

      orArray.push(`(${andSql})`);

   }

   if (orArray.length === 1) {

      return orArray[0];

   } else {

      const sql = orArray.join(" OR ");

      return `(${sql})`;

   }

}

/**
 * select函数链
 */
module.exports = class {
   constructor() {

      this.logic = [];

   }
   /**
    * 参数与and相同
    * @param {*} parameter 
    */
   where(...parameter) {

      const sql = Logic.call(this, parameter);

      if (sql) {

         this.logic.push(sql);

      } else {

         this.logic.push(`TRUE`);

      }

      return this;

   }
   and(...parameter) {

      const sql = Logic.call(this, parameter);

      if (sql) {

         this.logic.push(` AND ${sql}`);

      }

      return this;

   }
   or(...parameter) {

      const sql = Logic.call(this, parameter);

      if (sql) {
         this.logic.push(` OR ${sql}`);
      }

      return this;

   }
   /**
    * Promise对象then()方法
    * @param {Function} resolve 
    * @param {Function} reject 
    */
   then(resolve, reject) {

      return this.promise().then(resolve, reject);

   }
   catch(reject) {

      return this.promise().catch(reject);

   }
}