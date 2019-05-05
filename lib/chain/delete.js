'use strict'

const Base = require('./base.js');

class Delete extends Base {
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
   promise(resolve, reject) {

      const query = this._merge();

      const sql = `DELETE FROM "${this.model.name}"${query}`;

      this.logger(sql);

      return this.client.query(sql).then(data => {
         const { rowCount } = data;
         return resolve({ rowCount });
      }, reject);

   }
}

module.exports = Delete;