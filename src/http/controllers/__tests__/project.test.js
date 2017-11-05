import request from "supertest";

import ProjectService from "../../../services/ProjectService";
import { app } from "../../../index";
import logger from "../../../utils/logger";

jest.mock("../../../services/ProjectService");

describe("The ProjectController -> getSingle route", () => {
  test("should emit a debug log when called", () => {
    ProjectService.getSingle.mockReturnValueOnce(null);
    request(app)
      .get("/projects/some_uuid")
      .then(() => {
        expect(logger.log).toHaveBeenCalledWith(
          "debug",
          `[ProjectController] Project GET request by Test user for project with UUID: "some_uuid"`,
        );
      });
  });

  test("should return 404 when the project cannot be found", done => {
    ProjectService.getSingle.mockReturnValueOnce(null);
    request(app)
      .get("/projects/some_uuid")
      .expect(404)
      .then(res => {
        expect(ProjectService.getSingle).toHaveBeenCalledWith("some_uuid");
        expect(res.body.message).toBe(
          "Could not find project with the given UUID",
        );
        done();
      });
  });

  test("should return 403 if the API user does not have access to this project", done => {
    ProjectService.getSingle.mockReturnValueOnce({ apiUserId: 2 });
    request(app)
      .get("/projects/some_uuid")
      .expect(403)
      .then(res => {
        expect(ProjectService.getSingle).toHaveBeenCalledWith("some_uuid");
        expect(res.body.message).toBe(
          "You do not have access to this resource",
        );
        done();
      });
  });

  test("should work properly as well!", done => {
    ProjectService.getSingle.mockReturnValueOnce({
      apiUserId: 1,
      shortCode: "AAAAAAAA",
    });
    request(app)
      .get("/projects/some_uuid")
      .expect(200)
      .then(res => {
        expect(res.body.shortCode).toBe("AAAAAAAA");
        done();
      });
  });
});

describe("The ProjectController -> getProjects route", () => {
  test("should emit a debug log when called", done => {
    ProjectService.getByApiUser.mockReturnValueOnce(null);
    request(app)
      .get("/projects")
      .then(() => {
        expect(logger.log).toHaveBeenCalledWith(
          "debug",
          `[ProjectController] Projects GET request by Test user`,
        );
        done();
      });
  });

  test("should handle an error when it pops up", done => {
    ProjectService.getByApiUser.mockImplementationOnce(() => {
      throw new Error("some_error");
    });
    request(app)
      .get("/projects")
      .expect(500)
      .then(res => {
        expect(logger.log).toHaveBeenCalledWith(
          "error",
          `[ProjectController] Projects GET request by Test user failed with error: some_error`,
        );
        expect(res.body.message).toBe(
          "Whoops! Something horrible went wrong. Please try again later.",
        );
        done();
      });
  });
});
