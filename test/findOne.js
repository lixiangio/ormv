'use strict'

const common = require('./common')

async function main() {

   const { keywords } = await common().catch(error => {
      console.log(error)
   })

   const result = await keywords.findOne({
      order: {
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      }
   })

   console.log(result)

}

main().catch(function (error) {
   console.log(error)
})