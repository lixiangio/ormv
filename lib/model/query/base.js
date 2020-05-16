'use strict';

const safety = require('../../safety.js');

const { safetyValue } = safety;

/**
 * select函数链
 */
module.exports = class {
   constructor() {

      this.logic = [];

   }
   /**
    * 逻辑选项转sql
    * @param {Array} parameter 每个子节点均为and集合，多个子节点之间为or集合
    */
   _converter(parameter) {

      parameter = parameter.filter(item => item);

      if (parameter.length === 0) return;

      const orArray = [];

      const { aliasIndex } = this;

      for (const andOptions of parameter) {

         const andArray = [];

         for (const name in andOptions) {

            const field = aliasIndex[name];

            if (field === undefined) {
               throw new Error(`"${this.model.name}"模型中"${name}"字段不存在`);
            }

            const value = andOptions[name];

            // 函数运算符
            if (value instanceof Function) {

               andArray.push(`${field} ${value(field)}`);

            }
            
            // 对象
            else if (value instanceof Object) {

               andArray.push(`${field} = ${safetyValue(JSON.stringify(value))}`);

            } else {

               andArray.push(`${field} = ${safetyValue(value)}`);

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
    * 参数与and相同
    * @param {Array} parameter 
    */
   where(...parameter) {

      const sql = this._converter(parameter);

      if (sql) {

         this.logic.push(sql);

      } else {

         this.logic.push(`TRUE`);

      }

      return this;

   }
   and(...parameter) {

      const sql = this._converter(parameter);

      if (sql) {

         this.logic.push(` AND ${sql}`);

      }

      return this;

   }
   or(...parameter) {

      const sql = this._converter(parameter);

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