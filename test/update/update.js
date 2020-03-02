'use strict';

const test = require('jtf');
const { Ormv, model } = require('../db/');

const { $in, } = Ormv.Op;
const { tasks } = model;

test('update', async t => {

   const update = {
      "area": "11",
      keywords: {
         area: `7'7`,
         state: true
      },
      area: null,
      state: false
   }

   const result = await tasks
      .update(update)
      .where({ "id": $in(6, 8, 9) })
      .or({ "area": "11" })
      .catch(error => {
         console.log(error);
         return {
            code: 1000,
            message: String(error)
         }
      })

   const item = {
      "id": 1,
      "user": "lixiang"
   }

   const result = await tasks
      .updateJson("list", item)
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