'use strict';

const { ormv } = require('../model/');

ormv.sync('user', 'increment');

ormv.sync('user', 'add');

ormv.sync('user', 'remove');

// ormv.syncs('tj');
