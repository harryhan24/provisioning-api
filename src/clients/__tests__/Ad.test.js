jest.mock("../../utils/ldap");

import Ad from "../Ad"; // eslint-disable-line

describe("The AdClient", () => {
  test("should create a local Ldap instance with the right config values", () => {
    expect(Ad.client.wasItDone).toBe(true);
  });

  test("should be able to search for a username and catch errors", done => {
    Ad.client.searchFirst.mockReturnValueOnce(null);

    Ad.searchByUsername("some_user").then(result => {
      expect(result).toBe(null);
      done();
    });
  });

  test("should be able to search for a username", done => {
    Ad.client.searchFirst.mockReturnValueOnce({
      sAMAccountName: "uqbob",
    });
    Ad.searchByUsername("some_user").then(result => {
      expect(
        Ad.client.searchFirst,
      ).toHaveBeenCalledWith(
        `(&(sAMAccountName=some_user)(objectClass=user))`,
        ["sAMAccountName", "mail", "displayName", "givenName", "sn"],
      );

      expect(result.username).toBe("uqbob");
      done();
    });
  });
});
