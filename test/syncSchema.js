'use strict';

const { ormv, model } = require('../model/');

ormv.sync(null, 'tj');

model.user.sync();