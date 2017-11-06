"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External dependencies
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const serverless = require("serverless-http");
const apiUserMiddleware_1 = require("./http/middleware/apiUserMiddleware");
const controllers_1 = require("./http/controllers");
require("./database/init");
exports.app = express();
exports.app.use(cookieParser());
exports.app.use(bodyParser.urlencoded({ extended: false }));
exports.app.use(bodyParser.json({ type: "application/json" }));
exports.app.use(apiUserMiddleware_1.default);
// SAML Things
exports.app.get("/sp/metadata.xml", controllers_1.serviceProviderController.metadata);
exports.app.get("/sp/login", controllers_1.serviceProviderController.login);
exports.app.post("/sp/assert", controllers_1.serviceProviderController.assert);
exports.app.get("/sp/reflector", controllers_1.serviceProviderController.reflector);
exports.app.get("/sp/refresh", controllers_1.serviceProviderController.refresh);
exports.app.get("/sp/logout", controllers_1.serviceProviderController.logout);
// Lookups
exports.app.get("/lookups/username/:username", controllers_1.lookupController.username);
exports.app.get("/lookups/staff-search/:searchString", controllers_1.lookupController.staffSearch);
// Project things
exports.app.get("/projects", controllers_1.projectController.getProjects);
exports.app.get("/projects/:projectUuid", controllers_1.projectController.getProject);
exports.app.post("/projects", controllers_1.projectController.postProjects);
exports.handler = serverless(exports.app);
//# sourceMappingURL=index.js.map