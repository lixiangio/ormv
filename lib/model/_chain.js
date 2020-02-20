'use strict';

module.exports = class {
   join(type = "INNER JOIN") {

      const { sql, modelNames } = this;

      sql.find.from = {
         key: "FROM",
         value: modelNames[0]
      }

      sql.find.join = {
         key: type,
         value: modelNames[1]
      }

      return this;

   }
   on(condition) {

      const { modelNames, modelsObject } = this;

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

      this.sql.find.on = {
         key: "ON",
         value: on.join(' AND ')
      }

      return this;

   }
   select(mergeFields) {

      const { aliasIndex, allFields, fields, modelNames } = this;

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

      this.sql.find.select = {
         key: "SELECT",
         value: select.join()
      }

      return this;

   }
}