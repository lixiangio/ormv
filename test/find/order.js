'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { $sql, $in, $as } = Ormv.Op;
const { tasks } = model;

test('order', async t => {

   const result = await tasks
      .select('tasks.id', 'keywords', $as("tasks.email", "xx"))
      .order({
         "tasks.id": "desc",
         "tasks.keywords": "desc"
      })
      .limit(3)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(true)

   console.log(result)

})