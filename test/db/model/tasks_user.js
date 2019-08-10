'use strict';

const { Ormv, ormv } = require('../connect.js');
const tasks = require('./tasks.js');
const user = require('./user.js');

const { $as } = Ormv.Op;

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
      $as('user.age', 'xxx'),
      $as('user.age', 'ggr'),
   ],
});

// console.log(tasksUser);

module.exports = tasksUser;