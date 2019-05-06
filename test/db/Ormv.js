'use strict';

const Ormv = require('../../lib/');

const ormv = new Ormv({
   db: {
      host: 'localhost',
      database: 'test',
      username: 'xiangla',
      password: '*ns99*621',
      port: 5432,
   },
   logger: true,
});

ormv.connect();

module.exports = {
   Ormv,
   ormv,
};