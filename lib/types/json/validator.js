"use strict";

const types = require("./types.js");
const ignore = [undefined, null, ""];

/**
 * 判断是否允许为空值，默认将undefined、 null、空字符串视为空值
 * 默认值在大多数场景下适用，在出现例外时，可以在指定字段上使用ignore属性，重置对默认空值的定义
 * @param {*} data 需要校验空值的数据
 */
function isNull(data, ignore) {
  if (ignore.includes(data)) {
    return true;
  }
}

const parser = {
  /**
   * 递归验证器
   * @param {*} express 验证表达式
   * @param {*} data 待验证数据
   * @param {String,Number} key 数据索引
   */
  recursion(express, data, key) {

    // 选项值为对象
    if (typeof express === "object") {

      // express为验证表达式
      if (express.type) {
        return this.expression(express, data);
      }

      // express为数组结构
      else if (Array.isArray(express)) {
        return this.array(express, data, key);
      }

      // express为对象结构
      else {
        return this.object(express, data, key);
      }

    }

    // express为字符窜类型声明
    else if (typeof express === "string") {

      if (isNull(data, ignore)) return {};

      const typeFunc = types[express];

      const { error, value: subData } = typeFunc(data);

      if (error) {
        return { error: `值${error}` };
      } else {
        return { value: subData };
      }

    }

    // express定义无效
    else {

      return { error: `值无效` };

    }

  },
  /**
   * 验证表达式
   * @param {*} express
   * @param {*} data
   * @param {string} key
   */
  expression(express, value) {

    // 空值
    if (isNull(value, ignore)) {
      // 默认值
      if (express.default) {
        return { value: `{{{${express.default}}}}` };
      }
      // 禁止空值
      else if (express.allowNull === false) {
        return { error: `值不允许为空` };
      }
      else {
        return { value };
      }
    }

    const typeFunc = types[express.type];

    const { error, value: subData } = typeFunc(value);

    if (error) {
      return { error: `${error}` };
    }

    return { value: subData };

  },
  /**
   * 对象结构
   * @param {*} express
   * @param {object} data
   * @param {*} key
   */
  object(express, data) {

    if (typeof data !== "object") {
      return { error: `值必须为object类型` };
    }

    const dataObj = {};

    for (const sKey in express) {

      const { error, value: subData } = this.recursion(express[sKey], data[sKey], sKey);

      if (error) {
        return { error: `.${sKey}${error}` };
      } else if (subData !== undefined) {
        dataObj[sKey] = subData;
      }

    }

    return { value: dataObj };

  },
  /**
   * 数组结构
   * @param {*} express
   * @param {*} data
   * @param {*} key
   */
  array(express, data) {

    if (!Array.isArray(data)) {
      return { error: `值必须为array类型` };
    }

    let itemKey = 0;
    const dataArray = [];

    // express为单数时采用通用匹配
    if (express.length === 1) {

      const [option] = express;

      for (const itemData of data) {

        // 子集递归验证
        const { error, value: subData } = this.recursion(
          option,
          itemData,
          itemKey
        );

        if (error) {
          return { error: `[${itemKey}]${error}` };
        } else if (subData !== undefined) {
          dataArray.push(subData);
        }

        itemKey++;

      }

    }

    // express为复数时采用精确匹配
    else {

      for (const option of express) {

        const itemData = data[itemKey];

        // 子集递归验证
        const { error, value: subData } = this.recursion(
          option,
          itemData,
          itemKey
        );

        if (error) {
          return { error: `[${itemKey}]${error}` };
        } else if (subData !== undefined) {
          dataArray.push(subData);
        }

        itemKey++;

      }

    }

    return { value: dataArray };

  }
}

/**
 * json验证器
 * @param {String} field 字段名
 * @param {*} express 验证表达式
 */
module.exports = function (express) {

  return {
    verify(data) {

      return parser.recursion(express, data, "");

    }
  };

}
