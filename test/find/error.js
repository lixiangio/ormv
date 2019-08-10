'use strict'

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { error: modelError } = model;

test('error', async t => {

   try {
      await modelError
         .find({ "abs": 89 })
   } catch (error) {
      t.ok(error);
   }

})