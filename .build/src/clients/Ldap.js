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
const ldap_1 = require("../utils/ldap");
const config_1 = require("../config");
class LdapClient {
    constructor() {
        this.client = new ldap_1.default(config_1.default.ldap.url, config_1.default.ldap.base, config_1.default.ldap.dn, config_1.default.ldap.password);
    }
    getOrcidByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const attributes = ["orcid"];
            const filter = `(uid=${username})`;
            const fields = yield this.client.searchFirst(filter, attributes);
            return fields && fields.orcid ? fields.orcid : null;
        });
    }
}
exports.default = new LdapClient();
//# sourceMappingURL=Ldap.js.map