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
const config_1 = require("../config");
const Fetch_1 = require("../utils/Fetch");
const logger_1 = require("../utils/logger");
class IdentityProviderApi {
    constructor() {
        this.client = new Fetch_1.default(config_1.default.idpApi.baseUri, {});
    }
    tokenLookup(token) {
        return this.client.get(`token/${token}`);
    }
    findAafTokenByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield this.tokenLookup(username);
                return userDetails.auEduPersonSharedToken;
            }
            catch (e) {
                logger_1.default.log("error", `Could not get complete "auEduPersonSharedToken" lookup: ${e.message}`);
                return null;
            }
        });
    }
}
exports.default = new IdentityProviderApi();
//# sourceMappingURL=IdentityProviderApi.js.map