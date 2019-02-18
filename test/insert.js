'use strict'

const common = require('./common')

async function main() {

   const { tasks } = await common().catch(error => {
      console.log(error)
   })

   const data = {
      keywords: {
         random: Math.random()
      }
   }

   const result = await tasks.insert(data).catch(error => {
      console.log(error)
   })

   console.log(result)

}

main().catch(error => {
   console.log(error)
})