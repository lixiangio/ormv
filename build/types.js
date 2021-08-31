import toDate from '../validator/toDate.js';
import isEmail from '../validator/isEmail.js';
import isISO8601 from '../validator/isISO8601.js';
import isMobilePhone from '../validator/isMobilePhone.js';
import isFloat from '../validator/isFloat.js';
import jsonModelToString from './json/modelToString.js';
import { safetyValue, safetyJson } from './safety.js';
const { toString } = Object.prototype;
const types = {
    string(field) {
        return function (value) {
            if (typeof value === 'string') {
                return { value: safetyValue(value) };
            }
            else if (typeof value === 'number') {
                return { value: `'${value}'` };
            }
            else {
                return { error: `${field}字段值"${value}"必须为string类型` };
            }
        };
    },
    char(field) {
        return function (value) {
            if (typeof value === 'string') {
                return { value: safetyValue(value) };
            }
            else {
                return { error: `${field}字段值"${value}"必须为char类型` };
            }
        };
    },
    text(field) {
        return function (value) {
            if (typeof value === 'string') {
                return { value: safetyValue(value) };
            }
            else {
                return { error: `${field}字段值"${value}"必须为text类型` };
            }
        };
    },
    boolean(field) {
        return function (value) {
            if (typeof value === 'boolean') {
                return { value };
            }
            else {
                return { error: `${field}字段值"${value}"必须为boolean类型` };
            }
        };
    },
    json(field, express) {
        return types.jsonb(field, express);
    },
    jsonb(field, express) {
        if (express) {
            return function (data, instance) {
                const { value, error } = jsonModelToString(express, data, instance);
                if (value) {
                    return { value };
                }
                else {
                    return { error: `${field}${error}` };
                }
            };
        }
        else {
            return function (data) {
                if (typeof data === 'object') {
                    return { value: `(${safetyJson(data)})::jsonb` };
                }
                else {
                    return { error: `${field}字段值"${data}"必须为"jsonb"类型` };
                }
            };
        }
    },
    /**
     * 严格对象类型，不允许数组结构
     * @param {string} field
     * @param {*} express
     */
    object(field, express) {
        if (express) {
            return function (data, instance) {
                const { value, error } = jsonModelToString(express, data, instance);
                if (value) {
                    return { value };
                }
                else {
                    return { error: `${field}${error}` };
                }
            };
        }
        else {
            return function (data) {
                if (toString.call(data) === '[object Object]') {
                    return { value: `(${safetyJson(data)})::jsonb` };
                }
                else {
                    return { error: `${field}字段值"${data}"必须为"object"类型` };
                }
            };
        }
    },
    array(field, express) {
        if (express) {
            return function (data, instance) {
                const { value, error } = jsonModelToString(express, data, instance);
                if (value) {
                    return { value };
                }
                else {
                    return { error: `${field}${error}` };
                }
            };
        }
        else {
            return function (data) {
                if (Array.isArray(data)) {
                    return { value: `(${safetyJson(data)})::jsonb` };
                }
                else {
                    return { error: `${field}字段值"${data}"必须为"array"类型` };
                }
            };
        }
    },
    /**
     * integer数组
     * @param {*} field
     */
    "integer[]"(field) {
        return function (value) {
            if (Array.isArray(value)) {
                return { value: `{${value.join()}}` };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"integer[]"类型` };
            }
        };
    },
    range(field) {
        return function (value) {
            if (Array.isArray(value)) {
                return { value: safetyJson(value) };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"range"类型` };
            }
        };
    },
    integer(field) {
        return function (value) {
            if (Number.isInteger(value)) {
                return { value };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"integer"类型` };
            }
        };
    },
    float(field) {
        return function (value) {
            if (isFloat(String(value))) {
                return { value };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"float"类型` };
            }
        };
    },
    number(field) {
        return function (value) {
            if (isFloat(String(value))) {
                return { value };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"number"类型` };
            }
        };
    },
    bigint(field) {
        return function (value) {
            if (Number.isInteger(value)) {
                return { value };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"bigint"类型` };
            }
        };
    },
    date(field) {
        return function (value) {
            if (toDate(String(value))) {
                return { value: `'${value}'` };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"date"类型` };
            }
        };
    },
    timestamp(field) {
        return function (value) {
            if (value instanceof Date) {
                return { value: `'${value.toISOString()}'` };
            }
            else if (isISO8601(String(value))) {
                return { value: `'${value}'` };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"timestamp"类型` };
            }
        };
    },
    email(field) {
        return function (value) {
            if (isEmail(String(value))) {
                return { value: `'${value}'` };
            }
            else {
                return { error: `${field}字段值"${value}"必须为"email"类型` };
            }
        };
    },
    mobilePhone(field) {
        return function (value) {
            if (isMobilePhone(String(value), 'zh-CN')) {
                return { value: `'${value}'` };
            }
            else {
                return { error: `${field}字段值"${value}"必须为手机号` };
            }
        };
    },
};
types.string.alias = 'varchar';
types.email.alias = 'varchar(100)';
types.mobilePhone.alias = 'varchar(100)';
types.object.alias = 'jsonb';
types.array.alias = 'jsonb';
types.number.alias = 'float';
export default types;
