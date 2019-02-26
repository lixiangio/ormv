'use strict'

const Op = require('./operator');
const replace = require('./replace');

const { replaceKey } = replace;

const { $and, $or } = Op

const op = Symbol.for('op');

/**
 * select函数链
 */
module.exports = class {
   constructor(model, data) {

      this.model = model;
      this.logger = model.logger;
      this.client = model.client;
      this.data = data;

      this.queue = [];

   }
   where(options) {

      options = $and(options);

      let where = ''
      if (String(options) === '[object Object]') {
         let values = options[op];
         if (Array.isArray(values)) {
            values.shift();
            if (values.length) {
               where = ' WHERE ' + values.join('')
            }
         } else {
            where = ''
         }
      } else {
         where = ''
      }

      this.queue.push({
         grade: 20,
         value: where
      })

      return this

   }
   and(options) {

      let value = $and(options);
      this.queue.push({
         grade: 21,
         value
      })

      return this

   }
   or(options) {

      options = $or(options);

      let where = ''
      if (String(options) === '[object Object]') {
         let values = options[op];
         if (Array.isArray(values)) {
            values.shift();
            if (values.length) {
               where = ' OR ' + values.join('')
            }
         } else {
            where = ''
         }
      } else {
         where = ''
      }

      this.queue.push({
         grade: 21,
         value: where
      })

      return this

   }
   async  send() {

      let { where } = options;

      where = whereAction(where).value;

      let sql = `DELETE FROM "${this.name}"${where}`;

      this.logger(sql);

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
}