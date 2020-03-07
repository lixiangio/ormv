'use strict';

const Base = require('./base.js');

class Delete extends Base {
   constructor(model) {

      super();

      const { schemaName, client, fields, aliasIndex } = model;

      this.client = client;
      this.logger = client.logger;
      this.fields = fields;
      this.aliasIndex = aliasIndex;

      this.sql = {
         delete: {
            key: 'DELETE FROM',
            value: `"${schemaName}"."${model.name}"`
         },
         where: undefined
      }

   }
   /**
    * 返回结果代理函数
    * @param {*} data 
    */
   result(data) {

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

      let querySql = '';

      for (const name in sql) {
         const options = sql[name];
         if (options) {
            const { key, value } = options;
            querySql += `${key} ${value} `;
         }
      }

      this.logger(querySql);

      return this.client.query(querySql).then(this.result);

   }
}

module.exports = Delete;