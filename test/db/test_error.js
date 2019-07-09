'use strict';

const { Ormv, ormv } = require('./connect.js');

const { char, email, integer, array, boolean } = Ormv.Type;

const test = ormv.define('test', {
   'xxx': {
      type: char,
      defaultValue: "yyy",
   },
   'ggg': {
      type: char,
      defaultValue: "uutyty",
   }
})

module.exports = test;