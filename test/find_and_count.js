'use strict'

const db = require('./db')

async function main() {

   const { tasks } = await db().catch(error => {
      console.log(error)
   })

   const queryPromise = tasks
      .find()
      .select('id', 'keywords')

   const countPromise = tasks.count();

   await Promise.all([queryPromise, countPromise])
      .catch(error => {

         console.log(error)

      })
      .then(data => {

         const [query, count] = data;
         console.log(query);
         console.log(count);

      })

   // console.log(count);

}

main().catch(error => {
   console.log(error)
})