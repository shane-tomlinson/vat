/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('./ourscore');

/**
 * Validate data against a schema
 *
 * @param {variant} data - data to validate
 * @param {Schema} schema - schema to use to validate
 * @returns {object} result
 *   @returns {Error} result.error - any error thrown
 *   @returns {variant} result.value - transformed data
 */
function validate(data, schema) {
  let error = null;
  let value = data;

  try {
    if (_.isUndefined(schema)) {
      let missingSchemaError = new ReferenceError('missing schema');
      missingSchemaError.value = data;
      throw missingSchemaError;
    }

    if (_.isFunction(schema.validate)) {
      return schema.validate(data);
    } else {
      // union ensures all data fields have a corresponding schema
      // and all schemas are validated against.
      let allKeys = _.union(Object.keys(data), Object.keys(schema));
      value = {};
      allKeys.forEach(function (key) {
        let result = validate(data[key], schema[key]);

        if (result.error) {
          result.error.key = key;
          throw result.error;
        }

        let targetKey = schema[key].renameTo() || key;
        // only add undefined values iff the value is required
        if (! _.isUndefined(result.value) || schema[key]._isRequired) {
          value[targetKey] = result.value;
        }
      });
    }
  } catch (e) {
    error = e;
  }

  return {
    error,
    value
  };
}


module.exports = {
  register,
  unregister,
  validate
};

let reserved = Object.keys(module.exports);
let types = {};

/**
 * Register a type to be validated against a schema
 *
 * @param {string} typeName - name of type
 * @param {Schema} schema - schema used to validate
 */
function register(typeName, schema) {
  if (_.contains(reserved, typeName)) {
    throw new Error(`'${typeName}' is reserved`);
  }

  if (types[typeName]) {
    throw new Error(`'${typeName}' is already registered`);
  }

  module.exports[typeName] = types[typeName] = () => {
    return schema;
  };
}

/**
 * Unregister a type
 *
 * @param {string} typeName - name of type
 */
function unregister(typeName) {
  if (_.contains(reserved, typeName)) {
    throw new Error(`'${typeName}' is reserved`);
  }

  if (! types[typeName]) {
    throw new Error(`'${typeName}' is already not registered`);
  }

  delete module.exports[typeName];
  delete types[typeName];
}


const any = require('./types/any');

register('any', any());
register('boolean', require('./types/boolean')(any));
register('number', require('./types/number')(any));
register('string', require('./types/string')(any));

