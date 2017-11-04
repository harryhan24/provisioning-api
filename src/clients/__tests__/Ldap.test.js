import Ldap from "../Ldap";

jest.mock("../../utils/ldap");

describe("The LdapClient", () => {
  test("should create a local Ldap instance with the right config values", () => {
    expect(Ldap.client.wasItDone).toBe(true);
  });

  test("should be able to search for an orcid and catch errors", done => {
    Ldap.client.searchFirst.mockReturnValueOnce(undefined);

    Ldap.getOrcidByUsername("some_user").then(result => {
      expect(result).toBe(null);
      done();
    });
  });

  test("should be able to search for an orcid", done => {
    Ldap.client.searchFirst.mockReturnValueOnce({
      orcid: "some_orcid",
    });
    Ldap.getOrcidByUsername("some_user").then(result => {
      expect(Ldap.client.searchFirst).toHaveBeenCalledWith(`(uid=some_user)`, [
        "orcid",
      ]);

      expect(result).toBe("some_orcid");
      done();
    });
  });
});
