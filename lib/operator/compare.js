'use strict';

const filter = require('../filter.js');

const { sqlKey, sqlString } = filter;

module.exports = {
   $eq(value) {
      return function () {
         return `= ${sqlString(value)}`
      }
   },
   $ne(value) {
      return function () {
         return `!= ${sqlString(value)}`
      }
   },
   $gte(value) {
      return function () {
         return `>= ${sqlString(value)}`
      }
   },
   $gt(value) {
      return function () {
         return `> ${sqlString(value)}`
      }
   },
   $lte(value) {
      return function () {
         return `<= ${sqlString(value)}`
      }
   },
   $lt(value) {
      return function () {
         return `< ${sqlString(value)}`
      }
   },
   $not(value) {
      return function () {
         return `IS NOT ${sqlString(value)}`
      }
   },
   $in(...values) {
      values = values.map(value => {
         return sqlString(value);
      })
      return function () {
         return `IN (${values.join(`, `)})`
      }
   },
   $notIn(...values) {
      values = values.map(value => {
         return sqlString(value);
      })
      return function () {
         return `NOT IN ${values.join(`, `)}`
      }
   },
   /**
    * 单值范围
    * @param {Number} start 起始值
    * @param {Number} end 结束值
    */
   $scope(start, end) {
      return function (field) {
         return `>= ${sqlString(start)} AND ${sqlKey(field)} < ${sqlString(end)}`;
      }
   },
   /**
    * 仅用于range数据类型
    * @param {Number} start 起始值
    * @param {Number} end 结束值
    */
   $range(start, end) {
      return function () {
         return [sqlString(start), sqlString(end)];
      }
   },
   $is(value) {
      return function () {
         return `IS ${sqlString(value)}`
      }
   },
   $like(value) {
      return function () {
         return `LIKE ${sqlString(value)}`
      }
   },
   $notLike(value) {
      return function () {
         return `NOT LIKE ${sqlString(value)}`
      }
   },
   $iLike(value) {
      return function () {
         return `ILIKE ${sqlString(value)}`
      }
   },
   $notILike(value) {
      return function () {
         return `NOT ILIKE ${sqlString(value)}`
      }
   },
   $regexp(value) {
      return function () {
         return `~ ${sqlString(value)}`
      }
   },
   $notRegexp(value) {
      return function () {
         return `!~ ${sqlString(value)}`
      }
   },
   $iRegexp(value) {
      return function () {
         return `~* ${sqlString(value)}`
      }
   },
   $notIRegexp(value) {
      return function () {
         return `!~* ${sqlString(value)}`
      }
   },
   $between(value) {
      return function () {
         return `BETWEEN ${sqlString(value)}`
      }
   },
   $notBetween(value) {
      return function () {
         return `NOT BETWEEN ${sqlString(value)}`
      }
   },
   $overlap(value) {
      return function () {
         return `&& ${sqlString(value)}`
      }
   },
   $contains(value) {
      return function () {
         return `@> ${sqlString(value)}`
      }
   },
   $contained(value) {
      return function () {
         return `<@ ${sqlString(value)}`
      }
   },
   $adjacent(value) {
      return function () {
         return `-|- ${sqlString(value)}`
      }
   },
   $strictLeft(value) {
      return function () {
         return `<< ${sqlString(value)}`
      }
   },
   $strictRight(value) {
      return function () {
         return `>> ${sqlString(value)}`
      }
   },
   $noExtendRight(value) {
      return function () {
         return `&< ${sqlString(value)}`
      }
   },
   $noExtendLeft(value) {
      return function () {
         return `&> ${sqlString(value)}`
      }
   },
}