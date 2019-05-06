'use strict';

const test = require('jtf');
const { Ormv, ormv, model } = require('../db/');

const { tasks } = model;

test('query ', async t => {

   const result = await tasks
      .count()
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

   let query = tasks.select('id', 'keywords')

   let value = await query.then(function (data) {
      return data;
   })

   // console.log(value)

   const count = await query.count();

   console.log(count);

})