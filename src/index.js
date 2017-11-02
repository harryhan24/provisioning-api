// External dependencies
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

// Controllers
import { serviceProvider } from "./controllers";

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/*+json" }));

// SAML Things
app.get("/metadata.xml", serviceProvider.metadata);
app.get("/login", serviceProvider.login);
app.post("/assert", serviceProvider.assert);
app.get("/reflector", serviceProvider.reflector);
app.get("/logout", serviceProvider.logout);

app.get("/", (req, res) => res.send("hi!"));

module.exports.app = app;
module.exports.handler = serverless(app);
