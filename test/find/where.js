'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { $in, $as } = Ormv.Op;
const { tasks } = model;

test('where', async t => {

   const result = await tasks
      .select('id', 'keywords', $as("state", "xx"))
      .where(
         {
            'id': $in(50, 51),
         },
         {
            'state': true,
            keywords: {}
         }
      )
      .or({
         'id': 5,
         'state': false,
      })
      .and({
         'id': 5,
         "keywords": {}
      })
      .or({ 'id': 5 })
      .limit(10)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(result);

})