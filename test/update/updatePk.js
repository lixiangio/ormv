'use strict';

const test = require('jmr');
const { Ormv, model } = require('../../model/');

const { $in, } = Ormv.Op;
const { tasks } = model;

test('update', async t => {

  const update = {
    id: 6,
    area: "11",
    keywords: {
      area: `888`,
      state: true
    },
    area: null,
    state: true
  }

  const result = await tasks
    .updatePk(6, update)
    .catch(error => {
      return {
        code: 1000,
        message: String(error)
      }
    });

  t.ok(result.id, result.message);

})