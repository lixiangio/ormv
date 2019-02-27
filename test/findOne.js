'use strict'

const db = require('./db')

async function main() {

   const { tasks } = await db().catch(error => {
      console.log(error)
   })

   const result = await tasks
      .where({
         id: 50,
         keywords: {}
      })
      .order({
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      })
      .findOne()
      .catch(error => {
         console.log(error)
      })

   console.log(result)

}

main().catch(error => {
   console.log(error)
})