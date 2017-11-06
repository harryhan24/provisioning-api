"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../database/models");
// Middleware for api auth
exports.default = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if (req.originalUrl.startsWith("/sp/")) {
        next();
    }
    else {
        // Check if we have received an authorization header
        if (req.headers.authorization === undefined || req.headers.authorization.includes("ApiKey") === false) {
            return res.status(403).json({
                statusCode: 403,
                message: "No authorization headers provided",
            });
        }
        // Check if we received a valid Authorization header
        const apiKey = req.headers.authorization.replace("ApiKey ", "").trim();
        if (apiKey === "") {
            return res.status(403).json({
                statusCode: 403,
                message: "No api key was provided",
            });
        }
        try {
            const apiUser = yield models_1.ApiUser.findOne({ where: { apiKey } });
            if (apiUser === null) {
                return res.status(403).json({ statusCode: 403, message: "Invalid api key" });
            }
            res.locals.apiUser = apiUser;
            next();
        }
        catch (e) {
            return res.status(400).send({ statusCode: 400, e });
        }
    }
});
//# sourceMappingURL=apiUserMiddleware.js.map