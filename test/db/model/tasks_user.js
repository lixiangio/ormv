'use strict';

const { Ormv, model } = require('..');

const { $as } = Ormv.Op;
const { tasks } = model;

const findModel = tasks
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
      'document.updatedAt'
   )
   .innerJoin('user')
   .on({ 'tasks.uid': 'user.id' })

console.log(Object.getPrototypeOf(findModel))

module.exports = findModel;