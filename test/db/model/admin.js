'use strict';

const { ormv } = require('../connect.js');

const admin = ormv.model('admin', {
   'id': {
      type: 'integer',
      primaryKey: true
   },
   'name': {
      type: 'char',
      uniqueIndex: true,
   },
   'address': {
      type: 'array',
      default: [],
   },
   'email': {
      type: 'email',
      uniqueIndex: true,
   },
})

// admin.sync();

// admin.sync('increment');

// admin.sync('rebuild');

module.exports = admin;