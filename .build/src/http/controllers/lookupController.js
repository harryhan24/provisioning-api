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
const LookupService_1 = require("../../services/LookupService");
const logger_1 = require("../../utils/logger");
exports.default = {
    username(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(`[LookupController] Username lookup request by ${res.locals.apiUser.name} for username: "${req.params.username}"`);
            const userDetails = yield LookupService_1.default.byAccountName(req.params.username);
            if (userDetails === null) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Could not find user with those details",
                });
            }
            return res.json(userDetails);
        });
    },
    staffSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(`[LookupController] Staffsearch request by ${res.locals.apiUser.name} for string: "${req.params.searchString}"`);
            const { searchString } = req.params;
            if (searchString === undefined || searchString.trim().length < 3) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "You must provide a search parameter of at least 3 characters",
                });
            }
            const result = yield LookupService_1.default.staffSearch(searchString.trim());
            return res.json(result);
        });
    },
};
//# sourceMappingURL=lookupController.js.map