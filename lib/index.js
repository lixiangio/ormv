'use strict';

const pg = require('pg');
const entityModel = require('./model/entity.js');
const virtualsModel = require('./model/virtuals.js');
const Op = require('./operator/index.js');
const Sync = require('./sync.js');

const { Client, types } = pg;

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

      const model = new entityModel(this, name, fields);

      this.models[name] = model;

      return model;

   }
   /**
    * 定义虚拟模型，用一个或多个实体表模型创建虚拟模型
    */
   virtual(expression = '', fields, joinOn) {

      const [fromName, joinType, joinName] = expression.trim().split(/\s+/);

      const fromModel = this.models[fromName];

      if (!fromModel) {
         throw new Error(`未找到“${fromName}”模型，请确认模型是否已加载`);
      }

      if (typeof fields !== 'object') {
         throw new Error(`“${fromName}”模型字段定义参数必须为Object类型`);
      }

      if (joinType === undefined) {

         const { options } = fromModel;

         const newOptions = {};

         for (const name in fields) {
            const value = options[name];
            if (value) {
               newOptions[name] = value;
            }
         }

         return new entityModel(this, fromName, newOptions);

      } else {

         const joinModel = this.models[joinName];

         if (!joinModel) {
            throw new Error(`未找到“${joinName}”模型，请确认模型是否已加载`);
         }

         return new virtualsModel(this, { select: fields, models: [fromModel, joinModel], joinType, joinOn });

      }

   }
   /**
    * 同步单个模型
    * @param {string} path schema.table路径
    * @param {string} mode 同步模式
    */
   async sync(path = '', mode) {

      const pathArray = path.trim().split('.');

      let [schema, name] = pathArray;

      if (pathArray.length === 1) {
         name = schema;
         schema = 'public';
      }

      const model = this.models[name];

      if (model === undefined) {
         throw new Error(`未找到“${name}”模型`);
      }

      const sync = new Sync(model);

      if (sync[mode]) {
         await sync[mode](schema);
      } else {
         await sync.default(schema);
      }

   }
   /**
    * 批量同步所有模型
    * @param {string} schema pg中表分组（架构）
    * @param {string} mode 同步模式
    */
   async syncs(schema = 'public', mode) {

      const sql = `CREATE SCHEMA IF NOT EXISTS "${schema}";`

      await this.query(sql);

      this.logger(sql);

      for (const name in this.models) {

         const model = this.models[name];
         // await model.sync(schema, mode);

         await this.sync(`${schema}.${model.name}`, mode);

      }

   }
}

Ormv.Op = Op;

module.exports = Ormv;
