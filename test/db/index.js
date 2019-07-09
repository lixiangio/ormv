'use strict';

const { Ormv, ormv } = require('./connect.js');
const tasks = require('./tasks.js');
const test = require('./test.js');
const test_error = require('./test_error.js');

module.exports = {
   Ormv,
   ormv,
   model: {
      tasks,
      test,
      test_error,
   },
};