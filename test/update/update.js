'use strict';

const test = require('jtf');
const { Ormv, model } = require('../db/');

const { $in, } = Ormv.Op;
const { tasks } = model;

test('update', async t => {

  const update = {
    area: "11",
    keywords: {
      area: `7'7`,
      state: true
    },
    list: [
      {
        'state': true,
        'address': [
          {
            name: 'xx123'
          },
          {
            name: '666'
          }
        ]
      }
    ],
    area: null,
    state: true
  }

  const result = await tasks
    .update(update)
    .where({ "id": $in(6, 8, 9) })
    .or({ "area": "11" })
    .catch(error => {
      return {
        code: 1000,
        message: String(error)
      }
    })

  t.ok(result);

  t.ok(result.code === undefined, result.message);

})