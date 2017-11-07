import JobInterface from "./JobInterface";
import NewAllocationJob from "./Jobs/NewAllocationJob";

import { JOB_TYPE_NEW_ALLOCATION } from "./types";

export default class JobFactory {
  static getJobInstance(type: string): JobInterface {
    switch (type) {
      case JOB_TYPE_NEW_ALLOCATION:
        return new NewAllocationJob();
      default:
        throw new Error(`Could not find job instance for type ${type}`);
    }
  }
}
