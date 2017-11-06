declare var jest, describe, test, expect;

import { Allocation, Project } from "../../database/models";
import AllocationService from "../AllocationService";

describe("The AllocationService -> createAllocation function", () => {
  test("should create an allocation with the given parameters", () => {
    const project = { id: 1, hasHumanData: false, hasHumanIdentifiableData: false, hasHpcRequirement: true };
    Allocation.create.mockReturnValue(project);

    expect(AllocationService.createAllocation(project, "dummy")).resolves.toEqual(project);
  });
});
