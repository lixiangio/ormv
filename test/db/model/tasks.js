'use strict';

const { ormv } = require('../connect.js');

const tasks = ormv.model('tasks', {
  'id': {
    "type": 'integer',
    "primaryKey": true,
  },
  'uid': 'integer',
  'keywords': {
    'area': 'string',
    "createdAt": 'timestamp',
  },
  'list': [
    {
      'state': 'boolean',
      'address': [
        {
          name: 'string'
        }
      ]
    }
  ],
  "area": 'string',
  'state': {
    'type': 'boolean',
    'default': true,
  }
})

// tasks.sync();

module.exports = tasks;
