// @flow
import type { $Request } from "express";
import type { $Response } from "../../types/express";
import LookupService from "../../services/LookupService";
import logger from "../../utils/logger";

export default {
  async username(req: $Request, res: $Response) {
    logger.log(
      "debug",
      `[LookupController] Username lookup request by ${res.locals.apiUser
        .name} for username: "${req.params.username}"`,
    );
    const userDetails = await LookupService.byAccountName(req.params.username);
    if (userDetails === null) {
      return res.status(404).json({
        statusCode: 404,
        message: "Could not find user with those details",
      });
    }

    return res.json(userDetails);
  },
};
