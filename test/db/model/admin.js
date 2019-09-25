'use strict';

const { Ormv, ormv } = require('../connect.js');

const { char, email, integer, array, boolean } = Ormv.Type;

const admin = ormv.define('admin', {
   'id': {
      type: integer,
      primaryKey: true
   },
   'name': {
      type: char,
      uniqueIndex: true,
   },
   'address': {
      type: array,
      defaultValue: [],
   },
   'email': {
      type: email,
      uniqueIndex: true,
   },
})

// admin.sync();

// admin.sync('increment');

// admin.sync('rebuild');

module.exports = admin;