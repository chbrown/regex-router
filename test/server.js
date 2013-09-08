'use strict'; /*jslint es5: true, node: true, indent: 2 */
var tap = require('tap');
var request = require('request');

var Router = require('..');
tap.test('basic server', function(t) {
  t.plan(2);

  // set up the routes
  var R = new Router(function(req, res) {
    res.end('404 :: URL not found.');
  });
  R.get(/^\/page\/(\w+)/, function(req, res, m) {
    res.end('Fetching page "' + m[1] + '"');
  });

  // set up the server
  var hostname = '127.0.0.1';
  var server = require('http').createServer(function(req, res) {
    R.route(req, res);
  }).listen(0, hostname, function() { // port = 0 finds random free port
    // server running, ready to run tests
    var port = server.address().port;
    var addrport = 'http://' + hostname + ':' + port;

    request.get(addrport + '/page/contact', function(err, res, body) {
      t.equal(body, 'Fetching page "contact"', 'Need to fetch page by name.');
    });

    request.get(addrport + '/reference', function(err, res, body) {
      t.equal(body, '404 :: URL not found.', 'Need to return 404 page.');
    });
  });

  t.tearDown(function() {
    server.close();
  });
});
