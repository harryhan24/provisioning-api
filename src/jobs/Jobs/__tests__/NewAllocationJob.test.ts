import NewAllocationJob from "../NewAllocationJob";

describe("The NewAllocationJob", () => {
  test("should return true!", () => {
    const job = new NewAllocationJob();
    expect(job.process({ username: "a" })).resolves.toBe(true);
  });
});
