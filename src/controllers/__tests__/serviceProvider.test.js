import request from "supertest";

import { app } from "../../index";

// Mocked local dependencies
import { sp, idp } from "../../utils/saml";

jest.mock("../../utils/saml");
jest.mock("../../models");

describe("Test the root path", () => {
  test("It should response the GET method", () =>
    request(app)
      .get("/")
      .expect(200));
});

describe("Test login route", () => {
  test("Should redirect the user to the IDP", () => {
    sp.create_login_request_url = jest.fn((someIdp, data, callback) => {
      callback(null, "login.redirect.com");
    });

    return request(app)
      .get("/login")
      .expect(302)
      .then(response => {
        expect(response.header.location).toContain("login.redirect.com");
        expect();
      });
  });

  test("Should show a 500 if saml could not process the request", () => {
    sp.create_login_request_url = jest.fn((someIdp, data, callback) => {
      callback("ERROR", "login.redirect.com");
    });
    return request(app)
      .get("/login")
      .expect(500);
  });
});

const originalPostAssert = sp.post_assert;

describe("Test assertion route", () => {
  test("Should show a 500 if saml could not process the request", () => {
    sp.post_assert = jest.fn((someIdp, options, callback) => {
      callback("ERROR", null);
    });

    return request(app)
      .post("/assert")
      .expect(500)
      .then(() => {
        expect(sp.post_assert).toHaveBeenCalled();
      });
  });

  test("Should find or create a user on a successful request", () => {
    sp.post_assert = originalPostAssert;
    return request(app)
      .post("/assert")
      .expect(302)
      .then(res => {
        expect(res.header["set-cookie"][0]).toContain("TEST_COOKIE_NAME=");
        expect(res.header.location).toContain("login.redirect.com");
      });
  });
});
