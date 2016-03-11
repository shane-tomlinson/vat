/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @module types/string
 * @description Match and transform string types
 * @extends module:types/any
 */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('../ourscore');

const string = {
  /**
   * Specifies the exact string length required.
   *
   * @method len
   * @param {Number} limit
   * @returns {Schema}
   * @instance
   */
  len(limit) {
    return this.test((val) => {
      return val.length === limit;
    });
  },

  /**
   * Specifies the maximum number of characters.
   *
   * @method max
   * @param {Number} limit
   * @returns {Schema}
   * @instance
   */
  max(limit) {
    return this.test((val) => {
      return val.length <= limit;
    });
  },

  /**
   * Specifies the minimum number of characters.
   *
   * @method min
   * @param {Number} limit
   * @returns {Schema}
   * @instance
   */
  min(limit) {
    return this.test((val) => {
      return val.length >= limit;
    });
  }
};

module.exports = (createValidator) => {
  let validator = createValidator();
  _.extend(validator, string);

  return validator.transform((val) => {
    // trim strings by default
    if (_.isString(val)) {
      return val.trim();
    }

    return val;
  }).test((val) => {
    return _.isString(val) || _.isUndefined(val);
  });
};
