const ignore = [undefined, null, ''];
class Insert {
    constructor(model) {
        const { client, schemaname = 'public', aliasIndex, fields } = model;
        this.model = model;
        this.client = client;
        this.logger = client.logger;
        this.schema = schemaname;
        this.aliasIndex = aliasIndex;
        this.fields = fields;
        this.sql = [`INSERT INTO `, `"${schemaname}"."${model.name}"`, ` (`, , `) VALUES (`, , `)`, , ` RETURNING *`];
    }
    /**
     * 插入新数据
     * @param {Object} data
     */
    insert(data) {
        if (typeof data !== 'object') {
            throw new TypeError('data参数必须为对象类型');
        }
        const keys = [];
        const values = [];
        this.keys = keys;
        this.values = values;
        const { fields } = this;
        for (const name in fields) {
            const options = fields[name];
            keys.push(options.safetyKey);
            let value = data[name];
            // 空值
            if (ignore.includes(value)) {
                // 默认值
                if (options.default !== undefined) {
                    if (typeof options.default === 'function') {
                        values.push(options.default(this));
                    }
                    else {
                        values.push(options.default);
                    }
                }
                // 禁止空值
                else if (options.allowNull === false) {
                    throw new TypeError(`${options.safetyKey}字段值不允许为空`);
                }
                else {
                    values.push('DEFAULT'); // 空值用DEFAULT填充
                }
            }
            else {
                // 函数运算符，使用内置序列化验证器
                if (typeof value === 'function') {
                    value = value(name, this);
                }
                else {
                    const result = options.sql(value, this);
                    if (result.error) {
                        throw new TypeError(`${this.model.name}模型${result.error}`);
                    }
                    value = result.value;
                }
                values.push(value);
            }
        }
        this.sql[3] = keys.join(',');
        this.sql[5] = values.join(',');
        return this;
    }
    /**
     * 冲突更新
     * @param {string} field 冲突字段
     */
    update(field = 'id') {
        const set = [];
        for (const index in this.keys) {
            const name = this.keys[index];
            const value = this.values[index];
            set.push(`${name} = ${value}`);
        }
        this.sql[7] = ` ON conflict("${field}") DO UPDATE SET ${set}`;
        return this;
    }
    /**
     * 忽略冲突
     * @param {string} field 冲突字段
     */
    ignore(field) {
        this.sql[7] = ` ON conflict("${field}") DO NOTHING`;
        return this;
    }
    /**
     * 返回指定列
     */
    return(...fields) {
        if (fields.length) {
            const value = `"${fields.join('", "')}"`;
            this.sql[8] = ` RETURNING ${value}`;
        }
        return this;
    }
    /**
     * 不返回指定列
     */
    noReturn(...exclude) {
        if (exclude.length) {
            const fields = [];
            for (const name in this.fields) {
                if (exclude.includes(name) === false) {
                    fields.push(name);
                }
            }
            this.sql[8] = ` RETURNING "${fields.join('", "')}"`;
        }
        return this;
    }
    promise() {
        const sql = this.sql.join('');
        this.logger(sql);
        return this.client.query(sql).then(data => {
            return data.rows[0];
        });
    }
    /**
     * Promise对象then()方法
     * @param {Function} resolve
     * @param {Function} reject
     */
    then(resolve, reject) {
        return this.promise().then(resolve, reject);
    }
    catch(reject) {
        return this.promise().catch(reject);
    }
}
export default Insert;
