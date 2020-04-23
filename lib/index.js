'use strict';

const { Client, types } = require('pg');
const singleModel = require('./model/single.js');
const mixingModel = require('./model/mixing.js');
const Op = require('./operator/index.js');

// oid扩展
// 参考链接https://github.com/brianc/node-pg-types
const expand = {
   numrange: 3906
}

types.setTypeParser(expand.numrange, function (val) {
   return JSON.parse(val);
})

class Ormv extends Client {
   /**
    * 实例化数据库配置
    * @param {object} config 
    */
   constructor(config) {

      const { username, logger } = config;

      config.user = username;

      super(config);

      this.config = config;
      this.models = {};

      if (logger === true) {

         this.logger = function (sql) {
            console.log('\x1b[33m[ormv]', `\x1b[32m${sql}\x1b[39m`);
         }

      } else if (typeof logger === 'function') {

         this.logger = logger;

      } else {

         this.logger = function () { };

      }

   }
   /**
    * 定义模型
    * @param {string} name 模型名称
    * @param {object} fields 字段属性集合
    */
   model(name, fields) {

      const model = new singleModel(this, name, fields);

      this.models[name] = model;

      return model;

   }
   /**
    * 定义复合schema，将多个模型合并为单个模型
    */
   mixing(options) {

      return new mixingModel(this, options);

   }
   /**
    * 批量同步所有模型
    * @param {string} mode 同步模式
    * @param {string} schema pg中表分组（架构）
    */
   async sync(mode, schema = 'public') {

      if (this.config.sync === true) {

         const sql = `CREATE SCHEMA IF NOT EXISTS "${schema}";`

         await this.query(sql);

         this.logger(sql);

         for (const name in this.models) {
            const model = this.models[name];
            await model.sync(mode, schema);
         }

      }

   }
}

Ormv.Op = Op;

module.exports = Ormv;