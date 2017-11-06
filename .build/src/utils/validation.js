"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidShortCode = (shortCode) => typeof shortCode === "string" && /^([a-zA-Z0-9]{6,10})$/.test(shortCode);
//# sourceMappingURL=validation.js.map