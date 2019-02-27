'use strict'

const validator = require('validator');

const Type =  {
   STRING(data) {
      return typeof data === 'string'
   },
   CHAR(data) {
      return typeof data === 'string'
   },
   TEXT(data) {
      return typeof data === 'string'
   },
   DECIMAL(data) { },
   BLOB(data) {

   },
   SMALLINT(data) { },
   INTEGER(data) {
      return validator.isInt(String(data))
   },
   BIGINT(data) {
      return validator.isInt(String(data));
   },
   BOOLEAN(data) {
      return typeof data === 'boolean'
   },
   DATE(data) { },
   DATEONLY(data) { },
   REAL(data) { },
   DOUBLE(data) {
      return validator.isFloat(String(data));
   },
   FLOAT(data) {
      return validator.isFloat(String(data));
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

Type.STRING.alias = 'VARCHAR(255)'

Type.CHAR.alias = 'VARCHAR(255)'

Type.TEXT.alias = 'VARCHAR(255)'


module.exports = Type