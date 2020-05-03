'use strict';

const test = require('jtf');
const { model } = require('../model/');

const { tasks } = model;

test('deletePk', async t => {

   const result = await tasks
      .deletePk(3, 5, 9)
      .catch(error => {
         console.log(error)
      });

   t.deepEqual(result, { rowCount: 0 });

})

test('destroy', async t => {

   const result = await tasks
      .delete({ id: 11111111 })
      .or({ id: 3 })
      .catch(error => {
         console.log(error)
      })

   t.deepEqual(result, { rowCount: 0 });

})
