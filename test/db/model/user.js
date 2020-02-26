'use strict';

const { Ormv, ormv } = require('../connect.js');

const { string, integer } = Ormv.Type;

const model = ormv.model('user', {
   'id': {
      type: integer,
      primaryKey: true,
   },
   'name': {
      type: string,
      allowNull: false,
   },
   'age': integer,
   'image': string,
   'phone': string,
   'password': string,
   'email': string
});

// model.sync();

module.exports = model;