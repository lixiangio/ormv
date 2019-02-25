## ormv

Postgresql ORM模型

### 特点

* 支持对JSON类型字段建模，提供强大的嵌套数据校验功能

* 基于函数风格的查询表达式，具有简约、直观、易于调试等特性

* 支持扩展自定义的运算符函数，对于定制化需求非常有用

* 在实现结构化查询的同时，依然能找到类似SQL语法的感觉

### Install

```
npm install ormv
```

#### 示例

```js
async function main() {

   // 数据库参数配置
   const client = new Ormv({
      db: {
         host: 'localhost',
         database: 'test',
         username: 'postgres',
         password: 'postgres',
         port: 5432,
      },
      logger: true
   })

   // 连接数据库
   await client.connect()

   // sql查询，支持参数化查询
   await client.query(sql)

   const { CHAR, INTEGER, JSONB, BOOLEAN } = Ormv.Type

   // 数据表建模
   const tasks = client.define('tasks', {
      'id': {
         type: INTEGER,
         primaryKey: true,
      },
      'keywords': {
         type: JSONB
      },
      'email': {
         type: CHAR,
         validate: {
            isEmail: true
         }
      },
   })

   const { $and, $sql, $in } = Ormv.Op;

   // 基于数据模型的结构化查询
   await tasks.find({
      select: [
         'id',
         'keywords',
         $sql(`"email" as "Email"`)
      ],
      where: $and({
         id: $in(1, 34),
         email: $in(
            "Kareem.Kerluke@yahoo.com",
            "Janae.Kiehn95@yahoo.com"
         )
      }).$or({
         id: 6,
         keywords: {},
      }),
      order: {
         "tasks.id": "DESC",
         "tasks.keywords": "DESC"
      },
      limit: 10
   })

   await tasks.findOne()

   await tasks.findByPk()

}
```

### 定义模型

> 模型的命名会被强制转为带s后缀的单词，防止与pg保留关键词产出冲突。

### API

#### model.insert(data)

插入

#### model.findAll(options)

查询多条

#### model.findOne(options)

查询单条

#### model.findByPk(id, options)

在主键字段上搜索

#### model.count(options)

查询数据总量

#### model.update(options)

更新数据

#### model.destroy(options)

删除数据

## options 查询选项

* select `Array` - 选择字段

* where `Object` - 查询过滤条件，默认为and查询

* order `Object` - 排序

* offset `Number` - 限定查询结果的起始位置

* limit `Number` - 限制返回结果数量

<!-- * transaction `*` - 事务选项，待开发 -->

## 查询操作符函数

仅用于options.where属性中，作为数据筛选条件，包含逻辑运算符、比较运算符等。

### 示例

```js
const Ormv = require('ormv');
const { $and, $or, $in, $lt, $... } = Ormv.Op;
```

### 逻辑运算符

#### Op.$and()

逻辑与，支持链式操作

#### Op.$or()

逻辑或，支持链式操作

### 比较运算符

#### Op.$eq()

#### Op.$ne()

#### Op.$gte()

#### Op.$gt()

#### Op.$lte()

#### Op.$lt()


### 其它操作符

#### Op.$sql()

添加原生sql子句，内置单引号转义。

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


## update操作符函数

### 示例

```js
const Ormv = require('ormv');
const { $merge, $insert, $... } = Ormv.Op;
```

#### Op.$merge()

#### Op.$set()

#### Op.$insert()

#### Op.$insertByPath()

#### Op.$insertFirst()