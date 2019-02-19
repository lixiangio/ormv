'use strict'

const Ormv = require('..');
const whereGenerate = require('../lib/where');

const { Op } = Ormv

let where = whereGenerate({
   id: 6,
   keywords: {
      [Op.in]: ['ss', 9]
   },
   [Op.or]: [
      {
         email: {
            [Op.eq]: "x''xx@jj.com"
         },
         device: {
            [Op.lte]: 77
         }
      },
      {
         platform: {},
      },
      {
         bbs: "xxx@jj.com",
         cct: {},
      }
   ],
})

console.log(where)
