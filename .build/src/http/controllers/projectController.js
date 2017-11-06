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
const logger_1 = require("../../utils/logger");
const ProjectService_1 = require("../../services/ProjectService");
const validation_1 = require("../../utils/validation");
exports.default = {
    getProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(`[ProjectController] Project GET request by ${res.locals.apiUser.name} for project with UUID: "${req.params.projectUuid}"`);
            const project = yield ProjectService_1.default.getSingle(req.params.projectUuid);
            if (project === null) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Could not find project with the given UUID",
                });
            }
            if (project.apiUserId !== res.locals.apiUser.id) {
                return res.status(403).json({
                    statusCode: 403,
                    message: "You do not have access to this resource",
                });
            }
            return res.json(project);
        });
    },
    getProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(`[ProjectController] Projects GET request by ${res.locals.apiUser.name}`);
            try {
                const projects = yield ProjectService_1.default.getByApiUser(res.locals.apiUser.id);
                return res.json(projects);
            }
            catch (e) {
                logger_1.default.error(`[ProjectController] Projects GET request by Test user failed with error: ${e.message}`);
                return res.status(500).json({
                    statusCode: 500,
                    message: "Whoops! Something horrible went wrong. Please try again later.",
                });
            }
        });
    },
    postProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(`[ProjectController] Projects POST requested by ${res.locals.apiUser.name}`);
            if (!validation_1.isValidShortCode(req.body.shortCode)) {
                return res.status(400).json({ statusCode: 400, message: "Provided short code was invalid" });
            }
            const shortCode = req.body.shortCode.toUpperCase();
            const hasHpc = req.body.hasHpcRequirement || false;
            const hasHumanData = req.body.hasHumanData || false;
            const hasHumanIdentifiableData = req.body.hasHumanIdentifiableData || false;
            try {
                const project = yield ProjectService_1.default.createProject(res.locals.apiUser.id, shortCode, hasHpc, hasHumanData, hasHumanIdentifiableData);
                return res.json(project);
            }
            catch (e) {
                return res.status(500).json({ statusCode: 500, message: e.message });
            }
        });
    },
};
//# sourceMappingURL=projectController.js.map