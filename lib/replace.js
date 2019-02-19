'use strict'

const reg = /'/g;

/**
 * 将单引号转义为非sql保留关键字的字符串实体，防止外部注入
 * @param {*} data 
 */
function replace(data) {
   return String(data).replace(reg, "''")
}

module.exports = replace