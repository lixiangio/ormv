import Base from './base.js';
class Delete extends Base {
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
            delete: {
                key: 'DELETE FROM',
                value: `"${schemaname}"."${model.name}"`
            },
            where: undefined,
            return: {
                key: 'RETURNING',
                value: '*'
            },
        };
    }
    /**
     * 返回insert结果
     */
    return(...fields) {
        if (fields.length) {
            this.sql.return = {
                key: 'RETURNING',
                value: `"${fields.join('", "')}"`
            };
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
            this.sql.return = {
                key: 'RETURNING',
                value: `"${fields.join('", "')}"`
            };
        }
        return this;
    }
    /**
     * 返回结果代理函数
     * @param {*} data
     */
    result(data) {
        const [row] = data.rows;
        return row || null;
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
export default Delete;
