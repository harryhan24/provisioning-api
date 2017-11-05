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
