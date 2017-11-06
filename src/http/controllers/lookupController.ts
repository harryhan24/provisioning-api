import LookupService from "../../services/LookupService";
import logger from "../../utils/logger";
import { Request, Response } from "express";

export default {
  async username(req: Request, res: Response) {
    logger.debug(`[LookupController] Username lookup request by ${res.locals.apiUser.name} for username: "${req.params.username}"`);
    const userDetails = await LookupService.byAccountName(req.params.username);
    if (userDetails === null) {
      return res.status(404).json({
        statusCode: 404,
        message: "Could not find user with those details",
      });
    }

    return res.json(userDetails);
  },
  async staffSearch(req: Request, res: Response) {
    logger.debug(`[LookupController] Staffsearch request by ${res.locals.apiUser.name} for string: "${req.params.searchString}"`);
    const { searchString } = req.params;
    if (searchString === undefined || searchString.trim().length < 3) {
      return res.status(400).json({
        statusCode: 400,
        message: "You must provide a search parameter of at least 3 characters",
      });
    }

    const result = await LookupService.staffSearch(searchString.trim());
    return res.json(result);
  },
};
