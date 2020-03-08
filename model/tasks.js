'use strict';

const { ormv } = require('./index.js');

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
      'id': {
        type: 'integer',
        default: `nextval('tasks_id_seq')`,
      },
      'state': 'boolean',
      'address': [
        {
          name: 'string'
        }
      ],
      'test': 'object',
      'createdAt': {
        type: 'timestamp',
        default: 'now()',
      },
      'updatedAt': {
        type: 'timestamp',
        default: 'now()',
      },
    }
  ],
  "area": 'string',
  'state': {
    'type': 'boolean',
    'default': true,
  },
  "createdAt": {
    type: 'timestamp',
    default: 'now()',
  },
  "updatedAt": {
    type: 'timestamp',
    default: 'now()',
  },
})

// tasks.sync();

module.exports = tasks;
