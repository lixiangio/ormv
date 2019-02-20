'use strict'

const Op = require('./setOperator');

module.exports = {
   /**
    * 合并jsonb对象
    * @param {*} field 
    * @param {*} options 
    * @param {*} validate 
    */
   [Op.merge](field, options, validate) {
      options = validate(options);
      return `${field} || '${options}'`;
   },
   /**
    * 设置jsonb对象，支持jsonb_set所有功能的完整版本
    * @param {String} field 
    * @param {Object} options 
    * @param {Function} validate 
    */
   [Op.set](field, options, validate) {
      let { path, value, missing = true } = options;
      value = validate(value);
      return `jsonb_set(${field}, '${path}', '${value}', ${missing})`;
   },
   /**
    * 插入jsonb对象，支持jsonb_insert所有功能的完整版本
    * @param {String} field 
    * @param {Object} options 
    * @param {String} options.path
    * @param {*} options.value
    * @param {Boolean} options.after
    * @param {Function} validate 
    */
   [Op.insert](field, options, validate) {
      let { path, value, after = false } = options;
      value = validate(value);
      return `jsonb_insert(${field}, '${path}', '${value}', ${after})`;
   },
   /**
    * 通过path插入jsonb对象，省略after配置的简化操作符
    * @param {String} field 
    * @param {*} options 
    * @param {Function} validate 
    */
   [Op.insertByPath](field, options, validate) {
      let [path] = Object.keys(options);
      let value = options[path]; 
      value = validate(value);
      return `jsonb_insert(${field}, '${path}', '${value}')`;
   },
   /**
    * 在第一个元素前插入jsonb对象，预设path为起始位置的极简操作符
    * @param {String} field 字段名
    * @param {*} value 
    * @param {Function} validate 
    */
   [Op.insertFirst](field, value, validate) {
      value = validate(value);
      return `jsonb_insert(${field}, '{0}', '${value}')`;
   }
}