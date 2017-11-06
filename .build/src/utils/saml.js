"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const saml2 = require("saml2-js");
const config_1 = require("../config");
exports.sp = new saml2.ServiceProvider(config_1.default.saml.sp);
exports.idp = new saml2.IdentityProvider(config_1.default.saml.idp);
//# sourceMappingURL=saml.js.map