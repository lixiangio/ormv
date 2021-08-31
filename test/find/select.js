import test from 'jtm';
import typea from 'typea';
import { Ormv, model } from '../../model/index.js';
// import { find } from '../../model/vTasks.js';

const { $as } = Ormv.Op;
const { tasks } = model;


test('select', async t => {

  const result = await tasks
    .select('id', 'keywords', $as("area", "xx"), 'createdAt')
    .offset(2)
    .limit(3)
    .catch(error => {
      console.log(error);
    })

  console.log(result);

  const schema = typea([{
    id: Number,
    keywords: Object,
    xx: String,
  }])

  const { error, data } = schema.looseVerify(result);

  t.ok(data, error);

});
