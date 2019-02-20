'use strict'

const test = require('jtf');
const common = require('./common')
const Ormv = require('..');
const { Op } = Ormv

test('findAll', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks.findAll({
         attributes: [
            'id',
            'keywords',
            `platform as xx`
         ],
         where: {
            id: 1
         },
         order: {
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         },
         limit: 10
      }).catch(error => {
         console.log(error)
      })

      t.ok(result)

      console.log(result.rows)

   }

   await main().catch(error => {
      console.log(error)
   })

})

test('no attributes', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks.findAll({
         where: {
            id: 1
         },
         order: {
            "tasks.id": "DESC",
            "tasks.keywords": "DESC"
         },
         // group: ['platform']
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

test('findAll Group', async t => {

   async function main() {

      const { tasks } = await common().catch(error => {
         console.log(error)
      })

      const result = await tasks.findAll({
         attributes: [
            'id',
            'keywords',
            `COUNT(platform) as xx`
         ],
         where: {
            id: {
               [Op.in]: [1, 34]
            },
            email: {
               [Op.in]: [
                  "Kareem.Kerluke@yahoo.com",
                  "Janae.Kiehn95@yahoo.com"
               ]
            }
         },
         order: {
            "tasks.id": "DESC",
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