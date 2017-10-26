'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appModel = new Schema({
  code: { type: String, required: true, index: { unique: true } },
  description: { type: String, required: true },
  active: { type: Boolean, required: true },
  scopes: { type: Object, required: true }
});

module.exports = mongoose.model('App', appModel);