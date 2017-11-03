// @flow
import type { $Request, $Response } from "express";
import Ad from "../../clients/Ad";

export default {
  async testLdap(req: $Request, res: $Response) {
    // Get AD result
    const adDetails = await Ad.searchByUsername("uqstaff");
    if (adDetails === null) {
      res
        .status(404)
        .json({
          statusCode: 404,
          message: "Could not find a user with the given username",
        });
    }

    res.json(adDetails);
  },
};
