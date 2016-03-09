/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('build', [
    // Check to ensure all source files pass muster
    'lint',

    // Clean files and folders from any previous build
    'clean',

    // Create a single bundle
    'browserify',

    // Convert ES6 into ES5
    'babel',

    // Minify
    'uglify',

    // Display the output size
    'bytesize'
  ]);
};
