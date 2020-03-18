'use strict';

const types = require("./types.js");

/**
 * json预处理器，在启动阶段对schema进行校验和转换
 */
module.exports = function (modelName, field, express) {

  const parser = {
    /**
     * 递归验证器
     * @param {*} express
     */
    recursion(express) {

      // 选项值为对象
      if (typeof express === "object") {

        // express为验证表达式
        if (express.type) {
          return this.expression(express);
        }

        // express为数组结构
        else if (Array.isArray(express)) {
          return this.array(express);
        }

        // express为对象结构
        else {
          return this.object(express);
        }

      }

      // express为字符窜类型声明
      else if (typeof express === "string") {

        const typeFunc = types[express];

        if (!typeFunc) {
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
   * @param {*} express
   */
    expression(express) {

      if (express.default === undefined) {
        if (express.autoIncrement === true) {
          express.default = `nextval('${modelName}_id_seq')`
        }
      }

      const typeFunc = types[express.type];

      if (!typeFunc) {
        return `不支持"${express.type}"类型`;
      }

    },
    /**
     * 对象结构
     * @param {*} express
     */
    object(express) {

      for (const sKey in express) {

        const error = this.recursion(express[sKey], sKey);

        if (error) {
          return `.${sKey}${error}`;
        }

      }

    },
    /**
     * 数组结构
     * @param {*} express
     */
    array(express) {

      // express为单数时采用通用匹配
      if (express.length === 1) {

        const [option] = express;

        // 子集递归验证
        const error = this.recursion(option, 0);

        if (error) {
          return `[0]${error}`;
        }

      }

      // express为复数时采用精确匹配
      else {

        let itemKey = 0;

        for (const option of express) {

          // 子集递归验证
          const error = this.recursion(option, itemKey);

          if (error) {
            return `[${itemKey}]${error}`;
          }

          itemKey++;

        }

      }

    }
  }

  const error = parser.recursion(express);

  if (error) {
    throw new Error(`${modelName}模型${field}字段${error}`);
  }

};
