'use strict';

const test = require('jtf');
const { Ormv, ormv, model } = require('./db');

const { $sql, $in, $as } = Ormv.Op;
const { tasks } = model;

test('sql', async t => {

   const sql = `UPDATE tasks SET keywords = jsonb_insert(keywords, $1, $2, $3) WHERE (id = '4')`

   const value = [
      '{0}',
      {
         "area": `5'5666"<script src="/app.js"></script>`,
         "state": false,
         random: Math.random()
      },
      false
   ]

   const result1 = await ormv.query(sql, value).catch(error => {
      const { message } = error
      console.log(error);
      return {
         code: 1000,
         message
      }
   })

   t.ok(!result1.code, result1.message);

   // const result2 = await client.query(`SELECT * FROM "tasks" WHERE id = 4 LIMIT 1`).catch(error => {
   //    let { message } = error
   //    return {
   //       code: 1000,
   //       message
   //    }
   // })

   // console.log(result2);

})