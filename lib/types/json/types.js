"use strict";

/**
 * json类型验证函数
 */

const toDate = require('validator/lib/toDate.js').default;
const isMongoId = require('validator/lib/isMongoId.js').default;
const isMobilePhone = require('validator/lib/isMobilePhone.js').default;
const isEmail = require('validator/lib/isEmail.js').default;
const isISO8601 = require('validator/lib/isISO8601.js').default;
const { jsonString, jsonRecursiveString } = require('./filter.js');

module.exports = {
  string(value) {
    if (typeof value === 'string') {
      return { value: jsonString(value.trim()) };
    } else {
      return { error: '必须为string类型' };
    }
  },
  integer(value) {
    if (isNaN(value)) {
      return { error: '必须为integer类型' };
    } else {
      return { value: Number(value) };
    }
  },
  number(value) {
    if (isNaN(value)) {
      return { error: '必须为number类型' };
    } else {
      return { value: Number(value) };
    }
  },
  float(value) {
    if (isNaN(value)) {
      return { error: '必须为float类型' };
    } else {
      return { value: Number(value) };
    }
  },
  object(value) {
    if (typeof value === 'object') {
      return { value: jsonRecursiveString(value) };
    } else {
      return { error: '必须为object类型' };
    }
  },
  array(value) {
    if (Array.isArray(value)) {
      return { value: jsonRecursiveString(value) };
    }
    else {
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
    if (toDate(String(value))) {
      return { value };
    } else {
      return { error: '必须为date类型' };
    }
  },
  timestamp(value) {
    if (isISO8601(String(value))) {
      return { value };
    } else {
      return { error: '必须为timestamp类型' };
    }
  },
  mongoId(value) {
    if (isMongoId(String(value))) {
      return { value };
    } else {
      return { error: '必须为mongoId' };
    }
  },
  mobilePhone(value) {
    if (isMobilePhone(String(value), 'zh-CN')) {
      return { value };
    } else {
      return { error: '必须为手机号' };
    }
  },
  email(value) {
    if (isEmail(String(value))) {
      return { value };
    } else {
      return { error: '必须为email格式' };
    }
  }
};
