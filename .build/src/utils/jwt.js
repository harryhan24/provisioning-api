"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const config_1 = require("../config");
exports.default = {
    sign(user, session) {
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            user,
            session,
        }, config_1.default.jwt.secret);
    },
    verify(token) {
        return jwt.verify(token, config_1.default.jwt.secret);
    },
    refresh(token) {
        try {
            const decoded = this.verify(token);
            return this.sign(decoded.user, decoded.session);
        }
        catch (e) {
            throw e;
        }
    },
};
//# sourceMappingURL=jwt.js.map