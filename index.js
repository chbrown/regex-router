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
    /** Copied from http.METHODS, with special match-all ANY */
    Router.HTTP_METHODS = ['ANY',
        'CHECKOUT', 'CONNECT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LOCK', 'M-SEARCH',
        'MERGE', 'MKACTIVITY', 'MKCOL', 'MOVE', 'NOTIFY', 'OPTIONS', 'PATCH', 'POST',
        'PROPFIND', 'PROPPATCH', 'PURGE', 'PUT', 'REPORT', 'SEARCH', 'SUBSCRIBE',
        'TRACE', 'UNLOCK', 'UNSUBSCRIBE'];
    return Router;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Router;
/**
Add router.get(regExp, handler), router.GET(regExp, handler) shortcuts for
all official HTTP method names.
*/
Router.HTTP_METHODS.forEach(function (method) {
    Router.prototype[method] = Router.prototype[method.toLowerCase()] =
        function (url, func) { this.add(method, url, func); };
});
