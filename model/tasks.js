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
        autoIncrement: true,
      },
      'state': 'boolean',
      'address': [
        {
          'id': {
            type: 'integer',
            autoIncrement: true,
          },
          name: 'string',
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

module.exports = tasks;
