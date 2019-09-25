'use strict';

const user = require('./model/user.js');
const tasks = require('./model/tasks.js');
const admin = require('./model/admin.js');
const tasksUser = require('./model/tasksUser.js');
const error = require('./model/error.js');
const { Ormv, ormv } = require('./connect.js');

module.exports = {
   Ormv,
   ormv,
   model: {
      tasks,
      user,
      admin,
      error,
      tasksUser,
   },
};