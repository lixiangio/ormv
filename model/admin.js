'use strict';

const { ormv } = require('./index.js');

const admin = ormv.model('admin', {
   'id': {
      type: 'integer',
      primaryKey: true
   },
   'name': {
      type: 'char',
      comment: "名称",
      uniqueIndex: true,
   },
   'address': [
      {
         type: 'array',
         comment: "地址"
      }
   ],
   'email': {
      type: 'email',
      uniqueIndex: true,
   },
})

// admin.sync();

// admin.sync('increment');

// admin.sync('rebuild');

module.exports = admin;
