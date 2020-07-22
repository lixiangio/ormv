'use strict';

const test = require('jmr');
const { Ormv, model } = require('../model/');

const { $sql } = Ormv.Op;
const { admin } = model;

test('uniqueIndex', async t => {

  const random = Math.random();

  const result = await admin
    .insert({ email: `${random}abs@xx.cc` })
    .catch(error => {

      return {
        code: 1000,
        error: String(error)
      }

    })

  t.ok(!result.error, result.error);

});
