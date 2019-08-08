'use strict';

const { Client } = require('pg');
const Model = require('./model.js');
const mergeModel = require('./merge/model.js');
const Type = require('./type.js');
const Op = require('./operator/');

class Ormv extends Client {
   constructor(options) {

      const { db, logger } = options;
      db.user = db.username;

      super(db);
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
    * 定义schema
    * @param {*} name 模型名称
    * @param {*} fields 字段属性集合
    */
   define(name, fields) {

      const model = new Model({
         name,
         fields,
         client: this
      });

      this.models[name] = model;

      return model;

   }
   /**
    * 合并多个模型
    */
   merge(options) {

      options.client = this;

      return new mergeModel(options);

   }
}

Ormv.Op = Op;
Ormv.Type = Type;

module.exports = Ormv;