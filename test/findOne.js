'use strict'

const db = require('./db')

async function main() {

   const { tasks } = await db().catch(error => {
      console.log(error)
   })

   const result = await tasks
      .findOne({
         id: 22,
         // keywords: {}
      })
      .order({
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      })
      .catch(error => {
         console.log(error)
      })

   console.log(result)

}

main().catch(error => {
   console.log(error)
})