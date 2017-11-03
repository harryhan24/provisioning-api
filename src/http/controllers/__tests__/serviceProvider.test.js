import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../../index";
import config from "../../../config";

// Mocked local dependencies
import { sp, idp } from "../../../utils/saml";
import { User } from "../../../database/models";

jest.mock("../../../utils/saml");
jest.mock("../../../database/models");

describe("The metadata route", () => {
  test("should return the metadata of the SP", () =>
    request(app)
      .get("/sp/metadata.xml")
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
      .get("/sp/login")
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
      .get("/sp/login")
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
      .post("/sp/assert")
      .expect(500)
      .then(() => {
        expect(sp.post_assert).toHaveBeenCalled();
      });
  });

  test("Should find or create a user on a successful request and return a JWT", () => {
    sp.post_assert = originalPostAssert;
    return request(app)
      .post("/sp/assert")
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
      .get("/sp/reflector")
      .expect(403));

  test("should show the JWT details if the JWT is valid", () => {
    const jwtCookie = jwt.sign({ username: "bob" }, config.jwt.secret);
    return request(app)
      .get("/sp/reflector")
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
      .get("/sp/logout")
      .expect(302)
      .then(res => {
        expect(res.header["set-cookie"]).toBeUndefined();
        expect(res.header.location).toContain("logout.redirect.com");
      }));

  test("should redirect the user if given a valid JWT and destroy the cookie", () => {
    const jwtCookie = jwt.sign({ username: "bob" }, config.jwt.secret);
    return request(app)
      .get("/sp/logout")
      .set("Cookie", [`${config.jwt.cookieName}=${jwtCookie}`])
      .expect(302)
      .then(res => {
        expect(res.header.location).toContain("logout.sso.url");
        expect(res.header["set-cookie"][0]).toContain("TEST_COOKIE_NAME=");
      });
  });

  test("should redirect to the default logout URL if the SP could not create the logout request url", () => {
    const jwtCookie = jwt.sign({ username: "bob" }, config.jwt.secret);
    sp.create_logout_request_url = jest.fn((someIdp, data, callback) => {
      callback("ERROR", "should.not.be.used.com");
    });

    return request(app)
      .get("/sp/logout")
      .set("Cookie", [`${config.jwt.cookieName}=${jwtCookie}`])
      .expect(302)
      .then(res => {
        expect(res.header.location).toContain("logout.redirect.com");
      });
  });
});

describe("The refresh route", () => {
  test("should return a 400 error if the JWT could not be validated", () =>
    request(app)
      .get("/sp/refresh")
      .expect(400)
      .then(res => {
        expect(res.body.message).toBe("jwt must be provided");
      }));

  test("should successfully refresh the token", () => {
    const jwtCookie = jwt.sign({ username: "bob" }, config.jwt.secret);
    request(app)
      .get("/sp/refresh")
      .set("Cookie", [`${config.jwt.cookieName}=${jwtCookie}`])
      .expect(200)
      .then(res => {
        expect(res.body.token.length).toBeGreaterThan(10);
      });
  });
});
