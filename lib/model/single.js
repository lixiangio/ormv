'use strict';

const Types = require('../types/index.js');
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
   * @param {Object} fields 模型字段
   */
  constructor(client, name, fields) {

    super();

    this.name = name;
    this.client = client;
    this.fields = fields;
    this.logger = client.logger;
    this.aliasIndex = {};
    this.insertFields = {};
    this.schemaName = 'public';

    for (const field in fields) {

      const value = fields[field];

      if (typeof value === 'object') {

        const { type } = value;

        if (type) {

          const typeFunc = Types[type];

          if (!typeFunc) {
            throw new Error(`${field}字段type属性值“${type}”无效`);
          }
          
          value.sqlValue = typeFunc(field, value.schema);
          value.alias = typeFunc.alias;

          if (value.default) {
            // 当default值为对象或数组时，预先将其序列化为字符串
            if (typeof value.default === 'object') {
              const jsonString = JSON.stringify(value.default);
              value.default = `'${jsonString}'::jsonb`;
            }
            // 当default值为字符串时，需要使用单引号包裹
            // 由于sql本身支持number、boolean类型，因此可以不转字符串直接输出
          }

        }

        // express为数组结构
        else if (Array.isArray(value)) {

          fields[field] = {
            type: 'array',
            alias: Types.array.alias,
            default: "'[]'::jsonb",
            sqlValue: Types.array(field, value)
          };

        }

        // express为对象结构
        else {

          fields[field] = {
            type: 'object',
            alias: Types.object.alias,
            default: "'{}'::jsonb",
            sqlValue: Types.object(field, value)
          };

        }

        if (value.primaryKey === true) {
          this.primaryKey = field;
        } else {
          this.insertFields[field] = fields[field];
        }

      }

      // 直接声明类型
      else if (typeof value === 'string') {

        const typeFunc = Types[value];

        if (!typeFunc) {
          throw new Error(`${field}字段“${value}”类型定义无效`);
        }

        fields[field] = {
          type: value,
          alias: typeFunc.alias,
          sqlValue: typeFunc(field)
        };

        this.insertFields[field] = fields[field];

      } else {

        throw new Error(`${field}字段值必须为object或string类型`);

      }

      fields[field].sqlKey = `"${field}"`; // 预处理，字段名转sql

    }

    if (!this.primaryKey) {

      fields.id = {
        type: 'integer',
        sqlKey: '"id"',
        sqlValue: Types.integer('id')
      };

    }

    for (const name in fields) {
      const field = fields[name];
      this.aliasIndex[name] = field.sqlKey;
    }

    if (!fields.createdAt) {
      fields.createdAt = {
        type: 'timestamp',
        sqlKey: '"createdAt"',
        sqlValue: Types.timestamp('createdAt'),
        default: 'now()',
      };
    }

    if (!fields.updatedAt) {
      fields.updatedAt = {
        type: 'timestamp',
        sqlKey: '"updatedAt"',
        sqlValue: Types.timestamp('updatedAt'),
        default: 'now()',
      };
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
  /**
   * json中插入新数据
   * @param {Object} data 
   */
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
