var notFound = function (req, res) {
    res.statusCode = 404;
    res.end('Not Found\n');
};
var Router = (function () {
    function Router(defaultHandler, routes) {
        if (defaultHandler === void 0) { defaultHandler = notFound; }
        if (routes === void 0) { routes = []; }
        this.defaultHandler = defaultHandler;
        this.routes = routes;
    }
    /**
    Iterate through all the routes, in order, calling the handler of the first
    one that matches the incoming request.
    */
    Router.prototype.route = function (req, res) {
        for (var i = 0, route; (route = this.routes[i]); i++) {
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
    };
    /**
    Append handler for given HTTP method and url to routes.
    Use method = 'ANY'
    */
    Router.prototype.add = function (method, regExp, handler) {
        this.routes.push({ method: method.toUpperCase(), regExp: regExp, handler: handler });
    };
    Router.prototype.any = function (regExp, handler) {
        this.routes.push({ method: 'ANY', regExp: regExp, handler: handler });
    };
    Router.prototype.delete = function (regExp, handler) {
        this.routes.push({ method: 'DELETE', regExp: regExp, handler: handler });
    };
    Router.prototype.get = function (regExp, handler) {
        this.routes.push({ method: 'GET', regExp: regExp, handler: handler });
    };
    Router.prototype.head = function (regExp, handler) {
        this.routes.push({ method: 'HEAD', regExp: regExp, handler: handler });
    };
    Router.prototype.options = function (regExp, handler) {
        this.routes.push({ method: 'OPTIONS', regExp: regExp, handler: handler });
    };
    Router.prototype.patch = function (regExp, handler) {
        this.routes.push({ method: 'PATCH', regExp: regExp, handler: handler });
    };
    Router.prototype.post = function (regExp, handler) {
        this.routes.push({ method: 'POST', regExp: regExp, handler: handler });
    };
    Router.prototype.put = function (regExp, handler) {
        this.routes.push({ method: 'PUT', regExp: regExp, handler: handler });
    };
    return Router;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Router;
/**
Add shortcuts for other official HTTP method names.
*/
[
    'CHECKOUT', 'CONNECT', 'COPY', 'LOCK', 'M-SEARCH', 'MERGE', 'MKACTIVITY',
    'MKCOL', 'MOVE', 'NOTIFY', 'PROPFIND', 'PROPPATCH', 'PURGE', 'REPORT',
    'SEARCH', 'SUBSCRIBE', 'TRACE', 'UNLOCK', 'UNSUBSCRIBE'
].forEach(function (method) {
    Router.prototype[method.toLowerCase()] =
        function (regExp, handler) { this.routes.push({ method: method, regExp: regExp, handler: handler }); };
});
