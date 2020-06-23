'use strict';

const test = require('jtf');
const { Ormv, model } = require('../../model/');

const { $in, } = Ormv.Op;
const { tasks } = model;

test('update', async t => {
  
  const result = await tasks
    .update({
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
        },
        {
          'id': 6,
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
    })
    .where({ "id": $in(6, 8, 9) })
    .or({ "area": "11" })
    .return("id", "area", "list", "keywords")
    .catch(error => {
      return {
        code: 1000,
        message: String(error)
      }
    })

  t.ok(result.id, result.message);

})