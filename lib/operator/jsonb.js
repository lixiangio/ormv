'use strict';

const { safetyJson } = require('../safety.js');

/**
 * 数据更新运算符
 */
module.exports = {
  /**
   * 合并jsonb对象
   */
  $merge(value) {
    return function (field) {
      const jsonString = safetyJson(value);
      return `"${field}" || ${jsonString}`;
    }
  },
  /**
   * 设置jsonb对象，支持jsonb_set所有功能的完整版本
   */
  $set(path, value, missing = true) {
    return function (field) {
      const jsonString = safetyJson(value);
      return `jsonb_set("${field}", '${path}', ${jsonString}, ${missing})`
    }
  },
  /**
   * 插入jsonb对象，支持jsonb_insert所有功能的完整版本
   */
  $insert(field, path, value, after = false) {
    return function () {
      const jsonString = safetyJson(value);
      return `jsonb_insert("${field}", '${path}', ${jsonString}, ${after})`;
    }
  },
  /**
   * 通过path插入jsonb对象，省略after配置的简化操作符
   */
  $insertByPath(path, value) {
    return function (field) {
      const jsonString = safetyJson(value);
      return `jsonb_insert("${field}", '${path}', ${jsonString})`;
    }
  },
  /**
   * 在第一个元素前插入jsonb对象，预设path为起始位置的极简操作符
   */
  $insertFirst(value) {
    return function (field) {
      const jsonString = safetyJson(value);
      return `jsonb_insert("${field}", '{0}', ${jsonString})`;
    }
  }
}