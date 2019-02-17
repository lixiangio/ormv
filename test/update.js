'use strict'

const test = require('jtf');
const Ormv = require('..');
const common = require('./common');

test.skip('update JSON', async t => {

   async function main() {

      const { keywords } = await common().catch(error => {
         console.log(error)
      })

      const data = {
         keywords: {
            p: 666
         }
      }

      const result = await keywords.update({
         where: {
            id: 1
         }
      }, data)

      t.ok(result)

      console.log(result)

   }

   await main().catch(function (error) {
      console.log(error)
   })

})


test('update JSON || 合并', async t => {

   async function main() {

      const { keywords } = await common().catch(error => {
         console.log(error)
      })

      const { merge } = Ormv.Op

      const data = {
         keywords: {
            [merge]: { "q": 568 }
         }
      }

      const result = await keywords.update({
         where: {
            id: 2
         }
      }, data)

      t.ok(result)

      console.log(result)

   }

   await main().catch(function (error) {
      console.log(error)
   })

})


test.skip('update JSON Insert', async t => {

   async function main() {

      const { keywords } = await common().catch(error => {
         console.log(error)
      })

      const { insert } = Ormv.Op

      const data = {
         keywords: {
            [insert]: {
               path: "{0}",
               value: {
                  random: Math.random()
               }
            }
         }
      }

      const result = await keywords.update({
         where: {
            id: 4
         }
      }, data)

      t.ok(result)

      console.log(result)

   }

   await main().catch(function (error) {
      console.log(error)
   })

})