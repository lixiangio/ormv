'use strict'

const logic = require('./logic');
const update = require('./update');
const replace = require('../replace');

const { replaceKey, replaceValue } = replace;

const op = Symbol.for('op');

module.exports = {
   ...logic,
   ...update,

   // 原生sql
   $sql(value) {
      return {
         [op]: value
      };
   },
   /**
    * 定义别名
    * @param {*} name1 
    * @param {*} name2 
    */
   $as(name1, name2) {
      return {
         [op]: `${replaceKey(name1)} AS ${replaceKey(name2)}`
      };
   },
   // json转字符串
   $jsonb(value) {
      return {
         [op]: replaceValue(JSON.stringify(value))
      };
   },

   $eq(value) {
      return {
         [op]: `= ${replaceValue(value)}`
      }
   },
   $ne(value) {
      return {
         [op]: `!= ${replaceValue(value)}`
      }
   },
   $gte(value) {
      return {
         [op]: `>= ${replaceValue(value)}`
      }
   },
   $gt(value) {
      return {
         [op]: `> ${replaceValue(value)}`
      }
   },
   $lte(value) {
      return {
         [op]: `<= ${replaceValue(value)}`
      }
   },
   $lt(value) {
      return {
         [op]: `< ${replaceValue(value)}`
      }
   },
   $not(value) {
      return {
         [op]: `IS NOT ${replaceValue(value)}`
      }
   },
   $in(...values) {
      values = values.map(value => {
         return replaceValue(value)
      })
      return {
         [op]: `IN (${values.join(`, `)})`
      }
   },
   $notIn(...values) {
      values = values.map(value => {
         return replaceValue(value)
      })
      return {
         [op]: `NOT IN ${values.join(`, `)}`
      }
   },
   $is(value) {
      return {
         [op]: `IS ${replaceValue(value)}`
      }
   },
   $like(value) {
      return {
         [op]: `LIKE ${replaceValue(value)}`
      }
   },
   $notLike(value) {
      return {
         [op]: `NOT LIKE ${replaceValue(value)}`
      }
   },
   $iLike(value) {
      return {
         [op]: `ILIKE ${replaceValue(value)}`
      }
   },
   $notILike(value) {
      return {
         [op]: `NOT ILIKE ${replaceValue(value)}`
      }
   },
   $regexp(value) {
      return {
         [op]: `~ ${replaceValue(value)}`
      }
   },
   $notRegexp(value) {
      return {
         [op]: `!~ ${replaceValue(value)}`
      }
   },
   $iRegexp(value) {
      return {
         [op]: `~* ${replaceValue(value)}`
      }
   },
   $notIRegexp(value) {
      return {
         [op]: `!~* ${replaceValue(value)}`
      }
   },
   $between(value) {
      return {
         [op]: `BETWEEN ${replaceValue(value)}`
      }
   },
   $notBetween(value) {
      return {
         [op]: `NOT BETWEEN ${replaceValue(value)}`
      }
   },
   $overlap(value) {
      return {
         [op]: `&& ${replaceValue(value)}`
      }
   },
   $contains(value) {
      return {
         [op]: `@> ${replaceValue(value)}`
      }
   },
   $contained(value) {
      return {
         [op]: `<@ ${replaceValue(value)}`
      }
   },
   $adjacent(value) {
      return {
         [op]: `-|- ${replaceValue(value)}`
      }
   },
   $strictLeft(value) {
      return {
         [op]: `<< ${replaceValue(value)}`
      }
   },
   $strictRight(value) {
      return {
         [op]: `>> ${replaceValue(value)}`
      }
   },
   $noExtendRight(value) {
      return {
         [op]: `&< ${replaceValue(value)}`
      }
   },
   $noExtendLeft(value) {
      return {
         [op]: `&> ${replaceValue(value)}`
      }
   },
   $any(value) {
      return {
         [op]: `ANY ${replaceValue(value)}`
      }
   },
   $all(value) {
      return {
         [op]: `ALL ${replaceValue(value)}`
      }
   },
   $col(value) {
      return {
         [op]: `COL ${replaceValue(value)}`
      }
   },
   $placeholder(value) {
      return {
         [op]: `$$PLACEHOLDER$$ ${replaceValue(value)}`
      }
   },
   $raw(value) {
      return {
         [op]: `DEPRECATED ${replaceValue(value)}`
      }
   },
}