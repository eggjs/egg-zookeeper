'use strict';

const ms = require('humanize-ms');

exports.convertMs = (obj, fields) => {
  fields.forEach(key => {
    obj[key] = ms(obj[key]);
  });
};
