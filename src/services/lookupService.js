// @flow
import Ad from "../clients/Ad";
import Ldap from "../clients/Ldap";
import IdpApi from "../clients/IdentityProviderApi";

export default {
  async byAccountName(accountName: string) {
    // Get AD result
    const adDetails = await Ad.searchByUsername(accountName);
    if (adDetails === null) {
      return null;
    }

    // auEduPersonSharedToken
    const idpApi = IdpApi();
    adDetails.auEduPersonSharedToken = await idpApi.findAafTokenByUsername(
      accountName,
    );

    adDetails.orcid = await Ldap.getOrcidByUsername(accountName);

    // Orcid
    return adDetails;
  },
};
