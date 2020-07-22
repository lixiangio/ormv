'use strict';

const test = require('jmr');
const typea = require('typea');
const { Ormv, ormv, model } = require('../model/');

const { $in, $as } = Ormv.Op;
const { tasks } = model;

test('transaction', async t => {

  const transaction = await ormv.transaction();

  const result = await tasks
    .transaction(transaction)
    .select('id', 'keywords', $as("area", "xx"), 'createdAt')
    .offset(2)
    .limit(3)
    .catch(error => {
      console.log(error);
    })

  await tasks
    .transaction(transaction)
    .update({
      area: "11",
      area: null,
      state: true
    })
    .where({ "id": $in(6, 8, 9) })
    .or({ "area": "11" })
    .return("id", "area", "list", "keywords")
    .catch(error => {
      transaction.rollback();
      return {
        code: 1000,
        message: String(error)
      }
    })


  // transaction.rollback();
  transaction.commit();

  const schema = typea([{
    id: Number,
    keywords: Object,
    xx: String,
  }])

  const { data, error } = schema.looseVerify(result);

  t.ok(data, error);

})
