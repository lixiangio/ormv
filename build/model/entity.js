import Types from '../types.js';
import jsonPretreatment from '../json/preprocessor.js';
import Op from '../operator/index.js';
import Insert from './query/insert.js';
import Find from './query/find.js';
import Update from './query/update.js';
import Delete from './query/delete.js';
const { $merge, $in } = Op;
const { toString } = Object.prototype;
/**
 * 模型类（全局只读），禁止改写其成员属性和方法
 */
export default class Model {
    /**
     * @param {Object} client 客户端实例
     * @param {String} name 模型名称
     * @param {Object} options 模型字段配置项
     */
    constructor(client, name, options) {
        const { config, logger } = client;
        this.name = name;
        this.client = client;
        this.config = config;
        this.logger = logger;
        this.options = options; // 原始数据模型
        this.fields = {};
        this.aliasIndex = {};
        this.schemaname = 'public';
        this.sequence = [];
        const { fields } = this;
        for (const field in options) {
            const express = options[field];
            if (typeof express === 'object') {
                const { type } = express;
                if (type) {
                    const typeCtx = Types[type];
                    if (typeCtx === undefined) {
                        throw new Error(`${field}字段type属性值“${type}”无效`);
                    }
                    const fieldOptions = { ...express };
                    fieldOptions.sql = typeCtx(field);
                    if (typeCtx.alias) {
                        fieldOptions.alias = typeCtx.alias;
                    }
                    const { default: _default } = fieldOptions;
                    // 当 default 值为对象或数组时，预先将其序列化为字符串
                    // 当 default 值为字符串时，需要使用单引号包裹 (由于sql本身支持number、boolean类型，因此可以不转字符串直接输出)
                    if (_default && typeof _default === 'object') {
                        const jsonString = JSON.stringify(_default);
                        fieldOptions.default = `'${jsonString}'::jsonb`;
                    }
                    fields[field] = fieldOptions;
                }
                // express为数组结构
                else if (Array.isArray(express)) {
                    jsonPretreatment(this, field, express); // 预处理
                    fields[field] = {
                        type: 'array',
                        alias: Types.array.alias,
                        sql: Types.array(field, express),
                        default: "'[]'::jsonb",
                    };
                }
                // express为对象结构
                else {
                    jsonPretreatment(this, field, express);
                    fields[field] = {
                        type: 'object',
                        alias: Types.object.alias,
                        sql: Types.object(field, express),
                        default: "'{}'::jsonb",
                    };
                }
                if (express.primaryKey === true) {
                    this.primaryKey = field;
                }
            }
            // 直接声明类型
            else if (typeof express === 'string') {
                const typeCtx = Types[express];
                if (!typeCtx) {
                    throw new Error(`${field}字段“${express}”类型定义无效`);
                }
                fields[field] = {
                    type: express,
                    alias: typeCtx.alias,
                    sql: typeCtx(field, express)
                };
            }
            else {
                throw new Error(`${field}字段值必须为object或string类型`);
            }
            fields[field].safetyKey = `"${field}"`; // 预处理，字段名转sql
        }
        if (!this.primaryKey) {
            const primaryKey = {
                type: 'integer',
                safetyKey: '"id"',
                sql: Types.integer('id')
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
                    safetyKey: `"${field}"`,
                    sql: Types.timestamp(field),
                    default: 'now()',
                };
                options[field] = 'timestamp';
            }
        }
        for (const field in fields) {
            this.aliasIndex[field] = fields[field].safetyKey;
        }
    }
    /**
     * 指定模式
     * @param {string} name 模式名称
     */
    schema(name = 'public') {
        const schemaModel = Object.create(this);
        schemaModel.schemaname = name;
        return schemaModel;
    }
    /**
     * 插入单条数据
     * @param {Object} data
     * @param {Object} options 配置项
     */
    insert(data, options) {
        const chain = new Insert(this);
        return chain.insert(data, options);
    }
    /**
     * 插入多条数据
     * @param {Object} data
     * @param {Object} options 配置项
     */
    insertMany(list, options) {
        const chain = new Insert(this);
        return chain.insert(list, options);
    }
    /**
     * select查询，等同于find().select()
     * @param  {Array} fields 选择字段
     */
    select(...fields) {
        const chain = new Find(this);
        chain.result = function (data) {
            return data.rows;
        };
        return chain.return(...fields);
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
        };
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
            return data.rows[0] || null;
        };
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
        }
        else {
            throw new Error(`模型中未定义主键`);
        }
        chain.limit(1);
        chain.result = function (data) {
            return data.rows[0] || null;
        };
        return chain;
    }
    /**
     * 向实例中追加sql属性
     */
    _findSql(instance) {
        return {
            "select": {
                "key": "SELECT",
                "value": "*",
            },
            "from": {
                "key": "FROM",
                "value": `"${instance.schema}"."${this.name}"`
            },
            "where": undefined,
            "group": undefined,
            "order": undefined,
            "offset": undefined,
            "limit": undefined,
        };
    }
    /**
     * 更新主键数据
     * @param {Number} pk 主键id值
     * @param {Object} data 更新数据
     */
    updatePk(pk, data) {
        const chain = new Update(this);
        chain.update(data);
        const { primaryKey } = this;
        if (primaryKey) {
            chain.where({ [primaryKey]: pk });
        }
        else {
            throw new Error(`模型中未定义主键`);
        }
        chain.return();
        return chain;
    }
    /**
     * 更新单条
     * @param {Object} data 更新数据
     */
    update(data) {
        const chain = new Update(this);
        chain.update(data);
        return chain;
    }
    /**
     * 更新多条
     * @param {Object} data 更新数据
     */
    updateMany(data) {
        const chain = new Update(this);
        chain.update(data);
        this.result = function (data) {
            const { rowCount } = data;
            return { rowCount };
        };
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
     * 删除指定主键的数据
     * @param  {Number} pk 主键
     */
    deletePk(pk) {
        const chain = new Delete(this);
        const { primaryKey } = this;
        chain.where({ [primaryKey]: pk });
        return chain;
    }
    /**
     * 删除单个数据
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
     * 删除多条数据
     * @param  {[Number]} ids 主键id队列
     */
    deleteMany(condition) {
        const chain = new Delete(this);
        if (condition) {
            chain.where(condition);
        }
        chain.result = function ({ rowCount }) {
            return { rowCount };
        };
        return chain;
    }
    /**
     * 事务
     * @param {object} ormv.transaction()输出的事务对象
     */
    transaction({ client }) {
        const transactionModel = Object.create(this);
        transactionModel.client = client;
        return transactionModel;
    }
}
;
