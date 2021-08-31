import test from 'jtm';
import typea from 'typea';
const { Ormv, model } = test;

const { $as } = Ormv.Op;
const { vTasks } = model;


test('select', async t => {

  const result = await vTasks
    .select('id', 'keywords', 'createdAt')
    .offset(2)
    .limit(3)
    .catch(error => {
      console.log(error);
    })

  const schema = typea([{
    id: Number,
    keywords: Object,
    xx: String,
  }])

  const { error, data } = schema.looseVerify(result);

  t.ok(data, error);

});

test('insert', async t => {

  const result = await vTasks
    .schema('public')
    .insert({
      // 'id': 8,
      'name': '小明',
      'age': 10,
      'image': './abc.jpg',
      'phone': '1856666666',
      'password': '12323',
      'email': 'abs@xx.cc',
    })
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

    // console.log(result)

  t.ok(result.id, result.error);

});

