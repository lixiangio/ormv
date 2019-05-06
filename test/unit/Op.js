'use strict';

return

const Ormv = require('../../lib');

const { Op } = Ormv;

const { $and, $in, $lte } = Op;

let options = $and({
   id: 6,
   keywords: $in('ss', '9'),
}).$or({
   email: "x''xx@jj.com",
   device: $lte(77)
}).$and({
   id: 6,
   keywords: $in('ss', '9'),
}).$or({
      bbs: "xxx@jj.com",
      cct: {},
   }
).$or({
   platform: {
      a: 1,
      b: 2
   },
})

console.log(options);
