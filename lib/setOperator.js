'use strict'

/**
 * SET数据操作符，用于更新操作
 */
module.exports = {
   merge: Symbol('merge'),
   set: Symbol('set'),
   insert: Symbol('insert'),
   insertByPath: Symbol('insertByPath'),
   insertFirst: Symbol('insertFirst'),
};