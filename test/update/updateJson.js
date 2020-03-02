'use strict';

const test = require('jtf');
const { Ormv, model } = require('../db/');

const { tasks } = model;

return

test('update json', async t => {

   const update = {
      "id": 1,
      "user": "lixiang"
   }

   const result = await tasks
      .updateJson("list", update)
      .where({ "id": 1 })
      .or({ "area": "11" })
      .catch(error => {
         console.log(error);
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.ok(result);

   t.ok(result.code === undefined, result.message);

})