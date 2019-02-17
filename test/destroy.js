'use strict'

const common = require('./common');

async function main() {

   const { keywords } = await common().catch(error => {
      console.log(error)
   })

   const result = await keywords.destroy({
      where: {
         id: 1
      }
   })

   console.log(result)

}

main().catch(function (error) {
   console.log(error)
})