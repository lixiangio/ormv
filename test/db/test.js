'use strict';

const { Ormv, ormv } = require('./Ormv.js');

const { CHAR, INTEGER, ARRAY, BOOLEAN } = Ormv.Type;

const test = ormv.define('test', {
   'id': {
      type: INTEGER,
      primaryKey: true,
   },
   'name': {
      type: CHAR,
   },
   'address': {
      type: ARRAY,
      defaultValue: [],
   },
   'email': {
      type: CHAR,
   },
   'fftftg': {
      type: CHAR,
      defaultValue: "yyy",
   },
   'dfd': {
      type: CHAR,
      defaultValue: "uutyty",
   }
})

// test.sync('increment');

// test.sync();

// test.sync('rebuild');

module.exports = test;