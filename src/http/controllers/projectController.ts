// @flow
import { Request, Response } from "express";
import logger from "../../utils/logger";
import ProjectService from "../../services/ProjectService";
import { isValidShortCode } from "../../utils/validation";

export default {
  async getProject(req: Request, res: Response) {
    logger.debug(
      `[ProjectController] Project GET request by ${res.locals.apiUser.name} for project with UUID: "${req.params.projectUuid}"`,
    );
    const project = await ProjectService.getSingle(req.params.projectUuid);

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
  },
  async getProjects(req: Request, res: Response) {
    logger.debug(`[ProjectController] Projects GET request by ${res.locals.apiUser.name}`);

    try {
      const projects = await ProjectService.getByApiUser(res.locals.apiUser.id);
      return res.json(projects);
    } catch (e) {
      logger.error(`[ProjectController] Projects GET request by Test user failed with error: ${e.message}`);
      return res.status(500).json({
        statusCode: 500,
        message: "Whoops! Something horrible went wrong. Please try again later.",
      });
    }
  },
  async postProjects(req: Request, res: Response) {
    logger.debug(`[ProjectController] Projects POST requested by ${res.locals.apiUser.name}`);

    if (!isValidShortCode(req.body.shortCode)) {
      return res.status(400).json({ statusCode: 400, message: "Provided short code was invalid" });
    }

    const shortCode = req.body.shortCode.toUpperCase();
    const hasHpc = req.body.hasHpcRequirement || false;
    const hasHumanData = req.body.hasHumanData || false;
    const hasHumanIdentifiableData = req.body.hasHumanIdentifiableData || false;

    try {
      const project = await ProjectService.createProject(res.locals.apiUser.id, shortCode, hasHpc, hasHumanData, hasHumanIdentifiableData);
      return res.json(project);
    } catch (e) {
      return res.status(500).json({ statusCode: 500, message: e.message });
    }
  },
};
