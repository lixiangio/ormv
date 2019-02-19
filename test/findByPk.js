'use strict'

const common = require('./common')

async function main() {

   const { tasks } = await common().catch(error => {
      console.log(error)
   })

   const result = await tasks.findByPk(6, {
      // attributes: ['id', 'keywords']
   }).catch(err => {
      return { error: err.message }
   })

   console.log(result)

}

main().catch(error => {
   console.log(error)
})