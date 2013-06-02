'use strict'; /*jslint node: true, es5: true, indent: 2 */
function escapeRegex(string) {
  var specials = ['$', '(', ')', '*', '+', '.', '?', '[', '\\', ']', '^', '{', '|' , '}'];
  return string.replace(new RegExp('(\\' + specials.join('|\\') + ')', 'g'), '\\$1');
}

var Router = module.exports = function() {
  this.routes = []; // e.g., [{regex: regex, http_method: http_method, func: func}, ...]
  this.requestListener = this.route.bind(this);
};

Router.prototype.route = function(req, res) {
  var m;
  for (var route, i = 0; (route = this.routes[i]); i++) {
    if (route.http_method === 'any' || route.http_method === req.method.toLowerCase()) {
      if ((m = req.url.match(route.regex)))
        return route.func(m, req, res);
    }
  }
  m = req.url.match(/^(.+)$/);
  // check for existence of default?
  return this.default(m, req, res);
};

Router.prototype._add = function(regex, http_method, func) {
  // coerve strings to regex as exact match (must escape regex)
  if (!(regex instanceof RegExp))
    regex = new RegExp('^' + escapeRegex(regex) + '$');
  // func signature: (regex_match, req, res)
  this.routes.push({regex: regex, http_method: http_method, func: func});
};

Router.prototype.forward = function(url, router) {
  this._add(url, 'any', function(m, req, res) {
    // just discard m
    router.route(req, res);
  });
};
// add router.get(url, func), router.GET(url, func) shortcuts for common http methods
// PATCH is not an official HTTP/1.1 method (http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html)
var http_methods = ['any', 'options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'patch'];
http_methods.forEach(function(http_method) {
  Router.prototype[http_method] = Router.prototype[http_method.toUpperCase()] =
    function(regex, func) { this._add(regex, http_method, func); };
});
