'use strict'

const replace = require('./replace');

const { replaceKey, replaceValue } = replace;

const op = Symbol.for('op');

const Directions = ['DESC', 'ASC'];

module.exports = {
   select(select) {

      let fields = [];
      if (Array.isArray(select)) {
         for (let field of select) {
            if (typeof field === 'string') {
               fields.push(replaceKey(field));
            } else if (String(field) === '[object Object]') {
               field = field[op];
               if (field) {
                  fields.push(field);
               }
            }
         }
      } else {
         fields = "";
      }

      return {
         grade: 1,
         value: fields
      }

   },
   join(value) {
      return {
         grade: 10,
         value: value
      }
   },
   leftJoin(value) {
      return {
         grade: 11,
         value: value
      }
   },
   rightJoin(value) {
      return {
         grade: 12,
         value: value
      }
   },
   innerJoin(value) {
      return {
         grade: 13,
         value: value
      }
   },
   where(options) {
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
      return {
         grade: 20,
         value: where
      }
   },
   /**
    * 外部赋值时存在注入漏洞
    * @param {*} group 
    */
   group(group) {
      group = group.map(item => replaceKey(item));
      group = ` GROUP BY ${group}`;
      return {
         grade: 80,
         value: group
      }
   },
   /**
    * 外部赋值时存在注入漏洞
    * @param {*} order 
    */
   order(order) {
      let list = [];
      for (let field in order) {
         let direction = order[field];
         if (Directions.includes(direction)) {
            list.push(`${replaceKey(field)} ${direction}`);
         }
      }
      order = ' ORDER BY ' + list.join(", ");
      return {
         grade: 90,
         value: order
      }
   },
   limit(limit) {
      if (typeof limit === 'number') {
         limit = ` LIMIT ${limit}`
      } else {
         limit = ''
      }
      return {
         grade: 91,
         value: limit
      }
   },
   offset(offset) {
      if (typeof offset === 'number') {
         offset = ` OFFSET ${offset}`
      } else {
         offset = ''
      }
      return {
         grade: 92,
         value: offset
      }
   },
}