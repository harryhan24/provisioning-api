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
class Fetch {
    constructor(baseUri, headers = {}) {
        this.baseUri = baseUri;
        this.headers = headers;
    }
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = this.baseUri + path;
            try {
                const response = yield fetch(uri);
                return yield response.json();
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = Fetch;
//# sourceMappingURL=Fetch.js.map