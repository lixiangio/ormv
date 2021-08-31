import test from 'jtm';
const { model } = test;

const { tasks } = model;

test('findNull ', async t => {

   const result = await tasks
      .findOne({ id: 1111111111, })
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(result === null);

});