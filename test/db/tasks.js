'use strict';

const { Ormv, ormv } = require('./Ormv.js');

const { STRING, INTEGER, OBJECT, ARRAY, BOOLEAN } = Ormv.Type;

const tasks = ormv.define('tasks', {
   'id': {
      type: INTEGER,
      primaryKey: true
   },
   'keywords': {
      type: OBJECT,
      validate: {
         "area": {
            type: String,
         },
      }
   },
   'list': {
      type: ARRAY,
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