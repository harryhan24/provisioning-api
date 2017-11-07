import JobFactory from "../JobFactory";
import NewAllocationJob from "../Jobs/NewAllocationJob";
import { JOB_TYPE_NEW_ALLOCATION } from "../types";

describe("The JobFactory -> getJobInstance function", () => {
  test("should throw an error if the type is unknown", () => {
    expect(() => JobFactory.getJobInstance("some_unknown_type")).toThrow("Could not find job instance for type some_unknown_type");
  });

  test("should handle the " + JOB_TYPE_NEW_ALLOCATION + " type", () => {
    expect(JobFactory.getJobInstance(JOB_TYPE_NEW_ALLOCATION)).toBeInstanceOf(NewAllocationJob);
  });
});
