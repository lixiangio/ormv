'use strict'

const Ormv = require('..');

async function main() {

   const client = new Ormv({
      db: {
         host: 'localhost',
         database: 'test',
         username: 'xiangla',
         password: '*ns99*621',
         port: 5432,
      },
      logger: true
   })

   await client.connect()

   const { STRING, INTEGER, JSONB, BOOLEAN } = Ormv.Type

   const tasks = client.define('tasks', {
      'id': {
         type: INTEGER,
         primaryKey: true,
      },
      'keywords': {
         type: JSONB,
         validate: {
            "area": {
               type: String
            },
            'state': {
               type: Boolean,
               defaultValue: false
            }
         }
      },
      'email': {
         type: STRING,
         validate: {
            isEmail: true
         }
      },
      // "area": {
      //    type: STRING
      // },
      // 'state': {
      //    type: BOOLEAN,
      //    defaultValue: true
      // }
   })

   return {
      client,
      tasks
   }

}

module.exports = main