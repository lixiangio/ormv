import test from 'jtm';

const { Ormv, model } = test;

const { $sql } = Ormv.Op;
const { tasks, admin } = model;

test('tasks', async t => {

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


test('admin', async t => {

  const result = await admin
    .schema('public')
    .insert({
      uid: 6,
      mobilePhone: '18555555556',
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


test('update', async t => {

  const data = {
    // id: 1,
    uid: 6,
    email: 'abs@xx.cc',
    area: '\\6666666666',
    keywords: {
      state: false,
      area: `\\k'k'kk"k<script\n\t type="text/javascript" src="/app.js"></script>`
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
  }

  const result = await tasks
    .schema('public')
    .insert(data)
    .update("id")
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

  t.ok(result.id, result.error);

});


test('ignore', async t => {

  const result = await tasks
    .schema('public')
    .insert({
      id: 1,
      uid: 6,
      email: 'abs@xx.cc',
      area: $sql('now()'),
      state: false
    })
    .ignore("id")
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

  t.ok(!result, '');

});


test('return', async t => {

  const result = await tasks
    .schema('public')
    .insert({
      // id: 101111,
      uid: 6,
      email: 'abs@xx.cc',
      area: $sql('now()'),
      state: false
    })
    .return('uid', 'state')
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

  t.ok(result.uid);

});