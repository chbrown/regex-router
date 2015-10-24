# Regex-router

Regex-router is a simple Node.js library to simplify web application routing without using a framework.


## Example

```javascript
var fs = require('fs');
var http = require('http');
var Router = require('regex-router');

var R = new Router(function(req, res, m) {
  res.end('404. URL not found: ' + req.url);
});

R.get(/^\/page\/(\w+)/, function(req, res, m) {
  console.log('Serving URL: %s', req.url);
  var page_name = m[1];
  var page_path = __dirname + '/static_pages/' + page_name + '.html';
  fs.readFile(page_path, 'utf8', function(err, html) {
    res.write(html);
    res.end();
  });
});

http.createServer(function(req, res) {
  R.route(req, res);
}).listen(80);
```


## License

Copyright 2012-2015 Christopher Brown. [MIT Licensed](http://chbrown.github.io/licenses/MIT/#2012-2015).
