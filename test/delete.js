import test from 'jtm';

const { Ormv, model } = test;

const { tasks } = model;

const { $in } = Ormv.Op;

test('delete', async t => {

   const result = await tasks
      .delete({ id: 3764 })
      .catch(error => {
         console.log(error)
      });

   t.deepEqual(result, null);

})

test('deletePk', async t => {

   const result = await tasks
      .deletePk(3)
      .catch(error => {
         console.log(error)
      });

   t.deepEqual(result, null);

})

test('delete null', async t => {

   const result = await tasks
      .deletePk(111111111)
      .catch(error => {
         console.log(error)
      });

   t.deepEqual(result, null);

})


test('delete return', async t => {

   const result = await tasks
      .deletePk(3767)
      .return('id', 'uid', 'state')
      .catch(error => {
         console.log(error)
      });

   t.deepEqual(result, null);

})

test('delete noReturn', async t => {

   const result = await tasks
      .deletePk(2895)
      .noReturn('id', 'uid', 'state')
      .catch(error => {
         console.log(error)
      });

   t.deepEqual(result, null);

})

test('deleteMany', async t => {

   const result = await tasks
      .deleteMany({ id: $in(3772, 3776, 3779) })
      .or({ id: 3 })
      .catch(error => {
         console.log(error)
      })

   t.deepEqual(result, { rowCount: 0 });

})