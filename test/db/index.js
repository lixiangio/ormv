'use strict'

const Ormv = require('../../lib');

const tasks = require('./tasks');
const test = require('./test');

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

   return {
      client,
      tasks: tasks(client),
      test: test(client)
   }

}

module.exports = main