'use strict'

const kReg = /"/g;

/**
 * 键名双引号过滤，将key中的双引号替换为空，防止截断注入
 * @param {*} data 
 */
function replaceKey(key) {

   key = String(key).replace(kReg, "");
   key = key.split('.');
   key = key.map(item => `"${item}"`);
   return key.join('.');

}

const vReg = /'/g;

/**
 * 键值单引号替换为双单引号，防止截断注入
 * 在sql中两个连续的单引号会被视为普通的单引号字符，而非sql语法保留字
 * @param {*} data 
 */
function replaceValue(value) {
   return String(value).replace(vReg, "''")
}

module.exports = {
   replaceKey,
   replaceValue
}