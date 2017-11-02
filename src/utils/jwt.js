// @flow

import jwt from "jsonwebtoken";
import config from "../config";

export default {
  sign(user: {}, session: {| name_id: string, session_index: string |}) {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        user,
        session,
      },
      config.jwt.secret,
    );
  },
  verify(token: string) {
    return jwt.verify(token, config.jwt.secret);
  },
  refresh(token: string) {
    try {
      const decoded = this.verify(token);
      return this.sign(decoded.user, decoded.session);
    } catch (e) {
      throw e;
    }
  },
};
