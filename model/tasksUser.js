'use strict';

const { ormv } = require('./index.js');
const tasks = require('./tasks.js');
const user = require('./user.js');

const tasksUser = ormv.mixing({
   select: {
      id: "tasks",
      uid: "tasks",
      keywords: "tasks",
      list: "tasks",
      area: "tasks",
      state: "tasks",
      createdAt: "tasks",
      updatedAt: "tasks",
      name: "user",
      image: "user",
      phone: "user",
      email: "user",
      xxx: "user.age",
      ggr: "user.age",
   },
   from: tasks,
   innerJoin: user,
   on: { 'tasks.uid': 'user.id' },
});

// console.log(tasksUser);

module.exports = tasksUser;
