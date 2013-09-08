'use strict'; /*jslint es5: true, node: true, indent: 2 */
var fs = require('fs');
var tap = require('tap');

function linesOfCode(document) {
  var lines = document.split(/\n/g);
  var count = 0;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    // don't count empty lines or comments
    if (line !== '' && !line.match(/^\/\//)) {
      count++;
    }
  }
  return count;
}

var Router = require('..');
tap.test('line count from README', function(t) {
  t.plan(1);
  fs.readFile('../README.md', 'utf8', function(err, readme) {
    if (err) throw err;
    fs.readFile('../index.js', 'utf8', function(err, main) {
      if (err) throw err;
      var stated_lines = parseInt(readme.match(/(\d+) lines of code/)[1], 10);
      var actual_lines = linesOfCode(main);
      t.equal(stated_lines, actual_lines, 'Stated lines should match actual lines');
    });
  });
});
