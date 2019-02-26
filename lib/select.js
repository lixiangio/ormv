'use strict'

const Op = require('./operator');
const replace = require('./replace');

const { replaceKey, replaceValue } = replace;

const { $and, $or } = Op

const op = Symbol.for('op');

const Directions = ['DESC', 'ASC'];

/**
 * select函数链
 */
module.exports = class {
   constructor(model, select) {

      this.model = model;
      this.logger = model.logger;
      this.client = model.client;

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

      this.fields = fields;

      this.queue = [];

   }
   join(model) {

      let name = model.name;
      let value = ` JOIN ${name}`;
      this.queue.push({
         grade: 10,
         value
      })
      
      return this

   }
   leftJoin(model) {
      let name = model.name;
      let value = ` LEFT JOIN ${name}`;
      this.queue.push({
         grade: 11,
         value
      })
      return this
   }
   rightJoin(model) {
      let name = model.name;
      let value = ` RIGHT JOIN ${name}`;
      this.queue.push({
         grade: 12,
         value
      })
      return this
   }
   innerJoin(model) {
      let name = model.name;
      let value = ` INNER JOIN ${name}`;
      this.queue.push({
         grade: 13,
         value
      })
      return this
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
   /**
    * 外部赋值时存在注入漏洞
    * @param {*} group 
    */
   group(group) {
      group = group.map(item => replaceKey(item));
      group = ` GROUP BY ${group}`;
      this.queue.push({
         grade: 80,
         value: group
      })
      return this
   }
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
      this.queue.push({
         grade: 90,
         value: order
      })
      return this
   }
   limit(limit) {
      if (typeof limit === 'number') {
         limit = ` LIMIT '${limit}'`
      } else {
         limit = ''
      }
      this.queue.push({
         grade: 91,
         value: limit
      })
      return this
   }
   offset(offset) {
      if (typeof offset === 'number') {
         offset = ` OFFSET ${offset}`
      } else {
         offset = ''
      }
      this.queue.push({
         grade: 92,
         value: offset
      })
      return this
   }
   async all() {

      if (this.fields.length === 0) {
         this.fields = this.fieldsKeys;
      }

      this.queue.sort(function (a, b) {
         return a.grade - b.grade
      })

      console.log(this.queue)

      let child = ''
      for (let item of this.queue) {
         child += item.value
      }

      let sql = `SELECT ${this.fields} FROM "${this.model.name}"${child}`

      this.logger(sql);

      const result = await this.model.client.query(sql);

      return result.rows;

   }
   async one() {

      this.limit(1);

      const result = await this.all()

      if (result) {
         return result[0]
      }

   }
   async primaryKey() {

      let { where } = options

      if (where === undefined) {
         where = {}
         options.where = where
      }

      let { primaryKey } = this.model

      if (primaryKey) {
         where[primaryKey] = id
      } else {
         where.id = id
      }

      options.limit = 1;

      const result = await this.all()

      if (result) {
         return result[0]
      }

   }
   async count(){

      options.select = [`count(*)`]
      const result = await this.find(options);

      if (result) {
         return result[0].count
      }

   }
}