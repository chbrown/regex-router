'use strict'; /*jslint node: true, indent: 2, es5: true*/
function Router() {
  // this.routes contents: {regex: regex, http_method: http_method, func: func}
  this.routes = [];
}

Router.prototype.route = function(req, res) {
  var m;
  for (var i = 0, l = this.routes.length; i < l; i++) {
    var route = this.routes[i];
    if (route.http_method === undefined || route.http_method === req.method.toLowerCase()) {
      m = req.url.match(route.regex);
      if (m) {
        return route.func(m, req, res);
      }
    }
  }
  m = req.url.match(/^(.+)$/);
  return this.default(m, req, res);
};

Router.prototype.add = function(regex, http_method, func) {
  if (func === undefined) {
    func = http_method;
    http_method = undefined;
  }
  // func signature: (regex_match, req, res)
  this.routes.push({regex: regex, http_method: http_method, func: func});
};

Router.prototype.any = Router.prototype.ANY = function(url, func) {
  this.add(url, func);
};

Router.prototype.forward = function(url, router) {
  this.add(url, function(m, req, res) {
    // oops, discard m
    router.route(req, res);
  });
};
// add router.get(url, func), router.GET(url, func) shortcuts for common http methods
// PATCH is not an official HTTP/1.1 method (http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html)
var http_methods = ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'patch'];
http_methods.forEach(function(http_method) {
  Router.prototype[http_method] = Router.prototype[http_method.toUpperCase()] =
    function(url, func) { this.add(url, http_method, func); };
});

module.exports = Router;
