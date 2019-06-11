'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { $sql, $and, $or, $in, $as } = Ormv.Op;
const { tasks } = model;

test('no arguments ', async t => {

   const result = await tasks.find().limit(3).catch(error => {
      console.log(error)
   })

   const { error, data } = typea(result, [{
      id: Number,
      keywords: Object,
      email: String,
      area: String,
      state: Boolean,
      createdAt: Date,
      updatedAt: Date,
      list: Array
   }])

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})

test('select', async t => {

   const result = await tasks
      .select('id', 'tasks.keywords', $as("tasks.email", "xx"), 'createdAt')
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
         "tasks.email": "adb@qq.com"
      })
      .order({
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      })
      .catch(error => {
         console.log(error)
      })

   const { error, data } = typea(result, [{
      "email": "adb@qq.com"
   }])

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})