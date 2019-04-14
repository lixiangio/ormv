'use strict'

const test = require('jtf');
const db = require('./db');
const Ormv = require('..');

test('updateMerge JSON || 合并', async t => {

   async function main() {

      const { tasks } = await db().catch(error => {
         console.log(error)
      })

      const update = {
         "keywords": {
            "area": "5'68",
            "state": false
         }
      }

      const result = await tasks
         .updateMerge(update)
         .where({ id: 2 })
         .catch(error => {
            console.log(error)
            return {
               code: 1000,
               message: String(error)
            }
         })

      t.ok(result)

      console.log(result.rowCount);

   }

   await main().catch(error => {
      console.log(error);
   })

})