'use strict'; /*jslint node: true, es5: true, indent: 2 */
var fs = require('fs');
var test = require('tap').test;

var Router = require('..');
test('line count from README', function (t) {
  t.plan(1);
  fs.readFile('../README.md', 'utf8', function (err, readme) {
    if (err) throw err;
    fs.readFile('../index.js', 'utf8', function (err, main) {
      if (err) throw err;
      var actual_lines = main.match(/\n/g).length;
      var stated_lines = parseInt(readme.match(/(\d+) lines of code/)[1], 10);
      t.equal(stated_lines, actual_lines, 'Stated lines should match actual lines');
    });
  });
});
