'use strict'

const test = require('jtf');
const common = require('./common');
const Ormv = require('../lib');

const { $sql, $and, $in } = Ormv.Op;

// test('no arguments ', async t => {

//    async function main() {

//       const { tasks } = await common().catch(error => {
//          console.log(error)
//       })

//       const result = await tasks.findAll().catch(error => {
//          console.log(error)
//       })

//       t.ok(result)

//       console.log(result.length)

//    }

//    await main().catch(error => {
//       console.log(error)
//    })

// })

test('select', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks.select('id', 'keywords', $sql(`"platform" as "xx"`))
         .where({ id: 50 })
         // .or({ id: 5 })
         .order({
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         })
         .one()
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

// test('no select', async t => {

//    async function main() {

//       const { tasks } = await common().catch(error => {
//          console.log(error)
//       })

//       const result = await tasks.findAll({
//          where: $and({
//             "tasks.id": 1,
//             "tasks.email": "Kareem.Kerluke@yahoo.com"
//          }),
//          order: {
//             "tasks.id": "DESC",
//             "tasks.keywords": "DESC"
//          },
//       }).catch(error => {
//          console.log(error)
//       })

//       t.ok(result)

//       console.log(result)

//    }

//    await main().catch(error => {
//       console.log(error)
//    })

// })

// test('findAll group', async t => {

//    async function main() {

//       const { tasks } = await common().catch(error => {
//          console.log(error)
//       })

//       const result = await tasks.findAll({
//          select: [$sql(`count(*)`)],
//          where: $and({
//             id: $in(1, 34),
//             email: $in(
//                "Kareem.Kerluke@yahoo.com",
//                "Janae.Kiehn95@yahoo.com"
//             )
//          }),
//          order: {
//             'tasks."id"': "DESC",
//             "tasks.keywords": "DESC"
//          },
//          group: ['platform', 'id']
//       })

//       t.ok(result)

//       console.log(result)

//    }

//    await main().catch(function (error) {
//       console.log(error)
//    })

// })