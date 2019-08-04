'use strict';

const user = require('./model/user.js');
const tasks = require('./model/tasks.js');
const test = require('./model/test.js');
const test_error = require('./model/test_error.js');
const { Ormv, ormv } = require('./connect.js');

module.exports = {
   Ormv,
   ormv,
   model: {
      tasks,
      user,
      test,
      test_error,
   },
};