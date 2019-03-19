'use strict'

const test = require('jtf');
const db = require('./db');
const Ormv = require('..');

const { $in, } = Ormv.Op;

const { $merge, $insertByPath, $insertFirst, $insert } = Ormv.Op;

test('update JSON', async t => {

   async function main() {

      const { tasks } = await db().catch(error => {
         console.log(error)
      })

      const update = {
         email: "adb@qq.com",
         keywords: {
            area: `7'7`,
            state: true
         },
         area: null,
         state: false
      }

      const result = await tasks
         .update(update)
         .where({
            id: $in(6, 8, 9)
         })
         .or({
            email: "xxx@jj.com"
         })
         .catch(error => {
            console.log(error)
            return {
               code: 1000,
               message: String(error)
            }
         })

      console.log(result)

      t.ok(result.code === undefined, result.message);

   }

   await main().catch(error => {
      console.log(error)
   })

})


test('update JSON || 合并', async t => {

   async function main() {

      const { tasks } = await db().catch(error => {
         console.log(error)
      })

      const update = {
         "keywords": $merge({
            "area": "5'68",
            "state": false
         })
      }

      const result = await tasks
         .update(update)
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


test('update JSON Insert', async t => {

   async function main() {

      const { tasks } = await db().catch(error => {
         console.log(error)
      })

      const update = {
         keywords: $insert('keywords', "{0}", {
            "area": "ggg'gggg'gg",
            "state": false
         })
      }

      const result = await tasks
         .update(update)
         .where({
            id: 4
         })
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
      console.log(error)
   })

})


test('update JSON insertFirst', async t => {

   async function main() {

      const { tasks } = await db().catch(error => {
         console.log(error)
      })

      const update = {
         keywords: $insertFirst({
            "area": "ggg'gggg'gg",
            "state": false
         })
      }

      const result = await tasks
         .update(update)
         .where({ id: 4 })
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
      console.log(error)
   })

})


test('update JSON insertByPath', async t => {

   async function main() {

      const { tasks } = await db().catch(error => {
         console.log(error)
      })

      const data = {
         keywords: $insertByPath('{1}', {
            "area": "ggg'gggg'gg",
            "state": false
         })
      }

      const result = await tasks
         .update(data)
         .where({ id: 4 })
         .or({ id: 4 })
         .catch(error => {
            console.log(error)
            return {
               code: 1000,
               message: String(error)
            }
         })

      t.ok(result)

      console.log(result)

   }

   await main().catch(error => {
      console.log(error)
   })

})