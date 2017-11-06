// External dependencies
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as serverless from "serverless-http";

import apiUserMiddleware from "./http/middleware/apiUserMiddleware";
import { lookupController, serviceProviderController, projectController } from "./http/controllers";
import devController from "./http/controllers/devController";

import "./database/init";

export const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(apiUserMiddleware);

// DEV
app.get("/dev", devController.dev);

// SAML Things
app.get("/sp/metadata.xml", serviceProviderController.metadata);
app.get("/sp/login", serviceProviderController.login);
app.post("/sp/assert", serviceProviderController.assert);
app.get("/sp/reflector", serviceProviderController.reflector);
app.get("/sp/refresh", serviceProviderController.refresh);
app.get("/sp/logout", serviceProviderController.logout);

// Lookups
app.get("/lookups/username/:username", lookupController.username);
app.get("/lookups/staff-search/:searchString", lookupController.staffSearch);

// Project things
app.get("/projects", projectController.getProjects);
app.get("/projects/:projectUuid", projectController.getProject);
app.post("/projects", projectController.postProjects);

export const handler = serverless(app);
