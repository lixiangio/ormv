'use strict'

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { tasks } = model;

test('findPk ', async t => {

   const result = await tasks
      .findPk(6)
      .select('id', 'keywords')
      .catch(error => {
         const { message } = error;
         return {
            code: 1000,
            message
         }
      })

   const { error, data } = typea(result, {
      id: Number,
      keywords: Object,
   })

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})