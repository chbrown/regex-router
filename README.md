# Regex-router

Regex-router is a simple Node.js library to simplify routing. And by simplify, I mean 39 lines of code.

# Example

    var fs = require('fs'),
      http = require('http'),
      Router = require('regex-router'),
      r = new Router();

    r.get(/^\/page\/(\w+)/, function(m, req, res) {
      console.log('Serving URL:', req.url);
      var page_name = m[1],
        page_path = __dirname + '/static_pages/' + page_name + '.html';
      fs.readFile(page_path, 'utf8', function(err, html) {
        res.write(html);
        res.end();
      });
    });

    r.default = function(m, req, res) {
      res.end('404. URL not found:', req.url);
    })

    http.createServer(function(req, res) {
      r.route(req, res);
    }).listen(80, 'localhost');
