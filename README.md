# ormv

Postgresql ORM模型

## 特性

* 使用函数链风格的查询表达式，简约、直观、易于读写

* 支持JSON类型字段建模，提供强大的JSON校验与合成功能

* 支持为JSON数组、对象创建独立的自增序列

* 支持多租户跨schema的数据模型同步与CRUD操作

* 支持扩展自定义的运算符函数

* 依然保留了类似SQL的语法特征，降低学习成本

## 感悟

受SQL语言兼容性、灵活性、复杂性等因素的影响，现有ORM很难优雅的实现SQL的所有功能，在针对某些复杂或边缘化的查询用例时显得非常鸡肋，可读性很差且性能低下。因此，ormv不再追求大而全，未来的目标将专注于优化常见的高频查询用例，期望在性能和开发体验之间找到最佳平衡点，对于复杂用例应该优先考虑原生sql拼接。

## Install

```
npm install ormv
```

## 示例

```js
async function main() {

   // 数据库参数配置
   const client = new Ormv({
      host: 'localhost',
      database: 'test',
      username: 'postgres',
      password: 'postgres',
      port: 5432,
      logger: true, // 显示sql
   });

   await client.connect(); // 连接数据库

   await client.query(`sql ...`, [...]); // 原生sql查询，支持参数化查询

   // 数据表建模
   const tasks = client.model('tasks', {
      'id': {
         "type": 'integer',
         "primaryKey": true,
      },
      'uid': 'integer',
      'keywords': {
         'state': 'boolean',
         'area': 'string',
         "createdAt": 'timestamp',
      },
      'list': [{
         'id': {
            type: 'integer',
            sequence: true,
         },
         'state': 'boolean',
         'address': [{
            'id': {
               type: 'integer',
               sequence: true
            },
            name: 'string',
            'createdAt': {
               type: 'timestamp',
               default: 'now()',
            },
            'updatedAt': {
               type: 'timestamp',
               default: 'now()',
            },
         }],
         'test': 'object',
         'createdAt': {
            type: 'timestamp',
            default: 'now()',
         },
         'updatedAt': {
            type: 'timestamp',
            default: 'now()',
         },
      }],
      "area": 'string',
      'state': {
         'type': 'boolean',
         'default': true,
      },
     'modes': 'jsonb',
     'email': {
         type: 'email',
      },
      "createdAt": {
         type: 'timestamp',
         default: 'now()',
      },
      "updatedAt": {
         type: 'timestamp',
         default: 'now()',
      },
   })

   const { $as, $in } = Ormv.Op; // 操作符

   // 基于数据模型的结构化查询
   const result = await tasks
      .schema("public")
      .select('id', 'keywords', $as("platform", "xx"))
      .where({
         id: $in(50, 51),
         keywords: {}
      })
      .and(
         {
            id: 5,
         },
         // 多个and条件之间为or关系
         {
            keywords: {}
         }
      )
      .or({ id: 5 })
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .limit(10)

}
```

## 定义模型

```js
   const model = client.model(name, options)
```

* name `String` - 模型名称

* options `Object` - 模型字段配置项

## 模型同步

模型与数据库表之间支持三种同步模式：

### 默认模式

> 无参数时会尝试创建新的数据表，当指定的表已存在时请求被拒绝，不做任何操作。

```js
ormv.sync('public.user');
```

### 增量模式

> 在已有表上新增字段，该模式只会添加新的列，不改变已有列和数据。

```js
ormv.sync('user', 'increment');
```

### 重置模式（危险）

> 删除已有的数据表重新构建表结构。

#### 示例

```js
// 同步schema为public下的user表
ormv.sync('public.user');

// 使用重构模式，删除并重建user表（未指定schema，默认为public）
ormv.sync('user', 'rebuild');

// 使用增量模式，批量同步schema为admin下所有的表
ormv.syncs('admin', 'rebuild');
```

### 批量同步指定public中的所有模型

```js
ormv.syncs('public', 'increment');
```

## 函数链

函数链提供了一种更加便捷、严谨和安全的sql编码方式，主要目的是尽可能避免SQL注入。

### insert 函数链

#### model.insert(data)

插入新数据



### find、select 函数链

#### model.find(and)

* and `Object` - and过滤条件

查询多条记录

#### model.select(field, ...)

* [field] `String` - 字段名

查询多条记录，选择返回字段

#### model.findOne(and)

* and `Object` - and过滤条件

查询单条记录

#### model.findPk(id)

* id `Number` - 主键id

查询主键id

#### model.order(options) 

* options `Object` - 排序字段

#### model.offset(value)

* value `Number` - 限定查询结果的起始位置

#### model.limit(value)

* value `Number` - 限制返回结果数量

#### model.count()

查询数据总量

### update 函数链

#### model.update(data)

更新数据

#### model.updateMerge(data)

更新数据，用合并的方式更新json、jsonb类型

#### model.updatePk(id, data)

更新指定主键的数据

### delete 函数链

#### model.delete(options)

删除多条数据

#### model.deletePk(id)

删除指定主键的数据

### 通用逻辑函数链 where(options).and.(options)or.(options)

逻辑函数链同时适用于find、update、delete操作。支持多个options参数，每个options内的子节点之间为and关系，options与options之间为or关系

该设计方案的优点是结构简单、逻辑清晰、易解析。缺点是仅支持双层嵌套逻辑关系，但可满足大多数逻辑应用场景。

* options `Object` - and条件集合

```js
model.where(options, ...).or(options, ...).and(options, ...);
```

<!-- ### 事务 -->

## 操作符函数

### 查询函数

> 用于options.where属性中，作为数据筛选条件，包含逻辑运算符、比较运算符等。

### 原生sql运算符

#### Op.$sql()

添加原生sql子句，内置单引号转义。

### 比较运算符

#### Op.$eq()

#### Op.$ne()

#### Op.$gte()

#### Op.$gt()

#### Op.$lte()

#### Op.$lt()


### 其它操作符

#### Op.$not()

#### Op.$is()

#### Op.$in()

#### Op.$notIn()

#### Op.$like()

#### Op.$notIn()

#### Op.$notLike()

#### Op.$iLike()

#### Op.$notILike()

#### Op.$regexp()

#### Op.$regexp()

#### Op.$regexp()

#### Op.$regexp()

#### Op.$notRegexp()

#### Op.$iRegexp()

#### Op.$notIRegexp()

#### Op.$between()

#### Op.$notBetween()

#### Op.$overlap()

#### Op.$contains()

#### Op.$contained()

#### Op.$adjacent()

#### Op.$strictLeft()

#### Op.$strictRight()

#### Op.$noExtendRight()

#### Op.$noExtendLeft()

#### Op.$any()

#### Op.$all()

#### Op.$values()

#### Op.$col()

#### Op.$placeholder()

#### Op.$join()

#### Op.$raw()


### Update函数

> 用于json类型数据的插入、合并、删除操作

#### Op.$merge()

#### Op.$set()

#### Op.$insert()

#### Op.$insertByPath()

#### Op.$insertFirst()