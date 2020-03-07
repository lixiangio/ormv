'use strict';

/**
 * 表字段类型函数
 */

const toDate = require('validator/lib/toDate.js');
const isEmail = require('validator/lib/isEmail.js');
const isISO8601 = require('validator/lib/isISO8601.js');
const isFloat = require('validator/lib/isFloat.js');
const isInt = require('validator/lib/isInt.js');

const jsonValidator = require('./json/validator.js');
const filter = require('./filter.js');

const { toString } = Object.prototype;
const { sqlValue, sqlJsonValue } = filter;

const types = {
  string(field) {
    return function (data) {
      if (typeof data === 'string') {
        return { value: sqlValue(data) };
      } else {
        return { error: `${field}字段值必须为string类型` };
      }
    }
  },
  char(field) {
    return function (data) {
      if (typeof data === 'string') {
        return { value: sqlValue(data) };
      } else {
        return { error: `${field}字段值必须为char类型` };
      }
    }
  },
  text(field) {
    return function (data) {
      if (typeof data === 'string') {
        return { value: sqlValue(data) };
      } else {
        return { error: `${field}字段值必须为text类型` };
      }
    }
  },
  boolean(field) {
    return function (data) {
      console.log(data)
      if (typeof data === 'boolean') {
        return { value: sqlValue(data) };
      } else {
        return { error: `${field}字段值必须为boolean类型` };
      }
    }
  },
  json(field, express) {

    return types.jsonb(field, express);

  },
  jsonb(field, express) {

    if (express) {
      const schema = jsonValidator(express);
      return function (data) {
        const result = schema.verify(data);
        if (result.value) {
          return { value: `(${sqlJsonValue(result.value)})::jsonb` };
        } else {
          return { error: `${field}${result.error}` };
        }
      }
    } else {
      return function (data) {
        if (typeof data === 'object') {
          return { value: `(${sqlJsonValue(data)})::jsonb` };
        } else {
          return { error: `${field}字段值必须为"jsonb"类型` };
        }
      }
    }

  },
  /**
   * 严格对象类型，不允许数组结构
   * @param {*} field 
   * @param {*} express 
   */
  object(field, express) {

    if (express) {
      const schema = jsonValidator(express);
      return function (data) {
        const result = schema.verify(data);
        if (result.value) {
          return { value: `(${sqlJsonValue(result.value)})::jsonb` };
        } else {
          return { error: `${field}${result.error}` };
        }
      }
    } else {
      return function (data) {
        if (toString.call(data) === '[object Object]') {
          return { value: `(${sqlJsonValue(data)})::jsonb` };
        } else {
          return { error: `${field}字段必须为"object"类型` };
        }
      }
    }

  },
  array(field, express) {

    if (express) {

      const schema = jsonValidator(express);

      return function (data, { model }) {

        const { value, error } = schema.verify(data);
        if (value) {
          // 仅针对表字段级数组内嵌对象结构，自动添加id字段
          for (const item of value) {
            if (typeof item === 'object') {
              if (item.id == undefined) {
                item.id = "{{nextval}}";
              }
            }
          }
          const safetyJson = sqlJsonValue(value);
          const sqlJson = safetyJson.replace(/"{{nextval}}"/g, `'||nextval('${model.name}_id_seq')||'`);
          return { value: `(${sqlJson})::jsonb` };
        } else {
          return { error: `${field}${error}` };
        }

      }

    } else {

      return function (data) {

        if (Array.isArray(data)) {
          return { value: `(${sqlJsonValue(data)})::jsonb` };
        } else {
          return { error: `${field}字段值必须为"array"类型` };
        }

      }

    }

  },
  range(field) {

    return function (data) {
      if (Array.isArray(data)) {
        return { value: sqlJsonValue(data) };
      } else {
        return { error: `${field}字段值必须为"range"类型` };
      }
    }

  },
  email(field) {

    return function (data) {
      const dataString = String(data);
      if (isEmail(dataString)) {
        return { value: sqlValue(dataString) };
      } else {
        return { error: `${field}字段值必须为"email"类型` };
      }
    }

  },
  integer(field) {

    return function (data) {
      const dataString = String(data);
      if (isInt(dataString)) {
        return { value: sqlValue(dataString) };
      } else {
        return { error: `${field}字段值必须为"integer"类型` };
      }
    }

  },
  double(field) {

    return function (data) {
      const dataString = String(data);
      if (isFloat(dataString)) {
        return { value: sqlValue(dataString) };
      } else {
        return { error: `${field}字段值必须为"double"类型` };
      }
    }

  },
  float(field) {

    return function (data) {

      const dataString = String(data);

      if (isFloat(dataString)) {
        return { value: sqlValue(dataString) };
      } else {
        return { error: `${field}字段值必须为"float"类型` };
      }

    }

  },
  number(field) {

    return function (data) {

      const dataString = String(data);

      if (isFloat(dataString)) {
        return { value: sqlValue(dataString) };
      } else {
        return { error: `${field}字段值必须为"number"类型` };
      }

    }

  },
  bigint(field) {

    return function (data) {

      const dataString = String(data);

      if (isInt(dataString)) {
        return { value: sqlValue(dataString) };
      } else {
        return { error: `${field}字段值必须为"bigint"类型` };
      }

    }

  },
  date(field) {

    return function (data) {

      const dataString = String(data);

      if (toDate(dataString)) {
        return { value: sqlValue(dataString) };
      } else {
        return { error: `${field}字段值必须为"date"类型` };
      }

    }

  },
  timestamp(field) {

    return function (data) {

      const dataString = String(data);

      if (isISO8601(dataString)) {
        return { value: sqlValue(dataString) };
      } else {
        return { error: `${field}字段值必须为"timestamp"类型` };
      }

    }

  },
  // decimal(field) { },
  // blob(field) { },
  // smallint(field) { },
  // dateonly(field) { },
  // geometry(field) { },
  // geography(field) { },
  // hstore(field) { },
  // real(field) { },
}

types.string.alias = 'varchar(255)';

types.char.alias = 'varchar(255)';

types.text.alias = 'varchar(255)';

types.email.alias = 'varchar(100)';

types.object.alias = 'jsonb';

types.array.alias = 'jsonb';

module.exports = types;