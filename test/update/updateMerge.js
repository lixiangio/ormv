'use strict'

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db');

const { tasks } = model;

test('updateMerge', async t => {

   const update = {
      "keywords": {
         "area": "5'68",
         "state": false
      }
   }

   const result = await tasks
      .updateMerge(update)
      .where({ id: 90 })
      .catch(error => {
         return {
            code: 1000,
            message: String(error)
         }
      })

   t.deepEqual(result, { rowCount: 1 });

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

      const { error, data } = typea(result, {
         id: Number,
         keywords: Object,
         email: String,
         area: String,
         state: Boolean,
         createdAt: Date,
         updatedAt: Date,
         list: Array
      })
   
      if (error) {
         throw TypeError(error);
      } else {
         t.ok(data)
      }

})