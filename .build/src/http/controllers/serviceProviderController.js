"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../utils/jwt");
const models_1 = require("../../database/models");
const saml_1 = require("../../utils/saml");
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
const formatSamlValue = (val) => val[0];
exports.default = {
    metadata(req, res) {
        res.type("application/xml");
        res.send(saml_1.sp.create_metadata());
    },
    login(req, res) {
        logger_1.default.log("debug", "[ServiceProvider] Login request received");
        saml_1.sp.create_login_request_url(saml_1.idp, {}, (err, loginUrl) => {
            if (err !== null)
                return res.sendStatus(500);
            return res.redirect(loginUrl);
        });
    },
    assert(req, res) {
        const options = { request_body: req.body };
        saml_1.sp.post_assert(saml_1.idp, options, (err, samlResponse) => {
            if (err !== null)
                return res.sendStatus(500);
            // Get user attributes from SAML response
            const userAttributes = {};
            Object.entries(samlResponse.user.attributes).forEach(([key, value]) => {
                userAttributes[key] = formatSamlValue(value);
            });
            // Find or create the user attached to this SAML response
            return models_1.User.findOrCreate({
                where: {
                    eduPersonPrincipalName: userAttributes.eduPersonPrincipalName,
                },
                defaults: userAttributes,
            }).spread(user => {
                // Create JWT
                const token = jwt_1.default.sign(user, {
                    name_id: samlResponse.user.name_id,
                    session_index: samlResponse.user.session_index,
                });
                // Add to cookie
                res.cookie(config_1.default.jwt.cookieName, token, {
                    httpOnly: true,
                    domain: config_1.default.jwt.domain,
                });
                // Redirect user
                res.redirect(config_1.default.defaultLoginRedirect);
            });
        });
    },
    reflector(req, res) {
        try {
            const decoded = jwt_1.default.verify(req.cookies[config_1.default.jwt.cookieName]);
            return res.json(decoded);
        }
        catch (e) {
            return res.status(403).send({ statusCode: 403, message: e.message });
        }
    },
    refresh(req, res) {
        try {
            const token = jwt_1.default.refresh(req.cookies[config_1.default.jwt.cookieName]);
            res.json({ token });
        }
        catch (e) {
            res.status(400).send({ statusCode: 400, message: e.message });
        }
    },
    logout(req, res) {
        try {
            const decoded = jwt_1.default.verify(req.cookies[config_1.default.jwt.cookieName]);
            res.cookie(config_1.default.jwt.cookieName, "", { expires: new Date() });
            saml_1.sp.create_logout_request_url(saml_1.idp, decoded.session, (error, logoutUrl) => {
                if (error !== null) {
                    return res.redirect(config_1.default.defaultLogoutRedirect);
                }
                return res.redirect(logoutUrl);
            });
        }
        catch (e) {
            res.redirect(config_1.default.defaultLogoutRedirect);
        }
    },
};
//# sourceMappingURL=serviceProviderController.js.map