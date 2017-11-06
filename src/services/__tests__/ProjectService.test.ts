declare var jest, describe, test, expect;

import { Project } from "../../database/models";
import AllocationService from "../AllocationService";
import ProjectService from "../ProjectService";
import logger from "../../utils/logger";

jest.mock("../AllocationService");

describe("The ProjectService -> getSingle function", () => {
  test("should search for the project by the given UUID", () => {
    Project.findOne.mockReturnValueOnce("a_project");
    const result = ProjectService.getSingle("some_uuid");
    expect(Project.findOne).toHaveBeenCalledWith({
      where: { uuid: "some_uuid" },
    });
    expect(result).resolves.toBe("a_project");
  });
});

describe("The ProjectService -> getByApiUser function", () => {
  test("should pipe the apiUserId to the where clause", () => {
    Project.findAll.mockReturnValueOnce("some_return");
    const p = ProjectService.getByApiUser(1);
    expect(p).resolves.toBe("some_return");
    expect(Project.findAll).toHaveBeenCalledWith({ where: { apiUserId: 1 } });
  });
});

describe("The ProjectService -> determineAllocation function", () => {
  test("should determine the allocation based on the provided metadata", () => {
    expect(ProjectService.determineAllocation()).toBe("dummy");
  });
});

describe("The ProjectService -> createProject function", () => {
  test("should handle errors semi gracefully", () => {
    Project.create.mockImplementationOnce(() => {
      throw new Error("some_dangerous_error");
    });

    expect(ProjectService.createProject("a")).rejects.toEqual(new Error("Could not save project. Please try again later."));
    expect(logger.error).toHaveBeenCalledWith(`[ProjectService] Failed creating project with error: some_dangerous_error`, {
      tags: "ProjectService,createProject",
    });
  });

  test("should create a new project and a new allocation with the given information", done => {
    Project.create.mockReturnValueOnce(Project._single());
    AllocationService.createAllocation.mockReturnValueOnce("does_not_matter");
    ProjectService.createProject(1, "A", false, true, false).then(() => {
      expect(AllocationService.createAllocation).toHaveBeenCalled();
      expect(Project.reload).toHaveBeenCalled();
      done();
    });
  });
});
