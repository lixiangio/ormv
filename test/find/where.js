'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { $sql, $in, $as } = Ormv.Op;
const { tasks } = model;

test('leftJoin', async t => {

   const result = await tasks
      .select('tasks.id', 'keywords', $as("tasks.email", "xx"))
      .leftJoin("user")
      .on({ 'tasks.id': 'user.id' })
      .where({
         'tasks.id': $in(50, 51),
         keywords: {}
      })
      .or({
         'tasks.id': 5,
         'tasks.email': "adb@qq.com"
      })
      .and({
         'tasks.id': 5,
         "keywords": {}
      })
      .or({ 'tasks.id': 5 })
      .limit(10)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(result)

})


test('rightJoin', async t => {

   const result = await tasks
      .select('tasks.id', 'keywords', $as("tasks.email", "xx"))
      .where(
         {
            'tasks.id': $in(50, 51),
         },
         {
            'tasks.email': 'abs@xx.cc',
            keywords: {}
         }
      )
      .or({
         'tasks.id': 5,
         'tasks.email': "adb@qq.com"
      })
      .and({
         'tasks.id': 5,
         "keywords": {}
      })
      .or({ 'tasks.id': 5 })
      .limit(10)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(result)

})