# Regex-router

Regex-router is a simple Node.js library to simplify web application routing without using a framework.

Only [31 lines of code](index.js) (not counting tests)!

## Example

```javascript
var fs = require('fs');
var http = require('http');
var Router = require('regex-router');

var R = new Router(function(req, res, m) {
  res.end('404. URL not found:', req.url);
});

R.get(/^\/page\/(\w+)/, function(req, res, m) {
  console.log('Serving URL:', req.url);
  var page_name = m[1];
  var page_path = __dirname + '/static_pages/' + page_name + '.html';
  fs.readFile(page_path, 'utf8', function(err, html) {
    res.write(html);
    res.end();
  });
});

http.createServer(function(req, res) {
  R.route(req, res);
}).listen(80, 'localhost');
```

## License

Copyright © 2012–2013 Christopher Brown. [MIT Licensed](LICENSE).
