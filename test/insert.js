'use strict'

const common = require('./common')

async function main() {

   const { tasks } = await common().catch(error => {
      console.log(error)
   })

   const data = {
      keywords: {
         random: Math.random(),
         abs: `k'k'kk"k<script type="text/javascript" src="/app.js"></script>`
      }
   }

   const result = await tasks.insert(data).catch(error => {
      let { message } = error
      return {
         code: 1000,
         message
      }
   })

   console.log(result)

}

main().catch(error => {
   console.log(error)
})