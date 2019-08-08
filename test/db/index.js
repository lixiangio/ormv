'use strict';

const user = require('./model/user.js');
const tasks = require('./model/tasks.js');
const test = require('./model/test.js');
const tasksUser = require('./model/tasks_user.js');
const error = require('./model/error.js');
const { Ormv, ormv } = require('./connect.js');

module.exports = {
   Ormv,
   ormv,
   model: {
      tasks,
      user,
      test,
      error,
      tasksUser,
   },
};