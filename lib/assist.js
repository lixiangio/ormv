'use strict';

const { ormv } = require('./index.js');

const { models } = ormv;

module.exports = {
   /**
    * @param {String} name 模型名称
    */
   model(...modelNames) {

      const modelFields = {};

      if (modelNames.length === 1) {

         const [name] = modelNames;

         const model = models[name];

         if (model === undefined) {
            throw new Error(`${name}模型不存在`);
         }

         Object.assign(modelFields, model.fields);

         return {
            fields(...include) {
   
               const result = {};
   
               if (include.length) {
                  for (const name in modelFields) {
                     if (include.includes(name) === true) {
                        result[name] = name;
                     }
                  }
               } else {
                  for (const name in modelFields) {
                     result[name] = name;
                  }
               }
   
               return result;
   
            },
            fieldsExclude(...exclude) {
   
               const result = {};
   
               for (const name in modelFields) {
                  if (exclude.includes(name) === false) {
                     result[name] = name;
                  }
               }
   
               return result;
   
            },
         }

      } else if (modelNames.length > 1) {

         for (const name of modelNames) {

            const model = models[name];

            if (model === undefined) {
               throw new Error(`${name}模型不存在`);
            }

            const item = {};

            for (const field in model.fields) {
               item[`${name}.${field}`] = field;
            }

            Object.assign(modelFields, item);

         }

         return {
            fields(...include) {
   
               const result = {};
   
               if (include.length) {
                  for (const name in modelFields) {
                     if (include.includes(name) === true) {
                        result[name] = modelFields[name];
                     }
                  }
               } else {
                  for (const name in modelFields) {
                     result[name] = modelFields[name];
                  }
               }
   
               return result;
   
            },
            fieldsExclude(...exclude) {
   
               const result = {};
   
               for (const name in modelFields) {
                  if (exclude.includes(name) === false) {
                     result[name] = modelFields[name];
                  }
               }
   
               return result;
   
            },
         }

      }

   }
};