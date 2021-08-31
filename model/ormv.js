import Ormv from '../build/index.js';

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
      console.error('pgsql ', error.stack);
   } else {
      console.log('pgsql connect success');
   }
});

export default ormv;
