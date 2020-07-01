'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../../model/');
const { find } = require('../../model/vTasks');

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

});
