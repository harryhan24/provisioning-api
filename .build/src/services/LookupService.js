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
// @flow
const Ad_1 = require("../clients/Ad");
const Ldap_1 = require("../clients/Ldap");
const IdentityProviderApi_1 = require("../clients/IdentityProviderApi");
const logger_1 = require("../utils/logger");
class LookupService {
    static byAccountName(accountName) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(`[LookupService] Fetching user details by account name (${accountName})`, { tags: "lookupService, byAccountName" });
            const adDetails = yield Ad_1.default.searchByUsername(accountName);
            if (adDetails === null) {
                return null;
            }
            const auEduPersonSharedToken = yield IdentityProviderApi_1.default.findAafTokenByUsername(accountName);
            const orcid = yield Ldap_1.default.getOrcidByUsername(accountName);
            return Object.assign({}, adDetails, { orcid, auEduPersonSharedToken });
        });
    }
    static staffSearch(searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(`[LookupService] Search staff with string (${searchString})`, { tags: "lookupService, staffSearch" });
            const result = yield Ad_1.default.findAccounts(searchString);
            return result;
        });
    }
}
exports.default = LookupService;
//# sourceMappingURL=LookupService.js.map