'use strict';

const { Ormv, ormv } = require('./Ormv.js');

const { STRING, INTEGER, JSONB, BOOLEAN } = Ormv.Type;

const tasks = ormv.define('tasks', {
   'id': {
      type: INTEGER,
      primaryKey: true
   },
   'keywords': {
      type: JSONB,
      validate: {
         "area": {
            type: String,
         },
      }
   },
   'list': {
      type: JSONB,
      validate: [
         {
            'state': {
               type: Boolean,
               defaultValue: false,
            }
         }
      ]
   },
   'email': {
      type: STRING,
      validate: {
         isEmail: true,
      }
   },
   "area": {
      type: STRING,
      allowNull: true,
   },
   'state': {
      type: BOOLEAN,
      defaultValue: true,
   }
})

// tasks.sync('increment');

module.exports = tasks;