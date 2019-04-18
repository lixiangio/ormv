'use strict'

const test = require('jtf');
const db = require('./db');

test('destroy', async t => {

   async function main() {

      const { tasks } = await db().catch(error => {
         console.log(error)
      })

      const result = await tasks
         .delete()
         .where({ id: 11111111 })
         .or({ id: 3 })
         .catch(error => {
            console.log(error)
         })

      console.log(result);

      t.deepEqual(result, { rowCount: 0 });

   }

   await main().catch(function (error) {
      console.log(error)
   })

})