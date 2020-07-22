'use strict';

const test = require('jmr');
const typea = require('typea');
const { Ormv, model } = require('../../model/');

const { $in } = Ormv.Op;
const { tasks } = model;

test('find group', async t => {

   const result = await tasks
      .select()
      .where({
         id: $in(1, 34),
         area: $in(
            "Kareem.Kerluke@yahoo.com",
            "Janae.Kiehn95@yahoo.com"
         )
      })
      .group('area', 'id')
      .order({
         'id': "desc",
         "keywords": "desc"
      })

      console.log(result)

   t.ok(result);

})