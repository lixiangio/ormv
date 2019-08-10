'use strict';

const Base = require('./base.js');

class Delete extends Base {
   constructor(model) {

      super();

      const { client, fields, fieldIndex } = model;

      this.client = client;
      this.logger = client.logger;
      this.fields = fields;
      this.fieldIndex = fieldIndex;

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