import { IncomingMessage, ServerResponse } from 'http';
/**
Handler must register both the request and the response variables.
*/
export interface Handler {
    (req: IncomingMessage, res: ServerResponse, match?: RegExpMatchArray): void;
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
    defaultHandler: Handler;
    routes: Route[];
    constructor(defaultHandler?: Handler, routes?: Route[]);
    /**
    Iterate through all the routes, in order, calling the handler of the first
    one that matches the incoming request.
    */
    route(req: IncomingMessage, res: ServerResponse): void;
    /**
    Append handler for given HTTP method and url to routes.
    Use method = 'ANY'
    */
    add(method: string, regExp: RegExp, handler: Handler): void;
    any(regExp: RegExp, handler: Handler): void;
    delete(regExp: RegExp, handler: Handler): void;
    get(regExp: RegExp, handler: Handler): void;
    head(regExp: RegExp, handler: Handler): void;
    options(regExp: RegExp, handler: Handler): void;
    patch(regExp: RegExp, handler: Handler): void;
    post(regExp: RegExp, handler: Handler): void;
    put(regExp: RegExp, handler: Handler): void;
}
