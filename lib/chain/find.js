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

      const { name } = model;

      this.model = model;
      this.client = model.client;
      this.logger = model.client.logger;
      this.fields = model.fieldsKeys;
      this.models = { [name]: model };

      this.sql = {
         "select": {
            key: "SELECT",
            value: '*'
         },
         "from": {
            key: "FROM",
            value: `"${name}"`
         },
         "join": undefined,
         "on": undefined,
         "where": undefined,
         "group": undefined,
         "order": undefined,
         "offset": undefined,
         "limit": undefined,
      };

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

      this.sql.select = {
         key: 'SELECT',
         value: fields
      };

      return this;

   }
   _join(type, name) {

      const model = this.client.models[name];

      if (model) {
         this.models[name] = model;
      } else {
         throw new Error(`${name}模型不存在`);
      }

      this.sql.join = {
         key: type,
         value: `"${name}"`
      };

   }
   join(name) {

      this._join('JOIN', name);

      return this;

   }
   innerJoin(name) {

      this._join('INNER JOIN', name);

      return this;

   }
   leftJoin(name) {

      this._join('LEFT JOIN', name);

      return this;

   }
   rightJoin(name) {

      this._join('RIGHT JOIN', name);

      return this;

   }
   on(options) {

      const list = [];

      for (const leftField in options) {

         const rightField = options[leftField];

         list.push(`${sqlKey(leftField)} = ${sqlKey(rightField)}`);

      }

      this.sql.on = {
         key: 'ON',
         value: list.join(", ")
      };

      return this;

   }
   group(...fields) {

      fields = fields.map(item => sqlKey(item));

      this.sql.group = {
         key: 'GROUP BY',
         value: fields
      };

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

      this.sql.order = {
         key: 'ORDER BY',
         value: list.join(", ")
      };

      return this;

   }
   /**
    * 定义列起的始位置
    * @param {Number} value 
    */
   offset(value) {

      if (value) {
         this.sql.offset = {
            key: 'OFFSET',
            value: Number(value)
         };
      }

      return this;

   }
   /**
    * 限制返回结果数量
    * @param {Number} value 
    */
   limit(value) {

      if (value) {
         if (value) {
            this.sql.offset = {
               key: 'LIMIT',
               value: Number(value)
            };
         }
      }

      return this;

   }
   /**
    * 在已有find实例上创建新的查询
    */
   count() {

      const { select, from, join, on, where } = this.sql;

      const sqlCopy = { select, from, join, on, where };

      sqlCopy.select = {
         key: 'SELECT',
         value: `count('*')`
      };

      if (this.logic.length) {
         sqlCopy.where = {
            key: 'WHERE',
            value: this.logic.join('')
         }
      }

      let sqlString = '';

      for (const name in sqlCopy) {
         const options = sqlCopy[name];
         if (options) {
            const { key, value } = options;
            sqlString += `${key} ${value} `
         }
      }

      return new proxyPromise((resolve, reject) => {

         this.logger(sqlString);

         return this.client.query(sqlString).then(data => {

            return resolve(data.rows[0].count);

         }, reject);

      });

   }
   /**
    * promise代理方法
    */
   promise() {

      const sqlCopy = { ...this.sql };

      if (this.logic.length) {
         sqlCopy.where = {
            key: 'WHERE',
            value: this.logic.join('')
         }
      }

      let sqlString = '';

      for (const name in sqlCopy) {
         const options = sqlCopy[name];
         if (options) {
            const { key, value } = options;
            sqlString += `${key} ${value} `;
         }
      }

      this.logger(sqlString);

      return this.client.query(sqlString).then(this._result);

   }
}

module.exports = Find;