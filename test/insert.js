'use strict'

const db = require('./db')

async function main() {

   const { tasks } = await db().catch(error => {
      console.log(error)
   })

   const data = {
      keywords: {
         state: false,
         area: `k'k'kk"k<script type="text/javascript" src="/app.js"></script>`
      }
   }

   const result = await tasks.insert(data).catch(error => {
      let { message } = error
      return {
         code: 1000,
         message
      }
   })

   console.log(result.rowCount);

}

main().catch(error => {
   console.log(error)
})