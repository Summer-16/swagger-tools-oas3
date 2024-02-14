'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSwaggerDocs = void 0;
const fs = require("fs");
const path = require("path");
const swagger_ui_dist_1 = require("swagger-ui-dist");
const express = require("express");
function initSwaggerDocs(app, definitionPath) {
    const swaggerEndpoint = '/docs';
    const swaggerDefName = 'apiSpecifications.yaml';
    const swaggerUiAssetPath = (0, swagger_ui_dist_1.getAbsoluteFSPath)();
    // A workaround for swagger-ui-dist not being able to set custom swagger URL
    const indexContent = fs
        .readFileSync(path.join(swaggerUiAssetPath, 'swagger-initializer.js'))
        .toString()
        .replace('https://petstore.swagger.io/v2/swagger.json', `/${swaggerDefName}`);
    app.get(`${swaggerEndpoint}/swagger-initializer.js`, (req, res) => res.send(indexContent));
    // Serve the swagger-ui assets
    app.use(swaggerEndpoint, express.static(swaggerUiAssetPath));
    // Serve the swagger file
    app.get(`/${swaggerDefName}`, (req, res) => {
        res.sendFile(definitionPath);
    });
}
exports.initSwaggerDocs = initSwaggerDocs;
//# sourceMappingURL=swagger.ui.js.map