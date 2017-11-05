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

describe("The LookupControler -> staffSearch route", () => {
  test("should return a 400 if the request is invalid", done => {
    request(app)
      .get("/lookups/staff-search/uq")
      .expect(400)
      .then(res => {
        expect(res.body.message).toBe(
          "You must provide a search parameter of at least 3 characters",
        );
        done();
      });
  });

  test("should work properly as well!", done => {
    LookupService.staffSearch.mockReturnValueOnce([{ a: "b" }, { c: "d" }]);
    request(app)
      .get("/lookups/staff-search/uqstaff")
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([{ a: "b" }, { c: "d" }]);
        expect(LookupService.staffSearch).toHaveBeenCalledWith("uqstaff");
        done();
      });
  });
});
