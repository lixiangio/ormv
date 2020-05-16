'use strict';

const types = require("./types.js");

const parser = {
  /**
   * 递归验证器
   * @param {*} express 表达式
   * @param {string} path 序列值路径
   * @param {array} sequence 序列容器
   */
  recursion(express, sequence, path) {

    // 选项值为对象
    if (typeof express === "object") {

      // express为验证表达式
      if (express.type) {
        return this.expression(express, sequence, path);
      }

      // express为数组结构
      else if (Array.isArray(express)) {
        return this.array(express, sequence, path);
      }

      // express为对象结构
      else {
        return this.object(express, sequence, path);
      }

    }

    // express 为字符串类型声明
    else if (typeof express === "string") {

      if (!types[express]) {
        return `不支持"${express}"类型`;
      }

    }

    // express定义无效
    else {

      return `值无效`;

    }

  },
  /**
   * 验证表达式
   * @param {object} express
   */
  expression(express, sequence, path) {

    if (!types[express.type]) {
      return `不支持"${express.type}"类型`;
    }

    // 序列id
    if (express.sequence) {

      // 当序sequence为字符串类型时，表示使用指定序列
      if (typeof express.sequence === 'string') {
        path = express.sequence;
      }

      sequence.push(path);

      express.default = function ({ schema }) {
        return `nextval('${schema}.${path}')`;
      }

    }

  },
  /**
   * 对象结构
   * @param {object} express
   */
  object(express, sequence, path) {

    for (const sKey in express) {

      const error = this.recursion(express[sKey], sequence, `${path}_${sKey}`);

      if (error) {
        return `.${sKey}${error}`;
      }

    }

  },
  /**
   * 数组结构
   * @param {array} express
   */
  array(express, sequence, path) {

    // express为单数时采用通用匹配
    if (express.length === 1) {

      const [option] = express;

      // 子集递归验证
      const error = this.recursion(option, sequence, `${path}_$`);

      if (error) {
        return `[0]${error}`;
      }

    }

    // express为复数时采用精确匹配
    else {

      let itemKey = 0;

      for (const option of express) {

        // 子集递归验证
        const error = this.recursion(option, sequence, `${path}_$`);

        if (error) {
          return `[${itemKey}]${error}`;
        }

        itemKey++;

      }

    }

  }
}


/**
 * json模型预处理器，在启动阶段对schema进行校验和转换
 */
module.exports = function (model, field, express) {

  const { name, sequence } = model;

  const error = parser.recursion(express, sequence, `${name}_${field}`);

  if (error) {
    throw new Error(`${name}模型${field}字段${error}`);
  }

};
