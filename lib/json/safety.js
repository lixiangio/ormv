'use strict';

/**
 * json对象字符串安全过滤器
 */

const sqlReg = /'/g;
const jsonReg = /"/g;

/**
 * 单引号通过双单转义，输出安全的sql字符串
 * 双引号通过反斜杠转义，输出合法的json字符串值
 * @param {string} origin 
 */
function safetyString(origin) {

  const sqlValue = origin.replace(sqlReg, "''").replace(jsonReg, '\\"');

  return `"${sqlValue}"`;

}

/**
 * 使用JSON.stringify()序列化json
 * @param {string} origin 
 */
function jsonToString(origin) {

  return JSON.stringify(origin).replace(sqlReg, "''");

}

/**
 * 自定义序列化json
 * 递归JS对象，将所有字符串类型值中的单引号全部转义为双引号（非字符串类型不存在注入问题）
 * 直接使用JSON.stringify()序列化函数，不会转义单引号，依然有截断风险
 * @param {object} data 
 */
// function jsonToString(data) {

//    let jsonString = '';

//    if (typeof data === 'string') {

//       jsonString = safetyString(data);

//    } else if (typeof data === 'number') {

//       jsonString = data.toString();

//    } else if (typeof data === 'boolean') {

//       jsonString = data.toString();

//    } else if (Array.isArray(data)) {

//       const items = [];

//       for (const item of data) {
//          const itemString = jsonToString(item);
//          items.push(itemString);
//       }

//       jsonString = `[${items.join()}]`;

//    } else if (toString.call(data) === '[object Object]') {

//       const items = [];

//       for (const name in data) {
//          const value = jsonToString(data[name]);
//          items.push(`"${name}": ${value}`)
//       }

//       jsonString = `{${items.join()}}`;

//    } else if (typeof data === 'date') {

//       jsonString = `"${data.toString()}"`;

//    } else {

//       throw new Error(`${data}类型无效`);

//    }

//    return jsonString;

// }

module.exports = {
  safetyString,
  jsonToString,
}