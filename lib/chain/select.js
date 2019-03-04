'use strict'

const Base = require('./base');
const Op = require('./operator');
const replace = require('./replace');

const { replaceKey } = replace;

const {  $sql } = Op

const op = Symbol.for('op');

const Directions = ['DESC', 'ASC'];

/**
 * select函数链
 */
class Select extends Base {
   constructor(model) {

      super()

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
   async find() {

      let query = this._merge()

      let sql = `SELECT ${this.fields} FROM "${this.model.name}"${query}`

      this.logger(sql);

      const result = await this.client.query(sql);

      return result.rows;

   }
   async findOne() {

      this.limit(1);

      const result = await this.find()

      if (result) {
         return result[0]
      }

   }
   async findPk(id) {

      let where = {};

      let { primaryKey } = this.model

      if (primaryKey) {
         where[primaryKey] = id
      } else {
         where.id = id
      }

      this.where(where);

      this.limit(1);

      const result = await this.find()

      if (result) {
         return result[0]
      }

   }
   async count() {

      this.select($sql('count(*)'));

      const result = await this.find();

      if (result) {
         return result[0].count
      }

   }
}

module.exports = Select;