'use strict'

const Ormv = require('../../lib/');
const whereGenerate = require('../../lib/where');

const { Get, Set } = Ormv

let where = whereGenerate({
   id: 6,
   keywords: {
      [Get.in]: ['ss', 9]
   },
   [Get.or]: [
      {
         email: {
            [Get.eq]: "x''xx@jj.com"
         },
         device: {
            [Get.lte]: 77
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
