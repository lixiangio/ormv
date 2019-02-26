'use strict'

const Op = require('./operator');
const replace = require('./replace');

const { replaceKey, replaceValue } = replace;

const { $and, $or, $sql } = Op

const op = Symbol.for('op');

const Directions = ['DESC', 'ASC'];

/**
 * select函数链
 */
module.exports = class {
   constructor(model) {

      this.model = model;
      this.logger = model.logger;
      this.client = model.client;
      this.fields = model.fieldsKeys;
      this.queue = {};

      this.andCount = 0;
      this.orCount = 0;

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

   }
   join(model) {

      let name = model.name;
      let value = ` JOIN ${name}`;

      this.queue.join = {
         grade: 10,
         value
      }

      return this

   }
   leftJoin(model) {
      let name = model.name;
      let value = ` LEFT JOIN ${name}`;
      this.queue.leftJoin = {
         grade: 11,
         value
      }
      return this
   }
   rightJoin(model) {
      let name = model.name;
      let value = ` RIGHT JOIN ${name}`;
      this.queue.rightJoin = {
         grade: 12,
         value
      }
      return this
   }
   innerJoin(model) {
      let name = model.name;
      let value = ` INNER JOIN ${name}`;
      this.queue.innerJoin = {
         grade: 13,
         value
      }
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

      this.queue.where = {
         grade: 20,
         value: where
      }

      return this

   }
   and(options) {

      options = $and(options);

      let where = ''
      if (String(options) === '[object Object]') {
         let values = options[op];
         if (Array.isArray(values)) {
            values.shift();
            if (values.length) {
               where = ' AND ' + values.join('')
            }
         } else {
            where = ''
         }
      } else {
         where = ''
      }

      this.queue[`and${++this.andCount}`] = {
         grade: 21,
         value: where
      }

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

      this.queue[`or${++this.andCount}`] = {
         grade: 21,
         value: where
      }

      return this

   }
   /**
    * 外部赋值时存在注入漏洞
    * @param {*} group 
    */
   group(...group) {

      group = group.map(item => replaceKey(item));
      group = ` GROUP BY ${group}`;

      this.queue.group = {
         grade: 80,
         value: group
      }

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
      this.queue.order = {
         grade: 90,
         value: order
      }

      return this

   }
   limit(limit) {

      if (typeof limit === 'number') {
         limit = ` LIMIT '${limit}'`
      } else {
         limit = ''
      }
      this.queue.limit = {
         grade: 91,
         value: limit
      }
      return this

   }
   offset(offset) {

      if (typeof offset === 'number') {
         offset = ` OFFSET ${offset}`
      } else {
         offset = ''
      }
      this.queue.offset = {
         grade: 92,
         value: offset
      }
      return this;

   }
   _merge() {

      this.queue = Object.values(this.queue);

      this.queue.sort(function (a, b) {
         return a.grade - b.grade
      })

      console.log(this.queue);

      let query = ''
      for (let item of this.queue) {
         query += item.value
      }

      return query;

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
   async update(data) {

      let set = [];

      if (String(data) === '[object Object]') {

         let { fields } = this.model;

         for (let field in data) {

            let attribute = fields[field];

            if (attribute) {

               let { type, validate } = attribute;

               let value = data[field];

               if (String(value) === '[object Object]') {

                  let callback = value[op]

                  // 操作符对象
                  if (callback) {

                     value = value.value

                     if (type(value)) {

                        value = validate(value)

                        value = callback(field, value);

                        set.push(`${replaceKey(field)} = ${value}`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

                  // 普通JSON对象，直接序列化为字符串
                  else {

                     if (type(value)) {

                        value = validate(value)

                        set.push(`${replaceKey(field)} = '${value}'`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

               }

               // 非对象类型
               else if (type(value)) {

                  validate(value);

                  value = replaceValue(value);

                  set.push(`${replaceKey(field)} = '${value}'`);

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            } else {

               throw new Error(`${this.model.name}模型中找不到${field}字段`);

            }

         }

         set = set.join(", ")

      } else {

         throw new Error(`data参数值必须为Object类型`);

      }

      let query = this._merge();

      let sql = `UPDATE "${this.model.name}" SET ${set}${query}`;

      this.logger(sql);

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
   async delete() {

      let query = this._merge();

      let sql = `DELETE FROM "${this.model.name}"${query}`;

      this.logger(sql);

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
}