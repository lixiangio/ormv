'use strict';

const test = require('jtf');
const { Ormv, model } = require('./db/');

const { $in, $merge, $insertByPath, $insertFirst, $insert } = Ormv.Op;

const { tasks } = model;

test('update', async t => {

   const update = {
      email: "adb@qq.com",
      keywords: [],
      area: null,
      state: false
   }

   const result = await tasks
      .update(update)
      .where({ "id": 43 })
      .catch(error => {
         console.log(error)
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.ok(result);

   // console.log(result)

   t.ok(result.code === undefined, result.message);

})

test('update JSON', async t => {

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
         "id": $in(6, 8, 9)
      })
      .or({
         "email": "xxx@jj.com"
      })
      .catch(error => {
         console.log(error)
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.ok(result);

   // console.log(result)

   t.ok(result.code === undefined, result.message);

})

test('update JSON || 合并', async t => {

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

})

test('update JSON Insert', async t => {

   const update = {
      keywords: $insert('keywords', "{0}", {
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

})

test('update JSON insertFirst', async t => {

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

})

test('update JSON insertByPath', async t => {

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

})