'use strict';

const filter = require('../filter.js');

const { sqlKey, sqlValue } = filter;

module.exports = {
   /**
    * 单值范围
    * @param {Number} start 起始值
    * @param {Number} end 结束值
    */
   $scope(start, end) {
      return function (field) {
         return `>= ${sqlValue(start)} AND ${sqlKey(field)} < ${sqlValue(end)}`;
      }
   },
   /**
    * 仅用于range数据类型
    * @param {Number} start 起始值
    * @param {Number} end 结束值
    */
   $range(start, end) {
      return function () {
         return [sqlValue(start), v2sqlValue(end)];
      }
   },
   $eq(value) {
      return function () {
         return `= ${sqlValue(value)}`
      }
   },
   $ne(value) {
      return function () {
         return `!= ${sqlValue(value)}`
      }
   },
   $gte(value) {
      return function () {
         return `>= ${sqlValue(value)}`
      }
   },
   $gt(value) {
      return function () {
         return `> ${sqlValue(value)}`
      }
   },
   $lte(value) {
      return function () {
         return `<= ${sqlValue(value)}`
      }
   },
   $lt(value) {
      return function () {
         return `< ${sqlValue(value)}`
      }
   },
   $not(value) {
      return function () {
         return `IS NOT ${sqlValue(value)}`
      }
   },
   $in(...values) {
      values = values.map(value => {
         return sqlValue(value);
      })
      return function () {
         return `IN (${values.join(`, `)})`
      }
   },
   $notIn(...values) {
      values = values.map(value => {
         return sqlValue(value);
      })
      return function () {
         return `NOT IN ${values.join(`, `)}`
      }
   },
   $is(value) {
      return function () {
         return `IS ${sqlValue(value)}`
      }
   },
   $like(value) {
      return function () {
         return `LIKE ${sqlValue(value)}`
      }
   },
   $notLike(value) {
      return function () {
         return `NOT LIKE ${sqlValue(value)}`
      }
   },
   $iLike(value) {
      return function () {
         return `ILIKE ${sqlValue(value)}`
      }
   },
   $notILike(value) {
      return function () {
         return `NOT ILIKE ${sqlValue(value)}`
      }
   },
   $regexp(value) {
      return function () {
         return `~ ${sqlValue(value)}`
      }
   },
   $notRegexp(value) {
      return function () {
         return `!~ ${sqlValue(value)}`
      }
   },
   $iRegexp(value) {
      return function () {
         return `~* ${sqlValue(value)}`
      }
   },
   $notIRegexp(value) {
      return function () {
         return `!~* ${sqlValue(value)}`
      }
   },
   $between(value) {
      return function () {
         return `BETWEEN ${sqlValue(value)}`
      }
   },
   $notBetween(value) {
      return function () {
         return `NOT BETWEEN ${sqlValue(value)}`
      }
   },
   $overlap(value) {
      return function () {
         return `&& ${sqlValue(value)}`
      }
   },
   $contains(value) {
      return function () {
         return `@> ${sqlValue(value)}`
      }
   },
   $contained(value) {
      return function () {
         return `<@ ${sqlValue(value)}`
      }
   },
   $adjacent(value) {
      return function () {
         return `-|- ${sqlValue(value)}`
      }
   },
   $strictLeft(value) {
      return function () {
         return `<< ${sqlValue(value)}`
      }
   },
   $strictRight(value) {
      return function () {
         return `>> ${sqlValue(value)}`
      }
   },
   $noExtendRight(value) {
      return function () {
         return `&< ${sqlValue(value)}`
      }
   },
   $noExtendLeft(value) {
      return function () {
         return `&> ${sqlValue(value)}`
      }
   },
}