// @flow
import Ad from "../clients/Ad";
import Ldap from "../clients/Ldap";
import IdpApi from "../clients/IdentityProviderApi";

import logger from "../utils/logger";

export default {
  async byAccountName(accountName: string) {
    logger.log(
      "info",
      `[LookupService::byAccountName] Fetching user details for user "${accountName}"`,
      { tags: "ad, ldap, idpApi" },
    );

    // Get AD result
    const adDetails = await Ad.searchByUsername(accountName);
    if (adDetails === null) {
      return null;
    }

    // auEduPersonSharedToken
    adDetails.auEduPersonSharedToken = await IdpApi().findAafTokenByUsername(
      accountName,
    );

    // Orcid
    adDetails.orcid = await Ldap.getOrcidByUsername(accountName);
    return adDetails;
  },
};
