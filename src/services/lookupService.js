// @flow
import Ad from "../clients/Ad";
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

    // Orcid
    return adDetails;
  },
};
