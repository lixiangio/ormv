'use strict'

const test = require('jtf');
const { Ormv, model } = require('./db');

const { $sql, $and, $or, $in, $as } = Ormv.Op;
const { tasks } = model;

test('findPk ', async t => {

   const result = await tasks
      .findPk(6)
      .select('id', 'keywords')
      .catch(error => {
         console.log(error)
         const { message } = error
         return {
            code: 1000,
            message
         }
      })

   t.ok(result);

   console.log(result);

})