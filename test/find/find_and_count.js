'use strict'

const test = require('jtf');
const { Ormv, model } = require('../db/');

const { tasks } = model;

test('find_and_count', async t => {

   const queryPromise = tasks.find().select('id', 'keywords')

   const countPromise = tasks.count();

   await Promise.all([queryPromise, countPromise]).catch(error => {

      console.log(error)

   }).then(data => {

      const [query, count] = data;

      t.ok(query);
      t.ok(count);

      console.log(count);

   })

})