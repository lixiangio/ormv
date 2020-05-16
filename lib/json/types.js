"use strict";

/**
 * json类型验证函数
 */

const toDate = require('validator/lib/toDate.js').default;
const isInt = require('validator/lib/isInt.js').default;
const isMongoId = require('validator/lib/isMongoId.js').default;
const isMobilePhone = require('validator/lib/isMobilePhone.js').default;
const isEmail = require('validator/lib/isEmail.js').default;
const isISO8601 = require('validator/lib/isISO8601.js').default;
const { safetyString, jsonToString } = require('./safety.js');

module.exports = {
  string(value) {
    if (typeof value === 'string') {
      return { value: safetyString(value) };
    } else if (typeof value === 'number') {
      return { value: `"${value.toString()}"` };
    } else {
      return { error: '必须为string类型' };
    }
  },
  integer(value) {
    value = String(value);
    if (isInt(value)) {
      return { value };
    } else {
      return { error: '必须为integer类型' };
    }
  },
  number(value) {
    if (isNaN(value)) {
      return { error: '必须为number类型' };
    } else {
      return { value };
    }
  },
  float(value) {
    if (isNaN(value)) {
      return { error: '必须为float类型' };
    } else {
      return { value };
    }
  },
  object(value) {
    if (typeof value === 'object') {
      return { value: jsonToString(value) };
    } else {
      return { error: '必须为object类型' };
    }
  },
  array(value) {
    if (Array.isArray(value)) {
      return { value: jsonToString(value) };
    } else {
      return { error: '必须为array类型' };
    }
  },
  boolean(value) {
    if (typeof value === 'boolean') {
      return { value };
    } else {
      return { error: '必须为boolean类型' };
    }
  },
  date(value) {
    value = String(value);
    if (toDate(value)) {
      return { value: `"${value}"` };
    } else {
      return { error: '必须为date类型' };
    }
  },
  timestamp(value) {
    value = String(value);
    if (isISO8601(value)) {
      return { value };
    } else {
      return { error: '必须为timestamp类型' };
    }
  },
  mongoId(value) {
    if (isMongoId(String(value))) {
      return { value: `"${value}"` };
    } else {
      return { error: '必须为mongoId' };
    }
  },
  mobilePhone(value) {
    if (isMobilePhone(String(value), 'zh-CN')) {
      return { value: `"${value}"` };
    } else {
      return { error: '必须为手机号' };
    }
  },
  email(value) {
    if (isEmail(String(value))) {
      return { value: `"${value}"` };
    } else {
      return { error: '必须为email格式' };
    }
  }
};
