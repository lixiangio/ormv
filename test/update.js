'use strict'

const test = require('jtf');
const Ormv = require('..');
const common = require('./common');

test('update JSON', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const data = {
         email: "adb@qq.com"
      }

      const result = await tasks.update({
         where: {
            id: 6
         }
      }, data).catch(function (error) {
         console.log(error)
      })

      t.ok(result)

      console.log(result)

   }

   await main().catch(function (error) {
      console.log(error)
   })

})


test('update JSON || 合并', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const { merge } = Ormv.Op

      const data = {
         keywords: {
            [merge]: {
               "area": "568",
               "state": true
            }
         }
      }

      const result = await tasks.update({
         where: {
            id: 2
         }
      }, data).catch(function (error) {
         console.log(error)
      })

      t.ok(result)

      console.log(result)

   }

   await main().catch(function (error) {
      console.log(error)
   })

})


test('update JSON Insert', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
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

      const result = await tasks.update({
         where: {
            id: 4
         }
      }, data).catch(error => {
         console.log(error)
      })

      t.ok(result)

      console.log(result)

   }

   await main().catch(error => {
      console.log(error)
   })

})