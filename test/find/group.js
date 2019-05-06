'use strict';

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { $sql, $and, $or, $in, $as } = Ormv.Op;
const { tasks } = model;

test('find group', async t => {

   const result = await tasks
      .select($sql('count(*)'))
      .where({
         id: $in(1, 34),
         email: $in(
            "Kareem.Kerluke@yahoo.com",
            "Janae.Kiehn95@yahoo.com"
         )
      })
      .group('email', 'id')
      .order({
         'id': "DESC",
         "keywords": "DESC"
      })

   t.ok(result);

})