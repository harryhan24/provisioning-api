import logger from "../../utils/logger";
import LookupService from "../LookupService";
import Ad from "../../clients/Ad";
import Ldap from "../../clients/Ldap";
import IdpApi from "../../clients/IdentityProviderApi";

jest.mock("../../clients/Ad");
jest.mock("../../clients/Ldap");
jest.mock("../../clients/IdentityProviderApi");
jest.mock("../../utils/logger");

describe("The LookupService->byAccountName", () => {
  test("should emit a debug log when it is called", () => {
    LookupService.byAccountName("account_name");
    expect(logger.log).toHaveBeenCalledWith(
      "debug",
      `[LookupService] Fetching user details by account name (account_name)`,
      { tags: "lookupService, byAccountName" },
    );
  });

  test("should return null if the AD service fails", () => {
    Ad.searchByUsername.mockReturnValueOnce(null);
    const result = LookupService.byAccountName("account_name");
    expect(result).resolves.toBe(null);
  });

  test("should return a good successful result", done => {
    Ad.searchByUsername.mockReturnValueOnce({ username: "uqbob" });
    IdpApi.findAafTokenByUsername.mockReturnValueOnce("aaf_abc");
    Ldap.getOrcidByUsername.mockReturnValueOnce("orcid_123");

    LookupService.byAccountName("account_name").then(r => {
      expect(r.username).toBe("uqbob");
      expect(r.orcid).toBe("orcid_123");
      expect(r.auEduPersonSharedToken).toBe("aaf_abc");
      done();
    });
  });
});

describe("The LookupService -> staffSearch", () => {
  test("should emit a debug log when it is called", () => {
    LookupService.staffSearch("account_name");
    expect(logger.log).toHaveBeenCalledWith(
      "debug",
      `[LookupService] Search staff with string (account_name)`,
      { tags: "lookupService, staffSearch" },
    );
  });

  test("should pass on whatever the Ad client returns", () => {
    Ad.findAccounts.mockReturnValueOnce({ username: "bob" });
    expect(LookupService.staffSearch("bob")).resolves.toEqual({
      username: "bob",
    });
  });
});
