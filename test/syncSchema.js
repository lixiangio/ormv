'use strict';

const { ormv } = require('../model/');

ormv.syncAll('tj');

ormv.sync('tj.user');