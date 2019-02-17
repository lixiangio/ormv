'use strict'

const Ormv = require('..');

async function main() {

   const client = new Ormv({
      db: {
         host: 'localhost',
         database: 'test',
         user: 'xiangla',
         password: '*ns99*621',
         port: 5432,
      },
      logger: true
   })

   await client.connect()

   const { CHAR, INTEGER, JSONB, BOOLEAN } = Ormv.Type

   const keywords = client.define('tasks', {
      'id': {
         type: INTEGER,
         primaryKey: true,
      },
      'keyword': {
         type: CHAR,
         validate: {
            isEmail: true
         }
      },
      'input': {
         type: JSONB,
         validate: {
            "area": {
               type: CHAR
            },
            'state': {
               type: BOOLEAN,
               defaultValue: true
            }
         }
      },
      "area": {
         type: STRING
      },
      'state': {
         type: BOOLEAN,
         defaultValue: true
      }
   })

   return {
      keywords
   }

}

module.exports = main