/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, beforeEach, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Helpers = require('../lib/helpers');
const Validator = require('../../lib/validator');

const expectSuccess = Helpers.expectSuccess;
const expectTypeError = Helpers.expectTypeError;
const expectReferenceError = Helpers.expectReferenceError;
const isSchema = Helpers.isSchema;

describe('types/string', () => {
  let schema;

  beforeEach(() => {
    schema = Validator.string();
  });

  it('returns a schema', () => {
    assert.isTrue(isSchema(schema));
  });

  it('success', () => {
    expectSuccess(schema, '', '');
    expectSuccess(schema, '123', '123');
    // strings are trimmed by default
    expectSuccess(schema, ' 123', '123');
    expectSuccess(schema, '123 ', '123');
    // optional by default
    expectSuccess(schema, undefined);
  });

  it('throws a TypeError for non-strings', () => {
    expectTypeError(schema, null);
    expectTypeError(schema, true);
    expectTypeError(schema, 1);
    expectTypeError(schema, {});
    expectTypeError(schema, []);
  });

  describe('strict', () => {
    beforeEach(() => {
      schema = Validator.string().strict();
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('success', () => {
      // strings are not trimmed
      expectSuccess(schema, ' 123', ' 123');
      expectSuccess(schema, '123 ', '123 ');
    });
  });

  describe('len', () => {
    beforeEach(() => {
      schema = Validator.string().len(2);
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('success', () => {
      expectSuccess(schema, '12', '12');
    });

    it('throws a TypeError if too short', () => {
      expectTypeError(schema, '');
      expectTypeError(schema, '1');
    });

    it('throws a TypeError if too long', () => {
      expectTypeError(schema, '123');
    });
  });

  describe('min', () => {
    beforeEach(() => {
      schema = Validator.string().min(2);
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('success', () => {
      expectSuccess(schema, '12', '12');
      expectSuccess(schema, '123', '123');
    });

    it('throws a TypeError if too short', () => {
      expectTypeError(schema, '');
      expectTypeError(schema, '1');
    });
  });

  describe('max', () => {
    beforeEach(() => {
      schema = Validator.string().max(2);
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('success', () => {
      expectSuccess(schema, '', '');
      expectSuccess(schema, '1', '1');
      expectSuccess(schema, '12', '12');
    });

    it('throws a TypeError if too long', () => {
      expectTypeError(schema, '123');
      expectTypeError(schema, '124');
    });
  });
});


