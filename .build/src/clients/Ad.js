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
const attributes = ["sAMAccountName", "mail", "displayName", "givenName", "sn"];
class AdClient {
    constructor() {
        this.client = new ldap_1.default(config_1.default.ad.url, config_1.default.ad.base, config_1.default.ad.dn, config_1.default.ad.password);
    }
    searchByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = `(&(sAMAccountName=${username})(objectClass=user))`;
            const fields = yield this.client.searchFirst(filter, attributes);
            return fields !== null ? AdClient.renameFields(fields) : fields;
        });
    }
    findAccounts(searchToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = `(&(objectClass=user)(|(sAMAccountName=*${searchToken}*)(mail=*${searchToken}*)))`;
            const fields = yield this.client.search(filter, attributes);
            return fields !== null ? fields.map(AdClient.renameFields) : fields;
        });
    }
    static renameFields(fields) {
        return {
            username: fields.sAMAccountName,
            firstName: fields.givenName,
            surname: fields.sn,
            displayName: fields.displayName,
            mail: fields.mail,
        };
    }
}
exports.default = new AdClient();
//# sourceMappingURL=Ad.js.map