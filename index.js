'use strict'

const { Client } = require('pg');
const Model = require('./lib/model');
const Op = require('./lib/options');
const Type = require('./lib/type');

class Ormv extends Client {
   constructor(options) {
      super(options.db)
      let { logger } = options
      if (logger === true) {
         this.logger = console.log
      } else if (typeof logger === 'function') {
         this.logger = logger
      } else {
         this.logger = function () { }
      }
      this.models = []
   }
   define(name, schema) {

      const model = new Model({
         name,
         schema,
         client: this
      })

      this.models.push(model);

      return model;

   }
}

Ormv.Op = Op

Ormv.Type = Type

module.exports = Ormv