'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { $sql, $in, $as } = Ormv.Op;
const { tasks } = model;

test('select', async t => {

   const result = await tasks
      .select('id', 'keywords', $as("email", "xx"), 'createdAt')
      .offset(0)
      .limit(3)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   const { error, data } = typea(result, [{
      id: Number,
      keywords: Object,
      xx: String,
   }])

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})

test('no select', async t => {

   const result = await tasks
      .find()
      .where({
         "email": "adb@qq.com"
      })
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .catch(error => {
         console.log(error)
      })

   const { error, data } = typea(result, [{
      "email": "adb@qq.com"
   }]);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})