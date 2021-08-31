import test from 'jtm';
import typea from 'typea';
import { Ormv, model } from '../../model/index.js';

const { $in, $as } = Ormv.Op;
const { tasksUser } = model;

test('find', async t => {

   const result = await tasksUser
      .schema("sz")
      .find({
         'id': $in(50, 51),
         'keywords': {}
      })
      .limit(1)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   // console.log(result);

   const schema = typea([{
      id: Number,
      keywords: Object,
      xx: String,
   }])

   const { error, data } = schema.looseVerify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})


test('select', async t => {

   const result = await tasksUser
      .find()
      .where({
         'id': $in(50, 51),
         keywords: {}
      })
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .offset(0)
      .limit(3)
      .return(
         'id',
         'uid',
         'keywords',
         'image',
         'phone',
         $as("email", "xx"),
         'createdAt',
         'updatedAt'
      )
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   // console.log(result);

   const schema = typea([{
      id: Number,
      keywords: Object,
      xx: String,
   }]);

   const { error, data } = schema.looseVerify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})


test('order offset limit', async t => {

   const result = await tasksUser
      .find()
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .offset(0)
      .limit(3)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   const schema = typea([{
      id: Number,
      keywords: Object,
      xx: String,
   }]);

   const { error, data } = schema.looseVerify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})

test('no select', async t => {

   const result = await tasksUser
      .find()
      .where({ "email": "adb@qq.com" })
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .catch(error => {
         console.log(error)
      })

   const schema = typea([{
      "email": "adb@qq.com"
   }]);

   const { error, data } = schema.strictVerify(result);

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})