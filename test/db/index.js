'use strict';

const { Ormv, ormv } = require('./connect.js');
const tasks = require('./model/tasks.js');
const test = require('./model/test.js');
const test_error = require('./model/test_error.js');

module.exports = {
   Ormv,
   ormv,
   model: {
      tasks,
      test,
      test_error,
   },
};