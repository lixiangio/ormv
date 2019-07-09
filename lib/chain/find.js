'use strict';

const Base = require('./base.js');
const filter = require('../filter.js');
const proxyPromise = require('../promise.js');

const op = Symbol.for('op');
const { sqlKey } = filter;

const directions = {
   'desc': true,
   'asc': true
};

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
      this.sql = ['SELECT ', '*', ` FROM "${model.name}"`];

   }
   select(...select) {

      const fields = [];

      for (const field of select) {
         if (typeof field === 'string') {
            fields.push(sqlKey(field));
         } else if (field instanceof Object) {
            const value = field[op];
            if (value) {
               fields.push(value);
            }
         }
      }

      this.sql[1] = fields;

      return this;

   }
   join(name) {

      this.sql[5] = ` JOIN "${name}"`;
      return this;

   }
   innerJoin(name) {

      this.sql[5] = ` INNER JOIN "${name}"`;
      return this;

   }
   leftJoin(name) {

      this.sql[5] = ` LEFT JOIN "${name}"`;
      return this;

   }
   rightJoin(name) {

      this.sql[5] = ` RIGHT JOIN "${name}"`;
      return this;

   }
   on(options) {

      const list = [];

      for (const leftField in options) {

         const rightField = options[leftField];
         
         list.push(`${sqlKey(leftField)} = ${sqlKey(rightField)}`);
         
      }

      this.sql[6] = ' ON ' + list.join(", ");

      return this;

   }
   group(...fields) {

      fields = fields.map(item => sqlKey(item));

      this.sql[30] = ` GROUP BY ${fields}`;

      return this;

   }
   order(options) {

      const list = [];

      for (const field in options) {

         const direction = options[field];

         if (directions[direction] === true) {
            list.push(`${sqlKey(field)} ${direction}`);
         }

      }

      this.sql[31] = ' ORDER BY ' + list.join(", ");

      return this;

   }
   /**
    * 指定返回起始位置
    * @param {Number} value 
    */
   offset(value) {

      if (value) {
         this.sql[32] = ` OFFSET ${Number(value)}`;
      }

      return this;

   }
   /**
    * 限制返回结果数量
    * @param {Number} value 
    */
   limit(value) {

      if (value) {
         this.sql[33] = ` LIMIT '${Number(value)}'`;
      }

      return this;

   }
   /**
    * 在已有find实例上创建新的查询
    */
   count() {

      const sqlCopy = [...this.sql];

      sqlCopy[1] = `count('*')`;

      sqlCopy.splice(10, 0, ...this.logic);

      sqlCopy.splice(30);

      const sql = sqlCopy.join('');

      return new proxyPromise((resolve, reject) => {

         this.logger(sql);

         return this.client.query(sql).then(data => {

            return resolve(data.rows[0].count);

         }, reject);

      });

   }
   /**
    * promise代理方法
    */
   promise() {

      const sqlCopy = [...this.sql];

      sqlCopy.splice(10, 0, ...this.logic);

      const sql = sqlCopy.join('');

      this.logger(sql);

      return this.client.query(sql).then(this._result);

   }
}

module.exports = Find;