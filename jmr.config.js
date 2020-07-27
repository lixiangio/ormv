'use strict';

const test = require('jmr');
const { Ormv, ormv, model } = require('./model/');

test.Ormv = Ormv;
test.ormv = ormv;

test.model = model;
