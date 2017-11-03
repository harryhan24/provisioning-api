// @flow
import type { $Request, $Response } from "express";
import LookupService from "../../services/lookupService";

export default {
  async testLdap(req: $Request, res: $Response) {
    // Get AD result
    const userDetails = await LookupService.byAccountName("uqstaff");

    res.json(userDetails);
  },
};
