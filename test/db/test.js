
const Ormv = require('../../lib');

const { CHAR, INTEGER, JSONB, BOOLEAN } = Ormv.Type

module.exports = function (client) {

   const test = client.define('test', {
      'id': {
         type: INTEGER,
         primaryKey: true,
      },
      'name': {
         type: CHAR
      },
      'address': {
         type: JSONB,
         defaultValue: []
      },
      'email': {
         type: CHAR
      },
      'fftftg': {
         type: CHAR,
         defaultValue: "yyy"
      },
      'dfd': {
         type: CHAR,
         defaultValue: "uutyty"
      }
   })

   test.sync('increment');

   // test.sync();

   // test.sync('rebuild');



   return test;

}