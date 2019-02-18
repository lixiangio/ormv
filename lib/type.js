'use strict'

const validator = require('validator');

module.exports = {
   STRING(data) {
      return typeof data === 'string'
   },
   DECIMAL(data) { },
   BLOB(data) {

   },
   CHAR(data) {
      return typeof data === 'string'
   },
   TEXT(data) {
      return typeof data === 'string'
   },
   SMALLINT(data) { },
   INTEGER(data) {
      return validator.isInt(data)
   },
   BIGINT(data) {
      return validator.isInt(data);
   },
   BOOLEAN(data) {
      return typeof data === 'boolean'
   },
   DATE(data) { },
   DATEONLY(data) { },
   REAL(data) { },
   DOUBLE(data) {
      return validator.isFloat(data);
   },
   FLOAT(data) {
      return validator.isFloat(data);
   },
   GEOMETRY(data) { },
   GEOGRAPHY(data) { },
   HSTORE(data) { },
   RANGE(data) {
      return Array.isArray(data);
   },
   JSON(data) {
      return typeof data === 'object';
   },
   JSONB(data) {
      return typeof data === 'object';
   }
}