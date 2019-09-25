'use strict';

const Find = require('./query/find.js');

class Model {
   /**
    * @param {Object} options 
    */
   constructor(client, options) {

      const { modules, condition, mode = "INNER JOIN" } = options;

      this.fields = {};
      this.aliasIndex = {};
      this.client = client;

      const find = {
         "select": undefined,
         "from": undefined,
         "join": undefined,
         "on": undefined,
      }

      this.sql = { find };

      const allFields = {};
      const modelsObject = {};
      const modelNames = [];

      for (const module of modules) {

         const modelName = module.name;

         modelNames.push(`"${modelName}"`);
         modelsObject[modelName] = module;

         const { fields } = module;

         for (const fieldName in fields) {

            const options = fields[fieldName];
            const fieldPath = `${modelName}.${fieldName}`;

            allFields[fieldPath] = {
               modelName,
               fieldName,
               options
            }

         }

      }

      const { aliasIndex, fields } = this;
      const mergeFields = options.fields;

      if (mergeFields === undefined) {
         throw new Error(`复合模型${modelNames}未定义fields字段`);
      }

      for (const item of mergeFields) {

         const [pathName, alias] = item.split(/\s+as\s+/); // 拆分别名

         const fieldInfo = allFields[pathName];

         if (fieldInfo) {

            const { modelName, fieldName, options } = fieldInfo;

            if (alias) {

               if (aliasIndex[alias]) {
                  throw new Error(`${modelNames}复合模型中${alias}字段存在命名冲突`);
               } else {
                  aliasIndex[alias] = `"${modelName}"."${fieldName}" AS "${alias}"`;
                  fields[alias] = options;
               }

            } else {

               if (aliasIndex[fieldName]) {
                  throw new Error(`${modelNames}复合模型中${fieldName}字段存在命名冲突`);
               } else {
                  aliasIndex[fieldName] = `"${modelName}"."${fieldName}"`;
                  fields[fieldName] = options;
               }

            }

         } else {
            throw new Error(`${modelNames}复合模型中未找到${pathName}字段`);
         }

      }

      const select = [];

      for (const name in aliasIndex) {
         select.push(aliasIndex[name]);
      }

      find.select = {
         key: "SELECT",
         value: select.join()
      }

      find.from = {
         key: "FROM",
         value: modelNames[0]
      }

      find.join = {
         key: mode,
         value: modelNames[1]
      }

      const on = [];

      if (condition === undefined) {
         throw new Error(`${modelNames}复合模型缺少condition选项`);
      }

      for (const field1 in condition) {

         const keys = [];
         const field2 = condition[field1];

         for (const item of [field1, field2]) {

            const [moduleName, field] = item.split('.');
            const module = modelsObject[moduleName];

            if (module) {
               if (module.fields[field]) {
                  keys.push(`"${moduleName}"."${field}"`);
               } else {
                  throw new Error(`${modelNames}复合模型condition选项中${item}字段不存在`);
               }
            } else {
               throw new Error(`${modelNames}复合模型condition选项中${item}字段不存在`);
            }

         }

         const [k1, k2] = keys;

         on.push(`${k1} = ${k2}`);

      }

      find.on = {
         key: "ON",
         value: on.join(' AND ')
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