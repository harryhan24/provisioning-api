import { successResponse, errorResponse } from "../utils";

import { User } from "../models";

export const get = (event, context, callback) => {
  User.all()
    .then(users => callback(null, successResponse(users)))
    .catch(error => callback(null, errorResponse(error)));
};

export const post = (event, context, callback) => {
  const response = successResponse(JSON.parse(event.body));
  callback(null, response);
};
