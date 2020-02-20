'use strict';

const Find = require('./query/find.js');
const Chain = require('./_chain.js');

class Model extends Chain {
   /**
    * @param {Array} models 
    */
   constructor(client, models) {

      super();

      this.fields = {};
      this.aliasIndex = {};
      this.modelNames = [];
      this.modelsObject = {};
      this.allFields = {};
      this.client = client;
      this.models = models;

      const find = {
         "select": undefined,
         "from": undefined,
         "join": undefined,
         "on": undefined,
      }

      this.sql = { find };

      for (const module of models) {

         const modelName = module.name;

         this.modelNames.push(`"${modelName}"`);
         this.modelsObject[modelName] = module;

         const { fields } = module;

         for (const fieldName in fields) {

            const options = fields[fieldName];
            const fieldPath = `${modelName}.${fieldName}`;

            this.allFields[fieldPath] = {
               modelName,
               fieldName,
               options
            }

         }

      }

   }
   select(...fields) {

      const chain = new Find(this);

      chain._result = function (data) {
         return data.rows;
      }

      return chain.select(...fields);

   }
   /**
    * 查询多条
    * @param  {Object} condition 
    */
   find(condition) {

      const chain = new Find(this);

      if (condition) {
         chain.where(condition);
      }

      chain._result = function (data) {
         return data.rows;
      }

      return chain;

   }
   /**
    * 查询单条
    * @param  {Object} condition
    */
   findOne(condition) {

      const chain = new Find(this);

      if (condition) {
         chain.where(condition);
      }

      chain.limit(1);

      chain._result = function (data) {
         return data.rows[0];
      }

      return chain;

   }
   /**
    * 查询主键
    * @param {Number} id 
    */
   findPk(id) {

      const chain = new Find(this);

      const { primaryKey } = this;

      if (primaryKey) {
         chain.where({ [primaryKey]: id });
      } else {
         throw new Error(`模型中未定义主键`);
      }

      chain.limit(1);

      chain._result = function (data) {
         return data.rows[0];
      }

      return chain;

   }
   /**
    * 查询数据总量
    */
   count() {

      const chain = new Find(this);

      return chain.count();

   }
}

module.exports = Model;