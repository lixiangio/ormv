'use strict'

const test = require('jtf');
const typea = require('typea');
const { model } = require('../../model/');

const schema = typea({
   id: Number,
   keywords: Object,
})

const { tasks } = model;

test('findPk ', async t => {

   const result = await tasks
      .schema("public")
      .findPk(1)
      .select('id', 'keywords', 'ids')
      .catch(error => {
         const { message } = error;
         return {
            code: 1000,
            message
         }
      })

   // console.log(result);

   const { error, data } = schema.strictVerify(result)

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})