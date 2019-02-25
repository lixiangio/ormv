'use strict'

const test = require('jtf');
const common = require('./common');
const Ormv = require('../lib');

const { $sql, $and, $in } = Ormv.Op;

test('no arguments ', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks.findAll().catch(error => {
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

      console.log(tasks.name)

      const result = await tasks.find({
         select: ['id', 'keywords', $sql(`"platform" as "xx"`)],
         join: tasks,
         where: $and({ "tasks.id": 1 }),
         order: {
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         },
         limit: 10
      }).catch(error => {
         console.log(error)
      })

      // 仿sql链式风格
      const result = await tasks.select('id', 'keywords', $sql(`"platform" as "xx"`))
         .where({ id: 1 })
         .or({ id: 1 })
         .order({
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         })
         .one()
         .catch(error => {
            console.log(error)
         })

      const result = await tasks.select('id', 'keywords', $sql(`"platform" as "xx"`))
         .where({ id: 1 })
         .or({ id: 1 })
         .order({
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         })
         .primaryKey()
         .catch(error => {
            console.log(error)
         })

      t.ok(result)

      console.log(result.length)

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

      const result = await tasks.findAll({
         where: $and({
            "tasks.id": 1,
            "tasks.email": "Kareem.Kerluke@yahoo.com"
         }),
         order: {
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         },
      }).catch(error => {
         console.log(error)
      })

      t.ok(result)

      console.log(result)

   }

   await main().catch(error => {
      console.log(error)
   })

})

test('findAll group', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks.findAll({
         select: [$sql(`count(*)`)],
         where: $and({
            id: $in(1, 34),
            email: $in(
               "Kareem.Kerluke@yahoo.com",
               "Janae.Kiehn95@yahoo.com"
            )
         }),
         order: {
            'tasks."id"': "DESC",
            "tasks.keywords": "DESC"
         },
         group: ['platform', 'id']
      })

      t.ok(result)

      console.log(result)

   }

   await main().catch(function (error) {
      console.log(error)
   })

})