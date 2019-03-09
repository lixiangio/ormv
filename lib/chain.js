'use strict'

const dayjs = require('dayjs');
const Op = require('./operator');
const replace = require('./replace');

const { replaceKey, replaceValue } = replace;

const { $and, $or, $sql } = Op;

const op = Symbol.for('op');

const Directions = ['DESC', 'ASC'];

const ignore = [undefined, null, ''];

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
   /**
    * SQL参数排序、合并
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

               if (ignore.includes(value)) {
                  set.push(`"${field}" = DEFAULT`);
                  continue
               }

               if (String(value) === '[object Object]') {

                  let callback = value[op]

                  // 操作符对象
                  if (callback) {

                     value = value.value

                     if (type(value)) {

                        value = validate(value)

                        value = callback(field, value);

                        set.push(`"${field}" = ${value}`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

                  // 普通JSON对象，直接序列化为字符串
                  else {

                     if (type(value)) {

                        value = validate(value);

                        set.push(`"${field}" = ${value}`);

                     } else {

                        throw new TypeError(`${field}字段值必须为${type.name}类型`);

                     }

                  }

               }

               // 非对象类型
               else if (type(value)) {

                  value = validate(value);

                  set.push(`"${field}" = ${value}`);

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            }

         }

      } else {

         throw new Error(`data参数值必须为Object类型`);

      }

      let date = dayjs().format();
      set.push(`"updatedAt" = '${date}'`);

      set = set.join(", ")

      let query = this._merge();

      let sql = `UPDATE "${this.model.name}" SET ${set}${query} RETURNING *`;

      this.logger(sql);

      const { rows } = await this.client.query(sql);

      return rows[0];

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