'use strict'

const test = require('jtf');
const common = require('./common');

test('destroy', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks
         .where({ id: 1 })
         .or({ id: 3 })
         .delete()
         .catch(error => {
            console.log(error)
         })

      t.ok(true)

      console.log(result);

   }

   await main().catch(function (error) {
      console.log(error)
   })

})