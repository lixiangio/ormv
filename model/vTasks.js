'use strict';

const { ormv } = require('./index.js');

require('./tasks.js');
require('./user.js');

const vTasks = ormv.virtual('tasks', {
   id: "tasks",
   uid: "tasks",
   keywords: "tasks",
   list: "tasks",
   area: "tasks",
   state: "tasks",
   createdAt: "tasks",
   updatedAt: "tasks",
});

// const vTasks = ormv.virtual('tasks', [
//    'id',
//    'uid',
//    'keywords',
//    'list as xx',
//    'area',
//    'state',
//    'createdAt',
//    'updatedAt'
// ]);

module.exports = vTasks;
