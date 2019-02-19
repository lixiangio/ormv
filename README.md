## ormv

基于pg模块封装的orm模型

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

   // 基于数据模型的结构化查询
   await tasks.findAll()

   await tasks.findOne()

   await tasks.findByPk()

}
```

### API

#### model.insert(data)

插入

#### model.findAll(options)

查询多条

#### model.findOne(options)

查询单条

#### model.findByPk(id, options)

在主键字段上搜索

### options参数

#### options.where

where参数值的第一层仅支持逻辑运算符(and、or)，比较运算符位于字段对象内。

```js
{
   where: {
      id: 6,
      keywords: {
         [Op.in]: { "u": 99 }
      },
      [Op.or]: [
         {
            a: 1
         },
         {
            b: 2
         }
      ],
   }
}
```

#### options.transaction 

#### options.order

#### options.limit

#### options.offset
