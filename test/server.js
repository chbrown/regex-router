/*globals describe, it, before, after */
var http = require('http');
var assert = require('assert');
var request = require('request');
var Router = require('..');

describe('basic server', function() {
  var server;
  before(function(callback) {
    // set up the routes
    var R = new Router();
    R.get(/^\/page\/(\w+)/, function(req, res, m) {
      res.end('Fetching page "' + m[1] + '"');
    });
    // set up the server
    var hostname = '127.0.0.1';
    server = http.createServer(function(req, res) {
      R.route(req, res);
    }).listen(0, hostname, function() { // port = 0 finds random free port
      // server running, ready to run tests
      var port = server.address().port;
      request = request.defaults({baseUrl: 'http://' + hostname + ':' + port + '/'});
      callback();
    });
  });

  after(function() {
    server.close();
  });

  it('should fetch page by name', function(callback) {
    request.get({uri: '/page/contact'}, function(err, res, body) {
      if (err) return callback(err);
      assert.equal(body, 'Fetching page "contact"');
      callback();
    });
  });

  it('should return default "not found" message', function(callback) {
    request.get({uri: '/reference'}, function(err, res, body) {
      if (err) return callback(err);
      assert.equal(body, 'Not Found\n');
      callback();
    });
  });
});
