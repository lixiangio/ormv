'use strict'

const test = require('jtf');
const { Ormv, model } = require('./db');

const { tasks } = model;

test('destroy by id', async t => {

   const result = await tasks
      .delete(3, 5, 9)
      .catch(error => {
         console.log(error)
      })

   console.log(result);

   t.deepEqual(result, { rowCount: 0 });

})

test('destroy', async t => {

   const result = await tasks
      .delete()
      .where({ id: 11111111 })
      .or({ id: 3 })
      .catch(error => {
         console.log(error)
      })

   console.log(result);

   t.deepEqual(result, { rowCount: 0 });

})