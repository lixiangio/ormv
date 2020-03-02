'use strict';

const { Ormv, ormv } = require('../connect.js');

const { string, integer, boolean, timestamp } = Ormv.Type;

const tasks = ormv.model('tasks', {
  'id': {
    "type": integer,
    "primaryKey": true,
  },
  'uid': integer,
  'keywords': {
    "area": string,
    "createdAt": timestamp,
  },
  'list': [
    {
      'state': {
        "type": boolean,
        "default": false,
      }
    }
  ],
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
