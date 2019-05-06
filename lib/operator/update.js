'use strict'

const filter = require('../filter.js');

const { sqlValue } = filter;
const op = Symbol.for('op');

/**
 * 数据更新运算符
 */
module.exports = {
   /**
    * 合并jsonb对象
    */
   $merge(value) {
      return {
         value,
         [op](field, value) {
            const jsonString = sqlValue(JSON.stringify(value));
            return `"${field}" || ${jsonString}`
         }
      };
   },
   /**
    * 设置jsonb对象，支持jsonb_set所有功能的完整版本
    */
   $set(path, value, missing = true) {
      return {
         value,
         [op](field, value) {
            const jsonString = sqlValue(JSON.stringify(value));
            return `jsonb_set("${field}", '${path}', ${jsonString}, ${missing})`
         }
      };
   },
   /**
    * 插入jsonb对象，支持jsonb_insert所有功能的完整版本
    */
   $insert(field, path, value, after = false) {
      return {
         value: [value],
         [op](_, value) {
            const [first] = value;
            const jsonString = sqlValue(JSON.stringify(first));
            return `jsonb_insert("${field}", '${path}', ${jsonString}, ${after})`;
         }
      };
   },
   /**
    * 通过path插入jsonb对象，省略after配置的简化操作符
    */
   $insertByPath(path, value) {
      return {
         value: [value],
         [op](field, value) {
            const [first] = value;
            const jsonString = sqlValue(JSON.stringify(first));
            return `jsonb_insert("${field}", '${path}', ${jsonString})`;
         }
      };
   },
   /**
    * 在第一个元素前插入jsonb对象，预设path为起始位置的极简操作符
    */
   $insertFirst(value) {
      return {
         value: [value],
         [op](field, value) {
            const [first] = value;
            const jsonString = sqlValue(JSON.stringify(first));
            return `jsonb_insert("${field}", '{0}', ${jsonString})`;
         }
      };
   }
}