'use strict'

const common = require('./common')

async function main() {

   const { client } = await common().catch(error => {
      console.log(error)
   })

   const sql = `UPDATE tasks SET keywords = jsonb_insert(keywords, $1, $2, $3) WHERE (id = '4')`

   const value = [
      '{0}',
      {
         "area": `5'5666"<script src="/app.js"></script>`,
         "state": false,
         random: Math.random()
      },
      false
   ]

   const result1 = await client.query(sql, value).catch(error => {
      let { message } = error
      return {
         code: 1000,
         message
      }
   })

   // console.log(result1);

   // const result2 = await client.query(`SELECT * FROM "tasks" WHERE id = 4 LIMIT 1`).catch(error => {
   //    let { message } = error
   //    return {
   //       code: 1000,
   //       message
   //    }
   // })

   // console.log(result2);

}

main().catch(error => {
   console.log(error)
})