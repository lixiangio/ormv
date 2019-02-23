'use strict'

const setAction = require('./setAction');
const attributesPretreatment = require('./attributes');
const whereGenerate = require('./where');
const replace = require('./replace');

module.exports = class {
   /**
    * 
    * @param {Object} options 
    */
   constructor(options) {

      let { client, attributes, name } = options;

      this.client = client;
      this.logger = client.logger;

      this.attributes = attributes;

      let attributesKeys = [];

      for (let field of Object.keys(attributes)) {
         attributesKeys.push(`"${field}"`);
      }

      this.attributesKeys = attributesKeys;

      // 添加s后缀以避免sql保留字冲突
      // if (name[name.length - 1] !== 's') {
      //    name += 's'
      // }

      this.name = name.trim();

      attributesPretreatment.call(this, attributes);

   }
   /**
    * 
    * @param {*} data
    */
   async create(data) {

      let fields = []
      let values = []

      if (typeof data === 'object') {

         for (let field in data) {

            let attribute = this.attributes[field];

            if (attribute) {

               let { type, validate } = attribute;

               let value = data[field];

               if (type(value)) {

                  fields.push(`"${replace(field)}"`);

                  value = validate(value);

                  values.push(`'${value}'`);

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            } else {

               continue;

            }

         }

      } else {

         throw new TypeError('data参数必须为对象类型');

      }

      if (fields.includes('"id"') === false) {

         fields.unshift('"id"');
         values.unshift('DEFAULT');

      }

      let sql = `INSERT INTO ${this.name} (${fields}) VALUES (${values})`

      this.logger(sql);

      let result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      }

   }
   /**
    * 
    * @param {Object} options 
    */
   async find(options = {}) {

      let { attributes, attributesSQL, where, group, order, limit, offset } = options;

      const container = [];

      // 字段属性
      if (Array.isArray(attributes)) {
         for (let field of attributes) {
            container.push(`"${field}"`);
         }
      }

      // 原生SQL，支持SELECT (*) FROM区域的所有SQL语句
      // 不做任何过滤处理，应避免直接使用外部参数合成SQL产生的注入风险
      if (Array.isArray(attributesSQL)) {
         for (let field of attributesSQL) {
            container.push(field);
         }
      }

      if (container.length) {
         attributes = replace(container);
      } else {
         attributes = this.attributesKeys;
      }

      where = whereGenerate(where)

      // group与order只能二选一，优先使用group
      // group字段覆盖attributes
      if (group) {
         group = replace(group);
         attributes = group;
         group = ` GROUP BY ${group}`;
         order = ''
      } else if (order) {
         let list = []
         for (let name in order) {
            let value = order[name]
            list.push(`${name} ${value}`)
         }
         order = ' ORDER BY ' + list.join(", ");
         order = replace(order);
         group = ''
      } else {
         group = ''
         order = ''
      }

      if (typeof limit === 'number') {
         limit = ` LIMIT ${limit}`
      } else {
         limit = ''
      }

      if (typeof offset === 'number') {
         offset = ` OFFSET ${offset}`
      } else {
         offset = ''
      }

      let sql = `SELECT ${attributes} FROM "${this.name}"${where}${group}${order}${limit}${offset}`

      this.logger(sql)

      const result = await this.client.query(sql);

      return result.rows;

   }
   /**
    * find的别名
    * @param {Object} options 
    */
   async findAll(options = {}) {
      return this.find(options);
   }
   /**
    * 
    * @param {Object} options 
    */
   async findOne(options = {}) {

      options.limit = 1;

      const result = await this.find(options)

      if (result) {
         return result[0]
      }

   }
   /**
    * 按主键搜索
    * @param {Number} id 主键id  
    * @param {Object} options 
    */
   async findByPk(id, options = {}) {

      let { where } = options

      if (where === undefined) {
         where = {}
         options.where = where
      }

      if (this.primaryKey) {
         where[this.primaryKey] = id
      } else {
         where.id = id
      }

      options.limit = 1;

      const result = await this.find(options)

      if (result) {
         return result[0]
      }

   }
   /**
    * 查询数据总量
    */
   async count(options) {

      options.attributesSQL = [`count(*)`]
      const result = await this.find(options);

      if (result) {
         return result[0].count
      }

   }
   /**
    * 
    * @param {Object} options 
    * @param {Object} data 更新数据
    */
   async update(options = {}, data) {

      let { where } = options;

      let set = [];

      if (typeof data === 'object') {

         for (let field in data) {

            let attribute = this.attributes[field];

            if (attribute) {

               let { type, validate } = attribute;

               let value = data[field];

               if (type(value)) {

                  if (typeof value === 'object') {

                     let symbols = Object.getOwnPropertySymbols(value);

                     // 对象中包含symbol操作符，使用对应的操作符函数处理
                     if (symbols.length) {

                        for (let symbol of symbols) {
                           let options = value[symbol];
                           value = setAction[symbol](field, options, validate);
                           set.push(`${field} = ${value}`);
                        }

                     }

                     // 普通JSON对象，直接序列化为字符串
                     else {

                        value = validate(value);

                        set.push(`${field} = '${value}'`);

                     }

                  }

                  // 验证失败时，通过抛错的方式断开执行
                  else {

                     validate(value);

                     value = replace(value);

                     set.push(`${field} = '${value}'`);

                  }

               } else {

                  throw new TypeError(`${field}字段值必须为${type.name}类型`);

               }

            } else {

               throw new Error(`${this.name}模型中找不到${field}字段`);

            }

         }

      } else {

         throw new Error(`data参数值必须为Object类型`);

      }

      where = whereGenerate(where)

      let sql = `UPDATE ${this.name} SET ${set}${where}`;

      this.logger(sql)

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
   /**
    * 
    * @param {Object} options 
    */
   async destroy(options = {}) {

      let { where } = options;

      where = whereGenerate(where);

      let sql = `DELETE FROM ${this.name}${where}`;

      this.logger(sql)

      const result = await this.client.query(sql);

      return {
         rowCount: result.rowCount
      };

   }
}