'use strict';

const test = require('jmr');
const { Ormv, model } = test;

const { tasks } = model;
const { $insertByPath, } = Ormv.Op;

test('update $insertByPath', async t => {

   const result = await tasks
      .update({ list: $insertByPath('{1}', { "state": false }) })
      .where({ id: 4 })
      .or({ id: 4 })
      .catch(error => {
         console.log(error)
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.ok(result.id);

   // console.log(result);

})