'use strict';

const { Ormv } = require('../connect.js');
const tasks = require('./tasks.js');

const { $as } = Ormv.Op;

const model = tasks
   .select(
      'document.id',
      $as('document.uid', 'uid'),
      'document.title',
      'document.document',
      'user.name',
      'user.age',
      'user.phone',
      'user.password',
      'user.email',
      'document.createdAt',
      'document.updatedAt',
   )
   .innerJoin('user')
   .on({ 'tasks.uid': 'user.id' })

   console.log(model.sql)

module.exports = model;