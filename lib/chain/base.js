'use strict'

const Op = require('../operator/');

const { $and, $or } = Op;

const op = Symbol.for('op');

/**
 * select函数链
 */
module.exports = class {
   where(...parameters) {

      let logic = $and(...parameters);

      let value = ''
      let values = logic[op];
      if (values.length) {
         values.shift();
         value = ' WHERE ' + values.join('')
      }

      this.queue.where = {
         grade: 20,
         value
      }

      return this

   }
   and(...parameters) {

      let logic = $and(...parameters);

      let value = ''
      let values = logic[op];
      if (values.length) {
         value = values.join('')
      }

      this.queue[`and${this.id++}`] = {
         grade: 21,
         value
      }

      return this

   }
   or(...parameters) {

      let logic = $or(...parameters);

      let value = ''
      let values = logic[op];
      if (values.length) {
         value = values.join('')
      }

      this.queue[`or${this.id++}`] = {
         grade: 21,
         value
      }

      return this

   }
   /**
    * where参数排序、合成where字符串
    */
   _merge() {

      this.queue = Object.values(this.queue);

      this.queue.sort(function (a, b) {
         return a.grade - b.grade
      })

      let query = ''
      for (let item of this.queue) {
         query += item.value
      }

      return query;

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