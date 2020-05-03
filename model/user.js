'use strict';

const { ormv } = require('./index.js');

const model = ormv.model('user', {
   'id': {
      type: 'integer',
      primaryKey: true,
   },
   'type': {
      type: 'string',
      allowNull: false,
   },
   'name': {
      type: 'string',
      allowNull: false,
   },
   'age': 'integer',
   'image': 'string',
   'phone': 'string',
   'password': 'string',
   'email': 'string'
});

module.exports = model;
