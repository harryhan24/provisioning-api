import { ApiUser } from "../../database/models";

// Middleware for api auth
export default async (req, res, next: () => void) => {
  if (req.originalUrl.startsWith("/sp/") || req.originalUrl.startsWith("/dev")) {
    next();
  } else {
    // Check if we have received an authorization header
    if (req.headers.authorization === undefined || req.headers.authorization.includes("ApiKey") === false) {
      return res.status(403).json({
        statusCode: 403,
        message: "No authorization headers provided",
      });
    }

    // Check if we received a valid Authorization header
    const apiKey = req.headers.authorization.replace("ApiKey ", "").trim();
    if (apiKey === "") {
      return res.status(403).json({
        statusCode: 403,
        message: "No api key was provided",
      });
    }

    try {
      const apiUser = await ApiUser.findOne<ApiUser>({ where: { apiKey } });

      if (apiUser === null) {
        return res.status(403).json({ statusCode: 403, message: "Invalid api key" });
      }

      res.locals.apiUser = apiUser;
      next();
    } catch (e) {
      return res.status(400).send({ statusCode: 400, e });
    }
  }
};
