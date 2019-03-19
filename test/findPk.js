'use strict'

const db = require('./db')

async function main() {

   const { tasks } = await db().catch(error => {
      console.log(error)
   })

   const result = await tasks
      .findPk(6)
      .select('id', 'keywords')
      .catch(error => {
         console.log(error)
         const { message } = error
         return {
            code: 1000,
            message
         }
      })

   console.log(result);

}

main().catch(error => {
   console.log(error)
})