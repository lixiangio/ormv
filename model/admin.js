'use strict';

const { ormv } = require('./index.js');

module.exports = ormv.model('admin', {
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
   'mobilePhone': {
      type: 'mobilePhone',
      uniqueIndex: true,
   },
   'email': {
      type: 'email',
      uniqueIndex: true,
   },
});
