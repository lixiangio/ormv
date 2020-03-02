"use strict";

const symbols = require("./symbol.js");
const common = require("./common.js");
const type = require("../type.js");

const validator = require('validator');

const types = new Map();

types.set(type.string, {
  ...common,
  // 数据类型验证
  type(data) {
    if (typeof data === 'string') {
      return { data: data.trim() };
    } else {
      return { error: '必须为String类型' };
    }
  },
  // 限制最小长度
  min(data, min) {
    if (data.length < min) {
      return { error: `长度不能小于${min}个字符` };
    } else {
      return { data };
    }
  },
  // 限制最大长度
  max(data, max) {
    if (data.length > max) {
      return { error: `长度不能大于${max}个字符` };
    } else {
      return { data };
    }
  },
  // 正则
  reg(data, reg) {
    if (data.search(reg) === -1) {
      return { error: '格式错误' };
    } else {
      return { data };
    }
  },
  // 包含
  in(data, array) {
    const result = array.indexOf(data);
    if (result === -1) {
      return { error: `值必须为[${array}]选项其中之一` };
    } else {
      return { data };
    }
  },
});

types.set(type.number, {
  ...common,
  type(data) {
    if (isNaN(data)) {
      return { error: '必须为Number类型' };
    } else {
      return { data: Number(data) };
    }
  },
  min(data, min) {
    if (data < min) {
      return { error: `不能小于${min}` };
    } else {
      return { data };
    }
  },
  max(data, max) {
    if (data > max) {
      return { error: `不能大于${max}` };
    } else {
      return { data };
    }
  },
  // 包含
  in(data, array) {
    const result = array.indexOf(data);
    if (result === -1) {
      return { error: `值必须为${array}中的一个` };
    } else {
      return { data };
    }
  }
});

types.set(type.array, {
  ...common,
  type(data) {
    if (Array.isArray(data)) {
      return { data };
    }
    else {
      return { error: '必须为Array类型' };
    }
  },
  min(data, min) {
    if (data.length < min) {
      return { error: `长度不能小于${min}个字符` };
    }
    else {
      return { data };
    }
  },
  max(data, max) {
    if (data.length > max) {
      return { error: `长度不能大于${max}个字符` };
    } else {
      return { data };
    }
  },
});
types.set(type.object, {
  ...common,
  type(data) {
    if (typeof data === 'object') {
      return { data };
    } else {
      return { error: '必须为Object类型' };
    }
  },
});
types.set(type.boolean, {
  ...common,
  type(data) {
    if (typeof data === 'boolean') {
      return { data };
    } else {
      return { error: '必须为Boolean类型' };
    }
  },
});
types.set(type.date, {
  ...common,
  type(data) {
    if (validator.toDate(String(data))) {
      return { data };
    } else {
      return { error: '必须为Date类型' };
    }
  },
});
types.set(type.timestamp, {
  ...common,
  type(data) {
    if (validator.isISO8601(String(data))) {
      return { data };
    } else {
      return { error: '必须为timestamp类型' };
    }
  },
});

types.set(symbols.mongoId, {
  ...common,
  type(data) {
    if (validator.isMongoId(String(data))) {
      return { data };
    } else {
      return { error: '必须为MongoId' };
    }
  },
});
types.set(symbols.mobilePhone, {
  ...common,
  type(data) {
    if (validator.isMobilePhone(String(data), 'zh-CN')) {
      return { data };
    } else {
      return { error: '必须为手机号' };
    }
  },
});
types.set(symbols.email, {
  ...common,
  type(data) {
    if (validator.isEmail(String(data))) {
      return { data };
    } else {
      return { error: '必须为Email格式' };
    }
  },
});

module.exports = types;
