'use strict';

const test = require('jtf');
const { Ormv, model } = require('../model/');

const { $sql } = Ormv.Op;
const { tasks, admin } = model;

test('insert tasks', async t => {

  const result = await tasks
    .schema('public')
    .insert({
      uid: 6,
      email: 'abs@xx.cc',
      area: $sql('now()'),
      state: false
    })
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

  t.ok(result, result.error);

});


test('insert tasks ignore', async t => {

  const result = await tasks
    .schema('public')
    .insert(
      {
        id: 1,
        uid: 6,
        email: 'abs@xx.cc',
        area: $sql('now()'),
        state: false
      },
      { ignore: "id" }
    )
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

  t.ok(!result, '');

});


test('insert update', async t => {

  const result = await tasks
    .schema('public')
    .insert(
      {
        // id: 1,
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
                name: 111,
                admin: "666"
              }
            ],
            'test': {
              a: 1,
              b: 2
            },
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
        ],
        state: false
      },
      { update: "id" }
    )
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

  t.ok(result.id, result.error);

});
