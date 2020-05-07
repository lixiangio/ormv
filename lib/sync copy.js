'use strict';

class Sync {
  constructor(model) {

    this.name = model.name;
    this.fields = model.fields;
    this.client = model.client;
    this.logger = model.logger;
    this.primaryKey = model.primaryKey;

  }
  async default(schema) {

    const fields = this._fields(schema);

    const comment = this._comment(schema);

    const sql = `CREATE TABLE IF NOT EXISTS "${schema}"."${this.name}" (${fields});${comment}`;

    this.logger(sql);

    const result = await this.client.query(sql);

    await this._uniqueIndex(schema);

    return result;

  }
  async rebuild(schema) {

    const fields = this._fields();

    const sql = `DROP TABLE IF EXISTS "${schema}"."${this.name}" CASCADE;CREATE TABLE "${schema}"."${this.name}" (${fields});`;

    this.logger(sql);

    const result = await this.client.query(sql);

    await this._uniqueIndex(schema);

    return result;

  }
  /**
   * 增量模式，根据模型自动新增和删除字段
   * @param {*} schema 
   */
  async increment(schema) {

    const sql = `SELECT DISTINCT a.attname as name FROM pg_attribute a JOIN pg_class pgc ON pgc.oid = a.attrelid LEFT JOIN pg_index i ON (pgc.oid = i.indrelid AND i.indkey[0] = a.attnum) LEFT JOIN pg_description com on (pgc.oid = com.objoid AND a.attnum = com.objsubid) LEFT JOIN pg_attrdef def ON (a.attrelid = def.adrelid AND a.attnum = def.adnum) WHERE a.attnum > 0 AND pgc.oid = a.attrelid AND pg_table_is_visible(pgc.oid) AND NOT a.attisdropped AND pgc.relname = '${this.name}' ORDER BY a.attname;`;

    this.logger(sql);

    const { rows } = await this.client.query(sql);

    if (rows.length) {

      const fields = {};

      for (const item of rows) {
        fields[item.name] = true;
      }

      const sqlArray = [];

      for (const name in this.fields) {

        // 字段不存在时自动创建
        if (fields[name] === undefined) {

          const item = this.fields[name];
          const { type, default: Default, alias, comment } = item;

          const defaultSql = Default ? ` DEFAULT ${Default}` : '';

          sqlArray.push(`ALTER TABLE "${schema}"."${this.name}" ADD COLUMN "${name}" ${alias || type}${defaultSql}`);

          if (comment) {

            sqlArray.push(`COMMENT ON COLUMN "${schema}"."${this.name}"."${name}" IS '${comment}'`);

          }

        }

      }

      // for (const name in fields) {

      //   // 字段不存在时自动删除
      //   if (this.fields[name] === undefined) {

      //     console.log(name)

      //     // sqlArray.push(`ALTER TABLE "${schema}"."${this.name}" ADD COLUMN "${name}" ${alias || type}`);

      //   }

      // }

      if (sqlArray.length) {

        const sql = sqlArray.join('; ')

        this.logger(sql);

        return await this.client.query(sql);

      }

      await this._uniqueIndex(schema);

    } else {

      return await this.default(schema);

    }

  }
  /**
   * 增加字段
   * @param {*} schema 
   */
  async increase(schema) {

  }
  /**
   * 删除字段
   * @param {*} schema 
   */
  async delete(schema) {

  }
  _fields(schema) {

    const fields = [];

    for (const name in this.fields) {

      const item = this.fields[name];

      if (item.primaryKey) {

        fields.push(`"${name}" SERIAL`);
        fields.push(`PRIMARY KEY ("${this.primaryKey}")`);

      } else {

        const { default: Default, alias, type } = item;

        const defaultSql = Default ? ` DEFAULT ${Default}` : '';

        fields.push(`"${name}" ${alias || type}${defaultSql}`);

      }

    }

    // 缺省状态下自动将id设为主键
    // if (!this.primaryKey) {

    //   fields.unshift(`"id" SERIAL`);
    //   fields.unshift(`PRIMARY KEY ("id")`);

    // }

    return fields.join(', ');

  }
  /**
   * 注释
   */
  _comment(schema) {

    let comment = '';

    for (const name in this.fields) {

      const options = this.fields[name];

      if (options.comment) {

        comment += `COMMENT ON COLUMN "${schema}"."${this.name}"."${name}" IS '${options.comment}';`;

      }

    }

    return comment;

  }
  /**
   * 创建唯一索引
   * @param {string} schema 
   */
  async _uniqueIndex(schema) {

    let sql = '';

    for (const name in this.fields) {

      const item = this.fields[name];

      if (item.uniqueIndex === true) {
        const row = `CREATE UNIQUE INDEX IF NOT EXISTS "${this.name}_${name}_unique" ON "${schema}"."${this.name}" USING btree ("${name}" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST);`
        this.logger(row);
        sql += row;
      }

    }

    await this.client.query(sql);

  }
}

module.exports = Sync;
