'use strict'

const Base = require('./base.js');

class Delete extends Base {
   constructor(model) {

      super();

      this.model = model;
      this.logger = model.logger;
      this.client = model.client;
      this.fields = model.fieldsKeys;

      this.sql = [`DELETE FROM "${model.name}"`];

   }
   promise(resolve, reject) {

      this.sql.splice(10, 0, ...this.logic);

      const sql = this.sql.join('');

      this.logger(sql);

      return this.client.query(sql).then(data => {
         const { rowCount } = data;
         return resolve({ rowCount });
      }, reject);

   }
}

module.exports = Delete;