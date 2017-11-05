jest.mock("../../utils/ldap");

import Ad from "../Ad"; // eslint-disable-line

describe("The AdClient -> constructor", () => {
  test("should create a local Ldap instance with the right config values", () => {
    expect(Ad.client.wasItDone).toBe(true);
  });
});

describe("The AdClient -> searchByUsername", () => {
  test("should be able to search for a username and catch errors", () => {
    Ad.client.searchFirst.mockReturnValueOnce(null);

    expect(Ad.searchByUsername("some_user")).resolves.toBe(null);
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

describe("The AdClient -> findAccounts", () => {
  test("should be able to search for accounts and handle an empty result", () => {
    Ad.client.search.mockReturnValueOnce(null);
    expect(Ad.findAccounts("bla")).resolves.toBe(null);
  });

  test("should be able to handle a response object", () => {
    Ad.client.search.mockReturnValueOnce([{ sAMAccountName: "uqbob" }]);
    expect(Ad.findAccounts("bla")).resolves.toEqual([{ username: "uqbob" }]);
  });
});
