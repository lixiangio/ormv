'use strict';

const filter = require('../filter.js');

const { sqlKey, sqlValue } = filter;

const op = Symbol.for('op');

/**
 * 逻辑运算函数链
 */
class Logic {
   constructor() {

      this[op] = [];
      
   }
   /**
    * and、or合成器
    * @param {*} type 操作符类型
    * @param {*} parameters 包含多个and集合的参数列表
    */
   _compose(type, parameters) {

      const list = [];

      for (const parameter of parameters) {

         const ands = [];

         for (const name in parameter) {

            const value = parameter[name];

            if (value instanceof Object) {

               const opValue = value[op];
               
               if (opValue) {
                  ands.push(`${sqlKey(name)} ${opValue}`);
               } else {
                  ands.push(`${sqlKey(name)} = ${sqlValue(JSON.stringify(value))}`);
               }

            } else {

               ands.push(`${sqlKey(name)} = ${sqlValue(value)}`);

            }

         }

         if (ands.length > 1) {
            const sql = ands.join(" AND ");
            list.push(`(${sql})`);
         } else if (ands.length === 1) {
            list.push(ands);
         }

      }

      if (list.length > 1) {
         const sql = list.join(type);
         this[op].push(type, `(${sql})`);
      } else if (list.length === 1) {
         const sql = list.join(type);
         this[op].push(type, sql);
      }

      return this;

   }
   /**
    * and操作符
    * @param  {...any} parameters and参数队列
    */
   $and(...parameters) {

      return this._compose(" AND ", parameters);

   }
   /**
    * or操作符
    * @param  {...any} parameters or参数队列
    */
   $or(...parameters) {

      return this._compose(" OR ", parameters);

   }
}

module.exports = {
   $and(...values) {

      const logic = new Logic();
      return logic.$and(...values);

   },
   $or(...values) {

      const logic = new Logic();
      return logic.$or(...values);

   },
}