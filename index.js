'use strict'; /*jslint es5: true, node: true, indent: 2 */
var Router = module.exports = function(default_func) {
  this.nroutes = 0;
  this.routes = [];
  this.default = default_func || function() {};
};
Router.prototype.route = function(req, res) {
  var m;
  for (var i = 0; i < this.nroutes; i++) {
    var route = this.routes[i];
    var method_match = route.method == 'any' || route.method == req.method.toLowerCase();
    if (method_match && (route.regex ? (m = req.url.match(route.regex)) : (m = req.url) === route.string)) {
      return route.func(req, res, m);
    }
  }
  return this.default(req, res, req.url);
};
Router.prototype.add = function(method, url, func) {
  /** add: append handler for given HTTP method and url to routes
  `url`: String | RegExp
  `func`: function(http.IncomingMessage, http.ServerResponse, String | RegExpMatch) */
  var route = {method: method, func: func};
  if (url instanceof RegExp) route.regex = url;
  else route.string = url;
  this.routes.push(route);
  this.nroutes++;
};

['any', 'options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'patch'].forEach(function(method) {
  // add router.get(url, func), router.GET(url, func) shortcuts for common http methods
  Router.prototype[method] = Router.prototype[method.toUpperCase()] =
    function(url, func) { this.add(method, url, func); };
});
