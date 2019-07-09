'use strict';

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
   /**
    * 返回结果代理函数
    * @param {*} data 
    */
   _result(data) {

      const { rowCount } = data;

      return { rowCount };

   }
   promise() {

      this.sql.splice(10, 0, ...this.logic);

      const sql = this.sql.join('');

      this.logger(sql);

      return this.client.query(sql).then(this._result);

   }
}

module.exports = Delete;