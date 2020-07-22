'use strict'

const test = require('jmr');
const { model } = require('../../model');

const { tasks } = model;

test('findNull ', async t => {

   const result = await tasks
      .findOne({ id: 1111111111, })
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(result === null);

});