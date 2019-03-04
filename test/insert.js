'use strict'

const db = require('./db')

async function main() {

   const { tasks } = await db().catch(error => {
      console.log(error)
   })

   const data = {
      email: 'abs@xx.cc',
      keywords: {
         state: false,
         area: `k'k'kk"k<script type="text/javascript" src="/app.js"></script>`
      }
   }

   const result = await tasks.insert(data).catch(error => {
      console.log(error)
      return {
         code: 1000,
         message: String(error)
      }
   })

   console.log(result);

}

main().catch(error => {
   console.log(error)
})