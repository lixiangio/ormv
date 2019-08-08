'use strict'

const test = require('jtf');
const typea = require('typea');
const { Ormv, model } = require('../db/');

const { tasks } = model;

test('findOne ', async t => {

   const result = await tasks
      .findOne({ id: 88, })
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .catch(error => {
         console.log(error)
      })

   const { error, data } = typea(result, {
      id: Number,
      keywords: Object,
      email: String,
      area: String,
      state: Boolean,
      createdAt: Date,
      updatedAt: Date,
      list: Array
   })

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data)
   }

})