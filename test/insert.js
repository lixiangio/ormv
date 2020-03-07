'use strict';

const test = require('jtf');
const { Ormv, model } = require('./db/');

const { $sql } = Ormv.Op;
const { tasks } = model;

test('insert', async t => {

  const result = await tasks
    .schema('public')
    .insert({
      uid: 6,
      email: 'abs@xx.cc',
      area: $sql('now()'),
      keywords: {
        state: false,
        area: `k'k'kk"k<script type="text/javascript" src="/app.js"></script>`
      },
      list: [
        {
          'state': true,
          'address': [
            {
              name: "pppp",
              admin: "666"
            }
          ]
        },
        {
          'state': false,
          'address': [
            {
              name: "X688df"
            },
            {
              name: "pppp",
              admin: 888
            },
          ]
        }
      ]
    })
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

  t.ok(result.id, result.error);

});
