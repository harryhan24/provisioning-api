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
const ldap = require("ldapjs");
const logger_1 = require("./logger");
/**
 * A wrapper around the "ldapjs" object to make it easier to use
 */
class Ldap {
    constructor(url, baseDn, user, password) {
        this.client = ldap.createClient({ url });
        this.bound = false;
        this.baseDn = baseDn;
        this.user = user;
        this.password = password;
    }
    bind() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bound) {
                yield new Promise(resolve => {
                    this.client.bind(this.user, this.password, () => {
                        resolve();
                        this.bound = true;
                    });
                });
            }
            return true;
        });
    }
    search(filter, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bind();
            // Setup options
            const options = {
                scope: "sub",
                filter,
                attributes,
            };
            const results = [];
            return new Promise((resolve, reject) => {
                this.client.search(this.baseDn, options, (error, res) => {
                    if (error) {
                        reject(new Error(`Search failed with message: ${error.message}`));
                    }
                    res
                        .on("searchEntry", entry => results.push(Ldap.cleanLdapEntry(entry.object)))
                        .on("error", resError => reject(new Error(`Search error: ${resError}`)))
                        .on("end", () => resolve(results));
                });
            });
        });
    }
    searchFirst(filter, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.search(filter, attributes);
                return results instanceof Array && results.length > 0 ? results[0] : null;
            }
            catch (e) {
                logger_1.default.log("error", `[Ldap] Search failed with error: ${e.message}`);
                return null;
            }
        });
    }
}
Ldap.cleanLdapEntry = (o) => {
    if (o instanceof Array)
        return o.map(Ldap.cleanLdapEntry);
    const attributes = {};
    Object.entries(o)
        .filter(([key]) => key !== "controls")
        .forEach(([key, value]) => {
        let parsedValue = value;
        if (value === "true")
            parsedValue = true;
        if (value === "false")
            parsedValue = false;
        if (/^(-|\+)?\d+$/.test(value))
            parsedValue = parseInt(value, 10);
        attributes[key] = parsedValue;
    });
    return attributes;
};
exports.default = Ldap;
//# sourceMappingURL=ldap.js.map