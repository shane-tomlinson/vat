/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @module validator
 */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('./ourscore');

/**
 * Validate `data` against the `schema`.
 *
 * @param {Variant} data - data to validate
 * @param {Schema} schema - schema to validate against
 * @returns {Variant} value
 * @instance
 */
function validate(data, schema) {
  let error = null;
  let value = data;

  try {
    if (_.isUndefined(schema)) {
      let missingSchemaError = new Error('missing schema');
      missingSchemaError.value = data;
      throw missingSchemaError;
    }

    if (_.isFunction(schema.validate)) {
      // validate function should return converted values
      value = schema.validate(data);
    } else {
      // use the union to ensure all possible data has
      // a corresponding schema item and all possible schema
      // items have been checked.
      let allKeys = _.union(Object.keys(data), Object.keys(schema));
      value = {};
      allKeys.forEach(function (key) {
        let result = validate(data[key], schema[key]);

        if (result.error) {
          result.error.key = key;
          throw result.error;
        }

        let targetKey = schema[key].as() || key;
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
 * Register a schema with a type. An accessor function is created to
 * access schema.
 *
 * @example
 * // register the type `hex`
 * VAT.register('hex', VAT.string().test(val => /[0-9a-f]+/i.test(val)));
 * ...
 * // use the type hex
 * let schema = {
 *   client_id: VAT.hex().required()
 * };
 *
 * @param {String} typeName - name of type
 * @param {Schema} schema - schema used to validate type
 * @throws {Error} if `typeName` is reserved or already registered.
 * @instance
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
 * Unregister a type. Type's accessor function is removed.
 *
 * @param {String} typeName - name of type
 * @throws {Error} if `typeName` is reserved or not registered.
 * @instance
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

/**
 * Get an {@link module:types/any|`any`} type Schema.
 *
 * @method any
 * @returns {Schema} - an {@link module:types/any|any} Schema
 * @instance
 */
register('any', any());

/**
 * Get a {@link module:types/boolean|`boolean`} type Schema.
 *
 * @method boolean
 * @returns {Schema} - a {@link module:types/boolean|boolean} Schema
 * @instance
 */
register('boolean', require('./types/boolean')(any));

/**
 * Get a {@link module:types/number|`number`} type Schema.
 *
 * @method number
 * @returns {Schema} - a {@link module:types/number|number} Schema
 * @instance
 */
register('number', require('./types/number')(any));

/**
 * Get a {@link module:types/string|`string`} type Schema.
 *
 * @method string
 * @returns {Schema} - an {@link module:types/string|string} Schema
 * @instance
 */
register('string', require('./types/string')(any));

