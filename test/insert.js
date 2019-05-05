'use strict';


const test = require('jtf');
const { Ormv, model } = require('./db');

const { $sql, $and, $or, $in, $as } = Ormv.Op;
const { tasks } = model;

test('insert ', async t => {

   const data = {
      email: 'abs@xx.cc',
      keywords: {
         state: false,
         area: `k'k'kk"k<script type="text/javascript" src="/app.js"></script>`
      }
   }

   const result = await tasks.insert(data).catch(error => {
      console.log(error)
      return {
         code: 1000,
         message: String(error)
      }
   })

   t.ok(result);
   
   console.log(result);

})