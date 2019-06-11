'use strict';

const test = require('jtf');
const { Ormv, ormv, model } = require('../db/');

const { tasks } = model;

test('count', async t => {

   const query = tasks.find({ 'tasks.id': 50, })

   const count = query.count();

   const result = await Promise.all([query, count]);

   t.ok(result);

   console.log(result);

})


test('find chain', async t => {

   const result = await tasks
      .find({ 'tasks.id': 50, })
      .count()
      .catch(error => {
         const { message } = error;
         return {
            code: 1000,
            message
         }
      })

   t.ok(result);

   console.log(result);

})