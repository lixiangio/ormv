'use strict'

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { test_error } = model;

test('error ', async t => {

   const result = await test_error
      .find({ "abs": 89 })
      .catch(error => {
         const { message } = error;
         return {
            code: 1000,
            message
         }
      })

   const { error, data } = typea(result, {
      code: 1000,
      message: '字段 "abs" 不存在'
   })

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})