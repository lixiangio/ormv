'use strict'

// const logic = require('./logic.js');
const update = require('./update.js');
const filter = require('../filter.js');

const { sqlKey, sqlValue } = filter;

const op = Symbol.for('op');

module.exports = {
   // ...logic,
   ...update,

   // 原生sql
   $sql(value) {
      return {
         [op]: value
      };
   },
   $count(value){
      return {
         [op]: `count(${sqlValue(value)})`
      };
   },
   /**
    * 定义别名
    * @param {*} name1 
    * @param {*} name2 
    */
   $as(name1, name2) {
      return {
         [op]: `${sqlKey(name1)} AS ${sqlKey(name2)}`
      };
   },
   // json转字符串
   $jsonb(value) {
      return {
         [op]: sqlValue(JSON.stringify(value))
      };
   },

   $eq(value) {
      return {
         [op]: `= ${sqlValue(value)}`
      }
   },
   $ne(value) {
      return {
         [op]: `!= ${sqlValue(value)}`
      }
   },
   $gte(value) {
      return {
         [op]: `>= ${sqlValue(value)}`
      }
   },
   $gt(value) {
      return {
         [op]: `> ${sqlValue(value)}`
      }
   },
   $lte(value) {
      return {
         [op]: `<= ${sqlValue(value)}`
      }
   },
   $lt(value) {
      return {
         [op]: `< ${sqlValue(value)}`
      }
   },
   $not(value) {
      return {
         [op]: `IS NOT ${sqlValue(value)}`
      }
   },
   $in(...values) {
      values = values.map(value => {
         return sqlValue(value)
      })
      return {
         [op]: `IN (${values.join(`, `)})`
      }
   },
   $notIn(...values) {
      values = values.map(value => {
         return sqlValue(value)
      })
      return {
         [op]: `NOT IN ${values.join(`, `)}`
      }
   },
   $is(value) {
      return {
         [op]: `IS ${sqlValue(value)}`
      }
   },
   $like(value) {
      return {
         [op]: `LIKE ${sqlValue(value)}`
      }
   },
   $notLike(value) {
      return {
         [op]: `NOT LIKE ${sqlValue(value)}`
      }
   },
   $iLike(value) {
      return {
         [op]: `ILIKE ${sqlValue(value)}`
      }
   },
   $notILike(value) {
      return {
         [op]: `NOT ILIKE ${sqlValue(value)}`
      }
   },
   $regexp(value) {
      return {
         [op]: `~ ${sqlValue(value)}`
      }
   },
   $notRegexp(value) {
      return {
         [op]: `!~ ${sqlValue(value)}`
      }
   },
   $iRegexp(value) {
      return {
         [op]: `~* ${sqlValue(value)}`
      }
   },
   $notIRegexp(value) {
      return {
         [op]: `!~* ${sqlValue(value)}`
      }
   },
   $between(value) {
      return {
         [op]: `BETWEEN ${sqlValue(value)}`
      }
   },
   $notBetween(value) {
      return {
         [op]: `NOT BETWEEN ${sqlValue(value)}`
      }
   },
   $overlap(value) {
      return {
         [op]: `&& ${sqlValue(value)}`
      }
   },
   $contains(value) {
      return {
         [op]: `@> ${sqlValue(value)}`
      }
   },
   $contained(value) {
      return {
         [op]: `<@ ${sqlValue(value)}`
      }
   },
   $adjacent(value) {
      return {
         [op]: `-|- ${sqlValue(value)}`
      }
   },
   $strictLeft(value) {
      return {
         [op]: `<< ${sqlValue(value)}`
      }
   },
   $strictRight(value) {
      return {
         [op]: `>> ${sqlValue(value)}`
      }
   },
   $noExtendRight(value) {
      return {
         [op]: `&< ${sqlValue(value)}`
      }
   },
   $noExtendLeft(value) {
      return {
         [op]: `&> ${sqlValue(value)}`
      }
   },
   $any(value) {
      return {
         [op]: `ANY ${sqlValue(value)}`
      }
   },
   $all(value) {
      return {
         [op]: `ALL ${sqlValue(value)}`
      }
   },
   $col(value) {
      return {
         [op]: `COL ${sqlValue(value)}`
      }
   },
   $placeholder(value) {
      return {
         [op]: `$$PLACEHOLDER$$ ${sqlValue(value)}`
      }
   },
   $raw(value) {
      return {
         [op]: `DEPRECATED ${sqlValue(value)}`
      }
   },
}