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
    * 设置jsonb对象
    * @param {*} field 
    * @param {*} options 
    * @param {*} validate 
    */
   [Op.set](field, options, validate) {
      let { path, value, missing = true } = options;
      value = validate(value);
      return `jsonb_set(${field}, '${path}', '${value}', ${missing})`;
   },
   /**
    * 插入jsonb对象
    * @param {*} field 
    * @param {*} options 
    * @param {*} validate 
    */
   [Op.insert](field, options, validate) {
      let { path, value, after = false } = options;
      value = validate(value);
      return `jsonb_insert(${field}, '${path}', '${value}', ${after})`;
   }
}