import * as express from 'express';
import { Oas3AppOptions } from './oas3.options';
import { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types';
export declare class ExpressAppConfig {
    private app;
    private routingOptions;
    private parserLimit;
    private definitionPath;
    private openApiValidatorOptions;
    private internalLogs;
    constructor(definitionPath: string, appOptions: Oas3AppOptions, customMiddlewares?: OpenApiRequestHandler[], responseMiddleware?: OpenApiRequestHandler[]);
    private setOpenApiValidatorOptions;
    configureLogger(loggerOptions: any): any;
    private errorHandler;
    getApp(): express.Application;
}
