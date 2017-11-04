// @flow
import type { $Request, $Response } from "express";
import LookupService from "../../services/LookupService";

export default {
  async username(req: $Request, res: $Response) {
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
