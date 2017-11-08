import JobInterface from "./JobInterface";
import NewDummyAllocationJob from "./Jobs/NewDummyAllocationJob";

import { TYPE_NEW_ALLOCATION_DUMMY } from "./types";

export default class JobFactory {
  static getJobInstance(type: string): JobInterface {
    switch (type) {
      case TYPE_NEW_ALLOCATION_DUMMY:
        return new NewDummyAllocationJob();
      default:
        throw new Error(`Could not find job instance for type ${type}`);
    }
  }
}
