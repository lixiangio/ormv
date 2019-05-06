'use strict'

const filter = require('../filter.js');

const { sqlKey, sqlValue } = filter;

const op = Symbol.for('op');

/**
 * select函数链
 */
module.exports = class {
   constructor() {

      this.logic = [];

   }
   /**
    * 逻辑过滤选项转sql
    */
   _compose(parameter) {

      const ands = [];

      for (const name in parameter) {

         const value = parameter[name];

         if (value instanceof Object) {

            const opValue = value[op];

            // 操作符
            if (opValue) {
               ands.push(`${sqlKey(name)} ${opValue}`);
            }
            
            // 对象
            else {
               ands.push(`${sqlKey(name)} = ${sqlValue(JSON.stringify(value))}`);
            }

         } else {

            ands.push(`${sqlKey(name)} = ${sqlValue(value)}`);

         }

      }

      return ands;

   }
   where(parameter) {

      const ands = this._compose(parameter);

      if (ands.length) {
         const sql = ands.join(" AND ");
         this.logic.push(` WHERE (${sql})`);
      }

      return this;

   }
   and(parameter) {

      const ands = this._compose(parameter);

      if (ands.length) {
         const sql = ands.join(" AND ");
         this.logic.push(` AND (${sql})`);
      }

      return this;

   }
   or(parameter) {

      const ands = this._compose(parameter);

      if (ands.length) {
         const sql = ands.join(" AND ");
         this.logic.push(` OR (${sql})`);
      }

      return this;

   }
   /**
    * Promise对象then()方法
    * @param {*} resolve 
    * @param {*} reject 
    */
   then(resolve = (value => value), reject = (value => value)) {

      return this.promise(resolve, reject);

   }
   catch(reject) {

      return this.promise(value => value, reject);

   }
}