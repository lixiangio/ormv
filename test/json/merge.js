'use strict';

const test = require('jmr');
const { Ormv, model } = require('../../model');

const { $merge } = Ormv.Op;
const { tasks } = model;

test('update $merge', async t => {

   const result = await tasks
      .update({
         "keywords": $merge({
            "area": "5'68",
            "state": false
         })
      })
      .where({ id: 2 })
      .catch(error => {
         console.log(error)
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.ok(result);

   console.log(result.rowCount);

})