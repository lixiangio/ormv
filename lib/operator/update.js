'use strict';

const filter = require('../filter.js');

const { sqlValue } = filter;

/**
 * 数据更新运算符
 */
module.exports = {
   /**
    * 合并jsonb对象
    */
   $merge(value) {
      function callback(field) {
         const jsonString = sqlValue(JSON.stringify(value));
         return `"${field}" || ${jsonString}`
      }
      callback.origin = value;
      return callback;
   },
   /**
    * 设置jsonb对象，支持jsonb_set所有功能的完整版本
    */
   $set(path, value, missing = true) {
      function callback(field) {
         const jsonString = sqlValue(JSON.stringify(value));
         return `jsonb_set("${field}", '${path}', ${jsonString}, ${missing})`
      }
      callback.origin = value;
      return callback;
   },
   /**
    * 插入jsonb对象，支持jsonb_insert所有功能的完整版本
    */
   $insert(field, path, value, after = false) {
      function callback() {
         const jsonString = sqlValue(JSON.stringify(value));
         return `jsonb_insert("${field}", '${path}', ${jsonString}, ${after})`;
      }
      callback.origin = [value];
      return callback;
   },
   /**
    * 通过path插入jsonb对象，省略after配置的简化操作符
    */
   $insertByPath(path, value) {
      function callback(field) {
         const jsonString = sqlValue(JSON.stringify(value));
         return `jsonb_insert("${field}", '${path}', ${jsonString})`;
      }
      callback.origin = [value];
      return callback;
   },
   /**
    * 在第一个元素前插入jsonb对象，预设path为起始位置的极简操作符
    */
   $insertFirst(value) {
      function callback(field) {
         const jsonString = sqlValue(JSON.stringify(value));
         return `jsonb_insert("${field}", '{0}', ${jsonString})`;
      }
      callback.origin = [value];
      return callback;
   }
}