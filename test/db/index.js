'use strict';

const { Ormv, ormv } = require('./connect.js');
const user = require('./model/user.js');
const tasks = require('./model/tasks.js');
const admin = require('./model/admin.js');
const tasksUser = require('./model/tasksUser.js');

module.exports = {
   Ormv,
   ormv,
   model: {
      tasks,
      user,
      admin,
      tasksUser,
   },
};