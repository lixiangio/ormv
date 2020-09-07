'use strict';

const safety = require('../safety.js');

const { safetyKey, safetyValue, safetyJson } = safety;

module.exports = {
  $eq(value) {
    return function () {
      return `= ${safetyValue(value)}`
    }
  },
  $ne(value) {
    return function () {
      return `!= ${safetyValue(value)}`
    }
  },
  $gte(value) {
    return function () {
      return `>= ${safetyValue(value)}`
    }
  },
  $gt(value) {
    return function () {
      return `> ${safetyValue(value)}`
    }
  },
  $lte(value) {
    return function () {
      return `<= ${safetyValue(value)}`
    }
  },
  $lt(value) {
    return function () {
      return `< ${safetyValue(value)}`
    }
  },
  $not(value) {
    return function () {
      return `IS NOT ${safetyValue(value)}`
    }
  },
  $in(...values) {
    values = values.map(value => {
      return safetyValue(value);
    })
    return function () {
      return `IN (${values.join(`, `)})`
    }
  },
  $notIn(...values) {
    values = values.map(value => {
      return safetyValue(value);
    })
    return function () {
      return `NOT IN (${values.join(`, `)})`
    }
  },
  /**
   * 单值范围
   * @param {Number} start 起始值
   * @param {Number} end 结束值
   */
  $scope(start, end) {
    return function (field) {
      return `>= ${safetyValue(start)} AND ${safetyKey(field)} < ${safetyValue(end)}`;
    }
  },
  /**
   * 包含匹配，仅适用于jsonb数组类型
   * @param {array} value 一个或多个值
   */
  $includes(...values) {
    return function () {
      return `@> ${safetyJson(values)}::jsonb`;
    }
  },
  /**
   * 仅用于range范围数据类型
   * @param {Number} start 起始值
   * @param {Number} end 结束值
   */
  $range(start, end) {
    return function () {
      return [safetyValue(start), safetyValue(end)];
    }
  },
  $is(value) {
    return function () {
      return `IS ${safetyValue(value)}`
    }
  },
  $like(value) {
    return function () {
      return `LIKE ${safetyValue(value)}`
    }
  },
  $notLike(value) {
    return function () {
      return `NOT LIKE ${safetyValue(value)}`
    }
  },
  $iLike(value) {
    return function () {
      return `ILIKE ${safetyValue(value)}`
    }
  },
  $notILike(value) {
    return function () {
      return `NOT ILIKE ${safetyValue(value)}`
    }
  },
  $regexp(value) {
    return function () {
      return `~ ${safetyValue(value)}`
    }
  },
  $notRegexp(value) {
    return function () {
      return `!~ ${safetyValue(value)}`
    }
  },
  $iRegexp(value) {
    return function () {
      return `~* ${safetyValue(value)}`
    }
  },
  $notIRegexp(value) {
    return function () {
      return `!~* ${safetyValue(value)}`
    }
  },
  $between(value) {
    return function () {
      return `BETWEEN ${safetyValue(value)}`
    }
  },
  $notBetween(value) {
    return function () {
      return `NOT BETWEEN ${safetyValue(value)}`
    }
  },
  $overlap(value) {
    return function () {
      return `&& ${safetyValue(value)}`
    }
  },
  $contains(value) {
    return function () {
      return `@> ${safetyJson(value)}`
    }
  },
  $contained(value) {
    return function () {
      return `<@ ${safetyJson(value)}`
    }
  },
  $adjacent(value) {
    return function () {
      return `-|- ${safetyValue(value)}`
    }
  },
  $strictLeft(value) {
    return function () {
      return `<< ${safetyValue(value)}`
    }
  },
  $strictRight(value) {
    return function () {
      return `>> ${safetyValue(value)}`
    }
  },
  $noExtendRight(value) {
    return function () {
      return `&< ${safetyValue(value)}`
    }
  },
  $noExtendLeft(value) {
    return function () {
      return `&> ${safetyValue(value)}`
    }
  },
}