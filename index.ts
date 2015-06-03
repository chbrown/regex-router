/// <reference path="type_declarations/DefinitelyTyped/node/node.d.ts" />
import http = require('http');

/**
Handler must register both the request and the response variables.
*/
interface Handler {
  (req: http.IncomingMessage, res: http.ServerResponse, match?: RegExpMatchArray): void;
}

const notFound: Handler = function(req: http.IncomingMessage, res: http.ServerResponse) {
  res.statusCode = 404;
  res.end('Not Found\n');
}

/**
Node.js's `http` module calls the HTTP verb the "method", e.g., 'GET', 'POST',
'PATCH', 'OPTION', etc., so we go with `method` instead of `verb`.
*/
interface Route {
  /**
  `method` should always be uppercase, since the Node.js HTTP parser only
  accepts requests with uppercase method strings.
  */
  method: string;
  regExp: RegExp;
  handler: Handler;
}

class Router {
  constructor(public defaultHandler: Handler = notFound,
              public routes: Route[] = []) { }
  /**
  Iterate through all the routes, in order, calling the handler of the first
  one that matches the incoming request.
  */
  route(req: http.IncomingMessage, res: http.ServerResponse): void {
    for (var i = 0, route: Route; (route = this.routes[i]); i++) {
      // http.IncomingMessage#method is always uppercase for successful requests
      // and the corresponding Route#method value should always be uppercase too
      if (route.method == 'ANY' || route.method == req.method) {
        var match = req.url.match(route.regExp);
        if (match) {
          return route.handler(req, res, match);
        }
      }
    }
    return this.defaultHandler(req, res);
  }
  /**
  Append handler for given HTTP method and url to routes.
  Use method = 'ANY'
  */
  add(method: string, regExp: RegExp, handler: Handler): void {
    this.routes.push({method: method.toUpperCase(), regExp: regExp, handler: handler});
  }

  /** Copied from http.METHODS, with special match-all ANY */
  static HTTP_METHODS = [ 'ANY', // the rest are actual methods:
    'CHECKOUT', 'CONNECT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LOCK', 'M-SEARCH',
    'MERGE', 'MKACTIVITY', 'MKCOL', 'MOVE', 'NOTIFY', 'OPTIONS', 'PATCH', 'POST',
    'PROPFIND', 'PROPPATCH', 'PURGE', 'PUT', 'REPORT', 'SEARCH', 'SUBSCRIBE',
    'TRACE', 'UNLOCK', 'UNSUBSCRIBE' ]
}

/**
Add router.get(regExp, handler), router.GET(regExp, handler) shortcuts for
all official HTTP method names.
*/
Router.HTTP_METHODS.forEach(method => {
  Router.prototype[method] = Router.prototype[method.toLowerCase()] =
    function(url, func) { this.add(method, url, func); };
});

export = Router;
