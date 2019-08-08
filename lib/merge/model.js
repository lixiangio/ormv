'use strict';

const Find = require('./chain/find.js');

const op = Symbol.for('op');

class Model {
   /**
    * @param {Object} options 
    */
   constructor(options) {

      const { client, modules, condition } = options;

      this.client = client;
      this.fields = {};

      this.sql = {
         "select": '*',
         "from": undefined,
         "join": undefined,
         "on": undefined
      };

      const allFieldIndex = {};

      this.allFieldIndex = allFieldIndex;

      const modelNamesArray = [];
      const modelNamesObject = {};

      for (const module of modules) {

         const modelName = module.name;

         modelNamesArray.push(`"${modelName}"`);
         modelNamesObject[modelName] = module;

         for (const field in module.fields) {
            const fieldPath = `${modelName}.${field}`;
            allFieldIndex[fieldPath] = {
               modelName,
               field
            };
         }

      }

      this.sql.from = modelNamesArray[0];
      this.sql.join = modelNamesArray[1];

      // 多表合并条件，字段非空验证
      if (condition) {

         const on = [];

         for (const field1 in condition) {

            const keys = [];
            const field2 = condition[field1];

            for (const item of [field1, field2]) {
               const [moduleName, field] = item.split('.');
               const module = modelNamesObject[moduleName];
               if (module) {
                  if (module.fields[field]) {
                     keys.push(`"${moduleName}"."${field}"`);
                  } else {
                     throw new Error(`${modelNamesArray}复合模型condition选项中${item}字段不存在`);
                  }
               } else {
                  throw new Error(`${modelNamesArray}复合模型condition选项中${item}字段不存在`);
               }
            }

            const [k1, k2] = keys;
            on.push(`${k1} = ${k2}`);

         }

         this.sql.on = on.join(' AND ');

      } else {

         throw new Error(`${modelNamesArray}复合模型缺少condition选项`);

      }

      const { fields } = this;
      const opFields = options.fields;

      if (opFields) {

         for (const pathName of opFields) {

            if (typeof pathName === 'string') {

               const fieldInfo = allFieldIndex[pathName];

               if (fieldInfo) {
                  const { modelName, field } = fieldInfo;
                  if (fields[field]) {
                     throw new Error(`${modelNamesArray}复合模型中${field}字段存在命名冲突`);
                  } else {
                     fields[field] = `"${modelName}"."${field}"`;
                  }
               } else {
                  throw new Error(`${modelNamesArray}复合模型中未找到${pathName}字段`);
               }

            } else if (pathName[op]) {

               const { name, alias } = pathName;

               const fieldInfo = allFieldIndex[name];

               if (fieldInfo) {
                  if (fields[alias]) {
                     throw new Error(`${modelNamesArray}复合模型中${alias}字段存在命名冲突`);
                  } else {
                     fields[alias] = pathName[op];
                  }
               } else {
                  throw new Error(`${modelNamesArray}复合模型中未找到${pathName}字段`);
               }

            }

         }

         const select = [];

         for (const name in fields) {
            select.push(fields[name]);
         }

         this.sql.select = select.join();

      } else {

         throw new Error(`复合模型${modelNamesArray}缺少fields字段配置项`);

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
    * @param {*} id 
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