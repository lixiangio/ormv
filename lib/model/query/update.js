'use strict';

const Base = require('./base.js');

const ignore = [undefined, null, ''];

class Update extends Base {
  constructor(model) {

    super();

    const { client, schemaname, fields, aliasIndex } = model;

    this.model = model;
    this.client = client;
    this.logger = client.logger;
    this.schema = schemaname;
    this.fields = fields;
    this.aliasIndex = aliasIndex;

    this.sql = {
      update: {
        key: 'UPDATE',
        value: `"${schemaname}"."${model.name}"`
      },
      set: undefined,
      where: undefined,
      return: undefined,
    }

  }
  update(data) {

    const set = [];

    if (data instanceof Object) {

      const { fields } = this;

      delete data.createdAt;
      delete data.updatedAt;

      for (const field in data) {

        const options = fields[field];

        if (options === undefined) {
          throw new Error(`${field}字段不存在`);
        }

        let sqlValue;
        const value = data[field];

        if (ignore.includes(value)) {
          set.push(`"${field}" = DEFAULT`);
          continue;
        }

        // 赋值函数运算符，使用内置序列化验证器
        if (typeof value === 'function') {

          sqlValue = value(field);

        } else {

          const result = options.sql(value, this);

          if (result.error) {
            throw new TypeError(result.error);
          }

          sqlValue = result.value;

        }

        set.push(`"${field}" = ${sqlValue}`);

      }

    } else {

      throw new Error(`data参数值必须为Object类型`);

    }

    set.push(`"updatedAt" = now()`);

    this.sql.set = {
      key: 'SET',
      value: set.join(", ")
    };

    return this;

  }
  /**
   * 返回update后的结果
   */
  return(...fields) {

    let value = '*';

    if (fields.length) {
       value = `"${fields.join('", "')}"`;
    }

    this.sql.return = {
      key: 'RETURNING',
      value
    };

    this.result = function (data) {
      return data.rows[0];
    }

    return this;

  }
  /**
   * 返回结果代理函数
   * @param {object} data 
   */
  result(data) {

    const { rowCount } = data;

    return { rowCount };

  }
  promise() {

    const { sql } = this;

    if (this.logic.length) {
      sql.where = {
        key: 'WHERE',
        value: this.logic.join('')
      };
    }


    let querySql = '';

    // sql 对象合并
    for (const name in sql) {
      const options = sql[name];
      if (options) {
        const { key, value } = options;
        querySql += `${key} ${value} `;
      }
    }

    this.logger(querySql);

    return this.client.query(querySql).then(this.result);

  }
}

module.exports = Update;