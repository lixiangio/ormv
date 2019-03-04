
const Ormv = require('../../');

const { STRING, INTEGER, JSONB, BOOLEAN } = Ormv.Type

module.exports = function (client) {

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
      "area": {
         type: STRING,
         allowNull: true
      },
      'state': {
         type: BOOLEAN,
         defaultValue: true
      }
   })

   // tasks.sync('increment');

   return tasks;

}