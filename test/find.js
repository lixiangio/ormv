'use strict';

const test = require('jtf');
const { Ormv, model } = require('./db');

const { $sql, $and, $or, $in, $as } = Ormv.Op;
const { tasks } = model;

test('no arguments ', async t => {

   const result = await tasks.find().catch(error => {
      console.log(error)
   })

   t.ok(result);

   console.log(result.length);

})

test('select', async t => {

   const result = await tasks
      .select('tasks.id', 'keywords', $as("tasks.email", "xx"), 'createdAt')
      .offset(0)
      .limit(1)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(true)

   console.log(result)

})

return


test('no select', async t => {

   const result = await tasks
      .find()
      .where({
         "tasks.id": 1,
         "tasks.email": "Kareem.Kerluke@yahoo.com"
      })
      .order({
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(result)

   console.log(result)

})

test('leftJoin', async t => {

   const result = await tasks
      .select('tasks.id', 'keywords', $as("tasks.email", "xx"))
      .leftJoin("user")
      .on({ 'tasks.id': 'user.id' })
      .where({
         'tasks.id': $in(50, 51),
         keywords: {}
      })
      .or({ 'tasks.id': 5 })
      .and({
         'tasks.id': 5,
         keywords: {}
      })
      .or({ 'tasks.id': 5 })
      .order({
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      })
      .limit(10)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(true)

   console.log(result)

})

test('order', async t => {

   const result = await tasks
      .select('tasks.id', 'keywords', $as("tasks.email", "xx"))
      .order({
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      })
      .limit(3)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(true)

   console.log(result)

})

test('find group', async t => {

   const result = await tasks
      .select($sql('count(*)'))
      .where({
         id: $in(1, 34),
         email: $in(
            "Kareem.Kerluke@yahoo.com",
            "Janae.Kiehn95@yahoo.com"
         )
      })
      .order({
         'tasks.id': "DESC",
         "tasks.keywords": "DESC"
      })
      .group('email', 'id')

   t.ok(result)

   console.log(result)

})