/// <reference path="../../type_declarations/DefinitelyTyped/node/node.d.ts" />
declare module 'regex-router' {
    import http = require('http');
    /**
    Handler must register both the request and the response variables.
    */
    interface Handler {
        (req: http.IncomingMessage, res: http.ServerResponse, match?: RegExpMatchArray): void;
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
        defaultHandler: Handler;
        routes: Route[];
        constructor(defaultHandler?: Handler, routes?: Route[]);
        /**
        Iterate through all the routes, in order, calling the handler of the first
        one that matches the incoming request.
        */
        route(req: http.IncomingMessage, res: http.ServerResponse): void;
        /**
        Append handler for given HTTP method and url to routes.
        Use method = 'ANY'
        */
        add(method: string, regExp: RegExp, handler: Handler): void;
        /** Copied from http.METHODS, with special match-all ANY */
        static HTTP_METHODS: string[];
        // Manually compiled list of shortcuts for common http methods
        any(regExp: RegExp, handler: Handler): void;
        ANY(regExp: RegExp, handler: Handler): void;
        delete(regExp: RegExp, handler: Handler): void;
        DELETE(regExp: RegExp, handler: Handler): void;
        get(regExp: RegExp, handler: Handler): void;
        GET(regExp: RegExp, handler: Handler): void;
        head(regExp: RegExp, handler: Handler): void;
        HEAD(regExp: RegExp, handler: Handler): void;
        options(regExp: RegExp, handler: Handler): void;
        OPTIONS(regExp: RegExp, handler: Handler): void;
        patch(regExp: RegExp, handler: Handler): void;
        PATCH(regExp: RegExp, handler: Handler): void;
        post(regExp: RegExp, handler: Handler): void;
        POST(regExp: RegExp, handler: Handler): void;
        put(regExp: RegExp, handler: Handler): void;
        PUT(regExp: RegExp, handler: Handler): void;
        // TODO: the rest of them
    }
    export = Router;
}
