import test from 'jtm';
import typea from 'typea';
import { model } from '../../model/index.js';

const schema = typea({
   id: Number,
   keywords: Object,
   email: String,
   area: String,
   state: Boolean,
   createdAt: Date,
   updatedAt: Date,
   list: Array
})

const { tasks } = model;

test('findOne ', async t => {

   const result = await tasks
      .findOne({ id: 88 })
      .order({
         "id": "desc",
         "keywords": "desc"
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

});
