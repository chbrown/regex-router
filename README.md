# Regex-router

Regex-router is a simple Node.js library to simplify routing. By simple, I mean 50 lines of code.

# Example

    var fs = require('fs');
    var http = require('http');
    var Router = require('regex-router');
    var r = new Router();

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

## License

Copyright © 2012–2013 Christopher Brown. [MIT Licensed](LICENSE).
