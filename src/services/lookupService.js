// @flow
import Ad from "../clients/Ad";
import Ldap from "../clients/Ldap";
import IdpApi from "../clients/IdentityProviderApi";

import logger from "../utils/logger";

export default class LookupService {
  static async byAccountName(accountName: string) {
    logger.log(
      "debug",
      `[LookupService] Fetching user details by account name (${accountName})`,
      { tags: "lookupService, byAccountName" },
    );

    const adDetails = await Ad.searchByUsername(accountName);
    if (adDetails === null) {
      return null;
    }

    const auEduPersonSharedToken = await IdpApi.findAafTokenByUsername(
      accountName,
    );
    const orcid = await Ldap.getOrcidByUsername(accountName);

    return { ...adDetails, orcid, auEduPersonSharedToken };
  }

  static async staffSearch(searchString: string) {
    logger.log(
      "debug",
      `[LookupService] Search staff with string (${searchString})`,
      { tags: "lookupService, staffSearch" },
    );

    const result = await Ad.findAccounts(searchString);
    return result;
  }
}
