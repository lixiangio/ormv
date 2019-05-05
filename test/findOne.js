'use strict'

const test = require('jtf');
const { Ormv, model } = require('./db');

const { $sql, $and, $or, $in, $as } = Ormv.Op;
const { tasks } = model;

test('findOne ', async t => {

   const result = await tasks
      .findOne({
         id: 22,
         // keywords: {}
      })
      .order({
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(result);

   console.log(result)

})