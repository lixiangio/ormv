'use strict';

const Find = require('./query/find.js');

class Model {
   /**
    * @param {Object} client 客户端
    * @param {Object} options 模型选项
    */
   constructor(client, options) {

      const { from: fromModule } = options;

      this.fields = {};
      this.aliasIndex = {};
      this.client = client;

      let joinModule, joinType;

      if (options.innerJoin) {
         joinType = "INNER JOIN";
         joinModule = options.innerJoin;
      } else if (options.leftJoin) {
         joinType = "LEFT JOIN";
         joinModule = options.leftJoin;
      } else if (options.rightJoin) {
         joinType = "RIGHT JOIN";
         joinModule = options.rightJoin;
      } else {
         throw new Error('join条件不能为空');
      }

      const sql = {
         "select": {
            key: "SELECT",
            value: "*",
         },
         "from": {
            key: "FROM",
            value: `"${fromModule.name}"`
         },
         "join": {
            key: joinType,
            value: `"${joinModule.name}"`
         },
         "on": undefined,
      }

      this.sql = sql;

      const allFields = {};
      const modelsObject = {};

      for (const module of [fromModule, joinModule]) {

         const { name: modelName } = module;

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

      this.name = `"${fromModule.name}&${joinModule.name}"`;

      const { aliasIndex, fields } = this;
      const { select: originSelect } = options;

      if (originSelect === undefined) {
         throw new Error(`“${this.name}”复合模型中“select”参数不能为空`);
      }

      for (const alias in originSelect) {

         const modelNameOrAlias = originSelect[alias];

         const fieldPath = `${modelNameOrAlias}.${alias}`;

         const fieldInfo = allFields[fieldPath];

         if (fieldInfo) {

            const { modelName, fieldName, options } = fieldInfo;

            if (aliasIndex[fieldName] === undefined) {

               aliasIndex[fieldName] = `"${modelName}"."${fieldName}"`;
               fields[fieldName] = options;


            } else {

               throw new Error(`${modelName}复合模型中“${fieldName}”字段存在命名冲突`);

            }

         }

         // 尝试别名匹配
         else if (allFields[modelNameOrAlias]) {

            const fieldInfo = allFields[modelNameOrAlias];

            const { modelName, fieldName, options } = fieldInfo;

            if (aliasIndex[alias] === undefined) {

               aliasIndex[alias] = `"${modelName}"."${fieldName}" AS "${alias}"`;
               fields[alias] = options;

            } else {

               throw new Error(`"${modelName}"复合模型中"${alias}"字段存在命名冲突`);

            }

         } else {

            throw new Error(`${this.name}复合模型中未找到“${fieldPath}”字段`);

         }

      }

      const select = [];

      for (const name in aliasIndex) {
         select.push(aliasIndex[name]);
      }

      sql.select = {
         key: "SELECT",
         value: select.join()
      }

      const on = [];

      const { on: condition } = options;

      if (condition === undefined) {
         throw new Error(`${this.name}复合模型缺少on选项`);
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
                  throw new Error(`${this.name}复合模型中“on.${item}”字段不存在`);
               }
            } else {
               throw new Error(`${this.name}复合模型中“on.${item}”字段不存在`);
            }

         }

         const [k1, k2] = keys;

         on.push(`${k1} = ${k2}`);

      }

      sql.on = {
         key: "ON",
         value: on.join(' AND ')
      }

   }
   /**
    * 向实例中追加sql属性
    * @param {object} instance 
    */
   _sqlcb() {

      const { select, from, join, on } = this.sql;

      return {
         select: { ...select },
         from: { ...from },
         join: { ...join },
         on: { ...on }
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