'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerRouter = void 0;
const lodash_1 = require("lodash");
const fs = require("fs");
const helpers_1 = require("./helpers");
const path = require("path");
const logger_1 = require("./logger");
class SwaggerRouter {
    constructor({ internalLogs }) {
        this.logger = new logger_1.default(internalLogs);
    }
    handlerCacheFromDir(dirOrDirs) {
        const handlerCache = {};
        const jsFileRegex = /\.(coffee|js|ts)$/;
        let dirs = new Array();
        if ((0, lodash_1.isArray)(dirOrDirs)) {
            dirs = dirOrDirs;
        }
        else {
            dirs.push(dirOrDirs);
        }
        this.logger.log('  Controllers:');
        (0, lodash_1.each)(dirs, (dir) => {
            (0, lodash_1.each)(fs.readdirSync(dir), (file) => {
                const controllerName = file.replace(jsFileRegex, '');
                let controller;
                if (file.match(jsFileRegex) && file.indexOf(".test.js") === -1) {
                    controller = require(path.resolve(path.join(dir, controllerName)));
                    this.logger.log('    %s%s:', path.resolve(path.join(dir, file)), ((0, lodash_1.isPlainObject)(controller) ? '' : ' (not an object, skipped)'));
                    if ((0, lodash_1.isPlainObject)(controller)) {
                        (0, lodash_1.each)(controller, (value, name) => {
                            let handlerId = (controllerName + '_' + name).toLowerCase();
                            this.logger.log('      %s%s', handlerId, ((0, lodash_1.isFunction)(value) ? '' : ' (not a function, skipped)'));
                            if ((0, lodash_1.isFunction)(value) && !handlerCache[handlerId]) {
                                handlerCache[handlerId] = value;
                            }
                        });
                    }
                }
            });
        });
        return handlerCache;
    }
    initialize(options) {
        let handlerCache = {};
        this.logger.log('Initializing swagger-router middleware');
        // Set the defaults
        options = (0, lodash_1.defaults)(options || {}, {
            controllers: {},
            useStubs: false // not for now.
        });
        this.logger.log('  Mock mode: %s', options.useStubs === true ? 'enabled' : 'disabled');
        if ((0, lodash_1.isPlainObject)(options.controllers)) {
            // Create the handler cache from the passed in controllers object
            (0, lodash_1.each)(options.controllers, (func, handlerName) => {
                this.logger.log('    %s', handlerName);
                if (!(0, lodash_1.isFunction)(func)) {
                    throw new Error('options.controllers values must be functions');
                }
            });
            handlerCache = options.controllers;
        }
        else {
            // Create the handler cache from the modules in the controllers directory
            handlerCache = this.handlerCacheFromDir(options.controllers);
        }
        const getHandlerName = (req) => {
            if (req.openapi.schema['x-swagger-router-controller']) {
                let operationId = req.openapi.schema.operationId ? req.openapi.schema.operationId : req.method.toLowerCase();
                operationId = (0, helpers_1.removeDashElementToCamelCase)(operationId);
                return (req.openapi.schema['x-swagger-router-controller'] + '_' + operationId).toLowerCase();
            }
            else {
                const operationId = req.openapi.schema.operationId || '';
                return (0, helpers_1.removeDashElementToCamelCase)(operationId).toLowerCase();
            }
        };
        const send405 = (req, res, next) => {
            let err = new Error('Route defined in OpenAPI specification (' + req.openapi.openApiRoute + ') but there is no defined on' + req.method.toUpperCase() + ' operation.');
            res.statusCode = 405;
            return next(err);
        };
        return (req, res, next) => {
            let operation = req.openapi ? req.openapi.schema.operationId : undefined;
            let handler;
            let handlerName;
            let rErr;
            if ((0, lodash_1.isUndefined)(req.openapi)) {
                return next(rErr);
            }
            this.logger.log('%s %s', req.method, req.url);
            this.logger.log('  Will process: %s', (0, lodash_1.isUndefined)(operation) ? 'no' : 'yes');
            if (operation) {
                handlerName = getHandlerName(req);
                handler = handlerCache[handlerName];
                this.logger.log('  Route handler: %s', handlerName);
                if ((0, lodash_1.isUndefined)(handler) && !req.openapi.schema['x-swagger-router-controller']) {
                    const possibleKeys = Object.keys(handlerCache).filter(key => key.endsWith(`_${handlerName}`));
                    if (possibleKeys.length === 1) {
                        const newHandlerName = possibleKeys[0];
                        this.logger.log(`    Found handler for '${handlerName}' by suffix: ${newHandlerName}`);
                        handlerName = newHandlerName;
                        handler = handlerCache[handlerName];
                    }
                    else if (possibleKeys.length > 1) {
                        const err = new Error(`operationId '${req.openapi.schema.operationId}' is ambiguous. Matching handlers: ${possibleKeys.join(', ')}`);
                        res.statusCode = 500;
                        return next(err);
                    }
                }
                this.logger.log('    Missing: %s', (0, lodash_1.isUndefined)(handler) ? 'yes' : 'no');
                this.logger.log('    Ignored: %s', options.ignoreMissingHandlers === true ? 'yes' : 'no');
                if ((0, lodash_1.isUndefined)(handler)) {
                    return send405(req, res, next);
                }
                if (!(0, lodash_1.isUndefined)(handler)) {
                    try {
                        return handler.apply(this, req.openapi.swaggerParameters);
                    }
                    catch (err) {
                        rErr = err;
                        this.logger.log('Handler threw an unexpected error: %s\n%s', err.message, err.stack);
                    }
                }
                else if (options.ignoreMissingHandlers !== true) {
                    rErr = new Error('Cannot resolve the configured swagger-router handler: ' + handlerName);
                    res.statusCode = 500;
                }
            }
            else {
                this.logger.log('  No handler for method: %s', req.method);
                return send405(req, res, next);
            }
            if (rErr) {
                (0, helpers_1.debugError)(rErr, this.logger);
            }
            return next(rErr);
        };
    }
    ;
}
exports.SwaggerRouter = SwaggerRouter;
//# sourceMappingURL=swagger.router.js.map