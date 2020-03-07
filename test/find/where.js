'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { $in, $as, $scope } = Ormv.Op;
const { tasks } = model;

test('where', async t => {

  const result = await tasks
    .select('id', 'keywords', $as("state", "xx"))
    .where(
      {
        state: true,
        keywords: {}
      },
      {
        'id': $in(50, 51),
      },
      {
        state: true,
        keywords: {}
      }
    )
    .limit(10)
    .then(data => {
      return data;
    })
    .catch(error => {
      console.log(error);
    })

  const schema = typea([{
    id: Number,
    keywords: Object,
    xx: String,
  }]);

  const { error, data } = schema.looseVerify(result);

  if (error) {
    throw TypeError(error);
  } else {
    t.ok(data);
  }

})

test('where', async t => {

  const result = await tasks
    .select('id', 'keywords', $as("state", "xx"))
    .where({
      state: true,
      keywords: {}
    })
    .or({
      'id': 5,
      'state': false,
    })
    .and({
      'id': 5,
      "keywords": {}
    })
    .or({ id: 5 })
    .limit(10)
    .then(data => {
      return data;
    })
    .catch(error => {
      console.log(error);
    })

  const schema = typea([{
    id: Number,
    keywords: Object,
    xx: String,
  }]);

  const { error, data } = schema.looseVerify(result);

  if (error) {
    throw TypeError(error);
  } else {
    t.ok(data);
  }

})

test('where $scope', async t => {

  const result = await tasks
    .select('id', 'keywords', $as("state", "xx"))
    .where({
      'id': $scope(1, 100),
      'state': true,
      keywords: {}
    })
    .or({
      'id': 5,
      'state': false,
    })
    .limit(10)
    .then(data => {
      return data;
    })
    .catch(error => {
      console.log(error);
    })

  const schema = typea([{
    id: Number,
    keywords: Object,
    xx: String,
  }]);

  const { error, data } = schema.looseVerify(result);

  if (error) {
    throw TypeError(error);
  } else {
    t.ok(data);
  }

})