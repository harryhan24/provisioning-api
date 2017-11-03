// @flow
import type { $Request, $Response } from "express";
import { ApiUser } from "../../database/models";

// Middleware for api auth
export default async (req: $Request, res: $Response, next: () => void) => {
  if (req.originalUrl.startsWith("/sp/")) {
    next();
  } else {
    // Do a check on the API user

    const apiKey = req.headers.authorization.replace("ApiKey ", "").trim();
    if (apiKey === "") {
      return res.status(403).json({
        status: 403,
        message: "No api key was provided",
      });
    }

    try {
      const apiUser = await ApiUser.findOne({ where: { apiKey } });

      if (apiUser === null) {
        return res
          .status(403)
          .json({ status: 403, message: "Invalid api key" });
      }

      res.locals.apiUser = apiUser;
      next();
    } catch (e) {
      return res.status(400).send(e);
    }
  }
};
