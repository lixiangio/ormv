'use strict';

const test = require('jmr');
const { Ormv, model } = test;

const { $insertFirst, } = Ormv.Op;
const { tasks } = model;

test('update $insertFirst', async t => {

   const update = {
      list: $insertFirst({
         "area": "ggg'gggg'gg",
         "state": false
      })
   }

   const result = await tasks
      .update(update)
      .where({ id: 4 })
      .catch(error => {
         console.log(error)
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.ok(result)

   console.log(result.rowCount);

})