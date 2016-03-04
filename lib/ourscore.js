/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global exports*/

'use strict'; //jshint ignore:line

exports.isBoolean = function (val) {
  return Object.prototype.toString.call(val) === '[object Boolean]';
};

exports.isFunction = function (val) {
  return typeof val === 'function';
};

exports.isNumber = function (val) {
  return Object.prototype.toString.call(val) === '[object Number]';
};

exports.isString = function (val) {
  return Object.prototype.toString.call(val) === '[object String]';
};

exports.isUndefined = function (val) {
  return typeof val === 'undefined';
};

exports.contains = function (array, item) {
  return array.indexOf(item) !== -1;
};

exports.union = function (/*...arrays*/) {
  let arrays = [].slice.call(arguments, 0);

  let union = [];
  arrays.forEach((array) => {
    array.forEach((item) => {
      if (! exports.contains(union, item)) {
        union.push(item);
      }
    });
  });

  return union;
};

