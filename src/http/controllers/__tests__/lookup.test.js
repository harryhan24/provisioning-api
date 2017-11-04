import request from "supertest";

import LookupService from "../../../services/LookupService";
import { app } from "../../../index";

jest.mock("../../middleware/apiUser");
jest.mock("../../../services/LookupService");

describe("The lookup controller's username route", () => {
  test("should return 404 when the account cannot be found", done => {
    LookupService.byAccountName.mockReturnValueOnce(null);
    request(app)
      .get("/lookups/username/bob")
      .expect(404)
      .then(res => {
        expect(res.body.message).toBe("Could not find user with those details");
        expect(LookupService.byAccountName).toHaveBeenCalledWith("bob");
        done();
      });
  });

  test("should work properly as well!", done => {
    LookupService.byAccountName.mockReturnValueOnce({ username: "bob" });
    request(app)
      .get("/lookups/username/bob")
      .expect(200)
      .then(res => {
        expect(res.body.username).toBe("bob");
        expect(LookupService.byAccountName).toHaveBeenCalledWith("bob");
        done();
      });
  });
});
