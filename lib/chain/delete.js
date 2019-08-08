'use strict';

const Base = require('./base.js');

class Delete extends Base {
   constructor(model) {

      super();

      this.model = model;
      this.client = model.client;
      this.logger = model.client.logger;

      this.sql = {
         'delete': {
            key: 'DELETE FROM',
            value: `"${model.name}"`
         },
         where: undefined
      }

   }
   /**
    * 返回结果代理函数
    * @param {*} data 
    */
   _result(data) {

      const { rowCount } = data;

      return { rowCount };

   }
   promise() {

      const { sql } = this;

      if (this.logic.length) {
         sql.where = {
            key: 'WHERE',
            value: this.logic.join('')
         };
      }

      let sqlString = '';

      for (const name in sql) {
         const options = sql[name];
         if (options) {
            const { key, value } = options;
            sqlString += `${key} ${value} `;
         }
      }

      this.logger(sqlString);

      return this.client.query(sqlString).then(this._result);

   }
}

module.exports = Delete;