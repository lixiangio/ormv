'use strict'

const reg = /'/g;
function replace(data) {
   return String(data).replace(reg, '&#39;')
}

module.exports = replace