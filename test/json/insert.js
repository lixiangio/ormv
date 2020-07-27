'use strict';

const test = require('jmr');
const { Ormv, model } = test;

const { $insert, $sql } = Ormv.Op;
const { tasks } = model;

test('update $insert', async t => {
   
   const result = await tasks
      .update({
         "area": '555',
         "list": $insert('list', "{0}", { "state": true })
      })
      .where({ id: 4 })
      .catch(error => {
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.ok(result.id);

   // console.log(result);

})