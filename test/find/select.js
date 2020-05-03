'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../../model/');

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

  const schema = typea([{
    id: Number,
    keywords: Object,
    xx: String,
  }])

  const { error, data } = schema.looseVerify(result);

  t.ok(data, error);

})


test('no select', async t => {

  const result = await tasks
    .find()
    .where({ "uid": 1 })
    .order({
      "id": "desc",
      "keywords": "desc"
    })
    .catch(error => {
      console.log(error);
    })

  const schema = typea([{ "uid": Number }])

  const { error, data } = schema.strictVerify(result);

  t.ok(data, error);

})
