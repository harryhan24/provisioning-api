import jwt from "jsonwebtoken";

import { User } from "../models";
import { sp, idp } from "../utils/saml";
import config from "../config";

export default {
  metadata(req, res) {
    res.type("application/xml");
    res.send(sp.create_metadata());
  },
  login(req, res) {
    sp.create_login_request_url(idp, {}, (err, loginUrl) => {
      if (err !== null) return res.sendStatus(500);
      return res.redirect(loginUrl);
    });
  },
  assert(req, res) {
    const options = { request_body: req.body };
    sp.post_assert(idp, options, (err, samlResponse) => {
      if (err !== null) return res.sendStatus(500);

      // Get user attributes from SAML response
      const userAttributes = {};
      Object.entries(samlResponse.user.attributes).forEach(([key, value]) => {
        [userAttributes[key]] = value;
      });

      // Find or create the user attached to this SAML response
      User.findOrCreate({
        where: {
          eduPersonPrincipalName: userAttributes.eduPersonPrincipalName,
        },
        defaults: userAttributes,
      }).spread(user => {
        // Create JWT
        const token = jwt.sign(
          {
            user,
            session: {
              name_id: samlResponse.user.name_id,
              session_index: samlResponse.user.session_index,
            },
          },
          config.jwt.secret,
        );
        res.cookie(config.jwt.cookieName, token, {
          httpOnly: true,
          domain: config.jwt.domain,
        });
        res.redirect(config.defaultLoginRedirect);
      });
    });
  },
  reflector(req, res) {
    jwt.verify(
      req.cookies[config.jwt.cookieName],
      config.jwt.secret,
      {},
      (err, decoded) => {
        if (err) {
          res
            .status(403)
            .send("Could not validate your authentication details");
        }
        res.send(decoded);
      },
    );
  },
  logout(req, res) {
    jwt.verify(
      req.cookies[config.jwt.cookieName],
      config.jwt.secret,
      {},
      (err, decoded) => {
        if (err) {
          res.redirect(config.defaultLogoutRedirect);
        }

        res.cookie(config.jwt.cookieName, "", { expires: new Date() });

        sp.create_logout_request_url(
          idp,
          decoded.session,
          (error, logoutUrl) => {
            if (error !== null) {
              return res.sendStatus(500);
            }
            return res.redirect(logoutUrl);
          },
        );
      },
    );
  },
};
