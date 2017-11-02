import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../index";
import config from "../../config";

// Mocked local dependencies
import { sp, idp } from "../../utils/saml";
import { User } from "../../models";

jest.mock("../../utils/saml");
jest.mock("../../models");

describe("Test the root path", () => {
  test("It should response the GET method", () =>
    request(app)
      .get("/")
      .expect(200));
});

describe("The metadata route", () => {
  test("should return the metadata of the SP", () =>
    request(app)
      .get("/metadata.xml")
      .accept("application/xml")
      .expect(200)
      .then(res => {
        expect(res.headers["content-type"]).toBe("application/xml");
      }));
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

  test("Should find or create a user on a successful request and return a JWT", () => {
    sp.post_assert = originalPostAssert;
    return request(app)
      .post("/assert")
      .expect(302)
      .then(res => {
        expect(res.header["set-cookie"][0]).toContain("TEST_COOKIE_NAME=");
        expect(res.header.location).toContain("login.redirect.com");
        expect(User.findOrCreate).toHaveBeenCalled();
      });
  });
});

describe("The reflector route", () => {
  test("should redirect to the logout URL if the JWT is invalid", () =>
    request(app)
      .get("/reflector")
      .expect(403));

  test("should show the JWT details if the JWT is valid", () => {
    const jwtCookie = jwt.sign({ username: "bob" }, config.jwt.secret);
    return request(app)
      .get("/reflector")
      .set("Cookie", [`${config.jwt.cookieName}=${jwtCookie}`])
      .expect(200)
      .then(res => {
        expect(res.body.username).toBe("bob");
      });
  });
});

describe("The logout route", () => {
  test("should redirect the user to the logout route if the JWT is invalid", () =>
    request(app)
      .get("/logout")
      .expect(302)
      .then(res => {
        expect(res.header["set-cookie"]).toBeUndefined();
        expect(res.header.location).toContain("logout.redirect.com");
      }));

  test("should redirect the user if given a valid JWT and destroy the cookie", () => {
    const jwtCookie = jwt.sign({ username: "bob" }, config.jwt.secret);
    return request(app)
      .get("/logout")
      .set("Cookie", [`${config.jwt.cookieName}=${jwtCookie}`])
      .expect(302)
      .then(res => {
        expect(res.header.location).toContain("logout.sso.url");
        expect(res.header["set-cookie"][0]).toContain("TEST_COOKIE_NAME=");
      });
  });

  test("should add the 500 response if the SP could not create the logout request url", () => {
    const jwtCookie = jwt.sign({ username: "bob" }, config.jwt.secret);
    sp.create_logout_request_url = jest.fn((someIdp, data, callback) => {
      callback("ERROR", "login.redirect.com");
    });

    return request(app)
      .get("/logout")
      .set("Cookie", [`${config.jwt.cookieName}=${jwtCookie}`])
      .expect(500);
  });
});
