'use strict';

const { Ormv, ormv } = require('../connect.js');

const { string, integer, object, array, boolean } = Ormv.Type;

const tasks = ormv.define('tasks', {
   'id': {
      "type": integer,
      "primaryKey": true
   },
   'uid': {
      "type": integer
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
   "area": {
      'type': string,
      'allowNull': true,
   },
   'state': {
      'type': boolean,
      'defaultValue': true,
   }
})

module.exports = tasks;