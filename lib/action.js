'use strict'

const Op = require('./options');

module.exports = {
   [Op.merge](field, options, schema) {
      const { error, data } = schema(options)
      if (error) {
         throw new Error(error)
      }
      return `${field} || '${JSON.stringify(data)}'`
   },
   [Op.set](field, options, schema) {
      const { path, value, missing = true } = options;
      const { error, data } = schema(value)
      if (error) {
         throw new Error(error)
      }
      return `jsonb_set(${field}, '${path}', '${JSON.stringify(data)}', ${missing})`
   },
   [Op.insert](field, options, schema) {
      const { path, value, after = false } = options;
      const { error, data } = schema(value)
      if (error) {
         throw new Error(error)
      }
      return `jsonb_insert(${field}, '${path}', '${JSON.stringify(data)}', ${after})`
   }
}