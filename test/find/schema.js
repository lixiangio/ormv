import test from 'jtm';
import typea from 'typea';
import { Ormv, model } from '../../model/index.js';

const { tasks } = model;

test('schema ', async t => {

  const schema = typea(
    [
      {
        id: Number,
        keywords: Object,
      }
    ]
  )

  const result = await tasks
    .schema("bj")
    .select('id', 'keywords')
    .limit(3)
    .catch(error => {
      const { message } = error;
      return {
        code: 1000,
        message
      }
    })

  const { error, data } = schema.strictVerify(result)

  if (error) {
    throw TypeError(error);
  } else {
    t.ok(data);
  }

})