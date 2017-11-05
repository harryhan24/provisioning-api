// External dependencies
import express from "express";
import bodyParser from "body-parser";
import xmlParser from "body-parser-xml";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

// Controllers
import {
  lookupController,
  projectController,
  serviceProviderController,
} from "./http/controllers";
import apiUserMiddleware from "./http/middleware/apiUser";

xmlParser(bodyParser);
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.xml());
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(apiUserMiddleware);

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

app.get("/", (req, res) => {
  res.json({ message: "It worked!", apiUser: res.locals.apiUser });
});

module.exports.app = app;
module.exports.handler = serverless(app);
