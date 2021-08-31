/**
 * json对象字符串安全过滤器
 */
const sqlReg = /'/g;
/**
 * 单引号通过双单转义，输出安全的sql字符串
 * 双引号通过反斜杠转义，输出合法的json字符串值
 * @param {string} origin
 */
function safetyString(origin) {
    const sqlValue = origin.replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(sqlReg, "''").replace(/"/g, '\\"');
    return `"${sqlValue}"`;
}
/**
 * 使用JSON.stringify()序列化json
 * @param {string} origin
 */
function jsonToString(origin) {
    return JSON.stringify(origin).replace(sqlReg, "''");
}
export { safetyString, jsonToString, };
