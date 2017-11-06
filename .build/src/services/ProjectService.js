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
const models_1 = require("../database/models");
const logger_1 = require("../utils/logger");
class ProjectService {
    static getSingle(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield models_1.Project.findOne({ where: { uuid } });
            return project;
        });
    }
    static getByApiUser(apiUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Project.findAll({ where: { apiUserId } });
        });
    }
    // TODO: This is a STUB
    static determineAllocation(project) {
        return "dummy";
    }
    static createProject(apiUserId, shortCode, hasHpcRequirement, hasHumanData, hasHumanIdentifiableData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.silly(`[ProjectService] Creating project with shortCode ${shortCode}`);
                const project = yield models_1.Project.create({
                    apiUserId,
                    shortCode,
                    hasHpcRequirement,
                    hasHumanData,
                    hasHumanIdentifiableData,
                });
                const allocation = ProjectService.determineAllocation(project);
                return project;
            }
            catch (e) {
                logger_1.default.error(`[ProjectService] Failed creating project with error: ${e.message}`, { tags: "ProjectService,createProject" });
                throw new Error("Could not save project. Please try again later.");
            }
        });
    }
}
exports.default = ProjectService;
//# sourceMappingURL=ProjectService.js.map