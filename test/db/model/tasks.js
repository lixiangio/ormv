'use strict';

const { Ormv, ormv } = require('../connect.js');

const { string, integer, object, array, boolean } = Ormv.Type;

const tasks = ormv.model('tasks', {
  'id': {
    "type": integer,
    "primaryKey": true,
  },
  'uid': integer,
  'keywords': {
    "type": object,
    "schema": {
      "area": {
        "type": String,
      },
    }
  },
  'list': {
    'type': array,
    'schema': [{
      'state': {
        "type": Boolean,
        "default": false,
      }
    }]
  },
  "area": {
    'type': string,
    'allowNull': true,
  },
  'state': {
    'type': boolean,
    'default': true,
  }
})

// tasks.sync();

module.exports = tasks;
