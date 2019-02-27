'use strict'

const test = require('jtf');
const common = require('./common');
const Ormv = require('..');

const { $and, $sql, $in, } = Ormv.Op;

const { $merge, $insertByPath, $insertFirst, $insert } = Ormv.Op;


test('update JSON', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const update = {
         email: "adb@qq.com",
         keywords: {
            area: `7'7`,
            state: true
         }
      }

      const result = await tasks
         .where({
            id: 6,
            keywords: $in(1, 2)
         })
         .or({
            email: "xxx@jj.com",
            device: {},
         })
         .or({
            platform: {},
         })
         .update(update)
         .catch(function (error) {
            let { message } = error
            console.log(error)
            return {
               code: 1000,
               message
            }
         })

      t.ok(result);

      console.log(result.rowCount);

   }

   await main().catch(error => {
      console.log(error)
   })

})


test('update JSON || 合并', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const update = {
         "keywords": $merge({
            "area": "5'68",
            "state": false
         })
      }

      const result = await tasks
         .where({
            id: 2
         })
         .update(update)
         .catch(error => {
            let { message } = error
            return {
               code: 1000,
               message
            }
         })

      t.ok(result)

      console.log(result.rowCount);

   }

   await main().catch(error => {
      console.log(error);
   })

})


test('update JSON Insert', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const update = {
         keywords: $insert('keywords', "{0}", {
            "area": "ggg'gggg'gg",
            "state": false
         })
      }

      const result = await tasks
         .where({
            id: 4
         })
         .update(update)
         .catch(error => {
            let { message } = error
            return {
               code: 1000,
               message
            }
         })

      t.ok(result)

      console.log(result.rowCount);

   }

   await main().catch(error => {
      console.log(error)
   })

})


test('update JSON insertFirst', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const update = {
         keywords: $insertFirst({
            "area": "ggg'gggg'gg",
            "state": false
         })
      }

      const result = await tasks
         .where({ id: 4 })
         .update(update)
         .catch(error => {
            let { message } = error
            return {
               code: 1000,
               message
            }
         })

      t.ok(result)

      console.log(result.rowCount);

   }

   await main().catch(error => {
      console.log(error)
   })

})


test('update JSON insertByPath', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const data = {
         keywords: $insertByPath('{1}', {
            "area": "ggg'gggg'gg",
            "state": false
         })
      }

      const result = await tasks
         .where({ id: 4 })
         .or({ id: 4 })
         .update(data)
         .catch(error => {
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