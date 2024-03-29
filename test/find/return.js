import test from 'jtm';
import typea from 'typea';
const { Ormv, model } = test;
// import { find } from '../../model/vTasks.js';

const { $as } = Ormv.Op;
const { tasks } = model;


test('return', async t => {

  const result = await tasks
    .find()
    .offset(2)
    .limit(3)
    .return('id', 'keywords', $as("area", "xx"), 'createdAt')
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

})

test('noReturn', async t => {

  const [row] = await tasks
    .find()
    .where({ "uid": 1 })
    .order({
      "id": "desc",
      "keywords": "desc"
    })
    .noReturn('id', 'keywords', 'createdAt')
    .catch(error => {
      console.log(error);
    })

  t.ok(!row.id);

})
