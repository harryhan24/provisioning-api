import JobFactory from "../JobFactory";
import NewDummyAllocationJob from "../Jobs/NewDummyAllocationJob";
import { TYPE_NEW_ALLOCATION_DUMMY } from "../types";

describe("The JobFactory -> getJobInstance function", () => {
  test("should throw an error if the type is unknown", () => {
    expect(() => JobFactory.getJobInstance("some_unknown_type")).toThrow("Could not find job instance for type some_unknown_type");
  });

  test("should handle the " + TYPE_NEW_ALLOCATION_DUMMY + " type", () => {
    expect(JobFactory.getJobInstance(TYPE_NEW_ALLOCATION_DUMMY)).toBeInstanceOf(NewDummyAllocationJob);
  });
});
