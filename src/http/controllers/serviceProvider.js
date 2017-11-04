// @flow
import type { $Request, $Response } from "express";

import jwt from "../../utils/jwt";
import { User } from "../../database/models";
import { sp, idp } from "../../utils/saml";
import config from "../../config";

const formatSamlValue = (val: any): string => val[0];

export default {
  metadata(req: $Request, res: $Response) {
    res.type("application/xml");
    res.send(sp.create_metadata());
  },
  login(req: $Request, res: $Response) {
    sp.create_login_request_url(idp, {}, (err, loginUrl) => {
      if (err !== null) return res.sendStatus(500);
      return res.redirect(loginUrl);
    });
  },
  assert(req: $Request, res: $Response) {
    const options = { request_body: req.body };
    sp.post_assert(idp, options, (err, samlResponse) => {
      if (err !== null) return res.sendStatus(500);

      // Get user attributes from SAML response
      const userAttributes = {};
      Object.entries(
        samlResponse.user.attributes,
      ).forEach(([key: string, value: Array<any>]) => {
        userAttributes[key] = formatSamlValue(value);
      });

      // Find or create the user attached to this SAML response
      return User.findOrCreate({
        where: {
          eduPersonPrincipalName: userAttributes.eduPersonPrincipalName,
        },
        defaults: userAttributes,
      }).spread(user => {
        // Create JWT
        const token = jwt.sign(user, {
          name_id: samlResponse.user.name_id,
          session_index: samlResponse.user.session_index,
        });

        // Add to cookie
        res.cookie(config.jwt.cookieName, token, {
          httpOnly: true,
          domain: config.jwt.domain,
        });

        // Redirect user
        res.redirect(config.defaultLoginRedirect);
      });
    });
  },
  reflector(req: $Request, res: $Response) {
    try {
      const decoded = jwt.verify(req.cookies[config.jwt.cookieName]);
      return res.json(decoded);
    } catch (e) {
      return res.status(403).send({ statusCode: 403, message: e.message });
    }
  },
  refresh(req: $Request, res: $Response) {
    try {
      const token = jwt.refresh(req.cookies[config.jwt.cookieName]);
      res.json({ token });
    } catch (e) {
      res.status(400).send({ statusCode: 400, message: e.message });
    }
  },
  logout(req: $Request, res: $Response) {
    try {
      const decoded = jwt.verify(req.cookies[config.jwt.cookieName]);
      res.cookie(config.jwt.cookieName, "", { expires: new Date() });

      sp.create_logout_request_url(idp, decoded.session, (error, logoutUrl) => {
        if (error !== null) {
          return res.redirect(config.defaultLogoutRedirect);
        }
        return res.redirect(logoutUrl);
      });
    } catch (e) {
      res.redirect(config.defaultLogoutRedirect);
    }
  },
};
