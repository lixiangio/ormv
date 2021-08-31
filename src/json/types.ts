import toDate from '../../validator/toDate.js';
import isEmail from '../../validator/isEmail.js';
import isMongoId from '../../validator/isMongoId.js';
import isMobilePhone from '../../validator/isMobilePhone.js';
import isISO8601 from '../../validator/isISO8601.js';
import { safetyString, jsonToString } from './safety.js';

export default {
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
    if (Number.isInteger(value)) {
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
      return { value: `"${value}"` };
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
