'use strict'

const test = require('jmr');
const typea = require('typea');
const { Ormv, model } = test;

const { tasks } = model;

test('updateMerge', async t => {

   const result = await tasks
      .updateMerge({
         "keywords": {
            "area": "5'68",
            "state": false
         }
      })
      .where({ id: 90 })
      .catch(error => {
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.ok(result.id);

})

test('updateMerge return()', async t => {

   const update = {
      "keywords": {
         "area": "5'68",
         "state": false
      }
   }

   const result = await tasks
      .updateMerge(update)
      .where({ id: 90 })
      .return()
      .catch(error => {
         return {
            code: 1000,
            message: String(error)
         }
      })

   const types = typea({
      id: Number,
      keywords: Object,
      email: String,
      area: String,
      state: Boolean,
      createdAt: Date,
      updatedAt: Date,
      list: Array
   });

   const { error, data } = types.looseVerify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})