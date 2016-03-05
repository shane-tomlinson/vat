/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('../ourscore');

function toValidationError(value) {
  let err = new TypeError('validation error');
  err.value = value;
  return err;
}

const any = {
  /**
   * Explicitly allow a value, before any conversion
   *
   * @method allow
   * @param {variant} val
   */
  allow(val) {
    this._allowed.push(val);
    return this;
  },

  /**
   * Export the result as {name} in the results.
   *
   * @method as
   * @param {string} name
   */
  as(name) {
    if (arguments.length === 0) {
      return this._as;
    }

    this._as = name;
    return this;
  },

  /**
   * Mark the field as optional. All fields are optional by default.
   *
   * @method optional
   */
  optional() {
    return this;
  },

  /**
   * Mark the field as required
   *
   * @method required
   */
  required() {
    this._isRequired = true;
    this.test((val) => {
      if (_.isUndefined(val)) {
        throw new ReferenceError('missing value');
      }
      return true;
    });
    return this;
  },

  /**
   * Remove any current transforms
   *
   * @method strict
   */
  strict() {
    this._transforms = null;
    return this;
  },

  /**
   * Add a validation test function. Function will
   * be called with value being validated.
   *
   * @method test
   * @param {function} validator
   */
  test(validator) {
    this._validators.push(validator);
    return this;
  },

  /**
   * Add a transformer. A transformer is a function that accepts
   * a value and returns another value. Validation will occur
   * with returned value.
   *
   * @method transform
   * @param {function} transformer
   */
  transform(transformer) {
    this._transforms.push(transformer);
    return this;
  },

  /**
   * Create an exclusive allowed list of values.
   *
   * @method valid
   * @param {variant} val
   */
  valid(val) {
    this._valid.push(val);
    return this;
  },

  /**
   * Validate a value
   *
   * @method validate
   * @param {variant} val
   * @returns {variant} transformed value. The same as `val` if no
   * transformations made.
   * @throws TypeError if validation fails
   */
  validate(val) {
    let origValue = val;

    // Check the exclusive allowed list first. If an exclusive allowed list
    // is defined and the value is not a member of list, throw
    // a validation error
    if (this._valid.length) {
      if (_.contains(this._valid, val)) {
        return val;
      }

      throw toValidationError(origValue);
    }

    // Check against the allowed list. If the value is not a member
    // of the allowed list, continue
    if (this._allowed && _.contains(this._allowed, val)) {
      return val;
    }

    // Perform any transformations
    if (this._transforms) {
      val = this._transforms.reduce((val, transform) => {
        return transform(val);
      }, val);
    }

    // Finally, perform the validations.
    if (this._validators) {
      this._validators.forEach((validator) => {
        if (! validator(val)) {
          throw toValidationError(origValue);
        }
      });
    }

    return val;
  }
};

module.exports = () => {
  let validator = Object.create(any);

  validator._allowed = [];
  validator._transforms = [];
  validator._valid = [];
  validator._validators = [];


  return validator;
};


