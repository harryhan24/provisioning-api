"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const config_1 = require("./config");
const saml_1 = require("./saml");
const adLdap_1 = require("./adLdap");
const env = process.env.NODE_ENV || "development";
const config = config_1.default[env];
config.environment = env;
config.database = database_1.default[env];
config.saml = saml_1.default[env];
config.ad = adLdap_1.default[env].ad;
config.ldap = adLdap_1.default[env].ldap;
exports.default = config;
//# sourceMappingURL=index.js.map