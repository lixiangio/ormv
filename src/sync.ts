class Sync {
  constructor(model) {

    this.name = model.name;
    this.fields = model.fields;
    this.client = model.client;
    this.logger = model.logger;
    this.primaryKey = model.primaryKey;
    this.sequence = model.sequence;

  }
  async default(schema) {

    const fields = this._fields();

    const comment = this._comment(schema);

    const sql = `CREATE TABLE IF NOT EXISTS "${schema}"."${this.name}" (${fields});${comment}`;

    this.logger(sql);

    const result = await this.client.query(sql);

    await this._uniqueIndex(schema);

    await this._sequence(schema);

    return result;

  }
  async rebuild(schema) {

    const fields = this._fields();

    const comment = this._comment(schema);

    const sql = `DROP TABLE IF EXISTS "${schema}"."${this.name}" CASCADE;CREATE TABLE "${schema}"."${this.name}" (${fields});${comment}`;

    this.logger(sql);

    const result = await this.client.query(sql);

    await this._uniqueIndex(schema);

    await this._sequence(schema);

    return result;

  }
  /**
   * 增量模式，根据模型自动新增和删除字段
   * @param {string} schema pg模式名称
   * @param {boolean} add 新增字段
   * @param {boolean} remove 删除字段
   */
  async increment(schema, add = true, remove = false) {

    const sql = `select column_name, data_type, is_nullable from information_schema.columns where table_schema='${schema}' and table_name='${this.name}';`;

    this.logger(sql);

    const { rows } = await this.client.query(sql);

    if (rows.length === 0) return;

    const fields = {};

    for (const item of rows) {
      fields[item.column_name] = true;
    }

    const sqlArray = [];

    if (add === true) {

      // 字段不存在时自动创建
      for (const name in this.fields) {

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

    }

    if (remove === true) {

      // 字段不存在时自动删除
      for (const name in fields) {

        if (this.fields[name] === undefined) {

          sqlArray.push(`alter table "${schema}"."${this.name}" drop column if exists "${name}"`);

        }

      }

    }

    if (sqlArray.length) {

      const sql = sqlArray.join('; ')

      this.logger(sql);

      return await this.client.query(sql);

    }

    await this._uniqueIndex(schema);

    await this._sequence(schema);

  }
  /**
   * 增加字段，increment(schema, true, false) 的快捷方式
   * @param {string} schema 
   */
  async add(schema) {

    await this.increment(schema, true, false);

  }
  /**
   * 移除字段，increment(schema, false, true) 的快捷方式
   * @param {string} schema 
   */
  async remove(schema) {

    await this.increment(schema, false, true);

  }
  _fields() {

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
   * 自定义序列
   */
  async _sequence(schema) {

    const sqlArray = [];

    for (const path of this.sequence) {

      const row = `CREATE SEQUENCE IF NOT EXISTS "${schema}"."${path}"`;

      this.logger(row);

      sqlArray.push(row)

    }

    await this.client.query(sqlArray.join(';'));

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
        const row = `CREATE UNIQUE INDEX IF NOT EXISTS "${name}_unique" ON "${schema}"."${this.name}" USING btree ("${name}" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST);`
        this.logger(row);
        sql += row;
      }

    }

    await this.client.query(sql);

  }
}

export default Sync;
