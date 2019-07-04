'use strict';

const { Ormv, ormv } = require('./connect.js');
const tasks = require('./tasks.js');
const test = require('./test.js');

module.exports = {
   Ormv,
   ormv,
   model: {
      tasks,
      test,
   },
};