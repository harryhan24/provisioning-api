// @flow
import type { $Request } from "express";
import type { $Response } from "../../types/express";
import logger from "../../utils/logger";
import ProjectService from "../../services/ProjectService";

export default {
  async getProject(req: $Request, res: $Response) {
    logger.log(
      "debug",
      `[ProjectController] Project GET request by ${res.locals.apiUser
        .name} for project with UUID: "${req.params.projectUuid}"`,
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
};
