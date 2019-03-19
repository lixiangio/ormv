'use strict'

const Op = require('../operator');
const replace = require('../replace');
const Base = require('./base');

const { replaceKey } = replace;
const { $count } = Op;
const op = Symbol.for('op');
const Directions = ['DESC', 'ASC'];

/**
 * find函数链
 */
class Find extends Base {
   /**
    * 
    * @param {Object} model 模型实例
    */
   constructor(model) {

      super();

      this.model = model;
      this.logger = model.logger;
      this.client = model.client;
      this.fields = model.fieldsKeys;
      this.queue = {};

      // 为多个逻辑条件指定id，防止重复属性被覆盖
      this.id = 0;

   }
   select(...select) {

      let fields = [];

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

      this.fields = fields;

      return this;

   }
   join(model) {

      let name = model.name;
      let value = ` JOIN "${name}"`;

      this.queue.join = {
         grade: 10,
         value
      }

      return this

   }
   leftJoin(model) {
      let name = model.name;
      let value = ` LEFT JOIN "${name}"`;
      this.queue.leftJoin = {
         grade: 10,
         value
      }
      return this
   }
   rightJoin(model) {
      let name = model.name;
      let value = ` RIGHT JOIN "${name}"`;
      this.queue.rightJoin = {
         grade: 10,
         value
      }
      return this
   }
   innerJoin(model) {
      let name = model.name;
      let value = ` INNER JOIN "${name}"`;
      this.queue.innerJoin = {
         grade: 10,
         value
      }
      return this
   }
   on(options) {

      let list = [];
      for (let leftField in options) {
         let rightField = options[leftField];
         list.push(`${replaceKey(leftField)} = ${replaceKey(rightField)}`);
      }

      let value = ' ON ' + list.join(", ");

      this.queue.on = {
         grade: 15,
         value
      }

      return this

   }
   /**
    * 外部赋值时存在注入漏洞
    * @param {*} fields 
    */
   group(...fields) {

      fields = fields.map(item => replaceKey(item));
      let value = ` GROUP BY ${fields}`;

      this.queue.group = {
         grade: 80,
         value
      }

      return this

   }
   /**
    * 外部赋值时存在注入漏洞
    * @param {*} options 
    */
   order(options) {

      let list = [];
      for (let field in options) {
         let direction = options[field];
         if (Directions.includes(direction)) {
            list.push(`${replaceKey(field)} ${direction}`);
         }
      }

      let value = ' ORDER BY ' + list.join(", ");

      this.queue.order = {
         grade: 90,
         value
      }

      return this

   }
   limit(value) {

      if (value) {

         value = ` LIMIT '${Number(value)}'`

         this.queue.limit = {
            grade: 91,
            value
         }

      }

      return this

   }
   offset(value) {

      if (value) {

         value = ` OFFSET ${Number(value)}`;

         this.queue.offset = {
            grade: 92,
            value
         }

      }

      return this;

   }
   count() {

      this.select($count('*'));

      this.callback = function (data) {
         return data.rows[0].count;
      }
      
      return this;

   }
   /**
    * promise代理方法
    * @param {*} resolve 
    * @param {*} reject 
    */
   promise(resolve, reject) {

      const query = this._merge();

      const sql = `SELECT ${this.fields} FROM "${this.model.name}"${query}`;

      this.logger(sql);

      return this.client.query(sql).then(data => {
         return resolve(this.callback(data));
      }, reject);

   }
}

module.exports = Find