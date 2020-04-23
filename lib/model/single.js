'use strict';

const Types = require('../types/index.js');
const jsonPretreatment = require('../types/json/pretreatment.js');
const Op = require('../operator/index.js');
const Sync = require('./sync.js');
const Insert = require('./query/insert.js');
const Find = require('./query/find.js');
const Update = require('./query/update.js');
const Delete = require('./query/delete.js');

const { $merge, $in } = Op;
const { toString } = Object.prototype;

/**
 * 模型类，实例通常会被重复调用，因此其成员属性对外只读
 */
class Model extends Sync {
  /**
   * @param {Object} client 客户端实例
   * @param {String} name 模型名称
   * @param {Object} options 模型字段配置项
   */
  constructor(client, name, options) {

    super();

    const { config, logger } = client;

    this.name = name;
    this.client = client;
    this.config = config;
    this.logger = logger;
    this.options = options; // 原始数据模型
    this.fields = {};
    this.aliasIndex = {};
    this.insertFields = {};
    this.schemaName = 'public';

    const { fields, insertFields } = this;

    for (const field in options) {

      const express = options[field];

      if (typeof express === 'object') {

        const { type } = express;

        if (type) {

          const typeFunc = Types[type];

          if (!typeFunc) {
            throw new Error(`${field}字段type属性值“${type}”无效`);
          }

          const copyExpress = { ...express };

          copyExpress.sqlValue = typeFunc(field);
          copyExpress.alias = typeFunc.alias;

          if (express.default) {
            // 当default值为对象或数组时，预先将其序列化为字符串
            if (typeof express.default === 'object') {
              const jsonString = JSON.stringify(express.default);
              copyExpress.default = `'${jsonString}'::jsonb`;
            }
            // 当default值为字符串时，需要使用单引号包裹
            // 由于sql本身支持number、boolean类型，因此可以不转字符串直接输出
          }

          fields[field] = copyExpress;

        }

        // express为数组结构
        else if (Array.isArray(express)) {

          jsonPretreatment(name, field, express); // 预处理

          fields[field] = {
            type: 'array',
            alias: Types.array.alias,
            sqlValue: Types.array(field, express),
            default: "'[]'::jsonb",
          };

        }

        // express为对象结构
        else {

          jsonPretreatment(name, field, express);

          fields[field] = {
            type: 'object',
            alias: Types.object.alias,
            sqlValue: Types.object(field, express),
            default: "'{}'::jsonb",
          };

        }

        if (express.primaryKey === true) {
          this.primaryKey = field;
        } else {
          insertFields[field] = fields[field];
        }

      }

      // 直接声明类型
      else if (typeof express === 'string') {

        const typeFunc = Types[express];

        if (!typeFunc) {
          throw new Error(`${field}字段“${express}”类型定义无效`);
        }

        fields[field] = {
          type: express,
          alias: typeFunc.alias,
          sqlValue: typeFunc(field)
        };

        insertFields[field] = fields[field];

      } else {

        throw new Error(`${field}字段值必须为object或string类型`);

      }

      fields[field].sqlKey = `"${field}"`; // 预处理，字段名转sql

    }

    if (!this.primaryKey) {
      const primaryKey = {
        type: 'integer',
        sqlKey: '"id"',
        sqlValue: Types.integer('id')
      };
      this.primaryKey = primaryKey;
      fields.id = primaryKey;
      options.id = 'integer';
    }

    // 自动补齐date字段
    for (const field of ['createdAt', 'updatedAt']) {
      if (!fields[field]) {
        fields[field] = {
          type: 'timestamp',
          sqlKey: `"${field}"`,
          sqlValue: Types.timestamp(field),
          default: 'now()',
        };
        options[field] = 'timestamp';
      }
    }

    for (const field in fields) {
      this.aliasIndex[field] = fields[field].sqlKey;
    }

  }
  schema(name) {

    const schema = Object.create(this);

    schema.schemaName = name;

    return schema;

  }
  /**
   * sql对象实例
   */
  _findCb() {

    return {
      "select": {
        "key": "SELECT",
        "value": "*",
      },
      "from": {
        "key": "FROM",
        "value": `"${this.schemaName}"."${this.name}"`
      },
    }

  }
  /**
   * 插入新数据
   * @param {Object} data 
   */
  insert(data) {

    const chain = new Insert(this);

    return chain.insert(data);

  }
  // /**
  //  * json中插入新数据
  //  * @param {Object} data 
  //  */
  // insertJson(path, data) {
  // }
  /**
   * select查询，等同于find().select()
   * @param  {Array} fields 选择字段
   */
  select(...fields) {

    const chain = new Find(this);

    chain.result = function (data) {
      return data.rows;
    }

    return chain.select(...fields);

  }
  /**
   * 查询多条
   * @param  {Object} condition 
   */
  find(condition) {

    const chain = new Find(this);

    if (condition) {
      chain.where(condition);
    }

    chain.result = function (data) {
      return data.rows;
    }

    return chain;

  }
  /**
   * 查询单条
   * @param  {Object} condition
   */
  findOne(condition) {

    const chain = new Find(this);

    if (condition) {
      chain.where(condition);
    }

    chain.limit(1);

    chain.result = function (data) {
      return data.rows[0];
    }

    return chain;

  }
  /**
   * 查询主键
   * @param {Number} id 
   */
  findPk(id) {

    const chain = new Find(this);

    const { primaryKey } = this;

    if (primaryKey) {
      chain.where({ [primaryKey]: id });
    } else {
      throw new Error(`模型中未定义主键`);
    }

    chain.limit(1);

    chain.result = function (data) {
      return data.rows[0];
    }

    return chain;

  }
  /**
   * 查询数据总量
   */
  count() {

    const chain = new Find(this);

    return chain.count();

  }
  /**
   * 更新数据
   * @param {Object} data 更新数据
   */
  update(data) {

    const chain = new Update(this);

    chain.update(data);

    return chain;

  }
  /**
   * 更新json数据
   */
  // updateJson(path, data) {
  // }
  /**
   * 更新数据
   * @param {Number} id 主键id值
   * @param {Object} data 更新数据
   */
  updatePk(id, data) {

    const chain = new Update(this);

    chain.update(data);

    const { primaryKey } = this;

    if (primaryKey) {
      chain.where({ [primaryKey]: id });
    } else {
      throw new Error(`模型中未定义主键`);
    }

    chain.return();

    return chain;

  }
  /**
   * 对所有json、jsonb类型使用||合并操作符，而不是直接覆盖
   */
  updateMerge(data) {

    const chain = new Update(this);

    for (const name in data) {

      const value = data[name];

      if (toString.call(value) === '[object Object]') {
        data[name] = $merge(value);
      }

    }

    chain.update(data);

    return chain;

  }
  /**
   * 删除数据
   * @param  {[Number]} ids 主键id队列
   */
  delete(condition) {

    const chain = new Delete(this);

    if (condition) {
      chain.where(condition);
    }

    return chain;

  }
  /**
   * 删除指定主键的数据
   * @param  {[Number]} ids 主键id队列
   */
  deletePk(...ids) {

    const chain = new Delete(this);

    const { primaryKey } = this;

    const { length } = ids;

    if (length === 1) {
      chain.where({ [primaryKey]: ids[0] });
    } else if (length > 1) {
      chain.where({ [primaryKey]: $in(...ids) });
    }

    return chain;

  }
}

module.exports = Model;
