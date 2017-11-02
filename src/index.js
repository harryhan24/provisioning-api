// External dependencies
import express from "express";
import bodyParser from "body-parser";
import xmlParser from "body-parser-xml";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

// Controllers
import { serviceProvider } from "./controllers";

xmlParser(bodyParser);
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.xml());
app.use(bodyParser.json({ type: "application/*+json" }));

// SAML Things
app.get("/sp/metadata.xml", serviceProvider.metadata);
app.get("/sp/login", serviceProvider.login);
app.post("/sp/assert", serviceProvider.assert);
app.get("/sp/reflector", serviceProvider.reflector);
app.get("/sp/refresh", serviceProvider.refresh);
app.get("/sp/logout", serviceProvider.logout);

const someFunction = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve("aasdkjashdalbdla"), 1000);
  });

const handleRoot = async (req, res) => {
  const returnValue = await someFunction();
  res.send(returnValue);
};

app.get("/", handleRoot);

module.exports.app = app;
module.exports.handler = serverless(app);
