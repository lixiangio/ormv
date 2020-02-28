'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const schema = typea([{
   id: Number,
   keywords: Object,
   email: String,
   area: String,
   state: Boolean,
   createdAt: Date,
   updatedAt: Date,
   list: Array
}]);

const { $in, $as } = Ormv.Op;
const { tasksUser } = model;

test('inner join', async t => {

   const result = await tasksUser
      .select('id', 'keywords', $as("email", "xx"))
      .schema("public")
      .where({
         id: $in(50, 51),
         keywords: {}
      })
      .or({ 
         'id': 5 ,
         'email': "adb@qq.com"
      })
      .and({
         'id': 5,
         "keywords": {}
      })
      .or({ 'id': 5 })
      .limit(10)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

      const { error, data } = schema.looseVerify(result);
   
      if (error) {
         throw TypeError(error);
      } else {
         t.ok(data)
      }

})