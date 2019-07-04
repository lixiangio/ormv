'use strict';

const { Ormv, ormv } = require('./connect.js');

const { string, email, integer, object, array, boolean } = Ormv.Type;

const tasks = ormv.define('tasks', {
   'id': {
      "type": integer,
      "primaryKey": true
   },
   'keywords': {
      "type": object,
      "validate": {
         "area": {
            "type": String,
         },
      }
   },
   'list': {
      'type': array,
      'validate': [{
         'state': {
            "type": Boolean,
            "defaultValue": false,
         }
      }]
   },
   'email': {
      'type': email,
   },
   "area": {
      'type': string,
      'allowNull': true,
   },
   'state': {
      'type': boolean,
      'defaultValue': true,
   }
})

// tasks.sync('increment');

module.exports = tasks;