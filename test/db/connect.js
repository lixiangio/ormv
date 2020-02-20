'use strict';

const Ormv = require('../../lib/');

const ormv = new Ormv({
   host: 'localhost',
   database: 'test',
   username: 'postgres',
   password: 'M2Idiftre&34FS',
   port: 5532,
   logger: true,
});

ormv.connect(error => {
   if (error) {
      console.log('pgsql ', error.stack);
   } else {
      console.error('pgsql connect success');
   }
});

module.exports = {
   Ormv,
   ormv,
};