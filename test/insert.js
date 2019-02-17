'use strict'

const common = require('./common')

async function main() {

   const { keywords } = await common().catch(error => {
      console.log(error)
   })

   const data = {
      keywords: {
         random: Math.random()
      }
   }

   const result = await keywords.insert(data)

   console.log(result)

}

main().catch(function (error) {
   console.log(error)
})