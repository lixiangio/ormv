import test from 'jtm';
import typea from 'typea';
import { Ormv, model } from '../../model/index.js';

const { $sql } = Ormv.Op;
const { tasks } = model;

test('sql', async t => {

   const result = await tasks
      .findOne({ id: $sql(`in('188', '120', '170')`) })
      .catch(error => {
         console.log(error)
      })

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

   const { error, data } = schema.looseVerify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})