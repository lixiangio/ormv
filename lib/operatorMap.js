'use strict'

const Op = require('./operator');

const replace = require('./replace');

module.exports = {
   [Op.eq](value) {
      return `= '${replace(value)}'`
   },
   [Op.ne](value) {
      return `!= '${replace(value)}'`
   },
   [Op.gte](value) {
      return `>= '${replace(value)}'`
   },
   [Op.gt](value) {
      return `> '${replace(value)}'`
   },
   [Op.in](value) {
      return `IN ('${value.join(`', '`)}')`
   },
   [Op.lte](value) {
      return `<= '${replace(value)}'`
   },
   [Op.lt](value) {
      return `< '${replace(value)}'`
   },
   [Op.not](value) {
      return `IS NOT '${replace(value)}'`
   },
   [Op.is](value) {
      return `IS '${replace(value)}'`
   },
   [Op.notIn](value) {
      return `NOT IN '${replace(value)}'`
   },
   [Op.like](value) {
      return `LIKE '${replace(value)}'`
   },
   [Op.notLike](value) {
      return `NOT LIKE '${replace(value)}'`
   },
   [Op.iLike](value) {
      return `ILIKE '${replace(value)}'`
   },
   [Op.notILike](value) {
      return `NOT ILIKE '${replace(value)}'`
   },
   [Op.regexp](value) {
      return `~ '${replace(value)}'`
   },
   [Op.notRegexp](value) {
      return `!~ '${replace(value)}'`
   },
   [Op.iRegexp](value) {
      return `~* '${replace(value)}'`
   },
   [Op.notIRegexp](value) {
      return `!~* '${replace(value)}'`
   },
   [Op.between](value) {
      return `BETWEEN '${replace(value)}'`
   },
   [Op.notBetween](value) {
      return `NOT BETWEEN '${replace(value)}'`
   },
   [Op.overlap](value) {
      return `&& '${replace(value)}'`
   },
   [Op.contains](value) {
      return `@> '${replace(value)}'`
   },
   [Op.contained](value) {
      return `<@ '${replace(value)}'`
   },
   [Op.adjacent](value) {
      return `-|- '${replace(value)}'`
   },
   [Op.strictLeft](value) {
      return `<< '${replace(value)}'`
   },
   [Op.strictRight](value) {
      return `>> '${replace(value)}'`
   },
   [Op.noExtendRight](value) {
      return `&< '${replace(value)}'`
   },
   [Op.noExtendLeft](value) {
      return `&> '${replace(value)}'`
   },
   [Op.any](value) {
      return `ANY '${replace(value)}'`
   },
   [Op.all](value) {
      return `ALL '${replace(value)}'`
   },
   [Op.and](value) {
      return ` AND  '${replace(value)}'`
   },
   [Op.or](value) {
      return ` OR  '${replace(value)}'`
   },
   [Op.col](value) {
      return `COL '${replace(value)}'`
   },
   [Op.placeholder](value) {
      return `$$PLACEHOLDER$$ '${replace(value)}'`
   },
   [Op.raw](value) {
      return `DEPRECATED '${replace(value)}'`
   }
};