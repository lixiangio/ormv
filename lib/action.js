'use strict'

const Op = require('./options');

module.exports = {
   [Op.merge](field, options, validate) {
      const { error, data } = validate.strict(options)
      if (error) {
         throw new Error(error)
      }
      return `${field} || '${JSON.stringify(data)}'`
   },
   [Op.set](field, options, validate) {
      const { path, value, missing = true } = options;
      const { error, data } = validate.strict(value)
      if (error) {
         throw new Error(error)
      }
      return `jsonb_set(${field}, '${path}', '${JSON.stringify(data)}', ${missing})`
   },
   [Op.insert](field, options, validate) {
      const { path, value, after = false } = options;
      const { error, data } = validate(value)
      if (error) {
         throw new Error(error)
      }
      return `jsonb_insert(${field}, '${path}', '${JSON.stringify(data)}', ${after})`
   }
}