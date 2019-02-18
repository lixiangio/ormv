'use strict'

const common = require('./common');

async function main() {

   const { tasks } = await common().catch(error => {
      console.log(error)
   })

   const result = await tasks.destroy({
      where: {
         id: 1
      }
   }).catch(error => {
      console.log(error)
   })

   console.log(result)

}

main().catch(function (error) {
   console.log(error)
})