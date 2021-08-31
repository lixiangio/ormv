import test from 'jtm';
import typea from 'typea';
import { model } from '../../model/index.js';

const schema = typea({
   id: Number,
   keywords: Object,
})

const { tasks } = model;

test('findPk ', async t => {

   const result = await tasks
      .schema("public")
      .findPk(1)
      .return('id', 'keywords', 'ids')
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