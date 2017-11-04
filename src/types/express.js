// @flow
import type { $Response as expressResponse } from "express";

export type $Response = expressResponse & {
  locals: {
    apiUser: { id: number, name: string, description: string },
  },
};
