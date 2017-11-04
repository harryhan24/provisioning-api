import IdpApi from "../IdentityProviderApi";
import config from "../../config";
import logger from "../../utils/logger";

jest.mock("../../utils/Fetch");
jest.mock("../../utils/logger");

describe("The IdentityProviderApi", () => {
  test("should setup the Fetch client with the proper base URI", () => {
    expect(IdpApi.client.baseUri).toBe(config.idpApi.baseUri);
    expect(IdpApi.client.headers).toEqual({});
  });

  test("should be able to search for an AAF token and catch errors", done => {
    IdpApi.client.get.mockImplementationOnce(
      () => new Promise((resolve, reject) => reject(new Error("a"))),
    );

    IdpApi.findAafTokenByUsername("some_user").then(result => {
      expect(result).toEqual(null);
      expect(logger.log).toHaveBeenCalledWith(
        "error",
        `Could not get complete "auEduPersonSharedToken" lookup: a`,
      );
      done();
    });
  });

  test("should be able to search for an AAF token", done => {
    IdpApi.client.get.mockReturnValueOnce({
      auEduPersonSharedToken: "some_token",
    });

    IdpApi.findAafTokenByUsername("some_user").then(result => {
      expect(result).toEqual("some_token");
      done();
    });
  });
});
