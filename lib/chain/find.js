'use strict'

const Op = require('../operator/');
const replace = require('../replace.js');
const Base = require('./base.js');

const { $count } = Op;
const op = Symbol.for('op');
const Directions = ['DESC', 'ASC'];
const { replaceKey } = replace;

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

      const fields = [];

      for (let field of select) {
         if (typeof field === 'string') {
            fields.push(replaceKey(field));
         } else if (field instanceof Object) {
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
   leftJoin(name) {
      this.queue.leftJoin = {
         grade: 10,
         value: ` LEFT JOIN "${name}"`
      }
      return this;
   }
   rightJoin(name) {
      this.queue.rightJoin = {
         grade: 10,
         value: ` RIGHT JOIN "${name}"`
      }
      return this;
   }
   innerJoin(name) {
      this.queue.innerJoin = {
         grade: 10,
         value: ` INNER JOIN "${name}"`
      }
      return this;
   }
   on(options) {

      const list = [];
      for (const leftField in options) {
         const rightField = options[leftField];
         list.push(`${replaceKey(leftField)} = ${replaceKey(rightField)}`);
      }

      this.queue.on = {
         grade: 15,
         value: ' ON ' + list.join(", ")
      }

      return this;

   }
   /**
    * 外部赋值时存在注入漏洞
    * @param {*} fields 
    */
   group(...fields) {

      fields = fields.map(item => replaceKey(item));

      this.queue.group = {
         grade: 80,
         value: ` GROUP BY ${fields}`
      }

      return this;

   }
   /**
    * 外部赋值时存在注入漏洞
    * @param {*} options 
    */
   order(options) {

      const list = [];
      for (const field in options) {
         const direction = options[field];
         if (Directions.includes(direction)) {
            list.push(`${replaceKey(field)} ${direction}`);
         }
      }

      this.queue.order = {
         grade: 90,
         value: ' ORDER BY ' + list.join(", ")
      }

      return this;

   }
   limit(value) {

      if (value) {
         this.queue.limit = {
            grade: 91,
            value: ` LIMIT '${Number(value)}'`
         }
      }

      return this;

   }
   offset(value) {

      if (value) {
         this.queue.offset = {
            grade: 92,
            value: ` OFFSET ${Number(value)}`
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

module.exports = Find;