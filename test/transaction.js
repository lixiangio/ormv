'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, ormv, model } = require('../model/');

const { $in, $as } = Ormv.Op;
const { tasks } = model;


test('select', async t => {

  const transaction = await ormv.transaction();

  const result = await tasks
    .schema()
    .transaction(transaction)
    .select('id', 'keywords', $as("area", "xx"), 'createdAt')
    .offset(2)
    .limit(3)
    .catch(error => {
      console.log(error);
    })

  const update = {
    area: "11",
    area: null,
    state: true
  }

  await tasks
    .transaction(transaction)
    .update(update)
    .where({ "id": $in(6, 8, 9) })
    .or({ "area": "11" })
    .return("id", "area", "list", "keywords")
    .catch(error => {
      return {
        code: 1000,
        message: String(error)
      }
    })

  await transaction.commit();

  const schema = typea([{
    id: Number,
    keywords: Object,
    xx: String,
  }])

  const { data, error } = schema.looseVerify(result);

  t.ok(data, error);

})
