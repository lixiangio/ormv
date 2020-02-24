'use strict';

const { Client, types } = require('pg');
const singleModel = require('./model/single.js');
const complexModel = require('./model/complex.js');
const Op = require('./operator/index.js');
const Type = require('./type.js');

// oid扩展
// 参考链接https://github.com/brianc/node-pg-types
const expand = {
   numrange: 3906
}

types.setTypeParser(expand.numrange, function (val) {
   return JSON.parse(val);
})

class Ormv extends Client {
   constructor(options) {

      const { username, logger } = options;

      options.user = username;

      super(options);

      this.models = {};

      if (logger === true) {

         this.logger = function (sql) {
            console.log('\x1b[33m[ormv]', `\x1b[32m${sql}\x1b[39m`);
         }

      } else if (typeof logger === 'function') {

         this.logger = logger;

      } else {

         this.logger = function () { }

      }

   }
   /**
    * 定义model,this.model别名,弃用
    * @param {string} name 模型名称
    * @param {object} fields 字段属性集合
    */
   define(name, fields) {

      return this.model(name, fields);

   }
   /**
    * 定义模型
    * @param {string} name 模型名称
    * @param {object} fields 字段属性集合
    */
   model(name, fields) {

      const model = new singleModel(this, { name, fields });

      this.models[name] = model;

      return model;

   }
   /**
    * 定义复合schema，将多个模型合并为单个模型
    */
   merge(options) {

      return new complexModel(this, options);

   }
   /**
    * 批量同步所有模型
    * @param {string} mode 同步模式
    */
   sync(mode) {

      for (const name in this.models) {
         const model = this.models[name];
         model.sync(mode);
      }

   }
}

Ormv.Op = Op;
Ormv.Type = Type;

module.exports = Ormv;