"use strict";

const types = require("./types.js");
const ignore = [undefined, null, ""];
const { toString } = Object.prototype;

const parser = {
  /**
  * json 递归验证器
  * @param {*} express 验证表达式
  * @param {*} data 待验证数据
  * @param {object} instance 查询实例
  */
  recursion(express, data, instance) {

    // express为字符串类型声明
    if (typeof express === "string") {

      if (data === undefined) {

        return { value: 'null' };

      } else {

        return types[express](data);

      }

    }

    // express选项值为对象
    else if (typeof express === "object") {

      // 验证表达式
      if (express.type) {
        return this.expression(express, data, instance);
      }

      // 数组结构
      else if (Array.isArray(express)) {
        return this.array(express, data, instance);
      }

      // 对象结构
      else {
        return this.object(express, data, instance);
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
   * @param {object} instance 查询实例
   */
  expression(express, data, instance) {

    // 空值
    if (ignore.includes(data)) {

      // 默认值
      if (express.default !== undefined) {

        if (typeof express.default === 'function') {
          return { value: `"'||${express.default(instance)}||'"` };
        } else {
          return { value: `"'||${express.default}||'"` };
        }

      }

      // 禁止空值
      else if (express.allowNull === false) {

        return { error: `值不允许为空` };

      } else {

        return { value: 'null' };

      }

    };

    return types[express.type](data);

  },
  /**
   * 纯对象结构
   * @param {*} express
   * @param {object} data
   * @param {object} instance 查询实例
   */
  object(express, data, instance) {

    if (toString.call(data) === '[object Object]') {

      const items = [];

      for (const name in express) {

        const { error, value } = this.recursion(express[name], data[name], instance);

        if (error) {
          return { error: `.${name}${error}` };
        } else {
          items.push(`"${name}": ${value}`)
        }

      }

      return { value: `{${items.join()}}` };

    } else {

      return { error: `值必须为object类型` };

    }

  },
  /**
   * 数组结构
   * @param {*} express
   * @param {*} data
   * @param {object} instance 查询实例
   */
  array(express, data, instance) {

    if (Array.isArray(data) === false) {
      return { error: `值必须为array类型` };
    }

    let itemKey = 0;
    const items = [];

    // express为单数时采用通用匹配
    if (express.length === 1) {

      const [option] = express;

      for (const itemData of data) {

        // 子集递归验证
        const { error, value } = this.recursion(
          option,
          itemData,
          instance
        );

        if (error) {
          return { error: `[${itemKey}]${error}` };
        } else if (value !== undefined) {
          items.push(value);
        }

        itemKey++;

      }

    }

    // express为复数时采用精确匹配
    else {

      for (const option of express) {

        const itemData = data[itemKey];

        // 子集递归验证
        const { error, value } = this.recursion(
          option,
          itemData,
          instance
        );

        if (error) {
          return { error: `[${itemKey}]${error}` };
        } else if (value !== undefined) {
          items.push(value);
        }

        itemKey++;

      }

    }

    return { value: `[${items.join()}]` };

  }
}


module.exports = function (express, data, instance) {

  const { error, value } = parser.recursion(express, data, instance);

  if (error) {
    return { error }
  } else {
    return { value: `('${value}')::jsonb` };
  }

};
