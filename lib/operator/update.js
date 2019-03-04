'use strict'

const op = Symbol.for('op');

/**
 * 数据更新运算符
 */
module.exports = {
   /**
    * 合并jsonb对象
    * @param {*} options 
    */
   $merge(value) {
      return {
         value,
         [op](field, value) {
            return `"${field}" || ${value}`
         }
      };
   },
   /**
    * 设置jsonb对象，支持jsonb_set所有功能的完整版本
    * @param {Object} options 
    * @param {Boolean} missing 
    */
   $set(path, value, missing = true) {
      return {
         value,
         [op](field, value) {
            return `jsonb_set("${field}", '${path}', ${value}, ${missing})`
         }
      };
   },
   /**
    * 插入jsonb对象，支持jsonb_insert所有功能的完整版本
    * @param {String} path
    * @param {*} options
    * @param {Boolean} after
    */
   $insert(field, path, value, after = false) {
      return {
         value,
         [op](_, value) {
            return `jsonb_insert("${field}", '${path}', ${value}, ${after})`;
         }
      };
   },
   /**
    * 通过path插入jsonb对象，省略after配置的简化操作符
    * @param {String} field 
    * @param {*} options 
    * @param {Function} validate 
    */
   $insertByPath(path, value) {
      return {
         value,
         [op](field, value) {
            return `jsonb_insert("${field}", '${path}', ${value})`;
         }
      };
   },
   /**
    * 在第一个元素前插入jsonb对象，预设path为起始位置的极简操作符
    * @param {*} options 字段名
    */
   $insertFirst(value) {
      return {
         value,
         [op](field, value) {
            return `jsonb_insert("${field}", '{0}', ${value})`;
         }
      };
   }
}