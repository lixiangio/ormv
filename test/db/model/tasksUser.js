'use strict';

const { ormv } = require('../connect.js');
const tasks = require('./tasks.js');
const user = require('./user.js');

const tasksUser = ormv.merge({
   modules: [tasks, user],
   mode: "INNER JOIN",
   condition: { 'tasks.uid': 'user.id' },
   fields: [
      'tasks.id',
      'tasks.uid',
      'tasks.keywords',
      'tasks.list',
      'tasks.area',
      'tasks.state',
      'tasks.createdAt',
      'tasks.updatedAt',
      'user.name',
      'user.image',
      'user.phone',
      'user.email',
      'user.age as xxx',
      'user.age as ggr'
   ],
});

module.exports = tasksUser;