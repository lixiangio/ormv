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

      const { Op } = Ormv

      const result = await tasks.update({
         where: {
            id: 6,
            keywords: {
               [Op.in]: [1, 2]
            },
            [Op.or]: [
               {
                  email: {
                     [Op.eq]: "xxx@jj.com"
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


test('update JSON || 合并', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const { merge } = Ormv.Op

      const data = {
         keywords: {
            [merge]: {
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


test('update JSON Insert', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const { insert } = Ormv.Op

      const update = {
         keywords: {
            [insert]: {
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