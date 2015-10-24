import {IncomingMessage, ServerResponse} from 'http';

/**
Handler must register both the request and the response variables.
*/
export interface Handler {
  (req: IncomingMessage, res: ServerResponse, match?: RegExpMatchArray): void;
}

const notFound: Handler = function(req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 404;
  res.end('Not Found\n');
}

/**
Node.js's `http` module calls the HTTP verb the "method", e.g., 'GET', 'POST',
'PATCH', 'OPTION', etc., so we go with `method` instead of `verb`.
*/
export interface Route {
  /**
  `method` should always be uppercase, since the Node.js HTTP parser only
  accepts requests with uppercase method strings.
  */
  method: string;
  regExp: RegExp;
  handler: Handler;
}

export default class Router {
  constructor(public defaultHandler: Handler = notFound,
              public routes: Route[] = []) { }
  /**
  Iterate through all the routes, in order, calling the handler of the first
  one that matches the incoming request.
  */
  route(req: IncomingMessage, res: ServerResponse): void {
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
    this.routes.push({method: method.toUpperCase(), regExp, handler});
  }

  any(regExp: RegExp, handler: Handler) {
    this.routes.push({method: 'ANY', regExp, handler});
  }

  delete(regExp: RegExp, handler: Handler) {
    this.routes.push({method: 'DELETE', regExp, handler});
  }
  get(regExp: RegExp, handler: Handler) {
    this.routes.push({method: 'GET', regExp, handler});
  }
  head(regExp: RegExp, handler: Handler) {
    this.routes.push({method: 'HEAD', regExp, handler});
  }
  options(regExp: RegExp, handler: Handler) {
    this.routes.push({method: 'OPTIONS', regExp, handler});
  }
  patch(regExp: RegExp, handler: Handler) {
    this.routes.push({method: 'PATCH', regExp, handler});
  }
  post(regExp: RegExp, handler: Handler) {
    this.routes.push({method: 'POST', regExp, handler});
  }
  put(regExp: RegExp, handler: Handler) {
    this.routes.push({method: 'PUT', regExp, handler});
  }
}

/**
Add shortcuts for other official HTTP method names.
*/
[
  'CHECKOUT', 'CONNECT', 'COPY', 'LOCK', 'M-SEARCH', 'MERGE', 'MKACTIVITY',
  'MKCOL', 'MOVE', 'NOTIFY', 'PROPFIND', 'PROPPATCH', 'PURGE', 'REPORT',
  'SEARCH', 'SUBSCRIBE', 'TRACE', 'UNLOCK', 'UNSUBSCRIBE'
].forEach(method => {
  Router.prototype[method.toLowerCase()] =
    function(regExp, handler) { this.routes.push({method, regExp, handler}) };
});
