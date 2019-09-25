'use strict';

const validator = require('validator');
const { toString } = Object.prototype;

const Type = {
   string(data) {
      return typeof data === 'string';
   },
   char(data) {
      return typeof data === 'string';
   },
   text(data) {
      return typeof data === 'string';
   },
   boolean(data) {
      return typeof data === 'boolean'
   },
   list(data) {
      return Array.isArray(data);
   },
   json(data) {
      return typeof data === 'object';
   },
   jsonb(data) {
      return typeof data === 'object';
   },
   object(data) {
      return toString.call(data) === '[object Object]';
   },
   array(data) {
      return Array.isArray(data);
   },
   range(data) {
      return Array.isArray(data);
   },
   email(data) {
      return validator.isEmail(String(data));
   },
   integer(data) {
      return validator.isInt(String(data));
   },
   double(data) {
      return validator.isFloat(String(data));
   },
   float(data) {
      return validator.isFloat(String(data));
   },
   number(data) {
      return validator.isFloat(String(data));
   },
   bigint(data) {
      return validator.isInt(String(data));
   },
   date(data) {
      return validator.isISO8601(String(data));
   },
   timestamp(data) {
      return validator.isISO8601(String(data));
   },
   // decimal(data) { },
   // blob(data) { },
   // smallint(data) { },
   // dateonly(data) { },
   // geometry(data) { },
   // geography(data) { },
   // hstore(data) { },
   // real(data) { },
}

Type.string.alias = 'VARCHAR(255)';

Type.char.alias = 'VARCHAR(255)';

Type.text.alias = 'VARCHAR(255)';

Type.email.alias = 'VARCHAR(100)';

Type.list.alias = 'ARRAY';

Type.object.alias = 'JSONB';

Type.array.alias = 'JSONB';

module.exports = Type;