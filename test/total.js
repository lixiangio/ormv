'use strict'

const db = require('./db')

async function main() {

   const { tasks } = await db().catch(error => {
      console.log(error)
   })

   const result = await tasks
      .count()
      .catch(error => {
         console.log(error)
         const { message } = error
         return {
            code: 1000,
            message
         }
      })

   console.log(result)

   let query = tasks.find().select('id', 'keywords')

   let value = await query.then(function (data) {
      return data;
   })

   console.log(value)

   const count = await query.count();

   console.log(count);

}

main().catch(error => {
   console.log(error)
})