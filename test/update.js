'use strict'

const test = require('jtf');
const common = require('./common');
const Ormv = require('..');
const { Get, Set } = Ormv

test('update JSON', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const data = {
         email: "adb@qq.com",
         keywords: { area: `7'7`, state: true }
      }

      const result = await tasks.update({
         where: {
            id: 6,
            keywords: {
               [Get.in]: [1, 2]
            },
            [Get.or]: [
               {
                  email: {
                     [Get.eq]: "xxx@jj.com"
                  },
                  device: {},
               },
               {
                  platform: {},
               }
            ],
         }
      }, data).catch(function (error) {
         let { message } = error
         return {
            code: 1000,
            message
         }
      })

      t.ok(result)

      console.log(result)

   }

   await main().catch(function (error) {
      console.log(error)
   })

})


test.skip('update JSON || 合并', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const data = {
         keywords: {
            [Set.merge]: {
               "area": "5'68",
               "state": false
            }
         }
      }

      const result = await tasks.update({
         where: {
            id: 2
         }
      }, data).catch(function (error) {
         let { message } = error
         return {
            code: 1000,
            message
         }
      })

      t.ok(result)

      console.log(result)

   }

   await main().catch(function (error) {
      console.log(error)
   })

})


test.skip('update JSON Insert', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const update = {
         keywords: {
            [Set.insert]: {
               path: "{0}",
               value: {
                  "area": "ggg'gggg'gg",
                  "state": false
               }
            }
         }
      }

      const result = await tasks.update({
         where: {
            id: 4
         }
      }, update).catch(error => {
         let { message } = error
         return {
            code: 1000,
            message
         }
      })

      t.ok(result)

      console.log(result)

   }

   await main().catch(error => {
      console.log(error)
   })

})