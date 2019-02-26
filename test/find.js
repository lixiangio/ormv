'use strict'

const test = require('jtf');
const common = require('./common');
const Ormv = require('../lib');

const { $sql, $and, $in, $as } = Ormv.Op;

test('no arguments ', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks.find().catch(error => {
         console.log(error)
      })

      t.ok(result)

      console.log(result.length)

   }

   await main().catch(error => {
      console.log(error)
   })

})

test('select', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks
         .select('id', 'keywords', $as("platform", "xx"))
         .where({
            id: $in(50, 51),
            keywords: {}
         })
         .or({ id: 5 })
         .and({
            id: 5,
            keywords: {}
         })
         .or({ id: 5 })
         .order({
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         })
         .find()
         .catch(error => {
            console.log(error)
         })

      t.ok(true)

      console.log(result)

   }

   await main().catch(error => {
      console.log(error)
   })

})

test('no select', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks
         .where({
            "tasks.id": 1,
            "tasks.email": "Kareem.Kerluke@yahoo.com"
         })
         .order({
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         })
         .find()
         .catch(error => {
            console.log(error)
         })

      t.ok(result)

      console.log(result)

   }

   await main().catch(error => {
      console.log(error)
   })

})

test('find group', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks
         .select($sql(`count(*)`))
         .where({
            id: $in(1, 34),
            email: $in(
               "Kareem.Kerluke@yahoo.com",
               "Janae.Kiehn95@yahoo.com"
            )
         })
         .order({
            'tasks."id"': "DESC",
            "tasks.keywords": "DESC"
         })
         .group('platform', 'id')
         .find()

      t.ok(result)

      console.log(result);

   }

   await main().catch(function (error) {
      console.log(error)
   })

})