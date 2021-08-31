import ormv from './ormv.js';

export default ormv.model('tasks', {
  'id': {
    "type": 'integer',
    "primaryKey": true,
  },
  'uid': 'integer',
  'keywords': {
    'state': 'boolean',
    'area': 'string',
    "createdAt": 'timestamp',
  },
  'list': [
    {
      'id': {
        type: 'integer',
        sequence: true,
      },
      'state': 'boolean',
      'address': [
        {
          'id': {
            type: 'integer',
            sequence: true
          },
          'name': 'string',
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
  "state": {
    'type': 'boolean',
    'default': true,
  },
  "modes": 'jsonb',
  "ids": "integer[]",
  "createdAt": {
    type: 'timestamp',
    default: 'now()',
  },
  "updatedAt": {
    type: 'timestamp',
    default: 'now()',
  },
});
