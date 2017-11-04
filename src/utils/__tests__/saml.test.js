import saml2 from "saml2-js";
import config from "../../config";

jest.unmock("../saml");

jest.mock("saml2-js");

saml2.ServiceProvider = jest.fn(() => {});
saml2.IdentityProvider = jest.fn(() => {});

describe("The service provider", () => {
  test("should be created with the proper config options", () => {
    const sp = require("../saml").sp;
    expect(saml2.ServiceProvider).toHaveBeenCalledWith(config.saml.sp);
  });
});

describe("The identity provider", () => {
  test("should be created with the proper config options", () => {
    const idp = require("../saml").idp;
    expect(saml2.IdentityProvider).toHaveBeenCalledWith(config.saml.idp);
  });
});
