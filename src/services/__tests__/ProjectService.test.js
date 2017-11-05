import { Project } from "../../database/models";
import ProjectService from "../ProjectService";

jest.mock("../../database/models");

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
